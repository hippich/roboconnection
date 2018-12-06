import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {AsyncCommandEvent, CommandTypes} from '../../../../jibo-command-protocol';

/**
 * @class SayToken
 * @extends RequestToken
 * @hideconstructor
 */
export class SayToken extends RequestToken<JIBO.v1.SayRequest> {

    /** @private */
    constructor(owner:Requester, protocol: JIBO.v1.SayRequest) {
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
 * Controls Jibo's speech and audio.
 * @namespace Requester.play
 */
export class Play extends RequestAPI<JIBO.v1.SayRequest, SayToken> {

    /**
     * Generate Play Protocol
     * @method Requester.play#generateProtocol
     * @param {string} esml_uri - ESML to speak or URI of sound to play
     * @param {JIBO.v1.SpeakOptions} [speakOptions] Options to configure , can be used in conjunction with ESML strings.
     * @param {JIBO.v1.AutoRuleConfig} [autoRuleConfig] Configuration for AutoRules , can be used in conjunction with ESML strings.
     * @returns {SayRequest}
     * @intdocs
     */
    static generateProtocol(esmlUri: string, speakOptions?:JIBO.v1.SpeakOptions, autoRuleConfig?:JIBO.v1.AutoRuleConfig ): JIBO.v1.SayRequest {
        return {
            Type: CommandTypes.Say,
            ESML: esmlUri,
            SpeakOptions: speakOptions,
            AutoRuleConfig: autoRuleConfig
        };
    }

    /**
     * Make Jibo speak.
     * @method Requester.play#say
     * @param  {string}   esml Embodied Speech Markup Language to say. See the [ESML Documentation]{@tutorial esml}.
     * @param {JIBO.v1.SpeakOptions} [speakOptions] Options to configure , can be used in conjunction with ESML strings.
     * @param {JIBO.v1.AutoRuleConfig} [autoRuleConfig] Configuration for AutoRules , can be used in conjunction with ESML strings.
     * @return {SayToken}
     */
    public say(esml:string, speakOptions?:JIBO.v1.SpeakOptions, autoRuleConfig?:JIBO.v1.AutoRuleConfig):SayToken {
        const protocol = Play.generateProtocol(esml, speakOptions, autoRuleConfig);
        return this.generateToken(protocol, true);
    }

    /**
     * Make Jibo play a sound.
     * @method Requester.play#sound
     * @param  {string}   uri URI to the sound to play.
     * @return {SayToken}
     */
    public sound(uri:string):SayToken {
        //TODO: Wrap uri in correct ESML tags to make it play as a sound effect
        const protocol = Play.generateProtocol(uri);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.play#generateToken
     * @description Create SayToken from SayRequest protocol.
     * @param {SayRequest} protocol - SayRequest protocol to generate a SayToken from.
     * @param {boolean} [andSend=false] - `True` if the generated SayToken should also be sent as a request.
     * @return {SayToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.SayRequest, andSend=false): SayToken {
        const token = new SayToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send SayToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.play#sendToken
     * @param {SayToken} token - SayToken to send.
     * @intdocs
     */
    public sendToken(token: SayToken): void {
        this.owner.sendToken(token);
    }
}
