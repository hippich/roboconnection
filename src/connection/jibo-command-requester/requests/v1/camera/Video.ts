import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {CommandTypes, VideoEvents, ResponseCode} from '../../../../jibo-command-protocol';

/**
 * Reponse token for {@link Video#getVideo}.
 * @class VideoToken
 * @extends RequestToken
 * @hideconstructor
 */
export class VideoToken extends RequestToken<JIBO.v1.VideoRequest, any> {

    /**
     * URL for video stream is ready.
     * @name VideoToken#streamReady
     * @type {Event<string>}
     */
    public streamReady:Event<string>;

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.VideoRequest) {
        super(owner, protocol);
        this.streamReady = new Event('Video ready for streaming');
    }

    /**
     * @private
     */
    public handleAck(ack:JIBO.v1.Acknowledgement) {
        //handle ack
        if (ack.Response.ResponseCode >= ResponseCode.BadRequest) {
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
        const eventData = event.EventBody;
        if (eventData.Event === VideoEvents.VideoReady) {
            this.streamReady.emit(eventData.URI);
        }
    }
}


/**
 * Controls Jibo's video capture.
 * @namespace Requester.video
 */
export class Video extends RequestAPI<JIBO.v1.VideoRequest, VideoToken> {

    /**
     * Generate Video Protocol
     * @method Requester.video#generateProtocol
     * @param {VideoType} [type=VideoType.Normal] - Choose a video type from the enum.
     * @param {number} [duration=0] - How long to record for (in ms).
     * @returns {VideoRequest}
     * @intdocs
     */
    static generateProtocol(
        type:JIBO.v1.Videos.VideoType = 'NORMAL', duration = 0): JIBO.v1.VideoRequest {
        return {
            Type: CommandTypes.Video,
            Duration: duration,
            VideoType: type
        };
    }

    /**
     * Take a video.
     * @method Requester.video#getVideo
     * @param  {VideoType} [type=Normal] Choose a video type from the enum.
     * @param  {number}    [duration=0] How long to record for (in ms).
     * @return {VideoToken}
     */
    public getVideo(type:JIBO.v1.Videos.VideoType = 'NORMAL', duration:number = 0): VideoToken {
        const protocol = Video.generateProtocol(type, duration);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.video#generateToken
     * @description Create VideoToken from VideoRequest protocol.
     * @param {VideoRequest} protocol - VideoRequest protocol to generate a VideoToken from.
     * @param {boolean} [andSend=false] - `True` if the generated VideoToken should also be sent as a request.
     * @return {VideoToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.VideoRequest, andSend=false): VideoToken {
        const token = new VideoToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send VideoToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.video#sendToken
     * @param {VideoToken} token - VideoToken to send.
     * @intdocs
     */
}