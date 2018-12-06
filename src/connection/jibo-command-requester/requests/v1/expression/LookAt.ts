import RequestToken from '../../../tokens/RequestToken';
import Requester from '../../../Requester';
import RequestAPI from '../../RequestAPI';
import {AsyncCommandEvent, CommandTypes, LookAtEvents} from '../../../../jibo-command-protocol';

export interface LookAtAchievedResult {
    AngleTarget: JIBO.v1.AngleVector;
    PositionTarget: JIBO.v1.Vector3;
}

export interface LookAtTrackLostResult {
    EntityTarget: JIBO.v1.LookAtEntity;
    AngleTarget: JIBO.v1.AngleVector;
    PositionTarget: JIBO.v1.Vector3;
}

/**
 * Target options for LookAt
 * @typedef TargetMode
 * @prop Positoin
 * @prop Angle
 * @prop Entity
 * @prop Scren
 * @intdocs
 */
export enum TargetMode {
    Position,
    Angle,
    Entity,
    Screen
}

/**
 * Reponse token for {@link LookAt} APIs.
 * @class LookAtToken
 * @extends RequestToken
 * @hideconstructor
 */
export class LookAtToken extends RequestToken<JIBO.v1.LookAtRequest, LookAtAchievedResult|LookAtTrackLostResult> {

    /** @private */
    constructor(owner: Requester, protocol: JIBO.v1.LookAtRequest) {
        super(owner, protocol);
    }

    /**
     * @private
     */
    public handleAck(ack:JIBO.v1.Acknowledgement) {
        //handle ack
        if (ack.Response.ResponseCode >= 400) {
            this.isComplete = true;
            this._complete.reject(ack.Response);
            return;
        }
    }

    /**
     * @private
     */
    public handleEvent(event:JIBO.v1.EventMessage) {
        //handle event
        const eventData = event.EventBody;
        switch (eventData.Event) {
            case AsyncCommandEvent.Stop:
                this.isComplete = true;
                this._complete.resolve();
                break;
            case AsyncCommandEvent.Error:
                this.isComplete = true;
                this._complete.reject(eventData);
                break;
            case LookAtEvents.LookAtAchieved:
                this.isComplete = true;
                this._complete.resolve(eventData);
                break;
            case LookAtEvents.TrackEntityLost:
                this.isComplete = true;
                this._complete.resolve(eventData);
                break;
        }
    }
}

/**
 * Controls Jibo's LookAt movement.
 * @namespace Requester.lookAt
 */
export class LookAt extends RequestAPI<JIBO.v1.LookAtRequest, LookAtToken> {

    /**
     * Generate LookAt Protocol
     * @method Requester.lookAt#generateProtocol
     * @param {TargetMode} targetMode - How we are targetting our target (depends on the target type)
     * @param {(Vector2|Vector3|LookAtEntity)} target - What we're looking at (Entity, Angle or Point in space)
     * @param {boolean} levelHead - `true` to keep Jibo's head level while he moves.
     * @param {boolean} [shouldTrack=false] - If we should track the target entity (Entity-Mode only)
     * @returns {LookAtRequest}
     * @intdocs
     */
    static generateProtocol(
        targetMode: TargetMode,
        target: JIBO.v1.Vector2 | JIBO.v1.Vector3 | JIBO.v1.LookAtEntity,
        levelHead: boolean,
        shouldTrack = false): JIBO.v1.LookAtRequest {
        let lookAtTarget;
        switch (targetMode) {
            case TargetMode.Position:
                lookAtTarget = { Position: target as JIBO.v1.Vector3 };
                break;
            case TargetMode.Angle:
                lookAtTarget = { Angle: target as JIBO.v1.AngleVector };
                break;
            case TargetMode.Entity:
                lookAtTarget = { Entity: target as JIBO.v1.LookAtEntity };
                break;
            case TargetMode.Screen:
                lookAtTarget = { ScreenCoords: target as JIBO.v1.Vector2 };
                break;
        }
        return {
            Type: CommandTypes.LookAt,
            LookAtTarget: lookAtTarget,
            TrackFlag: shouldTrack,
            LevelHeadFlag: levelHead
        };
    }

    /**
     * @method Requester.lookAt#position
     * @description Look toward a 3D point in space.
     * @param  {Vector3}     target 3D point to look at (`[x, y, z]`).
     * @param  {boolean}     [levelHead=true] `true` to keep Jibo's head level while he moves.
     * @return {LookAtToken}
     */
    public position(target:JIBO.v1.Vector3, levelHead:boolean = true):LookAtToken {
        const protocol = LookAt.generateProtocol(TargetMode.Position, target, levelHead, false);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.lookAt#angle
     * @description Look at an angle.
     * @param  {AngleVector}    target Angle to look at (`[theta, psi]`).
     * @param  {boolean}        [levelHead=true] `true` to keep Jibo's head level while he moves.
     * @return {LookAtToken}
     */
    public angle(target:JIBO.v1.AngleVector, levelHead:boolean = true):LookAtToken {
        const protocol = LookAt.generateProtocol(TargetMode.Angle, target, levelHead, false);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.lookAt#screenPosition
     * @description Look at a point relative to Jibo's screen.
     * @param  {Vector2}     target Point to look at (`[x, y, width, height]`).
     * @param  {boolean}     [levelHead=true] `true` to keep Jibo's head level while he moves.
     * @return {LookAtToken}
     */
    public screenPosition(target:JIBO.v1.Vector2, levelHead:boolean = true):LookAtToken {
        const protocol = LookAt.generateProtocol(TargetMode.Screen, target, levelHead, false);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.lookAt#entity
     * @description Look at an entity (usually a face).
     * @param  {LookAtEntity}   target Entity to look at.
     * @param  {boolean}        [levelHead=true] `true` to keep Jibo's head level while he moves.
     * @return {LookAtToken}
     */
    public entity(target:JIBO.v1.LookAtEntity, shouldTrack:boolean, levelHead:boolean = true):LookAtToken {
        const protocol = LookAt.generateProtocol(TargetMode.Entity, target, levelHead, shouldTrack);
        return this.generateToken(protocol, true);
    }

    /**
     * @method Requester.lookAt#generateToken
     * @description Create LookAtToken from LookAtRequest protocol.
     * @param {LookAtRequest} protocol - LookAtRequest protocol to generate a LookAtToken from.
     * @param {boolean} [andSend=false] - `True` if the generated LookAtToken should also be sent as a request.
     * @return {LookAtToken}
     * @intdocs
     */
    public generateToken(protocol: JIBO.v1.LookAtRequest, andSend=false): LookAtToken {
        const token = new LookAtToken(this.owner, protocol);
        if (andSend) {
            super.sendToken(token);
        }
        return token;
    }

    /**
     * Send LookAtToken request.
     * <p>NOTE: Implementation in base class {@link RequestAPI}</p>
     * @method Requester.lookAt#sendToken
     * @param {LookAtToken} token - LookAtToken to send.
     * @intdocs
     */
}