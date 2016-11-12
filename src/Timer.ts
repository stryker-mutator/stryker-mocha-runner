
const RealDate = Date;
export default class Timer {
  private start: Date;

  constructor() {
    this.reset();
  }

  reset() {
    this.start = new RealDate();
  }

  elapsedMs() {
    return new RealDate().getTime() - this.start.getTime();
  }
}