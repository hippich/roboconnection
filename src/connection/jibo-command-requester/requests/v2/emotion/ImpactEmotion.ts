import { generateTransactionID } from '../../../UUID';


/**
 * @class Requester.v2.emotion.ImpactEmotion
 * @intdocs
 */
export class ImpactEmotion {

    /**
     * Generates ImpactEmotion Protocol. See [Phoenix RCP](https://github.jibo.com/phoenix/jibo-command-protocol) for `JIBO` docs.
     * @method Requester.v2.emotion.ImpactEmotion#generateProtocol
     * @param {("NONE" | "LOW_POS" | "MEDIUM_POS" | "HIGH_POS" | "LOW_NEG" | "MEDIUM_NEG" | "HIGH_NEG")} [valence] - Impact the valence axis
     * @param {("NONE" | "LOW_POS" | "MEDIUM_POS" | "HIGH_POS" | "LOW_NEG" | "MEDIUM_NEG" | "HIGH_NEG")} [confidence] - Impact the confidence axis
     * @returns {JIBO.v2.behaviors.ImpactEmotion}
     */
    static generateProtocol(
        valence?: "NONE" | "LOW_POS" | "MEDIUM_POS" | "HIGH_POS" | "LOW_NEG" | "MEDIUM_NEG" | "HIGH_NEG",
        confidence?: "NONE" | "LOW_POS" | "MEDIUM_POS" | "HIGH_POS" | "LOW_NEG" | "MEDIUM_NEG" | "HIGH_NEG"
    ): JIBO.v2.behaviors.ImpactEmotion {
        return {
            id: generateTransactionID(),
            type: "IMPACT_EMOTION",
            valence,
            confidence
        };
    }
}