import {
    checkHotkey,
    exceptionsReplace,
    getBaseModifiersMap,
    getModifierPropertyName,
    getModifiers, getModifiersFromEvent, getParsed,
    getParts,
    getSubject,
    isArray,
    isModifier,
    isString,
    last, shallowEqual
} from "../src/utils";

const check = (expected, f) => item => {
    expect(f(item)).toBe(expected)
};

describe('isString', () => {
    const CORRECT = ['', '1', 'asd', 'Ciao sdf'];
    const WRONG = [[], {}, 1, undefined, null];

    it('returns wheter a string is passed', () => {
        CORRECT.forEach(check(true, isString));
        WRONG.forEach(check(false, isString));
    });
});

describe('isArray', () => {
    const CORRECT = [[], new Array(), [1, 2, 3]];
    const WRONG = ['ciao', {}, 1, undefined, null];

    it('returns wheter an array is passed', () => {
        CORRECT.forEach(check(true, isArray));
        WRONG.forEach(check(false, isArray));
    });
});

describe('isModifier', () => {
    const CORRECT = ['shift', 'ctrl', 'alt', 'meta', 'Ctrl', 'CTRL', 'MeTa', 'sHIFT',];
    const WRONG = ['a', 'ciao', 'alt2', 'metaz', 'Ct rl', 'CTRLLO', 'meta123', '', undefined, null, [], {}, 0, 1,];

    it('returns wheter a string represents a modifier. It is also case unsensitive', () => {
        CORRECT.forEach(check(true, isModifier));
        WRONG.forEach(check(false, isModifier));
    });
});

describe('exceptionsReplace', () => {
    const SAMPLES = [
        {input: '', expected: ''},
        {input: ' ', expected: 'space'},
        {input: 's', expected: 's'},
    ];

    it('replaces entries from a map', () => {
        SAMPLES.forEach(o => {
            expect(exceptionsReplace(o.input)).toEqual(o.expected);
        });
    });
});

describe('getParts', () => {
    const SAMPLES = [
        {input: 'a-b-c', expected: ['a', 'b', 'c']},
        {input: 'Shift-a', expected: ['Shift', 'a']},
        {input: 'a', expected: ['a']},
        {input: '', expected: ['']},
        {input: undefined, expected: []},
        {input: {}, expected: []},
        {input: [], expected: []},
    ];

    it('returns parts of a split string', () => {
        SAMPLES.forEach(o => {
            expect(getParts(o.input)).toEqual(o.expected);
        });
    });
});

describe('last', () => {
    const SAMPLES = [
        {input: [1, 2, 3], expected: 3},
        {input: [1], expected: 1},
        {input: [], expected: undefined},
        {input: undefined, expected: undefined},
        {input: {}, expected: undefined},
    ];

    it('returns last element of an array', () => {
        SAMPLES.forEach(o => {
            expect(last(o.input)).toEqual(o.expected);
        });
    });
});

describe('getSubject', () => {
    // for simplicity samples here are defined as string. Please note they go through getParts before
    // passing the input to getSubject
    const SAMPLES = [
        {input: 's', expected: 's'},
        {input: 'S', expected: 's'},
        {input: 'Ctrl-S', expected: 's'},
        {input: 'Ctrl-Shift-S', expected: 's'},
        {input: 'Shift-Ctrl-S', expected: 's'},
        {input: 'Shift-Ctrl-Alt-Meta-S', expected: 's'},
        {input: 'Shift-Ctrl-Alt-Meta-A', expected: 'a'},
        {input: 'Shift-Ctrl-Alt-Meta', expected: undefined},
        {input: 'Shift', expected: undefined},
        {input: '', expected: undefined},
    ];

    it('returns the main character of a shortcut combination (given the parts array)', () => {
        SAMPLES.forEach(o => {
            expect(getSubject(getParts(o.input))).toEqual(o.expected);
        });
    });
});

describe('getModifierPropertyName', () => {
    const SAMPLES = [
        {input: 'shift', expected: 'shiftKey'},
        {input: 'Shift', expected: 'shiftKey'},
        {input: 'ctrl', expected: 'ctrlKey'},
        {input: 'Ctrl', expected: 'ctrlKey'},
        {input: 'alt', expected: 'altKey'},
        {input: 'Alt', expected: 'altKey'},
        {input: 'meta', expected: 'metaKey'},
        {input: 'Meta', expected: 'metaKey'},
        {input: 'AlT', expected: 'altKey'},
        {input: 'ALT', expected: 'altKey'},
        {input: 'ciao', expected: undefined},
        {input: '', expected: undefined},
        {input: 0, expected: undefined},
        {input: [], expected: undefined},
        {input: {}, expected: undefined},
        {input: undefined, expected: undefined},
    ];

    it('returns the KeyboardEvent property name of a modifier', () => {
        SAMPLES.forEach(o => {
            expect(getModifierPropertyName(o.input)).toEqual(o.expected);
        });
    });
});

describe('getBaseModifiersMap', () => {
    it('returns the modifiers keys map where all properties are false', () => {
        expect(getBaseModifiersMap()).toEqual({
            metaKey: false,
            altKey: false,
            shiftKey: false,
            ctrlKey: false,
        });
    });
});

describe('getModifiers', () => {
    // for simplicity samples here are defined as string. Please note they go through getParts before
    // passing the input to getModifiers
    const ALL_OFF = getBaseModifiersMap();
    const ALL_ON = {
        metaKey: true,
        altKey: true,
        shiftKey: true,
        ctrlKey: true,
    };
    const SAMPLES = [
        {input: 's', expected: ALL_OFF},
        {input: 'S', expected: ALL_OFF},
        {input: 'Ctrl-S', expected: {...ALL_OFF, ctrlKey: true}},
        {input: 'Ctrl-Shift-S', expected: {...ALL_OFF, ctrlKey: true, shiftKey: true}},
        {input: 'Shift-Ctrl-S', expected: {...ALL_OFF, ctrlKey: true, shiftKey: true}},
        {input: 'Shift-Ctrl-Alt-Meta-S', expected: ALL_ON},
        {input: 'Shift-Ctrl-Alt-Meta-A', expected: ALL_ON},
        {input: 'Shift-Ctrl-Alt-Meta', expected: ALL_ON},
        {input: 'Shift', expected: {...ALL_OFF, shiftKey: true}},
        {input: '', expected: ALL_OFF},
    ];

    it('returns the KeyboardEvent property name of a modifier', () => {
        SAMPLES.forEach(o => {
            expect(getModifiers(getParts(o.input))).toEqual(o.expected);
        });
    });
});

describe('getModifiersFromEvent', () => {
    const SAMPLES = [
        {
            input: {altKey: false, shiftKey: true, ctrlKey: true, metaKey: false, key: 's', whatever: 5},
            expected: {altKey: false, shiftKey: true, ctrlKey: true, metaKey: false},
        },
    ];

    it('returns the modifiers map out of a KeyboardEvent-like object', () => {
        SAMPLES.forEach(o => {
            expect(getModifiersFromEvent(o.input)).toEqual(o.expected);
        });
    });
});

describe('getParsed', () => {
    const ALL_OFF = getBaseModifiersMap();
    const ALL_ON = {
        metaKey: true,
        altKey: true,
        shiftKey: true,
        ctrlKey: true,
    };
    const SAMPLES = [
        {input: 's', expected: {subject: 's', modifiers: ALL_OFF}},
        {input: 'S', expected: {subject: 's', modifiers: ALL_OFF}},
        {input: 'Ctrl-S', expected: {subject: 's', modifiers: {...ALL_OFF, ctrlKey: true}}},
        {input: 'Ctrl-Shift-S', expected: {subject: 's', modifiers: {...ALL_OFF, ctrlKey: true, shiftKey: true}}},
        {input: 'Shift-Ctrl-S', expected: {subject: 's', modifiers: {...ALL_OFF, ctrlKey: true, shiftKey: true}}},
        {input: 'Shift-Ctrl-Alt-Meta-S', expected: {subject: 's', modifiers: ALL_ON}},
        {input: 'Shift-Ctrl-Alt-Meta-A', expected: {subject: 'a', modifiers: ALL_ON}},
        {input: 'Shift-Ctrl-Alt-Meta', expected: {subject: undefined, modifiers: ALL_ON}},
        {input: 'Shift', expected: {subject: undefined, modifiers: {...ALL_OFF, shiftKey: true}}},
        {input: '', expected: {subject: undefined, modifiers: ALL_OFF}},
    ];

    it('given the input hotkey string returns the output object', () => {
        SAMPLES.forEach(o => {
            expect(getParsed(o.input)).toEqual(o.expected);
        });
    });
});

describe('shallowEqual', () => {
    it('Returns true if two objects are equal on a shallow level (objects with primitive type properties)', () => {
        expect(shallowEqual({}, {})).toBe(true);
        expect(shallowEqual({a:1, b:2}, {a:1, b:2})).toBe(true);
        expect(shallowEqual({a:1, b:2}, {a:1, b:2, c:3})).toBe(false);
        expect(shallowEqual({a:1, b:2, c:3}, {a:1, b:2})).toBe(false);
        expect(shallowEqual({a:{}}, {a:{}})).toBe(false);
    });
});

describe('checkHotkey', () => {

    const ALL_OFF = getBaseModifiersMap();
    const ALL_ON = {
        metaKey: true,
        altKey: true,
        shiftKey: true,
        ctrlKey: true,
    };

    const kbe1 = {key: 'a', ...ALL_OFF};
    const kbe2 = {key: 'a', ...ALL_OFF, shiftKey: true};
    const kbe3 = {key: 'a', ...ALL_ON};

    const CORRECT = [
        {e: kbe1, hotkey: 'a'},
        {e: kbe2, hotkey: 'shift-a'},
        {e: kbe2, hotkey: 'Shift-a'},
        {e: kbe2, hotkey: 'SHIFT-A'},
        {e: kbe2, hotkey: 'SHIFT-A'},
        {e: kbe3, hotkey: 'Shift-Ctrl-Alt-Meta-A'},
        {e: kbe3, hotkey: 'Ctrl-SHIFT-alt-mETA-A'},
    ];

    const WRONG = [
        {e: kbe1, hotkey: 'b'},
        {e: kbe1, hotkey: 'c'},
        {e: kbe1, hotkey: 1},
        {e: kbe1, hotkey: 'Ctrl-a'},
        {e: kbe1, hotkey: 'Shift-a'},
        {e: kbe1, hotkey: 'Shift-Ctrl-a'},
        {e: kbe3, hotkey: 'Shift-Ctrl-a'},
    ];

    const checkSample = sample => checkHotkey(sample.e, sample.hotkey);

    it('given the input hotkey string returns the output object', () => {
        CORRECT.forEach(check(true, checkSample));
        WRONG.forEach(check(false, checkSample));
    });
});