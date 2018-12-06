import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {Event} from '../../../events/Event';
import {AsyncCommandEvent, ViewStates, DisplayEvents, CommandTypes, DisplayViewType} from '../../../../jibo-command-protocol';

/**
 * Reponse token for {@link Display} APIs.
 * @class DisplayToken
 * @extends RequestToken
 * @hideconstructor
 */
export class DisplayToken extends RequestToken<JIBO.v1.DisplayRequest> {
    /**
     * Emitted when a display view is opened.
     * @name DisplayToken#opened
     * @type {Event}
     */
    public opened:Event<void>;


    /** @private */
    constructor(owner: Requester, protocol: JIBO.v1.DisplayRequest) {
        super(owner, protocol);
        this.opened = new Event('Opened');
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
            case DisplayEvents.ViewStateChange:
                switch (eventData.State) {
                    case ViewStates.Opened:
                        this.opened.emit();
                        break;
                }
        }
    }
}

/**
 * Controls which views appear on Jibo's screen.
 * @namespace Requester.display
 */
export class Display extends RequestAPI<JIBO.v1.DisplayRequest, DisplayToken> {

    /**
     * Generate Display Protocol
     * @method Requester.display#generateProtocol
     * @param {(EyeView | TextView | ImageView)} view - View to replace the existing one with.
     * @returns {DisplayRequest}
     * @intdocs
     */
    static generateProtocol(view: JIBO.v1.EyeView | JIBO.v1.TextView | JIBO.v1.ImageView): JIBO.v1.DisplayRequest {
        return {
            Type: CommandTypes.Display,
            View: view
        };
    }

    // HACK for forward compatibility with new, published tookit module:
    // "@jibo/apptoolkit-library": "^0.1.5"
    public swap(view:JIBO.v1.EyeView | JIBO.v1.TextView | JIBO.v1.ImageView):DisplayToken {
        return this.swapView(view);
    }

    /**
     * @method Requester.display#swapView
     * @description Replace the existing view with the one given.
     * @param  {EyeView | TextView | ImageView}  view View to replace the existing one with.
     * @return {DisplayToken}
     */
    public swapView(view:JIBO.v1.EyeView | JIBO.v1.TextView | JIBO.v1.ImageView):DisplayToken {
        const protocol = Display.generateProtocol(view);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.display#createEyeView
     * @description Create a view to display Jibo's eye on screen.
     * @param  {string} name Unique name of view.
     * @return {EyeView}
     */
    public createEyeView(name:string):JIBO.v1.EyeView {
        let view:JIBO.v1.EyeView = {
            Type: DisplayViewType.Eye,
            Name: name
        };
        return view;
    }

    /**
     * @method Requester.display#createTextView
     * @description Create a view to display text on Jibo's screen.
     * @param  {string} name Unique name of view.
     * @param  {string} text Text to display on screen.
     * @return {TextView}
     */
    public createTextView(name:string, text:string):JIBO.v1.TextView {
        let view:JIBO.v1.TextView = {
            Type: DisplayViewType.Text,
            Name: name,
            Text: text
        };
        return view;
    }

    /**
     * @method Requester.display#createImageView
     * @description Create a view to display an image on Jibo's screen.
     * @param  {string} name Unique name of view.
     * @param  {ImageData} data Data for retrieving image.
     * @return {ImageView}
     */
    public createImageView(name:string, data:JIBO.v1.ImageData):JIBO.v1.ImageView {
        let view:JIBO.v1.ImageView = {
            Type: DisplayViewType.Image,
            Name: name,
            Image: data
        };
        return view;
    }

    /**
     * @method Requester.display#generateToken
     * @description Create DisplayToken from DisplayRequest protocol.
     * @param {DisplayRequest} protocol - DisplayRequest protocol to generate a DisplayToken from.
     * @param {boolean} [andSend=false] - `True` if the generated DisplayToken should also be sent as a request.
     * @return {DisplayToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.DisplayRequest, andSend=false): DisplayToken {
        const token = new DisplayToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send DisplayToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.display#sendToken
     * @param {DisplayToken} token - DisplayToken to send.
     * @intdocs
     */
}
