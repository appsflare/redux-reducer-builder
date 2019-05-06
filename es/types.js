export function createPayloadAction(type) {
    return function (payload) { return ({ type: type, payload: payload }); };
}
//# sourceMappingURL=types.js.map