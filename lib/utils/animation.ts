/**
 * Runs a callback on every animation frame until stopped, wrapping
 * `window.requestAnimationFrame` in a start/stop lifecycle.
 *
 * @example
 * const wrapper = new RequestAnimationFrameWrapper()
 * wrapper.start(() => updateScrollPosition())
 * // later
 * wrapper.stop()
 */
export class RequestAnimationFrameWrapper {
  live: boolean
  callback: () => void

  constructor() {
    this.live = false
    this.callback = () => null
  }

  /**
   * Begin invoking the callback on every animation frame.
   *
   * @param callback - The function to run on each frame.
   */
  start(callback: () => void) {
    this.live = true
    this.callback = callback
    this.schedule()
  }

  /**
   * Stop invoking the callback and reset it to a no-op.
   */
  stop() {
    this.live = false
    this.callback = () => null
  }

  /**
   * Run the callback once, then queue the next frame while still live.
   */
  schedule() {
    this.callback()
    if (this.live) {
      window.requestAnimationFrame(this.schedule.bind(this))
    }
  }
}
