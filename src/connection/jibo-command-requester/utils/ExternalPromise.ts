export default class ExternalPromise<T> {
    public resolve!: (d?: T) => any;
    public reject!: (err?: any) => any;
    public promise: Promise<T>;

    constructor() {
        this.promise = new Promise<T>((res, rej) => {
            this.resolve = res;
            this.reject = rej;
        });
    }
}