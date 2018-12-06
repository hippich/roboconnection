import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {CommandTypes, StreamTypes, ScreenGestureEvents, AsyncCommandEvent} from '../../../../jibo-command-protocol';

/**
 * Reponse token for {@link ScreenGesture} APIs.
 * @class ScreenGestureToken
 * @extends RequestToken
 * @hideconstructor
 */
export class ScreenGestureToken extends RequestToken<JIBO.v1.ScreenGestureRequest> {
    /**
     * Tap screen gesture. `[x,y]` of tap location type.
     * @name ScreenGestureToken#tap
     * @type {Event<Vector2>}
     */
    public tap:Event<JIBO.v1.Vector2>;

    /**
     * Swipe screen gesture. Type is direction of swipe.
     * @name ScreenGestureToken#swipe
     * @type {Event<SwipeDirection>}
     */
    public swipe:Event<JIBO.v1.SwipeDirections.SwipeDirectionType>;


    /** @private */
    constructor(owner: Requester, protocol: JIBO.v1.ScreenGestureRequest) {
        super(owner, protocol);
        this.tap = new Event(ScreenGestureEvents.Tap);
        this.swipe = new Event(ScreenGestureEvents.Swipe);
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
                this._complete.resolve();
                break;
            case AsyncCommandEvent.Error:
                this.isComplete = true;
                this._complete.reject(eventData);
                break;
            case ScreenGestureEvents.Tap:
                 this.tap.emit(eventData.Coordinate);
                 break;
            case ScreenGestureEvents.Swipe:
                 this.swipe.emit(eventData.Direction);
                 break;

        }
    }
}

/**
 * Allows subsription to the events emited when a gesture is detected in the Jibo screen.
 * @namespace Requester.screenGesture
 */
export class ScreenGesture extends RequestAPI<JIBO.v1.ScreenGestureRequest, ScreenGestureToken> {

    /**
     * Generate Screen Gesture Protocol
     * @method Requester.screenGesture#generateProtocol
     * @param {ScreenGestureFilter} [filter={}]
     * @returns {ScreenGestureRequest}
     * @intdocs
     */
    static generateProtocol(filter: JIBO.v1.ScreenGestureFilter = {}): JIBO.v1.ScreenGestureRequest {
        return {
            Type: CommandTypes.Subscribe,
            StreamType: StreamTypes.ScreenGesture,
            StreamFilter: filter
        };
    }

    /**
     * @method Requester.screenGesture#subscribe
     * @description Listen for screen touch input.
     * @param  {ScreenGestureFilter}  filter Data for screen touch info, including type of gesture to listen
     * for and area to listen in.
     * @return {ScreenGestureToken}
     */
    public subscribe(filter:JIBO.v1.ScreenGestureFilter = {}): ScreenGestureToken {
        const protocol = ScreenGesture.generateProtocol(filter);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.screenGesture#generateToken
     * @description Create ScreenGestureToken from ScreenGestureRequest protocol.
     * @param {ScreenGestureRequest} protocol - ScreenGestureRequest protocol to generate a ScreenGestureToken from.
     * @param {boolean} [andSend=false] - `True` if the generated ScreenGestureToken should also be sent as a request.
     * @return {ScreenGestureToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.ScreenGestureRequest, andSend=false): ScreenGestureToken {
        const token = new ScreenGestureToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send ScreenGestureToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.screenGesture#sendToken
     * @param {ScreenGestureToken} token - ScreenGestureToken to send.
     * @intdocs
     */
    public sendToken(token: ScreenGestureToken): void {
        this.owner.sendToken(token);
    }
}