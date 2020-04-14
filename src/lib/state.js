export default class State {
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