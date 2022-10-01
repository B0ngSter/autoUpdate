<template>
  <div
    class="full"
    style="
      background-color: #f0f0f3;
      overflow-x: hidden;
      height: auto;
      width: 100vw;
    "
  >
    <div class="scroll">
      <div
        id="header"
        style="z-index: 2; position: fixed; width: 100vw; top: 0"
      >
        <div
          class="pt-4 pb-3"
          style="
            background: linear-gradient(180deg, #b5dcf6 0%, #d2e9f9 100%);
            height: 10vh;
            box-shadow: 0 1px 2px 0 rgba(92, 165, 214, 0.8);
          "
        >
          <div
            style="position: absolute"
            class="pr-4 pl-3 d-flex justify-content-center align-items-center"
          >
            <div
              style="
                height: auto;
                border-radius: 70px;
                width: 100%;
                background: linear-gradient(315deg, #b5dcf6 0%, #d2e9f9 100%);
                box-shadow: inset -1px -1px 1px 0 rgba(92, 165, 214, 0.8),
                  inset 2px 2px 2px 0 rgba(232, 244, 252, 0.8),
                  2px 2px 4px 0 rgba(92, 165, 214, 0.8), -1px -1px 2px 0 #e8f4fc;
              "
              @click="gobAck()"
            >
              <img
                alt="pic"
                src="@/static/Backward_arrow.webp"
                height="30"
                width="30"
              />
            </div>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <div style="width: 100vw" class="d-flex justify-content-center">
              <p
                v-if="screen === 'startScreen'"
                class="text_four mb font-weight-bold pt-2"
              >
                HSN Entry
              </p>
              <p
                v-if="screen === 'itemDeails'"
                class="text_four mb font-weight-bold pt-2"
              >
                Item Details
              </p>
            </div>
          </div>
        </div>
      </div>
      <div v-if="screen === 'middleLayer'" class="mt-6">
        <div
          v-for="(item, i) in midLayerEl"
          :key="i"
          class="d-flex justify-content-center flex-wrap wid1"
        >
          <div
            class="hover_inside inventory_box d-flex align-items-center mt-3 pt-2"
            @click="selectItem(item)"
          >
            <div
              class="pt-2 d-flex align-items-center"
              style="width: 70vw; height: 120px"
            >
              <div style="position: relative; width: 17.5vw" class="ml-2 img1">
                <img
                  alt="pic"
                  class="float-left img3"
                  style="border-radius: 10px; width: 17.5vw"
                  :src="imageSource1(item.item_details.picurl)"
                  height="85"
                />
              </div>
              <div class="ml-3 mt-1 wid9">
                <p class="text-left gray mb text_one">
                  {{ item.item_details.brand }}
                </p>
                <p class="text-left mb text_two" style="width: 45vw">
                  {{ item.item_details.name }}
                </p>
                <div class="mt-2" style="width: 45vw">
                  <p class="text_grey-3 text_two mb">
                    {{ item.item_details.quantity }}
                    {{ item_unit(item.item_details.units) }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="screen === 'startScreen'"
        class="d-flex align-items-center justify-content-center"
        style="height: 100vh"
      >
        <p class="text-center">Scan Barcode</p>
        <div
          id="modal-sm"
          v-if="SearchModal"
          class="modat d-flex justify-content-center flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
        >
          <p class="font-weight-bold">Saved</p>
        </div>
      </div>
      <div
        v-if="screen === 'itemDeails'"
        class="d-flex justify-content-center mt-6"
      >
        <img
          id="camera--output"
          class="ml-2 img2"
          :src="imageSource1(itemDeails[0].item_details.picurl)"
          style="
            height: 20vh;
            width: 30vw;
            border-radius: 16px;
            border: 2px solid #f0f0f3;
            box-shadow: inset 0 6px 4px 0 rgba(174, 174, 192, 0.6),
              inset 0 -6px 4px 0 #fff;
          "
        />
      </div>
      <!-- <div class="d-flex justify-content-center" style="width: 100vw;">
        <div v-if="UpdateSpinner" class=" d-flex justify-content-center align-items-center" style="height: 60vh; position: absolute; z-index: 2;">
          <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
      </div> -->
      <div v-if="screen === 'itemDeails'" class="mt-7">
        <div class="d-flex justify-content-center flex-wrap mt-4">
          <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >Name</label
            >
            <div class="d-flex justify-content-between">
              <p class="inputs pl-2 mt-2 focus">
                {{ itemDeails[0].item_details.name }}
              </p>
            </div>
          </div>
          <!-- <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >HSN Code</label
            >
            <div class="d-flex justify-content-between">
              <input
                v-model="edit_item.hsn_code"
                type="text"
                class="inputs pl-2 mt-2 focus"
              />
            </div>
            <label
              v-if="edit_item.hsn_code && edit_item.hsn_code.length === 0"
              for="input"
              style="color: red"
              class="mb font_small text_two"
              >Please fill HSN code</label
            >
          </div> -->
          <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >SGST Code</label
            >
            <div class="d-flex justify-content-between">
              <input
                v-model="edit_item.sgst_rate"
                type="text"
                class="inputs pl-2 mt-2 focus"
              />
            </div>
            <label
              v-if="edit_item.sgst_rate && edit_item.sgst_rate.length === 0"
              for="input"
              style="color: red"
              class="mb font_small text_two"
              >Please fill SGST rate</label
            >
          </div>
          <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >Purchase Rate</label
            >
            <div class="d-flex justify-content-between">
              <input
                v-model="edit_item.purchase_rate"
                type="text"
                class="inputs pl-2 mt-2 focus"
              />
            </div>
            <label
              v-if="
                edit_item.purchase_rate && edit_item.purchase_rate.length === 0
              "
              for="input"
              style="color: red"
              class="mb font_small text_two"
              >Please fill SGST rate</label
            >
          </div>
          <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >MRP</label
            >
            <div class="d-flex justify-content-between">
              <input
                v-model="edit_item.unit_price"
                type="text"
                class="inputs pl-2 mt-2 focus"
              />
            </div>
            <label
              v-if="edit_item.unit_price && edit_item.unit_price.length === 0"
              for="input"
              style="color: red"
              class="mb font_small text_two"
              >Please fill SGST rate</label
            >
          </div>
          <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >Discount</label
            >
            <div class="d-flex justify-content-between">
              <input
                v-model="edit_item.discount"
                type="text"
                class="inputs pl-2 mt-2 focus"
              />
            </div>
          </div>
          <div style="width: 75vw" class="mt-3">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >CGST Code</label
            >
            <div class="d-flex justify-content-between">
              <input
                v-model="edit_item.cgst_rate"
                type="text"
                class="inputs pl-2 mt-2 focus"
              />
            </div>
            <label
              v-if="edit_item.cgst_rate && edit_item.cgst_rate.length === 0"
              for="input"
              style="color: red"
              class="mb font_small text_two"
              >Please fill CGST rate</label
            >
          </div>
          <div
            style="width: 75vw"
            class="mt-3 d-flex justify-content-around mt-3 mb-4"
          >
            <div
              style="z-index: 1; width: 32vw"
              class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="addHSN()"
            >
              <p class="text_two mb blue_text font-weight-bold">Save</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      screen: "startScreen",
      edit_item: {
        hsn_code: "",
        cgst_rate: "",
        sgst_rate: "",
        discount: "",
        purchase_rate: "",
        unit_price: "",
      },
      SearchModal: false,
      CatDataset: {},
      itemType: "",
      itemDeails: {},
      dataset: {},
      catItemId: null,
      clicked_img: null,
      barcode: "",
      timeStamp: null,
      midLayerEl: [],
      auth: null,
    };
  },
  mounted() {
    this.auth = JSON.parse(localStorage.getItem("storeData"));
    let barcode = "";
    let interval;
    const thiz = this;
    thiz.timeStamp = async function (evt) {
      if (interval) {
        clearInterval(interval);
      }
      if (evt.code === "Enter") {
        if (thiz.screen === "itemDeails") {
          thiz.addHSN();
        }
        if (barcode) {
          thiz.dataset = await thiz.searchBarcode(barcode);
          thiz.CatDataset = await thiz.barcodeGunitemCall(barcode);
          thiz.barcode = barcode;
          if (thiz.dataset && thiz.dataset.length) {
            if (thiz.dataset && thiz.dataset.length > 1) {
              const ids = [];
              thiz.dataset.forEach((el) => {
                ids.push(el.product_id);
              });
              const itemDetails = await thiz.getItemsFromID(ids);
              thiz.screen = "middleLayer";
              thiz.midLayerEl = [...itemDetails];
            } else {
              thiz.itemType = "inShop";
              thiz.itemDeails = await thiz.getItemsFromID([
                thiz.dataset[0].product_id,
              ]);
              const payload = [thiz.dataset[0].product_id];
              const guessedCodes = await thiz.guessHSNShop(payload);
              if (guessedCodes && guessedCodes.length) {
                thiz.edit_item.unit_price =
                  thiz.itemDeails[0].item_details.unit_price;
                thiz.edit_item.hsn_code = guessedCodes
                  ? guessedCodes[guessedCodes.length - 1].hsn_code
                  : null;
                thiz.edit_item.cgst_rate = guessedCodes
                  ? guessedCodes[guessedCodes.length - 1].cgst_rate
                  : null;
                thiz.edit_item.sgst_rate = guessedCodes
                  ? guessedCodes[guessedCodes.length - 1].sgst_rate
                  : null;
                thiz.edit_item.purchase_rate = guessedCodes
                  ? guessedCodes[guessedCodes.length - 1].purchase_rate
                  : null;
                thiz.edit_item.barcode = barcode;
              }
              thiz.edit_item.discount =
                thiz.itemDeails[0].item_details.discount;
              thiz.edit_item.unit_price =
                thiz.itemDeails[0].item_details.unit_price;
              thiz.screen = "itemDeails";
            }
          } else {
            thiz.itemType = "Cat";
            const data = await thiz.getItemsFromCat([
              thiz.CatDataset[0].product_id,
            ]);
            thiz.itemDeails = [
              {
                item_details: { ...data[0][0][0] },
                item_classification: { ...data[0][0][1] },
              },
            ];
            const payload = {
              barcode,
              catalog_item_id: null,
              inventory_item_id: null,
            };
            const guessedCodes = await thiz.guessHSN(payload);
            if (guessedCodes && guessedCodes.length) {
              thiz.edit_item.hsn_code = guessedCodes[0].hsn_code;
              thiz.edit_item.cgst_rate = guessedCodes[0].cgst_rate;
              thiz.edit_item.sgst_rate = guessedCodes[0].sgst_rate;
              thiz.edit_item.barcode = barcode;
            }
            thiz.screen = "itemDeails";
            thiz.edit_item.discount = data[0][0][0].discount;
            thiz.edit_item.unit_price = data[0][0][0].unit_price;
          }
        }
      }
      if (evt.code !== "Shift") {
        barcode += evt.key;
      }
      interval = setInterval(() => {
        barcode = "";
      }, 20);
    };
    document.addEventListener("keydown", thiz.timeStamp);
  },
  destroyed() {
    document.removeEventListener("keydown", this.timeStamp);
  },
  methods: {
    item_unit(unit) {
      if (unit === "GRAM") {
        return "g";
      } else if (unit === "ML") {
        return "Ml";
      } else if (unit === "LITRE") {
        return "L";
      } else if (unit === "KILOGRAM") {
        return "Kg";
      }
    },
    gobAck() {
      if (this.screen === "itemDeails") {
        this.screen = "startScreen";
      } else if (this.screen === "startScreen") {
        this.$router.push("/home");
      }
    },
    async getItemsFromCat(listOfItemIDS) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/getCatalogItemsWithCategorization",
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: listOfItemIDS,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getItemsFromID(listOfItemIDS) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/getDetailedInventoryList",
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: listOfItemIDS,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async addInventoryItem() {
      const payload = {
        product_data: {
          name: this.itemDeails[0].item_details.name,
          brand: this.itemDeails[0].item_details.brand,
          quantity: this.itemDeails[0].item_details.quantity,
          units: this.itemDeails[0].item_details.units,
          unit_price: this.edit_item.unit_price,
          discount: this.edit_item.discount,
          unit_price_currency:
            this.itemDeails[0].item_details.unit_price_currency,
          picurl: this.itemDeails[0].item_details.picurl,
          barcode: this.itemDeails[0].item_details.barcode,
          stock: this.itemDeails[0].item_details.stock,
          expiry_date: null,
          disabled: false,
          selling_price: this.itemDeails[0].item_details.selling_price,
          catalog_connection: this.itemDeails[0].item_details.item_id,
        },
        product_categorization: {
          subcategory: this.itemDeails[0].item_classification.subcategory,
          subsubcategory: this.itemDeails[0].item_classification.subsubcategory,
          essential_item: false,
        },
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `addInventoryItemWithCategorizationForBarcodeBilling?shopID=${this.auth.shop_id}&employeeID=${this.auth.employee_id}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
          progress: false,
        });
        this.catItemId = response.data[0].item_id;
        const data = {
          shopID: this.auth.shop_id,
          category_number: this.itemDeails[0].item_details.category_number,
          inventory_item_id: response.data[0].item_id,
        };
        await this.addInventoryItemToCategory(data);
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async addInventoryItemToCategory(data) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/addInventoryItemToShopCategory",
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async selectItem(item) {
      const thiz = this;
      const payload = {
        barcode: thiz.barcode,
        catalog_item_id: null,
        inventory_item_id: null,
      };
      const guessedCodes = await thiz.guessHSN(payload);
      if (guessedCodes && guessedCodes.length) {
        thiz.edit_item.hsn_code = guessedCodes[0].hsn_code;
        thiz.edit_item.cgst_rate = guessedCodes[0].cgst_rate;
        thiz.edit_item.sgst_rate = guessedCodes[0].sgst_rate;
      }
      thiz.edit_item.barcode = thiz.barcode;
      thiz.itemDeails = [item];
      thiz.screen = "itemDeails";
    },
    // /registerItemsForSupplierInvoicing?employeeID=3
    addHSN() {
      //   console.log(this.edit_item.hsn_code.length)
      //   console.log(this.edit_item.cgst_rate.length)
      //   console.log(this.edit_item.sgst_rate.length)
      if (this.itemType === "Cat") {
        this.addInventoryItem();
      }
      setTimeout(async () => {
        let itemId;
        if (this.itemType === "Cat") {
          itemId = this.catItemId;
        } else {
          itemId = this.dataset[0].product_id;
        }
        console.log(itemId);
        console.log(this.catItemId);
        if (this.edit_item.hsn_code && this.edit_item.hsn_code.length) {
          const datalist = {
            inventory_items: [
              {
                item_details: {
                  // hsn_code: this.edit_item.hsn_code,
                  sgst_rate: parseFloat(this.edit_item.sgst_rate),
                  purchase_rate: parseFloat(this.edit_item.purchase_rate),
                  price_currency: "INR",
                  cgst_rate: parseFloat(this.edit_item.cgst_rate),
                },
                inventory_item_id: itemId,
                units: 0,
                free_quantity: 0,
                mrp: parseFloat(this.edit_item.unit_price),
                discount_on_mrp: parseFloat(this.edit_item.discount),
                discount_on_purchase: 0,
              },
            ],
            shop_id: this.auth.shop_id,
          };
          try {
            const response = await this.$axios({
              method: "POST",
              url: `/registerItemsForSupplierInvoicing?employeeID=${this.auth.employee_id}`,
              headers: {
                "Content-Type": "application/json",
              },
              data: datalist,
            });
            //   window.location.href = 'http://www.google.com'
            //   setTimeout(() => {
            //     window.print()
            //   }, 1000)
            this.screen = "startScreen";
            this.SearchModal = true;
            setTimeout(() => {
              this.SearchModal = false;
            }, 1000);
            this.itemType = "";
            this.catItemId = null;
            return response.data;
          } catch (error) {
            console.log(error);
            return undefined;
          }
        }
      }, 2000);
    },
    async searchBarcode(data) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/searchProductFromBarcode?shop_id=${this.auth.shop_id}&barcodestr=${data}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    imageSource(url) {
      if (url && !url.includes("https") && !url.includes("data:image")) {
        return process.env.ENV === "dev"
          ? "https://api.aistore.shop" + url
          : process.env.ENV === "prod"
          ? "https://api.ooga.shop" + url
          : "http://localhost:4040" + url;
      } else {
        return url;
      }
    },
    imageSource1(url) {
      if (url && !url.includes("https")) {
        return process.env.ENV === "dev"
          ? "https://integration.aistore.shop" + url
          : process.env.ENV === "prod"
          ? "https://integration.ooga.shop" + url
          : "http://localhost:5046" + url;
      } else {
        return url;
      }
    },
    async barcodeGunitemCall(code) {
      let response = null;
      try {
        // eslint-disable-next-line no-unused-vars
        response = await this.$axios({
          method: "GET",
          url: `/searchBarcodeInCatalog?barcodestr=${code}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return [];
      }
    },
    async guessHSNShop(datalist) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getGRNDetailsForItemIDs?shopID=${this.auth.shop_id}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: datalist,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async guessHSN(datalist) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/guessHSNCode?shopID=${this.auth.shop_id}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: datalist,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
  },
};
</script>
<style scoped>
body {
  background-color: #f0f0f3;
}
.btnn {
  height: 40px;
  border-radius: 104px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 #c6c6d2, inset 2px 2px 2px 0 #fff,
    2px 2px 3px 0 #c6c6d2, -2px -2px 3px 0 #fff;
}
.top_store_name {
  height: 56px;
  width: 240px;
  border-radius: 16px;
  background: linear-gradient(315deg, #b5dcf6 0%, #d2e9f9 100%);
  box-shadow: inset -1px -1px 1px 0 rgba(92, 165, 214, 0.8),
    inset 2px 2px 2px 0 rgba(232, 244, 252, 0.8),
    2px 2px 4px 0 rgba(92, 165, 214, 0.8), -1px -1px 2px 0 #e8f4fc;
}

.hover_inside:hover {
  background-color: #f0f0f3;
  animation-name: btn;
  animation-duration: 0.5s;
}
@keyframes btn {
  0% {
    box-shadow: inset 2px 2px 2px 0 rgba(198, 198, 210, 0.8),
      inset -2px -2px 2px 0 #fff;
  }
}

@media screen and (max-width: 480px) {
  .imggg {
    width: 16.5vw;
  }
  .sideBit {
    margin-left: 7rem;
  }
  /* .big_box {
    width: 81vw;
  } */
}
.inputs {
  height: 32px;
  width: 100%;
  color: #666;
  border: 0;
  border-radius: 8px;
  background-color: #e8e8ed;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
#camera--output {
  border: 0px;
  position: absolute;
  height: 95vh;
  margin-left: -4vw;
  object-fit: cover;
}

#camera--output {
  border: 0px;
}
#camera--output {
  border: 0px;
  position: absolute;
  height: 95vh;
  margin-left: -4vw;
  width: 100vw;
  object-fit: cover;
}
.img3 {
  width: 80px !important;
}
.img2 {
  width: 180px !important;
  margin-bottom: 10vh;
}
#camera--output {
  border: 0px;
}
.inputs:focus {
  outline: none;
}
@media screen and (min-width: 480px) {
  .imggg {
    width: 5.5vw;
  }
  /* .big_box {
    width: 20vw;
  } */
  .sideBit {
    margin-left: 12rem;
  }
}
.inputs2 {
  border-radius: 8px;
  border: 0;
  height: 30px;
  width: 87%;
  background-color: #e8e8ed;
}
.arrow {
  background: linear-gradient(315deg, #b5dcf6 0%, #d2e9f9 100%);
  box-shadow: inset -1px -1px 1px 0 rgba(92, 165, 214, 0.8),
    inset 2px 2px 2px 0 rgba(232, 244, 252, 0.8),
    2px 2px 4px 0 rgba(92, 165, 214, 0.8), -1px -1px 2px 0 #e8f4fc;
}
.shop_name_top {
  height: 56px;
  width: 240px;
  border-radius: 16px;
  background: linear-gradient(315deg, #b5dcf6 0%, #d2e9f9 100%);
  box-shadow: inset -1px -1px 1px 0 rgba(92, 165, 214, 0.8),
    inset 2px 2px 2px 0 rgba(232, 244, 252, 0.8),
    2px 2px 4px 0 rgba(92, 165, 214, 0.8), -1px -1px 2px 0 #e8f4fc;
}
.border {
  box-sizing: border-box;
  height: 1px;
  width: 226px;
  border: 1px solid #808080;
}
.total_amount_to_pay {
  height: 40px;
  width: 85px;
  border-radius: 93px;
  background-color: #f0f0f3;
  box-shadow: inset -1px -1px 1px 0 rgba(255, 255, 255, 0.8),
    inset 1px 1px 1px 0 rgba(174, 174, 192, 0.45);
}
.disable {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}
.opacity {
  opacity: 0.3;
}
.popup_margin {
  top: 20%;
}
.small_popup_margin {
  top: 30%;
}
.search {
  border-radius: 16px;
  background-color: #f0f0f3;
  border: 0;
  box-shadow: inset 4px 4px 6px 0 rgba(198, 198, 210, 0.8),
    inset -4px -4px 6px 0 #fff, 4px 4px 4px 0 #aeaec0, -4px -4px 4px 0 #fff;
}
.box {
  height: 41px;
  width: 80vw;
}
.popup {
  box-sizing: border-box;
  width: 80vw;
  border-radius: 8px;
  background-color: #f0f0f3;
  border: 2px solid #f0f0f3;
  box-shadow: 4px 4px 6px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.second_popup {
  box-sizing: border-box;
  width: 80vw;
  border-radius: 8px;
  background-color: #f0f0f3;
  border: 2px solid #f0f0f3;
  box-shadow: 4px 4px 6px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.input {
  border-radius: 16px;
  background-color: #f0f0f3;
  height: 20px;
  width: 100%;
  border: 0;
}
.inventory_box {
  width: 80vw;
  height: 120px;
  border-radius: 16px;
  background-color: #f0f0f3;
  box-shadow: 4px 4px 6px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.mb {
  margin-bottom: 0px;
}
.name-rectangle {
  height: 48px;
  width: 100%;
  border-radius: 8px;
  border: 0;
  background-color: #e8e8ed;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
}
.footer {
  border-top: 1px rgb(255, 255, 255) solid;
  position: fixed;
  background-color: #d0d0d4;
  bottom: 0vh;
  height: 10vh;
  width: 100vw;
  left: 0;
}
.text_input:focus {
  outline: none;
}
.done_btn {
  height: 20px;
  width: 58px;
  border-radius: 18px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(174, 174, 192, 0.8),
    inset 2px 2px 2px 0 #fff, 2px 2px 4px 0 #c6c6d2, -2px -2px 4px 0 #fff;
}
.footer_btn {
  height: 40px;
  width: 128px;
  border-radius: 18px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(174, 174, 192, 0.8),
    inset 2px 2px 2px 0 #fff, 2px 2px 4px 0 #c6c6d2, -2px -2px 4px 0 #fff;
}
.bill_btn {
  height: 40px;
  width: 108px;
  border-radius: 18px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(174, 174, 192, 0.8),
    inset 2px 2px 2px 0 #fff, 2px 2px 4px 0 #c6c6d2, -2px -2px 4px 0 #fff;
}
.add_more {
  box-sizing: border-box;
  width: 86px;
  border-radius: 107px;
  box-shadow: inset -1px -1px 2px 0 rgba(198, 198, 210, 0.8),
    inset 2px 2px 4px 0 #fff;
}
.big_box {
  box-sizing: border-box;
  border-radius: 16px;
  width: 81vw;
  background-color: #f0f0f3;
  border: 1px solid #f0f0f3;
  box-shadow: 6px 6px 10px 0 #c6c6d2, -6px -6px 8px 0 #fff;
}
</style>