import mocha from 'mocha';
import chai from 'chai';

const it = mocha.it;
const xit = mocha.xit;
const describe = mocha.describe;
const expect = chai.expect;

import State from '../src/lib/state';

describe('State tests', () => {
    it('should create a single state prop and have all required members', () => {
        const members = ['value', 'valid', 'reason', 'dirty', 'touched', 'focused'];

        const prop = State.buildProp();

        expect(Object.keys(prop)).to.have.members(members);

        expect(prop.value).to.be.equal('');
        expect(prop.valid).to.be.equal(false);
        expect(prop.reason).to.be.a('array');
        expect(prop.reason.length).to.be.equal(0);
        expect(prop.dirty).to.be.equal(false);
        expect(prop.touched).to.be.equal(false);
        expect(prop.focused).to.be.equal(false);
    });

    it('should build an object of props given a list of strings', () => {
        const stateMembers = ['name', 'lastName', 'email'];
        const propMembers = ['value', 'valid', 'reason', 'dirty', 'touched', 'focused'];

        const props = State.buildProps('name', 'lastName', 'email');

        expect(Object.keys(props)).to.have.members(stateMembers);

        const propVals = Object.values(props);

        for (const prop of propVals) {
            expect(Object.keys(prop)).to.have.members(propMembers);

            expect(prop.value).to.be.equal('');
            expect(prop.valid).to.be.equal(false);
            expect(prop.reason).to.be.a('array');
            expect(prop.reason.length).to.be.equal(0);
            expect(prop.dirty).to.be.equal(false);
            expect(prop.touched).to.be.equal(false);
            expect(prop.focused).to.be.equal(false);
        }
    });
});