export function setNamespace(obj: any, namespace: string) {
    obj.__namespace__ = namespace;
    return obj;
}

export function getNamespace(obj: any) {
    return obj.__namespace__ || '';
}