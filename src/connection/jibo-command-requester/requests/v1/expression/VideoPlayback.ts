import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import { CommandTypes } from '../../../../jibo-command-protocol';

/**
 * Response token for the {@link VideoPlayback} class.
 * @class AttentionToken
 * @extends RequestToken
 * @hideconstructor
 */
export class VideoPlaybackToken extends RequestToken<JIBO.v1.VideoPlaybackRequest, void> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.VideoPlaybackRequest) {
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
export class VideoPlayback extends RequestAPI<JIBO.v1.VideoPlaybackRequest, VideoPlaybackToken> {

    /**
     * Generate Attention Protocol
     * @method Requester.attention#generateProtocol
     * @param {AttentionMode} mode - Mode to set Jibo's attention to.
     * @returns {AttentionRequest}
     * @intdocs
     */
    static generateProtocol(url: string): JIBO.v1.VideoPlaybackRequest {
        return {
            Type: CommandTypes.VideoPlayback,
            URI: url,
            Name: 'somename'
        };
    }

    /**
     * Set Jibo's attention to a specific mode.
     * @method Requester.attention#setMode
     * @param  {AttentionMode}  mode Mode to set Jibo's attention to.
     * @return {AttentionToken}
     */
    public play(url: string):VideoPlaybackToken {
        const protocol = VideoPlayback.generateProtocol(url);
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
    public generateToken(protocol: JIBO.v1.VideoPlaybackRequest, andSend=false): VideoPlaybackToken {
        const token = new VideoPlaybackToken(this.owner, protocol);
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