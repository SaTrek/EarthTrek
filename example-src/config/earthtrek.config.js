var config = {
    dev: {
        app: {
            frequency: 30,
            orbitDuration: 7200
        },
        api: {
            url: "http://localhost:9081/",
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
}
module.exports = config;
