import mocha from 'mocha';
import chai from 'chai';

const it = mocha.it;
const xit = mocha.xit;
const describe = mocha.describe;
const expect = chai.expect;

import {Metadata} from './../src/entry';

describe('Metadata tests', () => {
    it('should build the default metadata', () => {
        const defaultMetadata = Metadata.build('default');

        const expectedKeys = ['minLength', 'maxLength', 'required', 'constraints'];

        expect(Object.keys(defaultMetadata), expectedKeys);

        expect(defaultMetadata.minLength).to.be.equal(1);
        expect(defaultMetadata.maxLength).to.be.equal(100);
        expect(defaultMetadata.required).to.be.equal(true);
        expect(defaultMetadata.constraints).to.be.a('array');

        const expectedConstraints = ['minLength', 'maxLength', 'required'];
        const constraintKeys = defaultMetadata.constraints.map(c => c.name);
        expect(constraintKeys).to.have.members(expectedConstraints);
    });
});