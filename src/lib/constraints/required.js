export default class Required {
    constructor() {
        this.name = 'required';
    }

    validate(val) {
        if (!val) return 'required';

        return true;
    }
}