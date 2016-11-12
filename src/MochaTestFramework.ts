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
    var realIt = window.it;
    var current = 0;
    window.it = function(){
      if(${JSON.stringify(testIds)}.indexOf(current) >= 0){
        realIt.apply(global, arguments);
      }
      current++;
    };
    `;
  }
}
 