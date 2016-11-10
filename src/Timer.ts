
export default class Timer {
  private start: Date;

  constructor() {
    this.reset();
  }

  reset() {
    this.start = new Date();
  }

  elapsedMs() {
    return new Date().getTime() - this.start.getTime();
  }
}