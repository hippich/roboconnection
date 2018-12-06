import {generateTransactionID} from '../../UUID';



/**
 * @namespace Requester.v2.play
 * @intdocs
 */
export class Play {

    /**
     * Generates Play Protocol. See [Phoenix RCP](https://github.jibo.com/phoenix/jibo-command-protocol) for `JIBO` docs.
     * @method Requester.v2.play#generateProtocol
     * @param {string} esml - ESML string to be spoken.
     * @param {(string|Object)} [config] - AutoRule configuration options for the Play request.
     * @param {Object} [options] - Speak options for the Play request.
     * @returns {JIBO.v2.behaviors.Play}
     */
    static generateProtocol(esml: string, config?: string | Object, options?: Object): JIBO.v2.behaviors.Play {
        return {
            id: generateTransactionID(),
            type: "PLAY",
            autoRuleConfig: config,
            speakOptions: options,
            esml
        };
    }
}