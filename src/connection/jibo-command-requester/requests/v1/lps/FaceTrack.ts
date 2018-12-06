import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {CommandTypes, EntityTrackEvents, StreamTypes} from '../../../../jibo-command-protocol';

/**
 * Request token for the {@link FaceTrack} class.
 * @class FaceTrackToken
 * @extends RequestToken
 * @hideconstructor
 */
export class FaceTrackToken extends RequestToken<JIBO.v1.EntityRequest, any> {
    /**
     * Update on location of face being tracked.
     * @name FaceTrackToken#update
     * @type {Event<TrackedEntity[]>}
     */
    public update:Event<JIBO.v1.TrackedEntity[]>;
    /**
     * New face being tracked.
     * @name FaceTrackToken#gained
     * @type {Event<TrackedEntity[]>}
     */
    public gained:Event<JIBO.v1.TrackedEntity[]>;
    /**
     * Currently tracked face was lost.
     * @name FaceTrackToken#lost
     * @type {Event<TrackedEntity[]>}
     */
    public lost:Event<JIBO.v1.TrackedEntity[]>;

    constructor(owner:Requester, protocol: JIBO.v1.EntityRequest) {
        super(owner, protocol);
        this.update = new Event('Update of tracked entities');
        this.gained = new Event('Entity found');
        this.lost = new Event('Entity lost');
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
            case EntityTrackEvents.TrackGained:
                this.gained.emit(message.Tracks);
                break;
            case EntityTrackEvents.TrackUpdate:
                this.update.emit(message.Tracks);
                break;
            case EntityTrackEvents.TrackLost:
                this.lost.emit(message.Tracks);
                break;
        }
    }
}


/**
 * Controls Jibo's face tracking.
 * @namespace Requester.faceTrack
 */
export class FaceTrack extends RequestAPI<JIBO.v1.EntityRequest, FaceTrackToken> {

    /**
     * Generate Face Track Protocol
     * @method Requester.faceTrack#generateProtocol
     * @returns {EntityRequest}
     * @intdocs
     */
    static generateProtocol(): JIBO.v1.EntityRequest {
        return {
            Type: CommandTypes.Subscribe,
            StreamType: StreamTypes.Entity,
            StreamFilter: {}
        };
    }

    /**
     * @method Requester.faceTrack#trackFaces
     * @description Track all faces in Jibo's field of vision.
     * @return {FaceTrackToken}
     */
    public trackFaces(): FaceTrackToken {
        const protocol = FaceTrack.generateProtocol();
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.faceTrack#generateToken
     * @description Create FaceTrackToken from EntityRequest protocol.
     * @param {EntityRequest} protocol - EntityRequest protocol to generate a FaceTrackToken from.
     * @param {boolean} [andSend=false] - `True` if the generated FaceTrackToken should also be sent as a request.
     * @return {FaceTrackToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.EntityRequest, andSend=false): FaceTrackToken {
        const token = new FaceTrackToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send FaceTrackToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.faceTrack#sendToken
     * @param {FaceTrackToken} token - FaceTrackToken to send.
     * @intdocs
     */
    public sendToken(token: FaceTrackToken): void {
        this.owner.sendToken(token);
    }
}