export interface Handler <Type> {
  (data?: Type): void;
}

export enum EmitterMode {
  ALL_HANDLERS = 'ALL_HANDLERS',
  FIRST_HANDLER = 'FIRST_HANDLER',
  LAST_HANDLER = 'LAST_HANDLER'
}


export class Event <Type> {

  private _onceEvents = new Map<Handler<Type>, Handler<Type>>();
  private _events: Handler<Type>[] = [];
  private _maxListeners = 10;

  /*
   * Mode of order to emit events.
   * In Stack mode, only emits to last event subscribed
   * @type {enum}
   */
  private _emitterMode:EmitterMode = EmitterMode.ALL_HANDLERS;

  /*
   * Creates an Event object
   * @param {String} name Name of event
   */
  constructor(public name: string) {

  }

  /*
   * Returns a list of currently subscribed handlers
   */
  listeners(): Handler<Type>[] {
    return this._events.slice();
  }


  /*
   * Sets the maximum number of listeners
   * @param {number} n
   * @returns {Event} this
   */
  setMaxListeners(n: number) {
    this._maxListeners = n;
    return this;
  }

  /*
   * Gets the maximum number of listeners
   * @returns {number}
   */
  getMaxListeners() {
    return this._maxListeners;
  }

  /*
   * Subscribes a handler function to only the next event
   * @return {Event} this
   */
  once(handler: Handler<Type>) {
    let handlerWrapper:any = this._onceEvents.get(handler);
    if (!handlerWrapper) {
      handlerWrapper = (data:any) => {
        this._onceEvents.delete(handler);
        this.removeListener(handlerWrapper);
        handler(data);
      };
      this._onceEvents.set(handler, handlerWrapper);
    }

    return this.on(handlerWrapper);
  }

  /*
   * Subscribes a handler function to this event
   * @return {Event} this
   */
  on(handler: Handler<Type>) {
    if (this._events.length >= this._maxListeners) {
      console.warn(`Event '${this.name}': Max listeners ${this._maxListeners} reached. `, new Error().stack);
    }
    this._events.push(handler);
    return this;
  }

  /*
   * Unsubscribes most recently added subscriber
   * @return {Event} this
   */
  removeLastListener() {
    this._events.splice(this._events.length - 1, 1);
  }

  /*
   * Unsubscribes oldest added subscriber
   * @return {Event} this
   */
  removeFirstListener() {
    // if events is empty, no error; still gives empty array.
    this._events.splice(0, 1);
  }


  /*
   * Subscribes a handler function to this event
   * @return {Event} this
   */
  addListener(handler: Handler<Type>) {
    return this.on(handler);
  }

  /*
   * Unsubscribes a handler function from this event
   * @param {Handler} handler
   * @return {Event} this
   */
  removeListener(handler: Handler<Type>) {
    // We remove the handler if it has been provided through `on`
    let index = this._events.indexOf(handler);
    while (index !== -1) {
      this._events.splice(index, 1);
      index = this._events.indexOf(handler, index);
    }

    // We remove the handler if it has been provided through `once`
    const onceHandler = this._onceEvents.get(handler);
    if (onceHandler) {
      let index = this._events.indexOf(onceHandler);
      while (index !== -1) {
        this._events.splice(index, 1);
        index = this._events.indexOf(onceHandler, index);
      }
      this._onceEvents.delete(handler);
    }

    return this;
  }

  /*
   * Unsubscribes a handler function from this event (alias for removeListener)
   * @param {Handler} handler
   * @return {Event} this
   */
  off(handler: Handler<Type>) {
    return this.removeListener(handler);
  }

  /*
   * Unsubscribes all handler functions from this event
   * @return {Event} this
   */
  removeAllListeners() {
    this._events = [];
    this._onceEvents.clear();
    return this;
  }

  /*
   * Fires off an instance of this event with optional data
   * @param {Type} [data] The data of the event
   * @return {boolean} true if the event has any listeners, false otherwise
   */
  emit(data?: Type) {

    if (this._emitterMode === EmitterMode.ALL_HANDLERS) {
      // We start by creating a copy of handlers
      // this is required to make sure that no handler modifies the
      // underlying collection which could result in one or more
      // handlers not being called
      let copy = this.listeners();

      for (let i = 0; i < copy.length; i++ ) {
        let handler: any = copy[i] as any;
        handler(data);
      }
    }
    // Last handler only
    else if (this._emitterMode === EmitterMode.LAST_HANDLER) {
      let handler: any = this._events[this._events.length - 1];
      if (handler) {
        handler(data);
      }
      return !!handler;
    }
    // First handler only, return true if
    else if (this._emitterMode === EmitterMode.FIRST_HANDLER) {
      let handler: any = this._events[0];
      if (handler) {
        handler(data);
      }
      return !!handler;
    }

    return this._events.length > 0;
  }


  /*
   * Sets mode to stack; event only emits to last subscriber
   * @param {enum} mode of event to set
   */
  public setMode(mode:EmitterMode) {
    if(!EmitterMode[mode]) {
      throw new Error("Emitter mode of typed events must be ALL_HANDLERS, FIRST_HANDLER, or LAST_HANDLER");
    }
    this._emitterMode = mode;
  }

  /*
   * Waits for event to occur.
   * @param {number} [timeoutMs=-1] Timeout while waiting for event
   * @return {Promise<any>} Resolved with event payload or rejected with 'TIMEOUT' if times out
   */
  public waitFor(timeoutMs = -1): Promise<Type> {
    return new Promise( (resolve, reject) => {
      let timeoutHandle: any;

      const eventHandler:any = (data:any) => {
        if (timeoutHandle) {
          clearTimeout(timeoutHandle);
        }
        resolve(data);
      };

      // Connect timeout handler
      if (timeoutMs > 0) {
        timeoutHandle = setTimeout(() => {
          this.removeListener(eventHandler);
          reject('TIMEOUT');
        }, timeoutMs);
      }

      this.once(eventHandler);
    });
  }

  /*
   * Returns the number of listeners
   * @returns {number}
   */
  listenerCount() {
    return this._events.length;
  }
}