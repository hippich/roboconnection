import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {CommandTypes, StreamTypes, MotionEvents} from '../../../../jibo-command-protocol';

/**
 * Request token for the {@link MotionTrack} class.
 * @class MotionToken
 * @extends RequestToken
 * @hideconstructor
 */
export class MotionToken extends RequestToken<JIBO.v1.MotionRequest, any> {
    /**
     * @name MotionToken#update
     * @type {Event<MotionEntity[]>}
     */
    public update:Event<JIBO.v1.MotionEntity[]>;

    constructor(owner:Requester, protocol: JIBO.v1.MotionRequest) {
        super(owner, protocol);
        this.update = new Event('Update of motion entities');
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
        const message = event.EventBody;
        switch (message.Event) {
            case MotionEvents.MotionDetected:
                this.update.emit(message.Motions);
                break;
        }
    }
}



/**
 * Controls Jibo's mostion tracking.
 * @namespace Requester.motionTrack
 */
export class MotionTrack extends RequestAPI<JIBO.v1.MotionRequest, MotionToken> {

    /**
     * Generate Motion Track Protocol
     * @method Requester.motionTrack#generateProtocol
     * @returns {MotionRequest}
     * @intdocs
     */
    static generateProtocol(): JIBO.v1.MotionRequest {
        return {
            Type: CommandTypes.Subscribe,
            StreamType: StreamTypes.Motion,
            StreamFilter: {}
        };
    }

    /**
     * @method Requester.motionTrack#trackMotions
     * @description Track all motions in Jibo's field of vision.
     * @return {MotionToken}
     */
    public trackMotions():MotionToken {
        const protocol = MotionTrack.generateProtocol();
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.motionTrack#generateToken
     * @description Create MotionToken from MotionRequest protocol.
     * @param {MotionRequest} protocol - MotionRequest protocol to generate a MotionToken from.
     * @param {boolean} [andSend=false] - `True` if the generated MotionToken should also be sent as a request.
     * @return {MotionToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.MotionRequest, andSend=false): MotionToken {
        const token = new MotionToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send MotionToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.motionTrack#sendToken
     * @param {MotionToken} token - MotionToken to send.
     * @intdocs
     */
    public sendToken(token: MotionToken): void {
        this.owner.sendToken(token);
    }
}