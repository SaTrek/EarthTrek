var merge = require('deepmerge');
var earthtrekConfig = {
    dev: {
        api: {
            url: "http://localhost:9081",
            username: "DEMO",
            app: "DEMO",
            token: "123456"
        }
    }
    /*
        prod: {
            apiUrl: "http://api.earthtrekapp.org",
            username: "DEMO",
            app: "DEMO",
            token: "DEMO"
        },
        mobile: {
            apiUrl: "http://api.earthtrekapp.org",
            username: "DEMO",
            app: "DEMO",
            token: "DEMO"
        }
    }*/
};
var defaultConfig = {
    app: {
        frequency: 15,
        orbitDuration: 3600
    },
    api: {
        url: "http://api.orbitaldesign.tk",
        username: "DEMO",
        app: "DEMO",
        token: "123456"
    }
};
module.exports = merge(defaultConfig, earthtrekConfig.dev);
