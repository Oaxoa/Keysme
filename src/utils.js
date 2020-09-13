const isString = arg => typeof arg === 'string';

const isArray = arg => arg instanceof Array;

const MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];
const isModifier = code => isString(code) && MODIFIERS.map(item => item.toLowerCase()).includes(code.toLowerCase());

const EXCEPTIONS = {' ': 'Space'};
const exceptionsReplace = c => EXCEPTIONS[c.toLowerCase()]?.toLowerCase() || c?.toLowerCase();

const getParts = str => isString(str) ? str.split('-') : [];

const last = array => (isArray(array) && array.length > 0) ? array[array.length - 1] : undefined;

const getSubject = parts => {
    const candidate = last(parts);
    return (!candidate || isModifier(candidate)) ? undefined : candidate.toLowerCase();
};

const getModifierPropertyName = mod => isModifier(mod) ? `${mod.toLowerCase()}Key` : undefined;

const getBaseModifiersMap = () => MODIFIERS.reduce((acc, mod) => {
    acc[getModifierPropertyName(mod)] = false;
    return acc;
}, {});

const getModifiers = parts => {
    const map = getBaseModifiersMap();
    parts.filter(isModifier).map(getModifierPropertyName).forEach(mod => map[mod] = true);
    return map;
}
const getModifiersFromEvent = event => {
    const map = getBaseModifiersMap();
    Object.keys(map).forEach(key => {
        if (event[key] !== undefined) map[key] = event[key];
    });
    return map;
}

const getParsed = str => {
    const parts = getParts(str);
    return {subject: getSubject(parts), modifiers: getModifiers(parts)};
};

const shallowEqual=(obj1, obj2) => Object.keys(obj1).length === Object.keys(obj2).length &&
    Object.keys(obj1).every(key => obj1[key] === obj2[key]);

const checkHotkey = (event, hotkey) => {
    const nativeEvent = event.nativeEvent || event;
    const parsed = getParsed(hotkey);
    const eventModifiers=getModifiersFromEvent(event);

    const sameSubject = parsed.subject === exceptionsReplace(nativeEvent.key).toLowerCase();
    const sameModifiers = shallowEqual(parsed.modifiers, eventModifiers);

    return sameSubject && sameModifiers;
};

export {
    isModifier,
    getParts,
    last,
    getSubject,
    getParsed,
    isString,
    getModifierPropertyName,
    getModifiers,
    getModifiersFromEvent,
    isArray,
    getBaseModifiersMap,
    exceptionsReplace,
    shallowEqual,
    checkHotkey,
};