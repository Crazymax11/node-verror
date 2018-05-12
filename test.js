/* global describe, it */
const { expect } = require('chai');
const ChainableError = require('./dist.js').default;

describe('ChainableError', () => {
  describe('#Constructor', () => {
    it('should create instance of ChainableError', () => {
      expect(new ChainableError()).to.be.instanceof(ChainableError);
    });
    it('should create instance of Error', () => {
      expect(new ChainableError()).to.be.instanceof(Error);
    });
    it('should create error with message ChainableError', () => {
      const err = new ChainableError();
      expect(err.message).to.be.equal('ChainableError');
    });
    it('should create error with message from first argument', () => {
      const err = new ChainableError('Test message');
      expect(err.message).to.be.equal('Test message');
    });
    it('should create error with message from message and error', () => {
      const err = new ChainableError('Test message', new Error('Another error'));
      expect(err.message).to.be.equal('Test message');
    });
    it('should create error where cause is error', () => {
      const cause = new Error('Another error');
      const err = new ChainableError('Test message', cause);
    });
    it('should create error with message from first argument, when third is provided', () => {
      const cause = new Error('Another error');
      const err = new ChainableError('Test message', cause, true);
      expect(err.message).to.be.equal('Test message');
    });
  });
  describe('#fullStack', () => {
    it('should return fullstack for standalone error', () => {
      const fullstack = new ChainableError().fullStack();
      expect(fullstack).to.include('ChainableError');
      expect(fullstack).to.include('at Context.it');
    });
    it('should return fullstack for error caused by error', () => {
      const fullstack = new ChainableError('ChainableError', new Error('Error')).fullStack();
      expect(fullstack).to.include('ChainableError');
      expect(fullstack).to.include('at Context.it');
      expect(fullstack).to.include('Caused by: Error: Error');
    });
    it('should return fullstack for error caused by error caused by error', () => {
      const fullstack = new ChainableError('ChainableError', new ChainableError('ChainableError2', new Error('Error'))).fullStack();
      expect(fullstack).to.include('ChainableError');
      expect(fullstack).to.include('at Context.it');
      expect(fullstack).to.include('Caused by: Error: Error');
      expect(fullstack).to.include('Caused by: ChainableError: ChainableError');
    });
  });
  describe('#Inheritance', () => {
    it('created errors should be instance of their parents', () => {
      const err = new ChainableError('err1');
      class MyError extends ChainableError {}

      const err2 = new MyError('err2', err);
      class MyError2 extends MyError {}

      const err3 = new MyError2('err3', err2);

      expect(err3).to.be.instanceof(MyError2);
      expect(err3).to.be.instanceof(MyError);
      expect(err3).to.be.instanceof(ChainableError);
      expect(err3).to.be.instanceof(Error);

      expect(err2).to.be.instanceof(MyError);
      expect(err2).to.be.instanceof(ChainableError);
      expect(err2).to.be.instanceof(Error);

      const stack = err3.fullStack();
      expect(stack).to.include('MyError2: err3');
      expect(stack).to.include('Caused by: MyError: err2');
      expect(stack).to.include('Caused by: ChainableError: err1');
    });
  });
});
