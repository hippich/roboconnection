import { generateTransactionID } from '../../../UUID';


/**
 * @class Requester.v2.structural.Parallel
 * @intdocs
 */
export class Parallel {

    /**
     * Generates Parallel Protocol. See [Phoenix RCP](https://github.jibo.com/phoenix/jibo-command-protocol) for `JIBO` docs.
     * @method Requester.v2.structural.Parallel#generateProtocol
     * @param {JIBO.v2.behaviors.Behavior[]} behaviors - Behaviors to execute in parallel
     * @param {JIBO.v2.behaviors.Behavior[]} [succeedOnFirst=false] - `true` if the entire behavior should succeed when the child who suceeds first does.
     * @returns {JIBO.v2.behaviors.Parallel}
     */
    static generateProtocol(behaviors: JIBO.v2.behaviors.Behavior[], succeedOnFirst=false): JIBO.v2.behaviors.Parallel {
        return {
            id: generateTransactionID(),
            type: "PARALLEL",
            children: behaviors,
            succeedOnFirst
        };
    }
}