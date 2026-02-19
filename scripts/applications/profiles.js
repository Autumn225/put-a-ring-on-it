import {TemplateApplication} from './defaultMenu.js';
import {Constants, TokenRingProfile} from '../constants.js';
import {PutARingOnIt} from '../put-a-ring-on-it.js';
export class ProfilesMenu extends TemplateApplication {
    constructor() {
        super({id: 'put-a-ring-on-it-profiles-menu'});
        this.windowTitle = Constants.localize('PUTARINGONIT.Profiles.App.WindowTitle');
        this.profiles = foundry.utils.deepClone(game.settings.get(Constants.MODULE_NAME, 'profiles'));
        this.selectedProfile = null;
    }
    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: ProfilesMenu.formHandler,
            submitOnChange: true,
            closeOnSubmit: false
        },
        actions: {
            confirm: ProfilesMenu.confirm,
            addProfile: ProfilesMenu.addProfile,
            removeProfile: ProfilesMenu.removeProfile
        },
        window: {
            title: 'Default Title',
            resizable: true,
            contentClasses: ['standard-form']
        },
        position: {
            width: 500,
            height: 'auto'
        }
    };
    static PARTS = {
        header: {
            template: 'modules/put-a-ring-on-it/templates/header.hbs'
        },
        form: {
            template: 'modules/put-a-ring-on-it/templates/form-profiles.hbs',
            scrollable: ['']
        },
        footer: {
            template: 'modules/put-a-ring-on-it/templates/footer.hbs'
        }
    };
    static formHandler(event) {
        let target = event.target;
        let inputName = target.name ?? target.closest('.form-input')?.dataset?.name;
        let value = target.type === 'checkbox' ? target.checked : target.value;
        let fieldData = event.target.closest('.form-set')?.dataset;
        let fieldSection = fieldData?.section;
        if (fieldSection === 'header') {
            this[inputName] = value;
        } else if (fieldSection === 'form') {
            this.profiles[this.selectedProfile][inputName] = value;
        }
        this.render(true);
    }
    get profileOptions() {
        return [{label: '', value: 'none'}].concat(Object.entries(this.profiles)?.map(([key, value]) => ({label: value.name, value: key})));
    }
    /** Buttons **/
    static async confirm(event, target) {
        await game.settings.set(Constants.MODULE_NAME, 'profiles', this.profiles);
        this.close(true);
        await PutARingOnIt.cacheTextures();
    }
    static addProfile(event, target) {
        let profileCount = Object.keys(this.profiles).length + 1;
        while (this.profiles['new-profile-' + profileCount]) {
            profileCount++;
        }
        this.profiles['new-profile-' + profileCount] = new TokenRingProfile({name: 'New Profile ' + profileCount, identifier: 'new-profile-' + profileCount, texture: 'modules/put-a-ring-on-it/assets/textures/metal.png'});
        this.selectedProfile = 'new-profile-' + profileCount;
        this.render(true);
    }
    static async removeProfile(event, target) {
        if (!this.selectedProfile) return;
        let confirmed = await foundry.applications.api.DialogV2.confirm({
            window: {title: Constants.localize('PUTARINGONIT.Profiles.App.WindowTitle')},
            content: `<p class="paroi-centered">${Constants.localize('PUTARINGONIT.Profiles.App.ConfirmDelete.Content')}</p>`
        });
        if (!confirmed) return;
        delete this.profiles[this.selectedProfile];
        this.selectedProfile = null;
        this.render(true);
    }
    /* Overwrites */
    _prepareContext(options) {
        let profileData = this.profiles[this.selectedProfile] ? new TokenRingProfile(this.profiles[this.selectedProfile]) : null;
        let context = {
            header: {
                content: 'PUTARINGONIT.Profiles.App.Header.Content',
                fields: [
                    {
                        name: 'selectedProfile',
                        inputs: [
                            {
                                type: 'select',
                                name: 'selectedProfile',
                                id: 'select-profile',
                                value: this.selectedProfile,
                                options: this.profileOptions
                            }
                        ]
                    },
                    {
                        name: 'addRemoveProfile',
                        inputs: [
                            {
                                type: 'button',
                                name: 'addProfile',
                                id: 'add-profile',
                                label: 'PUTARINGONIT.Profiles.App.Buttons.AddProfile',
                                action: 'addProfile'
                            },
                            {
                                type: 'button',
                                name: 'removeProfile',
                                id: 'remove-profile',
                                label: 'PUTARINGONIT.Profiles.App.Buttons.RemoveProfile',
                                action: 'removeProfile',
                                disabled: !this.selectedProfile || this.selectedProfile === 'none'
                            }
                        ]
                    }
                ]
            },
            form: {
                placeholder: 'PUTARINGONIT.Profiles.App.Form.Placeholder',
                fields: profileData ? profileData.profileDataFields : []
            },
            footer: {
                buttons: this.footerButtons
            }
        };
        return context;
    }
    _onRender(context, options) {
        //this.element.querySelectorAll...
    }
    async close(options) {
        // Do things when closed...
        super.close(options);
        return true;
    }
}