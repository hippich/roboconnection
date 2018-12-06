import {Event} from '../events/Event';
// import http = require('http');

export interface ConnectionEvent {
    robot: string;
}

export interface DisconnectEvent extends ConnectionEvent {
    code: number;
    reason: string;
}

export interface MessageEvent {
    robot:string;
    data:JIBO.v1.AllResponses;
}

/**
 * Callback for requesting assets.
 * @callback AssetCallback
 * @param res {http.IncomingMessage}
 */
// export type AssetCallback = (res:http.IncomingMessage) => void;

export default interface IConnection {
    connected: Event<ConnectionEvent>;
    disconnected: Event<DisconnectEvent>;
    message: Event<MessageEvent>;

    close():void;
    isConnected(robot:string):boolean;
    sendTo(name: string, command: JIBO.v1.Command):void;
    // sendAssetRequestTo(name:string, uri:string, callback:AssetCallback):void;
}