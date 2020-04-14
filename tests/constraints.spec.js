import mocha from 'mocha';
import chai from 'chai';

const it = mocha.it;
const xit = mocha.xit;
const describe = mocha.describe;
const expect = chai.expect;

import {Email, } from './../src/entry';
import {Equal, MaxLength, MinLength, Required} from "../src/entry";

describe('Constraints tests', () => {
    it('should test for valid and invalid email', () => {
        const email = new Email();

        const invalid = email.validate('not_email');

        expect(invalid).to.be.equal('invalidEmail');

        const valid = email.validate('email@email.com');

        expect(valid).to.be.equal(true);
    });

    it('should fail if min length is not valid', () => {
        const minLen = new MinLength(5);

        const invalid = minLen.validate('less');

        expect(invalid).to.be.equal('minLength');

        const valid = minLen.validate('more than 5');

        expect(valid).to.be.equal(true);
    });

    it('should fail if max length is not valid', () => {
        const minLen = new MaxLength(5);

        const invalid = minLen.validate('more than 5');

        expect(invalid).to.be.equal('maxLength');

        const valid = minLen.validate('less');

        expect(valid).to.be.equal(true);
    });

    it('should fail if equal is not valid', () => {
        // compareField is used internally
        const equal = new Equal('someField');

        const invalid = equal.validate({
            val1: 'one',
            val2: 'two',
        });

        expect(invalid).to.be.equal('unequal');

        const valid = equal.validate({
            val1: 'equal',
            val2: 'equal',
        });

        expect(valid).to.be.equal(true);
    });

    it('should fail is required is not valid', () => {
        const invalidValues = ['', null, undefined, 0, NaN, false];

        const required = new Required();

        for (const invalidValue of invalidValues) {
            const valid = required.validate(invalidValue);

            expect(valid).to.be.equal('required');
        }

        const valid = required.validate('some value');

        expect(valid).to.be.equal(true);
    });
});