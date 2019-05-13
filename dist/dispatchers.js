"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Redux = require("redux");
function bindActionCreator(actionCreator, dispatch) {
    return Redux.bindActionCreators(actionCreator, dispatch);
}
exports.bindActionCreator = bindActionCreator;
function bindThunkCreator(thunkCreator, dispatch) {
    return Redux.bindActionCreators(thunkCreator, dispatch);
}
exports.bindThunkCreator = bindThunkCreator;
function bindActionCreators(actionCreators, dispatch) {
    return Redux.bindActionCreators(actionCreators, dispatch);
}
exports.bindActionCreators = bindActionCreators;
function bindThunkCreators(actionCreators, dispatch) {
    return Redux.bindActionCreators(actionCreators, dispatch);
}
exports.bindThunkCreators = bindThunkCreators;
//# sourceMappingURL=dispatchers.js.map