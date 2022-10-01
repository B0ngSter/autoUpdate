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
Object.defineProperty(exports, "__esModule", { value: true });
exports.editInventoryItemAndSaveBarcodeEndPoint = exports.registerProductsForSupplierInvoicingEndPoint = exports.addInventoryItemWithCategorizationForBarcodeBillingAndGenerateBarcodeEndPoint = exports.editInventoryItemEndPoint = exports.enableInventoryItemEndPoint = exports.disableInventoryItemEndPoint = exports.addInventoryItemWithCategorizationForBarcodeBillingEndPoint = void 0;
const custom_result_handler_1 = require("./custom_result_handler");
const model_datatypes_1 = require("./model_datatypes");
const express_zod_api_1 = require("express-zod-api");
const models_1 = require("./models");
const config_1 = require("./config");
const sqlite3orm_1 = require("sqlite3orm");
exports.addInventoryItemWithCategorizationForBarcodeBillingEndPoint = custom_result_handler_1.aistoreEndpointsFactory
    .build({
    method: "post",
    input: express_zod_api_1.z.object({
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        employeeID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10))
    }).merge(model_datatypes_1.LocalFullProductDataTypeIN.strict()),
    output: model_datatypes_1.LocalFullProductDataTypeOut,
    handler: ({ input, options }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_add_inventory"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let item = input.product_data;
        let category_data = input.product_categorization;
        let employeeID = input.employeeID;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
        let createdInvObj = yield OneInventoryItemDAO.insertPartial(Object.assign(Object.assign({}, item), { created_by: employeeID, delta: 0 }));
        let ProductCategorizationDAO = new sqlite3orm_1.BaseDAO(models_1.ProductCategorizationDB, connection);
        let createdProductCatObj = yield ProductCategorizationDAO.insertPartial(Object.assign(Object.assign({}, category_data), { inventory_item_id_local: createdInvObj.id, delta: 0 }));
        yield connection.close();
        return yield model_datatypes_1.LocalFullProductDataTypeOut.parseAsync({
            product_data: createdInvObj,
            product_categorization: createdProductCatObj,
            item_id: createdInvObj.id
        });
        //Write search logic in neon bindings for this.
    })
});
exports.disableInventoryItemEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        item_id: express_zod_api_1.z.string().transform((value) => parseInt(value, 10))
    }),
    output: model_datatypes_1.LocalDetailedInventoryOutput,
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_delete_inventory"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
        yield OneInventoryItemDAO.updatePartialAll({
            disabled: true,
            delta: 2,
            last_touched: new Date()
        }, {
            id: input.item_id
        });
        let invObj = yield OneInventoryItemDAO.selectOne({
            id: input.item_id
        });
        yield connection.close();
        invObj.item_id = invObj.id;
        return yield model_datatypes_1.LocalDetailedInventoryOutput.parseAsync(Object.assign(Object.assign({}, invObj), { created_by_id: invObj.created_by }));
    })
});
exports.enableInventoryItemEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        item_id: express_zod_api_1.z.string().transform((value) => parseInt(value, 10))
    }),
    output: model_datatypes_1.LocalDetailedInventoryOutput,
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_edit_inventory"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
        yield OneInventoryItemDAO.updatePartialAll({
            disabled: false,
            delta: 1,
            last_touched: new Date()
        }, {
            id: input.item_id
        });
        let invObj = yield OneInventoryItemDAO.selectOne({
            id: input.item_id
        });
        yield connection.close();
        invObj.item_id = invObj.id;
        return yield model_datatypes_1.LocalDetailedInventoryOutput.parseAsync(Object.assign(Object.assign({}, invObj), { created_by_id: invObj.created_by }));
    })
});
exports.editInventoryItemEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.LocalInventoryUpdateDataTypeIn.extend({
        itemID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        employeeID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10))
    }),
    output: model_datatypes_1.LocalDetailedInventoryOutput,
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_edit_inventory"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
        yield OneInventoryItemDAO.updatePartialAll(Object.assign(Object.assign({}, input), { created_by: input.employeeID, delta: 1, last_touched: new Date() }), {
            id: input.itemID
        });
        let itemData = yield OneInventoryItemDAO.selectOne({ id: input.itemID });
        yield connection.close();
        itemData.item_id = input.itemID;
        return yield model_datatypes_1.LocalDetailedInventoryOutput.parseAsync(Object.assign(Object.assign({}, itemData), { created_by_id: itemData.created_by }));
    })
});
exports.addInventoryItemWithCategorizationForBarcodeBillingAndGenerateBarcodeEndPoint = custom_result_handler_1.aistoreEndpointsFactory
    .build({
    method: "post",
    input: express_zod_api_1.z.object({
        shopID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        employeeID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        item_data: model_datatypes_1.LocalFullProductDataTypeIN.optional().nullable(),
        barcode_data: model_datatypes_1.BarcodeDataType.optional().nullable()
    }),
    output: model_datatypes_1.LocalFullProductWithBarcodeDataTypeOut.or(express_zod_api_1.z.object({})),
    handler: ({ input, options }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_add_inventory"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        if (input.barcode_data == undefined && input.item_data == undefined) {
            throw express_zod_api_1.createHttpError(406, "Please provide barcode_data or item_data.");
        }
        ;
        if (input.item_data != null) {
            if (input.barcode_data != undefined) {
                if (input.barcode_data.use_auto_generated_barcode && input.item_data == null) {
                    throw express_zod_api_1.createHttpError(406, "Provide item_data.");
                }
                ;
                if (shopData["maximum_barcode_count"] == null) {
                    shopData["maximum_barcode_count"] = 0;
                }
                ;
                if (shopData["maximum_barcode_count"] + 1 != input.barcode_data.barcode_count) {
                    throw express_zod_api_1.createHttpError(406, "Please try again, this barcode count is valid no more.");
                }
                ;
            }
            ;
            let item = input.item_data.product_data;
            let category_data = input.item_data.product_categorization;
            let employeeID = input.employeeID;
            let connection = yield models_1.getConnection(config_1.config.database.db_file);
            let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
            let createdInvObj = yield OneInventoryItemDAO.insertPartial(Object.assign(Object.assign({}, item), { created_by: employeeID, delta: 0 }));
            let ProductCategorizationDAO = new sqlite3orm_1.BaseDAO(models_1.ProductCategorizationDB, connection);
            let createdProductCatObj = yield ProductCategorizationDAO.insertPartial(Object.assign(Object.assign({}, category_data), { inventory_item_id_local: createdInvObj.id, delta: 0 }));
            yield connection.close();
            if (input.barcode_data != null && input.barcode_data.use_auto_generated_barcode) {
                shopData["maximum_barcode_count"] = input.barcode_data.barcode_count;
                yield config_1.config.local_storage.set("shopemployeedata", shopData);
                return yield model_datatypes_1.LocalFullProductWithBarcodeDataTypeOut.parseAsync({
                    product_data: createdInvObj,
                    product_categorization: createdProductCatObj,
                    item_id: createdInvObj.id,
                    barcode_data: {
                        barcode: createdInvObj.barcode,
                        barcode_image_link: input.barcode_data.barcode_image_link,
                        barcode_count: input.barcode_data.barcode_count
                    }
                });
            }
            else {
                return yield model_datatypes_1.LocalFullProductWithBarcodeDataTypeOut.parseAsync({
                    product_data: createdInvObj,
                    product_categorization: createdProductCatObj,
                    item_id: createdInvObj.id
                });
            }
            ;
        }
        else {
            return {};
        }
        //Write search logic in neon bindings for this.
    })
});
exports.registerProductsForSupplierInvoicingEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.RegisterProductsForGRNDataType,
    output: express_zod_api_1.z.object({
        shop_id: express_zod_api_1.z.number().positive().int(),
        passbook_to_update_invoice: express_zod_api_1.z.object({
            vendor_invoice: express_zod_api_1.z.array(model_datatypes_1.RegisterGRNItemOut)
        })
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.get("shopemployeedata");
        if (!shopData["permission_add_inventory"]) {
            throw express_zod_api_1.createHttpError(405, "You do not have permission to add inventory.");
        }
        ;
        let shop_id = shopData["shop_id"];
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let grninvDAO = new sqlite3orm_1.BaseDAO(models_1.GRNItemDetailsDB, connection);
        let output_list = [];
        yield Promise.all(input.inventory_items.map((item) => __awaiter(void 0, void 0, void 0, function* () {
            let item_details = item.item_details;
            let grnItem = yield grninvDAO.insertPartial(Object.assign({ delta: 0, inventory_item_id_local: item.inventory_item_id, shop_id: shop_id }, item_details));
            output_list.push({
                inventory_item_id: item.inventory_item_id,
                units: item.units,
                free_quantity: item.free_quantity,
                grn_inventory_id: grnItem.local_id,
                discount_on_purchase: item.discount_on_purchase
            });
        })));
        yield connection.close();
        return {
            shop_id: shop_id,
            passbook_to_update_invoice: {
                vendor_invoice: output_list
            }
        };
    })
});
exports.editInventoryItemAndSaveBarcodeEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        itemID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        employeeID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)),
        item_data: model_datatypes_1.LocalInventoryUpdateDataTypeIn.optional().nullable(),
        barcode_data: model_datatypes_1.BarcodeDataType.optional().nullable()
    }),
    output: model_datatypes_1.LocalDetailedInventoryWithGeneratedBarcodeOut.or(express_zod_api_1.z.object({})),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_edit_inventory"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        if (input.barcode_data == undefined && input.item_data == undefined) {
            throw express_zod_api_1.createHttpError(406, "Please provide barcode_data or item_data.");
        }
        ;
        if (input.item_data != null) {
            if (input.barcode_data != undefined) {
                if (input.barcode_data.use_auto_generated_barcode && input.item_data == null) {
                    throw express_zod_api_1.createHttpError(406, "Provide item_data.");
                }
                ;
                if (shopData["maximum_barcode_count"] == null) {
                    shopData["maximum_barcode_count"] = 0;
                }
                ;
                if (shopData["maximum_barcode_count"] + 1 != input.barcode_data.barcode_count) {
                    throw express_zod_api_1.createHttpError(406, "Please try again, this barcode count is valid no more.");
                }
                ;
            }
            ;
            let connection = yield models_1.getConnection(config_1.config.database.db_file);
            let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
            yield OneInventoryItemDAO.updatePartialAll(Object.assign(Object.assign({}, input), { created_by: input.employeeID, delta: 1, last_touched: new Date() }), {
                id: input.itemID
            });
            let itemData = yield OneInventoryItemDAO.selectOne({ id: input.itemID });
            yield connection.close();
            itemData.item_id = input.itemID;
            if (input.barcode_data != null && input.barcode_data.use_auto_generated_barcode) {
                shopData["maximum_barcode_count"] = input.barcode_data.barcode_count;
                yield config_1.config.local_storage.set("shopemployeedata", shopData);
                return yield model_datatypes_1.LocalDetailedInventoryWithGeneratedBarcodeOut.parseAsync(Object.assign(Object.assign({}, itemData), { created_by_id: itemData.created_by, barcode_data: {
                        barcode: input.item_data.barcode,
                        barcode_count: input.barcode_data.barcode_count,
                        barcode_image_link: input.barcode_data.barcode_image_link
                    } }));
            }
            else {
                return yield model_datatypes_1.LocalDetailedInventoryWithGeneratedBarcodeOut.parseAsync(Object.assign(Object.assign({}, itemData), { created_by_id: itemData.created_by }));
            }
            ;
        }
        else {
            return {};
        }
    })
});
