import {settings} from './settings.js';

Hooks.once('init', async function() {
    settings.registerSettings();
});
Hooks.once('ready', async function() {

});