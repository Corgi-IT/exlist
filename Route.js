module.exports = class Route {
    constructor({url, handle, method}) {
        this.url = url;
        this.handle = handle;
        this.method = method;
    }

    getParams() {
        const params = this.url.match(/(:)\w+/g);
        if (params) {

            const paramsLength = params.length;

            for (let i = 0; i < paramsLength; i++) {
                params[i] = params[i].substr(1);
            }

        }
        return params || [];
    }
};
