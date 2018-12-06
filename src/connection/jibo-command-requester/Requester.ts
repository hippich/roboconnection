import ConnectionManager from './connection/ConnectionManager';
import IConnection, {MessageEvent} from './connection/IConnection';
import RequestToken from './tokens/RequestToken';
import { v1 } from './requests';
import Session = v1.session.Session;
import Attention = v1.expression.attention.Attention;
import LookAt = v1.expression.lookAt.LookAt;
import Display = v1.expression.display.Display;
import VideoPlayback = v1.expression.video.VideoPlayback;
import FaceTrack = v1.lps.face.FaceTrack;
import MotionTrack = v1.lps.motion.MotionTrack;
import HotWord = v1.listen.hotWord.HotWord;
import Listen = v1.listen.listen.Listen;
import Play = v1.expression.play.Play;
import Photo = v1.camera.photo.Photo;
import Video = v1.camera.video.Video;
import LoadAssets = v1.loadAssets.LoadAssets;
import UnloadAssets = v1.unloadAssets.UnloadAssets;
import HeadTouch = v1.sensory.headTouch.HeadTouch;
import GetConfig = v1.settings.getConfig.GetConfig;
import SetConfig = v1.settings.setConfig.SetConfig;
import ScreenGesture = v1.sensory.screenGesture.ScreenGesture;
import {typeguards} from '../jibo-command-protocol';
import {Event} from './events/Event';
import {generateTransactionID} from './UUID';

/**
 * Entry point for the Remote Client Protocol.
 * @class Requester
 * @example
 * const requester = new Requester();
 * requester.disconnected.on((data) => {
 *     console.log('Connection closed because', data);
 * });
 * await requester.connect(robotName);
 */
export default class Requester {

    /**
     * @name Requester#attention
     * @description Instance property on the Requester class. See {@link Requester.attention} namespace.
     */
    public attention:Attention;

    /**
     * @name Requester#lookAt
     * @description Instance property on the Requester class. See {@link Requester.lookAt} namespace.
     */
    public lookAt:LookAt;

    /**
     * @name Requester#display
     * @description Instance property on the Requester class. See {@link Requester.display} namespace.
     */
    public display:Display;
    /**
     * @name Requester#display
     * @description Instance property on the Requester class. See {@link Requester.videoPlayback} namespace.
     */
    public videoPlayback:VideoPlayback;

    /**
     * @name Requester#faceTrack
     * @description Instance property on the Requester class. See {@link Requester.faceTrack} namespace.
     */
    public faceTrack:FaceTrack;

    /**
     * @name Requester#motionTrack
     * @description Instance property on the Requester class. See {@link Requester.motionTrack} namespace.
     */
    public motionTrack: MotionTrack;

    /**
     * @name Requester#play
     * @description Instance property on the Requester class. See {@link Requester.play} namespace.
     */
    public play:Play;

    /**
     * @name Requester#photo
     * @description Instance property on the Requester class. See {@link Requester.photo} namespace.
     */
    public photo:Photo;

    /**
     * @name Requester#video
     * @description Instance property on the Requester class. See {@link Requester.video} namespace.
     */
    public video: Video;

    /**
     * @name Requester#listen
     * @description Instance property on the Requster class. See {@link Requester.listen} namespace.
     */
    public listen: Listen;

    /**
     * @name Requester#hotWord
     * @description Instance property on the Requester class. See {@link Requester.hotWord} namespace.
     */
    public hotWord: HotWord;

    /**
     * @name Requester#loadAssets
     * @description Instance property on the Requester class. See {@link Requester.loadAssets} namespace.
     */
    public loadAssets:LoadAssets;

    /**
     * @name Requester#unloadAssets
     * @description Instance property on the Requester class. See {@link Requester.unloadAssets} namespace.
     */
    public unloadAssets:UnloadAssets;

    /**
     * @name Requester#headTouch
     * @description Instance property on the Requester class. See {@link Requester.headTouch} namespace.
     */
    public headTouch:HeadTouch;

    /**
     * @name Requester#getConfig
     * @description Instance property on the Requester class. See {@link Requester.getConfig} namespace.
     */
    public getConfig:GetConfig;

    /**
     * @name Requester#setConfig
     * @description Instance property on the Requester class. See {@link Requester.setConfig} namespace.
     */
    public setConfig: SetConfig;

    /**
     * @name Requester#screenGesture
     * @description Instance property on the Requester class. See {@link Requester.screenGesture} namespace.
     */
    public screenGesture:ScreenGesture;

    /**
     * ID for the app.
     * @name Requester#AppID
     * @type string
     */
    public AppID:string;

    /**
     * Event emitted when the connection is closed by the robot or a connection issue.
     * @name Requester#disconnected
     * @type Event<number, string>
     */
    public disconnected: Event<{code:number, reason:string}>;

    private session:Session;
    private sessionId:string;
    private robotVersion:string;
    private connection:IConnection;
    private robotName:string;
    private inProgressTokens:Map<string, RequestToken<any, any>>;

    // HACK for forward compatibility with new, published tookit module:
    // "@jibo/apptoolkit-library": "^0.1.5"
    public expression: any;
    public config: any;
    public perception: any;

    constructor() {
        this.robotVersion = '1.0';
        this.AppID = '';
        this.sessionId = '';
        this.robotName = '';
        this.inProgressTokens = new Map();
        this.connection = new ConnectionManager();
        this.connection.message.on(this.onMessage.bind(this));
        this.connection.disconnected.on((data:any) => {
            this.disconnected.emit({code:data.code, reason: data.reason});
        });
        this.attention = new Attention(this);
        this.lookAt = new LookAt(this);
        this.display = new Display(this);
        this.videoPlayback = new VideoPlayback(this);
        this.faceTrack = new FaceTrack(this);
        this.motionTrack = new MotionTrack(this);
        this.play = new Play(this);
        this.photo = new Photo(this);
        this.video = new Video(this);
        this.loadAssets = new LoadAssets(this);
        this.unloadAssets = new UnloadAssets(this);
        this.listen = new Listen(this);
        this.hotWord = new HotWord(this);
        this.getConfig = new GetConfig(this);
        this.setConfig = new SetConfig(this);
        this.session = new Session(this);
        this.headTouch = new HeadTouch(this);
        this.screenGesture = new ScreenGesture(this);
        this.disconnected = new Event('Disconnected');

        // HACK for forward compatibility with new, published tookit module:
        // "@jibo/apptoolkit-library": "^0.1.5"
        this.expression = {
            say: (prompt: string) => this.play.say(prompt),
            look: (lookAtTarget: any) => {
                if (lookAtTarget) {
                    switch(lookAtTarget.type) { // lookAtTarget = { type: "ANGLE", angle: angleVector, levelHead: true};
                        case 'ANGLE':
                            let angleVector: any = lookAtTarget.angle; // {theta: command.data.angle, psi: 0};
                            let angle: [number, number] = [angleVector.theta, 0]; // = [command.data.angle, 0];
                            return this.lookAt.angle(angle);
                            break;
                        case 'POSITION':
                            let vectorData: any = lookAtTarget.position; // {theta: command.data.angle, psi: 0};
                            let vector: [number, number, number] = [vectorData.x, vectorData.y, vectorData.z]; // = [command.data.angle, 0];
                            return this.lookAt.position(vector);
                            break;
                    }
                }
            },
            setAttentionMode: (mode: string) => this.attention.setMode(mode as any),
        }

        this.config = {
            set: (options: any) => {
                if (options.mixer && !options.Mixer) options.Mixer = options.mixer;
                return this.setConfig.set(options)
            },
        }

        this.perception = {
            subscribe: {
                motion: () => this.motionTrack.trackMotions(),
                face: () => this.faceTrack.trackFaces()
            }
        }

        this.listen.subscribe.hotword = (listen: boolean = false) => this.hotWord.listen(listen);

    }

    /**
     * Connect to the specific robot.
     * @method Requester#connect
     * @param  {string}        robotName your-friendly-robot-name
     * @return {Promise<void>}
     */
    public connect(robotName:string,options: any):Promise<void> {

        this.robotName = robotName;
        // console.log('Requester : connect');
        return (this.connection as ConnectionManager).connect(robotName, options)
        .then(() => {
            // console.log('Requester : connected, start session');
            //eat result of connect, start session with robot
            const token = this.session.startSession();
            return token.complete.then((result) => {
                // console.log('Requester : session started, result: ', result);
                //get the session data that we need, then the connection is complete and robot is ready
                this.robotVersion = result.ResponseBody.Version;
                this.sessionId = result.ResponseBody.SessionID;
            })
            .catch((error: any) => {
                console.log('Requester : connect: token: error:', error)
            });
        })
        .catch((error: any) => {
            console.log('Requester : connect: connection: error:', error)
        });
    }

    /**
     * Disconnect all active connections.
     * @method Requester.disconnect
     */
    public disconnect():void {
        this.connection.close();
    }

    /**
     * Send request for the specified asset.
     * @method Requester.sendAssetRequest
     * @param {string}        uri      URI for the asset to request.
     * @param {AssetCallback} callback `http.IncomingMessage`
     */
    // public sendAssetRequest(uri:string, callback:AssetCallback) {
    //     this.connection.sendAssetRequestTo(this.robotName, uri, callback);
    // }

    private generateTransactionID():string {
        return generateTransactionID();
    }

    /**
     * @private
     */
    public sendRequest(command:JIBO.v1.BaseCommand):string {
        //TODO: Actual current IP address here
        const requestId = this.generateTransactionID();
        const header:JIBO.v1.RequestHeader = {
            TransactionID: requestId,
            SessionID: this.sessionId,
            Version: this.robotVersion,
            Credentials: null,
            AppID: this.AppID
        };
        //Send the request!
        this.connection.sendTo(this.robotName, {
            ClientHeader:header,
            Command: command as any
        });
        //return the id to be applied to the token
        return requestId;
    }

    /**
     * @private
     */
    public sendToken(token:RequestToken<any>):void {
        //Send the request!
        token.requestId = this.sendRequest(token.protocol);
        //Retain tokens as in progress requests, and handle their responses
        if (!token.isComplete) {
            this.inProgressTokens.set(token.requestId, token);
        }
    }

    private onMessage(data: MessageEvent) {
        const response = data.data;
        let id:string | null= null;
        let ack:JIBO.v1.Acknowledgement |null = null;
        let event:JIBO.v1.EventMessage|null = null;
        if (typeguards.isAcknowledgement(response)) {
            id = response.ResponseHeader.TransactionID;
            ack = response;
        } else if(typeguards.isEvent(response)) {
            id = response.EventHeader.TransactionID;
            event = response;
        } else {
            //Invalid?
            return;
        }
        //go through active tokens to see who gets what
        if (this.inProgressTokens.has(id)) {
            const token = this.inProgressTokens.get(id);
            if (token) {
                if (ack) {
                    token.handleAck(ack);
                } else {
                    if (event) {
                        token.handleEvent(event);
                    }

                }
                if (token.isComplete) {
                    this.inProgressTokens.delete(id);
                }
            }

        }
    }
}
