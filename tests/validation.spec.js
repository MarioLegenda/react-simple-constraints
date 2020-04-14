import mocha from 'mocha';
import chai from 'chai';

const it = mocha.it;
const xit = mocha.xit;
const describe = mocha.describe;
const expect = chai.expect;

import Constraints, {MinLength, MaxLength, Required, Email} from './../src/entry';

describe('validation tests', () => {
    it('should validate an array of constraints', () => {
        const values = [
            {
                value: '',
                constraints: [new MinLength(5), new Required()],
                expected: ['minLength', 'required'],
            },
            {
                value: 'min',
                constraints: [new MinLength(5), new Required()],
                expected: ['minLength'],
            },
            {
                value: null,
                constraints: [new Required()],
                expected: ['required'],
            },
            {
                value: 'invalid',
                constraints: [new Required(), new Email()],
                expected: ['invalidEmail'],
            },
            {
                value: 'maxLength',
                constraints: [new MaxLength(5)],
                expected: ['maxLength'],
            },
            {
                value: 'valid@valid.com',
                constraints: [new Required(), new Email(), new MaxLength(5)],
                expected: ['maxLength'],
            },
        ];

        for (const val of values) {
            const validations = Constraints.validate(val.constraints, val.value);

            expect(validations).to.have.members(val.expected);
        }

        const constraints = [new Required(), new Email(), new MinLength(1), new MaxLength(100)];
        const validations = Constraints.validate(constraints, 'valid@email.com');

        expect(validations.length).to.be.equal(0);
    });
});