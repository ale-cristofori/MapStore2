const path = require("path");
const extractThemesPlugin = require('./MapStore2/build/themes.js').extractThemesPlugin;
const ModuleFederationPlugin = require('./MapStore2/build/moduleFederation.js').plugin;

module.exports = require('./MapStore2/build/buildConfig')(
    {
        'MapStore2-C027': path.join(__dirname, "js", "apps", "app"),
        "embedded": path.join(__dirname, "js", "apps", "embedded"),
        'geostory-embedded': path.join(__dirname, "js", "apps", "geostoryEmbedded"),
        "dashboard-embedded": path.join(__dirname, "js", "apps", "dashboardEmbedded")
    },
    {
        "themes/firenze": path.join(__dirname, "themes", "firenze", "theme.less")
    },
    {
        base: __dirname,
        dist: path.join(__dirname, "dist"),
        framework: path.join(__dirname, "MapStore2", "web", "client"),
        code: [path.join(__dirname, "js"), path.join(__dirname, "MapStore2", "web", "client")]
    },
    [extractThemesPlugin, ModuleFederationPlugin],
    false,
    "dist/",
    "",
    [],
    {
        "@mapstore/patcher": path.resolve(__dirname, "node_modules", "@mapstore", "patcher"),
        "@mapstore": path.resolve(__dirname, "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, "js")
    }, {
        '/rest': {
            target: "http://localhost:8080/mapstore"
        },
        '/proxy': {
            target: "http://localhost:8080/mapstore"
        },
        '/extensions': {
            target: "http://localhost:8080/mapstore"
        },
        '/dist/extensions': {
            target: "http://localhost:8080/mapstore"
        },
        '/pdf': {
            target: "http://localhost:8080/mapstore"
        },
        '/mapstore/pdf': {
            target: "http://localhost:8080"
        },
        '/geofence': {
            target: "http://localhost:8080"
        }
    }
);
