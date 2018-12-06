import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import {Event} from '../../../events/Event';
import RequestAPI from '../../RequestAPI';
import {CommandTypes, ListenEvents, AsyncCommandEvent} from '../../../../jibo-command-protocol';

/**
 * Request token for the {@link Listen} class.
 * @class ListenToken
 * @extends RequestToken
 * @hideconstructor
 */
export class ListenToken extends RequestToken<JIBO.v1.ListenRequest, JIBO.v1.ListenResultEvent | JIBO.v1.ListenStopEvent> {
    /**
     * Listen token was updated. See [RCP Docs](https://github.jibo.com/phoenix/jibo-command-protocol) for docs.
     * @name ListenToken#update
     * @type {Event<JIBO.v1.ListenResultEvent>}
     */
    public update:Event<JIBO.v1.ListenResultEvent>;

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.ListenRequest) {
        super(owner, protocol);
        this.update = new Event('Update of listen status');
    }

    /**
     * @private
     */
    public handleAck(ack:JIBO.v1.Acknowledgement) {
        //handle ack
        if (ack.Response.ResponseCode >= 400) {
            this.isComplete = true;
            this._complete.reject(ack.Response);
            return;
        }
    }

    /**
     * @private
     */
     public handleEvent(event:JIBO.v1.EventMessage) {
         //handle event
         const eventData = event.EventBody;
         switch (eventData.Event) {
             case AsyncCommandEvent.Stop:
                 this.isComplete = true;
                 this._complete.reject(<JIBO.v1.ListenStopEvent>eventData);
                 break;
             case ListenEvents.ListenResult:
                 this.isComplete = true;
                 this._complete.resolve(<JIBO.v1.ListenResultEvent>eventData);
                 this.update.emit(<JIBO.v1.ListenResultEvent> eventData);
                 break;
             case AsyncCommandEvent.Error:
                 this.isComplete = true;
                 this._complete.reject(eventData);
                 break;
         }
     }

}

/**
 * Controls Jibo's Listening.
 * @namespace Requester.listen
 */
export class Listen extends RequestAPI<JIBO.v1.ListenRequest, ListenToken> {

    /**
     * Generate Listen Protocol
     * @method Requester.listen#generateProtocol
     * @param {number} [maxSpeechTimeout=15] - Max speech timeout (in seconds)
     * @param {number} [maxNoSpeechTimeout=15] - Max no speech timeout (in seconds)
     * @param {string} [languageCode='en-US'] - Language code
     * @returns {ListenRequest}
     * @intdocs
     */
    static generateProtocol(maxSpeechTimeout = 15, maxNoSpeechTimeout = 15, languageCode = 'en-US'): JIBO.v1.ListenRequest {
        return {
            Type: CommandTypes.Listen,
            MaxSpeechTimeout: maxSpeechTimeout,
            MaxNoSpeechTimeout: maxNoSpeechTimeout,
            LanguageCode: languageCode
        };
    }

    // HACK for forward compatibility with new, published tookit module:
    // "@jibo/apptoolkit-library": "^0.1.5"

    public subscribe: { hotword: any } = { hotword: undefined }; // placeholder for HotWord.listen();

    public start(maxSpeechTimeout:number = 15, maxNoSpeechTimeout:number = 15, languageCode:string = 'en-US'):ListenToken {
        return this.listen(maxSpeechTimeout, maxNoSpeechTimeout, languageCode);
    }

    /**
     * Request for the robot to listen.
     * @method Requester.listen#listen
     * @param  {number}   [maxSpeechTimeout = 15] In seconds
     * @param  {number}   [maxNoSpeechTimeout = 15] In seconds
     * @param  {number}   [languageCode = en_US]
     * @return {ListenToken}
     */
    public listen(maxSpeechTimeout:number = 15, maxNoSpeechTimeout:number = 15, languageCode:string = 'en-US'):ListenToken {
        const protocol = Listen.generateProtocol(maxSpeechTimeout, maxNoSpeechTimeout, languageCode);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.listen#generateToken
     * @description Create ListenToken from ListenRequest protocol.
     * @param {ListenRequest} protocol - ListenRequest protocol to generate a ListenToken from.
     * @param {boolean} [andSend=false] - `True` if the generated ListenToken should also be sent as a request.
     * @return {ListenToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.ListenRequest, andSend=false): ListenToken {
        const token = new ListenToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send ListenToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.listen#sendToken
     * @param {ListenToken} token - ListenToken to send.
     * @intdocs
     */
    public sendToken(token: ListenToken): void {
        this.owner.sendToken(token);
    }
}
