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
exports.syncLogic = exports.getDataForPasskey = exports.setShopData = exports.createNewInventoryJSON = exports.generateAccessToken = exports.checkAuth = void 0;
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const config_1 = require("./config");
const FormData = require('form-data');
const jwt = __importStar(require("jsonwebtoken"));
const content_json_1 = require("./content_json");
const express_zod_api_1 = require("express-zod-api");
const download = require('download');
var sqlite3 = require("sqlite3").verbose();
const path = require('path');
const { indexData, searchbarcode, searchbarcodeImport, searchname, getcatdata, exi } = require("./search_functions");
const unzipper = require('unzipper');
function checkAuth(authtoken) {
    return __awaiter(this, void 0, void 0, function* () {
        if (authtoken === undefined) {
            return { auth: false };
        }
        else {
            let parts = authtoken.split(' ');
            if (parts.length <= 1) {
                return { auth: false };
            }
            else {
                let actualauthtoken = parts[1];
                try {
                    let codeddata = jwt.verify(actualauthtoken, "fdefvdasfyu314978y89567");
                    if (codeddata.verified) {
                        return { auth: true };
                    }
                    else {
                        return { auth: false };
                    }
                }
                catch (_a) {
                    return { auth: false };
                }
            }
        }
    });
}
exports.checkAuth = checkAuth;
function generateAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        let shopemployeedata = yield config_1.config.local_storage.getItem("shopemployeedata");
        let employeedata = {
            verified: true,
            employee_phone: shopemployeedata.phone_number,
            employee_id: shopemployeedata.employee_id,
            level_shopowner: shopemployeedata.level_shopowner,
            level_shopmanager: shopemployeedata.level_shopmanager,
            level_shopstaff: shopemployeedata.level_shopstaff,
            permission_view_inventory: shopemployeedata.permission_view_inventory,
            permission_edit_inventory: shopemployeedata.permission_edit_inventory,
            permission_add_inventory: shopemployeedata.permission_add_inventory,
            permission_delete_inventory: shopemployeedata.permission_delete_inventory,
            permission_serve_customers: shopemployeedata.permission_serve_customers,
            permission_allow_oogapay: shopemployeedata.permission_allow_oogapay,
            permission_view_staff: shopemployeedata.permission_view_staff,
            permission_edit_staff: shopemployeedata.permission_edit_staff,
            permission_add_staff: shopemployeedata.permission_add_staff,
            permission_delete_staff: shopemployeedata.permission_delete_staff,
            permission_view_invoices: shopemployeedata.permission_view_invoices
        };
        return yield jwt.sign(employeedata, "fdefvdasfyu314978y89567", { expiresIn: config_1.config.jwt.expire });
    });
}
exports.generateAccessToken = generateAccessToken;
const createNewInventoryJSON = () => __awaiter(void 0, void 0, void 0, function* () {
    return Object.assign({}, content_json_1.blankInventoryJson);
});
exports.createNewInventoryJSON = createNewInventoryJSON;
const setShopData = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let prevdataopt = yield config_1.config.local_storage.getItem("shopemployeedata");
    var prev_inventory_json;
    if (prevdataopt) {
        if (prevdataopt.employee_id != data.employee_id) {
            console.log("New person logging in.");
            throw (0, express_zod_api_1.createHttpError)(401, "Employee changed for the system.");
        }
        console.log("previous json", prevdataopt.inventory_json);
        prev_inventory_json = prevdataopt.inventory_json;
    }
    else {
        console.log("no inventory from earlier");
        prev_inventory_json = yield (0, exports.createNewInventoryJSON)();
    }
    data.inventory_json = prev_inventory_json;
    yield config_1.config.local_storage.setItem("shopemployeedata", data);
    yield console.log(yield config_1.config.local_storage.getItem("shopemployeedata"));
});
exports.setShopData = setShopData;
const getDataForPasskey = (passkey) => __awaiter(void 0, void 0, void 0, function* () {
    //const payload = { passkey: passkey };
    //const params = new url.URLSearchParams(payload);
    try {
        let { data, status } = yield axios_1.default.get(config_1.config.cloud.login.server + "/getshopemployeefrompasskey/" + passkey, {
            headers: {
                Accept: 'application/json',
            },
        });
        if (status == 200) {
            yield (0, exports.setShopData)(data);
            return true;
        }
        else {
            return false;
        }
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.getDataForPasskey = getDataForPasskey;
function resetsignin(employeeid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data, status } = yield axios_1.default.get(config_1.config.cloud.login.server + "/resetemployeesignin/" + String(employeeid), {
                headers: {
                    Accept: 'application/json',
                },
            });
            if (status == 200) {
                yield (0, exports.setShopData)(data);
                return true;
            }
            else {
                return false;
            }
        }
        catch (error) {
            return true;
        }
    });
}
function uploaddbfile(employeeid) {
    return __awaiter(this, void 0, void 0, function* () {
        let randfilename = Math.random().toString(16).substr(2, 8) + ".dxb";
        yield fs_1.default.copyFileSync(config_1.config.database.db_file, randfilename);
        let form = new FormData();
        form.append('employeeid', String(employeeid));
        let dbstream = yield fs_1.default.createReadStream(randfilename);
        form.append('dbfile', dbstream, randfilename);
        let fileuploadresponse = yield axios_1.default.post(config_1.config.cloud.login.server + "/uploaddatabasefile", form, {
            headers: Object.assign({}, form.getHeaders()),
        });
        console.log(fileuploadresponse);
        if (fileuploadresponse.status != 200) {
            return false;
        }
        // Delete all dxb files.. They are just backups anyway..
        var delfiles = fs_1.default.readdirSync('.').filter(fn => fn.endsWith('.dxb'));
        for (var ii = 0; ii < delfiles.length; ii++) {
            fs_1.default.rmSync(delfiles[ii]);
        }
        return true;
    });
}
function setupnewdb(employeeid) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let { data, status } = yield axios_1.default.get(config_1.config.cloud.login.server + "/getloginstatus/" + employeeid, {
                headers: {
                    Accept: 'application/json',
                },
            });
            let updated_file_created = data.updated_file_created;
            let updated_file_link = data.updated_file_link;
            if (updated_file_created) {
                yield download(config_1.config.cloud.login.server + updated_file_link, '.');
                let sourceDBPath = path.basename(updated_file_link); //+"."+path.extname(path.basename(updated_file_link)) ;
                let destDB = new sqlite3.Database("./init.dx");
                yield destDB.serialize(() => {
                    try {
                        destDB.run(`ATTACH '${sourceDBPath}' AS sourceDB`, []);
                        let tables = ["grnitemdetailsdb_local", "productcategorizationdb_local", "oneinventoryitemdb_local", "paymentdb_local", "shopvisitdb_local", "shopshopperrelationshipdb_local", "shopperdb_local"];
                        for (var i = 0; i < tables.length; i++) {
                            let table = tables[i];
                            destDB.run(`DELETE FROM ${table}`);
                        }
                        let tables2 = ["shopperdb_local", "shopshopperrelationshipdb_local", "shopvisitdb_local", "oneinventoryitemdb_local", "productcategorizationdb_local", "paymentdb_local", "grnitemdetailsdb_local"];
                        for (var i = 0; i < tables2.length; i++) {
                            let table = tables2[i];
                            destDB.run(`INSERT INTO ${table} SELECT * FROM sourceDB.${table}`);
                        }
                        destDB.run(`DETACH sourceDB`);
                    }
                    catch (error) {
                        destDB.run(`DETACH sourceDB`);
                        console.log("Cannot query server for login status");
                        return false;
                    }
                });
                return true;
            }
            else {
                console.log("Cannot query server for login status");
                return false;
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
function redownloadfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting Redownload");
        try {
            let shopemployeedata = yield config_1.config.local_storage.getItem("shopemployeedata");
            let inventory_json = shopemployeedata.inventory_json;
            let shop_id = shopemployeedata.shop_id;
            let employee_id = shopemployeedata.employee_id;
            let { data, status } = yield axios_1.default.get(config_1.config.cloud.login.server + "/getloginstatus/" + employee_id, {
                headers: {
                    Accept: 'application/json',
                },
            });
            let updated_inventory_json_str = data.updated_inventory_json_str;
            if (updated_inventory_json_str) {
                let new_inventory_json = JSON.parse(updated_inventory_json_str);
                shopemployeedata.inventory_json = new_inventory_json;
                console.log("New inventory data set");
                yield config_1.config.local_storage.setItem("shopemployeedata", shopemployeedata);
                let dbsuccess = yield setupnewdb(employee_id);
                if (dbsuccess) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                console.log("Cannot query server for login status");
                return false;
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
function syncdatabasefile() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Starting Sync");
        try {
            let shopemployeedata = yield config_1.config.local_storage.getItem("shopemployeedata");
            let inventory_json = shopemployeedata.inventory_json;
            let shop_id = shopemployeedata.shop_id;
            let employee_id = shopemployeedata.employee_id;
            let { data, status } = yield axios_1.default.post(config_1.config.cloud.login.server + "/syncdata", {
                shopID: shop_id,
                employeeID: employee_id,
                inventory_json: inventory_json
            }, {
                headers: {
                    Accept: 'application/json',
                },
            });
            if (status == 200) {
                shopemployeedata.inventory_json = data;
                console.log("Data Sync");
                yield config_1.config.local_storage.setItem("shopemployeedata", shopemployeedata);
                let dbsuccess = yield setupnewdb(employee_id);
                if (dbsuccess) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else if (status == 200) {
                setTimeout(syncdatabasefile, 20000);
                return false;
            }
            else {
                console.log("not 200");
                return false;
            }
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
function sortcatalog() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let shopemployeedata = yield config_1.config.local_storage.getItem("shopemployeedata");
            let inventory_json = shopemployeedata.inventory_json;
            let shop_id = shopemployeedata.shop_id;
            let employee_id = shopemployeedata.employee_id;
            yield download(config_1.config.cloud.login.server + "/gxcx/" + employee_id, '.');
            const directory = yield unzipper.Open.file('catalog.zip');
            let p = new Promise((resolve, reject) => {
                directory.files[0]
                    .stream()
                    .pipe(fs_1.default.createWriteStream('catalog.json'))
                    .on('error', () => __awaiter(this, void 0, void 0, function* () {
                    fs_1.default.rmSync("catalog.zip");
                }))
                    .on('finish', () => __awaiter(this, void 0, void 0, function* () {
                    console.log("indexing started");
                    //let {datadict,barcodeIndex,nameIndex} = await indexData('catalog.json');
                    let { datadict, miniSearch } = yield indexData('catalog.json');
                    console.log("indexingdone");
                    yield config_1.config.local_storage.setItem("datadict", datadict);
                    console.log("DataDIct saved!");
                    yield config_1.config.local_storage.setItem("barcodeIndex", JSON.stringify(miniSearch));
                    // @ts-ignore
                    globalThis.datadict = datadict;
                    //@ts-ignore
                    globalThis.barcodeIndex = miniSearch;
                    console.log("indices saved !!");
                    fs_1.default.rmSync("catalog.json");
                    fs_1.default.rmSync("catalog.zip");
                    resolve(true);
                }));
            });
            yield p;
            return true;
        }
        catch (error) {
            console.log(error);
            return false;
        }
    });
}
const syncLogic = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let shopemployeedata = yield config_1.config.local_storage.getItem("shopemployeedata");
        let shopid = shopemployeedata.shop_id;
        let employeeid = shopemployeedata.employee_id;
        let { data, status } = yield axios_1.default.get(config_1.config.cloud.login.server + "/getwhattodo/" + String(employeeid), {
            headers: {
                Accept: 'application/json',
            },
        });
        let whattodo = data.whattodo;
        console.log(whattodo, "What to do");
        if (whattodo == "ResetSignin") {
            var resetsuccess = yield resetsignin(employeeid);
            if (resetsuccess) {
                var uploadsuccess = yield uploaddbfile(employeeid);
                if (uploadsuccess) {
                    let syncsuccess = yield syncdatabasefile();
                    if (syncsuccess) {
                        let catsuccess = yield sortcatalog();
                        if (catsuccess) {
                            return true;
                        }
                        else {
                            return false;
                        }
                    }
                    else {
                        return true;
                    }
                }
            }
        }
        if (whattodo == "ReuploadDBFile") {
            var uploadsuccess = yield uploaddbfile(employeeid);
            if (uploadsuccess) {
                let syncsuccess = yield syncdatabasefile();
                if (syncsuccess) {
                    let catsuccess = yield sortcatalog();
                    if (catsuccess) {
                        return true;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    return true;
                }
            }
        }
        if (whattodo == "WaitForProcessing") {
            setTimeout(exports.syncLogic, 20000);
            return false;
        }
        if (whattodo == "RedownloadSyncedFiles") {
            let dlsuccess = yield redownloadfiles();
            if (dlsuccess) {
                let catsuccess = yield sortcatalog();
                if (catsuccess) {
                    return true;
                }
                else {
                    return false;
                }
            }
            else {
                return true;
            }
        }
        if (whattodo == "SyncError") {
            console.log("Sync Error :: Contect OOGASHOP central number for resolution");
        }
        if (whattodo == "RedownloadCatalog") {
            let catsuccess = yield sortcatalog();
            if (catsuccess) {
                return true;
            }
            else {
                return false;
            }
        }
        if (whattodo == "MoveOn") {
            return true;
        }
        return false;
    }
    catch (error) {
        console.log(error);
        return false;
    }
});
exports.syncLogic = syncLogic;