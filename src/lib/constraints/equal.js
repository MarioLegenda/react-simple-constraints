export default class Equal {
    constructor(compareField) {
        this.compareField = compareField;
        this.name = 'equal';
    }

    validate(equalVal) {
        if (equalVal.val1 !== equalVal.val2) return 'unequal';

        return true;
    }
}

class EqualValue {
    constructor(val1, val2) {
        this.val1 = val1;
        this.val2 = val2;
    }
}