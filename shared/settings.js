const DEFAULT_SETTINGS = {
    [SETTINGS.RATING.key]: false,
    [SETTINGS.REVIEW.key]: false,
    [SETTINGS.SHOW_LOGGED.key]: false
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

    async getRating() {
        return (await this.getAll())[SETTINGS.RATING.key];
    },

    async setRating(value) {
        await this.save({[SETTINGS.RATING.key]: value})
    },

    async getReview() {
        return (await this.getAll())[SETTINGS.REVIEW.key];
    },

    async setReview(value) {
        await this.save({[SETTINGS.REVIEW.key]: value})
    },

    async getShowLogged() {
        return (await this.getAll())[SETTINGS.SHOW_LOGGED.key];
    },

    async setShowLogged(value) {
        await this.save({[SETTINGS.SHOW_LOGGED.key]: value})
    }
}