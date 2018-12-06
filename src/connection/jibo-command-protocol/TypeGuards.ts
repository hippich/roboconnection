export function isEvent(message:JIBO.v1.Acknowledgement|JIBO.v1.EventMessage): message is JIBO.v1.EventMessage {
    return message.hasOwnProperty('EventBody');
}

export function isAcknowledgement(message:JIBO.v1.Acknowledgement|JIBO.v1.EventMessage): message is JIBO.v1.Acknowledgement {
    return message.hasOwnProperty('Response');
}

export function isAngleTarget(target:JIBO.v1.LookAtTarget): target is JIBO.v1.AngleTarget {
    return target.hasOwnProperty('Angle');
}

export function isEntityTarget(target:JIBO.v1.LookAtTarget): target is JIBO.v1.EntityTarget {
    return target.hasOwnProperty('Entity');
}

export function isPositionTarget(target:JIBO.v1.LookAtTarget): target is JIBO.v1.PositionTarget {
    return target.hasOwnProperty('Position');
}

export function isCameraTarget(target:JIBO.v1.LookAtTarget): target is JIBO.v1.CameraTarget {
    return target.hasOwnProperty('ScreenCoords');
}