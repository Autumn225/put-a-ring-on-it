import {Constants} from '../constants.js';
let {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;
export class TemplateApplication extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(data) {
        super(data ?? {id: 'template-application'});
        this.windowTitle = Constants.localize('LOCALIZED.String');
    }
    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: TemplateApplication.formHandler,
            submitOnChange: true,
            closeOnSubmit: false
        },
        actions: {
            confirm: TemplateApplication.confirm
        },
        window: {
            title: 'Default Title',
            resizable: true,
            contentClasses: ['standard-form']
        },
        position: {
            width: 'auto',
            height: 'auto'
        }
    };
    static PARTS = {
        header: {
            template: 'modules/put-a-ring-on-it/templates/header.hbs'
        },
        form: {
            template: 'modules/put-a-ring-on-it/templates/form.hbs',
            scrollable: ['']
        },
        footer: {
            template: 'modules/put-a-ring-on-it/templates/footer.hbs'
        }
    };
    get title() {
        return this.windowTitle;
    }
    get footerButtons() {
        return ([
            {
                type: 'submit',
                action: 'confirm',
                label: 'PUTARINGONIT.Defaults.Save'
            },
            {
                type: 'submit',
                action: 'close',
                label: 'PUTARINGONIT.Defaults.Cancel'
            }
        ]);
    }
    static formHandler(event) {
        //
    }
    /** Buttons **/
    static confirm(event, target) {
        //
    }
    /* Overwrites */
    _prepareContext(options) {
        let context = {};
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