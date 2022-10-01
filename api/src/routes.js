"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const common_vendor_services_1 = require("./common_vendor_services");
const item_services_1 = require("./item_services");
const express_zod_api_1 = require("express-zod-api");
const sync_code_1 = require("./sync_code");
const invoice_services_1 = require("./invoice_services");
const config_1 = require("./config");
const extra_services_1 = require("./extra_services");
const excel_related_services_1 = require("./excel_related_services");
const headersProviderMiddleware = (0, express_zod_api_1.createMiddleware)({
  input: express_zod_api_1.z.object({
    passkey: express_zod_api_1.z.string(),
  }),
  middleware: ({ response }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      return { response: response };
    }),
});
const loginEndpointFactory =
  express_zod_api_1.defaultEndpointsFactory.addMiddleware(
    headersProviderMiddleware
  );
const loginNSync = loginEndpointFactory.build({
  method: "get",
  input: express_zod_api_1.z.object({
    passkey: express_zod_api_1.z.string(),
  }),
  output: express_zod_api_1.z
    .object({
      success: express_zod_api_1.z.boolean(),
    })
    .passthrough(),
  handler: ({ input, options }) =>
    __awaiter(void 0, void 0, void 0, function* () {
      let passkey = input.passkey;
      // First setup local data using the passcode
      let downloadsuccess = yield (0, sync_code_1.getDataForPasskey)(passkey);
      if (downloadsuccess) {
        let synced = yield (0, sync_code_1.syncLogic)();
        if (synced) {
          //Creating JSON Token
          let token = yield (0, sync_code_1.generateAccessToken)();
          options.response.set("authorization", "Bearer " + token);
          let shop_data = yield config_1.config.local_storage.getItem(
            "shopemployeedata"
          );
          return { success: true, shop_data: shop_data, token: token };
        } else {
          return { success: false };
        }
      } else {
        return { success: false };
      }
    }),
});
const router = {
  //path and endpoints are mapped here.
  login: loginNSync,
  //Below services are mapped with endpoints in common_vendor_services
  dummy: common_vendor_services_1.dummyService,
  checkIfCustomerExistsOrCreateNewCustomer:
    common_vendor_services_1.checkIfConsumerExistsOrCreateEndPoint,
  createOrRetrieveRelationship:
    common_vendor_services_1.createOrRetrieveRelationshipEndpoint,
  createVisit: common_vendor_services_1.createVisitEndPoint,
  updateVisit: {
    ":visitID": common_vendor_services_1.updateVisitEndPoint,
  },
  discardVisit: common_vendor_services_1.discardVisitEndPoint,
  getUserByID: common_vendor_services_1.getUserByIDEndPoint,
  setConsumerNameForKhataUsers:
    common_vendor_services_1.setUserForKhataEndPoint,
  notifyPaymentStatus: common_vendor_services_1.notifyPaymentStatusEndPoint,
  showOOGADiscountGiftForVisit: {
    ":visitID": common_vendor_services_1.showOogaDiscountEndPoint,
  },
  // generateBarcode: generateBarcodeEndPoint,
  // getGeneratedBarcodeForItem: getGeneratedBarcodeForItemEndPoint,
  //inventory related services can be found in item_services.
  addInventoryItemWithCategorizationForBarcodeBilling:
    item_services_1.addInventoryItemWithCategorizationForBarcodeBillingEndPoint,
  disableInventoryItem: item_services_1.disableInventoryItemEndPoint,
  enableInventoryItem: item_services_1.enableInventoryItemEndPoint,
  editInventoryItem: item_services_1.editInventoryItemEndPoint,
  addInventoryItemWithCategorizationAndAutoGeneratedBarcodeForBarcodeBilling:
    item_services_1.addInventoryItemWithCategorizationForBarcodeBillingAndGenerateBarcodeEndPoint,
  registerItemsForSupplierInvoicing:
    item_services_1.registerProductsForSupplierInvoicingEndPoint,
  editInventoryItemWithCategorizationAndSaveBarcode:
    item_services_1.editInventoryItemAndSaveBarcodeEndPoint,
  //invoice file related routes. Services are in invoice_services.
  getEstimatePDFFor: {
    ":visitID": invoice_services_1.getEstimatePDFEndPoint,
  },
  getGSTInvoicePDFFor: {
    ":visitID": invoice_services_1.getGSTInvoicePDFForEndPoint,
  },
  getThinEstimatePDFFor: {
    ":visitID": invoice_services_1.getThinEstimatePDFForEndPoint,
  },
  getTokenEstimatePDFFor: {
    ":visitID": invoice_services_1.getTokenEstimatePDFForEndPoint,
  },
  getA4EstimateFor: invoice_services_1.getA4InvoicePDFForEndPoint,
  //Below services are in extra_services.py
  addInventoryItemToShopCategory:
    extra_services_1.additemToShopInventoryEndPoint,
  removeInventoryItemFromShopCategory:
    extra_services_1.removeitemFromShopInventoryEndPoint,
  getCatalogItem: extra_services_1.getCatalogItemEndPoint,
  //Below services are in excel_related_services.ts
  getTodaySalesReport: excel_related_services_1.createDailySalesReportEndPoint,
};
exports.router = router;
