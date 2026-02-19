export class Constants {
    static MODULE_NAME = 'put-a-ring-on-it';
    static get profiles() {
        let profiles = game.settings.get(this.MODULE_NAME, 'profiles') ?? this.defaultProfiles; // default profiles here
        return Object.fromEntries(Object.entries(profiles)?.map(([key, value]) => ([key, value.name])));
    }
    static localize(key) {
        return game.i18n.localize(key);
    }
    static get defaultProfiles() {
        return {
            hostile: new TokenRingProfile({
                name: this.localize('TOKEN.DISPOSITION.HOSTILE'),
                identifier: 'hostile',
                texture: 'modules/put-a-ring-on-it/assets/textures/metal.png',
                ringSize: 'medium',
                bevelStyle: 'single',
                colorOverlayColor: '#ff0000',
                colorOverlayEnabled: true
            }),
            neutral: new TokenRingProfile({
                name: this.localize('TOKEN.DISPOSITION.NEUTRAL'),
                identifier: 'neutral',
                texture: 'modules/put-a-ring-on-it/assets/textures/stone.png',
                ringSize: 'medium',
                bevelStyle: 'single'
            }),
            friendly: new TokenRingProfile({
                name: this.localize('TOKEN.DISPOSITION.FRIENDLY'),
                identifier: 'friendly',
                texture: 'modules/put-a-ring-on-it/assets/textures/marble.png',
                ringSize: 'medium',
                bevelStyle: 'frame',
                colorOverlayColor: '#00ff00',
                colorOverlayEnabled: true
            })
        };
    }
    static get assetPaths() {
        return ({
            bevel_frame_large: 'modules/put-a-ring-on-it/assets/bevels/bevel_frame_large.png',
            bevel_frame_medium: 'modules/put-a-ring-on-it/assets/bevels/bevel_frame_medium.png',
            bevel_frame_small: 'modules/put-a-ring-on-it/assets/bevels/bevel_frame_small.png',
            bevel_single_large: 'modules/put-a-ring-on-it/assets/bevels/bevel_single_large.png',
            bevel_single_medium: 'modules/put-a-ring-on-it/assets/bevels/bevel_single_medium.png',
            bevel_single_small: 'modules/put-a-ring-on-it/assets/bevels/bevel_single_small.png',
            glow_full_inner_large: 'modules/put-a-ring-on-it/assets/glows/glow_full_inner_large.png',
            glow_full_inner_medium: 'modules/put-a-ring-on-it/assets/glows/glow_full_inner_medium.png',
            glow_full_inner_small: 'modules/put-a-ring-on-it/assets/glows/glow_full_inner_small.png',
            glow_full_outer_large: 'modules/put-a-ring-on-it/assets/glows/glow_full_outer_large.png',
            glow_full_outer_medium: 'modules/put-a-ring-on-it/assets/glows/glow_full_outer_medium.png',
            glow_full_outer_small: 'modules/put-a-ring-on-it/assets/glows/glow_full_outer_small.png',
            shadow_full_inner_large: 'modules/put-a-ring-on-it/assets/shadows/shadow_full_inner_large.png',
            shadow_full_inner_medium: 'modules/put-a-ring-on-it/assets/shadows/shadow_full_inner_medium.png',
            shadow_full_inner_small: 'modules/put-a-ring-on-it/assets/shadows/shadow_full_inner_small.png',
            shadow_full_outer_large: 'modules/put-a-ring-on-it/assets/shadows/shadow_full_outer_large.png',
            shadow_full_outer_medium: 'modules/put-a-ring-on-it/assets/shadows/shadow_full_outer_medium.png',
            shadow_full_outer_small: 'modules/put-a-ring-on-it/assets/shadows/shadow_full_outer_small.png',
            shadow_partial_inner_large: 'modules/put-a-ring-on-it/assets/shadows/shadow_partial_inner_large.png',
            shadow_partial_inner_medium: 'modules/put-a-ring-on-it/assets/shadows/shadow_partial_inner_medium.png',
            shadow_partial_inner_small: 'modules/put-a-ring-on-it/assets/shadows/shadow_partial_inner_small.png',
            shadow_partial_outer_large: 'modules/put-a-ring-on-it/assets/shadows/shadow_partial_outer_large.png',
            shadow_partial_outer_medium: 'modules/put-a-ring-on-it/assets/shadows/shadow_partial_outer_medium.png',
            shadow_partial_outer_small: 'modules/put-a-ring-on-it/assets/shadows/shadow_partial_outer_small.png'
        });
    }
}
export class TokenRingProfile {
    constructor(data = {}) {
        this.name = data?.name ?? 'Default Profile';
        this.identifier = data?.identifier ?? data.name?.toLowerCase().replace(/\s+/g, '-') ?? 'default-profile';
        this.overrideEnabled = data?.overrideEnabled ?? false;
        this.overrideTexture = data?.overrideTexture;
        this._ring = data?.ring;
        this.texture = data?.texture;
        this.ringSize = data?.ringSize;
        this.bevelStyle = data?.bevelStyle;
        this.colorOverlayEnabled = data?.colorOverlayEnabled;
        this.colorOverlayColor = data?.colorOverlayColor;
        this._innerBorder = data?.innerBorder;
        this.innerBorderEnabled = data?.innerBorderEnabled;
        this.innerBorderSize = data?.innerBorderSize;
        this.innerBorderColor = data?.innerBorderColor;
        this._outerBorder = data?.outerBorder;
        this.outerBorderEnabled = data?.outerBorderEnabled;
        this.outerBorderSize = data?.outerBorderSize;
        this.outerBorderColor = data?.outerBorderColor;
        this._innerShadow = data?.innerShadow;
        this.innerShadowEnabled = data?.innerShadowEnabled;
        this.innerShadowCoverage = data?.innerShadowCoverage;
        this._outerShadow = data?.outerShadow;
        this.outerShadowEnabled = data?.outerShadowEnabled;
        this.outerShadowCoverage = data?.outerShadowCoverage;
        this._innerGlow = data?.innerGlow;
        this.innerGlowEnabled = data?.innerGlowEnabled;
        this.innerGlowColor = data?.innerGlowColor;
        this._outerGlow = data?.outerGlow;
        this.outerGlowEnabled = data?.outerGlowEnabled;
        this.outerGlowColor = data?.outerGlowColor;
    }
    // Data instances
    get ring() {
        if (!(this._ring instanceof Ring)) {
            this._ring = new Ring({
                texture: this.texture,
                size: this.ringSize,
                bevelStyle: this.bevelStyle,
                colorOverlayEnabled: this.colorOverlayEnabled,
                colorOverlayColor: this.colorOverlayColor
            });
        }
        return this._ring;
    }
    get innerBorder() {
        if (!(this._innerBorder instanceof Border)) {
            this._innerBorder = new Border({
                enabled: this.innerBorderEnabled,
                size: this.innerBorderSize,
                color: this.innerBorderColor
            });
        }
        return this._innerBorder;
    }
    get outerBorder() {
        if (!(this._outerBorder instanceof Border)) {
            this._outerBorder = new Border({
                enabled: this.outerBorderEnabled,
                size: this.outerBorderSize,
                color: this.outerBorderColor
            });
        }
        return this._outerBorder;
    }
    get innerShadow() {
        if (!(this._innerShadow instanceof Shadow)) {
            this._innerShadow = new Shadow({
                enabled: this.innerShadowEnabled,
                coverage: this.innerShadowCoverage,
                location: 'inner',
                size: this.ring.size
            });
        }
        return this._innerShadow;
    }
    get outerShadow() {
        if (!(this._outerShadow instanceof Shadow)) {
            this._outerShadow = new Shadow({
                enabled: this.outerShadowEnabled,
                coverage: this.outerShadowCoverage,
                location: 'outer',
                size: this.ring.size
            });
        }   
        return this._outerShadow;
    }
    get innerGlow() {
        if (!(this._innerGlow instanceof Glow)) {
            this._innerGlow = new Glow({
                enabled: this.innerGlowEnabled,
                coverage: 'full',
                location: 'inner',
                size: this.ring.size,
                color: this.innerGlowColor
            });
        }
        return this._innerGlow;
    }
    get outerGlow() {
        if (!(this._outerGlow instanceof Glow)) {
            this._outerGlow = new Glow({
                enabled: this.outerGlowEnabled,
                coverage: 'full',
                location: 'outer',
                size: this.ring.size,
                color: this.outerGlowColor
            });
        }
        return this._outerGlow;
    }
    // Data for setting editor
    _sizesOptions = [
        {label: 'DND5E.SizeSmall', value: 'small'},
        {label: 'DND5E.SizeMedium', value: 'medium'},
        {label: 'DND5E.SizeLarge', value: 'large'}
    ];
    _coverageOptions = [
        {label: 'PUTARINGONIT.Defaults.Full', value: 'full'},
        {label: 'PUTARINGONIT.Defaults.Partial', value: 'partial'}
    ];
    get profileDataFields() {
        return [
            {
                name: 'info',
                label: 'PUTARINGONIT.Profiles.App.Field.Info.Label',
                enabled: true,
                inputs: [
                    {
                        type: 'text',
                        name: 'name',
                        id: 'profile-name',
                        label: 'PUTARINGONIT.Profiles.App.Field.Info.ProfileName.Label',
                        value: this.name
                    },
                    {
                        type: 'text',
                        name: 'identifier',
                        id: 'profile-identifier',
                        label: 'PUTARINGONIT.Profiles.App.Field.Info.ProfileIdentifier.Label',
                        value: this.identifier
                    },
                    {
                        type: 'checkbox',
                        name: 'overrideEnabled',
                        id: 'override-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Info.OverrideEnabled.Label',
                        hint: 'PUTARINGONIT.Profiles.App.Field.Info.OverrideEnabled.Hint',
                        value: this.overrideEnabled
                    }
                ]
            },
            {
                name: 'override',
                label: 'PUTARINGONIT.Profiles.App.Field.Override.Label',
                enabled: this.overrideEnabled,
                inputs: [
                    {
                        type: 'image',
                        name: 'overrideTexture',
                        id: 'override-texture',
                        label: 'PUTARINGONIT.Profiles.App.Field.Override.OverrideTexture.Label',
                        hint: 'PUTARINGONIT.Profiles.App.Field.Override.OverrideTexture.Hint',
                        value: this.overrideTexture
                    }
                ]
            },
            {
                name: 'ring',
                label: 'PUTARINGONIT.Profiles.App.Field.Ring.Label',
                enabled: !this.overrideEnabled,
                inputs: [
                    {
                        type: 'image',
                        defaultPath: 'modules/put-a-ring-on-it/assets/textures',
                        name: 'texture',
                        id: 'ring-texture',
                        label: 'PUTARINGONIT.Profiles.App.Field.Ring.Texture.Label',
                        hint: 'PUTARINGONIT.Profiles.App.Field.Ring.Texture.Hint',
                        value: this.ring.texture
                    },
                    {
                        type: 'select',
                        name: 'ringSize',
                        id: 'ring-size',
                        label: 'PUTARINGONIT.Profiles.App.Field.Ring.Size.Label',
                        hint: 'PUTARINGONIT.Profiles.App.Field.Ring.Size.Hint',
                        value: this.ring.size,
                        options: this._sizesOptions
                    },
                    {
                        type: 'select',
                        name: 'bevelStyle',
                        id: 'bevel-style',
                        label: 'PUTARINGONIT.Profiles.App.Field.Ring.BevelStyle.Label',
                        hint: 'PUTARINGONIT.Profiles.App.Field.Ring.BevelStyle.Hint',
                        value: this.ring.bevelStyle,
                        options: [
                            {label: 'PUTARINGONIT.Defaults.None', value: 'none'},
                            {label: 'PUTARINGONIT.Defaults.SingleBevel', value: 'single'},
                            {label: 'PUTARINGONIT.Defaults.FrameBevel', value: 'frame'}
                        ]
                    },
                    {
                        type: 'checkbox',
                        name: 'colorOverlayEnabled',
                        id: 'color-overlay-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Ring.ColorOverlayEnabled.Label',
                        hint: 'PUTARINGONIT.Profiles.App.Field.Ring.ColorOverlayEnabled.Hint',
                        value: this.ring.colorOverlayEnabled
                    },
                    {
                        type: 'color',
                        name: 'colorOverlayColor',
                        id: 'color-overlay',
                        label: 'PUTARINGONIT.Profiles.App.Field.Ring.ColorOverlay.Label',
                        value: this.ring.colorOverlayColor
                    }
                ]
            },
            {
                name: 'borders',
                label: 'PUTARINGONIT.Profiles.App.Field.Borders.Label',
                enabled: !this.overrideEnabled,
                inputs: [
                    {
                        type: 'checkbox',
                        name: 'innerBorderEnabled',
                        id: 'inner-border-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Borders.InnerBorder.Enabled.Label',
                        value: this.innerBorder.enabled
                    },
                    {
                        type: 'select',
                        name: 'innerBorderSize',
                        id: 'inner-border-size',
                        label: 'PUTARINGONIT.Profiles.App.Field.Borders.InnerBorder.Size.Label',
                        value: this.innerBorder.size,
                        options: this._sizesOptions
                    },
                    {
                        type: 'color',
                        name: 'innerBorderColor',
                        id: 'inner-border-color',
                        label: 'PUTARINGONIT.Profiles.App.Field.Borders.InnerBorder.Color.Label',
                        value: this.innerBorder.color
                    },
                    {
                        type: 'checkbox',
                        name: 'outerBorderEnabled',
                        id: 'outer-border-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Borders.OuterBorder.Enabled.Label',
                        value: this.outerBorder.enabled
                    },
                    {
                        type: 'select',
                        name: 'outerBorderSize',
                        id: 'outer-border-size',
                        label: 'PUTARINGONIT.Profiles.App.Field.Borders.OuterBorder.Size.Label',
                        value: this.outerBorder.size,
                        options: this._sizesOptions
                    },
                    {
                        type: 'color',
                        name: 'outerBorderColor',
                        id: 'outer-border-color',
                        label: 'PUTARINGONIT.Profiles.App.Field.Borders.OuterBorder.Color.Label',
                        value: this.outerBorder.color
                    }
                ]
            },
            {
                name: 'shadows',
                label: 'PUTARINGONIT.Profiles.App.Field.Shadows.Label',
                enabled: !this.overrideEnabled,
                inputs: [
                    {
                        type: 'checkbox',
                        name: 'innerShadowEnabled',
                        id: 'inner-shadow-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Shadows.InnerShadow.Enabled.Label',
                        value: this.innerShadow.enabled
                    },
                    {
                        type: 'select',
                        name: 'innerShadowCoverage',
                        id: 'inner-shadow-coverage',
                        label: 'PUTARINGONIT.Profiles.App.Field.Shadows.InnerShadow.Coverage.Label',
                        value: this.innerShadow.coverage,
                        options: this._coverageOptions
                    },
                    {
                        type: 'checkbox',
                        name: 'outerShadowEnabled',
                        id: 'outer-shadow-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Shadows.OuterShadow.Enabled.Label',
                        value: this.outerShadow.enabled
                    },
                    {
                        type: 'select',
                        name: 'outerShadowCoverage',
                        id: 'outer-shadow-coverage',
                        label: 'PUTARINGONIT.Profiles.App.Field.Shadows.OuterShadow.Coverage.Label',
                        value: this.outerShadow.coverage,
                        options: this._coverageOptions
                    }
                ]
            },
            {
                name: 'glows',
                label: 'PUTARINGONIT.Profiles.App.Field.Glows.Label',
                enabled: !this.overrideEnabled,
                inputs: [
                    {
                        type: 'checkbox',
                        name: 'innerGlowEnabled',
                        id: 'inner-glow-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Glows.InnerGlow.Enabled.Label',
                        value: this.innerGlow.enabled
                    },
                    {
                        type: 'color',
                        name: 'innerGlowColor',
                        id: 'inner-glow-color',
                        label: 'PUTARINGONIT.Profiles.App.Field.Glows.InnerGlow.Color.Label',
                        value: this.innerGlow.color
                    },
                    {
                        type: 'checkbox',
                        name: 'outerGlowEnabled',
                        id: 'outer-glow-enabled',
                        label: 'PUTARINGONIT.Profiles.App.Field.Glows.OuterGlow.Enabled.Label',
                        value: this.outerGlow.enabled
                    },
                    {
                        type: 'color',
                        name: 'outerGlowColor',
                        id: 'outer-glow-color',
                        label: 'PUTARINGONIT.Profiles.App.Field.Glows.OuterGlow.Color.Label',
                        value: this.outerGlow.color
                    }
                ]
                    

            }
        ];
    }
}
class Ring {
    constructor(data = {}) {
        this.texture = data?.texture ?? 'modules/put-a-ring-on-it/assets/textures/metal.png';
        this.size = data?.size ?? 'medium';
        this.bevelStyle = data?.bevelStyle ?? 'single';
        this.colorOverlayEnabled = data?.colorOverlayEnabled ?? false;
        this.colorOverlayColor = data?.colorOverlayColor ?? null;
    }
    get bevelFileKey() {
        return this.bevelStyle != 'none' ? `bevel_${this.bevelStyle}_${this.size}` : null;
    }
    get bevelFilePath() {
        return this.bevelStyle != 'none' ? `modules/put-a-ring-on-it/assets/bevels/bevel_${this.bevelStyle}_${this.size}.png` : null;
    }
}
class Border {
    constructor(data = {}) {
        this.enabled = data?.enabled ?? false;
        this.size = data?.size ?? 'medium';
        this.color = data?.color ?? '#000000';
    }
    get lineRatio() {
        switch (this.size) {
            case 'small':
                return 0.01;
            case 'medium':
                return 0.015;
            case 'large':
                return 0.02;
        }
        return 0.015;
    }
}
class glowShadow {
    constructor(data = {}) {
        this.enabled = data?.enabled ?? false;
        this.location = data?.location ?? 'outer'; // inner, outer
        this.coverage = data?.coverage ?? 'full';
        this.size = data?.size ?? 'medium';
    }
}
class Shadow extends glowShadow {
    constructor(data = {}) {
        super(data);
    }
    get fileKey() {
        return `shadow_${this.coverage}_${this.location}_${this.size}`;
    }
    get filePath() {
        return `modules/put-a-ring-on-it/assets/shadows/shadow_${this.coverage}_${this.location}_${this.size}.png`;
    }
}
class Glow extends glowShadow {
    constructor(data = {}) {
        data.coverage = 'full';
        super(data);
        this.color = data?.color ?? '#ffffff';
    }
    get fileKey() {
        return `glow_${this.coverage}_${this.location}_${this.size}`;
    }
    get filePath() {
        return `modules/put-a-ring-on-it/assets/glows/glow_${this.coverage}_${this.location}_${this.size}.png`;
    }
}