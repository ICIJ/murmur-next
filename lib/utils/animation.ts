export class RequestAnimationFrameWrapper {
  live: boolean;
  callback: () => void;

  constructor() {
    this.live = false;
    this.callback = () => null;
  }
  start(callback: () => void) {
    this.live = true;
    this.callback = callback;
    this.schedule();
  }
  stop() {
    this.live = false;
    this.callback = () => null;
  }
  schedule() {
    this.callback();
    if (this.live) {
      window.requestAnimationFrame(this.schedule.bind(this));
    }
  }
}
