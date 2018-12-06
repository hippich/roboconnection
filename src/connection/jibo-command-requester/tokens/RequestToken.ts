import Requester from '../Requester';
import ExternalPromise from '../utils/ExternalPromise';

//as TypedEvents from jibo-typed-events
/**
 * Every request has a token with a completion promise and any events relative to that command.
 * @class RequestToken
 */
export default abstract class RequestToken<C extends JIBO.v1.BaseCommand, Result = any> {
    /**
     * Protocol data to be sent along the websocket.
     * @private
     */
    public protocol:C;
    /**
     * Unique id for this request, and any responses to it.
     * @private
     */
    public requestId:string;
    /**
     * Internal flag for the Requester to know that it no longer needs to track the token. Must
     * be updated by subclasses when `complete` resolves.
     * @private
     */
    public isComplete:boolean;

    /**
     * For subclasses to know where to send cancel requests
     * @private
     */
    public owner:Requester;

    //probably everyone needs to implement this a little different - resolves when command completes
    //rejects if command is rejected/interrupted
    protected _complete:ExternalPromise<Result>;

    //subclasses should override this to provide a typed promise
    /**
     * Request completion promise.
     * @method RequestToken#complete
     * @returns this
     */
    public get complete() {
        return this._complete.promise;
    }

    /** @private */
    constructor(owner:Requester, protocol: C) {
        this.owner = owner;
        this.protocol = protocol;
        this.isComplete = false;
        this.requestId = '';
        this._complete = new ExternalPromise();
    }

    /**
     * Cancel the request.
     * @method RequestToken#cancel
     */
    public cancel():void {
        if (this.isComplete) {
            return;
        }
        this.isComplete = true;
        this._complete.reject();

        //overwrite the protocol for this token, then send the request
        const cancel:JIBO.v1.CancelRequest = {
            Type: "Cancel",
            ID: this.requestId
        };
        // Need a unique requestId for the cancel command
        this.owner.sendRequest(cancel);
    }

    /**
     * Internal listener method for handling responses
     * @private
     */
    public abstract handleAck(data:JIBO.v1.Acknowledgement):void;

    /**
     * Internal listener method for handling responses
     * @private
     */
    public abstract handleEvent(data:JIBO.v1.EventMessage):void;
}
