import {settings} from './settings.js';
import {PutARingOnIt} from './put-a-ring-on-it.js';

Hooks.once('init', async function() {
    settings.registerSettings();
});
Hooks.once('setup', async function() {
    PutARingOnIt.wrap();
});
Hooks.once('ready', async function() {
    PutARingOnIt.moduleCheck();
    PutARingOnIt.readyHooks();
});