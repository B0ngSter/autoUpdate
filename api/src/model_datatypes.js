"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocalCatalogItem = exports.LocalDetailedInventoryWithGeneratedBarcodeOut = exports.RegisterGRNItemOut = exports.RegisterProductsForGRNDataType = exports.GRNRegistraitionDataType = exports.GRNDataType = exports.LocalFullProductWithBarcodeDataTypeOut = exports.BarcodeDataType = exports.LocalItemAddToCategoryIN = exports.LocalDetailedItemsListOut = exports.ConfigurationDictForInvoices = exports.LocalInventoryUpdateDataTypeIn = exports.createHSNEntryReturnType = exports.createHSNEntryDataType = exports.GRNDetailsDataType = exports.LocalPaymentDataType = exports.LocalPaymentNotification = exports.LocalDetailedInventoryListOut = exports.LocalDetailedProductCategorizationOUt = exports.LocalDetailedInventoryOutput = exports.LocalFullProductDataTypeOut = exports.LocalFullProductDataTypeIN = exports.LocalProductCategorizationOut = exports.LocalProductCategorization = exports.LocalInventoryDataTypeIn = exports.LocalShopperDataTypeOut = exports.LocalShopVisitUpdatedInfoOut = exports.LocalShopVisitUpdateDataTypeIn = exports.LocalRelationshipDataTypeOut = exports.LocalRelationshipDataTypeIn = exports.LocalShopVisitDataTypeOut = exports.LocalShopVisitDataTypeIn = exports.ShopVisitDataType = exports.GeneralVisitDataTypeIn = exports.CheckShopperExistsReturnType = exports.ShopperDataType = exports.ShopperDataTypeIn = void 0;
const express_zod_api_1 = require("express-zod-api");
const content_json_1 = require("./content_json");
exports.ShopperDataTypeIn = express_zod_api_1.z.object({
    delta: express_zod_api_1.z.number().default(0),
    shopper_id: express_zod_api_1.z.number().positive().int().optional(),
    name: express_zod_api_1.z.string(),
    email: express_zod_api_1.z.string().email().optional(),
    phone_number: express_zod_api_1.z.string(),
    picurl: express_zod_api_1.z.string().optional(),
    payment_upi_account: express_zod_api_1.z.string().optional(),
    doc_uploaded: express_zod_api_1.z.boolean().optional(),
    verified_shopper: express_zod_api_1.z.boolean().optional(),
    created: express_zod_api_1.z.dateIn().optional(),
    last_touched: express_zod_api_1.z.dateIn().optional(),
    preferred_language: express_zod_api_1.z.string().optional(),
    address_line1: express_zod_api_1.z.string().optional(),
    address_line2: express_zod_api_1.z.string().optional(),
    address_city: express_zod_api_1.z.string().optional(),
    address_code: express_zod_api_1.z.string().optional()
});
exports.ShopperDataType = exports.ShopperDataTypeIn.strict().omit({
    created: true,
    last_touched: true
}).strict()
    .extend({
    id: express_zod_api_1.z.number().int(),
    created: express_zod_api_1.z.dateOut(),
    last_touched: express_zod_api_1.z.dateOut()
}).strict();
exports.CheckShopperExistsReturnType = express_zod_api_1.z.object({
    shopper_id: express_zod_api_1.z.number().positive().int(),
    created: express_zod_api_1.z.boolean().optional()
}).strict();
exports.GeneralVisitDataTypeIn = express_zod_api_1.z.object({
    delta: express_zod_api_1.z.number().default(0),
    visit_id: express_zod_api_1.z.number().int().positive().optional(),
    relationship_id_local: express_zod_api_1.z.number().int().positive(),
    payment_id_local: express_zod_api_1.z.number().int().optional(),
    shopping_json_local: content_json_1.ShoppingJsonType,
    shopping_json: content_json_1.ShoppingJsonType,
    discarded: express_zod_api_1.z.boolean().optional(),
    employee_id: express_zod_api_1.z.number().positive().int().optional(),
    advanced_order_type: content_json_1.advancedOrderTypes.default("NA"),
    shop_employee_driven_btc: express_zod_api_1.z.boolean().optional(),
    shop_employee_driven_btc_scan_completed: express_zod_api_1.z.boolean().optional(),
    created: express_zod_api_1.z.dateIn().optional(),
    last_touched: express_zod_api_1.z.dateIn().optional()
}).strict();
exports.ShopVisitDataType = exports.GeneralVisitDataTypeIn.strict().omit({
    created: true,
    last_touched: true
}).strict().extend({
    last_touched: express_zod_api_1.z.dateOut(),
    created: express_zod_api_1.z.dateOut(),
    id: express_zod_api_1.z.number().int().positive()
}).strict();
exports.LocalShopVisitDataTypeIn = express_zod_api_1.z.object({
    relationship_id: express_zod_api_1.z.number().int().positive(),
    visit: express_zod_api_1.z.object({
        shopping_json: content_json_1.ShoppingJsonType.default({}),
        discarded: express_zod_api_1.z.boolean().default(false),
        advanced_order_type: content_json_1.advancedOrderTypes.default("NA"),
        shop_employee_driven_btc: express_zod_api_1.z.boolean().optional().default(false),
        shop_employee_driven_btc_scan_completed: express_zod_api_1.z.boolean().default(false),
    }),
}).strict();
exports.LocalShopVisitDataTypeOut = express_zod_api_1.z.object({
    visit_id: express_zod_api_1.z.number().int().positive(),
    shopping_json: content_json_1.ShoppingJsonType,
    discarded: express_zod_api_1.z.boolean().optional(),
    advanced_order_type: content_json_1.advancedOrderTypes.default("NA"),
    shop_employee_driven_btc: express_zod_api_1.z.boolean().optional(),
    shop_employee_driven_btc_scan_completed: express_zod_api_1.z.boolean().optional(),
    created: express_zod_api_1.z.any().optional(),
    last_touched: express_zod_api_1.z.any().optional()
}).strict();
exports.LocalRelationshipDataTypeIn = express_zod_api_1.z.object({
    shop_id: express_zod_api_1.z.number().int().positive(),
    shopper_id: express_zod_api_1.z.number().int().positive(),
    relationship_data: express_zod_api_1.z.object({
        allow_self_checkout: express_zod_api_1.z.boolean().default(false),
        allow_pay_later: express_zod_api_1.z.boolean().default(false)
    })
}).strict();
exports.LocalRelationshipDataTypeOut = express_zod_api_1.z.object({
    relationship_id: express_zod_api_1.z.number().int().positive(),
    allow_self_checkout: express_zod_api_1.z.boolean().default(false),
    allow_pay_later: express_zod_api_1.z.boolean().default(false),
    created: express_zod_api_1.z.any().optional(),
    last_touched: express_zod_api_1.z.any().optional()
}).strict();
exports.LocalShopVisitUpdateDataTypeIn = express_zod_api_1.z.object({
    shopping_json: content_json_1.ShoppingJsonType,
    discarded: express_zod_api_1.z.boolean().optional(),
    advanced_order_type: content_json_1.advancedOrderTypes.default("NA"),
    shop_employee_driven_btc: express_zod_api_1.z.boolean().optional(),
    shop_employee_driven_btc_scan_completed: express_zod_api_1.z.boolean().optional(),
    employee_id: express_zod_api_1.z.number().int().positive().optional()
});
exports.LocalShopVisitUpdatedInfoOut = exports.LocalShopVisitDataTypeOut.extend({
    employee_id: express_zod_api_1.z.number().int().positive(),
    payment_id: express_zod_api_1.z.number().int().positive(),
    shop_id: express_zod_api_1.z.number().int().positive(),
    shop_creation_employee_number: express_zod_api_1.z.string(),
    shop_employee_shopowner: express_zod_api_1.z.boolean(),
    shopper_phone: express_zod_api_1.z.string(),
    shop_name: express_zod_api_1.z.string()
});
exports.LocalShopperDataTypeOut = exports.ShopperDataTypeIn.omit({
    created: true,
    last_touched: true,
    shopper_id: true,
    delta: true
})
    .extend({
    created: express_zod_api_1.z.any(),
    last_touched: express_zod_api_1.z.any()
});
exports.LocalInventoryDataTypeIn = express_zod_api_1.z.object({
    name: express_zod_api_1.z.string(),
    brand: express_zod_api_1.z.string().optional(),
    quantity: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number()),
    units: content_json_1.Units.default("UNITS"),
    unit_price: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number().nonnegative()),
    unit_price_currency: express_zod_api_1.z.string().default("INR"),
    selling_price: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number().nonnegative()).optional(),
    discount: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number().nonnegative()),
    picurl: express_zod_api_1.z.string().optional(),
    barcode: express_zod_api_1.z.string().optional(),
    disabled: express_zod_api_1.z.boolean().default(false),
    stock: express_zod_api_1.z.number().optional(),
    expiry_date: express_zod_api_1.z.dateIn().optional().nullable().transform(val => {
        if (val === null) {
            return undefined;
        }
        else {
            return val;
        }
    }),
    catalog_connection: express_zod_api_1.z.number().optional().nullable().transform(val => {
        if (val === null) {
            return undefined;
        }
        else {
            return val;
        }
    })
});
exports.LocalProductCategorization = express_zod_api_1.z.object({
    subcategory: express_zod_api_1.z.string().optional(),
    subsubcategory: express_zod_api_1.z.string().optional(),
    essential_item: express_zod_api_1.z.boolean().optional()
});
exports.LocalProductCategorizationOut = express_zod_api_1.z.object({
    categorization_id: express_zod_api_1.z.number().int().positive(),
    subcategory: express_zod_api_1.z.string().optional(),
    subsubcategory: express_zod_api_1.z.string().optional(),
    essential_item: express_zod_api_1.z.boolean().optional()
});
exports.LocalFullProductDataTypeIN = express_zod_api_1.z.object({
    product_data: exports.LocalInventoryDataTypeIn,
    product_categorization: exports.LocalProductCategorization
});
exports.LocalFullProductDataTypeOut = express_zod_api_1.z.object({
    product_data: exports.LocalInventoryDataTypeIn.omit({
        expiry_date: true
    }).extend({
        expiry_date: express_zod_api_1.z.any()
    }),
    product_categorization: exports.LocalProductCategorization,
    item_id: express_zod_api_1.z.number().int().positive()
});
exports.LocalDetailedInventoryOutput = exports.LocalInventoryDataTypeIn.omit({
    expiry_date: true
}).extend({
    item_id: express_zod_api_1.z.number().int().positive(),
    created_by_id: express_zod_api_1.z.number().int().positive().optional(),
    created: express_zod_api_1.z.any(),
    last_touched: express_zod_api_1.z.any(),
    expiry_date: express_zod_api_1.z.any()
});
exports.LocalDetailedProductCategorizationOUt = exports.LocalProductCategorization.extend({
    categorization_id: express_zod_api_1.z.number().positive().int(),
    inventory_item_id: express_zod_api_1.z.number().int().positive(),
    catalog_connection: express_zod_api_1.z.number().int().positive().optional()
});
exports.LocalDetailedInventoryListOut = express_zod_api_1.z.array(express_zod_api_1.z.object({
    sno: express_zod_api_1.z.number().int().nonnegative(),
    item_details: exports.LocalDetailedInventoryOutput,
    item_classification: express_zod_api_1.z.array(exports.LocalDetailedProductCategorizationOUt)
}).optional().nullable());
exports.LocalPaymentNotification = express_zod_api_1.z.object({
    payment_id: express_zod_api_1.z.number().int().positive(),
    visit_id: express_zod_api_1.z.number().int().positive(),
    timestamp: express_zod_api_1.z.string(),
    success: express_zod_api_1.z.boolean(),
    mode: content_json_1.PaymentModes.default("UNKNOWN")
});
exports.LocalPaymentDataType = express_zod_api_1.z.object({
    payment_id: express_zod_api_1.z.number().int().positive(),
    payment_complete: express_zod_api_1.z.boolean(),
    payment_defer: express_zod_api_1.z.boolean(),
    auto_payment_confirm: express_zod_api_1.z.boolean(),
    payment_verified: express_zod_api_1.z.boolean(),
    mode: content_json_1.PaymentModes,
    created: express_zod_api_1.z.any(),
    last_touched: express_zod_api_1.z.any()
});
exports.GRNDetailsDataType = express_zod_api_1.z.object({
    purchase_rate: express_zod_api_1.z.number().nonnegative(),
    price_currency: express_zod_api_1.z.string().default("INR"),
    sgst_rate: express_zod_api_1.z.number().nonnegative(),
    cgst_rate: express_zod_api_1.z.number().nonnegative(),
    inventory_item_id: express_zod_api_1.z.number().int().positive()
});
exports.createHSNEntryDataType = express_zod_api_1.z.object({
    shop_id: express_zod_api_1.z.number().int().positive(),
    grn_data: exports.GRNDetailsDataType
});
exports.createHSNEntryReturnType = exports.GRNDetailsDataType.extend({
    created: express_zod_api_1.z.any(),
    last_touched: express_zod_api_1.z.any(),
    id: express_zod_api_1.z.number().int().positive()
});
exports.LocalInventoryUpdateDataTypeIn = express_zod_api_1.z.object({
    name: express_zod_api_1.z.string().optional(),
    brand: express_zod_api_1.z.string().optional(),
    quantity: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number()).optional(),
    units: content_json_1.Units.optional(),
    unit_price: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number()).optional(),
    unit_price_currency: express_zod_api_1.z.string().optional(),
    selling_price: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number()).optional(),
    discount: express_zod_api_1.z.string().transform(val => parseFloat(val)).or(express_zod_api_1.z.number()).optional(),
    picurl: express_zod_api_1.z.string().optional(),
    barcode: express_zod_api_1.z.string().optional(),
    disabled: express_zod_api_1.z.boolean().optional(),
    stock: express_zod_api_1.z.number().optional(),
    expiry_date: express_zod_api_1.z.dateIn().optional().nullable().transform(val => {
        if (val === null) {
            return undefined;
        }
        else {
            return val;
        }
    }),
    catalog_connection: express_zod_api_1.z.number().optional().nullable().transform(val => {
        if (val === null) {
            return undefined;
        }
        else {
            return val;
        }
    })
});
exports.ConfigurationDictForInvoices = express_zod_api_1.z.object({
    rounded_off: express_zod_api_1.z.boolean().default(false),
    show_invoice_number: express_zod_api_1.z.boolean().default(true)
});
exports.LocalDetailedItemsListOut = express_zod_api_1.z.array(express_zod_api_1.z.object({
    sno: express_zod_api_1.z.number().int().nonnegative(),
    item_details: exports.LocalDetailedInventoryOutput,
    item_classification: express_zod_api_1.z.array(exports.LocalDetailedProductCategorizationOUt),
    item_oogadiscount: express_zod_api_1.z.array(express_zod_api_1.z.any())
}));
exports.LocalItemAddToCategoryIN = express_zod_api_1.z.object({
    shopID: express_zod_api_1.z.number().int().positive(),
    inventory_item_id: express_zod_api_1.z.number().int().positive(),
    category_number: express_zod_api_1.z.number().int().positive()
});
exports.BarcodeDataType = express_zod_api_1.z.object({
    use_auto_generated_barcode: express_zod_api_1.z.boolean(),
    barcode_image_link: express_zod_api_1.z.string(),
    barcode_count: express_zod_api_1.z.number()
});
exports.LocalFullProductWithBarcodeDataTypeOut = express_zod_api_1.z.object({
    product_data: exports.LocalInventoryDataTypeIn.omit({
        expiry_date: true
    }).extend({
        expiry_date: express_zod_api_1.z.any()
    }),
    product_categorization: exports.LocalProductCategorization,
    item_id: express_zod_api_1.z.number().int().positive().optional(),
    barcode_data: express_zod_api_1.z.object({
        barcode_image_link: express_zod_api_1.z.string(),
        barcode: express_zod_api_1.z.string(),
        barcode_count: express_zod_api_1.z.number()
    }).optional()
});
exports.GRNDataType = express_zod_api_1.z.object({
    purchase_rate: express_zod_api_1.z.number().nonnegative(),
    price_currency: express_zod_api_1.z.string().default("INR"),
    sgst_rate: express_zod_api_1.z.number().nonnegative(),
    cgst_rate: express_zod_api_1.z.number().nonnegative()
});
exports.GRNRegistraitionDataType = express_zod_api_1.z.object({
    inventory_item_id: express_zod_api_1.z.number().int().positive(),
    item_details: exports.GRNDataType,
    units: express_zod_api_1.z.number(),
    free_quantity: express_zod_api_1.z.number().optional(),
    mrp: express_zod_api_1.z.number(),
    discount_on_mrp: express_zod_api_1.z.number(),
    discount_on_purchase: express_zod_api_1.z.number(),
    final_amount: express_zod_api_1.z.number().optional().nullable()
});
exports.RegisterProductsForGRNDataType = express_zod_api_1.z.object({
    shop_id: express_zod_api_1.z.number().int().positive(),
    inventory_items: express_zod_api_1.z.array(exports.GRNRegistraitionDataType)
});
exports.RegisterGRNItemOut = express_zod_api_1.z.object({
    inventory_item_id: express_zod_api_1.z.number().positive().int(),
    units: express_zod_api_1.z.number(),
    free_quantity: express_zod_api_1.z.number().optional(),
    grn_inventory_id: express_zod_api_1.z.number().positive().int(),
    discount_on_purchase: express_zod_api_1.z.number()
});
exports.LocalDetailedInventoryWithGeneratedBarcodeOut = exports.LocalDetailedInventoryOutput.extend({
    barcode_data: express_zod_api_1.z.object({
        barcode_image_link: express_zod_api_1.z.string(),
        barcode: express_zod_api_1.z.string(),
        barcode_count: express_zod_api_1.z.number()
    }).optional()
});
exports.LocalCatalogItem = express_zod_api_1.z.object({
    name: express_zod_api_1.z.string(),
    brand: express_zod_api_1.z.string(),
    unit_price: express_zod_api_1.z.number(),
    unit_price_currency: express_zod_api_1.z.string(),
    quantity: express_zod_api_1.z.number(),
    units: express_zod_api_1.z.string(),
    barcode: express_zod_api_1.z.string(),
    category_number: express_zod_api_1.z.number(),
    item_id: express_zod_api_1.z.number(),
    created: express_zod_api_1.z.any().default(null),
    last_touched: express_zod_api_1.z.any().default(null)
});