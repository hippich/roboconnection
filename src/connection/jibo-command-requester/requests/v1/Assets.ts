import RequestToken from '../../tokens/RequestToken';
import Requester from '../../Requester';
import RequestAPI from '../RequestAPI';
import {CommandTypes, FetchAssetEvents} from '../../../jibo-command-protocol';

/**
 * @class FetchAssetToken
 * @extends RequestToken
 * @hideconstructor
 */
export class FetchAssetToken extends RequestToken<JIBO.v1.FetchAssetRequest, JIBO.v1.FetchAssetEvent> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.FetchAssetRequest) {
        super(owner, protocol);
    }

    /**
     * @private
     */
    public handleAck(ack:JIBO.v1.Acknowledgement) {
        //handle ack
        if (ack.Response.ResponseCode >= 400) {
            this.isComplete = true;
            if (this._complete.reject) {
                this._complete.reject(ack.Response);
            }
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
            case FetchAssetEvents.AssetReady:
                this.isComplete = true;
                if (this._complete.resolve) {
                    this._complete.resolve(message);
                }
                break;
            case FetchAssetEvents.AssetFailed:
                this.isComplete = true;
                if (this._complete.reject) {
                    this._complete.reject(message);
                }
                break;
        }
    }
}

/**
 * Controls Jibo's asset management.
 * @namespace Requester.assets
 */
export class Assets extends RequestAPI<JIBO.v1.FetchAssetRequest, FetchAssetToken> {

    /**
     * Generate Asset Protocol
     * @method Requester.assets#generateProtocol
     * @param {string} uri - URI of the asset to be fetched.
     * @param {string} name - Name given to the asset for later reference (must be unique).
     * @returns {FetchAssetRequest}
     * @intdocs
     */
    static generateProtocol(uri: string, name: string): JIBO.v1.FetchAssetRequest {
        return {
            Type: CommandTypes.FetchAsset,
            URI: uri,
            Name: name
        };
    }

    /**
     * Command to retrieve external asset and store in local cache by name.
     * @method Requester.assets#fetchAsset
     * @param  {string}   uri Uri where the asset to fetch is.
     * @param  {string}   name Name that the asset will be call by.
     * @return {FetchAssetToken}
     */
    public fetchAsset(uri:string, name: string):FetchAssetToken {
        const protocol = Assets.generateProtocol(uri, name);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.assets#generateToken
     * @description Create FetchAssetToken from FetchAssetRequest protocol.
     * @param {FetchAssetRequest} protocol - FetchAssetRequest protocol to generate a FetchAssetToken from.
     * @param {boolean} [andSend=false] - `True` if the generated FetchAssetToken should also be sent as a request.
     * @return {FetchAssetToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.FetchAssetRequest, andSend=false): FetchAssetToken {
        const token = new FetchAssetToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send FetchAssetToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.assets#sendToken
     * @param {FetchAssetToken} token - FetchAssetToken to send.
     * @intdocs
     */
    public sendToken(token: FetchAssetToken): void {
        this.owner.sendToken(token);
    }
}
