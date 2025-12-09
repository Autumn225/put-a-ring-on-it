import { defineConfig } from 'eslint/config';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig([{
    extends: compat.extends('eslint:recommended'),

    languageOptions: {
        globals: {
            ...globals.browser,
            game: 'writable',
            setProperty: 'writable',
            Actor: 'writable',
            ChatMessage: 'writable',
            Item: 'writable',
            ui: 'writable',
            canvas: 'writable',
            Folder: 'writable',
            warpgate: 'writable',
            getProperty: 'writable',
            fromUuid: 'writable',
            fromUuidSync: 'writable',
            saveAs: 'writable',
            Dialog: 'writable',
            duplicate: 'writable',
            MidiQOL: 'writable',
            Roll: 'writable',
            DAE: 'writable',
            CONFIG: 'writable',
            Ray: 'writable',
            mergeObject: 'writable',
            PIXI: 'writable',
            GlobalLightSource: 'writable',
            ClockwiseSweepPolygon: 'writable',
            isNewerVersion: 'writable',
            FilePicker: 'writable',
            JournalEntry: 'writable',
            JournalEntryPage: 'writable',
            CONST: 'writable',
            Hooks: 'writable',
            socketlib: 'writable',
            libWrapper: 'writable',
            AmbientLight: 'writable',
            TokenDocument: 'writable',
            debouncedReload: 'writable',
            FormApplication: 'writable',
            deepClone: 'writable',
            DocumentDirectory: 'writable',
            Tour: 'writable',
            chrisPremades: 'writable',
            Sequence: 'writable',
            Sequencer: 'writable',
            token: 'writable',
            effect: 'writable',
            tokenAttacher: 'writable',
            randomID: 'writable',
            ActiveEffect: 'writable',
            jQuery: 'writable',
            ItemDirectory: 'writable',
            WorldCollection: 'writable',
            foundry: 'writable',
            Token: 'writable'
        },

        ecmaVersion: 'latest',
        sourceType: 'module'
    },

    rules: {
        indent: ['error', 4, {
            SwitchCase: 1
        }],

        quotes: ['error', 'single', {
            avoidEscape: true,
            allowTemplateLiterals: true
        }],

        semi: ['error', 'always'],
        'no-unused-vars': ['off'],
        'no-inner-declarations': ['off'],
        'quote-props': ['error', 'as-needed'],
        'comma-dangle': ['error', 'never']
    }
}]);