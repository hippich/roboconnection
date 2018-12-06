import {generateTransactionID} from '../../../UUID';


/**
 * @class Requester.v2.structural.Sequence
 * @intdocs
 */
export class Sequence {

    /**
     * Generates Sequence Protocol. See [Phoenix RCP](https://github.jibo.com/phoenix/jibo-command-protocol) for `JIBO` docs.
     * @method Requester.v2.structural.Sequence#generateProtocol
     * @param {JIBO.v2.behaviors.Behavior[]} behaviors - Behaviors to execute in sequence
     * @returns {JIBO.v2.behaviors.Sequence}
     */
    static generateProtocol(behaviors: JIBO.v2.behaviors.Behavior[]): JIBO.v2.behaviors.Sequence {
        return {
            id: generateTransactionID(),
            type: "SEQUENCE",
            children: behaviors
        };
    }
}