"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkHotkey = exports.shallowEqual = exports.exceptionsReplace = exports.getBaseModifiersMap = exports.isArray = exports.getModifiersFromEvent = exports.getModifiers = exports.getModifierPropertyName = exports.isString = exports.getParsed = exports.getSubject = exports.last = exports.getParts = exports.isModifier = void 0;

const isString = arg => typeof arg === 'string';

exports.isString = isString;

const isArray = arg => arg instanceof Array;

exports.isArray = isArray;
const MODIFIERS = ['shift', 'ctrl', 'alt', 'meta'];

const isModifier = code => isString(code) && MODIFIERS.map(item => item.toLowerCase()).includes(code.toLowerCase());

exports.isModifier = isModifier;
const EXCEPTIONS = {
  ' ': 'Space'
};

const exceptionsReplace = c => {
  var _EXCEPTIONS$c$toLower;

  return ((_EXCEPTIONS$c$toLower = EXCEPTIONS[c.toLowerCase()]) === null || _EXCEPTIONS$c$toLower === void 0 ? void 0 : _EXCEPTIONS$c$toLower.toLowerCase()) || (c === null || c === void 0 ? void 0 : c.toLowerCase());
};

exports.exceptionsReplace = exceptionsReplace;

const getParts = str => isString(str) ? str.split('-') : [];

exports.getParts = getParts;

const last = array => isArray(array) && array.length > 0 ? array[array.length - 1] : undefined;

exports.last = last;

const getSubject = parts => {
  const candidate = last(parts);
  return !candidate || isModifier(candidate) ? undefined : candidate.toLowerCase();
};

exports.getSubject = getSubject;

const getModifierPropertyName = mod => isModifier(mod) ? `${mod.toLowerCase()}Key` : undefined;

exports.getModifierPropertyName = getModifierPropertyName;

const getBaseModifiersMap = () => MODIFIERS.reduce((acc, mod) => {
  acc[getModifierPropertyName(mod)] = false;
  return acc;
}, {});

exports.getBaseModifiersMap = getBaseModifiersMap;

const getModifiers = parts => {
  const map = getBaseModifiersMap();
  parts.filter(isModifier).map(getModifierPropertyName).forEach(mod => map[mod] = true);
  return map;
};

exports.getModifiers = getModifiers;

const getModifiersFromEvent = event => {
  const map = getBaseModifiersMap();
  Object.keys(map).forEach(key => {
    if (event[key] !== undefined) map[key] = event[key];
  });
  return map;
};

exports.getModifiersFromEvent = getModifiersFromEvent;

const getParsed = str => {
  const parts = getParts(str);
  return {
    subject: getSubject(parts),
    modifiers: getModifiers(parts)
  };
};

exports.getParsed = getParsed;

const shallowEqual = (obj1, obj2) => Object.keys(obj1).length === Object.keys(obj2).length && Object.keys(obj1).every(key => obj1[key] === obj2[key]);

exports.shallowEqual = shallowEqual;

const checkHotkey = (event, hotkey) => {
  const nativeEvent = event.nativeEvent || event;
  const parsed = getParsed(hotkey);
  const eventModifiers = getModifiersFromEvent(event);
  const sameSubject = parsed.subject === exceptionsReplace(nativeEvent.key).toLowerCase();
  const sameModifiers = shallowEqual(parsed.modifiers, eventModifiers);
  return sameSubject && sameModifiers;
};

exports.checkHotkey = checkHotkey;