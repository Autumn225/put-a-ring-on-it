import {Constants} from '../constants.js';
import {TemplateApplication} from './defaultMenu.js';
import {PutARingOnIt} from '../put-a-ring-on-it.js';
let FilePicker = foundry.applications.apps.FilePicker.implementation;
export class BlacklistMenu extends TemplateApplication {
    constructor() {
        super({id: 'put-a-ring-on-it-blacklist-menu'});
        this.windowTitle = Constants.localize('PUTARINGONIT.Blacklist.App.WindowTitle');
        this.blacklist = game.settings.get(Constants.MODULE_NAME, 'blacklist');
    }
    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: BlacklistMenu.formHandler,
            submitOnChange: false,
            closeOnSubmit: true
        },
        actions: {
            addFolder: BlacklistMenu.addFolder,
            browseFolder: BlacklistMenu.browseFolder,
            confirm: BlacklistMenu.confirm
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
            template: 'modules/put-a-ring-on-it/templates/form-blacklist.hbs',
            scrollable: ['']
        },
        footer: {
            template: 'modules/put-a-ring-on-it/templates/footer.hbs'
        }
    };
    /** Buttons **/
    static async addFolder(event, target) {
        let inputName = target.dataset?.name;
        let inputElement = target.parentElement.querySelector('[name="' + inputName + '"]');
        let inputValue = inputElement.value;
        if (!inputValue || inputValue.trim() === '') {
            ui.notifications.warn('PUTARINGONIT.Blacklist.App.Warning.EmptyInput', {localize: true});
            return;
        }
        let file;
        try {
            file = await FilePicker.browse('data', inputValue);
        } catch (err) {
            ui.notifications.warn('PUTARINGONIT.Blacklist.App.Warning.InvalidFolder', {localize: true});
            return;
        }
        if (file.target) {
            if (!this.blacklist.includes(file.target)) this.blacklist.push(file.target);
            this.render(true);
        }
    }
    static async browseFolder(event, target) {
        let browser = new FilePicker({
            type: 'folder',
            callback: async (path) => {
                if (!this.blacklist.includes(path)) this.blacklist.push(path);
                this.render(true);
            }
        });
        browser.render(true);
    }
    static async confirm(event, target) {
        await game.settings.set(Constants.MODULE_NAME, 'blacklist', this.blacklist);
        this.close();
        PutARingOnIt.syncSettings();
    }
    /** Overwrites **/
    _prepareContext(options) {
        let context = {
            header: {
                content: 'PUTARINGONIT.Blacklist.App.Header.Content'
            },
            form: {
                fields: [
                    {
                        label: 'PUTARINGONIT.Blacklist.App.Field.BlacklistFolders.Label',
                        inputs: [
                            {
                                type: 'folder',
                                name: 'blacklistFolders',
                                id: 'blacklist-folders',
                                hint: 'modules/put-a-ring-on-it',
                                value: this.blacklist
                            }
                        ],
                        enabled: true
                    }
                ]
            },
            footer: {
                buttons: this.footerButtons
            }
        };
        return context;
    }
    _onRender(context, options) {
        this.element.querySelectorAll('a.remove[data-action="removeFolder"]').forEach(a => {
            a.addEventListener('click', async (event) => {
                let folderPath = a.dataset.path;
                this.blacklist = this.blacklist.filter(i => i !== folderPath);
                this.render(true);
            });
        });
    }
    async close(options) {
        // Do things when closed...
        super.close(options);
        return true;
    }
}