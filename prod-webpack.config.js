
const path = require("path");

const extractThemesPlugin = require('./MapStore2/build/themes.js').extractThemesPlugin;
const ModuleFederationPlugin = require('./MapStore2/build/moduleFederation').plugin;
const HtmlWebpackPlugin = require('html-webpack-plugin');

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
    true,
    undefined,
    "",
    [
        new HtmlWebpackPlugin({
            template: 'indexTemplate.html',
            chunks: ['MapStore2-C027'],
            publicPath: 'dist/',
            inject: true,
            hash: true
        }),
        new HtmlWebpackPlugin({
            template: 'embeddedTemplate.html',
            chunks: ['embedded'],
            publicPath: 'dist/',
            inject: true,
            hash: true,
            filename: 'embedded.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'geostory-embedded-template.html'),
            chunks: ['geostory-embedded'],
            publicPath: 'dist/',
            inject: "body",
            hash: true,
            filename: 'geostory-embedded.html'
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, 'dashboard-embedded-template.html'),
            chunks: ['dashboard-embedded'],
            publicPath: 'dist/',
            inject: 'body',
            hash: true,
            filename: 'dashboard-embedded.html'
        })
    ],
    {
        "@mapstore/patcher": path.resolve(__dirname, "node_modules", "@mapstore", "patcher"),
        "@mapstore": path.resolve(__dirname, "MapStore2", "web", "client"),
        "@js": path.resolve(__dirname, "js")
    }
);
