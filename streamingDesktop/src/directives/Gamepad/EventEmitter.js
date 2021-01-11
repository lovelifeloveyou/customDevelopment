export default class EventEmitter {
  constructor() {
    this._events = {};
    this.on = this.addEventListener;
    this.off = this.removeEventListener;
  }
  emit(name, data) {
    if (!this._events.hasOwnProperty(name)) {
      return;
    }

    const callbacks = this._events[name];
    const event = { type: name, detail: data };

    for (let length = callbacks.length, i = 0; i < length; i++) {
      this.handle(callbacks[i], event);
    }
  }

  handle(callback, event) {
    callback(event);
  }

  addEventListener(name, callback) {
    if (!this._events.hasOwnProperty(name)) {
      this._events[name] = [];
    }

    if (this._events[name].indexOf(callback) < 0) {
      this._events[name].push(callback);
    }
  }

  removeEventListener(name, callback) {
    if (!this._events.hasOwnProperty(name)) {
      return;
    }

    const callbacks = this._events[name];
    const index = callbacks.indexOf(callback);

    if (index >= 0) {
      callbacks.splice(index, 1);
    }

    if (callbacks.length === 0) {
      delete this._events[name];
    }
  }
}