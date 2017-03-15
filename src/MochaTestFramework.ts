import { TestFramework, TestFrameworkSettings } from 'stryker-api/test_framework';

export default class MochaTestFramework implements TestFramework {
  constructor(private settings: TestFrameworkSettings) { }

  beforeEach(codeFragment: string): string {
    return `beforeEach(function() {
      ${codeFragment}
    });`;
  }

  afterEach(codeFragment: string): string {
    return `afterEach(function() {
      ${codeFragment}
    });`;
  }

  filter(testIds: number[]) {
    return `
      var mocha = window.mocha;
      if (window.____mochaAddTest) {
        if (mocha.Suite && mocha.Suite.prototype) {
          mocha.Suite.prototype.addTest = window.____mochaAddTest;
        } else {
          mocha.suite.addTest = window.____mochaAddTest;
        }
      } else {
        if (mocha.Suite && mocha.Suite.prototype) {
          window.____mochaAddTest = mocha.Suite.prototype.addTest
        } else {
          window.____mochaAddTest = mocha.suite.addTest
        }
      }
      var current = 0;
      var realAddTest;
      var replacementFunction = function () {
        if (${JSON.stringify(testIds)}.indexOf(current) > -1) {
          realAddTest.apply(this, arguments);
        }
        current++;
      };
      if (mocha.Suite && mocha.Suite.prototype) {
        realAddTest = mocha.Suite.prototype.addTest;
        mocha.Suite.prototype.addTest = replacementFunction;
      } else {
        realAddTest = mocha.suite.addTest;
        mocha.suite.addTest = replacementFunction;
      }
    `;
  }
}
