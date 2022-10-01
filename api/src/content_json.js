"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blankInventoryJson = exports.ShoppingJsonType = exports.ShoppingJsonElementType = exports.PaymentModes = exports.Units = exports.advancedOrderTypes = void 0;
const express_zod_api_1 = require("express-zod-api");
exports.advancedOrderTypes = express_zod_api_1.z.enum(["NA"]);
exports.Units = express_zod_api_1.z.enum(["UNITS", "ML", "LITRE", "GRAM", "KILOGRAM"]);
exports.PaymentModes = express_zod_api_1.z.enum(["CASH", "DIGITAL_WALLET", "OOGA", "UPI", "CARD", "COUPON", "OTHERS", "UNKNOWN"]);
exports.ShoppingJsonElementType = express_zod_api_1.z.object({
    final_chosen: express_zod_api_1.z.object({
        item_id: express_zod_api_1.z.number().int().positive(),
        discount: express_zod_api_1.z.number().nonnegative(),
        quantity: express_zod_api_1.z.number().nonnegative(),
        unit_price: express_zod_api_1.z.number().nonnegative(),
        final_price: express_zod_api_1.z.number().nonnegative(),
        discountReason: express_zod_api_1.z.string().nullable().default(null)
    }),
    ai_outputs_item_ids: express_zod_api_1.z.array(express_zod_api_1.z.number().positive().int()).default([]),
    customer_input_text: express_zod_api_1.z.string().nullable().default(null),
    customer_input_picurl: express_zod_api_1.z.string().nullable().default(null),
    customer_input_barcode: express_zod_api_1.z.string().nullable().default(null),
    customer_input_speechurl: express_zod_api_1.z.string().nullable().default(null),
});
exports.ShoppingJsonType = express_zod_api_1.z.array(exports.ShoppingJsonElementType).or(express_zod_api_1.z.object({}));
exports.blankInventoryJson = { "inventory_items": [
        {
            "category": "Baby Care",
            "picurl": "/static/BabyCare.png",
            "item_ids": [],
            "category_number": 1,
        },
        {
            "category": "Breakfast & Dairy",
            "picurl": "/static/Breakfast_Dairy.png",
            "item_ids": [],
            "category_number": 2,
        },
        {
            "category": "Beverages",
            "picurl": "/static/Beverages.png",
            "item_ids": [],
            "category_number": 3,
        },
        {
            "category": "Foodgrains, Oil & Masala",
            "picurl": "/static/Grocery_Staples.png",
            "item_ids": [],
            "category_number": 4,
        },
        {
            "category": "Biscuits, Snacks & Chocolates",
            "picurl": "/static/Biscuits_Snacks_Chocolates.png",
            "item_ids": [],
            "category_number": 5,
        },
        {
            "category": "Fresh & Frozen Food",
            "picurl": "/static/Fresh_Frozen_Food.png",
            "item_ids": [],
            "category_number": 6,
        },
        {
            "category": "Books & Stationery",
            "picurl": "/static/Books_Stationery.png",
            "item_ids": [],
            "category_number": 7,
        },
        {
            "category": "Household Items",
            "picurl": "/static/Household_Items.png",
            "item_ids": [],
            "category_number": 8,
        },
        {
            "category": "Kitchen & Dining Items",
            "picurl": "/static/Kitchen_Dining.png",
            "item_ids": [],
            "category_number": 9,
        },
        {
            "category": "Noodles & Instant Food",
            "picurl": "/static/Noodles_Instant_Food.png",
            "item_ids": [],
            "category_number": 10,
        },
        {
            "category": "Personal Care",
            "picurl": "/static/Personal_Care.png",
            "item_ids": [],
            "category_number": 11,
        },
        {
            "category": "Pet Care",
            "picurl": "/static/Pet_Care.png",
            "item_ids": [],
            "category_number": 12,
        },
        {
            "category": "Pooja Needs",
            "picurl": "/static/Pooja_Needs.png",
            "item_ids": [],
            "category_number": 13,
        },
        {
            "category": "Fruits & Vegetables",
            "picurl": "/static/Fruits_Vegetables.png",
            "item_ids": [],
            "category_number": 14,
        }
    ],
    "processed": false,
    "ai_model_version_for_processing": null,
    "processed_file_version": 0,
    "latest_ai_data_files_link": null };
