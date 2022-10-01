"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.createDailySalesReportEndPoint = void 0;
const fs_1 = __importDefault(require("fs"));
const csv = __importStar(require("csv"));
const custom_result_handler_1 = require("./custom_result_handler");
const express_zod_api_1 = require("express-zod-api");
const config_1 = require("./config");
const models_1 = require("./models");
const sqlite3orm_1 = require("sqlite3orm");
var sqlite3 = require("sqlite3").verbose();
function get_shop_visits_with_product_details() {
    return __awaiter(this, void 0, void 0, function* () {
        let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
        let allvisits = yield connection.all("SELECT v.local_id as visit_id, v.shopping_json_local as shopping_json, v.shop_employee_driven_btc as live_order, v.advanced_order_type as order_type_advanced, v.last_touched as last_touched, v.shop_employee_driven_btc_scan_completed as order_complete, v.discarded as discarded, p.payment_verified as payment_verified, v.relationship_id_local as relationship_id, s.phone_number as consumer_phone_number, s.verified_shopper as consumer_sign_up, p.mode as pay_mode, p.payment_complete as payment_completed, p.payment_defer as payment_defer FROM paymentdb_local as p INNER JOIN shopvisitdb_local as v ON p.local_id = v.payment_id_local INNER JOIN shopshopperrelationshipdb_local as r ON v.relationship_id_local = r.local_id INNER JOIN shopperdb_local as s ON r.shopper_id_local = s.local_id WHERE p.created >= datetime('now', 'start of day')");
        let usefulvisits = [];
        let product_wise_data = {};
        let mode_wise_sale = {};
        let shopData = yield config_1.config.local_storage.get("shopemployeedata");
        yield Promise.all(allvisits.map((visit) => __awaiter(this, void 0, void 0, function* () {
            let shopping_json = JSON.parse(visit.shopping_json);
            if (Array.isArray(shopping_json)) {
                let prodlist = [];
                let amount = 0;
                let mode = visit["pay_mode"];
                yield Promise.all(shopping_json.map((item) => __awaiter(this, void 0, void 0, function* () {
                    let item_id = item["final_chosen"]["item_id"];
                    let unit_price = item["final_chosen"]["unit_price"];
                    let discount = item["final_chosen"]["discount"];
                    let quanitty = item["final_chosen"]["quantity"];
                    let final_price = item["final_chosen"]["final_price"];
                    let invDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
                    let itemdetails = yield invDAO.selectOne({ id: item_id });
                    let name;
                    let brand;
                    try {
                        name = itemdetails["name"];
                        brand = itemdetails["brand"];
                    }
                    catch (_a) {
                        name = "Not in DB";
                        brand = "Not in DB";
                    }
                    prodlist.push({ item_name: name, item_brand: brand, item_id: item_id, discount: discount, unit_price: unit_price, final_price: final_price, quantity: quanitty });
                    if (!visit["payment_completed"] && visit["payment_defer"]) {
                        //Do Nothing
                    }
                    else {
                        amount += (unit_price - discount) * quanitty;
                        if (item_id in product_wise_data) {
                            product_wise_data[item_id]["total_quantity"] += quanitty;
                            if (mode in product_wise_data[item_id]) {
                                product_wise_data[item_id][mode] += quanitty;
                            }
                            else {
                                product_wise_data[item_id][mode] = quanitty;
                            }
                            ;
                        }
                        else {
                            product_wise_data[item_id] = { name: name, brand: brand, total_quantity: quanitty, unit_price: unit_price, discount: discount, size: itemdetails["quantity"], units: itemdetails["units"], barcode: itemdetails["barcode"] };
                            product_wise_data[mode] = quanitty;
                        }
                    }
                })));
                let singletransaction = visit;
                singletransaction["amount"] = amount;
                singletransaction["bill_number"] = visit["visit_id"];
                if (mode in mode_wise_sale) {
                    mode_wise_sale[mode] += amount;
                }
                else {
                    mode_wise_sale[mode] = amount;
                }
                ;
                delete singletransaction["shopping_json"];
                singletransaction["items"] = prodlist;
                singletransaction["shop_name"] = shopData["shop_name"];
                singletransaction["shop_id"] = shopData["shop_id"];
                usefulvisits.push(singletransaction);
            }
            else {
                //Empty Shopping Json or Invalid Format.
            }
        })));
        return { "product_wise_sale": product_wise_data, "visit_with_prod_details": usefulvisits, "mode_wise_sale": mode_wise_sale };
    });
}
function create_trnxn_wise_report(report_location, shopvisits, mode_wise_sale) {
    return __awaiter(this, void 0, void 0, function* () {
        let firstVisit = shopvisits[0];
        let columns = Object.keys(firstVisit);
        let index_of_items = columns.indexOf("items");
        columns.splice(index_of_items, 1);
        columns.sort();
        yield new Promise((resolve, reject) => {
            const stringfier = csv.stringify({ "header": false, delimiter: "," });
            stringfier.write(columns);
            shopvisits.forEach(visit => {
                let row = [];
                columns.forEach(column => {
                    row.push(visit[column]);
                });
                row.push(" ");
                visit["items"].forEach((itemdict) => {
                    for (const [key, value] of Object.entries(itemdict)) {
                        row.push(key);
                        row.push(value);
                    }
                    row.push(" ");
                });
                stringfier.write(row);
            });
            stringfier.write([" "]);
            let total_amount = 0;
            for (const [mode, amount] of Object.entries(mode_wise_sale)) {
                let row = [mode, amount];
                total_amount += amount;
                stringfier.write(row);
            }
            stringfier.write(["Total Amount", total_amount]);
            stringfier.pipe(fs_1.default.createWriteStream(report_location));
            stringfier.end();
            resolve(true);
        });
        return { "success": true };
    });
}
function create_prod_wise_report(reportLocation, prod_wise_dict) {
    return __awaiter(this, void 0, void 0, function* () {
        let columns = ["name", "brand", "total_quantity", "size", "units", "barcode"];
        yield new Promise((resolve, reject) => {
            const stringifier = csv.stringify({ header: false, delimiter: "," });
            stringifier.write(columns);
            for (const [item_id, details] of Object.entries(prod_wise_dict)) {
                let row = [];
                columns.forEach(cl => {
                    row.push(details[cl]);
                });
                stringifier.write(row);
            }
            stringifier.pipe(fs_1.default.createWriteStream(reportLocation));
            stringifier.end();
            resolve(true);
        });
        return { "success": true };
    });
}
exports.createDailySalesReportEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "get",
    input: express_zod_api_1.z.object({}),
    output: express_zod_api_1.z.object({
        transaction_wise_report: express_zod_api_1.z.string(),
        product_wise_report: express_zod_api_1.z.string()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let today = new Date();
        let uniquehash = Math.random().toString(16).substr(2, 8);
        let sales_report_dir = config_1.config.filepaths.sales_reports.filedir;
        let sales_report_link = config_1.config.filepaths.sales_reports.filelink;
        let trnxn_filename = `/tranxns_day_${today.getDay()}_month${today.getMonth()}_year${today.getFullYear()}_${uniquehash}.csv`;
        let prodwise_filename = `/sold_prods_${today.getDay()}_month${today.getMonth()}_year${today.getFullYear()}_${uniquehash}.csv`;
        let trnxn_dir = sales_report_dir + trnxn_filename;
        let prwise_dir = sales_report_dir + prodwise_filename;
        let trnxn_link = sales_report_link + trnxn_filename;
        let prwise_link = sales_report_link + prodwise_filename;
        let prod_data = yield get_shop_visits_with_product_details();
        if (prod_data.visit_with_prod_details.length == 0) {
            throw (0, express_zod_api_1.createHttpError)(406, "no data to create excel");
        }
        yield create_trnxn_wise_report(trnxn_dir, prod_data.visit_with_prod_details, prod_data.mode_wise_sale);
        yield create_prod_wise_report(prwise_dir, prod_data.product_wise_sale);
        return { "transaction_wise_report": trnxn_link, "product_wise_report": prwise_link };
    })
});