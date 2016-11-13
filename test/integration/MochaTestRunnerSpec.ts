import * as chai from 'chai';
import MochaTestRunner from '../../src/MochaTestRunner';
import { TestResult, RunnerOptions, RunResult, TestStatus, RunStatus } from 'stryker-api/test_runner';
import * as chaiAsPromised from 'chai-as-promised';
import * as path from 'path';
chai.use(chaiAsPromised);
const expect = chai.expect;

const countTests = (runResult: RunResult, predicate: (result: TestResult) => boolean) =>
  runResult.tests.filter(predicate).length;

const countSucceeded = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Success);
const countFailed = (runResult: RunResult) =>
  countTests(runResult, t => t.status === TestStatus.Failed);

describe('MochaTestRunner', function () {

  let sut: MochaTestRunner;
  this.timeout(10000);

  describe('when code coverage is disabled', () => {
    let testRunnerOptions: RunnerOptions;

    before(() => {
      testRunnerOptions = {
        files: [
          file('./testResources/sampleProject/src/MyMath.js'),
          file('./testResources/sampleProject/test/MyMathSpec.js')],
        strykerOptions: {},
        port: 1234
      };
    });

    describe('with simple add function to test', () => {

      before(() => {
        sut = new MochaTestRunner(testRunnerOptions);
      });

      it('should report completed tests without coverage', () => 
        expect(sut.run()).to.eventually.satisfy((runResult: RunResult) => {
          expect(countSucceeded(runResult)).to.be.eq(5, 'Succeeded tests did not match');
          expect(countFailed(runResult)).to.be.eq(0, 'Failed tests did not match');
          runResult.tests.forEach(t => expect(t.timeSpentMs).to.be.greaterThan(-1).and.to.be.lessThan(1000) );
          expect(runResult.status).to.be.eq(RunStatus.Complete, 'Test result did not match');
          expect(runResult.coverage).to.not.be.ok;
          return true;
        }));

      it('should be able to run 2 times in a row', () => {
        return expect(sut.run().then(() => sut.run())).to.eventually.satisfy((runResult: RunResult) => {
          expect(countSucceeded(runResult)).to.be.eq(5);
          return true;
        });
      });
    });

    describe('with an error in an unincluded input file', () => {
      before(() => {
        let options = {
          files: [
            file('testResources/sampleProject/src/MyMath.js'),
            file('testResources/sampleProject/src/Error.js', false, false),
            file('testResources/sampleProject/test/MyMathSpec.js')],
          coverageEnabled: false,
          strykerOptions: {},
          port: 1234
        };
        sut = new MochaTestRunner(options);
      });

      it('should report completed tests without errors', () => expect(sut.run()).to.eventually.satisfy((runResult: RunResult) => {
        expect(runResult.status).to.be.eq(RunStatus.Complete, 'Test result did not match');
        return true;
      }));
    });
  });

  let file = (filePath: string, mutated: boolean = true, included: boolean = true) => ({ path: path.resolve(filePath), mutated, included });
});