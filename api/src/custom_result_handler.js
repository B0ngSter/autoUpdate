"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.aistoreEndpointsFactory = exports.aistoreResultHandler = exports.hasMeta = void 0;
const express_zod_api_1 = require("express-zod-api");
const express_zod_api_2 = require("express-zod-api");
const http_errors_1 = require("http-errors");
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
function getMessageFromError(error) {
    if (error instanceof express_zod_api_1.z.ZodError) {
        return error.issues
            .map(({ path, message }) => `${path.join("/")}: ${message}`)
            .join("; ");
    }
    return error.message;
}
;
function getStatusCodeFromError(error) {
    if (error instanceof http_errors_1.HttpError) {
        return error.statusCode;
    }
    if (error instanceof express_zod_api_1.z.ZodError) {
        return 400;
    }
    return 500;
}
const metaProp = "expressZodApiMeta";
const hasMeta = (schema) => {
    if (!(metaProp in schema._def)) {
        return false;
    }
    return (typeof schema._def[metaProp] === "object" && schema._def[metaProp] !== null);
};
exports.hasMeta = hasMeta;
function getMeta(schema, meta) {
    if (!exports.hasMeta(schema)) {
        return undefined;
    }
    const def = schema._def;
    return meta in def[metaProp] ? def[metaProp][meta] : undefined;
}
// this is custom Result handler which sends response data as it is sent from end point.
exports.aistoreResultHandler = express_zod_api_1.createResultHandler({
    getPositiveResponse: (output) => {
        const examples = getMeta(output, "examples") || [];
        const responseSchema = express_zod_api_1.withMeta(express_zod_api_1.z.any());
        for (const example of examples) {
            // forwarding output examples to response schema
            responseSchema.example(example);
        }
        return express_zod_api_1.createApiResponse(responseSchema);
    },
    getNegativeResponse: () => {
        const responseSchema = express_zod_api_1.withMeta(express_zod_api_1.z.object({
            status: express_zod_api_1.z.literal("error"),
            error: express_zod_api_1.z.object({
                message: express_zod_api_1.z.string(),
            }),
        })).example({
            status: "error",
            error: {
                message: getMessageFromError(new Error("Sample error message")),
            },
        });
        return express_zod_api_1.createApiResponse(responseSchema);
    },
    handler: ({ error, input, output, request, response, logger }) => {
        if (!error) {
            response.status(200).json(output);
            return;
        }
        const statusCode = getStatusCodeFromError(error);
        if (statusCode === 500) {
            logger.error(`Internal server error\n${error.stack}\n`, {
                url: request.url,
                payload: input,
            });
        }
        response.status(statusCode).json({
            status: "error",
            error: { message: getMessageFromError(error) },
        });
    },
});
let aistoreEndpointsFactoryPre = new express_zod_api_2.EndpointsFactory(exports.aistoreResultHandler).addExpressMiddleware(cors_1.default({
    origin: config_1.config.CORS_CONFIG.ALLOWED_HOSTS,
    credentials: config_1.config.CORS_CONFIG.credentials,
})); //We can use more middlewares here to implement them universally. Like authentiction.
const sync_code_1 = require("./sync_code");
const authMiddleware = express_zod_api_1.createMiddleware({
    input: express_zod_api_1.z.object({}),
    middleware: ({ request }) => __awaiter(void 0, void 0, void 0, function* () {
        let authstatus = yield sync_code_1.checkAuth(request.headers.authorization);
        console.log(authstatus);
        if (!authstatus.auth) {
            throw express_zod_api_1.createHttpError(401, "Invalid token");
        }
        else {
            return authstatus;
        }
        return {};
    })
});
const aistoreEndpointsFactory = aistoreEndpointsFactoryPre.addMiddleware(authMiddleware);
exports.aistoreEndpointsFactory = aistoreEndpointsFactory;
