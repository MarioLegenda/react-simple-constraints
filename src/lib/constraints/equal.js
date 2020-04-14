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