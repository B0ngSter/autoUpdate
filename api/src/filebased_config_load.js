"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.category_subcategory_subsubcategory_dict = void 0;
const fs_1 = __importDefault(require("fs"));
const csv_1 = require("csv");
let category_subcategory_hierarchy_dict = {};
fs_1.default.createReadStream("./src/categoryClassification.csv")
    .pipe(csv_1.parse({
    delimiter: ",",
    from_line: 2,
}))
    .on("data", function (row) {
    let category = row[0];
    let subcategory = row[1];
    let subsubcategory = row[2];
    if (subcategory == "" || subcategory == null) {
        subcategory = category;
    }
    ;
    if (subsubcategory == "" || subsubcategory == null) {
        subsubcategory = subcategory;
    }
    ;
    if (!category_subcategory_hierarchy_dict.hasOwnProperty(category)) {
        category_subcategory_hierarchy_dict[category] = {};
    }
    ;
    if (!category_subcategory_hierarchy_dict[category].hasOwnProperty(subcategory)) {
        category_subcategory_hierarchy_dict[category][subcategory] = ["Others"];
    }
    ;
    let subsubcats = category_subcategory_hierarchy_dict[category][subcategory];
    let subsubcatsset = new Set(subsubcats);
    subsubcatsset.add(subsubcategory);
    category_subcategory_hierarchy_dict[category][subcategory] = Array.from(subsubcatsset);
})
    .on("end", function () {
    console.log("finished");
})
    .on("error", function (error) {
    console.log(error.message);
});
exports.category_subcategory_subsubcategory_dict = category_subcategory_hierarchy_dict;
