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
exports.directRouter = void 0;
const express_1 = __importDefault(require("express"));
const sqlite3orm_1 = require("sqlite3orm");
const config_1 = require("./config");
const filebased_config_load_1 = require("./filebased_config_load");
const models_1 = require("./models");
const model_datatypes_1 = require("./model_datatypes");
const express_zod_api_1 = require("express-zod-api");
const content_json_1 = require("./content_json");
exports.directRouter = express_1.default.Router();
function generate_invoice_status(invoices) {
    let final_invoices = [];
    invoices.forEach((invoice) => {
        if (!invoice["discarded"]) {
            if (invoice["shop_employee_driven_btc"]) {
                invoice['order_type'] = "Shop Billed";
                if (invoice["payment_verified"]) {
                    if (invoice["payment_completed"]) {
                        invoice['invoice_status'] = 'complete';
                    }
                    else if (invoice["payment_defer"] && !invoice["payment_completed"]) {
                        invoice["invoice_status"] = "khata";
                    }
                    else {
                        invoice['invoice_status'] = 'incomplete';
                    }
                }
                else {
                    if (invoice["shop_employee_driven_btc_scan_completed"]) {
                        invoice['invoice_status'] = 'unpaid';
                    }
                    else if (!invoice["shop_employee_driven_btc_scan_completed"] && invoice["employee_id"] != null) {
                        invoice['invoice_status'] = 'consumer needs to accept';
                    }
                    else if (!invoice["shop_employee_driven_btc_scan_completed"] && invoice["employee_id"] == null) {
                        invoice['invoice_status'] = 'pending';
                    }
                    else {
                        invoice['invoice_status'] = 'uncertain';
                    }
                }
            }
            else if (!invoice["shop_employee_driven_btc"]) {
                if (invoice["advanced_order_type"] == "NA") {
                    invoice["order_type"] = "Pre Version 0.25";
                }
                else if (invoice["advanced_order_type"] == "INSTORE") {
                    invoice["order_type"] = "SELF BILLING";
                }
                else if (invoice["advanced_order_type"] == "PICKUP") {
                    invoice["order_type"] = "ORDER PICK UP";
                }
                else if (invoice["advanced_order_type"] == "DELIVERY") {
                    invoice["order_type"] = "DELIVERY";
                }
                else {
                    invoice["order_type"] = "UNCERTAIN";
                }
                if (invoice["payment_verified"]) {
                    if (invoice["payment_completed"]) {
                        invoice['invoice_status'] = 'complete';
                    }
                    else if (invoice["payment_defer"] && !invoice["payment_completed"]) {
                        invoice["invoice_status"] = "khata";
                    }
                    else {
                        invoice['invoice_status'] = 'incomplete';
                    }
                }
                else {
                    if (invoice["shop_employee_driven_btc_scan_completed"]) {
                        invoice['invoice_status'] = 'unpaid';
                    }
                    else if (!invoice["shop_employee_driven_btc_scan_completed"] && invoice["employee_id"] != null) {
                        invoice['invoice_status'] = 'consumer needs to accept';
                    }
                    else if (!invoice["shop_employee_driven_btc_scan_completed"] && invoice["employee_id"] == null) {
                        invoice['invoice_status'] = 'pending';
                    }
                    else {
                        invoice['invoice_status'] = 'uncertain';
                    }
                }
            }
            final_invoices.push(invoice);
        }
    });
    return final_invoices;
}
//these are the services which either accept input or yield output of different type other than the IOSchema of express-zod-api.
exports.directRouter.get("/isConsumerNameBlank/:phoneNumber", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let ShopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
    let existingShopper = yield ShopperDAO.selectOne({
        select: { name: true },
        where: { phone_number: req.params.phoneNumber }
    });
    yield connection.close();
    if (existingShopper.name == req.params.phoneNumber || existingShopper.name.trim().length < 3) {
        return res.send(true);
    }
    else {
        return res.send(false);
    }
}))
    .get("/getCategoryHierarchy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.json(filebased_config_load_1.category_subcategory_subsubcategory_dict);
}))
    .post("/getDetailedInventoryList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shop_data = yield config_1.config.local_storage.getItem("shopemployeedata");
    if (!shop_data["permission_view_inventory"]) {
        return res.status(405).json({ "detail": "You do not have permissions for this action." });
    }
    ;
    let itemIDs = req.body;
    let sortedOutput = new Array(itemIDs.length);
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    let productCategoryDAO = new sqlite3orm_1.BaseDAO(models_1.ProductCategorizationDB, connection);
    let sno = 0;
    if (itemIDs.length == 0) {
        res.json([]);
        return;
    }
    yield Promise.all(itemIDs.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        let invObjs = yield OneInventoryItemDAO.selectAll({
            id: id,
            disabled: false
        });
        if (invObjs.length == 0) {
            console.log("item with itemID " + String(id) + " either does not exist or has been disabled.");
        }
        else {
            let invObj = invObjs[0];
            let categoryObj = yield productCategoryDAO.selectOne({
                inventory_item_id_local: id
            });
            invObj.item_id = id;
            let index_of_item = itemIDs.indexOf(id);
            sortedOutput[index_of_item] = {
                sno: sno,
                item_details: Object.assign(Object.assign({}, invObj), { created_by_id: invObj.created_by }),
                item_classification: [Object.assign(Object.assign({}, categoryObj), { inventory_item_id: categoryObj.inventory_item_id_local, categorization_id: categoryObj.id })]
            };
            sno += 1;
        }
        ;
    })));
    yield connection.close();
    res.json(yield model_datatypes_1.LocalDetailedInventoryListOut.parseAsync(sortedOutput));
}))
    .post("/createHSNEntries", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shop_data = yield config_1.config.local_storage.getItem("shopemployeedata");
    if (!shop_data["permission_edit_inventory"]) {
        return res.status(405).json({ "detail": "You do not have permissions for this action." });
    }
    ;
    let hsnEntriesDateType = express_zod_api_1.z.array(model_datatypes_1.createHSNEntryDataType);
    let hsnEntries = yield hsnEntriesDateType.parseAsync(req.body);
    let returnlist = [];
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let GRNDetailsDAO = new sqlite3orm_1.BaseDAO(models_1.GRNItemDetailsDB, connection);
    yield Promise.all(hsnEntries.map((hsnENtry) => __awaiter(void 0, void 0, void 0, function* () {
        let obj = yield GRNDetailsDAO.insertPartial({
            inventory_item_id_local: hsnENtry.grn_data.inventory_item_id,
            shop_id: hsnENtry.shop_id,
            purchase_rate: hsnENtry.grn_data.purchase_rate,
            price_currency: hsnENtry.grn_data.price_currency,
            sgst_rate: hsnENtry.grn_data.sgst_rate,
            cgst_rate: hsnENtry.grn_data.cgst_rate,
        });
        let updatedObj = yield GRNDetailsDAO.selectOne({ local_id: obj.local_id });
        returnlist.push({
            id: updatedObj.local_id,
            purchase_rate: updatedObj.purchase_rate,
            price_currency: updatedObj.price_currency,
            inventory_item_id: updatedObj.inventory_item_id_local,
            sgst_rate: updatedObj.sgst_rate,
            cgst_rate: updatedObj.cgst_rate,
            created: updatedObj.created,
            last_touched: updatedObj.last_touched
        });
    })));
    yield connection.close();
    res.json(returnlist);
    return;
})).get("/getShopEmplyeeDetails", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield config_1.config.local_storage.getItem("shopemployeedata"));
})).get("/shopInvoices", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shop_data = yield config_1.config.local_storage.getItem("shopemployeedata");
    if (!shop_data["permission_view_invoices"]) {
        return res.status(405).json({ "detail": "You do not have permissions for this action." });
    }
    ;
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let current_datetime = new Date();
    let vendor_visit_time_limit = new Date(current_datetime.getTime() - config_1.config.vendor_visit_query_time_limit * 24 * 60 * 60 * 1000);
    let payments = yield connection.all("select shopvisitdb_local.local_id, shopvisitdb_local.shopping_json_local, shopvisitdb_local.discarded, shopvisitdb_local.employee_id, shopvisitdb_local.advanced_order_type, shopvisitdb_local.shop_employee_driven_btc, shopvisitdb_local.shop_employee_driven_btc_scan_completed, shopvisitdb_local.payment_id_local, paymentdb_local.payment_complete, paymentdb_local.payment_defer, paymentdb_local.mode, paymentdb_local.payment_verified, paymentdb_local.created, shopperdb_local.name, shopperdb_local.phone_number, shopperdb_local.address_line1, shopperdb_local.address_line2, shopperdb_local.address_city, shopperdb_local.address_code from shopvisitdb_local INNER JOIN paymentdb_local ON paymentdb_local.local_id = shopvisitdb_local.payment_id_local INNER JOIN shopshopperrelationshipdb_local ON shopshopperrelationshipdb_local.local_id = shopvisitdb_local.relationship_id_local INNER JOIN shopperdb_local ON shopperdb_local.local_id = shopshopperrelationshipdb_local.shopper_id_local where shopvisitdb_local.last_touched >= $1", [vendor_visit_time_limit]);
    yield connection.close();
    let formattedPayments = [];
    payments.forEach((payment) => {
        formattedPayments.push({
            "visit_id": payment["local_id"],
            "shopping_json": JSON.parse(payment["shopping_json_local"]),
            "payment_id": payment["payment_id_local"],
            "payment_completed": payment["payment_complete"],
            "payment_defer": payment["payment_defer"],
            "payment_mode": payment["mode"],
            "created": payment["created"],
            "discarded": payment["discarded"],
            "advanced_order_type": payment["advanced_order_type"],
            "shop_employee_driven_btc": payment["shop_employee_driven_btc "],
            "shop_employee_driven_btc_scan_completed": payment["shop_employee_driven_btc_scan_completed"],
            "employee_id": payment["employee_id"],
            "shop_id": shop_data["shop_id"],
            "shop_name": shop_data["shop_name"],
            "shop_coordinates": shop_data["shop_coordinates"],
            "shopper_name": payment["name"],
            "shopper_phone_number": payment["phone_number"],
            "employee_name": shop_data["employee_name"],
            "address_line1": payment["address_line1"],
            "address_line2": payment["address_line2"],
            "address_city": payment["address_city"],
            "address_code": payment["address_code"],
            "self_serving": shop_data["self_serving"],
            "payment_verified": payment["payment_verified"]
        });
    });
    let filteredPayments = [];
    formattedPayments.forEach((payment) => {
        if (payment["shop_employee_driven_btc"]) {
            let shopping_json = payment["shopping_json"];
            if (Array.isArray(shopping_json) && (shopping_json.length > 0) && (!payment["discarded"])) {
                filteredPayments.push(payment);
            }
        }
        else {
            let shopping_json = payment["shopping_json"];
            if (Array.isArray(shopping_json) && (shopping_json.length > 0)) {
                filteredPayments.push(payment);
            }
        }
    });
    let final_invoices = generate_invoice_status(filteredPayments);
    final_invoices.sort((a, b) => { return new Date(b["created"]).getTime() - new Date(a["created"]).getTime(); });
    return res.json(final_invoices);
})).get("/getPaymentModes", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(content_json_1.PaymentModes._def.values);
    return;
})).post("/updatedInvoiceList", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shop_data = yield config_1.config.local_storage.getItem("shopemployeedata");
    if (!shop_data["permission_view_invoices"]) {
        return res.status(405).json("Method Not allowed.");
    }
    let visitIDs = req.body.visitIDs;
    if (!Array.isArray(visitIDs)) {
        res.status(406).json("Pass an array.");
        return;
    }
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let payments = yield connection.all("select shopvisitdb_local.local_id, shopvisitdb_local.shopping_json_local, shopvisitdb_local.discarded, shopvisitdb_local.employee_id, shopvisitdb_local.advanced_order_type, shopvisitdb_local.shop_employee_driven_btc, shopvisitdb_local.shop_employee_driven_btc_scan_completed, shopvisitdb_local.payment_id_local, paymentdb_local.payment_complete, paymentdb_local.payment_defer, paymentdb_local.mode, paymentdb_local.payment_verified, paymentdb_local.created, shopperdb_local.name, shopperdb_local.phone_number, shopperdb_local.address_line1, shopperdb_local.address_line2, shopperdb_local.address_city, shopperdb_local.address_code from shopvisitdb_local INNER JOIN paymentdb_local ON paymentdb_local.local_id = shopvisitdb_local.payment_id_local INNER JOIN shopshopperrelationshipdb_local ON shopshopperrelationshipdb_local.local_id = shopvisitdb_local.relationship_id_local INNER JOIN shopperdb_local ON shopperdb_local.local_id = shopshopperrelationshipdb_local.shopper_id_local where shopvisitdb_local.local_id IN (" + visitIDs.join(', ') + ")");
    yield connection.close();
    let formattedPayments = [];
    payments.forEach((payment) => {
        formattedPayments.push({
            "visit_id": payment["local_id"],
            "shopping_json": JSON.parse(payment["shopping_json_local"]),
            "payment_id": payment["payment_id_local"],
            "payment_completed": payment["payment_complete"],
            "payment_defer": payment["payment_defer"],
            "payment_mode": payment["mode"],
            "created": payment["created"],
            "discarded": payment["discarded"],
            "advanced_order_type": payment["advanced_order_type"],
            "shop_employee_driven_btc": payment["shop_employee_driven_btc "],
            "shop_employee_driven_btc_scan_completed": payment["shop_employee_driven_btc_scan_completed"],
            "employee_id": payment["employee_id"],
            "shop_id": shop_data["shop_id"],
            "shop_name": shop_data["shop_name"],
            "shop_coordinates": shop_data["shop_coordinates"],
            "shopper_name": payment["name"],
            "shopper_phone_number": payment["phone_number"],
            "address_line1": payment["address_line1"],
            "address_line2": payment["address_line2"],
            "address_city": payment["address_city"],
            "address_code": payment["address_code"],
            "self_serving": shop_data["self_serving"],
            "payment_verified": payment["payment_verified"]
        });
    });
    res.json(formattedPayments);
    return;
}))
    .get("/searchUserWithNameOrPhone", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search_string = req.query.search_string;
    if (search_string == null || search_string === undefined || search_string == "") {
        return res.status(406).json("search string not provided.");
    }
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let shopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
    let shoppersData = yield shopperDAO.selectAll({
        or: [{ "name": {
                    "isLike": search_string + "%"
                } }, { "phone_number": {
                    "isLike": "+91" + search_string + "%"
                } }, { "phone_number": {
                    "isLike": search_string + "%"
                } }]
    });
    yield connection.close();
    return res.json(shoppersData);
}))
    .post("/getDetailedItemsTimesorted", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shop_data = yield config_1.config.local_storage.getItem("shopemployeedata");
    if (!shop_data["permission_view_inventory"]) {
        return res.status(405).json({ "detail": "You do not have permissions for this action." });
    }
    ;
    let itemIDs = req.body.item_ids;
    let outPut = [];
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    let productCategoryDAO = new sqlite3orm_1.BaseDAO(models_1.ProductCategorizationDB, connection);
    let sno = 0;
    if (itemIDs.length == 0) {
        res.json([]);
        return;
    }
    yield Promise.all(itemIDs.map((id) => __awaiter(void 0, void 0, void 0, function* () {
        let invObjs = yield OneInventoryItemDAO.selectAll({
            id: id,
            disabled: false
        });
        if (invObjs.length == 0) {
            console.log("item with itemID " + String(id) + " either does not exist or has been disabled.");
        }
        else {
            let invObj = invObjs[0];
            let categoryObj = yield productCategoryDAO.selectOne({
                inventory_item_id_local: id
            });
            invObj.item_id = id;
            outPut.push({
                sno: sno,
                item_details: Object.assign(Object.assign({}, invObj), { created_by_id: invObj.created_by }),
                item_oogadiscount: [],
                item_classification: [Object.assign(Object.assign({}, categoryObj), { inventory_item_id: categoryObj.inventory_item_id_local, categorization_id: categoryObj.id })]
            });
            sno += 1;
        }
        ;
    })));
    yield connection.close();
    res.json(yield model_datatypes_1.LocalDetailedItemsListOut.parseAsync(outPut));
    return;
}))
    .post("/editInventoryItemWithCategorization", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let product_data = null;
    let product_categorization = null;
    try {
        product_data = yield model_datatypes_1.LocalInventoryUpdateDataTypeIn.parseAsync(req.body.product_data);
        product_categorization = yield model_datatypes_1.LocalProductCategorization.parseAsync(req.body.product_categorization);
    }
    catch (err) {
        return res.status(406).json(err);
    }
    ;
    let itemID = null;
    try {
        itemID = req.body.item_id;
    }
    catch (_a) {
        return res.status(406).json("No item_id provided.");
    }
    let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
    if (!shopData["permission_view_inventory"]) {
        return res.status(405).json({ "detail": "You do not have permissions for this action." });
    }
    ;
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    yield OneInventoryItemDAO.updatePartialAll(Object.assign(Object.assign({}, product_data), { created_by: shopData["employee_id"], delta: 1, last_touched: new Date() }), {
        id: itemID
    });
    let itemData = yield OneInventoryItemDAO.selectOne({ id: itemID });
    let categorizationDAO = new sqlite3orm_1.BaseDAO(models_1.ProductCategorizationDB, connection);
    yield categorizationDAO.updatePartialAll(Object.assign(Object.assign({}, product_categorization), { delta: 1 }), {
        inventory_item_id_local: { "eq": itemID }
    });
    let categorizationData = yield categorizationDAO.selectOne({ inventory_item_id_local: itemID });
    yield connection.close();
    itemData.item_id = itemID;
    return res.json([yield model_datatypes_1.LocalDetailedInventoryOutput.parseAsync(Object.assign(Object.assign({}, itemData), { created_by_id: itemData.created_by })), yield model_datatypes_1.LocalProductCategorizationOut.parseAsync(Object.assign(Object.assign({}, categorizationData), { categorization_id: categorizationData.id }))]);
})).post("/getGRNDetailsForItemIDs", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shopData = yield config_1.config.local_storage.get("shopemployeedata");
    if (!shopData["permission_view_inventory"]) {
        return res.status(405).json({ "detail": "You do not have permissions for this action." });
    }
    ;
    let itemIDs = req.body;
    if (!Array.isArray(itemIDs)) {
        return res.status(406).json({ "detail": "Pass an array in req body." });
    }
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let grnDAO = new sqlite3orm_1.BaseDAO(models_1.GRNItemDetailsDB, connection);
    let grn_item_details = yield grnDAO.selectAll({
        inventory_item_id_local: { "isIn": itemIDs }
    });
    let responseArr = [];
    grn_item_details.forEach((item) => {
        responseArr.push({
            id: item.local_id,
            inventory_item_id: item.inventory_item_id_local,
            purchase_rate: item.purchase_rate,
            price_currency: item.price_currency,
            sgst_rate: item.sgst_rate,
            cgst_rate: item.cgst_rate,
            created: item.created,
            last_touched: item.last_touched
        });
    });
    return res.json(responseArr);
}));