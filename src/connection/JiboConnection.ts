// const request = require('request');
import axios from 'axios';
import { EventEmitter } from "events";
import { Requester } from './jibo-command-requester';

export interface ConnectionInfo {
    clientId: string;
    clientSecret: string;
    port?: number;
}

export interface RobotInfo {
    name?: string;
    serialName: string;
    endpoint: string;
    email: string;
    password: string;
    ip?: string;
    onConnected?: any;
    onDisconnected?: any;
}

export class JiboConnection extends EventEmitter {

    static MAX_TRIES: number = 40;
    static DEFAULT_PORT:number = 7160;
    static DEV_ENDPOINT:string = "dev-customer-portal.jibo.com";
    static STG_ENDPOINT:string = "stg-customer-portal.jibo.com";
    static PREPROD_ENDPOINT:string = "preprod-customer-portal.jibo.com";
    static PROD_ENDPOINT:string = "portal.jibo.com";
    static ENVIRONMENT_OPTIONS: any = {
        DEV_ENDPOINT: JiboConnection.DEV_ENDPOINT,
        STG_ENDPOINT: JiboConnection.STG_ENDPOINT,
        PREPROD_ENDPOINT: JiboConnection.PREPROD_ENDPOINT,
        PROD_ENDPOINT: JiboConnection.PROD_ENDPOINT,
    }

    private _numTries: number = 0;
    private _gotCertificate: boolean = false;
    private _p12Certificate: string = "";
    private _certificateFingerprint: string = "";
    private _accessToken:string = "";
    private _tokenType: string = "";
    private _interval: any = null;
    private _robotInfo: RobotInfo;
    private _connectionInfo: ConnectionInfo;
    private _connected: boolean = false;
    private _requester?: Requester;
    private _debugLogging: boolean = false;

    constructor(robotInfo: RobotInfo, connectionInfo: ConnectionInfo) {
        super();
        this._robotInfo = robotInfo;
        this._connectionInfo = connectionInfo;
    }

    connect(debugLogging: boolean = false): void {
        this._debugLogging = debugLogging;
        if (
                this._robotInfo.serialName &&
                this._robotInfo.endpoint &&
                this._robotInfo.email &&
                this._robotInfo.password &&
                this._connectionInfo.clientId &&
                this._connectionInfo.clientSecret &&
                this._connectionInfo.port
        ) {
            this.login();
        } else {
            this.logError(`JiboConnection: constructor: unable to login`, this._robotInfo, this._connectionInfo);
            this.statusMessage(`constructor: unable to login`);
        }
    }

    login() {
        let getTokenUri = `https://${this._robotInfo.endpoint}/token`;
        let param = {
            grant_type: "password",
            client_id: this._connectionInfo.clientId,
            client_secret: this._connectionInfo.clientSecret,

            username: this._robotInfo.email,
            password: this._robotInfo.password
        }
        axios({
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Content-Type": "application/json"
            },
            url: getTokenUri,
            data: JSON.stringify(param)
        })
        .then((response: any) => {
            this.logDebug(response.data);
            let body_obj = response.data;
            this.logDebug(body_obj);
            this.statusMessage(`login(): success`);
            this._accessToken = body_obj.access_token;
            this._tokenType = body_obj.token_type;
            this.getRobotList();
        })
        .catch((error: any) => {
            this.logError(`Error: login`, error);
            this.statusMessage(`Error: login(): ${error}`);
        });
    }

    getRobotList() {
        // this.logDebug(`JiboConnection: getRobotList: ${this._robotInfo.endpoint}`);
        let getRobotListUri = `https://${this._robotInfo.endpoint}/rom/v1/robots`;

        axios({
            method: 'get',
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": this._tokenType + " " + this._accessToken
            },
            url: getRobotListUri
        })
        .then((response: any) => {
            let body_obj = response.data;
            // this.logDebug(body_obj);
            this.statusMessage(`getRobotList(): success`);
            this.logDebug(`JiboConnection: getRobotList: list: `, body_obj);
            this.logDebug(`JiboConnection: getRobotList: should confirm that: ${this._robotInfo.serialName} is in\n ${JSON.stringify(body_obj, null, 2)}`);
            this.logDebug(`JiboConnection: getRobotList: using: ${this._robotInfo.serialName}`);
            this.createCertificate();
        })
        .catch((error: any) => {
            this.logError(error);
            this.statusMessage(`getRobotList(): error: ${error}`);
        });
    }

    createCertificate() {
        // this.logDebug(`createCertificate: ${this._robotInfo.serialName}`);
        let certificateCreationUri = `https://${this._robotInfo.endpoint}/rom/v1/certificates`;
        let param = {
            friendlyId: this._robotInfo.serialName
        }
        axios({
            method: 'post',
            headers: {
                "User-Agent": "Mozilla/5.0",
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": this._tokenType + " " + this._accessToken
            },
            url: certificateCreationUri,
            data: JSON.stringify(param)
        })
        .then((response: any) => {
            this.statusMessage(`createCertificate(): success`);
            this._robotInfo.ip = "";
            this._numTries = 0;
            this._gotCertificate = false;
            this._p12Certificate = "";
            this._certificateFingerprint = "";
            this._interval = setInterval(this.retrieveCertificate.bind(this), 5000);
        })
        .catch((error: any) => {
            this.logError(error);
            this.statusMessage(`createCertificate(): error: ${error}`);
        });
    }

    retrieveCertificate() {
        // this.logDebug(`retrieveCertificate: ${this._robotInfo.serialName}`);
        if(!this._gotCertificate && this._numTries++ < JiboConnection.MAX_TRIES) {

            this.statusMessage(`retrieveCertificate(): attempt #: ${this._numTries}`);
            let certificateRetrievalUri = `https://${this._robotInfo.endpoint}/rom/v1/certificates/client?friendlyId=${this._robotInfo.serialName}`;
            this.logDebug(`certificateRetrievalUri: ${certificateRetrievalUri}`);

            var CancelToken = axios.CancelToken;
            var source = CancelToken.source();

            axios({
                method: 'get',
                headers: {
                    "User-Agent": "Mozilla/5.0",
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                    "Authorization": this._tokenType + " " + this._accessToken
                },
                url: certificateRetrievalUri,
                cancelToken: source.token
            })
            .then((response: any) => {
                if (response.status == 200) {
                    clearInterval(this._interval);
                    this._gotCertificate = true;
                    let body_obj = response.data;
                    let connectionInfo = body_obj.data;
                    this.logDebug("Recieved a certificate! Robot ip address: " + connectionInfo.payload.ipAddress);
                    // this.logDebug('robot ready!', JSON.stringify(connectionInfo, null, 2));
                    let ipAddress: string           = connectionInfo.payload.ipAddress;
                    this._robotInfo.ip = ipAddress;
                    let key                         = connectionInfo.private;
                    this._p12Certificate            = connectionInfo.cert;
                    this._certificateFingerprint    = connectionInfo.fingerprint;
                    this.logDebug(`retrieveCertificate: connecting to robot...`);
                    this.statusMessage(`retrieveCertificate(): success: connecting to robot...`);
                    this.connectToRobot(ipAddress, key, this._p12Certificate, this._certificateFingerprint, (requester: Requester) => {
                        this.logDebug(`retrieveCertificate: connected: `, requester);
                    });

                } else {
                    this.logError(`retrieveCertificate(): response: code: ${response.status}`, response);
                    this.statusMessage(`retrieveCertificate(): response: 404`);
                    source.cancel('retrieveCertificate(): too many tries.');
                }

            })
            .catch((error: any) => {
                this.logError(error);
                this.statusMessage(`retrieveCertificate(): error: ${error}`);
            });
        } else {
            clearInterval(this._interval);
            this.logDebug(`Tried ${this._numTries} times. Aborting.`);
            this.statusMessage(`retrieveCertificate(): attempted ${this._numTries} times. Aborting.`);
            if(!this._gotCertificate) {
                this.logError(`Unable to retrieve a certificate. Aborting.`);
                this.statusMessage(`Unable to retrieve a certificate. Aborting.`);
                this._connected = false;
                this.emit('disconnected');
                if (this._robotInfo.onDisconnected) {
                    this._robotInfo.onDisconnected();
                }
            }
        }
    }

    connectToRobot(ipAddress: string, key: string, cert: string, fingerprint: string, callback: any) {
        const options = {
            port: this._connectionInfo.port || JiboConnection.DEFAULT_PORT,
            key: key,
            cert: cert,
            rejectUnauthorized: false,
            perMessageDeflate: false,
            fingerprint: fingerprint,
        };

        this._requester = new Requester();
        this._requester.disconnected.on((data: any) => {
            this.logError('JiboConnection: connectToRobot: Connection closed because', data);
            this.statusMessage(`connectToRobot(): error: Connection closed because: ${JSON.stringify(data, null, 2)}`);
            // process.exit();
            this._connected = false;
            this._requester = undefined;
            this.emit('disconnected');
            if (this._robotInfo.onDisconnected) {
                this._robotInfo.onDisconnected();
            }
        });

        this._requester.connect(ipAddress, options)
            .then(() => {
                if (this._requester) {
                    this._connected = true;
                    // Two callbacks plus an emit is a bt much...
                    if (this._robotInfo.onConnected) {
                        this._robotInfo.onConnected(this._requester);
                    }
                    // this callback is currently only used internally, so remove?
                    if (callback) {
                        callback(this._requester);
                    }
                    this.emit('connected', this._requester);
                    this.logDebug('JiboConnection: connectToRobot: OK');
                    this.statusMessage(`connectToRobot(): Connection: OK:`);
                } else {
                    this.logDebug('JiboConnection: connectToRobot: requester is undefined');
                    this.statusMessage(`connectToRobot(): Connection: requester is undefined`);
                }
                //this.sayHiAndDisconnect();
            })
            .catch((error: any) => {
                this.logError('JiboConnection: connectToRobot: error', error);
                this.statusMessage(`connectToRobot(): error: ${error}`);
            });
    }

    // sayHiAndDisconnect() {
    //     console.log(`sayHiAndDisconnect: `, this._requester)
    //     if (this._requester) {
    //         let p = this._requester.play.say("Howdy!").complete;
    //         p.then( () => {
    //             console.log('sayHiAndDisconnect: ta-da!');
    //             console.log('sayHiAndDisconnect: just hanging around for for 10 seconds...');
    //             setTimeout(() => {
    //                 if (this._requester) {
    //                     console.log('sayHiAndDisconnect: disconnecting');
    //                     this.disconnect();
    //                 }
    //             }, 10 * 1000);
    //         });
    //     }
    //
    // }

    disconnect(): void {
        if (this._requester && this._connected) {
            this._requester.disconnect();
            this._requester = undefined;
            this._connected = false;
            this.emit('disconnected');
            if (this._robotInfo.onDisconnected) {
                this._robotInfo.onDisconnected();
            }
            this.statusMessage(`disconnect()`);
        }
    }

    get connected(): boolean {
        return this._connected;
    }

    get requester(): Requester | undefined {
        if (this._connected) {
            return this._requester;
        } else {
            return undefined;
        }
    }

    statusMessage(message: string, clearMessages: boolean=false): void {
        this.emit('statusMessage', {message: message, subsystem: `JiboConnection <${this._robotInfo.name}>`, clearMessages: clearMessages});
    }

    logDebug(...args: any[]): void {
        if (this._debugLogging) {
            console.log.apply(this, args);
            // var args = Array.prototype.slice.call(arguments);
            // args.forEach((logItem: any) => {
            //     console.log(logItem);
            // });
        }
    }

    logError(...args: any[]): void {
        console.log.apply(this, args);
        // var args = Array.prototype.slice.call(arguments);
        // args.forEach((logItem: any) => {
        //     console.log(logItem);
        // });
    }
}
