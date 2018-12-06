/**
 * Enum of TakePhoto events.
 * @intdocs
 * @typedef PhotoEvents
 * @prop TakePhoto `onTakePhoto`
 */
export const PhotoEvents: {
    TakePhoto: JIBO.v1.PhotoEvents.TakePhoto;
} = {
    TakePhoto: 'onTakePhoto'
};

/**
 * Enum of video events
 * @typedef VideoEvents
 * @intdocs
 * @prop VideoReady `onVideoReady`
 */
export const VideoEvents: {
    VideoReady: JIBO.v1.VideoEvents.VideoReady;
} = {
    VideoReady: 'onVideoReady'
};

/**
 * @description Enum of skill disconnect reasons
 * @typedef DisconnectReason
 * @prop 4000 Skill closed by user
 * @prop 4001 Skill closed due to robot error
 * @prop 4002 Incoming connection is replacing previous connection
 * @prop 4003 Connection closed due to inactivity
 * @prop 4004 Session closed due to reconnection time out
 * @prop 4005 Session closed due to failed reconnection
 */
export const DisconnectReason:JIBO.v1.DisconnectReason = {
    4000: 'Skill closed by user',
    4001: 'Skill closed due to robot error',
    4002: 'Incoming connection is replacing previous connection',
    4003: 'Connection closed due to inactivity',
    4004: 'Session closed due to reconnection time out',
    4005: 'Session closed due to failed reconnection'
};

/**
 * Enum of websocket close codes
 * @typedef DisconnectCode
 * @intdocs
 * @prop HeadTouchExit `4000` - The Remote skill was exited via head touch on robot
 * @prop RobotError `4001` - The Remote skill was exited due to an error on the robot resulting in the error display taking over.
 * @prop NewConnection `4002` - A new Remote connection is superseding the existing one.
 * @prop InactivityTimeout `4003` - The connection was closed due to inactivity (no commands sent)
 * @prop ReconnectTimeout `4004` - Session timed out waiting for reconnect
 * @prop ReconnectError `4005` - Session unable to wait for a reconnect
 */
export const DisconnectCode: {
    HeadTouchExit: JIBO.v1.DisconnectCodes.HeadTouchExit;
    RobotError: JIBO.v1.DisconnectCodes.RobotError;
    NewConnection: JIBO.v1.DisconnectCodes.NewConnection;
    InactivityTimeout: JIBO.v1.DisconnectCodes.InactivityTimeout;
    ReconnectTimeout: JIBO.v1.DisconnectCodes.ReconnectTimeout;
    ReconnectError: JIBO.v1.DisconnectCodes.ReconnectError;
} = {
    HeadTouchExit: 4000,
    RobotError: 4001,
    NewConnection: 4002,
    InactivityTimeout: 4003,
    ReconnectTimeout: 4004,
    ReconnectError: 4005,
};

/**
 * @typedef ResponseStrings
 * @intdocs
 * @description Maps the [Response Code]{@link ResponseCode} numbers to their strings (i.e. `200` = `OK`, `404` = `NotFound`, etc).
 */
export const ResponseStrings:JIBO.v1.ResponseStrings = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    400: 'Bad Request',
    403: 'Forbidden',
    404: 'Not Found',
    406: 'Not Acceptable',
    407: 'Request Timeout',
    409: 'Conflict',
    412: 'Precondition Failed',
    500: 'Internal Error',
    503: 'Service Unavailable',
    505: 'Version Not Supported',
    506: 'Version Conflict'
};

/**
 * Enum of Jibo's available attention modes.
 * @typedef AttentionMode
 * @prop Off
 * @prop Idle
 * @prop Disengage
 * @prop Engaged
 * @prop Speaking
 * @prop Fixated
 * @prop Attractable
 * @prop Menu
 * @prop Command
 */
export const AttentionMode: {
    Off:JIBO.v1.AttentionModes.Off;
    Idle:JIBO.v1.AttentionModes.Idle;
    Disengage:JIBO.v1.AttentionModes.Disengage;
    Engaged:JIBO.v1.AttentionModes.Engaged;
    Speaking:JIBO.v1.AttentionModes.Speaking;
    Fixated:JIBO.v1.AttentionModes.Fixated;
    Attractable: JIBO.v1.AttentionModes.Attractable;
    Menu :JIBO.v1.AttentionModes.Menu;
    Command:JIBO.v1.AttentionModes.Command;
} = {
    Off:'OFF',
    Idle:'IDLE',
    Disengage:'DISENGAGE',
    Engaged:'ENGAGED',
    Speaking:'SPEAKING',
    Fixated:'FIXATED',
    Attractable: 'ATTRACTABLE',
    Menu :'MENU',
    Command:'COMMAND'
};

/**
 * @typedef CommandTypes
 * @intdocs
 * @description Enum of command types.
 * @prop StartSession
 * @prop GetConfig
 * @prop SetConfig
 * @prop Cancel
 * @prop Display
 * @prop SetAttention
 * @prop Say
 * @prop Listen
 * @prop LookAt
 * @prop TakePhoto
 * @prop Video
 * @prop Subscribe
 * @prop FetchAsset
 * @prop VideoPlayback
 * @prop UnloadAsset
 */
export const CommandTypes: {
        StartSession: JIBO.v1.Commands.StartSession;
        GetConfig: JIBO.v1.Commands.GetConfig;
        SetConfig: JIBO.v1.Commands.SetConfig;
        Cancel: JIBO.v1.Commands.Cancel;
        Display: JIBO.v1.Commands.Display;
        SetAttention: JIBO.v1.Commands.SetAttention;
        Say: JIBO.v1.Commands.Say;
        Listen: JIBO.v1.Commands.Listen;
        LookAt: JIBO.v1.Commands.LookAt;
        TakePhoto: JIBO.v1.Commands.TakePhoto;
        Video: JIBO.v1.Commands.Video;
        Subscribe: JIBO.v1.Commands.Subscribe;
        FetchAsset: JIBO.v1.Commands.FetchAsset;
        VideoPlayback: JIBO.v1.Commands.VideoPlayback;
        UnloadAsset: JIBO.v1.Commands.UnloadAsset;

} = {
    StartSession: 'StartSession',
    GetConfig: 'GetConfig',
    SetConfig: 'SetConfig',
    Cancel: 'Cancel',
    Display: 'Display',
    SetAttention: 'SetAttention',
    Say: 'Say',
    Listen: 'Listen',
    LookAt: 'LookAt',
    TakePhoto: 'TakePhoto',
    Video: 'Video',
    Subscribe: 'Subscribe',
    FetchAsset: 'FetchAsset',
    VideoPlayback: 'VideoPlayback',
    UnloadAsset: 'UnloadAsset'
};

/**
 * Enum of async command events.
 * @typedef AsyncCommandEvent
 * @intdocs
 * @prop Start `onStart` - Asynchronous command has started.
 * @prop Stop `onStop` - Asynchronous command has stopped.
 * @prop Error `onError` - An attempt to move from Requested to Start resulted in an Error.
 */
export const AsyncCommandEvent:{
    Start:JIBO.v1.AsyncCommandEvents.Start;
    Stop:JIBO.v1.AsyncCommandEvents.Stop;
    Error:JIBO.v1.AsyncCommandEvents.Error;
} = {
    Start: "onStart",
    Stop: "onStop",
    Error: "onError",
};

/**
 * Enum of display events.
 * @typedef DisplayEvents
 * @intdocs
 * @prop ViewStateChange `onViewStateChange`
 */
export const DisplayEvents:{
    ViewStateChange: JIBO.v1.DisplayEvents.ViewStateChange;
} = {
    ViewStateChange: 'onViewStateChange'
};

/**
 * Enum of possible view states
 * @intdocs
 * @typedef ViewStates
 * @prop Opened
 * @prop Closed
 */
export const ViewStates: {
    Opened: JIBO.v1.ViewStates.Opened;
    Closed: JIBO.v1.ViewStates.Closed;
} = {
    Opened: 'Opened',
    Closed: 'Closed'
};

/**
 * @typedef DisplayViewType
 * @description Enum of available display types
 * @prop Eye Display Jibo's eye on screen.
 * @prop Text Display text on screen.
 * @prop Image Display an image on screen.
 */
export const DisplayViewType: {
    Eye:JIBO.v1.DisplayViews.Eye;
    Text:JIBO.v1.DisplayViews.Text;
    Image:JIBO.v1.DisplayViews.Image;
} = {
    Eye: 'Eye',
    Text: 'Text',
    Image: 'Image',
};

/**
 * @typedef LookAtEvents
 * @intdocs
 * @prop LookAtAchieved `onLookAtAchieved`
 * @prop TrackEntityLost `onTrackEntityLost`
 */
export const LookAtEvents: {
    LookAtAchieved: JIBO.v1.LookAtEvents.LookAtAchieved;
    TrackEntityLost: JIBO.v1.LookAtEvents.TrackEntityLost;
} = {
    LookAtAchieved: 'onLookAtAchieved',
    TrackEntityLost: 'onTrackEntityLost'
};

/**
 * Enum of speech events.
 * @intdocs
 * @typedef HotWordEvents
 * @prop HotWordHeard `onHotWordHeard`
 * @prop ListenResult `onListenResult`
 */
export const HotWordEvents: {
    HotWordHeard:JIBO.v1.HotWordEvents.HotWordHeard;
    ListenResult:JIBO.v1.HotWordEvents.ListenResult;
} = {
    HotWordHeard: 'onHotWordHeard',
    ListenResult: 'onListenResult'
};

/**
 * @typedef StreamTypes
 * @intdocs
 * @description Enum of stream types.
 * @prop Entity
 * @prop Speech
 * @prop HeadTouch
 * @prop Motion
 * @prop ScreenGesture
 */
export const StreamTypes: {
        Entity:JIBO.v1.Streams.Entity;
        HotWord:JIBO.v1.Streams.HotWord;
        HeadTouch:JIBO.v1.Streams.HeadTouch;
        Motion:JIBO.v1.Streams.Motion;
        ScreenGesture:JIBO.v1.Streams.ScreenGesture;
} = {
    Entity: 'Entity',
    HotWord: 'HotWord',
    HeadTouch: 'HeadTouch',
    Motion: 'Motion',
    ScreenGesture: 'ScreenGesture'
};

/**
 * @typedef ListenEvents
 * @intdocs
 * @description Enum of listen events.
 * @prop ListenResult `onListenResult`
 */
export const ListenEvents: {
    ListenResult: JIBO.v1.ListenEvents.ListenResult
} = {
    ListenResult: 'onListenResult'
};

/**
 * @typedef ListenStopReasons
 * @intdocs
 * @description Enum of unsuccessful listen stop reasons.
 * @prop NoInput `NoInput`
 * @prop NoMatch `NoMatch`
 * @prop Interrupted `Interrupted`
 */
export const ListenStopReasons: {
    NoInput: JIBO.v1.ListenStopReasons.NoInput,
    NoMatch: JIBO.v1.ListenStopReasons.NoMatch,
    Interrupted: JIBO.v1.ListenStopReasons.Interrupted,
} = {
    NoInput: 'NoInput',
    NoMatch: 'NoMatch',
    Interrupted: 'Interrupted'
};

/**
 * Enum of entity track events.
 * @intdocs
 * @typedef EntityTrackEvents
 * @prop TrackUpdate `onEntityUpdate`
 * @prop TrackLost `onEntityLost`
 * @prop TrackGained `onEntityGained`
 */
export const EntityTrackEvents: {
    TrackUpdate: JIBO.v1.EntityTrackEvents.TrackUpdate;
    TrackLost: JIBO.v1.EntityTrackEvents.TrackLost;
    TrackGained: JIBO.v1.EntityTrackEvents.TrackGained;
} = {
    TrackUpdate: 'onEntityUpdate',
    TrackLost: 'onEntityLost',
    TrackGained: 'onEntityGained',
};

/**
 * Enum of motion track events.
 * @intdocs
 * @typedef MotionEvents
 * @prop MotionDetected `onMotionDetected`
 */
export const MotionEvents: {
    MotionDetected: JIBO.v1.MotionEvents.MotionDetected;
} = {
    MotionDetected: 'onMotionDetected'
};

/**
 * Enum of headtouch events.
 * @intdocs
 * @typedef HeadTouchEvents
 * @prop HeadTouched `onHeadTouch`
 */
export const HeadTouchEvents: {
    HeadTouched: JIBO.v1.HeadTouchEvents.HeadTouched;
} = {
    HeadTouched: 'onHeadTouch'
};

/**
 * Enum of screen gesture events.
 * @intdocs
 * @typedef ScreenGestureEvents
 * @prop Tap `onTap`
 * @prop Swipe `onSwipe`
 */
export const ScreenGestureEvents: {
    Tap:JIBO.v1.ScreenGestureEvents.Tap;
    Swipe:JIBO.v1.ScreenGestureEvents.Swipe;
} = {
    Tap: 'onTap',
    Swipe: 'onSwipe'
};

/**
 * Enum of config events.
 * @intdocs
 * @typedef ConfigEvents
 * @prop onConfig `onConfig`
 */
export const ConfigEvents: {
    onConfig: JIBO.v1.ConfigEvents.onConfig
} = {
    onConfig: 'onConfig'
};


/**
 * Enum of asset events.
 * @intdocs
 * @typedef FetchAssetEvents
 * @prop AssetReady `onAssetReady`
 * @prop AssetFailed `onAssetFailed`
 */
export const FetchAssetEvents: {
    AssetReady: JIBO.v1.FetchAssetEvents.AssetReady;
    AssetFailed: JIBO.v1.FetchAssetEvents.AssetFailed;
} = {
    AssetReady: 'onAssetReady',
    AssetFailed: 'onAssetFailed'
};


/**
 * Enum of unload asset events.
 * @intdocs
 * @typedef UnloadAssetEvents
 * @prop UnloadAssetFailed `onUnloadAssetFailed`
 * @prop UnloadAssetDone `onUnloadAssetDone`
 */
export const UnloadAssetEvents: {
    UnloadAssetDone: JIBO.v1.UnloadAssetEvents.UnloadAssetDone;
    UnloadAssetFailed: JIBO.v1.UnloadAssetEvents.UnloadAssetFailed;
} = {
    UnloadAssetDone: 'onUnloadAssetDone',
    UnloadAssetFailed: 'onUnloadAssetFailed'
};

/**
 * @typedef CameraResolution
 * @description Enum of camera resolutions
 * @prop HighRes Currently unsupported
 * @prop MedRes Higher res than default
 * @prop LowRes Default
 * @prop MicroRes Lower res than default
 */
export const CameraResolution: {
    HighRes: JIBO.v1.CameraResolutions.HighRes;
    MedRes: JIBO.v1.CameraResolutions.MedRes;
    LowRes: JIBO.v1.CameraResolutions.LowRes;
    MicroRes: JIBO.v1.CameraResolutions.MicroRes;
} = {
    HighRes: 'highRes',
    MedRes: 'medRes',
    LowRes: 'lowRes',
    MicroRes: 'microRes'
};

/**
 * Enum of available swipe directions.
 * @typedef SwipeDirection
 * @prop Up
 * @prop Down
 * @prop Right
 * @prop Left
 */
export const SwipeDirection: {
    Up: JIBO.v1.SwipeDirections.Up;
    Down: JIBO.v1.SwipeDirections.Down;
    Right: JIBO.v1.SwipeDirections.Right;
    Left: JIBO.v1.SwipeDirections.Left;
} = {
    Up: 'Up',
    Down: 'Down',
    Right: 'Right',
    Left: 'Left'
};

/**
 * Camera options.
 * @typedef Camera
 * @prop left Default
 * @prop right Currently unsupported
 */
export const Camera: {
    Left: JIBO.v1.Cameras.Left;
    Right: JIBO.v1.Cameras.Right;
} = {
    Left: 'left',
    Right: 'right'
};

/**
 * Enum of entity (face) types.
 * @typedef EntityType
 * @prop person Face is a loop member.
 * @prop unknown Face is not a loop member.
 */
export const EntityType: {
    Person: JIBO.v1.Entities.Person;
    Unknown: JIBO.v1.Entities.Unknown;
} = {
    Person: 'person',
    Unknown: 'unknown'
};

/**
 * @typedef DisplayErrorDetails
 * @intdocs
 * @prop IdNotUnique View id is not unique
 * @prop MissingValues View was not given required values
 * @prop InvalidViewType View type is not valid
 * @prop AssetError Unable to access assets for display
 */
export const DisplayErrorDetails:JIBO.v1.DisplayErrorDetails = {
    IdNotUnique: 'View id is not unique',
    //response code 406 (NotAcceptable)
    MissingValues: 'View was not given required values',
    //response code 406 (NotAcceptable)
    InvalidViewType: 'View type is not valid',
    //response code 400 (BadRequest)
    AssetError: 'Unable to access assets for display',
};

/**
 * @typedef DisplayChangeType
 * @description Enum of ways to change display
 * @prop Swap Swap the current view for another
 */
export const DisplayChangeType: {
    Swap: JIBO.v1.DisplayChanges.Swap;
} = {
    Swap: 'Swap'
};

/**
 * @typedef FetchAssetErrorDetails
 * @intdocs
 * @prop OutOfMemory {string} [Response Code]{@link ResponseCode}
 *       406 (NotAcceptable) - Out of memory
 * @prop InvalidURI {string} [Response Code]{@link ResponseCode}
 *       406 (NotAcceptable) - Invalid or Inaccessible URI
 */
export const FetchAssetErrorDetails:JIBO.v1.FetchAssetErrorDetails = {
    OutOfMemory: 'Out of memory',
    InvalidURI: 'Invalid or Inaccessible URI'
};

/**
 * @typedef UnloadAssetErrorDetails
 * @intdocs
 * @prop InvalidName {string}
 *       406 (NotAcceptable) - Invalid or Inaccessible Name
 */
export const UnloadAssetErrorDetails:JIBO.v1.UnloadAssetErrorDetails = {
    InvalidName: 'Invalid or Inaccessible Name'
};
/**
 * @typedef ResponseCode
 * @description Enum of response codes
 * @prop OK `200` - The command was accepted and executed. Synchronous calls only.
 * @prop Created `201` - The command was accepted and executed. Synchronous calls only.
 * @prop Accepted `202` - The command was accepted and will begin execution. Most asynchronous commands will get a this response.
 * @prop BadRequest `400` - Badly formatted request.
 * @prop Forbidden `403` - The command request is not a supported command.
 * @prop NotFound `404` - Command not found.
 * @prop NotAcceptable `406` - The data in the command is not acceptable.
 * @prop RequestTimeout `407 - Unable to marshal the resources and set up the command within the time limits set in the Controller.
 * @prop Conflict `409` - There is a conflicting command already executing
 * @prop PreconditionFailed `412` - The execution of the command requires the execution of a prior command.
 * @prop InternalError `500` - The Controller has crashed or hit a different error that was unexpected.
 * @prop ServiceUnavailable `503` - The Controller is temporarily unavailable. The Robot SSM may be rebooting something.
 * @prop VersionNotSupported `505` - The Version requested is not supported.
 * @prop VersionConflict `506` - The Version requested is not the same version of the current connection.
 */
export const ResponseCode: {
    OK: JIBO.v1.ResponseCodes.OK;
    Created: JIBO.v1.ResponseCodes.Created;
    Accepted: JIBO.v1.ResponseCodes.Accepted;
    BadRequest: JIBO.v1.ResponseCodes.BadRequest;
    Forbidden: JIBO.v1.ResponseCodes.Forbidden;
    NotFound: JIBO.v1.ResponseCodes.NotFound;
    NotAcceptable: JIBO.v1.ResponseCodes.NotAcceptable;
    RequestTimeout: JIBO.v1.ResponseCodes.RequestTimeout;
    Conflict: JIBO.v1.ResponseCodes.Conflict;
    PreconditionFailed: JIBO.v1.ResponseCodes.PreconditionFailed;
    InternalError: JIBO.v1.ResponseCodes.InternalError;
    ServiceUnavailable: JIBO.v1.ResponseCodes.ServiceUnavailable;
    VersionNotSupported: JIBO.v1.ResponseCodes.VersionNotSupported;
    VersionConflict: JIBO.v1.ResponseCodes.VersionConflict;
} = {
    OK: 200,
    Created: 201,
    Accepted: 202,
    BadRequest: 400,
    Forbidden: 403,
    NotFound: 404,
    NotAcceptable: 406,
    RequestTimeout: 407,
    Conflict: 409,
    PreconditionFailed: 412,
    InternalError: 500,
    ServiceUnavailable: 503,
    VersionNotSupported: 505,
    VersionConflict: 506
};

/**
 * @typedef VideoType
 * @description Enum of video types
 * @prop Normal `NORMAL` Default
 * @prop Debug `DEBUG` Currently unsupported.
 */
export const VideoType: {
    Normal: JIBO.v1.Videos.Normal;
    Debug: JIBO.v1.Videos.Debug;
} = {
    Normal: 'NORMAL',
    Debug: 'DEBUG'
};

/**
 * @typedef ProtocolVersions
 * @description Two of everything! `JIBO.ProtocolVersions` lives in Phoenix repos.
 * @prop v1 {JIBO.ProtocolVersions.v1} `1.0`
 * @prop v2 {JIBO.ProtocolVersions.v2} `2.0`
 */
export const ProtocolVersions: {
    v1: JIBO.ProtocolVersions.v1;
    v2: JIBO.ProtocolVersions.v2;
} = {
    v1: '1.0',
    v2: '2.0'
};
