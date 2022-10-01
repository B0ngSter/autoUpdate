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
exports.getCatalogItemEndPoint = exports.removeitemFromShopInventoryEndPoint = exports.additemToShopInventoryEndPoint = exports.extraRouter = void 0;
const express_1 = __importDefault(require("express"));
const sqlite3orm_1 = require("sqlite3orm");
const config_1 = require("./config");
const custom_result_handler_1 = require("./custom_result_handler");
const models_1 = require("./models");
const express_zod_api_1 = require("express-zod-api");
const model_datatypes_1 = require("./model_datatypes");
//const {indexData, searchbarcode, searchbarcodeImport, searchname, getcatdata, exportIndex  } = require("./search_functions.js");
const { indexData, searchbarcode, searchname, getcatdata } = require("./search_functions.js");
exports.extraRouter = express_1.default.Router();
exports.extraRouter.get("/vendorSideSearchInShop", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search_string = req.query.searchstr;
    let shop_id = req.query.shop_id;
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let inventoryDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    let nameSearchedProds = yield inventoryDAO.selectAll({
        and: [
            { disabled: false },
            { or: [
                    { brand: { isLike: "%" + search_string + "%" } },
                    { name: { isLike: "%" + search_string + "%" } }
                ] }
        ]
    });
    let barcodeSearchedProds = [];
    if (nameSearchedProds.length < 30) {
        barcodeSearchedProds = yield inventoryDAO.selectAll({
            barcode: { isLike: search_string + "%" },
            disabled: false
        });
    }
    let allProds = [];
    nameSearchedProds.forEach((prod) => {
        let singleResult = {
            product_description: prod.brand + " " + prod.name,
            product_id: prod.id,
            shop_id: shop_id
        };
        allProds.push(singleResult);
    });
    barcodeSearchedProds.forEach((prod) => {
        let singleResult = {
            product_description: prod.barcode,
            product_id: prod.id,
            shop_id: shop_id
        };
        allProds.push(singleResult);
    });
    return res.json(allProds);
})).get("/advancedSearchBarcode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search_string = req.query.barcodestr;
    let shop_id = req.query.shop_id;
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let inventoryDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    let barcodeSearchedProds = [];
    barcodeSearchedProds = yield inventoryDAO.selectAll({
        barcode: { isLike: search_string + "%" },
        disabled: false
    });
    let allProds = [];
    barcodeSearchedProds.forEach((prod) => {
        let singleResult = {
            product_description: prod.barcode,
            product_id: prod.id,
            shop_id: shop_id
        };
        allProds.push(singleResult);
    });
    if (allProds.length != 0) {
        return res.json({ inventory_list: allProds, catalog_list: null });
    }
    else {
        var barcodeIndex;
        var searchresults;
        // @ts-ignore
        if (!globalThis.barcodeIndex) {
            console.log("Ho!!");
            barcodeIndex = yield config_1.config.local_storage.getItem("barcodeIndex");
            searchresults = searchbarcode(barcodeIndex, search_string);
        }
        else {
            console.log("Ha!!");
            // @ts-ignore
            barcodeIndex = globalThis.barcodeIndex;
            searchresults = searchbarcode(barcodeIndex, search_string, false);
        }
        searchresults.sort((s1, s2) => {
            return s2["score"] - s1["score"];
        });
        if (searchresults.length > 10) {
            searchresults = searchresults.slice(0, 10);
        }
        let catprods = [];
        for (var i = 0; i < searchresults.length; i++) {
            let searchres = searchresults[i];
            catprods.push({
                product_description: search_string,
                product_id: searchres["id"],
                score: searchres["score"]
            });
        }
        return res.json({ inventory_list: null, catalog_list: catprods });
    }
})).get("/searchProductFromBarcode", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search_string = req.query.barcodestr;
    let shop_id = req.query.shop_id;
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let inventoryDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    let allProds = yield inventoryDAO.selectAll({
        barcode: { isLike: search_string + "%" },
        disabled: false
    });
    let results = [];
    allProds.forEach((prod) => {
        let singleResult = {
            product_description: prod.barcode,
            product_id: prod.id,
            shop_id: shop_id
        };
        results.push(singleResult);
    });
    return res.json(results);
})).get("/searchBarcodeInCatalog", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search_string = req.query.barcodestr;
    let shop_id = req.query.shop_id;
    return res.json([]);
})).get("/getShopInventory", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let shopData = yield config_1.config.local_storage.get("shopemployeedata");
    if (!shopData["permission_view_inventory"]) {
        throw (0, express_zod_api_1.createHttpError)(405, "You do not have permissions for this action.");
    }
    return res.json([{ "inventory_json": shopData["inventory_json"] }]);
})).post("/getInventoryCategoryForShop", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let inventoryIDs = req.body.inventoryIDs;
    if (!Array.isArray(inventoryIDs)) {
        res.status(406).json({ "detail": "inventoryIDs must be array." });
        return;
    }
    ;
    let shopData = yield config_1.config.local_storage.get("shopemployeedata");
    if (!shopData["permission_view_inventory"]) {
        throw (0, express_zod_api_1.createHttpError)(405, "You do not have permissions for this action.");
    }
    let inventory_json = shopData["inventory_json"];
    let resList = [];
    inventoryIDs.forEach((itemID) => {
        for (let idx in inventory_json.inventory_items) {
            if (inventory_json.inventory_items[idx].item_ids.includes(itemID)) {
                resList.push(inventory_json.inventory_items[idx]);
                break;
            }
        }
    });
    res.json(resList);
    return;
})).get("/searchLooseProducts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let search_string = "0064";
    let shop_id = req.query.shop_id;
    let connection = yield (0, models_1.getConnection)(config_1.config.database.db_file);
    let inventoryDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
    let allProds = yield inventoryDAO.selectAll({
        barcode: { isLike: search_string + "%" },
        disabled: false
    });
    let results = [];
    allProds.forEach((prod) => {
        let singleResult = {
            product_description: prod.barcode,
            product_id: prod.id,
            shop_id: shop_id
        };
        results.push(singleResult);
    });
    return res.json({ "inventory_list": results });
})).get("/getCatalogItemWithCategorization", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let item_id = req.query.itemID;
    if (item_id == undefined) {
        res.status(406).json({ "detail": "pass itemID" });
    }
    else {
        let itemID = parseInt(String(item_id), 10);
        var catalog;
        // @ts-ignore
        if (!globalThis.datadict) {
            catalog = yield config_1.config.local_storage.getItem("datadict");
            // @ts-ignore
            globalThis.datadict = catalog;
        }
        else {
            // @ts-ignore
            catalog = globalThis.datadict;
        }
        let catItem = catalog[itemID];
        res.json([Object.assign(Object.assign({}, catItem), { item_id: catItem["id"] }), {
                subcategory: "",
                subsubcategory: "",
                essential_item: false
            }]);
    }
    return;
}));
exports.additemToShopInventoryEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.LocalItemAddToCategoryIN,
    output: express_zod_api_1.z.object({
        message: express_zod_api_1.z.string()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.get("shopemployeedata");
        let inventory_json = shopData["inventory_json"];
        for (let idx in inventory_json.inventory_items) {
            if (input.category_number == inventory_json.inventory_items[idx].category_number) {
                inventory_json.inventory_items[idx].item_ids.push(input.inventory_item_id);
            }
        }
        shopData.inventory_json = inventory_json;
        yield config_1.config.local_storage.set("shopemployeedata", shopData);
        return { "message": "Added to category" };
    })
});
exports.removeitemFromShopInventoryEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.LocalItemAddToCategoryIN,
    output: express_zod_api_1.z.object({
        message: express_zod_api_1.z.string()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.get("shopemployeedata");
        let inventory_json = shopData["inventory_json"];
        for (let idx in inventory_json.inventory_items) {
            if (input.category_number == inventory_json.inventory_items[idx].category_number) {
                inventory_json.inventory_items[idx].item_ids.splice(inventory_json.inventory_items[idx].item_ids.indexOf(input.inventory_item_id), 1);
            }
        }
        shopData.inventory_json = inventory_json;
        yield config_1.config.local_storage.set("shopemployeedata", shopData);
        return { "message": "Removed from category" };
    })
});
exports.getCatalogItemEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "get",
    input: express_zod_api_1.z.object({
        itemID: express_zod_api_1.z.string().transform(val => parseInt(val, 10))
    }),
    output: model_datatypes_1.LocalCatalogItem,
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let catalog = yield config_1.config.local_storage.getItem("datadict");
        let catItem = catalog[input.itemID];
        return yield model_datatypes_1.LocalCatalogItem.parseAsync(Object.assign(Object.assign({}, catItem), { item_id: catItem["id"] }));
    })
});