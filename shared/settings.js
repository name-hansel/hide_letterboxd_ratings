const DEFAULT_SETTINGS = {
    [SETTINGS.RATING.key]: false,
    [SETTINGS.REVIEW.key]: false,
    [SETTINGS.SHOW_LOGGED.key]: false,
    [SETTINGS.HIDE_REVIEWS_BELOW.key]: false
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

    async setReview(value) {
        await this.save({[SETTINGS.REVIEW.key]: value});
    },

    async setShowLogged(value) {
        await this.save({[SETTINGS.SHOW_LOGGED.key]: value});
    },

    async setHideReviewsBelow(value) {
        await this.save({[SETTINGS.HIDE_REVIEWS_BELOW.key]: value});
    }
}