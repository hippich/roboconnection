import {Event} from '../events/Event';
import {ConnectionEvent, DisconnectEvent, MessageEvent} from './IConnection';
const WSWebSocket = require('ws');
const PORT = 8160;

export interface HandshakeMessage {
    type: 'handshake';
    status: 'OK';
    name: string;
}

export interface ConnectionSettings {
    hostname: string;
    port?:number;
    key?:string;
    cert?:string;
    fingerprint?:string;
}

export default class ConnectionManager {
    public connected: Event<ConnectionEvent>;
    public disconnected: Event<DisconnectEvent>;
    public message: Event<MessageEvent>;

    private namedConnections: {[key: string]: WebSocket} | any;

    constructor() {
        // console.log(`ConnectionManager: constructor`);
        this.onConnection = this.onConnection.bind(this);
        this.onClose = this.onClose.bind(this);

        this.namedConnections = {};
        this.connected = new Event('Connected');
        this.disconnected = new Event('Disconnected');
        this.message = new Event('Message Received');
    }

    public connect(robotName:string, options:any):Promise<ConnectionEvent> {
        // console.log(`ConnectionManager: connect:`, robotName, options);
        if (this.isConnected(robotName)) {
            return Promise.resolve({robot:robotName});
        }

        return new Promise((resolve, reject) => {
            this.connected.on(resolve);
            this.startWebSocket({hostname: robotName,...options}, (err:any) => {
                // console.log(`ConnectionManager: connect: error`, err);
                this.connected.off(resolve);
                reject(err);
            });
        });
    }

    public close():void {
        for (let robot in this.namedConnections) {
            this.namedConnections[robot].close();
        }
        this.namedConnections = {};
    }

    public isConnected(name: string):boolean {
        return name in this.namedConnections;
    }

    public sendTo(name: string, command: JIBO.v1.Command):void {
        if (!this.isConnected(name)){
            return;
        }

        //don't care about knowing when the send completes
        this.namedConnections[name].send(JSON.stringify(command));
    }

    // public sendAssetRequestTo(name:string, uri:string, callback:AssetCallback) {
    //     const http = require('http');
    //     http.request({
    //         hostname: name,
    //         port: PORT,
    //         path: uri,
    //     }, callback).end();
    // }

    private startWebSocket(settings:ConnectionSettings, onError?: Function): void {
        // console.log(`ConnectionManager: startWebSocket:`);
        const {hostname} = settings;
        let port = settings.port || PORT;
        let protocol = settings.cert ? 'wss' : 'ws';
        let connectionString: string = `${protocol}://${hostname}:${port}`;
        let options = <any>{};
        if (settings.cert) {
            options.key = settings.key;
            options.cert = settings.cert;
            options.rejectUnauthorized = false;
        }

        if (this.namedConnections[hostname]) {
            try {
                this.namedConnections[hostname].close();
            } catch (e) {
                //this error would be odd, but we'll ignore it as it would be user (dev) facing
            }
            this.namedConnections[hostname] = null;
        }
        try {
            let websocket:any;
            if(typeof process === 'object') { // if running in node ?
                websocket = this.namedConnections[hostname] = new WSWebSocket(connectionString, options);
            }
            else { // else if running in a browser ?
                websocket = this.namedConnections[hostname] = new WebSocket(connectionString, options);
            }

            const errorCallback = (e:any):any => {
                if (onError){
                    onError(e);
                }
                websocket.onerror = () => { return; };
                this.onClose(hostname, 0, 'Error in websocket');
                websocket.removeEventListener("error", errorCallback);
            };
            websocket.addEventListener("error", errorCallback);

            websocket.addEventListener('open', () => {
                this.onConnection(hostname, websocket);
            });

            websocket.addEventListener('close', (e:any) => this.onClose(hostname, e.code, e.reason));

        } catch (err) {
            console.log(`ConnectionManager: startWebSocket: err:`, err);
            this.namedConnections[hostname] = null;
        }
    }

    private onConnection(hostname:string, ws: WebSocket): void {
        // message from Jibo
        this.connected.emit({ robot: hostname });
        this.namedConnections[hostname] = ws;
        ws.addEventListener('message', (message) => {
            //for comaptibility between broswer and node
            if ((message as any).data) { message = (message as any).data; }

            //wait for handshake received to
            let msg: any = JSON.parse(message.toString());
            this.message.emit({robot:hostname, data: msg});
        });
    }

    private onClose(robot: string, code:number, reason:string): void {
        if (this.namedConnections[robot]) {
            this.disconnected.emit({robot, code, reason});
            this.namedConnections[robot].close();
            this.namedConnections[robot] = null;
        }
    }
}
