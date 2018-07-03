const Table = require('cli-table3');
const methods = require('./methods');
const Route = require('./Route');

const routesList = [];
let application = null;

function url(handle, obj) {
    const rte = route(handle);
    const link = paramFix(rte.url, obj);
    const domain = application.get('domain') || '..';
    return `${domain}${link}`;
}

function paramFix(link, obj) {
    if (!obj) {
        return link;
    }

    let result = null;
    while (result = link.match(/(:)\w+/g)) {
        const found = result[0];
        link = link.replace(found, obj[found.substr(1)]);
    }
    return link;
}

function route(handle) {
    const length = routesList.length;
    for (let i = 0; i < length; i++) {
        const rte = routesList[i];
        if (rte.handle === handle) {
            return rte;
        }
    }
    return routesList[0];
}

function argsFixer(args, method) {
    if (args.length > 0 &&
        (args[0].constructor === String && args[0].indexOf('/') === 0) ||
        (args[0].url && args[0].url.indexOf('/') === 0)) {
        let url = '';
        let rteObj = null;
        const arg0 = args[0];

        if (arg0.constructor === String) {
            url = arg0;
            rteObj = new Route({url, handle: url, method});
        } else {
            url = arg0.url;
            arg0.method = method;

            rteObj = new Route(arg0);
        }
        routesList.push(rteObj);
        args[0] = url;
    }
    return args;
}

module.exports = function (app) {
    application = app;

    methods.forEach((element) => {
        const tempfn = app[element];

        app[element] = function () {
            const args = argsFixer(arguments, element);
            return tempfn.apply(this, args);
        };
    });

    return function (req, res, next) {
        res.locals.getRoute = route;
        res.exlist = function () {
            return res.redirect(
                url(...Object.keys(arguments).map((key) => arguments[key]))
            );
        };

        res.exlist.route = res.locals.route = url;

        next();
    };
};

module.exports.route = route;

module.exports.list = function list() {
    return routesList;
};

module.exports.cliTable = function cliTable() {
    const table = new Table({
        head: ['Route', 'Method', 'Handle', 'Arguments']
    });

    routesList.forEach((element) => {
        const arr = [];

        arr.push(element.url);
        arr.push(element.method);
        arr.push(element.handle);
        arr.push(element.getParams().toString());

        table.push(arr);
    });

    console.log(table.toString());
};
