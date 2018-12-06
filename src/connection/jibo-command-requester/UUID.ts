declare const uuid:any;
export function generateTransactionID() {
    if(typeof process === 'object') {
        const crypto = require('crypto');
        const hashSource = 'hi' + process.hrtime();
        return crypto.createHash('md5').update(hashSource).digest('hex');
    }
    return uuid.v4().split('-').join('');
}