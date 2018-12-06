//photo imports
import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {CommandTypes, PhotoEvents, ResponseCode} from '../../../../jibo-command-protocol';


/**
 * Reponse token for {@link Photo#takePhoto}.
 * @class PhotoToken
 * @extends RequestToken
 * @hideconstructor
 */
export class PhotoToken extends RequestToken<JIBO.v1.TakePhotoRequest, JIBO.v1.TakePhotoEvent> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.TakePhotoRequest) {
        super(owner, protocol);
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
        const message = event.EventBody;
        if (message.Event === PhotoEvents.TakePhoto) {
            this.isComplete = true;
            this._complete.resolve(message);
        }
    }
}

/**
 * Controls Jibo's photo capture.
 * @namespace Requester.photo
 */
export class Photo extends RequestAPI<JIBO.v1.TakePhotoRequest, PhotoToken> {

    /**
     * Generate Photo Protocol
     * @method Requester.photo#generateProtocol
     * @param {Camera} [camera=left] - Which camera to use -- left or right.
     * @param {CameraResolution} [resolution=LowRes] - Choose a resolution.
     * @param {boolean} [removeDistortion=true] - Use `false` for fisheye lense.
     * @returns {TakePhotoRequest}
     * @intdocs
     */
    static generateProtocol(
        camera:JIBO.v1.Cameras.CameraType = 'left',
        resolution:JIBO.v1.CameraResolutions.CameraResolutionType = 'lowRes',
        removeDistortion = true): JIBO.v1.TakePhotoRequest {
        return {
            Type: CommandTypes.TakePhoto,
            Resolution: resolution,
            Camera: camera,
            Distortion: removeDistortion
        };
    }

    /**
     * Take a photo.
     * @method Requester.photo#takePhoto
     * @param  {CameraResolution} [resolution=LowRes] Choose a resolution.
     * @param  {string}           [camera=left] Which camera to use -- left or right.
     * @param  {boolean}          [removeDistortion=true] Use `false` for fisheye lense.
     * @return {PhotoToken}
     */
    public takePhoto(
        resolution:JIBO.v1.CameraResolutions.CameraResolutionType = 'lowRes',
        camera:JIBO.v1.Cameras.CameraType = 'left',
        removeDistortion:boolean = true):PhotoToken {
        const protocol = Photo.generateProtocol(camera, resolution, removeDistortion);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.photo#generateToken
     * @description Create PhotoToken from TakePhotoRequest protocol.
     * @param {TakePhotoRequest} protocol - TakePhotoRequest protocol to generate a PhotoToken from.
     * @param {boolean} [andSend=false] - `True` if the generated PhotoToken should also be sent as a request.
     * @return {PhotoToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.TakePhotoRequest, andSend=false): PhotoToken {
        const token = new PhotoToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send PhotoToken request.
     * <p><p>NOTE: Implementation in base class {@link RequestAPI}</p></p>
     * @method Requester.photo#sendToken
     * @param {PhotoToken} token - PhotoToken to send.
     * @intdocs
     */
}