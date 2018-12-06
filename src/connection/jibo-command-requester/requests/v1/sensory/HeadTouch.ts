import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {CommandTypes, StreamTypes, HeadTouchEvents, AsyncCommandEvent} from '../../../../jibo-command-protocol';

/**
 * @class HeadTouchToken
 * @extends RequestToken
 * @hideconstructor
 */
export class HeadTouchToken extends RequestToken<JIBO.v1.HeadTouchRequest> {

    /**
     * One or more of Jibo's touchpad sensors was touched.
     * @name HeadTouchToken#HeadTouchEvent
     * @type {Event}
     */
    public update:Event<boolean[]>;

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.HeadTouchRequest) {
        super(owner, protocol);
        this.update = new Event('Update of head touch status');
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
        const message = event.EventBody;
        switch (message.Event) {
            case AsyncCommandEvent.Stop:
                this.isComplete = true;
                this._complete.resolve();
                break;
            case AsyncCommandEvent.Error:
                this.isComplete = true;
                this._complete.reject();
                break;
            case HeadTouchEvents.HeadTouched:
                this.update.emit(message.Pads);
                break;
        }
    }
}

/**
 * Controls subscription to Head Touch events
 * @namespace Requester.headTouch
 */
export class HeadTouch extends RequestAPI<JIBO.v1.HeadTouchRequest, HeadTouchToken> {

    /**
     * Generate Head Touch Protocol
     * @method Requester.headTouch#generateProtocol
     * @returns {HeadTouchRequest}
     * @intdocs
     */
    static generateProtocol(): JIBO.v1.HeadTouchRequest {
        return {
            Type: CommandTypes.Subscribe,
            StreamType: StreamTypes.HeadTouch,
            StreamFilter: {},
        };
    }

    /**
     * Listen for head touch.
     * @method Requester.headTouch#listen
     * @return {HeadTouchToken}
     */
    public listen():HeadTouchToken {
        const protocol = HeadTouch.generateProtocol();
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.headTouch#generateToken
     * @description Create HeadTouchToken from HeadTouchRequest protocol.
     * @param {HeadTouchRequest} protocol - HeadTouchRequest protocol to generate a HeadTouchToken from.
     * @param {boolean} [andSend=false] - `True` if the generated HeadTouchToken should also be sent as a request.
     * @return {HeadTouchToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.HeadTouchRequest, andSend=false): HeadTouchToken {
        const token = new HeadTouchToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send HeadTouchToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.headTouch#sendToken
     * @param {HeadTouchToken} token - HeadTouchToken to send.
     * @intdocs
     */
    public sendToken(token: HeadTouchToken): void {
        this.owner.sendToken(token);
    }
}