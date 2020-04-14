import Constraints from "./constraints";

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