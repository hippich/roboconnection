import { generateTransactionID } from '../../../UUID';


/**
 * @class Requester.v2.perception.SetPresentPerson
 * @intdocs
 */
export class SetPresentPerson {

    /**
     * Generates SetPresentPerson Protocol. See [Phoenix RCP](https://github.jibo.com/phoenix/jibo-command-protocol) for `JIBO` docs.
     * @method Requester.v2.perception.SetPresentPerson#generateProtocol
     * @param {string} looperId - Loop member's ID
     * @param {("VOICE" | "FACE" | "USER_OVERRIDE")} source - Source of the ID
     * @param {number} confidence - Confidence level in this claim of presence
     * @returns {JIBO.v2.behaviors.SetPresentPerson}
     */
    static generateProtocol(
        looperId: string,
        source: "VOICE" | "FACE" | "USER_OVERRIDE",
        confidence: number
    ): JIBO.v2.behaviors.SetPresentPerson {
        return {
            id: generateTransactionID(),
            type: "SET_PRESENT_PERSON",
            looperId,
            source,
            confidence
        };
    }
}