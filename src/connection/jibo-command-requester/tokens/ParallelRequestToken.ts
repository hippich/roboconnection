import RequestToken from './RequestToken';

export enum ParallelMode {
    //all must complete - if one rejects, others are cancelled and overall rejection
    All,
    //individual rejections are allowed, so long as at least one completes - wait for all
    //to complete or reject
    AllowFailures,
    //wait for first completion, then cancel others - rejections are okay so long as one completes
    First,
}

export default class ParallelRequestToken {
    public tokens: RequestToken<any, any>[];
    private _complete:Promise<any[]>|null;
    
    public get complete() {
        return this._complete;
    }
    
    constructor(tokens: RequestToken<any, any>[], mode: ParallelMode) {
        this.tokens = tokens;
        this._complete = null;
        const promises:Promise<any>[] = [];
        switch(mode) {
            case ParallelMode.All:
                for(const token of this.tokens) {
                    promises.push(token.complete);
                }
                this._complete = Promise.all(promises)
                .catch((err) => {
                    //cancel any outstanding requests
                    this.cancelAll();
                    return Promise.reject(err);
                });
                break;
            case ParallelMode.AllowFailures:
                const resolved = Array(this.tokens.length).fill(null);
                let hadSuccess = false;
                this.tokens.forEach((token, i) => {
                    promises.push(token.complete.then((result) => {
                        resolved[i] = result;
                        hadSuccess = true;
                    }, (err) => {
                        //eat the rejection
                    }));
                });
                this._complete = Promise.all(promises).then(() => {
                    if (hadSuccess) {
                        return resolved;
                    } else {
                        throw 'No promises completed';
                    }
                });
                break;
            case ParallelMode.First:
                this._complete = new Promise<any[]>((resolve, reject) => {
                    let rejections = 0;
                    this.tokens.forEach((token, i) => {
                        promises.push(token.complete.then((result) => {
                            this.cancelAll();
                            resolve([result]);
                        }, (err) => {
                            //if everything was rejected, then reject the combined promise
                            if (++rejections >= this.tokens.length) {
                                reject('No promises completed');
                            }
                        }));
                    });
                });
                break;
        }
    }
    
    public cancelAll():void {
        if (this.tokens) {
            for(const token of this.tokens) {
                token.cancel();
            }
        }
    }
}