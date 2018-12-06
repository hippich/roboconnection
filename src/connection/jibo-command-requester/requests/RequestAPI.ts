import Requester from '../Requester';
import RequestToken from '../tokens/RequestToken';

export default abstract class RequestAPI<R extends JIBO.v1.BaseCommand, T extends RequestToken<R>> {
    protected owner:Requester;

    constructor(owner:Requester) {
        this.owner = owner;
    }

    abstract generateToken(protocol: R): T;

    public sendToken(token: T): void {
        this.owner.sendToken(token);
    }
}