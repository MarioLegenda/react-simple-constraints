export default class MaxLength {

    constructor(minLength) {
        this.maxLength = minLength;
        this.name = 'maxLength';
    }

    validate(val) {
        if (val.length > this.maxLength) return 'maxLength';

        return true;
    }
}