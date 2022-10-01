<template>
  <div
    style="
      background-color: #f0f0f3;
      overflow-x: hidden;
      min-height: 100vh;
      width: 100vw;
    "
  >
    <div
      class="pt-4 pb-1 d-flex justify-content-between align-items-center"
      style="
        height: 10vh;
        background: linear-gradient(180deg, #b5dcf6 0%, #d2e9f9 100%);
        box-shadow: 0 1px 2px 0 rgba(92, 165, 214, 0.8);
      "
    >
      <div class="pr-4 pl-3 d-flex justify-content-center align-items-center">
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
          @click="
            () => {
              $router.push('home');
            }
          "
        >
          <img
            alt="pic"
            src="@/static/Backward_arrow.webp"
            height="30"
            width="30"
          />
        </div>
      </div>
      <div
        class="d-flex justify-content-center align-items-center"
        style="width: 80vw"
      >
        <p class="text_four font-weight-bold pt-2">
          Bills On Hold
          <!-- +91 {{ $store.getters.EnterToNumber[0] }} cart -->
        </p>
      </div>
      <div style="z-index: 1; width: 8vw" />
    </div>
    <div
      v-if="orders.length === 0"
      style="width: 100vw; height: 80vh"
      class="d-flex justify-content-center align-items-center"
    >
      No Holded Bills
    </div>
    <div class="d-flex justify-content-center flex-wrap mb-8 wid">
      <!-- <div
        v-for="(order, idx) in orders"
        :key="idx"
        class="p-3 plateau_box full_box_size m-3"
        style="border-radius: 16px;"
        @click="deleteInv(order.visit_id, order.shopping_json, order.shopper_phone_number, 'barCodeGun')"
      >
        {{ order.visit_id }}
      </div> -->
      <div
        v-for="(invoice, idx) in orders"
        :key="idx"
        class="pl-3 pr-3 pt-3 plateau_box full_box_size mt-4"
        style="border-radius: 16px"
        @click="openThehistory(idx, invoice)"
      >
        <p class="text_one text_grey-3" style="line-height: 10px">
          {{ parseDate(invoice.created) }}
        </p>
        <div class="d-flex justify-content-between">
          <p class="text_one mb float-left text_grey-3">
            Employee - {{ invoice.employee_name }} {{ invoice.visit_id }}
          </p>
          <p class="text_grey-2 float-right mb text_one font-weight-bold">
            {{ getTotalQuantity(invoice.shopping_json) }} ITEMS
          </p>
        </div>
        <div class="d-flex justify-content-between">
          <p class="text_one mb-1 float-left text_grey-3">
            Customer - {{ invoice.shopper_name }} (
            {{ invoice.shopper_phone_number }} )
          </p>
        </div>
        <div
          v-if="
            invoice.address_line1 ||
            invoice.address_line2 ||
            invoice.address_city
          "
          class="d-flex flex-row mt-2 mb-2"
          style="width: 90%"
        >
          <p
            style="width: 100%"
            class="mb text_grey-3 text_two font-weight-bold"
          >
            Address:
            <span v-if="invoice.address_line1" class="blue_text"
              >{{ invoice.address_line1 }}, </span
            ><span v-if="invoice.address_line2" class="blue_text"
              >{{ invoice.address_line2 }}, </span
            ><span v-if="invoice.address_city" class="blue_text">{{
              invoice.address_city
            }}</span>
          </p>
        </div>
        <img
          v-if="ext.includes(idx)"
          alt="pic"
          class="pb-3"
          src="@/static/icons/vender/white_line.webp"
        />
        <div v-if="ext.includes(idx)" class="d-flex justify-content-between">
          <p class="text_two mb float-left text_grey-3">Total Amount</p>
          <p class="text_grey-2 float-right mb text_two font-weight-bold">
            Rs {{ getTotalPrice(invoice.shopping_json) }}
          </p>
        </div>
        <div v-if="ext.includes(idx)" class="d-flex justify-content-between">
          <p class="text_two mb float-left text_grey-3">Discount</p>
          <p class="text_grey-2 float-right mb text_two font-weight-bold">
            Rs {{ getDiscountPrice(invoice.shopping_json) }}
          </p>
        </div>
        <div
          v-if="ext.includes(idx) && oogacash !== 0"
          class="d-flex justify-content-between"
        >
          <p class="text_two mb float-left text_grey-3">Oogacash used</p>
          <p class="text_grey-2 float-right mb text_two font-weight-bold">
            Rs {{ oogacash }}
          </p>
        </div>
        <div
          v-if="ext.includes(idx) && OOGaDiscount"
          class="d-flex justify-content-between"
        >
          <p class="text_two mb float-left text_grey-3">Ooga Discount</p>
          <p class="text_grey-2 float-right mb text_two font-weight-bold">
            Rs {{ OOGaDiscount }}
          </p>
        </div>
        <div
          v-if="ext.includes(idx) && OOgaGift"
          class="d-flex justify-content-between"
        >
          <p class="text_two mb float-left text_grey-3">Ooga Gift</p>
          <p class="text_grey-2 float-right mb text_two font-weight-bold">
            {{ OOgaGift[0].item_details.name }}
          </p>
        </div>
        <div
          v-if="ext.includes(idx) && OOgaGift"
          class="d-flex justify-content-between"
        >
          <p class="text_two mb float-left text_grey-3">Ooga Gift Price</p>
          <p class="text_grey-2 float-right mb text_two font-weight-bold">
            Rs: {{ OOgaGift[0].item_details.unit_price }}
          </p>
        </div>
        <div v-if="ext.includes(idx)" class="d-flex justify-content-between">
          <p
            class="text_two blue_text mb float-left text_grey-3 font-weight-bold"
          >
            Final Amount
          </p>
          <p
            class="text_grey-2 blue_text float-right mb text_two font-weight-bold"
          >
            Rs
            {{
              parseFloat(getFinalPrice(invoice.shopping_json)).toFixed(2) -
              oogacash
            }}
          </p>
        </div>
        <img
          v-if="ext.includes(idx)"
          alt="pic"
          class="pt-3"
          src="@/static/icons/vender/white_line.webp"
        />
        <div
          v-if="ext.includes(idx)"
          class="d-flex justify-content-center flex-wrap"
        >
          <div class="big_box">
            <div class="d-flex justify-content-between align-items-center">
              <p class="float-left text_two dark_gray ml-3 mt-2">Item List</p>
              <p class="float-right text_two dark_gray mr-3 mt-2">
                {{ getTotalQuantity(invoice.shopping_json) }} ITEMS
              </p>
            </div>
            <div
              v-for="(item, idy) in invoiceItems"
              :key="idy"
              style="overflow-x: hidden; width: 80vw"
            >
              <div class="pt-3" style="width: 100%">
                <div>
                  <img
                    v-if="item.item_details.picurl === ''"
                    src="@/static/OogashopBusiness.png"
                    alt="pic"
                    class="float-left ml-3"
                    style="border-radius: 10px"
                    height="95"
                    width="60"
                  />
                  <img
                    v-else
                    alt="pic"
                    class="float-left ml-3"
                    style="border-radius: 10px"
                    :src="imageSource1(item.item_details.picurl)"
                    height="95"
                    width="60"
                  />
                </div>
                <div
                  style="margin-left: 7rem; height: 17vh"
                  class="flex-grow-1"
                >
                  <p class="gray mb text_zero">
                    {{ item.item_details.brand }}
                  </p>
                  <p class="mb text_two">
                    {{ item.item_details.name }}
                  </p>
                  <p class="gray text_one mb">
                    {{ item.item_details.quantity }}
                    {{ item.item_details.units }}
                  </p>
                  <p class="dark_gray mt-4 text_two float-left">
                    Rs
                    {{
                      invoice.shopping_json[
                        idy
                      ].final_chosen.unit_price.toFixed(2) *
                        invoice.shopping_json[
                          idy
                        ].final_chosen.quantity.toFixed(2) -
                      invoice.shopping_json[idy].final_chosen.quantity.toFixed(
                        2
                      ) *
                        invoice.shopping_json[
                          idy
                        ].final_chosen.discount.toFixed(2)
                    }}
                  </p>
                  <div
                    class="add_more mt-3 float-right d-flex justify-content-around mb align-items-center"
                  >
                    <p class="mb text_one dark_gray">
                      Qty:
                      {{ invoice.shopping_json[idy].final_chosen.quantity }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="idy !== invoiceItems.length - 1"
                  class="d-flex justify-content-center mt-2"
                >
                  <img
                    alt="pic"
                    src="@/static/icons/vender/white_line.webp"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="ext.includes(idx)"
          class="d-flex justify-content-around mt-3 mb-3"
          style="width: 100%"
        >
          <div
            style="width: 35vw"
            class="btnnn ripple mt-2 d-flex justify-content-center align-items-center"
            @click="
              deleteInv(
                invoice.visit_id,
                invoice.shopping_json,
                invoice.shopper_phone_number,
                'barCodeGun'
              )
            "
          >
            <p class="text_one blue_text mb font-weight-bold">
              Send To Barcode
            </p>
          </div>
          <!-- <div style="width: 35vw;" class="btnnn ripple mt-2 d-flex justify-content-center align-items-center" @click="deleteInv(invoice.visit_id, invoice.shopping_json, invoice.shopper_phone_number, 'cart')">
            <p class="text_one blue_text mb font-weight-bold">
              Send To Live Order
            </p>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      orders: [],
      invoiceItems: [],
      ext: [],
      OOgaGift: null,
      oogacash: 0,
    };
  },
  async mounted() {
    const today = new Date();
    const date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let pastOrders = [];
    if (localStorage.getItem(date)) {
      pastOrders = JSON.parse(localStorage.getItem(date));
    }
    const payload = { visitIDs: pastOrders };
    let data = await this.getVisitData(payload);
    data = data ? data.filter((key) => key.shopping_json.length) : [];
    this.orders = [...data];
  },
  methods: {
    async getVisitData(arr) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/updatedInvoiceList",
          data: arr,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('Credential'),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async deleteInv(visitID, data, num, redirect) {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const past = JSON.parse(localStorage.getItem(date));
      const arr = [...past];
      const index = arr.indexOf(visitID);
      arr.splice(index, 1);
      localStorage.setItem(date, JSON.stringify(arr));
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/discardVisit?visit_id=${visitID}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('Credential'),
          },
        });
        // eslint-disable-next-line no-console
        console.log(data);
        data.forEach((item) => this.$store.commit("addToCartAlpha", item));
        this.$store.commit("add_phone_num", num);
        this.$store.commit("EnterToNumber", [num.substring(3, num.length)]);
        this.$store.commit("SET_VISIT", visitID);
        this.$store.commit("delInvoice", true);
        redirect === "barCodeGun"
          ? this.$router.push("/barCodeGun")
          : this.$router.push("/cart");
        console.log(response);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    getFinalPrice(invoice) {
      let total = 0;
      invoice.forEach((item) => {
        total +=
          item.final_chosen.unit_price * item.final_chosen.quantity -
          item.final_chosen.discount * item.final_chosen.quantity;
      });
      if (this.OOGaDiscount) {
        const OogaDis = this.OOGaDiscount;
        total = total.toFixed(2) - OogaDis;
      } else {
        total = total.toFixed(2);
      }
      return total;
    },
    getDiscountPrice(invoice) {
      let discount = 0;
      invoice.forEach((item) => {
        discount += item.final_chosen.discount * item.final_chosen.quantity;
      });
      discount = discount.toFixed(2);
      return discount;
    },
    getTotalQuantity(invoice) {
      let total = 0;
      invoice.forEach((item) => {
        total += item.final_chosen.quantity;
      });
      return total;
    },
    parseDate(dateString) {
      const date = new Date(dateString);
      const days = [
        "SUNDAY",
        "MONDAY",
        "TUESDAY",
        "WEDNESDAY",
        "THURSDAY",
        "FRIDAY",
        "SATURDAY",
      ];
      const months = [
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ];
      return `${days[date.getDay()]} ${date.getDate()} ${
        months[date.getMonth()]
      } ${date.getFullYear()}`;
    },
    async openThehistory(idx, invoice, event) {
      this.OOgaGift = null;
      this.OOGaDiscount = null;
      this.data = invoice;
      if (!this.ext.includes(idx)) {
        this.invoiceItems = [];
        this.ext = [];
        this.ext.push(idx);
        let itemIDS = [];
        itemIDS = this.getItemID(this.orders[idx].shopping_json);
        // this.getOogaDiscountPrice(this.orders[idx].visit_id);
        const invoiceItems = await this.getItemsFromID(itemIDS);
        // debugger
        if (invoiceItems !== undefined) {
          this.invoiceItems = invoiceItems;
        } else {
          alert(
            "Failed to fetch invoice item details. Check logs for more info."
          );
        }
      } else {
        this.invoiceItems = [];
        this.ext = [];
      }
      // this.oogacash = 0;
      // const arr = await this.usedOogacash(invoice.visit_id);
      // if (arr.length > 0) {
      //   this.oogacash = arr[0].amount.toFixed(2);
      // }
    },
    imageSource(url) {
      if (url && !url.includes("https")) {
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
    async usedOogacash(id) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getOOGACASHUsed/${id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('Credential'),
          },
        });
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        alert("Failed to update visit! Check logs for more info.");
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
            Authorization: localStorage.getItem('Credential'),
          },
          data: listOfItemIDS,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    getTotalPrice(invoice) {
      let total = 0;
      invoice.forEach((item) => {
        total += item.final_chosen.unit_price * item.final_chosen.quantity;
      });
      total = total.toFixed(2);
      return total;
    },
    getItemID(items) {
      const itemIDs = [];
      items.forEach((item) => itemIDs.push(item.final_chosen.item_id));
      return itemIDs;
    },
    async getOogaDiscountPrice(arg) {
      let response = null;
      const thiz = this;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/showOOGADiscountGiftForVisit/${arg}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('Credential'),
          },
          progress: false,
        });
        if (response.data.ooga_discount.length > 0) {
          const t2 = response.data.ooga_discount[0].total_ooga_discount;
          thiz.OOGaDiscount = t2.toFixed(2);
        }
        if (response.data.surprise_gift.length > 0) {
          const itemId = [];
          itemId.push(response.data.surprise_gift[0].gift_item_id);
          thiz.OOgaGift = await this.getItemsFromID(itemId);
        }
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
  },
};
</script>
<style>
.full_box_size {
  width: 85vw;
}
</style>
