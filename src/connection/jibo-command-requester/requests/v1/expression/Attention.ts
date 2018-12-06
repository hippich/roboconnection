import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';

/**
 * Response token for the {@link Attention} class.
 * @class AttentionToken
 * @extends RequestToken
 * @hideconstructor
 */
export class AttentionToken extends RequestToken<JIBO.v1.AttentionRequest, void> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.AttentionRequest) {
        super(owner, protocol);
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
        if (ack.Response.ResponseCode === 200) {
            this.isComplete = true;
            this._complete.resolve();
        }
    }

    /**
     * @private
     */
    public handleEvent(event:JIBO.v1.EventMessage) {
        //handle event
    }
}

/**
 * Controls the Jibo's attention mode.
 * @namespace Requester.attention
 */
export class Attention extends RequestAPI<JIBO.v1.AttentionRequest, AttentionToken> {

    /**
     * Generate Attention Protocol
     * @method Requester.attention#generateProtocol
     * @param {AttentionMode} mode - Mode to set Jibo's attention to.
     * @returns {AttentionRequest}
     * @intdocs
     */
    static generateProtocol(mode: JIBO.v1.AttentionModes.AttentionModeType): JIBO.v1.AttentionRequest {
        return {
            Type: 'SetAttention',
            Mode: mode
        };
    }

    /**
     * Set Jibo's attention to a specific mode.
     * @method Requester.attention#setMode
     * @param  {AttentionMode}  mode Mode to set Jibo's attention to.
     * @return {AttentionToken}
     */
    public setMode(mode:JIBO.v1.AttentionModes.AttentionModeType):AttentionToken {
        const protocol = Attention.generateProtocol(mode);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.attention#generateToken
     * @description Create AttentionToken from AttentionRequest protocol.
     * @param {AttentionRequest} protocol - AttentionRequest protocol to generate a AttentionToken from.
     * @param {boolean} [andSend=false] - `True` if the generated AttentionToken should also be sent as a request.
     * @return {AttentionToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.AttentionRequest, andSend=false): AttentionToken {
        const token = new AttentionToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send AttentionToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.attention#sendToken
     * @param {AttentionToken} token - AttentionToken to send.
     * @intdocs
     */
}