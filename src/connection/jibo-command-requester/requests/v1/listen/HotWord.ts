import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {HotWordEvents, CommandTypes, StreamTypes} from '../../../../jibo-command-protocol';


/**
 * @class HotWordToken
 * @extends RequestToken
 * @hideconstructor
 */
export class HotWordToken extends RequestToken<JIBO.v1.HotWordRequest> {
    /**
     * Heard "Hey Jibo"
     * @name HotWordToken#hotWordHeard
     * @type {Event}
     */
    public hotWordHeard:Event<JIBO.v1.HotWordHeardEvent>;
    /**
     * Result of what Jibo head is available.
     * @name HotWordToken#listenResult
     * @type {Event<string>}
     */
    public listenResult:Event<string>;

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.HotWordRequest) {
        super(owner, protocol);
        this.hotWordHeard = new Event('Heard hot word');
        this.listenResult = new Event('Listen complete');
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
        //handle response
        const message = event.EventBody;
        switch (message.Event) {
            case HotWordEvents.HotWordHeard:
                this.hotWordHeard.emit(message);
                break;
        }
    }
}

/**
 * Controls Jibo's HotWord Listening.
 * CURRENTLY UNSUPPORTED
 * @namespace Requester.hotWord
 */
export class HotWord extends RequestAPI<JIBO.v1.HotWordRequest, HotWordToken> {

    /**
     * Generate HotWord Protocol
     * @method Requester.hotWord#generateProtocol
     * @param {boolean} [listen=false] - Whether to listen for additional speech input after "Hey Jibo" is heard.
     * @returns {HotWordRequest}
     * @intdocs
     */
    static generateProtocol(listen = false): JIBO.v1.HotWordRequest {
        return {
            Type: CommandTypes.Subscribe,
            StreamType: StreamTypes.HotWord,
            StreamFilter: {},
            Listen: listen
        };
    }

    /**
     * Listen for "Hey Jibo".
     * @method Requester.hotWord#listen
     * @param {boolean} [listen = false] Whether to listen for additional speech input after "Hey Jibo" is heard.
     * @return {HotWordToken}
     */
    public listen(listen:boolean = false):HotWordToken {
        const protocol = HotWord.generateProtocol(listen);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.hotWord#generateToken
     * @description Create HotWordToken from HotWordRequest protocol.
     * @param {HotWordRequest} protocol - HotWordRequest protocol to generate a HotWordToken from.
     * @param {boolean} [andSend=false] - `True` if the generated HotWordToken should also be sent as a request.
     * @return {HotWordToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.HotWordRequest, andSend=false): HotWordToken {
        const token = new HotWordToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send HotWordToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.hotWord#sendToken
     * @param {HotWordToken} token - HotWordToken to send.
     * @intdocs
     */
    public sendToken(token: HotWordToken): void {
        this.owner.sendToken(token);
    }
}