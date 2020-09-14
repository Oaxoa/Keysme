import {useEffect} from 'react';
import {registerHotkey, deregisterHotkey} from '../utils';

const useHotkey = (hotkey, f, deps) => {
	useEffect(() => {
		registerHotkey(hotkey, f);
		return () => {
			deregisterHotkey(hotkey, f);
		};
	}, deps);

	return [];
};

export {useHotkey};
