import RequestToken from '../../tokens/RequestToken';
import Requester from '../../Requester';
import RequestAPI from '../RequestAPI';
import {CommandTypes, ResponseCode} from '../../../jibo-command-protocol';

/**
 * @class SessionToken
 * @description Response token for the {@link Session} class.
 * @extends RequestToken
 * @hideconstructor
 */
export class SessionToken extends RequestToken<JIBO.v1.SessionRequest, JIBO.v1.SessionResponse> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.SessionRequest) {
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
        if (ack.Response.ResponseCode === ResponseCode.OK) {
            this.isComplete = true;
            this._complete.resolve(ack.Response as JIBO.v1.SessionResponse);
            return;
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
 * @namespace Requester.session
 */
export class Session extends RequestAPI<JIBO.v1.SessionRequest, SessionToken> {

    /**
     * Generate Session Protocol
     * @method Requester.session#generateProtocol
     * @returns {SessionRequest}
     * @intdocs
     */
    static generateProtocol(): JIBO.v1.SessionRequest {
        return {
            Type: CommandTypes.StartSession
        };
    }

    /**
     * Start the session.
     * @method Requester.session#startSession
     * @return {SessionToken}
     */
    public startSession():SessionToken {
        const protocol = Session.generateProtocol();
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.session#generateToken
     * @description Create SessionToken from SessionRequest protocol.
     * @param {SessionRequest} protocol - SessionRequest protocol to generate a SessionToken from.
     * @param {boolean} [andSend=false] - `True` if the generated SessionToken should also be sent as a request.
     * @return {SessionToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.SessionRequest, andSend=false): SessionToken {
        const token = new SessionToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send SessionToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.session#sendToken
     * @param {SessionToken} token - SessionToken to send.
     * @intdocs
     */
}