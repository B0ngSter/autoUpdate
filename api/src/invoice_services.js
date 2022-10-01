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
exports.getA4InvoicePDFForEndPoint = exports.getTokenEstimatePDFForEndPoint = exports.getThinEstimatePDFForEndPoint = exports.getGSTInvoicePDFForEndPoint = exports.getEstimatePDFEndPoint = void 0;
const pdfkit_1 = __importDefault(require("pdfkit"));
const fs_1 = __importDefault(require("fs"));
const express_zod_api_1 = require("express-zod-api");
const model_datatypes_1 = require("./model_datatypes");
const config_1 = require("./config");
const models_1 = require("./models");
const sqlite3orm_1 = require("sqlite3orm");
const custom_result_handler_1 = require("./custom_result_handler");
const inv_dir = config_1.config.filepaths.invoices.filedir;
const inv_link = config_1.config.filepaths.invoices.filelink;
const qrcode_dir = config_1.config.filepaths.payment_qr_codes.filedir;
const invoice_conf = config_1.config.invoice_config;
function splitInto(name, n) {
    // This function splits name string into n, 2n, 3n,... parts. like name = 'name', n=2 then it will return ['na', 'me']
    let name_split_arr = [];
    if (name.length < n) {
        name_split_arr.push(name);
    }
    else if (name.length < 2 * n) {
        name_split_arr.push(name.slice(0, n));
        name_split_arr.push(name.slice(n));
    }
    else {
        name_split_arr.push(name.slice(0, n));
        name_split_arr.push(name.slice(n, 2 * n));
        name_split_arr.push(name.slice(2 * n, 3 * n));
    }
    return name_split_arr;
}
/**
 * This function returns an array containing filedir and filelink.
 * The filename is decided on the basis of given params.
 */
function get_file_directory(invoice_type, visit_id, created_date, configurations_dict, filetype) {
    //This function gives file name for specific type of invoices based on configurations and visit_Id.
    let created_iso = created_date.toISOString();
    let filedir = null;
    let filelink = null;
    if (configurations_dict["rounded_off"]) {
        if (configurations_dict["show_invoice_number"]) {
            filedir = inv_dir + "/rounded_" + invoice_type + "_" + String(visit_id) + "_" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
            filelink = inv_link + "/rounded_" + invoice_type + "_" + String(visit_id) + "_" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
        }
        else {
            filedir = inv_dir + "/rounded_" + invoice_type + "_" + String(visit_id) + "~~woestnum" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
            filelink = inv_link + "/rounded_" + invoice_type + "_" + String(visit_id) + "~~woestnum" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
        }
    }
    else {
        if (configurations_dict["show_invoice_number"]) {
            filedir = inv_dir + "/" + invoice_type + "_" + String(visit_id) + "_" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
            filelink = inv_link + "/" + invoice_type + "_" + String(visit_id) + "_" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
        }
        else {
            filedir = inv_dir + "/" + invoice_type + "_" + String(visit_id) + "~~woestnum" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
            filelink = inv_link + "/" + invoice_type + "_" + String(visit_id) + "~~woestnum" + "~~" + String(created_iso).replace(/[^a-zA-Z0-9]/g, "") + "." + filetype;
        }
    }
    return [filedir, filelink];
}
/**
 * x_coordinates_dict : is object consisting number of elements (of final_estimate array.) as a key and an array consisting x_coordinates for each element.
 * tabledatalen: is number of columns in the table of consisting product details.
*/
function writePDF(invoice_type, final_estimate, x_coordinates_dict, filedir, tabledatalen, qrcode_data) {
    let invoice_measures = invoice_conf[invoice_type];
    let width = invoice_measures["width"];
    let qrexists = qrcode_data["qrexists"];
    // calculating height of the page.
    let height = invoice_measures["margins"]["top"] + invoice_measures["margins"]["bottom"] + 1 * config_1.cm;
    let left = invoice_measures["margins"]["left"];
    final_estimate.forEach(row => {
        if (row.length == 1) {
            height += 1.2 * invoice_measures["header_fontsize"];
        }
        else if (row.length == 2) {
            height += 1.2 * invoice_measures["remaining_data_fontsize"];
        }
        else {
            height += 1.2 * invoice_measures["table_data_fontsize"];
        }
    });
    if (qrexists) {
        height += invoice_measures["qrheight"];
        height += 2 * config_1.cm;
    }
    if (height < 10 * config_1.cm) {
        height = 10 * config_1.cm;
    }
    ;
    //Writing pdf
    const doc = new pdfkit_1.default({ "size": [width, height], "margins": invoice_measures["margins"] });
    doc.pipe(fs_1.default.createWriteStream(filedir));
    let tabledataheaderfound = false;
    final_estimate.forEach((row, rownum) => {
        if (row.length == 1) {
            doc.font(invoice_measures["header_font"]);
            doc.fontSize(invoice_measures["header_fontsize"]);
            if ("1" in x_coordinates_dict) {
                doc.text(row[0], x_coordinates_dict[1][0]);
            }
            else {
                doc.text(row[0], (width - (row[0].length * (invoice_measures["header_fontsize"] / 2))) / 2);
            }
        }
        else if (row.length == tabledatalen) {
            if (!tabledataheaderfound) {
                tabledataheaderfound = true;
                doc.fontSize(invoice_measures["table_header_fontsize"]);
                doc.font(invoice_measures["table_header_font"]);
            }
            else {
                doc.font(invoice_measures["table_data_font"]);
            }
            row.forEach((word, num) => {
                if (word == "" || word == null) {
                    word = " "; //empty string with no spaces does not print on paper and moves marker up.
                }
                if (num == 0 && tabledataheaderfound) {
                    doc.font(invoice_measures["product_name_font"]);
                    doc.fontSize(invoice_measures["product_name_fontsize"]);
                }
                else {
                    doc.font(invoice_measures["table_data_font"]);
                    doc.fontSize(invoice_measures["table_data_fontsize"]);
                }
                doc.text(word, x_coordinates_dict[tabledatalen][num]);
                doc.moveUp();
            });
            doc.moveDown();
        }
        else {
            doc.font(invoice_measures["remaining_data_font"]);
            doc.fontSize(invoice_measures["remaining_data_fontsize"]);
            if (row.length in x_coordinates_dict) {
                row.forEach((word, num) => {
                    doc.text(word, x_coordinates_dict[row.length][num]);
                    doc.moveUp();
                });
            }
            else {
                let x_cord = left;
                row.forEach((word, num) => {
                    doc.text(word, x_cord);
                    doc.moveUp();
                    x_cord += 2 * config_1.cm;
                });
            }
            doc.moveDown();
        }
    });
    if (qrexists) {
        //Writing QR code on pdf.
        doc.moveDown();
        doc.fontSize(invoice_measures["remaining_data_fontsize"]);
        doc.text("------------------------------------", left);
        doc.text("Please scan QR Code to pay.", left);
        doc.image(qrcode_data["qr_dir"], 1 * config_1.cm, height - invoice_measures["qrheight"] - 0.5 * config_1.cm, { "height": invoice_measures["qrheight"] });
    }
    doc.end();
}
function createPDFForInvoice(type, visitID, configurations = { "rounded_off": false, "show_invoice_number": true }, consumer_name, consumer_gst_number, consumer_phone_number) {
    return __awaiter(this, void 0, void 0, function* () {
        //Function for creating pdf invoice other than A4.
        let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
        let VisitDAO = new sqlite3orm_1.BaseDAO(models_1.ShopVisitDB, connection);
        let ShopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
        let relationshipDAO = new sqlite3orm_1.BaseDAO(models_1.ShopShopperRelationshipDB, connection);
        let shop_visit = yield VisitDAO.selectOne({ id: visitID });
        let created_date = shop_visit["created"];
        let filedir_and_link = get_file_directory(type, visitID, created_date, configurations, "pdf");
        let filedir = filedir_and_link[0];
        let filelink = filedir_and_link[1];
        let fileexists = fs_1.default.existsSync(filedir);
        if (fileexists) {
            return { "success": true, "filelink": filelink };
        }
        ;
        let relationship_data = yield relationshipDAO.selectOne({ id: shop_visit["relationship_id_local"] });
        let shopper_data = yield ShopperDAO.selectOne({ id: relationship_data["shopper_id_local"] });
        let shop_data = yield config_1.config.local_storage.getItem("shopemployeedata");
        let round_off_digits = invoice_conf[type]["round_off_digits"];
        if (configurations["rounded_off"]) {
            round_off_digits = 0;
        }
        ;
        let shop_id = shop_data["shop_id"];
        let itemIDs = [];
        let sale = [];
        let total_sales = 0.;
        let total_savings = 0.;
        let total_items = 0;
        let total_quantity = 0;
        if (!Array.isArray(shop_visit["shopping_json_local"])) {
            return { "success": false, "reason": "No product in the shopping json." };
        }
        shop_visit["shopping_json_local"].forEach((item_details) => {
            let item_id = item_details["final_chosen"]["item_id"];
            itemIDs.push(item_id);
            total_items += 1;
            total_quantity += item_details["final_chosen"]["quantity"];
            sale.push({ "item_id": item_id, "quantity": item_details["final_chosen"]["quantity"], "Price": item_details["final_chosen"]["unit_price"], "discount": item_details["final_chosen"]["discount"], "Final Price": item_details["final_chosen"]["final_price"] });
            total_sales += item_details["final_chosen"]["quantity"] * (item_details["final_chosen"]["unit_price"] - item_details["final_chosen"]["discount"]);
            total_savings += item_details["final_chosen"]["quantity"] * item_details["final_chosen"]["discount"];
        });
        if (total_items == 0) {
            return { "success": false, "reason": "No items added." };
        }
        let OneInventoryDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
        let sold_items = yield OneInventoryDAO.selectAll({ id: { "isIn": itemIDs } });
        let prod_dict = {};
        sold_items.forEach((item) => {
            prod_dict[item["id"]] = item;
        });
        if (type == "invoice") {
            // Fetching taxes in case of invoice.
            let grnDetailsDAO = new sqlite3orm_1.BaseDAO(models_1.GRNItemDetailsDB, connection);
            let tax_rates = yield grnDetailsDAO.selectAll({ inventory_item_id_local: { "isIn": itemIDs } });
            var tax_rates_dict = {};
            tax_rates.forEach((data) => {
                tax_rates_dict[data["inventory_item_id_local"]] = data;
            });
        }
        ;
        yield connection.close();
        let first_line_of_invoice = {
            "estimate": ["EST-" + String(visitID)],
            "thin_estimate": ["EST-" + String(visitID)],
            "token": ["TOKEN-" + String(visitID)],
            "invoice": ["INVOICE-" + String(visitID)]
        };
        var final_estimate = [];
        if (configurations["show_invoice_number"]) {
            final_estimate.push(first_line_of_invoice[type]);
        }
        ;
        //pushing shop details
        let shop_printable = false;
        if (shop_data["biller_name"] != null && shop_data["biller_name"].trim().length != 0) {
            shop_printable = true;
        }
        if (shop_printable) {
            let biller_name = shop_data["biller_name"];
            splitInto(biller_name, 20).forEach((value) => {
                final_estimate.push([value]);
            });
            let biller_address = shop_data["shop_address"];
            let biller_number = shop_data["biller_phone"];
            final_estimate.push([biller_number]);
            splitInto(biller_address, 20).forEach((value) => {
                final_estimate.push([value]);
            });
            final_estimate.push(["GSTIN:: ", shop_data["gst_number"]]);
        }
        else if (type != "invoice") {
            splitInto(shop_data["shop_name"], 20).forEach((value) => {
                final_estimate.push([value]);
            });
        }
        else {
            console.error("No grn data available.", 404);
            return { "success": false, "reason": "No grn data available." };
        }
        //pushing shopper details
        if (!shopper_data["phone_number"].includes("9999999999") && type != "invoice") {
            final_estimate.push(["Estimate For:: "].concat(splitInto(shopper_data["name"], 20)));
            final_estimate.push(["     "].concat(shopper_data["phone_number"]));
        }
        if (type == "invoice") {
            if (consumer_name != null) {
                final_estimate.push(["Estimate For:: "].concat(splitInto(consumer_name, 20)));
            }
            else if (!shopper_data["phone_number"].includes("9999999999")) {
                final_estimate.push(["Estimate For:: "].concat(splitInto(shopper_data["name"], 20)));
            }
            if (consumer_phone_number != null) {
                final_estimate.push(["  ", consumer_phone_number]);
            }
            else if (!shopper_data["phone_number"].includes("9999999999")) {
                final_estimate.push(["     "].concat(shopper_data["phone_number"]));
            }
            if (consumer_gst_number != null) {
                final_estimate.push(["Consumer GSTIN::", consumer_gst_number]);
            }
        }
        //pushing time of invoicing.
        final_estimate.push(["Time::", shop_visit["last_touched"].toISOString()]);
        final_estimate.push(["-------------------------------------"]);
        let x_coordinates_dict = {};
        let number_of_columns = 0;
        if (type == 'token' || type == 'estimate') {
            //Pushing product details.
            final_estimate.push(["Product", "MRP", "Dsc", "SP", "Qn", "ToPay"]);
            final_estimate.push(["-------------------------------------"]);
            number_of_columns = 6;
            sale.forEach(item_sale => {
                let item_id = item_sale["item_id"];
                let price = item_sale["Price"];
                let quantity = item_sale["quantity"];
                let discount = item_sale["discount"];
                let item_details = prod_dict[item_id];
                let rounded_quantity = String(quantity.toFixed(1));
                if (item_details["units"] == "GRAM" && invoice_conf[type].gram_to_kg && item_details["quantity"] == 1) {
                    price = price * 1000;
                    quantity = quantity / 1000;
                    discount = discount * 1000;
                    rounded_quantity = String(quantity.toFixed(3));
                }
                if (!item_details["name"].toLowerCase().includes(item_details["brand"].toLowerCase())) {
                    var name = item_details["brand"] + " " + item_details["name"];
                }
                else {
                    var name = item_details["name"];
                }
                name = name[0].toUpperCase() + name.slice(1).toLowerCase();
                let name_split_arr = splitInto(name, 19);
                let product_data_rounded_off_digits = invoice_conf[type].rounded_off_product_digits;
                let rounded_price = String(price.toFixed(product_data_rounded_off_digits));
                let rounded_discount = String(discount.toFixed(product_data_rounded_off_digits));
                let fp = String((price - discount).toFixed(product_data_rounded_off_digits));
                let rounded_payable = String(((price - discount) * quantity).toFixed(product_data_rounded_off_digits));
                if (name_split_arr.length == 1 && rounded_price.length <= 5 && rounded_discount.length <= 4 && rounded_quantity.length <= 4 && fp.length <= 5 && rounded_payable.length <= 5) {
                    final_estimate.push([name_split_arr[0], rounded_price, rounded_discount, fp, rounded_quantity, rounded_payable]);
                }
                else if (name_split_arr.length == 2) {
                    final_estimate.push([name_split_arr[0], rounded_price.slice(0, 5), rounded_discount.slice(0, 4), fp.slice(0, 5), rounded_quantity.slice(0, 4), rounded_payable.slice(0, 5)]);
                    final_estimate.push([name_split_arr[1], rounded_price.slice(5), rounded_discount.slice(4), fp.slice(5), rounded_quantity.slice(4), rounded_payable.slice(5)]);
                }
                else {
                    final_estimate.push([name_split_arr[0], rounded_price.slice(0, 5), rounded_discount.slice(0, 4), fp.slice(0, 5), rounded_quantity.slice(0, 4), rounded_payable.slice(0, 5)]);
                    final_estimate.push([name_split_arr[1], rounded_price.slice(5), rounded_discount.slice(4), fp.slice(5), rounded_quantity.slice(4), rounded_payable.slice(5)]);
                    final_estimate.push([name_split_arr[2], " ", "  ", " ", "  ", " "]);
                }
            });
            x_coordinates_dict = {
                6: [0.5 * config_1.cm, 3.1 * config_1.cm, 4.1 * config_1.cm, 4.8 * config_1.cm, 5.8 * config_1.cm, 6.8 * config_1.cm],
                2: [0.5 * config_1.cm, 3 * config_1.cm]
            };
            final_estimate.push(["-------------------------------------"]);
            final_estimate.push(["# Items", total_items.toFixed(0)]);
            final_estimate.push(["Savings", total_savings.toFixed(round_off_digits)]);
            final_estimate.push(["Total", total_sales.toFixed(round_off_digits)]);
            final_estimate.push(["    "]);
            final_estimate.push(["THANK YOU"]);
        }
        //For thin estimate
        else if (type == 'thin_estimate') {
            final_estimate.push(["Product", "MRP", "SP", "Qn", "ToPay"]);
            final_estimate.push(["-------------------------------------"]);
            number_of_columns = 5;
            sale.forEach(item_sale => {
                let item_id = item_sale["item_id"];
                let price = item_sale["Price"];
                let quantity = item_sale["quantity"];
                let discount = item_sale["discount"];
                let item_details = prod_dict[item_id];
                let rounded_quantity = String(quantity.toFixed(1));
                if (item_details["units"] == "GRAM" && invoice_conf[type].gram_to_kg && item_details["quantity"] == 1) {
                    price = price * 1000;
                    quantity = quantity / 1000;
                    discount = discount * 1000;
                    rounded_quantity = String(quantity.toFixed(3));
                }
                ;
                if (!item_details["name"].toLowerCase().includes(item_details["brand"].toLowerCase())) {
                    var name = item_details["brand"] + " " + item_details["name"];
                }
                else {
                    var name = item_details["name"];
                }
                name = name[0].toUpperCase() + name.slice(1).toLowerCase();
                let name_split_arr = splitInto(name, 14);
                let product_data_rounded_off_digits = invoice_conf[type].rounded_off_product_digits;
                let rounded_price = String(price.toFixed(product_data_rounded_off_digits));
                let rounded_discount = String(discount.toFixed(product_data_rounded_off_digits));
                let fp = String((price - discount).toFixed(product_data_rounded_off_digits));
                let rounded_payable = String(((price - discount) * quantity).toFixed(product_data_rounded_off_digits));
                if (name_split_arr.length == 1 && rounded_price.length <= 5 && rounded_quantity.length <= 4 && fp.length <= 5 && rounded_payable.length <= 5) {
                    final_estimate.push([name_split_arr[0], rounded_price, fp, rounded_quantity, rounded_payable]);
                }
                else if (name_split_arr.length == 2) {
                    final_estimate.push([name_split_arr[0], rounded_price.slice(0, 5), fp.slice(0, 5), rounded_quantity.slice(0, 4), rounded_payable.slice(0, 5)]);
                    final_estimate.push([name_split_arr[1], rounded_price.slice(5), fp.slice(5), rounded_quantity.slice(5), rounded_payable.slice(5)]);
                }
                else {
                    final_estimate.push([name_split_arr[0], rounded_price.slice(0, 5), fp.slice(0, 5), rounded_quantity.slice(0, 4), rounded_payable.slice(0, 5)]);
                    final_estimate.push([name_split_arr[1], rounded_price.slice(5), fp.slice(5), rounded_quantity.slice(4), rounded_payable.slice(5)]);
                    final_estimate.push([name_split_arr[2], " ", "  ", " ", "  "]);
                }
            });
            x_coordinates_dict = {
                5: [0.3 * config_1.cm, 2.5 * config_1.cm, 3.3 * config_1.cm, 4.1 * config_1.cm, 4.7 * config_1.cm],
                2: [0.3 * config_1.cm, 2.5 * config_1.cm]
            };
            final_estimate.push(["-------------------------------------"]);
            final_estimate.push(["# Items", total_items.toFixed(0)]);
            final_estimate.push(["Savings", total_savings.toFixed(round_off_digits)]);
            final_estimate.push(["Total", total_sales.toFixed(round_off_digits)]);
            final_estimate.push(["    "]);
            final_estimate.push(["THANK YOU"]);
        }
        //For Invoice, taxes are also included.
        else if (type == "invoice") {
            final_estimate.push(["Product", "Prc", "Disc", "Final", "Qn", "SGST", "CGST", "ToPay"]);
            final_estimate.push(["-------------------------------------"]);
            let subtotal = 0;
            let total_sgst = 0;
            let total_cgst = 0;
            number_of_columns = 8;
            let item_ids_with_no_cgst_or_sgst = [];
            sale.forEach(item_sale => {
                let item_id = item_sale["item_id"];
                let mrp = item_sale["Price"];
                let quantity = item_sale["quantity"];
                let discount = item_sale["discount"];
                let item_details = prod_dict[item_id];
                if (!item_details["name"].toLowerCase().includes(item_details["brand"].toLowerCase())) {
                    var name = item_details["brand"] + " " + item_details["name"];
                }
                else {
                    var name = item_details["name"];
                }
                let sgst = 0;
                let cgst = 0;
                try {
                    sgst = tax_rates_dict[item_id]["sgst_rate"];
                    cgst = tax_rates_dict[item_id]["cgst_rate"];
                }
                catch (_a) {
                    item_ids_with_no_cgst_or_sgst.push(item_id);
                }
                ;
                let price = (mrp * 100 + discount * (sgst + cgst)) / (100 + sgst + cgst);
                let finp = price - discount;
                let pretax = quantity * (price - discount);
                let sgst_amount = sgst / 100. * pretax;
                let cgst_amount = cgst / 100. * pretax;
                let item_payable = pretax + sgst_amount + cgst_amount;
                subtotal += price * quantity;
                total_sgst += sgst_amount;
                total_cgst += cgst_amount;
                let rounded_quantity = String(quantity.toFixed(1));
                if (item_details["units"] == "GRAM" && invoice_conf[type].gram_to_kg && item_details["quantity"] == 1) {
                    price = price * 1000;
                    quantity = quantity / 1000;
                    discount = discount * 1000;
                    rounded_quantity = String(quantity.toFixed(3));
                }
                name = name[0].toUpperCase() + name.slice(1).toLowerCase();
                let name_split_arr = splitInto(name, 18);
                let product_data_rounded_off_digits = invoice_conf[type].rounded_off_product_digits;
                let rounded_price = String(price.toFixed(product_data_rounded_off_digits));
                let rounded_discount = String(discount.toFixed(product_data_rounded_off_digits));
                let fp = String((price - discount).toFixed(product_data_rounded_off_digits));
                let rounded_payable = String(((price - discount) * quantity + cgst_amount + sgst_amount).toFixed(product_data_rounded_off_digits));
                if (name_split_arr.length == 1 && rounded_price.length <= 5 && rounded_discount.length <= 4 && rounded_quantity.length <= 5 && fp.length <= 5 && rounded_payable.length <= 5) {
                    final_estimate.push([name_split_arr[0], rounded_price, rounded_discount, fp, rounded_quantity, sgst, cgst, rounded_payable]);
                }
                else if (name_split_arr.length == 2) {
                    final_estimate.push([name_split_arr[0], rounded_price.slice(0, 5), rounded_discount.slice(0, 4), fp.slice(0, 5), rounded_quantity.slice(0, 5), sgst, cgst, rounded_payable.slice(0, 5)]);
                    final_estimate.push([name_split_arr[1], rounded_price.slice(5), rounded_discount.slice(4), fp.slice(5), rounded_quantity.slice(5), " ", " ", rounded_payable.slice(5)]);
                }
                else {
                    final_estimate.push([name_split_arr[0], rounded_price.slice(0, 5), rounded_discount.slice(0, 4), fp.slice(0, 5), rounded_quantity.slice(0, 5), sgst, cgst, rounded_payable.slice(0, 5)]);
                    final_estimate.push([name_split_arr[1], rounded_price.slice(5), rounded_discount.slice(4), fp.slice(5), rounded_quantity.slice(5), " ", " ", rounded_payable.slice(5)]);
                    final_estimate.push([name_split_arr[2], " ", "  ", " ", "  ", " ", " ", " "]);
                }
            });
            if (item_ids_with_no_cgst_or_sgst.length > 0) {
                return { "success": false, "reason": "CGST or SGST not filled for", "items": item_ids_with_no_cgst_or_sgst };
            }
            x_coordinates_dict = {
                8: [0.3 * config_1.cm, 2.7 * config_1.cm, 3.4 * config_1.cm, 4.1 * config_1.cm, 4.8 * config_1.cm, 5.7 * config_1.cm, 6.3 * config_1.cm, 7 * config_1.cm],
                2: [0.3 * config_1.cm, 3.5 * config_1.cm]
            };
            final_estimate.push(["-------------------------------------"]);
            final_estimate.push(["# Items", total_items.toFixed(0)]);
            final_estimate.push(["Subtotal: ", subtotal.toFixed(round_off_digits)]);
            final_estimate.push(["Savings: ", total_savings.toFixed(round_off_digits)]);
            final_estimate.push(["TOTAL SGST: ", total_sgst.toFixed(round_off_digits)]);
            final_estimate.push(["TOTAL CGST: ", total_cgst.toFixed(round_off_digits)]);
            final_estimate.push(["TOTAL GST: ", (total_cgst + total_sgst).toFixed(round_off_digits)]);
            final_estimate.push(["TOTAL", total_sales.toFixed(round_off_digits)]);
            final_estimate.push(["    "]);
            final_estimate.push(["THANK YOU!!!!"]);
        }
        //Checking for qrcode and calling function for writing pdf.
        let qrcode_data = { "qrexists": false, "qr_dir": "" };
        let files = fs_1.default.readdirSync(qrcode_dir);
        for (let filenum in files) {
            if (files[filenum].includes("shopId_" + String(shop_id))) {
                qrcode_data = { "qrexists": true, "qr_dir": qrcode_dir + "/" + files[filenum] };
                break;
            }
        }
        writePDF(type, final_estimate, x_coordinates_dict, filedir, number_of_columns, qrcode_data);
        return { "success": true, "filelink": filelink };
    });
}
exports.getEstimatePDFEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)).optional()
    }).merge(model_datatypes_1.ConfigurationDictForInvoices),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean(),
        pdf_link: express_zod_api_1.z.string().optional(),
        reason: express_zod_api_1.z.any().optional(),
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_view_invoices"]) {
            throw (0, express_zod_api_1.createHttpError)(405);
        }
        ;
        let configurations_dict = {
            rounded_off: input.rounded_off,
            show_invoice_number: input.show_invoice_number,
        };
        let res = yield createPDFForInvoice("estimate", input.visitID, configurations_dict, null, null, null);
        return { success: res.success, pdf_link: res.filelink, reason: res.reason };
    })
});
exports.getGSTInvoicePDFForEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)).optional(),
        consumer_name: express_zod_api_1.z.string().optional().nullable(),
        consumer_phone_number: express_zod_api_1.z.string().optional().nullable(),
        consumer_gst_number: express_zod_api_1.z.string().optional().nullable()
    }).merge(model_datatypes_1.ConfigurationDictForInvoices),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean(),
        pdf_link: express_zod_api_1.z.string().optional(),
        reason: express_zod_api_1.z.any().optional(),
        items: express_zod_api_1.z.any().optional()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_view_invoices"]) {
            throw (0, express_zod_api_1.createHttpError)(405);
        }
        ;
        let configurations_dict = {
            rounded_off: input.rounded_off,
            show_invoice_number: input.show_invoice_number
        };
        let res = yield createPDFForInvoice("invoice", input.visitID, configurations_dict, input.consumer_name, input.consumer_gst_number, input.consumer_phone_number);
        return { success: res.success, pdf_link: res.filelink, reason: res.reason, items: res.items };
    })
});
exports.getThinEstimatePDFForEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)).optional()
    }).merge(model_datatypes_1.ConfigurationDictForInvoices),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean(),
        pdf_link: express_zod_api_1.z.string().optional(),
        reason: express_zod_api_1.z.any().optional(),
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_view_invoices"]) {
            throw (0, express_zod_api_1.createHttpError)(405);
        }
        ;
        let configurations_dict = {
            rounded_off: input.rounded_off,
            show_invoice_number: input.show_invoice_number
        };
        let res = yield createPDFForInvoice("thin_estimate", input.visitID, configurations_dict, null, null, null);
        return { success: res.success, pdf_link: res.filelink, reason: res.reason };
    })
});
exports.getTokenEstimatePDFForEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)).optional()
    }).merge(model_datatypes_1.ConfigurationDictForInvoices),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean(),
        pdf_link: express_zod_api_1.z.string().optional(),
        reason: express_zod_api_1.z.any().optional(),
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_view_invoices"]) {
            throw (0, express_zod_api_1.createHttpError)(405);
        }
        ;
        let configurations_dict = {
            rounded_off: input.rounded_off,
            show_invoice_number: input.show_invoice_number
        };
        let res = yield createPDFForInvoice("token", input.visitID, configurations_dict, null, null, null);
        return { success: res.success, pdf_link: res.filelink, reason: res.reason };
    })
});
exports.getA4InvoicePDFForEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.number(),
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)).optional(),
        consumer_name: express_zod_api_1.z.string().optional().nullable(),
        consumer_phone_number: express_zod_api_1.z.string().optional().nullable(),
        consumer_gst_number: express_zod_api_1.z.string().optional().nullable()
    }).merge(model_datatypes_1.ConfigurationDictForInvoices),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean(),
        pdf_link: express_zod_api_1.z.string().optional(),
        reason: express_zod_api_1.z.any().optional(),
        items: express_zod_api_1.z.any().optional()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopdb_data = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopdb_data["permission_view_invoices"]) {
            throw (0, express_zod_api_1.createHttpError)(405);
        }
        ;
        if (shopdb_data["biller_name"] == null || shopdb_data["biller_name"].trim().length == 0) {
            return { "success": false, "reason": "GRN data not available." };
        }
        let visitID = input.visitID;
        let configurations = {
            "rounded_off": input.rounded_off,
            "show_invoice_number": input.show_invoice_number
        };
        let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
        let VisitDAO = new sqlite3orm_1.BaseDAO(models_1.ShopVisitDB, connection);
        let ShopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
        let relationshipDAO = new sqlite3orm_1.BaseDAO(models_1.ShopShopperRelationshipDB, connection);
        let shop_visit = yield VisitDAO.selectOne({ id: visitID });
        let created_date = shop_visit["created"];
        let filedir_and_link = get_file_directory("a4invoice", visitID, created_date, configurations, "pdf");
        let filedir = filedir_and_link[0];
        let filelink = filedir_and_link[1];
        let fileexists = fs_1.default.existsSync(filedir);
        if (fileexists) {
            return { "success": true, "pdf_link": filelink };
        }
        let relationship_data = yield relationshipDAO.selectOne({ id: shop_visit["relationship_id_local"] });
        let shopperdb_data = yield ShopperDAO.selectOne({ id: relationship_data["shopper_id_local"] });
        let invoice_measures = invoice_conf["a4invoice"];
        let round_off_digits = invoice_measures["round_off_digits"];
        if (configurations["rounded_off"]) {
            round_off_digits = 0;
        }
        let shop_id = shopdb_data["shop_id"];
        let itemIDs = [];
        let sale = [];
        let total_sales = 0.;
        let total_savings = 0.;
        let total_items = 0;
        let total_quantity = 0;
        if (!Array.isArray(shop_visit["shopping_json_local"])) {
            return { "success": false, "reason": "No data in the shopping json." };
        }
        shop_visit["shopping_json_local"].forEach((item_details) => {
            let item_id = item_details["final_chosen"]["item_id"];
            itemIDs.push(item_id);
            total_items += 1;
            total_quantity += item_details["final_chosen"]["quantity"];
            sale.push({ "item_id": item_id, "quantity": item_details["final_chosen"]["quantity"], "Price": item_details["final_chosen"]["unit_price"], "discount": item_details["final_chosen"]["discount"], "Final Price": item_details["final_chosen"]["final_price"] });
            total_sales += item_details["final_chosen"]["quantity"] * (item_details["final_chosen"]["unit_price"] - item_details["final_chosen"]["discount"]);
            total_savings += item_details["final_chosen"]["quantity"] * item_details["final_chosen"]["discount"];
        });
        if (total_items == 0) {
            return { "success": false };
        }
        //fetching items data.
        let OneInventoryDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
        let sold_items = yield OneInventoryDAO.selectAll({ id: { "isIn": itemIDs } });
        let prod_dict = {};
        sold_items.forEach((item) => {
            prod_dict[item["id"]] = item;
        });
        // Fetching taxes in case of invoice.
        let grnDetailsDAO = new sqlite3orm_1.BaseDAO(models_1.GRNItemDetailsDB, connection);
        let tax_rates = yield grnDetailsDAO.selectAll({ inventory_item_id_local: { "isIn": itemIDs } });
        var tax_rates_dict = {};
        tax_rates.forEach((data) => {
            tax_rates_dict[data["inventory_item_id_local"]] = data;
        });
        yield connection.close();
        // Getting shop data.
        let shop_data = [];
        let address_split_list = splitInto(shopdb_data["shop_address"], 20);
        address_split_list.forEach((ele, ind) => {
            if (ind == 0) {
                shop_data.push(["Address:: ", ele]);
            }
            else {
                shop_data.push([" ", ele]);
            }
        });
        shop_data.push(["Contact No:: ", shopdb_data["biller_phone"]]);
        shop_data.push(["GSTIN:: ", shopdb_data["gst_number"]]);
        // Getting shopper data
        let shopper_data = [];
        if (input.consumer_name != null) {
            shopper_data.push(["Bill To"].concat(splitInto(input.consumer_name, 15)));
        }
        else if (!shopperdb_data["phone_number"].includes("9999999999")) {
            shopper_data.push(["Bill To:: "].concat(splitInto(shopperdb_data["name"], 15)));
        }
        if (input.consumer_phone_number != null) {
            shopper_data.push(["  ", input.consumer_phone_number]);
        }
        else if (!shopperdb_data["phone_number"].includes("9999999999")) {
            shopper_data.push(["     "].concat(shopperdb_data["phone_number"]));
        }
        if (input.consumer_gst_number != null) {
            shopper_data.push(["Consumer GSTIN::", input.consumer_gst_number]);
        }
        //Getting product details
        let product_data = [];
        let total_sgst = 0;
        let total_cgst = 0;
        let subtotal = 0;
        let item_ids_with_no_cgst_or_sgst = [];
        product_data.push(["Product", "Price", "Discount", "Final Price", "Quantity", "SGST", "CGST", "Payable"]);
        sale.forEach(item_sale => {
            let item_id = item_sale["item_id"];
            let mrp = item_sale["Price"];
            let quantity = item_sale["quantity"];
            let discount = item_sale["discount"];
            let item_details = prod_dict[item_id];
            if (!item_details["name"].toLowerCase().includes(item_details["brand"].toLowerCase())) {
                var name = item_details["brand"] + " " + item_details["name"];
            }
            else {
                var name = item_details["name"];
            }
            let sgst = 0;
            let cgst = 0;
            try {
                sgst = tax_rates_dict[item_id]["sgst_rate"];
                cgst = tax_rates_dict[item_id]["cgst_rate"];
            }
            catch (_a) {
                item_ids_with_no_cgst_or_sgst.push(item_id);
            }
            let price = (mrp * 100 + discount * (sgst + cgst)) / (100 + sgst + cgst); //Since gst in inclusive in unit price so calculating raw price for the product.
            let finp = price - discount;
            let pretax = quantity * (price - discount);
            let sgst_amount = sgst / 100. * pretax;
            let cgst_amount = cgst / 100. * pretax;
            let item_payable = pretax + sgst_amount + cgst_amount;
            subtotal += price * quantity;
            total_sgst += sgst_amount;
            total_cgst += cgst_amount;
            let rounded_quantity = String(quantity.toFixed(1));
            if (item_details["units"] == "GRAM" && invoice_conf.a4invoice.gram_to_kg && item_details["quantity"] == 1) {
                price = price * 1000;
                quantity = quantity / 1000;
                discount = discount * 1000;
                rounded_quantity = String(quantity.toFixed(3));
            }
            name = name[0].toUpperCase() + name.slice(1).toLowerCase();
            let name_split_arr = splitInto(name, 25);
            let product_data_rounded_off_digits = invoice_conf.a4invoice.rounded_off_product_digits;
            let rounded_price = String(price.toFixed(product_data_rounded_off_digits));
            let rounded_discount = String(discount.toFixed(product_data_rounded_off_digits));
            let fp = String((price - discount).toFixed(product_data_rounded_off_digits));
            let rounded_payable = String(((price - discount) * quantity + cgst_amount + sgst_amount).toFixed(product_data_rounded_off_digits));
            if (name_split_arr.length == 1 && rounded_price.length <= 5 && rounded_discount.length <= 4 && rounded_quantity.length <= 5 && fp.length <= 5 && rounded_payable.length <= 5) {
                product_data.push([name_split_arr[0], rounded_price, rounded_discount, fp, rounded_quantity, sgst, cgst, rounded_payable]);
            }
            else if (name_split_arr.length == 2) {
                product_data.push([name_split_arr[0], rounded_price.slice(0, 5), rounded_discount.slice(0, 4), fp.slice(0, 5), rounded_quantity.slice(0, 5), sgst, cgst, rounded_payable.slice(0, 5)]);
                product_data.push([name_split_arr[1], rounded_price.slice(5), rounded_discount.slice(4), fp.slice(5), rounded_quantity.slice(5), " ", " ", rounded_payable.slice(5)]);
            }
            else {
                product_data.push([name_split_arr[0], rounded_price.slice(0, 5), rounded_discount.slice(0, 4), fp.slice(0, 5), rounded_quantity.slice(0, 5), sgst, cgst, rounded_payable.slice(0, 5)]);
                product_data.push([name_split_arr[1], rounded_price.slice(5), rounded_discount.slice(4), fp.slice(5), rounded_quantity.slice(5), " ", " ", rounded_payable.slice(5)]);
                product_data.push([name_split_arr[2], " ", "  ", " ", "  ", " ", " ", " "]);
            }
        });
        if (item_ids_with_no_cgst_or_sgst.length > 0) {
            return { "success": false, "reason": "CGST or SGST not filled for", "items": item_ids_with_no_cgst_or_sgst };
        }
        //Getting final prices.
        let final_prices = [];
        final_prices.push(["SUBTOTAL: ", subtotal.toFixed(round_off_digits)]);
        final_prices.push(["SAVINGS: ", total_savings.toFixed(round_off_digits)]);
        final_prices.push(["TOTAL SGST: ", total_sgst.toFixed(round_off_digits)]);
        final_prices.push(["TOTAL CGST: ", total_cgst.toFixed(round_off_digits)]);
        final_prices.push(["TOTAL GST: ", (total_cgst + total_sgst).toFixed(round_off_digits)]);
        final_prices.push(["TOTAL", total_sales.toFixed(round_off_digits)]);
        //Writing pdf.
        const doc = new pdfkit_1.default({ "size": "A4", "margins": invoice_measures["margins"] });
        let y = 0;
        let spacing = invoice_measures["spacing_between_vertial_blocks"];
        y += spacing;
        doc.pipe(fs_1.default.createWriteStream(filedir));
        if (configurations["show_invoice_number"]) {
            doc.fontSize(invoice_measures["invoice_number_fontsize"]);
            doc.font(invoice_measures["invoice_number_font"]);
            y += invoice_measures["invoice_number_fontsize"] * 1.1;
            doc.text("Invoice:: " + String(visitID), 2.75 * config_1.cm, y);
            y += spacing;
        }
        //Printing shop name.
        let shop_name_y = y;
        splitInto(shopdb_data["biller_name"], 20).forEach(name_part => {
            doc.font(invoice_measures["shop_name_font"]);
            doc.fontSize(invoice_measures["shop_name_fontsize"]);
            doc.text(name_part, invoice_measures["shop_name_x"], shop_name_y);
            shop_name_y += 1.1 * invoice_measures["shop_name_fontsize"];
        });
        // Printing shop details.
        doc.fontSize(invoice_measures["shop_data_fontsize"]);
        doc.font(invoice_measures["shop_data_font"]);
        shop_data.forEach((row) => {
            doc.text(row[0], invoice_measures["shop_data_x"], y);
            doc.text(row[1], invoice_measures["shop_data_x"] + 2.5 * config_1.cm, y);
            y += 1.1 * invoice_measures["shop_data_fontsize"];
        });
        y += spacing;
        //Printing shopper details and shipping details in case of delivery.
        let y1 = y;
        doc.fontSize(invoice_measures["shopper_data_fontsize"]);
        doc.font(invoice_measures["shopper_data_font"]);
        shopper_data.forEach((row) => {
            doc.text(row[0], invoice_measures["shopper_data_x"], y1);
            if (row.length == 2) {
                doc.text(row[1], invoice_measures["shopper_data_x"] + 2.5 * config_1.cm, y1);
            }
            y1 += 1.1 * invoice_measures["shopper_data_fontsize"];
        });
        y1 += spacing;
        //Printing time of invoicing.
        let time_y = y + (y1 - y) / 2;
        doc.fontSize(0.2 * config_1.cm);
        doc.text("Time:: " + shop_visit["last_touched"].toISOString(), invoice_measures["time_x"], time_y);
        //Printing product details.
        y = y1;
        let y_table_init = y;
        let table_left_x = invoice_measures["table_columns_x"][0] - 0.1 * config_1.cm;
        let table_right_x = 20.5 * config_1.cm;
        if (y > 28.7 * config_1.cm) {
            doc.addPage({ "size": "A4", "margins": invoice_measures["margins"] });
            y_table_init = 1 * config_1.cm;
            y = y_table_init;
        }
        product_data.forEach((row, rownum) => {
            if (rownum == 0) {
                doc.font(invoice_measures["table_line_font"]);
                doc.fontSize(invoice_measures["table_line_fontsize"]);
                doc.moveTo(table_left_x, y)
                    .lineTo(table_right_x, y)
                    .stroke();
                y += 1.5 * invoice_measures["table_header_fontsize"];
                doc.font(invoice_measures["table_header_font"]);
                doc.fontSize(invoice_measures["table_header_fontsize"]);
            }
            else {
                doc.font(invoice_measures["table_data_font"]);
                doc.fontSize(invoice_measures["table_data_fontsize"]);
            }
            row.forEach((word, ind) => {
                if (word == "") {
                    word = "";
                }
                ;
                doc.text(word, invoice_measures["table_columns_x"][ind], y);
            });
            let draw_line = true;
            try {
                if (product_data[rownum + 1][row.length - 1] == " ") {
                    draw_line = false;
                }
            }
            catch (_a) {
                draw_line = true;
            }
            ;
            if (draw_line) {
                y += 1.5 * invoice_measures["table_data_fontsize"];
                doc.font(invoice_measures["table_line_font"]);
                doc.fontSize(invoice_measures["table_line_fontsize"]);
                doc.moveTo(table_left_x, y)
                    .lineTo(table_right_x, y)
                    .stroke();
            }
            ;
            y += 1.5 * invoice_measures["table_line_fontsize"];
            if (y > 28.7 * config_1.cm) {
                y -= 1.5 * invoice_measures["table_line_fontsize"];
                invoice_measures["table_columns_x"].forEach(cl_x => {
                    doc.font(invoice_measures["table_line_font"]);
                    doc.fontSize(invoice_measures["table_line_fontsize"]);
                    doc.moveTo(cl_x - 0.1 * config_1.cm, y)
                        .lineTo(cl_x - 0.1 * config_1.cm, y_table_init)
                        .stroke();
                });
                doc.moveTo(table_right_x, y)
                    .lineTo(table_right_x, y_table_init)
                    .stroke();
                doc.addPage({ "size": "A4", "margins": invoice_measures["margins"] });
                y = 1 * config_1.cm;
                y_table_init = 1 * config_1.cm;
                if (draw_line) {
                    doc.font(invoice_measures["table_line_font"]);
                    doc.fontSize(invoice_measures["table_line_fontsize"]);
                    doc.moveTo(table_left_x, y)
                        .lineTo(table_right_x, y)
                        .stroke();
                    y += 1.5 * invoice_measures["table_data_fontsize"];
                }
            }
        });
        y -= 1.5 * invoice_measures["table_line_fontsize"];
        invoice_measures["table_columns_x"].forEach(cl_x => {
            doc.font(invoice_measures["table_line_font"]);
            doc.fontSize(invoice_measures["table_line_fontsize"]);
            doc.moveTo(cl_x - 0.1 * config_1.cm, y)
                .lineTo(cl_x - 0.1 * config_1.cm, y_table_init)
                .stroke();
        });
        doc.moveTo(table_right_x, y)
            .lineTo(table_right_x, y_table_init)
            .stroke();
        y += spacing;
        let y_table_end = y;
        //Printing final prices.
        doc.font(invoice_measures["prices_font"]);
        doc.fontSize(invoice_measures["prices_fontsize"]);
        let prices_on_new_page = false;
        final_prices.forEach((price_row) => {
            if (y > 28.7 * config_1.cm) {
                doc.addPage({ "size": "A4", "margins": invoice_measures["margins"] });
                y = 1 * config_1.cm;
                prices_on_new_page = true;
            }
            ;
            doc.text(price_row[0], invoice_measures["prices_x"], y);
            doc.text(price_row[1], invoice_measures["prices_x"] + 4 * config_1.cm, y);
            y += 1.5 * invoice_measures["prices_fontsize"];
        });
        //Checking and printing QR code on pdf if needed.
        let qrcode_data = { "qrexists": false, "qr_dir": "" };
        let files = fs_1.default.readdirSync(qrcode_dir);
        for (let filenum in files) {
            if (files[filenum].includes("shopId_" + String(shop_id))) {
                qrcode_data = { "qrexists": true, "qr_dir": qrcode_dir + "/" + files[filenum] };
                break;
            }
        }
        let qry = y_table_end;
        if (qrcode_data["qrexists"]) {
            doc.font(invoice_measures["qr_info_font"]);
            doc.fontSize(invoice_measures["qr_info_fontsize"]);
            if ((qry > (28.7 * config_1.cm - invoice_measures["qrheight"] - 1.5 * invoice_measures["qr_info_fontsize"] - spacing)) && (!prices_on_new_page)) {
                // If there is not enough space for qr on the previous page but next page has not been added.
                doc.addPage({ "size": "A4", "margins": invoice_measures["margins"] });
                qry = 1 * config_1.cm;
            }
            else if ((qry > (28.7 * config_1.cm - 1.5 * invoice_measures["qrheight"] - y_table_end - spacing)) && (prices_on_new_page)) {
                // If no enough space for qr and next page has already been added.
                qry = 1 * config_1.cm;
            }
            // In other cases qry = y_table_end will do the trick.
            doc.text("Please scan QR to pay:", invoice_measures["qr_code_x"], qry);
            qry += spacing;
            doc.image(qrcode_data["qr_dir"], invoice_measures['qr_code_x'], qry, { "height": invoice_measures["qrheight"] });
            qry += invoice_measures["qrheight"];
            qry += spacing;
        }
        ;
        if (qrcode_data["qrexists"]) {
            y = qry;
        }
        else {
            y = y_table_end;
        }
        if (prices_on_new_page && !qrcode_data["qrexists"]) {
            y = 1 * config_1.cm;
        }
        else if (!prices_on_new_page && qrcode_data["qrexists"] && y > 28.7 * config_1.cm) {
            doc.addPage({ "size": "A4", "margins": invoice_measures["margins"] });
            y = 1 * config_1.cm;
        }
        ;
        doc.font(invoice_measures["thank_font"]);
        doc.fontSize(invoice_measures["thank_font_size"]);
        doc.text("THANK YOU!!", invoice_measures["thank_x"], y);
        doc.end();
        return { "success": true, "pdf_link": filelink };
    })
});