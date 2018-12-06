import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {CommandTypes, ConfigEvents} from '../../../../jibo-command-protocol';


/**
 * @class GetConfigToken
 * @description Response token for the {@link GetConfig#get} class.
 * @extends RequestToken
 * @hideconstructor
 */
export class GetConfigToken extends RequestToken<JIBO.v1.GetConfigRequest, JIBO.v1.ConfigEvent> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.GetConfigRequest) {
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
    }

    /**
     * @private
     */
    public handleEvent(event:JIBO.v1.EventMessage) {
        //handle event
        let message = event.EventBody;
        switch (message.Event) {
            case ConfigEvents.onConfig:
                this.isComplete = true;
                this._complete.resolve(message);
                break;
        }
    }
}

/**
 * Controls getting robot configuration options
 * @namespace Requester.getConfig
 */
export class GetConfig extends RequestAPI<JIBO.v1.GetConfigRequest, GetConfigToken> {

    /**
     * Generate Get Config Protocol
     * @method Requester.getConfig#generateProtocol
     * @returns {GetConfigRequest}
     * @intdocs
     */
    static generateProtocol(): JIBO.v1.GetConfigRequest {
        return {
            Type: CommandTypes.GetConfig
        };
    }

    /**
     * Get robot configuration options.
     * @method Requester.getConfig#get
     * @return {GetConfigToken}
     */
    public get():GetConfigToken {
        const protocol = GetConfig.generateProtocol();
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.getConfig#generateToken
     * @description Create GetConfigToken from GetConfigRequest protocol.
     * @param {GetConfigRequest} protocol - GetConfigRequest protocol to generate a GetConfigToken from.
     * @param {boolean} [andSend=false] - `True` if the generated GetConfigToken should also be sent as a request.
     * @return {GetConfigToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.GetConfigRequest, andSend=false): GetConfigToken {
        const token = new GetConfigToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send GetConfigToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.getConfig#sendToken
     * @param {GetConfigToken} token - GetConfigToken to send.
     * @intdocs
     */
    public sendToken(token: GetConfigToken): void {
        this.owner.sendToken(token);
    }
}