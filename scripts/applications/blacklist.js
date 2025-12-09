let {ApplicationV2, HandlebarsApplicationMixin} = foundry.applications.api;
export class BlacklistMenu extends HandlebarsApplicationMixin(ApplicationV2) {
    constructor(data) {
        super({id: 'template-application'});
        this.windowTitle = helpers.localize('LOCALIZED.String');
    }
    static DEFAULT_OPTIONS = {
        tag: 'form',
        form: {
            handler: BlacklistMenu.formHandler,
            submitOnChange: true,
            closeOnSubmit: false,
        },
        actions: {
            confirm: BlacklistMenu.confirm,
        },
        window: {
            title: 'Default Title',
            resizable: true,
            contentClasses: ['standard-form'],
        },
        position: {
            width: 600,
            height: 800
        }
    };
    static PARTS = {
        header: {
            template: 'modules/put-a-ring-on-it/templates/header.hbs',
        },
        form: {
            template: 'modules/put-a-ring-on-it/templates/animation.hbs',
            scrollable: [''],
        },
        footer: {
            template: 'modules/put-a-ring-on-it/templates/footer.hbs',
        }
    };
    get title() {
        return this.windowTitle;
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