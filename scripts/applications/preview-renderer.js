import {Constants, TokenRingProfile} from '../constants.js';

/** Standalone PIXI preview renderer for token ring profiles. */
export class PreviewRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.app = new PIXI.Application({
            view: canvas,
            width: 200,
            height: 200,
            backgroundAlpha: 0,
            antialias: true
        });
        this.textures = {};
        this._portraitTexture = null;
    }

    /** Load all asset textures and random SRD portraits. */
    async loadTextures() {
        let entries = await Promise.all(
            Object.entries(Constants.assetPaths).map(async ([key, path]) =>
                [key, await foundry.canvas.loadTexture(path)]
            )
        );
        this.textures = Object.fromEntries(entries);
        // Cache portrait indices from SRD packs
        this._monsterIndex = await game.packs.get('dnd5e.monsters')?.getIndex() ?? [];
        this._heroIndex = await game.packs.get('dnd5e.heroes')?.getIndex() ?? [];
        // Fallback portrait
        this._fallbackTexture = await foundry.canvas.loadTexture('icons/svg/mystery-man.svg');
        this._portraitTexture = this._fallbackTexture;
    }

    /**
     * Pick a random SRD portrait based on which disposition default this profile is assigned to.
     * Hostile → monsters pack, Neutral/Friendly → heroes pack, unassigned → either.
     * @param {string} profileKey - The selected profile key.
     */
    async _randomizePortrait(profileKey) {
        let hostile = game.settings.get(Constants.MODULE_NAME, 'defaultProfileHostile');
        let neutral = game.settings.get(Constants.MODULE_NAME, 'defaultProfileNeutral');
        let friendly = game.settings.get(Constants.MODULE_NAME, 'defaultProfileFriendly');
        let index;
        if (profileKey === hostile) index = this._monsterIndex;
        else if (profileKey === neutral || profileKey === friendly) index = this._heroIndex;
        else index = Math.random() < 0.5 ? this._monsterIndex : this._heroIndex;
        if (!index?.size && !index?.length) {
            this._portraitTexture = this._fallbackTexture;
            return;
        }
        let entries = index instanceof Map ? Array.from(index.values()) : Array.from(index);
        let pick = entries[Math.floor(Math.random() * entries.length)];
        let imgPath = pick?.img;
        if (imgPath) {
            this._portraitTexture = await this._loadProfileTexture(imgPath) ?? this._fallbackTexture;
        } else {
            this._portraitTexture = this._fallbackTexture;
        }
    }

    /** Load a texture by path, caching on this instance. */
    async _loadProfileTexture(path) {
        if (!path) return null;
        if (!this.textures[path]) {
            this.textures[path] = await foundry.canvas.loadTexture(path);
        }
        return this.textures[path];
    }

    /**
     * Render a profile preview onto the canvas.
     * @param {object} profileData - Raw profile data from the profiles menu.
     * @param {string} profileKey - The selected profile key for disposition lookup.
     */
    async render(profileData, profileKey) {
        let stage = this.app.stage;
        // Clear previous render
        while (stage.children.length > 0) {
            stage.removeChildAt(0)?.destroy({children: true});
        }
        if (!profileData) return;

        let profile = new TokenRingProfile(profileData);
        if (profileKey !== this._lastProfileKey) {
            this._lastProfileKey = profileKey;
            await this._randomizePortrait(profileKey);
        }
        let size = 200;
        let cx = size / 2;
        let cy = size / 2;

        // Load profile-specific texture
        let texturePath = profile.overrideEnabled ? profile.overrideTexture : profile.ring.texture;
        let profileTexture = await this._loadProfileTexture(texturePath);

        const holeRatio = (profile.ring.size === 'small' ? 954 : profile.ring.size === 'large' ? 814 : 884) / 1024;
        const outerScale = 1075 / 1024;
        const outerRadius = size / 2;
        const innerRadius = outerRadius * holeRatio;

        // Portrait (mystery-man masked to inner circle)
        if (this._portraitTexture) {
            let portrait = new PIXI.Sprite(this._portraitTexture);
            portrait.anchor.set(0.5);
            portrait.position.set(cx, cy);
            portrait.width = size;
            portrait.height = size;
            let portraitMask = new PIXI.Graphics();
            portraitMask.beginFill(0xFFFFFF);
            portraitMask.drawCircle(cx, cy, innerRadius);
            portraitMask.endFill();
            stage.addChild(portraitMask);
            portrait.mask = portraitMask;
            stage.addChild(portrait);
        }

        // Override mode — just show the override texture
        if (profile.overrideEnabled) {
            if (profileTexture) {
                let overrideContainer = new PIXI.Container();
                overrideContainer.position.set(cx, cy);
                let sprite = new PIXI.Sprite(profileTexture);
                sprite.anchor.set(0.5);
                sprite.width = size;
                sprite.height = size;
                overrideContainer.addChild(sprite);
                stage.addChild(overrideContainer);
            }
            this.app.render();
            return;
        }

        // Back container (outer glow + outer shadow)
        let backContainer = new PIXI.Container();
        backContainer.position.set(cx, cy);
        if (profile.outerGlowEnabled) {
            let tex = this.textures[profile.outerGlow.fileKey];
            if (tex) {
                let og = new PIXI.Sprite(tex);
                og.anchor.set(0.5);
                og.width = size * outerScale;
                og.height = size * outerScale;
                og.tint = profile.outerGlow.color;
                backContainer.addChild(og);
            }
        }
        if (profile.outerShadowEnabled) {
            let tex = this.textures[profile.outerShadow.fileKey];
            if (tex) {
                let os = new PIXI.Sprite(tex);
                os.anchor.set(0.5);
                os.width = size * outerScale;
                os.height = size * outerScale;
                backContainer.addChild(os);
            }
        }
        // Insert behind portrait
        stage.addChildAt(backContainer, 0);

        // Front container
        let frontContainer = new PIXI.Container();
        frontContainer.position.set(cx, cy);

        // Inner effects
        let innerEffects = new PIXI.Container();
        if (profile.innerGlowEnabled) {
            let tex = this.textures[profile.innerGlow.fileKey];
            if (tex) {
                let ig = new PIXI.Sprite(tex);
                ig.anchor.set(0.5);
                ig.width = size * outerScale;
                ig.height = size * outerScale;
                ig.tint = profile.innerGlow.color;
                innerEffects.addChild(ig);
            }
        }
        if (profile.innerShadowEnabled) {
            let tex = this.textures[profile.innerShadow.fileKey];
            if (tex) {
                let is_ = new PIXI.Sprite(tex);
                is_.anchor.set(0.5);
                is_.width = size * outerScale;
                is_.height = size * outerScale;
                innerEffects.addChild(is_);
            }
        }
        frontContainer.addChild(innerEffects);

        // Donut mask (outer circle minus inner hole)
        let ringMask = new PIXI.Graphics();
        ringMask.beginFill(0xFFFFFF);
        ringMask.drawCircle(0, 0, outerRadius);
        ringMask.beginHole();
        ringMask.drawCircle(0, 0, innerRadius);
        ringMask.endHole();
        ringMask.endFill();
        frontContainer.addChild(ringMask);

        // Ring group (texture, bevel, borders)
        let ringGroup = new PIXI.Container();
        if (profileTexture) {
            let r = new PIXI.Sprite(profileTexture);
            r.anchor.set(0.5);
            r.width = size;
            r.height = size;
            if (profile.ring.colorOverlayEnabled) {
                r.tint = profile.ring.colorOverlayColor;
            }
            ringGroup.addChild(r);
        }
        if (profile.ring.bevelStyle !== 'none') {
            let bevelTex = this.textures[profile.ring.bevelFileKey];
            if (bevelTex) {
                let b = new PIXI.Sprite(bevelTex);
                b.anchor.set(0.5);
                b.width = size;
                b.height = size;
                ringGroup.addChild(b);
            }
        }
        if (profile.innerBorder.enabled) {
            let ib = new PIXI.Graphics();
            ib.lineStyle(size * profile.innerBorder.lineRatio, profile.innerBorder.color);
            ib.drawCircle(0, 0, innerRadius);
            ringGroup.addChild(ib);
        }
        if (profile.outerBorder.enabled) {
            let ob = new PIXI.Graphics();
            ob.lineStyle(size * profile.outerBorder.lineRatio, profile.outerBorder.color);
            ob.drawCircle(0, 0, outerRadius);
            ringGroup.addChild(ob);
        }
        ringGroup.mask = ringMask;
        frontContainer.addChild(ringGroup);

        stage.addChild(frontContainer);
        this.app.render();
    }

    /** Clean up PIXI resources. */
    destroy() {
        this.app.destroy(false, {children: true});
        this.textures = {};
        this._portraitTexture = null;
    }
}
