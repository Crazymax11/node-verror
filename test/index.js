const { expect } = require('chai');
const VError = require('../lib/verror.js');

describe('VError', () => {
    describe('#Constructor', () => {
        it('should create instance of VError', () => {
            expect(new VError()).to.be.instanceof(VError);
        });
        it('should create instance of Error', () => {
            expect(new VError()).to.be.instanceof(Error);
        })
        it('should create error with message VError', () => {
            const err = new VError();
            expect(err.message).to.be.equal('VError');
        })
        it('should create error with message from first argument', () => {
            const err = new VError('Test message');
            expect(err.message).to.be.equal('Test message');
        })
        it('should create error with message from message and error', () => {
            const err = new VError('Test message', new Error('Another error'));
            expect(err.message).to.be.equal('Test message: Another error');
        });
        it('should create error where cause is error', () => {
            const cause = new Error('Another error');
            const err = new VError('Test message', cause);
        })
        it('should create error with message from first argument, when third is provided', () => {
            const cause = new Error('Another error');
            const err = new VError('Test message', cause, true);
            expect(err.message).to.be.equal('Test message');
        })
    });
    describe('#fullStack', () => {
        it('should return fullstack for standalone error', () => {
            const fullstack = VError.fullStack(new VError());
            expect(fullstack).to.include('VError');
            expect(fullstack).to.include('at Context.it');
        })
        it('should return fullstack for error caused by error', () => {
            const fullstack = VError.fullStack(new VError('VError', new Error('Error')));
            expect(fullstack).to.include('VError');
            expect(fullstack).to.include('at Context.it');
            expect(fullstack).to.include('Caused by: Error: Error');
        })
        it('should return fullstack for error caused by error caused by error', () => {
            const fullstack = VError.fullStack(new VError('VError', new VError('VError2' ,new Error('Error'))));
            expect(fullstack).to.include('VError');
            expect(fullstack).to.include('at Context.it');
            expect(fullstack).to.include('Caused by: Error: Error');
            expect(fullstack).to.include('Caused by: VError: VError');
        })
    })
    describe('#Inherites', () => {
        it('dd', () => {
            const err = new VError('err1');
            class MyError extends VError {
            }
            const err2 = new MyError('err2');
            class MyError2 extends MyError{

            }
            const err3 = new MyError2('err2', err2);
            expect(err3).to.be.instanceof(MyError2)
            expect(err3).to.be.instanceof(MyError)
            expect(err3).to.be.instanceof(VError)
            expect(err3).to.be.instanceof(Error)

            expect(err2).to.be.instanceof(MyError)
            expect(err2).to.be.instanceof(VError)
            expect(err2).to.be.instanceof(Error)

            console.log(VError.fullStack(err3));
        })
    })
    describe('#cause', () => {
        
    })
    describe('#findCauseByName', () => {

    })
});