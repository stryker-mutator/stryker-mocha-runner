import { expect } from 'chai';
import MochaTestFramework from '../../src/MochaTestFramework';

describe('MochaTestFramework', () => {
  let sut: MochaTestFramework;
  beforeEach(() => sut = new MochaTestFramework({ options: {} }));

  describe('beforeEach()', () => {
    it('should result in a beforeEach mocha hook', () =>
      expect(sut.beforeEach('fragment')).to.contain('fragment').and.to.contain('beforeEach'));
  });

  describe('afterEach()', () => {
    it('should result in an afterEach mocha hook', () =>
      expect(sut.afterEach('fragment')).to.contain('fragment').and.to.contain('afterEach'));
  });

  describe('filter()', () => {
    it('should result in a filtering of mocha it\'s', () =>
      expect(sut.filter([5, 8]))
        .to.contain('if([5,8].indexOf(current) >= 0){')
        .and.to.contain('realIt.apply(global, arguments);'));
  });
});