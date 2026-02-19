import {Constants, TokenRingProfile} from './constants.js';

let cachedTextures = null;
let profiles = null;
let settings = null;

// Setup Hook
async function wrap() {
    if (!game.modules.get('lib-wrapper')?.active) return;
    if (!settings) syncSettings();
    if (!cachedTextures) await cacheTextures();
    libWrapper.register(Constants.MODULE_NAME, 'foundry.canvas.placeables.Token.prototype._draw', wrapper, 'WRAPPER');
    async function wrapper(wrapped, ...args) {
        await wrapped(...args);
        applyRing(this);
        return this;
    }
}
async function cacheTextures() {
    profiles = game.settings.get(Constants.MODULE_NAME, 'profiles');
    let constantAssets = await Promise.all(Object.entries(Constants.assetPaths).map(async ([key, path]) => [key, await foundry.canvas.loadTexture(path)]));
    let settingAssets = await Promise.all(Object.entries(profiles).map(async ([key, value]) => [key, await foundry.canvas.loadTexture(value.overrideEnabled ? value.overrideTexture : value.texture)]));
    cachedTextures = Object.fromEntries(constantAssets.concat(settingAssets));
    // may want to change this to just cache the paths by each profile
}

// Ready Hook
function moduleCheck() {
    if (!game.modules.get('lib-wrapper')?.active && game.user.isGM) {
        ui.notifications.error('PUTARINGONIT.Module.LibWrapperRequired', {localize: true, permanent: true});
    }
}
function readyHooks() {
    if (!game.modules.get('lib-wrapper')?.active) {
        return;
    }
    Hooks.on('updateToken', updateToken);
    Hooks.on('renderPrototypeTokenConfig', renderTokenConfig);
    Hooks.on('renderTokenConfig', renderTokenConfig);
    Hooks.on('closeSettingsConfig', syncSettings);
}

// Functions
function applyRing(token) {
    // Determine if we should apply token ring
    let profile = null;
    let dispo = token.document.disposition;
    // If there's a selected profile, always apply it
    let selectedProfileKey = token.document.getFlag(Constants.MODULE_NAME, 'selected-profile');
    if (selectedProfileKey) profile = profiles[selectedProfileKey];
    // Otherwise, apply based on settings
    else if (settings.autoApply) {
        if (settings.applyByLinkedStatus != 'all') {
            if (settings.applyByLinkedStatus === 'linked' && !token.document.actorLink) return;
            else if (token.document.actorLink) return;
        }
        if (settings.applyByDisposition != 'all') {
            switch (settings.applyByDisposition) {
                case 'friendly':
                case 'neutral':
                case 'hostile':
                    if (dispo !== CONST.TOKEN_DISPOSITIONS[settings.applyByDisposition.toUpperCase()]) return;
                    break;
                case 'hostile_neutral':
                    if (dispo !== CONST.TOKEN_DISPOSITIONS.HOSTILE && dispo !== CONST.TOKEN_DISPOSITIONS.NEUTRAL) return;
                    break;
            }
        }
        // Check blacklist
        let src = token.document.texture.src;
        if (settings.blacklist.some(i => src.includes(i))) return;
        // If there's no selected profile, we default to disposition
        profile = profiles[settings['defaultProfile' + Object.keys(CONST.TOKEN_DISPOSITIONS)?.find(key => CONST.TOKEN_DISPOSITIONS[key] === dispo)?.toLowerCase().replace(/^./, char => char.toUpperCase())] ?? null];
    }
    if (!profile) return;

    // Make profile live
    profile = new TokenRingProfile(profile);

    let backContainerName = Constants.MODULE_NAME + '-back';
    let frontContainerName = Constants.MODULE_NAME + '-front';
    let maskName = Constants.MODULE_NAME + '-mask';

    // Delete old layers
    let oldBack = token.children.find(c => c.name === backContainerName);
    if (oldBack) oldBack.destroy({ children: true });
    let oldFront = token.children.find(c => c.name === frontContainerName);
    if (oldFront) oldFront.destroy({ children: true });
    let oldMask = token.children.find(c => c.name === maskName);
    if (oldMask) {
        oldMask.destroy();
        if (token.mesh) token.mesh.mask = null;
    }
    
    // Provided assets are 1024px for the ring, width of small is 35px, medium 70px, large 105px
    // Shadows and glow assets are 1075px to allow for them to go over the edge of the token
    const holeRatio = ((profile.ring.size === 'small' ? 954 : profile.ring.size === 'large' ? 814 : 884) / 1024);
    const standardPx = 1024;
    const outerPx = 1075;
    const outerScale = outerPx / standardPx;

    // Math
    const w = token.w * token.document.texture.scaleX;
    const h = token.h * token.document.texture.scaleY;
    const cx = token.w / 2;
    const cy = token.h / 2;
    const outerRadius = Math.max(w, h) / 2;
    const innerRadius = outerRadius * holeRatio;

    // Mask (Cuts the outside off the token art, makes it a circle)
    let mask = new PIXI.Graphics();
    mask.name = maskName;
    mask.beginFill(0xFFFFFF);
    mask.drawCircle(cx, cy, innerRadius);
    mask.endFill();
    token.addChild(mask);
    if (token.mesh) token.mesh.mask = mask;

    // If override is enabled (a premade token ring) just apply that
    if (profile.overrideEnabled) {
        let overrideRing = new PIXI.Container();
        overrideRing.name = frontContainerName;
        overrideRing.position.set(cx, cy);
        let o = new PIXI.Sprite(cachedTextures[profile.identifier]);
        o.anchor.set(0.5);
        o.width = w; 
        o.height = h;
        overrideRing.addChild(o);
        addTokenRing(token, overrideRing);
        return;
    }

    // Back containter (outer shadows and glows)
    // Shadows and glows are scaled up so they can extend outside the token
    let backContainer = new PIXI.Container();
    backContainer.name = backContainerName;
    backContainer.position.set(cx, cy); // Needs to be centered because it's scaled up
    if (profile.outerGlowEnabled) {
        let src = cachedTextures[profile.outerGlow.fileKey];
        let og = new PIXI.Sprite(src);
        og.anchor.set(0.5);
        og.width = w * outerScale;
        og.height = h * outerScale;
        og.tint = profile.outerGlow.color;
        backContainer.addChild(og);
    }
    if (profile.outerShadowEnabled) {
        let src = cachedTextures[profile.outerShadow.fileKey];
        let os = new PIXI.Sprite(src);
        os.anchor.set(0.5);
        os.width = w * outerScale;
        os.height = h * outerScale;
        backContainer.addChild(os);
    }
    // Insert container at the back
    token.addChildAt(backContainer, 0);

    // Front container (frames, bevels, inner shadows and glows)
    let frontContainer = new PIXI.Container();
    frontContainer.name = frontContainerName;
    frontContainer.position.set(cx, cy);

    // Glows and shadows
    let innerEffectsGroup = new PIXI.Container();
    if (profile.innerGlowEnabled) {
        let ig = new PIXI.Sprite(cachedTextures[profile.innerGlow.fileKey]);
        ig.anchor.set(0.5);
        ig.width = w * outerScale; 
        ig.height = h * outerScale;
        ig.tint = profile.innerGlow.color;
        innerEffectsGroup.addChild(ig);
    }
    if (profile.innerShadowEnabled && cachedTextures[profile.innerShadow.fileKey]) {
        let is = new PIXI.Sprite(cachedTextures[profile.innerShadow.fileKey]);
        is.anchor.set(0.5);
        is.width = w * outerScale; 
        is.height = h * outerScale;
        innerEffectsGroup.addChild(is);
    }
    frontContainer.addChild(innerEffectsGroup);


    // Token Ring (texture, bevel, borders, color overlay)
    let ringGroup = new PIXI.Container();
    let r = new PIXI.Sprite(cachedTextures[profile.identifier]);
    r.anchor.set(0.5);
    r.width = w; 
    r.height = h;
    if (profile.ring.colorOverlayEnabled) {
        r.tint = profile.ring.colorOverlayColor;
    }
    ringGroup.addChild(r);
    if (profile.ring.bevelStyle != 'none') {
        let b = new PIXI.Sprite(cachedTextures[profile.ring.bevelFileKey]);
        b.anchor.set(0.5);
        b.width = w; 
        b.height = h;
        ringGroup.addChild(b);
    }
    if (profile.innerBorder.enabled) {
        let ib = new PIXI.Graphics();
        ib.lineStyle(w * profile.innerBorder.lineRatio, profile.innerBorder.color);
        ib.drawCircle(0, 0, innerRadius);
        ringGroup.addChild(ib);
    }
    if (profile.outerBorder.enabled) {
        let ob = new PIXI.Graphics();
        ob.lineStyle(w * profile.outerBorder.lineRatio, profile.outerBorder.color);
        ob.drawCircle(0, 0, outerRadius);
        ringGroup.addChild(ob);
    }

    // Mask Ring Group
    let ringMask = new PIXI.Graphics();
    ringMask.beginFill(0xFFFFFF);
    ringMask.drawCircle(0, 0, outerRadius);
    ringMask.beginHole();
    ringMask.drawCircle(0, 0, innerRadius);
    ringMask.endHole();
    ringMask.endFill();
    frontContainer.addChild(ringMask);
    ringGroup.mask = ringMask;
    frontContainer.addChild(ringGroup);

    // Add all of front container (ring, shadows/glows) on top of the token but below other elements
    addTokenRing(token, frontContainer);

    function addTokenRing(token, container) {
        let targetIndex = -1;
        if (token.mesh && token.mesh.parent === token) {
            targetIndex = token.getChildIndex(token.mesh) + 1;
        }
        if (targetIndex === -1 && token.bars && token.bars.parent === token) {
            targetIndex = token.getChildIndex(token.bars);
        }
        if (targetIndex > -1) {
            token.addChildAt(container, targetIndex);
        } else {
            token.addChild(container);
        }
    }
}
function updateToken(document, change, options, userId) {
    // I will likely need to make this more efficient. Check if the profile changed or if the size or dispo changed.
    applyRing(document.object);
}
async function renderTokenConfig(config, html) {
    let imageDataTab = html.querySelector('.tab[data-tab="appearance"],.tab[data-tab="image"]');
    let options = [{label: 'PUTARINGONIT.Defaults.None', value: ''}].concat(Object.entries(game.settings.get(Constants.MODULE_NAME, 'profiles')).map(([key, value]) => ({label: value.name, value: key})));
    let configField = await foundry.applications.handlebars.renderTemplate(
        '/modules/put-a-ring-on-it/templates/token-config-field.hbs',
        {options, value: config.token.getFlag(Constants.MODULE_NAME, 'selected-profile') ?? ''});

    imageDataTab?.insertAdjacentHTML('beforeend', configField);
}
function syncSettings() {
    settings = Object.fromEntries(['blacklist', 'autoApply', 'applyByLinkedStatus', 'applyByDisposition', 'defaultProfileFriendly', 'defaultProfileNeutral', 'defaultProfileHostile'].map(key => [key, game.settings.get(Constants.MODULE_NAME, key)]));
}
export let PutARingOnIt = {
    wrap,
    moduleCheck,
    readyHooks,
    cacheTextures,
    syncSettings
};