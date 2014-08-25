module.exports = {
    "site": {
        "name": "text-autolinker",
    },
    "environments": {
        "development": {
            "server": {
                "host": "localhost",
                "port": 3007,
            }
        },
        "production": {
            "server": {
                "host": "0.0.0.0",
                "port": 8000,
            }
        }
    }
}