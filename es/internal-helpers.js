export function setNamespace(obj, namespace) {
    obj.__namespace__ = namespace;
    return obj;
}
export function getNamespace(obj) {
    return obj.__namespace__ || '';
}
//# sourceMappingURL=internal-helpers.js.map