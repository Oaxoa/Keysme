"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useHotkey = void 0;

var _react = require("react");

var _utils = require("../utils");

const useHotkey = (hotkey, f, deps) => {
  (0, _react.useEffect)(() => {
    (0, _utils.registerHotkey)(hotkey, f);
    return () => {
      (0, _utils.deregisterHotkey)(hotkey, f);
    };
  }, deps);
  return [];
};

exports.useHotkey = useHotkey;