const DEFAULT_SETTINGS = {
    [SETTINGS.RATING.key]: false,
    [SETTINGS.REVIEW_MODE.key]: null,
    [SETTINGS.SHOW_LOGGED.key]: false,
};

const Settings = {
    async getAll() {
        const storedSettings = await browser.storage.local.get(Object.keys(DEFAULT_SETTINGS));
        return {
            ...DEFAULT_SETTINGS,
            ...storedSettings
        }
    },

    async save(settings) {
        await browser.storage.local.set(settings);
    },

    async setRating(value) {
        await this.save({[SETTINGS.RATING.key]: value});
    },

    async setReviewMode(value) {
        await this.save({[SETTINGS.REVIEW_MODE.key]: value});
    },

    async setShowLogged(value) {
        await this.save({[SETTINGS.SHOW_LOGGED.key]: value});
    },
}