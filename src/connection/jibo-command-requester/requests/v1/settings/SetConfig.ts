import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {CommandTypes, AsyncCommandEvent} from '../../../../jibo-command-protocol';

/**
 * @class SetConfigToken
 * @description Response token for the {@link SetConfig#set} class.
 * @extends RequestToken
 * @hideconstructor
 */
export class SetConfigToken extends RequestToken<JIBO.v1.SetConfigRequest> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.SetConfigRequest) {
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
        switch (event.EventBody.Event) {
            case AsyncCommandEvent.Stop:
                this.isComplete = true;
                this._complete.resolve();
                break;
            case AsyncCommandEvent.Error:
                this.isComplete = true;
                this._complete.reject(event.EventBody);
                break;
        }
    }
}

/**
 * Controls setting robot configuration options
 * @namespace Requester.setConfig
 */
export class SetConfig extends RequestAPI<JIBO.v1.SetConfigRequest, SetConfigToken> {

    /**
     * Generate Set Config Protocol
     * @method Requester.setConfig#generateProtocol
     * @param {SetConfigOptions} options
     * @returns {SetConfigRequest}
     * @intdocs
     */
    static generateProtocol(options: JIBO.v1.SetConfigOptions): JIBO.v1.SetConfigRequest {
        return {
            Type: CommandTypes.SetConfig,
            Options: options
        };
    }

    /**
     * Set robot configuration options.
     * @method Requester.setConfig#set
     * @param  {number}  mixer Volume between 0 (mute) and 1 (loudest).
     * @return {SetConfigToken}
     */
    public set(options: JIBO.v1.SetConfigOptions):SetConfigToken {
        const protocol = SetConfig.generateProtocol(options);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.setConfig#generateToken
     * @description Create SetConfigToken from SetConfigRequest protocol.
     * @param {SetConfigRequest} protocol - SetConfigRequest protocol to generate a SetConfigToken from.
     * @param {boolean} [andSend=false] - `True` if the generated SetConfigToken should also be sent as a request.
     * @return {SetConfigToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.SetConfigRequest, andSend=false): SetConfigToken {
        const token = new SetConfigToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send SetConfigToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.setConfig#sendToken
     * @param {SetConfigToken} token - SetConfigToken to send.
     * @intdocs
     */
    public sendToken(token: SetConfigToken): void {
        this.owner.sendToken(token);
    }
}