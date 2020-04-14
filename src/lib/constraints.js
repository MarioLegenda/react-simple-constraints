import updateState from "./util";
import Metadata from "./metadata";

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

export function validateCluster(metadata, state, context) {
    return Constraints.validateCluster(Metadata.createCluster(metadata, state), context);
}

class EqualValue {
    constructor(val1, val2) {
        this.val1 = val1;
        this.val2 = val2;
    }
}
