# KeysMe 😘

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Known Vulnerabilities](https://snyk.io/test/github/Oaxoa/keysme/badge.svg?targetFile=package.json)](https://snyk.io/test/github/dwyl/hapi-auth-jwt2?targetFile=package.json)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

KeysMe is a tiny-tiny (note the double-tiny which makes it tiny * .5) 
library to handle keyboard interaction and super-complex hotkeys in a line.

- 1Kb gzipped
- ZERO dependencies (optional dependency on [react](https://www.npmjs.com/package/react) to use the _useHotkey_ hook)
- 100% test coverage
 
...by design.

Exported as a ES module, can work with any JS project + 
has a beautiful React hook for even more enjoyment.

## Installation

```shell script
npm install --save keysme
```

## Usage

### Pure function

As a pure function it can be used to perform simple checks 
against a KeyboardEvent-like object and a hotkey (string):

```javascript
// checkHotkey(KeyboardEvent-like, hotkey);

// Example

import {checkHotkey} from "keysme";

myInput.addEventListener('keyup', e => 
    // works in a focused input
    checkHotkey(e, 'Shift-Ctrl-A') && doSomething()
);

body.addEventListener('keyup', e =>
    // works on the entire page 
    checkHotkey(e, 'Meta-Space') && doSomething()
);

```

### Global event registerer

It can register and deregister global events for you 
(those that are listened on the body):

```javascript
// registerHotkey(hotkey, f);
// deregisterHotkey(hotkey, f);
// deregisterHotkey(hotkey);

// Example

import {registerHotkey, deregisterHotkey} from "keysme";

registerHotkey('Shift-Ctrl-A', doSomething);
deregisterHotkey('Shift-Ctrl-A', doSomething);
deregisterHotkey('Shift-Ctrl-A');
```

### React hook

As a hook it works easily with React functional components:

```javascript
import {useHotkey} from 'keysme/react';

const Component = props => {
    useHotkey('Shift-Ctrl-A', doSomething, dependencies);
    return <div>I am amazing</div>
};
```
As a hook it will take care of registering and deregistering for you.
Internally it will operate something like:

```javascript
// ...
useEffect(() => {
    registerHotkey(options.hotkey, option.f);
    return () => {
        deregisterHotkey(options.hotkey, options.f)
    };
}, options.deps);
// ...
```

Please fork and contribute.

