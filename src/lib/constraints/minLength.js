export default class MinLength {
    constructor(minLength) {
        this.minLength = minLength;
        this.name = 'minLength'
    }

    validate(val) {
        if (val.length < this.minLength) return 'minLength';

        return true;
    }
}