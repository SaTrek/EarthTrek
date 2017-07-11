var merge = require('deepmerge');
var earthtrekConfig = {
    dev: {
        api: {
            url: "http://api.orbitaldesign.tk",
            username: "DEMO",
            app: "DEMO",
            token: "123456"
        }
    }
};
var defaultConfig = {
    app: {
        frequency: 30,
        orbitDuration: 7200
    },
    api: {
        url: "http://api.orbitaldesign.tk",
        username: "DEMO",
        app: "DEMO",
        token: "123456",
        satellites: {
            endpoint: "satellites"
        },
        tle: {
            endpoint: "tles",
            fields: "tle,satId"
        }
    }
};
if (process.env.NODE_ENV == undefined) {
 //   process.env.NODE_ENV = ENVIRONMENT;
}
module.exports = merge(defaultConfig, earthtrekConfig[process.env.NODE_ENV]);