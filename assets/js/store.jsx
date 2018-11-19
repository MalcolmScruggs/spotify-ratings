import { createStore, combineReducers } from 'redux';
import deepFreeze from 'deep-freeze';

function x() {
    return x;
}

function root_reducer(state0, action) {
    let reducer = combineReducers({x});
    let state1 = reducer(state0, action);

    return deepFreeze(state1);
}

let store = createStore(root_reducer);
export default store;