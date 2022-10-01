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
exports.showOogaDiscountEndPoint = exports.dummyService = exports.notifyPaymentStatusEndPoint = exports.setUserForKhataEndPoint = exports.getUserByIDEndPoint = exports.discardVisitEndPoint = exports.updateVisitEndPoint = exports.createVisitEndPoint = exports.createOrRetrieveRelationshipEndpoint = exports.checkIfConsumerExistsOrCreateEndPoint = void 0;
const model_datatypes_1 = require("./model_datatypes");
const models_1 = require("./models");
const sqlite3orm_1 = require("sqlite3orm");
const config_1 = require("./config");
const custom_result_handler_1 = require("./custom_result_handler");
const express_zod_api_1 = require("express-zod-api");
exports.checkIfConsumerExistsOrCreateEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        phone_number: express_zod_api_1.z.string().min(10)
    }).strict(),
    output: model_datatypes_1.CheckShopperExistsReturnType,
    handler: ({ input, options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let ShopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
        try {
            let user = yield ShopperDAO.selectOne({ phone_number: input.phone_number });
            yield connection.close();
            return yield model_datatypes_1.CheckShopperExistsReturnType.parseAsync({ shopper_id: user.id });
        }
        catch (_a) {
            let input_data = yield model_datatypes_1.ShopperDataTypeIn.parseAsync({ phone_number: input.phone_number, name: input.phone_number });
            let user = yield ShopperDAO.insertPartial(input_data);
            yield connection.close();
            return yield model_datatypes_1.CheckShopperExistsReturnType.parseAsync({ shopper_id: user.id, created: true });
        }
        ;
    })
});
exports.createOrRetrieveRelationshipEndpoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.LocalRelationshipDataTypeIn,
    output: model_datatypes_1.LocalRelationshipDataTypeOut,
    handler: ({ input, options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let RelationshipDAO = new sqlite3orm_1.BaseDAO(models_1.ShopShopperRelationshipDB, connection);
        let relationship_data;
        try {
            relationship_data = yield RelationshipDAO.selectOne({ shop_id_local: input.shop_id, shopper_id_local: input.shopper_id });
        }
        catch (_b) {
            let relationship = new models_1.ShopShopperRelationshipDB();
            relationship.delta = 0;
            relationship.shop_id_local = input.shop_id;
            relationship.shopper_id_local = input.shopper_id;
            relationship.allow_pay_later = input.relationship_data.allow_pay_later;
            relationship.allow_self_checkout = input.relationship_data.allow_self_checkout;
            let relationship_created = yield RelationshipDAO.insertPartial(relationship);
            relationship_data = yield RelationshipDAO.selectOne({ id: relationship_created.id });
        }
        yield connection.close();
        return yield model_datatypes_1.LocalRelationshipDataTypeOut.parseAsync({
            relationship_id: relationship_data.id,
            allow_pay_later: relationship_data.allow_pay_later,
            allow_self_checkout: relationship_data.allow_self_checkout,
            created: relationship_data.created,
            last_touched: relationship_data.last_touched
        });
    })
});
exports.createVisitEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.LocalShopVisitDataTypeIn,
    output: model_datatypes_1.LocalShopVisitDataTypeOut,
    handler: ({ input, options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let payment_obj = new models_1.PaymentDB();
        payment_obj.payment_complete = false,
            payment_obj.relationship_id_local = input.relationship_id;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let PaymentDAO = new sqlite3orm_1.BaseDAO(models_1.PaymentDB, connection);
        let payment_obj1 = yield PaymentDAO.insertPartial(payment_obj);
        let visit = {
            shopping_json_local: input.visit.shopping_json,
            relationship_id_local: input.relationship_id,
            payment_id_local: payment_obj1.id,
            employee_id: shopData["employee_id"],
            advanced_order_type: input.visit.advanced_order_type,
            shop_employee_driven_btc: input.visit.shop_employee_driven_btc,
            shop_employee_driven_btc_scan_completed: input.visit.shop_employee_driven_btc_scan_completed,
            discarded: input.visit.discarded
        };
        let VisitDAO = new sqlite3orm_1.BaseDAO(models_1.ShopVisitDB, connection);
        let visit_created = yield VisitDAO.insertPartial(visit);
        yield PaymentDAO.updatePartialAll({ visit_id_local: visit_created.id }, { id: { eq: payment_obj1.id } });
        let visit_obj = yield VisitDAO.selectOne({ id: visit_created.id });
        yield connection.close();
        return yield model_datatypes_1.LocalShopVisitDataTypeOut.parseAsync({
            visit_id: visit_obj.id,
            shopping_json: visit_obj.shopping_json_local,
            discarded: visit_obj.discarded,
            advanced_order_type: visit_obj.advanced_order_type,
            shop_employee_driven_btc: visit_obj.shop_employee_driven_btc,
            shop_employee_driven_btc_scan_completed: visit_obj.shop_employee_driven_btc_scan_completed,
            created: visit_obj.created,
            last_touched: visit_obj.last_touched
        });
    })
});
exports.updateVisitEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)), //Local visit id passed as query parameter.
    }).strict().merge(model_datatypes_1.LocalShopVisitUpdateDataTypeIn.strict()),
    output: express_zod_api_1.z.object({
        Message: express_zod_api_1.z.string(),
        visit_info: express_zod_api_1.z.array(model_datatypes_1.LocalShopVisitUpdatedInfoOut)
    }),
    handler: ({ input, options, logger }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        if (input.visitID == null) {
            throw express_zod_api_1.createHttpError(500, "Please pass visit_id");
        }
        if (input.shop_employee_driven_btc == null) {
            input.shop_employee_driven_btc = false;
        }
        ;
        if (input.shop_employee_driven_btc_scan_completed == null) {
            input.shop_employee_driven_btc_scan_completed = false;
        }
        ;
        //checking if live order or advanced order.
        if ((!input.shop_employee_driven_btc) && (input.advanced_order_type == "NA")) {
            throw express_zod_api_1.createHttpError(409, "Please set it as live order.");
        }
        ;
        //Advanced orders not implementing in offline.
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let VisitDAO = new sqlite3orm_1.BaseDAO(models_1.ShopVisitDB, connection);
        let visit_id_local = input.visitID;
        let existing_visit_data = yield VisitDAO.selectOne({
            select: { visit_id: true, relationship_id_local: true },
            where: { id: { eq: visit_id_local } }
        });
        let delta;
        if (!existing_visit_data.visit_id) {
            delta = 0;
        }
        else {
            delta = 1;
        }
        ;
        let shopping_json_local = input.shopping_json;
        let inputVisitType = model_datatypes_1.LocalShopVisitUpdateDataTypeIn.extend({
            last_touched: express_zod_api_1.z.any(),
            delta: express_zod_api_1.z.number(),
            shopping_json_local: express_zod_api_1.z.any()
        }).omit({
            shopping_json: true
        });
        let visit = yield inputVisitType.parseAsync(Object.assign(Object.assign({}, input), { last_touched: new Date(), delta: delta, shopping_json_local: shopping_json_local }));
        yield VisitDAO.updatePartialAll(visit, { id: { eq: visit_id_local } });
        let updated_visit = yield VisitDAO.selectOne({
            select: {
                shopping_json: true,
                payment_id_local: true,
                discarded: true,
                shop_employee_driven_btc: true,
                shop_employee_driven_btc_scan_completed: true,
                created: true,
                last_touched: true,
                employee_id: true
            },
            where: {
                id: visit_id_local
            }
        });
        let RelationshipDAO = new sqlite3orm_1.BaseDAO(models_1.ShopShopperRelationshipDB, connection);
        let shopperDetailsArr = yield RelationshipDAO.selectParentOf("fk_shopper_local_ids", models_1.ShopperDB, yield RelationshipDAO.selectOne({ id: existing_visit_data.relationship_id_local }));
        let payment_id = updated_visit.payment_id_local;
        yield connection.close();
        return {
            "Message": "Visit Updated",
            visit_info: [yield model_datatypes_1.LocalShopVisitUpdatedInfoOut.parseAsync({
                    visit_id: visit_id_local,
                    payment_id: payment_id,
                    shop_id: shopData["shop_id"],
                    shop_name: shopData["shop_name"],
                    shop_creation_employee_number: shopData["phone_number"],
                    shop_employee_shopowner: shopData["level_shopowner"],
                    shopper_phone: shopperDetailsArr.phone_number,
                    shopping_json: updated_visit.shopping_json_local,
                    discarded: updated_visit.discarded,
                    advanced_order_type: updated_visit.advanced_order_type,
                    shop_employee_driven_btc: updated_visit.shop_employee_driven_btc,
                    shop_employee_driven_btc_scan_completed: updated_visit.shop_employee_driven_btc_scan_completed,
                    created: updated_visit.created,
                    last_touched: updated_visit.last_touched,
                    employee_id: updated_visit.employee_id
                })]
        };
    })
});
exports.discardVisitEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "get",
    input: express_zod_api_1.z.object({
        visit_id: express_zod_api_1.z.string().transform((value) => parseInt(value, 10))
    }),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let VisitDAO = new sqlite3orm_1.BaseDAO(models_1.ShopVisitDB, connection);
        yield VisitDAO.updatePartialAll({
            discarded: true,
            last_touched: new Date()
        }, { id: input.visit_id });
        yield connection.close();
        return { success: true };
    })
});
exports.getUserByIDEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "get",
    input: express_zod_api_1.z.object({
        userID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10))
    }),
    output: model_datatypes_1.LocalShopperDataTypeOut,
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let ShopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
        let shopper = yield ShopperDAO.selectOne({
            id: input.userID
        });
        yield connection.close();
        return yield model_datatypes_1.LocalShopperDataTypeOut.parseAsync(shopper);
    })
});
exports.setUserForKhataEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: express_zod_api_1.z.object({
        phoneNumber: express_zod_api_1.z.string(),
        consumerName: express_zod_api_1.z.string()
    }),
    output: express_zod_api_1.z.object({
        success: express_zod_api_1.z.boolean()
    }),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let ShopperDAO = new sqlite3orm_1.BaseDAO(models_1.ShopperDB, connection);
        yield ShopperDAO.updatePartialAll({
            name: input.consumerName
        }, {
            phone_number: input.phoneNumber
        });
        yield connection.close();
        return { success: true };
    })
});
exports.notifyPaymentStatusEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "post",
    input: model_datatypes_1.LocalPaymentNotification.extend({
        employeeID: express_zod_api_1.z.string().transform((value) => parseInt(value, 10)).optional(),
    }),
    output: model_datatypes_1.LocalPaymentDataType,
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        let shopData = yield config_1.config.local_storage.getItem("shopemployeedata");
        if (!shopData["permission_serve_customers"]) {
            throw express_zod_api_1.createHttpError(405);
        }
        ;
        let connection = yield models_1.getConnection(config_1.config.database.db_file);
        let PaymentDAO = new sqlite3orm_1.BaseDAO(models_1.PaymentDB, connection);
        yield PaymentDAO.updatePartialAll({
            payment_verified: true,
            payment_complete: input.success,
            mode: input.mode,
            delta: 1,
            last_touched: new Date()
        }, {
            id: input.payment_id
        });
        if (input.success) {
            let VisitDAO = new sqlite3orm_1.BaseDAO(models_1.ShopVisitDB, connection);
            let visitObj = yield VisitDAO.selectOne({ id: input.visit_id });
            let OneInventoryItemDAO = new sqlite3orm_1.BaseDAO(models_1.OneInventoryItemDB, connection);
            let shopping_json = visitObj.shopping_json_local;
            yield Promise.all(shopping_json.map((item) => __awaiter(void 0, void 0, void 0, function* () {
                let item_id_local = item.final_chosen.item_id;
                let quantity = item.final_chosen.quantity;
                let invObj = yield OneInventoryItemDAO.selectOne({ id: item_id_local });
                let stock = invObj.stock;
                let newStock;
                if (stock < 0) {
                    newStock = stock;
                }
                else {
                    newStock = stock - quantity;
                }
                yield OneInventoryItemDAO.updatePartialAll({
                    stock: newStock,
                    last_touched: new Date(),
                    delta: 1
                }, {
                    id: item_id_local
                });
            })));
        }
        ;
        let updatedPaymentObj = yield PaymentDAO.selectOne({ id: input.payment_id });
        yield connection.close();
        return yield model_datatypes_1.LocalPaymentDataType.parseAsync({
            payment_id: updatedPaymentObj.id,
            payment_complete: updatedPaymentObj.payment_complete,
            payment_defer: updatedPaymentObj.payment_defer,
            auto_payment_confirm: updatedPaymentObj.auto_payment_confirm,
            payment_verified: updatedPaymentObj.payment_verified,
            mode: updatedPaymentObj.mode,
            created: updatedPaymentObj.created,
            last_touched: updatedPaymentObj.last_touched
        });
    })
});
exports.dummyService = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "get",
    input: express_zod_api_1.z.object({}),
    output: express_zod_api_1.z.object({}),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("In Service");
        return {};
    })
});
exports.showOogaDiscountEndPoint = custom_result_handler_1.aistoreEndpointsFactory.build({
    method: "get",
    input: express_zod_api_1.z.object({
        visitID: express_zod_api_1.z.string().transform((val) => parseInt(val, 10))
    }),
    output: express_zod_api_1.z.object({}).passthrough(),
    handler: ({ input }) => __awaiter(void 0, void 0, void 0, function* () {
        return { "ooga_discount": [], "surprise_gift": [] };
    })
});
//Removing autogenerate barcode for now.
// export const generateBarcodeEndPoint = aistoreEndpointsFactory.build({
//     method: "get",
//     input: z.object({}),
//     output: z.object({
//         barcode: z.string(),
//         barcode_link: z.string(),
//         barcode_count: z.number()
//     }),
//     handler: async ({input})=>{
//         let shopData = await config.local_storage.get("shopemployeedata");
//         let max_bar_count = shopData["maximum_barcode_count"];
//         if (max_bar_count===null || max_bar_count===undefined){
//             max_bar_count = 0
//         };
//         let canvas = new Canvas(80, 50, "image");
//         let barcode: string = "0064-"+String(max_bar_count+1)
//         JsBarcode(canvas, barcode, {
//             format: "CODE39"
//         });
//         let filename: string = "barcode"+ String(max_bar_count+1) +".png"
//         try{
//             fs.writeFileSync(config.filepaths.barcodes.filedir+"/"+filename, canvas.toBuffer())
//         } catch {
//             throw createHttpError(500, "failed to create barcode.")
//         };
//         return {barcode: barcode, barcode_link: config.filepaths.barcodes.filelink+"/"+filename, barcode_count: max_bar_count+1}
//     }
// });
// export const getGeneratedBarcodeForItemEndPoint = aistoreEndpointsFactory.build({
//     method:"get",
//     input: z.object({
//         item_id: z.string().transform((val)=>parseInt(val, 10))
//     }),
//     output: z.object({
//         item_id: z.number(),
//         barcode: z.any(),
//         barcode_image_link: z.string()
//     }), 
//     handler: async ({input})=>{
//         let connection = await getConnection(config.database.db_file);
//         let invDAO = new BaseDAO(OneInventoryItemDB, connection);
//         let item = await invDAO.selectOne({id: input.item_id});
//         let barcode = item.barcode;
//         if (! barcode.startsWith("0064-")){
//             throw createHttpError(406, "This item has not autogenerated barcode.")
//         }
//         let barcode_count = barcode.slice(5);
//         let filename = "barcode"+barcode_count+".png"
//         if (! fs.existsSync(config.filepaths.barcodes.filedir+"/"+filename)){
//             let canvas = new Canvas(80, 50, "image");
//             JsBarcode(canvas, barcode, {
//                 format: "CODE39"
//             });
//             try{
//                 fs.writeFileSync(config.filepaths.barcodes.filedir+"/"+filename, canvas.toBuffer())
//             } catch {
//                 throw createHttpError(500, "failed to create barcode.")
//             };
//         }
//         return {
//             barcode: barcode,
//             barcode_image_link: config.filepaths.barcodes.filelink+"/"+filename,
//             item_id: item.id
//         }
//     }
// })
