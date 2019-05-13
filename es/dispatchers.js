import * as Redux from 'redux';
export function bindActionCreator(actionCreator, dispatch) {
    return Redux.bindActionCreators(actionCreator, dispatch);
}
export function bindThunkCreator(thunkCreator, dispatch) {
    return Redux.bindActionCreators(thunkCreator, dispatch);
}
export function bindActionCreators(actionCreators, dispatch) {
    return Redux.bindActionCreators(actionCreators, dispatch);
}
export function bindThunkCreators(actionCreators, dispatch) {
    return Redux.bindActionCreators(actionCreators, dispatch);
}
//# sourceMappingURL=dispatchers.js.map