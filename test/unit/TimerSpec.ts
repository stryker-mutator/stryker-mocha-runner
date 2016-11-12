import { expect } from 'chai';
import Timer from '../../src/Timer';

describe('Timer', () => {
  let sut: Timer;

  beforeEach(() => {
    sut = new Timer();
  });

  describe('when global Date object is mocked', () => {
    let RealDate = global.Date;
    beforeEach(() => {
      (<any>global).Date = () => ({ getTime: () => -2000 });
    });

    afterEach(() => {
      (<any>global).Date = RealDate;
    });

    it('should work even when global Date object is mocked', () => {
      expect(sut.elapsedMs()).not.to.be.eq(-1478947128169);
    });

  });
});
