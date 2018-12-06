import RequestToken from '../../tokens/RequestToken';
import Requester from '../../Requester';
import RequestAPI from '../RequestAPI';
import {CommandTypes, UnloadAssetEvents} from '../../../jibo-command-protocol';

/**
 * @class UnloadAssetToken
 * @extends RequestToken
 * @hideconstructor
 */
export class UnloadAssetToken extends RequestToken<JIBO.v1.UnloadAssetRequest, JIBO.v1.UnloadAssetEvent> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.UnloadAssetRequest) {
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
        const message = event.EventBody;
        switch (message.Event) {
            case UnloadAssetEvents.UnloadAssetDone:
                this.isComplete = true;
                this._complete.resolve(message);
                break;
            case UnloadAssetEvents.UnloadAssetFailed:
                this.isComplete = true;
                this._complete.reject(message);
                break;
        }
    }
}

/**
 * Controls Jibo's asset management.
 * @namespace Requester.unloadAssets
 */
export class UnloadAssets extends RequestAPI<JIBO.v1.UnloadAssetRequest, UnloadAssetToken> {

    /**
     * Generate Unload Asset Protocol
     * @method Requester.unloadAssets#generateProtocol
     * @param {string} name - Name given to the asset for later reference (must be unique).
     * @returns {UnloadAssetRequest}
     * @intdocs
     */
    static generateProtocol(name: string): JIBO.v1.UnloadAssetRequest {
        return {
            Type: CommandTypes.UnloadAsset,
            Name: name
        };
    }

    /**
     * Command unload asset by name.
     * @method Requester.unloadAssets#unloadAsset
     * @param  {string}   name Name of asset to unload.
     * @return {UnloadAssetToken}
     */
    public unloadAsset(name: string):UnloadAssetToken {
        const protocol = UnloadAssets.generateProtocol(name);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.unloadAssets#generateUnloadToken
     * @description Create UnloadAssetToken from UnloadAssetRequest protocol.
     * @param {UnloadAssetRequest} protocol - UnloadAssetRequest protocol to generate a UnloadAssetToken from.
     * @param {boolean} [andSend=false] - `True` if the generated UnloadAssetToken should also be sent as a request.
     * @return {UnloadAssetToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.UnloadAssetRequest, andSend=false): UnloadAssetToken {
        const token = new UnloadAssetToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send UnloadAssetToken request.
     * @method Requester.unloadAssets#sendToken
     * @param {UnloadAssetToken} token - UnloadAssetToken to send.
     * @intdocs
     */
    public sendToken(token: UnloadAssetToken): void {
        this.owner.sendToken(token);
    }
}
