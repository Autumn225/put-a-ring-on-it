export class Constants {
    static MODULE_NAME = 'put-a-ring-on-it';
    static get profiles() {
        let profiles = game.settings.get(this.MODULE_NAME, 'profiles') ?? {}; // default profiles here
        return Object.fromEntries(Object.entries(profiles)?.map(([key, value]) => ([key, value.name])));
    }
    static localize(key) {
        return game.i18n.localize(key);
    }
    static get defaultProfiles() {
        return {
            hostile: new TokenRingProfile({
                name: 'TOKEN.DISPOSITION.HOSTILE',
                identifier: 'hostile',
                texture: 'modules/put-a-ring-on-it/assets/textures/metal.png',
                ringSize: Constants.RING_SIZES.medium,
                ringBevel: Constants.RING_BEVELS.single,
                colorOverlay: '#ff0000'
            }),
            neutral: new TokenRingProfile({
                name: 'TOKEN.DISPOSITION.NEUTRAL',
                identifier: 'neutral',
                texture: 'modules/put-a-ring-on-it/assets/textures/stone.png',
                ringSize: Constants.RING_SIZES.medium,
                ringBevel: Constants.RING_BEVELS.single
            }),
            friendly: new TokenRingProfile({
                name: 'TOKEN.DISPOSITION.FRIENDLY',
                identifier: 'friendly',
                texture: 'modules/put-a-ring-on-it/assets/textures/marble.png',
                ringSize: Constants.RING_SIZES.medium,
                ringBevel: Constants.RING_BEVELS.frame,
                colorOverlay: '#00ff00'
            })
        };
    }
    static get RING_SIZES() {
        return {
            small: SMALL_RING_SIZE,
            medium: MEDIUM_RING_SIZE,
            large: LARGE_RING_SIZE
        };
    }
    static get RING_BEVELS() {
        return {
            single: SINGLE_BEVEL,
            frame: FRAME_BEVEL
        };
    }
}
export class TokenRingProfile {
    constructor(data = {}) {
        this.name = data?.name ?? 'Default Profile';
        this.identifier = data?.identifier ?? data.name?.toLowerCase().replace(/\s+/g, '-') ?? 'default-profile';
        this.overrideTexture = data?.overrideTexture;
        this.texture = data?.texture ?? 'modules/put-a-ring-on-it/assets/textures/metal.png';
        this.ringSize = data?.ringSize ? data.ringSize instanceof RING_SIZE ? data.ringSize : Constants.RING_SIZES[data.ringSize] : Constants.RING_SIZES.medium;
        this.ringBevel = data?.ringBevel ? data.ringBevel instanceof RING_BEVEL ? data.ringBevel : Constants.RING_BEVELS[data.ringBevel] : Constants.RING_BEVELS.single;
        this.colorOverlay = data?.colorOverlay;
        this.innerBorder = data?.innerBorder instanceof Border ? data.innerBorder : data?.innerBorderData ? new Border(data.innerBorderData) : null;
        this.outerBorder = data?.outerBorder instanceof Border ? data.outerBorder : data?.outerBorderData ? new Border(data.outerBorderData) : null;
        this.innerShadow = data?.innerShadow instanceof Shadow ? data.innerShadow : data?.innerShadowData ? new Shadow(data.innerShadowData) : null;
        this.outerShadow = data?.outerShadow instanceof Shadow ? data.outerShadow : data?.outerShadowData ? new Shadow(data.outerShadowData) : null;
        this.outerGlow = data?.outerGlow instanceof Glow ? data.outerGlow : data?.outerGlowData ? new Glow(data.outerGlowData) : null;
    }
}
class RING_SIZE {
    static identifier = 'default';
}
class SMALL_RING_SIZE extends RING_SIZE {
    static identifier = 'small';
    static label = 'PUTARINGONIT.Defaults.Small';
}
class MEDIUM_RING_SIZE extends RING_SIZE {
    static identifier = 'medium';
    static label = 'PUTARINGONIT.Defaults.Medium';
}
class LARGE_RING_SIZE extends RING_SIZE {
    static identifier = 'large';
    static label = 'PUTARINGONIT.Defaults.Large';
}
class RING_BEVEL {
    static identifier = 'default';
}
class SINGLE_BEVEL extends RING_BEVEL {
    static identifier = 'single';
    static label = 'PUTARINGONIT.Defaults.SingleBevel';
}
class FRAME_BEVEL extends RING_BEVEL {
    static identifier = 'frame';
    static label = 'PUTARINGONIT.Defaults.FrameBevel';
}
/**
 * size: small, medium, large}
 * color: hex color
 * radiusPercent: 0-100
 *  -- inner default 80 !! change these
 *  -- outer default 100
 */
class Border {
    constructor(data = {}) {
        this.size = data?.size ?? 'medium';
        this.color = data?.color ?? '#000000';
        this.radiusPercent = data?.radiusPercent ?? 100;
    }
    get width() {
        switch (this.size) {
            case 'small':
                return 4;
            case 'medium':
                return 8;
            case 'large':
                return 12; // change these
        }
        return 8;
    }
}
class Shadow {
    constructor(data = {}) {
        this.type = data?.type ?? 'full'; // full, top-left, bottom-right
        this.size = data?.size ?? 'medium';
    }
}
class Glow {
    constructor(data = {}) {
        this.color = data?.color ?? '#000000';
        this.size = data?.size ?? 'medium';
    }
}