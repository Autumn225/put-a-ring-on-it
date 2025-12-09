import {Constants} from './constants.js';
import {ProfilesMenu} from './applications/profiles.js';
import {BlacklistMenu} from './applications/blacklist.js';
const moduleName = Constants.MODULE_NAME;
function registerSettings() {
    game.settings.register(moduleName, 'blacklist', {
        scope: 'world',
        config: false,
        type: Array,
        default: ['tokenizer', 'systems/dnd5e/tokens', 'modules/JB2A_DnD5e', 'modules/jb2a_patreon']
    });
    game.settings.register(moduleName, 'profiles', {
        scope: 'world',
        config: false,
        type: Object,
        default: Constants.defaultProfiles
    });
    game.settings.registerMenu(moduleName, 'profilesMenu', {
        name: 'PUTARINGONIT.Profiles.Menu.Name',
        label: 'PUTARINGONIT.Profiles.Menu.Label',
        hint: 'PUTARINGONIT.Profiles.Menu.Hint',
        icon: 'fas fa-users',
        type: ProfilesMenu,
        restricted: true
    });
    game.settings.registerMenu(moduleName, 'blacklistMenu', {
        name: 'PUTARINGONIT.Blacklist.Menu.Name',
        label: 'PUTARINGONIT.Blacklist.Menu.Label',
        hint: 'PUTARINGONIT.Blacklist.Menu.Hint',
        icon: 'fas fa-ban',
        type: BlacklistMenu,
        restricted: true
    });
    game.settings.register(moduleName, 'autoApply', {
        name: 'PUTARINGONIT.Settings.AutoApply.Name',
        hint: 'PUTARINGONIT.Settings.AutoApply.Hint',
        scope: 'world',
        config: true,
        type: Boolean,
        default: true
    });
    game.settings.register(moduleName, 'applyByLinkedStatus', {
        name: 'PUTARINGONIT.Settings.ApplyByLinkedStatus.Name',
        hint: 'PUTARINGONIT.Settings.ApplyByLinkedStatus.Hint',
        scope: 'world',
        config: true,
        type: String,
        default: 'all',
        choices: {
            unlinked: 'PUTARINGONIT.Settings.ApplyByLinkedStatus.Choices.Unlinked',
            linked: 'PUTARINGONIT.Settings.ApplyByLinkedStatus.Choices.Linked',
            all: 'PUTARINGONIT.Defaults.AllTokens'
        }
    });
    game.settings.register(moduleName, 'applyByDisposition', {
        name: 'PUTARINGONIT.Settings.ApplyByDisposition.Name',
        hint: 'PUTARINGONIT.Settings.ApplyByDisposition.Hint',
        scope: 'world',
        config: true,
        type: String,
        default: 'all',
        choices: {
            hostile: 'TOKEN.DISPOSITION.HOSTILE',
            neutral: 'TOKEN.DISPOSITION.NEUTRAL',
            friendly: 'TOKEN.DISPOSITION.FRIENDLY',
            hostile_neutral: 'PUTARINGONIT.Settings.ApplyByDisposition.Choices.HostileNeutral',
            all: 'PUTARINGONIT.Defaults.AllTokens'
        }
    });
    game.settings.register(moduleName, 'defaultProfileHostile', {
        name: 'PUTARINGONIT.Settings.DefaultProfileHostile.Name',
        hint: 'PUTARINGONIT.Settings.DefaultProfileHostile.Hint',   
        scope: 'world',
        config: true,
        type: String,
        default: 'hostile',
        choices: Constants.profiles
    });
    game.settings.register(moduleName, 'defaultProfileNeutral', {
        name: 'PUTARINGONIT.Settings.DefaultProfileNeutral.Name',
        hint: 'PUTARINGONIT.Settings.DefaultProfileNeutral.Hint',   
        scope: 'world',
        config: true,
        type: String,
        default: 'neutral',
        choices: Constants.profiles
    });
    game.settings.register(moduleName, 'defaultProfileFriendly', {
        name: 'PUTARINGONIT.Settings.DefaultProfileFriendly.Name',
        hint: 'PUTARINGONIT.Settings.DefaultProfileFriendly.Hint',
        scope: 'world',
        config: true,
        type: String,
        default: 'friendly',
        choices: Constants.profiles
    });
}
export let settings = {
    registerSettings
};
