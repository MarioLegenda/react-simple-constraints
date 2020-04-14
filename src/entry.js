export class Required {
    constructor() {
        this.name = 'required';
    }

    validate(val) {
        if (!val) return 'required';

        return true;
    }
}

export class MinLength {
    constructor(minLength) {
        this.minLength = minLength;
        this.name = 'minLength'
    }

    validate(val) {
        if (val.length < this.minLength) return 'minLength';

        return true;
    }
}

export class MaxLength {

    constructor(minLength) {
        this.maxLength = minLength;
        this.name = 'maxLength';
    }

    validate(val) {
        if (val.length > this.maxLength) return 'maxLength';

        return true;
    }
}

export class Equal {
    constructor(compareField) {
        this.compareField = compareField;
        this.name = 'equal';
    }

    validate(equalVal) {
        if (equalVal.val1 !== equalVal.val2) return 'unequal';

        return true;
    }
}

export class Email {
    constructor() {
        this.name = 'email';
    }

    validate(val) {
        const rgx = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;

        if (!rgx.test(val)) return 'invalidEmail';

        return true;
    }
}

export class Metadata {
    static build(metadata) {
        if (metadata === 'default') {
            return {
                minLength: 1,
                maxLength: 100,
                required: true,
                constraints: [
                    new MinLength(1),
                    new MaxLength(100),
                    new Required(),
                ]
            };
        }

        const keys = Object.keys(metadata);
        const obj = {
            constraints: [],
        };

        for (const key of keys) {
            if (key === 'min') {
                obj.minLength = metadata[key];
                obj.constraints.push(new MinLength(obj.minLength));
            }

            if (key === 'max') {
                obj.maxLength = metadata[key];
                obj.constraints.push(new MaxLength(obj.maxLength));
            }

            if (key === 'required') {
                obj.constraints.push(new Required());
            }

            if (key === 'email') {
                obj.constraints.push(new Email());
            }

            if (key === 'equal') {
                obj.constraints.push(new Equal(metadata[key].compareField));
            }
        }

        return obj;
    }

    static createCluster(metadata, state) {
        const mKeys = Object.keys(metadata);
        const cluster = {};
        for (const key of mKeys) {
            cluster[key] = {
                name: key,
                constraints: metadata[key].constraints,
                props: state[key],
            };
        }

        return cluster;
    }
}

export default class Constraints {
    static validate(constraints, val, compareValue) {
        const validations = [];
        for (const c of constraints) {
            if (c.name === 'equal') {
                val = new EqualValue(val, compareValue);
            }

            const vString = c.validate(val);

            if (vString !== true) {
                validations.push(vString);
            }
        }

        return validations;
    }

    static validateCluster(cluster, context) {
        const keys = Object.keys(cluster);
        let valid = true;

        for (const key of keys) {
            const item = cluster[key];

            const prop = item.name;
            const constraints = item.constraints;
            const props = item.props;

            const equalConstraint = constraints.find(c => c.name === 'equal');

            let cValue = null;
            if (equalConstraint) {
                const compareField = equalConstraint.compareField;
                const compareValue = cluster[compareField].props.value;

                cValue = compareValue;
            }

            const validations = Constraints.validate(constraints, props.value, cValue);

            props.reason = validations;
            props.valid = validations.length === 0;
            props.dirty = true;
            props.touched = true;

            const state = {[prop]: props};

            if (equalConstraint && !validations.includes('unequal')) {
                const compareField = equalConstraint.compareField;
                const compareConstraints = cluster[compareField].constraints;
                const compareValue = cluster[compareField].props.value;

                const validations = Constraints.validate(compareConstraints, props.value, compareValue);

                const stateProps = context.state[compareField];
                stateProps.reason = validations;
                stateProps.valid = validations.length === 0;

                const state = {[compareField]: stateProps};

                updateState.call(context, state)
            }

            if (!props.valid) valid = false;

            updateState.call(context, state);
        }

        return valid;
    }
}

export function updateState(state, cb) {
    if (!cb) {
        return this.setState(state);
    }

    this.setState(state, cb);
}

export function validateCluster(metadata, state, context) {
    return Constraints.validateCluster(Metadata.createCluster(metadata, state), context);
}

class EqualValue {
    constructor(val1, val2) {
        this.val1 = val1;
        this.val2 = val2;
    }
}


export class State {
    static buildProp() {
        return {
            value: '',
            valid: false,
            reason: [],
            dirty: false,
            touched: false,
            focused: false,
        };
    }

    static buildProps(...props) {
        const obj = {};

        for (const prop of props) {
            obj[prop] = State.buildProp();
        }

        return obj;
    }
}

export function onChange(prop, value, entireMetadata) {
    const metadata = entireMetadata[prop];

    const data = {};
    const constraints = metadata.constraints;

    const equalConstraint = constraints.find(c => c.name === 'equal');

    let cValue = null;
    if (equalConstraint) {
        const compareField = equalConstraint.compareField;
        const compareValue = this.state[compareField].value;

        cValue = compareValue;
    }

    const validations = Constraints.validate(constraints, value, cValue);

    if (equalConstraint && !validations.includes('unequal')) {
        const compareField = equalConstraint.compareField;
        const compareConstraints = entireMetadata[compareField].constraints;
        const validations = Constraints.validate(compareConstraints, value, cValue);

        const props = this.state[compareField];
        props.reason = validations;
        props.valid = validations.length === 0;

        const state = {[compareField]: props};

        updateState.call(this, state)
    }

    data.value = value;
    data.reason = validations;
    data.valid = validations.length === 0;
    data.dirty = true;
    data.touched = (this.state[prop].touched === true) ? true : false;
    data.focused = (this.state[prop].focused === true) ? true : false;


    const state = {[prop]: data};

    updateState.call(this, state);
}

export function onBlur(prop) {
    const state = {[prop]: {...this.state[prop], ...{touched: true, focused: false}}};

    updateState.call(this, state);
}

export function onFocus(prop) {
    const state = {[prop]: {...this.state[prop], ...{focused: true}}};

    updateState.call(this, state);
}