"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_zod_api_1 = require("express-zod-api");
const config_1 = require("./config");
const models_1 = require("./models");
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const express_services_1 = require("./express_services");
const cors_1 = __importDefault(require("cors"));
const extra_services_1 = require("./extra_services");
const app = express_1.default();
models_1.getConnection(config_1.config.database.db_file).then((conn) => {
    console.log(conn);
    models_1.createIfDontExist(conn).then(() => {
        console.log("Done");
    });
});
//Using body parsers for different kind of data types received in request.
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(express_1.default.text());
let serverConfig;
//These configs are only for EndpointFactory APIs. Customize as per env.
if (config_1.ENV == "local") {
    serverConfig = express_zod_api_1.createConfig({
        app: app,
        cors: true,
        logger: {
            level: "debug",
            color: true,
        },
        inputSources: {
            //customize input resources.
            "get": ["body", "files", "params", "query"],
            "post": ["body", "files", "params", "query"],
            "patch": ["body", "files", "params", "query"],
            "delete": ["body", "files", "params", "query"],
            "put": ["body", "files", "params", "query"],
        }
    });
}
else {
    serverConfig = express_zod_api_1.createConfig({
        app: app,
        cors: true,
        logger: {
            level: "warn",
            color: false,
        },
        inputSources: {
            //customize input resources.
            "get": ["body", "files", "params", "query"],
            "post": ["body", "files", "params", "query"],
            "patch": ["body", "files", "params", "query"],
            "delete": ["body", "files", "params", "query"],
            "put": ["body", "files", "params", "query"],
        }
    });
}
;
app.use(cors_1.default({
    origin: config_1.config.CORS_CONFIG.ALLOWED_HOSTS,
    credentials: config_1.config.CORS_CONFIG.credentials,
    exposedHeaders: ["cookies"]
})); //Using middlewares like these will be universal.
const staticFolders = Object.entries(config_1.config.filepaths);
staticFolders.forEach(([key, value], index) => {
    let folderName = value.filelink.slice(1);
    app.use(value.filelink, express_1.default.static(folderName));
});
app.use("/", express_services_1.directRouter);
app.use("/", extra_services_1.extraRouter);
//Comment below lines till /docs middleware to disable open API.
const express_zod_api_2 = require("express-zod-api");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const kill_port_1 = __importDefault(require("kill-port"));
const jsonString = new express_zod_api_2.OpenAPI({
    routing: routes_1.router,
    config: serverConfig,
    version: "1.0.0",
    title: "Aistore Offline API",
    serverUrl: "",
}).getSpecAsJson();
app.use("/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(JSON.parse(jsonString)));
const { notFoundHandler, logger } = express_zod_api_1.attachRouting(serverConfig, routes_1.router);
app.use(notFoundHandler);
function startserver(port) {
    let server = app.listen(port, () => {
        console.log("listening at port " + String(port));
    });
    server.once('error', (err) => {
        if (err.message == "listen EADDRINUSE: address already in use :::4040") {
            kill_port_1.default(port, 'tcp')
                .then(() => {
                startserver(port);
            }).catch((reason) => {
                console.log(reason);
            });
        }
    });
}
startserver(config_1.config.server.port);
