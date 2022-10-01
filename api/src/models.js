"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.createIfDontExist = exports.getConnection = exports.GRNItemDetailsDB = exports.ProductCategorizationDB = exports.OneInventoryItemDB = exports.ShopVisitDB = exports.PaymentDB = exports.ShopShopperRelationshipDB = exports.ShopperDB = void 0;
const sqlite3orm_1 = require("sqlite3orm");
// one row of the following tables is saved in persist, not a db table : shopdb, shopemployeedb, shopgrndetailsdb, 
let ShopperDB = class ShopperDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], ShopperDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_shopper_deltas'),
    __metadata("design:type", Number)
], ShopperDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shopper_id', dbtype: 'INTEGER UNIQUE' }),
    sqlite3orm_1.index('idx_shopper_ids'),
    __metadata("design:type", Number)
], ShopperDB.prototype, "shopper_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'name', dbtype: 'TEXT NOT NULL' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "name", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'email', dbtype: 'TEXT' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "email", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'phone_number', dbtype: 'TEXT NOT NULL UNIQUE' }),
    sqlite3orm_1.index('idx_shopper_phone_numbers'),
    __metadata("design:type", String)
], ShopperDB.prototype, "phone_number", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'picurl', dbtype: 'TEXT DEFAULT \'\'' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "picurl", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'payment_upi_account', dbtype: 'TEXT DEFAULT \'\'' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "payment_upi_account", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'doc_uploaded', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ShopperDB.prototype, "doc_uploaded", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'verified_shopper', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ShopperDB.prototype, "verified_shopper", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], ShopperDB.prototype, "created", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'last_touched', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], ShopperDB.prototype, "last_touched", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'preferred_language', dbtype: 'TEXT DEFAULT \'English\'' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "preferred_language", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'address_line1', dbtype: 'TEXT' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "address_line1", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'address_line2', dbtype: 'TEXT' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "address_line2", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'address_city', dbtype: 'TEXT' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "address_city", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'address_code', dbtype: 'TEXT' }),
    __metadata("design:type", String)
], ShopperDB.prototype, "address_code", void 0);
ShopperDB = __decorate([
    sqlite3orm_1.table({ name: "shopperdb_local", autoIncrement: true })
], ShopperDB);
exports.ShopperDB = ShopperDB;
let ShopShopperRelationshipDB = class ShopShopperRelationshipDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], ShopShopperRelationshipDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_relationship_deltas'),
    __metadata("design:type", Number)
], ShopShopperRelationshipDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'relationship_id', dbtype: 'INTEGER UNIQUE' }),
    sqlite3orm_1.index('idx_relationship_ids'),
    __metadata("design:type", Number)
], ShopShopperRelationshipDB.prototype, "relationship_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], ShopShopperRelationshipDB.prototype, "created", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'last_touched', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], ShopShopperRelationshipDB.prototype, "last_touched", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shop_id', dbtype: 'INTEGER' }),
    __metadata("design:type", Number)
], ShopShopperRelationshipDB.prototype, "shop_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shopper_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_shopper_local_ids', 'shopperdb_local', 'local_id'),
    sqlite3orm_1.index('idx_relationship_shopper_ids_local'),
    __metadata("design:type", Number)
], ShopShopperRelationshipDB.prototype, "shopper_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shopper_id', dbtype: 'INTEGER' }),
    sqlite3orm_1.index('idx_relationship_shopper_ids'),
    __metadata("design:type", Number)
], ShopShopperRelationshipDB.prototype, "shopper_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'allow_self_checkout', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ShopShopperRelationshipDB.prototype, "allow_self_checkout", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'allow_pay_later', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ShopShopperRelationshipDB.prototype, "allow_pay_later", void 0);
ShopShopperRelationshipDB = __decorate([
    sqlite3orm_1.table({ name: "shopshopperrelationshipdb_local", autoIncrement: true })
], ShopShopperRelationshipDB);
exports.ShopShopperRelationshipDB = ShopShopperRelationshipDB;
let PaymentDB = class PaymentDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], PaymentDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_payment_deltas'),
    __metadata("design:type", Number)
], PaymentDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'payment_id', dbtype: 'TEXT UNIQUE' }),
    sqlite3orm_1.index('idx_payment_ids'),
    __metadata("design:type", String)
], PaymentDB.prototype, "payment_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'payment_complete', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], PaymentDB.prototype, "payment_complete", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'payment_defer', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], PaymentDB.prototype, "payment_defer", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'auto_payment_confirm', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], PaymentDB.prototype, "auto_payment_confirm", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'payment_verified', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], PaymentDB.prototype, "payment_verified", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'relationship_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_relationship_local_ids', 'shopshopperrelationshipdb_local', 'local_id'),
    sqlite3orm_1.index('idx_payment_relationship_ids_local'),
    __metadata("design:type", Number)
], PaymentDB.prototype, "relationship_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'visit_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_visit_local_ids', 'shopvisitdb_local', 'local_id'),
    sqlite3orm_1.index('idx_payment_visit_ids_local'),
    __metadata("design:type", Number)
], PaymentDB.prototype, "visit_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'mode', dbtype: 'TEXT NOT NULL DEFAULT \'UNKNOWN\'' }),
    __metadata("design:type", String)
], PaymentDB.prototype, "mode", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], PaymentDB.prototype, "created", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'last_touched', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], PaymentDB.prototype, "last_touched", void 0);
PaymentDB = __decorate([
    sqlite3orm_1.table({ name: "paymentdb_local", autoIncrement: true })
], PaymentDB);
exports.PaymentDB = PaymentDB;
let ShopVisitDB = class ShopVisitDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], ShopVisitDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_visit_deltas'),
    __metadata("design:type", Number)
], ShopVisitDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'visit_id', dbtype: 'INTEGER UNIQUE' }),
    sqlite3orm_1.index('idx_visit_ids'),
    __metadata("design:type", Number)
], ShopVisitDB.prototype, "visit_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'relationship_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_relationship_local_ids', 'shopshopperrelationshipdb_local', 'local_id'),
    sqlite3orm_1.index('idx_relationship_ids_local'),
    __metadata("design:type", Number)
], ShopVisitDB.prototype, "relationship_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'payment_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_payment_local_ids', 'paymentdb_local', 'local_id'),
    sqlite3orm_1.index('idx_payment_ids_local'),
    __metadata("design:type", Number)
], ShopVisitDB.prototype, "payment_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shopping_json_local', dbtype: 'TEXT DEFAULT \'{}\'', isJson: true }),
    __metadata("design:type", Object)
], ShopVisitDB.prototype, "shopping_json_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shopping_json', dbtype: 'TEXT DEFAULT \'{}\'', isJson: true }),
    __metadata("design:type", Object)
], ShopVisitDB.prototype, "shopping_json", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'discarded', dbtype: "INTEGER NOT NULL DEFAULT 1" }),
    __metadata("design:type", Boolean)
], ShopVisitDB.prototype, "discarded", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'employee_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], ShopVisitDB.prototype, "employee_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'advanced_order_type', dbtype: 'TEXT DEFAULT \'NA\'' }),
    __metadata("design:type", String)
], ShopVisitDB.prototype, "advanced_order_type", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shop_employee_driven_btc', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ShopVisitDB.prototype, "shop_employee_driven_btc", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shop_employee_driven_btc_scan_completed', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ShopVisitDB.prototype, "shop_employee_driven_btc_scan_completed", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], ShopVisitDB.prototype, "created", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'last_touched', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], ShopVisitDB.prototype, "last_touched", void 0);
ShopVisitDB = __decorate([
    sqlite3orm_1.table({ name: "shopvisitdb_local", autoIncrement: true })
], ShopVisitDB);
exports.ShopVisitDB = ShopVisitDB;
let OneInventoryItemDB = class OneInventoryItemDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_inventory_deltas'),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'name', dbtype: 'TEXT NOT NULL' }),
    __metadata("design:type", String)
], OneInventoryItemDB.prototype, "name", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'brand', dbtype: 'TEXT' }),
    __metadata("design:type", String)
], OneInventoryItemDB.prototype, "brand", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'quantity', dbtype: 'REAL NOT NULL' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "quantity", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'units', dbtype: 'TEXT NOT NULL' }),
    __metadata("design:type", String)
], OneInventoryItemDB.prototype, "units", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'unit_price', dbtype: 'REAL NOT NULL' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "unit_price", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'unit_price_currency', dbtype: 'TEXT NOT NULL' }),
    __metadata("design:type", String)
], OneInventoryItemDB.prototype, "unit_price_currency", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'discount', dbtype: 'REAL NOT NULL' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "discount", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'selling_price', dbtype: 'REAL' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "selling_price", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'picurl', dbtype: 'TEXT NOT NULL DEFAULT \'\'' }),
    __metadata("design:type", String)
], OneInventoryItemDB.prototype, "picurl", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'barcode', dbtype: 'TEXT NOT NULL DEFAULT \'\'' }),
    __metadata("design:type", String)
], OneInventoryItemDB.prototype, "barcode", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'item_id', dbtype: 'INTEGER UNIQUE' }),
    sqlite3orm_1.index('idx_item_ids'),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "item_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], OneInventoryItemDB.prototype, "created", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'last_touched', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], OneInventoryItemDB.prototype, "last_touched", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created_by', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "created_by", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'catalog_connection', dbtype: 'INTEGER' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "catalog_connection", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'expiry_date', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], OneInventoryItemDB.prototype, "expiry_date", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'stock', dbtype: 'INTEGER DEFAULT -1' }),
    __metadata("design:type", Number)
], OneInventoryItemDB.prototype, "stock", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'disabled', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], OneInventoryItemDB.prototype, "disabled", void 0);
OneInventoryItemDB = __decorate([
    sqlite3orm_1.table({ name: "oneinventoryitemdb_local", autoIncrement: true })
], OneInventoryItemDB);
exports.OneInventoryItemDB = OneInventoryItemDB;
let ProductCategorizationDB = class ProductCategorizationDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], ProductCategorizationDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_categorization_deltas'),
    __metadata("design:type", Number)
], ProductCategorizationDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'categorization_id', dbtype: 'INTEGER UNIQUE' }),
    sqlite3orm_1.index('idx_categorization_ids'),
    __metadata("design:type", Number)
], ProductCategorizationDB.prototype, "item_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'inventory_item_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_inventory_local_ids', 'oneinventoryitemdb_local', 'local_id'),
    sqlite3orm_1.index('idx_inventory_ids'),
    __metadata("design:type", Number)
], ProductCategorizationDB.prototype, "inventory_item_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'catalog_item_id', dbtype: 'INTEGER' }),
    __metadata("design:type", Number)
], ProductCategorizationDB.prototype, "catalog_item_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'subcategory', dbtype: 'TEXT DEFAULT \'\'' }),
    __metadata("design:type", String)
], ProductCategorizationDB.prototype, "subcategory", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'subsubcategory', dbtype: 'TEXT DEFAULT \'\'' }),
    __metadata("design:type", String)
], ProductCategorizationDB.prototype, "subsubcategory", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'essential_item', dbtype: "INTEGER NOT NULL DEFAULT 0" }),
    __metadata("design:type", Boolean)
], ProductCategorizationDB.prototype, "essential_item", void 0);
ProductCategorizationDB = __decorate([
    sqlite3orm_1.table({ name: "productcategorizationdb_local", autoIncrement: true })
], ProductCategorizationDB);
exports.ProductCategorizationDB = ProductCategorizationDB;
let GRNItemDetailsDB = class GRNItemDetailsDB {
};
__decorate([
    sqlite3orm_1.id({ name: 'local_id', dbtype: 'INTEGER NOT NULL' }),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "local_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'delta', dbtype: 'INTEGER NOT NULL DEFAULT 0' }),
    sqlite3orm_1.index('idx_grnprods_deltas'),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "delta", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'id', dbtype: 'INTEGER UNIQUE' }),
    sqlite3orm_1.index('grn_item_details_ids'),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'inventory_item_id_local', dbtype: 'INTEGER' }),
    sqlite3orm_1.fk('fk_inventory_local_ids', 'oneinventoryitemdb_local', 'local_id'),
    sqlite3orm_1.index('grn_inventory_ids_local'),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "inventory_item_id_local", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'shop_id', dbtype: 'INTEGER' }),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "shop_id", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'purchase_rate', dbtype: 'REAL NOT NULL' }),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "purchase_rate", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'price_currency', dbtype: 'TEXT NOT NULL DEFAULT \'INR\'' }),
    __metadata("design:type", String)
], GRNItemDetailsDB.prototype, "price_currency", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'cgst_rate', dbtype: 'REAL NOT NULL' }),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "cgst_rate", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'sgst_rate', dbtype: 'REAL NOT NULL' }),
    __metadata("design:type", Number)
], GRNItemDetailsDB.prototype, "sgst_rate", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'created', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], GRNItemDetailsDB.prototype, "created", void 0);
__decorate([
    sqlite3orm_1.field({ name: 'last_touched', dbtype: 'TEXT DEFAULT(datetime(\'now\') || \'Z\') ' }),
    __metadata("design:type", Date)
], GRNItemDetailsDB.prototype, "last_touched", void 0);
GRNItemDetailsDB = __decorate([
    sqlite3orm_1.table({ name: "grnitemdetailsdb_local", autoIncrement: true })
], GRNItemDetailsDB);
exports.GRNItemDetailsDB = GRNItemDetailsDB;
/*


@table({name : "grnsupplierdetailsdb_local" , autoIncrement: true})


@table({name : "grnsupplierinvoicesdb_local" , autoIncrement: true})

*/
const sqlite3orm_2 = require("sqlite3orm");
const getConnection = (filepath) => __awaiter(void 0, void 0, void 0, function* () {
    let sqldb = new sqlite3orm_2.SqlDatabase();
    // await sqldb.open(':memory:'); // would open a memory database in private mode
    yield sqldb.open(filepath); // opens a memory database in shared mode
    return sqldb;
});
exports.getConnection = getConnection;
const createIfDontExist = (sqldb) => __awaiter(void 0, void 0, void 0, function* () {
    // get the user_version from the database:
    let userVersion = yield sqldb.getUserVersion();
    // create all the tables if they do not exist:
    yield sqlite3orm_2.schema().createTable(sqldb, 'shopperdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopperdb_local', 'idx_shopper_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopperdb_local', 'idx_shopper_ids');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopperdb_local', 'idx_shopper_phone_numbers');
    yield sqlite3orm_2.schema().createTable(sqldb, 'shopshopperrelationshipdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopshopperrelationshipdb_local', 'idx_relationship_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopshopperrelationshipdb_local', 'idx_relationship_ids');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopshopperrelationshipdb_local', 'idx_relationship_shopper_ids_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopshopperrelationshipdb_local', 'idx_relationship_shopper_ids');
    yield sqlite3orm_2.schema().createTable(sqldb, 'paymentdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'paymentdb_local', 'idx_payment_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'paymentdb_local', 'idx_payment_relationship_ids_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'paymentdb_local', 'idx_payment_visit_ids_local');
    yield sqlite3orm_2.schema().createTable(sqldb, 'shopvisitdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopvisitdb_local', 'idx_visit_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopvisitdb_local', 'idx_visit_ids');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopvisitdb_local', 'idx_relationship_ids_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'shopvisitdb_local', 'idx_payment_ids_local');
    yield sqlite3orm_2.schema().createTable(sqldb, 'oneinventoryitemdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'oneinventoryitemdb_local', 'idx_inventory_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'oneinventoryitemdb_local', 'idx_item_ids');
    yield sqlite3orm_2.schema().createTable(sqldb, 'productcategorizationdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'productcategorizationdb_local', 'idx_categorization_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'productcategorizationdb_local', 'idx_categorization_ids');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'productcategorizationdb_local', 'idx_inventory_ids');
    yield sqlite3orm_2.schema().createTable(sqldb, 'grnitemdetailsdb_local');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'grnitemdetailsdb_local', 'idx_grnprods_deltas');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'grnitemdetailsdb_local', 'grn_item_details_ids');
    yield sqlite3orm_2.schema().createIndex(sqldb, 'grnitemdetailsdb_local', 'grn_inventory_ids_local');
    yield sqldb.setUserVersion(1);
});
exports.createIfDontExist = createIfDontExist;
