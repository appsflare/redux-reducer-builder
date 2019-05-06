"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createPayloadAction(type) {
    return function (payload) { return ({ type: type, payload: payload }); };
}
exports.createPayloadAction = createPayloadAction;
//# sourceMappingURL=types.js.map