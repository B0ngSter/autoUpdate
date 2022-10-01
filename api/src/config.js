"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.cm = exports.ENV = void 0;
const fs_1 = __importDefault(require("fs"));
const node_persist_1 = __importDefault(require("node-persist"));
exports.ENV = "local";
let db_config = {
    db_file: "init.dx"
};
let login_server = {
    server: "https://integration.aistore.shop"
};
let sync_server = {
    server: "https://integration.aistore.shop"
};
let cloud_config = { login: login_server, sync: sync_server };
let server_config; //intitalizing configurations
if (exports.ENV == "local") {
    server_config = {
        port: 4040
    };
}
else if (exports.ENV == "dev") {
    server_config = {
        port: 4040
    };
}
else {
    server_config = {
        port: 4040
    };
}
;
const CORS_CONFIGURATION = {
    ALLOWED_HOSTS: ["http://localhost:3000", "http://localhost:4040", "app://."],
    credentials: true
};
const static_file_paths_dict = {
    static: {
        filedir: "./static",
        filelink: "/static"
    },
    aimodels: {
        filedir: "./aimodels",
        filelink: "/aimodels"
    },
    inventory_images: {
        filedir: "./inventoryimages",
        filelink: "/inventoryimages"
    },
    user_clicked_images: {
        filedir: "./userimages",
        filelink: "/userimages"
    },
    profile_images: {
        filedir: "./profileimages",
        filelink: "/profileimages"
    },
    invoices: {
        filedir: "./invoices",
        filelink: "/invoices"
    },
    shop_jsons: {
        filedir: "./shopaiprocessed",
        filelink: "/shopaiprocessed"
    },
    payment_qr_codes: {
        filedir: "./paymentqrcodes",
        filelink: "/paymentqrcodes"
    },
    barcodes: {
        filedir: "./barcodes",
        filelink: "/barcodes"
    },
    sales_reports: {
        filedir: "./salesreports",
        filelink: "/salesreports"
    },
    purchase_reports: {
        filedir: "./purchasereports",
        filelink: "/purchasereports"
    },
    stock_reports: {
        filedir: "./stockreports",
        filelink: "/stockreports"
    }
};
const folders_arr = Object.entries(static_file_paths_dict);
folders_arr.forEach(([key, value], index) => {
    if (!fs_1.default.existsSync(value.filedir)) {
        fs_1.default.mkdirSync(value.filedir);
    }
});
let product_search_dir = "./prodsearch";
let catalog_search_dir = "./catsearch";
let local_storage_dir = "./localstorage";
if (!fs_1.default.existsSync(product_search_dir)) {
    fs_1.default.mkdirSync(product_search_dir);
}
if (!fs_1.default.existsSync(catalog_search_dir)) {
    fs_1.default.mkdirSync(catalog_search_dir);
}
if (!fs_1.default.existsSync(local_storage_dir)) {
    fs_1.default.mkdirSync(local_storage_dir);
}
node_persist_1.default.init({
    dir: local_storage_dir,
    expiredInterval: 4 * 60 * 1000
});
const jwt_config = {
    exclude: ["/login*"],
    expire: "40000s"
};
const vendor_visit_query_time_limit = 45;
exports.cm = 28.346456693; // cm to post script points
const invoice_conf = {
    "estimate": {
        "width": 7.8 * exports.cm,
        "header_fontsize": 0.5 * exports.cm,
        "header_font": "Times-Bold",
        "table_header_fontsize": 0.3 * exports.cm,
        "table_header_font": "Times-Bold",
        "table_data_fontsize": 0.4 * exports.cm,
        "table_data_font": "Times-Roman",
        "remaining_data_fontsize": 0.4 * exports.cm,
        "remaining_data_font": "Times-Roman",
        "margins": {
            "left": 0.5 * exports.cm,
            "right": 0.05 * exports.cm,
            "bottom": 0.5 * exports.cm,
            "top": 0.5 * exports.cm
        },
        "qrheight": 5 * exports.cm,
        "round_off_digits": 1,
        "product_name_fontsize": 0.3 * exports.cm,
        "gram_to_kg": true,
        "rounded_off_product_digits": 1,
        "product_name_font": "Times-Bold"
    },
    "thin_estimate": {
        "width": 5.6 * exports.cm,
        "header_fontsize": 0.4 * exports.cm,
        "header_font": "Times-Bold",
        "table_header_fontsize": 0.2 * exports.cm,
        "table_header_font": "Times-Bold",
        "table_data_fontsize": 0.3 * exports.cm,
        "table_data_font": "Times-Roman",
        "remaining_data_fontsize": 0.3 * exports.cm,
        "remaining_data_font": "Times-Roman",
        "margins": {
            "left": 0.2 * exports.cm,
            "right": 0.05 * exports.cm,
            "bottom": 0.2 * exports.cm,
            "top": 0.2 * exports.cm
        },
        "qrheight": 5 * exports.cm,
        "round_off_digits": 1,
        "product_name_fontsize": 0.3 * exports.cm,
        "gram_to_kg": true,
        "rounded_off_product_digits": 1,
        "product_name_font": "Times-Bold"
    },
    "invoice": {
        "width": 7.8 * exports.cm,
        "header_fontsize": 0.5 * exports.cm,
        "header_font": "Times-Bold",
        "table_header_fontsize": 0.27 * exports.cm,
        "table_header_font": "Times-Bold",
        "table_data_fontsize": 0.27 * exports.cm,
        "table_data_font": "Times-Roman",
        "remaining_data_fontsize": 0.4 * exports.cm,
        "remaining_data_font": "Times-Roman",
        "margins": {
            "left": 0.5 * exports.cm,
            "right": 0.05 * exports.cm,
            "bottom": 0.5 * exports.cm,
            "top": 0.5 * exports.cm
        },
        "qrheight": 5 * exports.cm,
        "round_off_digits": 1,
        "product_name_fontsize": 0.3 * exports.cm,
        "gram_to_kg": true,
        "rounded_off_product_digits": 1,
        "product_name_font": "Times-Bold"
    },
    "token": {
        "width": 7.8 * exports.cm,
        "header_font": "Times-Bold",
        "header_fontsize": 0.5 * exports.cm,
        "table_header_fontsize": 0.3 * exports.cm,
        "table_header_font": "Times-Bold",
        "table_data_fontsize": 0.4 * exports.cm,
        "table_data_font": "Times-Roman",
        "remaining_data_fontsize": 0.4 * exports.cm,
        "remaining_data_font": "Times-Roman",
        "margins": {
            "left": 0.5 * exports.cm,
            "right": 0.05 * exports.cm,
            "bottom": 0.5 * exports.cm,
            "top": 0.5 * exports.cm
        },
        "qrheight": 5 * exports.cm,
        "round_off_digits": 1,
        "product_name_fontsize": 0.3 * exports.cm,
        "gram_to_kg": true,
        "rounded_off_product_digits": 1,
        "product_name_font": "Times-Bold"
    },
    "a4invoice": {
        "shop_name_font": "Times-Bold",
        "shop_name_fontsize": 0.5 * exports.cm,
        "table_header_fontsize": 0.3 * exports.cm,
        "table_data_fontsize": 0.3 * exports.cm,
        "remaining_data_fontsize": 0.3 * exports.cm,
        "margins": {
            "left": 0.5 * exports.cm,
            "right": 0.05 * exports.cm,
            "bottom": 0.5 * exports.cm,
            "top": 0.5 * exports.cm
        },
        "qr_code_x": 1 * exports.cm,
        "qrheight": 5 * exports.cm,
        "qr_info_font": "Times-Roman",
        "qr_info_fontsize": 0.3 * exports.cm,
        "round_off_digits": 2,
        "invoice_number_font": 'Times-Roman',
        "invoice_number_fontsize": 0.3 * exports.cm,
        "shop_data_font": 'Times-Bold',
        "shop_data_fontsize": 0.4 * exports.cm,
        "shopper_data_font": 'Times-Roman',
        "shopper_data_fontsize": 0.3 * exports.cm,
        "invoice_number_x": 2.75 * exports.cm,
        "shop_data_x": 0.75 * exports.cm,
        "shop_name_x": 9 * exports.cm,
        "shopper_data_x": 0.75 * exports.cm,
        "time_x": 8 * exports.cm,
        "table_columns_x": [0.5 * exports.cm, 4.5 * exports.cm, 7 * exports.cm, 9.5 * exports.cm, 12 * exports.cm, 14.5 * exports.cm, 16.5 * exports.cm, 18.5 * exports.cm],
        "prices_x": 14 * exports.cm,
        "thank_x": 3 * exports.cm,
        "spacing_between_vertial_blocks": 1.0 * exports.cm,
        "table_line_fontsize": 0.2 * exports.cm,
        "table_line_font": "Times-Roman",
        "table_header_font": "Times-Bold",
        "table_data_font": "Times-Roman",
        "prices_font": "Times-Roman",
        "prices_fontsize": 0.3 * exports.cm,
        "thank_font": "Times-Bold",
        "thank_font_size": 0.4 * exports.cm,
        "gram_to_kg": true,
        "rounded_off_product_digits": 2
    }
};
const config = {
    database: db_config,
    server: server_config,
    cloud: cloud_config,
    CORS_CONFIG: CORS_CONFIGURATION,
    filepaths: static_file_paths_dict,
    indexdirs: { product: product_search_dir, catalog: catalog_search_dir },
    local_storage: node_persist_1.default,
    jwt: jwt_config,
    invoice_config: invoice_conf,
    vendor_visit_query_time_limit: vendor_visit_query_time_limit
};
exports.config = config;
