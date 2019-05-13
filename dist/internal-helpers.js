"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function setNamespace(obj, namespace) {
    obj.__namespace__ = namespace;
    return obj;
}
exports.setNamespace = setNamespace;
function getNamespace(obj) {
    return obj.__namespace__ || '';
}
exports.getNamespace = getNamespace;
//# sourceMappingURL=internal-helpers.js.map