import GamepadHandler from './GamepadHandler'
import EventEmitter from './EventEmitter'
import Loop from './Loop'

export default class GamepadListener extends EventEmitter {
  constructor(options = {}) {
    super();

    if (typeof navigator.getGamepads !== 'function') {
      throw new Error('This browser does not support gamepad API.');
    }

    this.options = options;
    this.onAxis = this.onAxis.bind(this);

    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.discover = this.discover.bind(this);
    this.onButton = this.onButton.bind(this);

    this.handlers = new Array(4).fill(null);
    this.loop = new Loop(this.update);

    window.addEventListener('error', this.stop);
  }

  start() {
    this.loop.start();
  }

  stop() {
    this.loop.stop();
  }

  update() {
    const gamepads = navigator.getGamepads();
    this.discover(gamepads[0], 0);
    this.discover(gamepads[1], 1);
    this.discover(gamepads[2], 2);
    this.discover(gamepads[3], 3);
  }

  discover(gamepad, index) {
    if (gamepad) {
      if (!this.handlers[index]) {
        this.registerHandler(index, gamepad);
      }

      this.handlers[index].update(gamepad);
    } else {
      if (this.handlers[index]) {
        this.removeGamepad(index);
      }
    }
  }

  registerHandler(index, gamepad) {
    if (this.handlers[index]) {
      throw new Error(`Gamepad #${index} is already registered.`);
    }

    const handler = new GamepadHandler(index, gamepad, this.options);

    this.handlers[index] = handler;

    handler.addEventListener('axis', this.onAxis);
    handler.addEventListener('button', this.onButton);

    this.emit('gamepad:connected', { index, gamepad });
    this.emit(`gamepad:${index}:connected`, { index, gamepad });
  }

  removeGamepad(index) {
    if (!this.handlers[index]) {
      throw new Error(`Gamepad #${index} is not registered.`);
    }

    this.handlers[index].removeEventListener('axis', this.onAxis);
    this.handlers[index].removeEventListener('button', this.onButton);
    this.handlers[index] = null;

    this.emit('gamepad:disconnected', { index });
    this.emit(`gamepad:${index}:disconnected`, { index });
  }

  onAxis(event) {
    const { index } = event.detail;

    this.emit('gamepad:axis', event.detail);
    this.emit(`gamepad:${index}:axis`, event.detail);
    this.emit(`gamepad:${index}:axis:${event.detail.axis}`, event.detail);
  }

  onButton(event) {
    const { index } = event.detail;

    this.emit('gamepad:button', event.detail);
    this.emit(`gamepad:${index}:button`, event.detail);
    this.emit(`gamepad:${index}:button:${event.detail.button}`, event.detail);
  }
}