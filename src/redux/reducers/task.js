import types from './../constants/index';

const initialState = [];

export default (state = initialState, action) => {
    switch (action.type) {
        case types.LIST_ALL:
            return [...state];
        default:
            return state;
    }
}