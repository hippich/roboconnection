import {generateTransactionID} from '../../UUID';


/**
 * @namespace Requester.v2.slim
 * @intdocs
 */
export class SLIM {

    /**
     * Generates SLIM Protocol. See [Phoenix RCP](https://github.jibo.com/phoenix/jibo-command-protocol) for `JIBO` docs.
     * @method Requester.v2.slim#generateProtocol
     * @param {JIBO.v2.behaviors.SLIMConfig} config - What components will comprise the SLIM.
     * @param {JIBO.v2.behaviors.SLIMOptions} [options] - Configuration options for the SLIM.
     * @returns {JIBO.v2.behaviors.SLIM}
     */
    static generateProtocol(config: JIBO.v2.behaviors.SLIMConfig, options?: JIBO.v2.behaviors.SLIMOptions): JIBO.v2.behaviors.SLIM {
        return {
            id: generateTransactionID(),
            type: "SLIM",
            config,
            options
        };
    }
}