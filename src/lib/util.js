export default function updateState(state, cb) {
    if (!cb) {
        return this.setState(state);
    }

    this.setState(state, cb);
}