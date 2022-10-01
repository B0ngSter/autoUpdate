<template>
  <div
    class="full"
    style="
      background-color: #f0f0f3;
      min-height: 100vh;
      overflow-y: scroll;
      overflow-x: hidden;
    "
  >
    <div class="scroll">
      <div style="position: fixed; width: 100vw">
        <div
          class="d-flex justify-content-around pt-4 pb-1"
          style="
            background: linear-gradient(180deg, #b5dcf6 0%, #d2e9f9 100%);
            box-shadow: 0 1px 2px 0 rgba(92, 165, 214, 0.8);
          "
        >
          <div class="d-flex justify-content-center align-items-center">
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
                  if (completed === 4) {
                    completed = 3;
                    check = false;
                    SearchedResult = [];
                    search_input = '';
                  } else if (openInput) {
                    openInput = false;
                  } else {
                    $router.push('/home');
                  }
                }
              "
            >
              <img
                alt="pic"
                src="../static/Backward_arrow.webp"
                height="30"
                width="30"
              />
            </div>
          </div>
          <div class="d-flex justify-content-center align-items-center">
            <p class="text_four font-weight-bold pt-2">Invoice Details</p>
          </div>
          <div class="d-flex mt-3 justify-content-start align-items-center">
            <div
              class="addSupp d-flex justify-content-center align-items-center pt-2 pb-2 pr-2 pl-2"
              style="
                background-color: #f3f3f3;
                border-radius: 20px;
                cursor: pointer;
              "
              @click="dwnldSales()"
            >
              <p class="supp m-0" style="font-weight: bold">Daily Report</p>
            </div>
          </div>
        </div>
        <div
          v-if="completed !== 4 && !openInput"
          class="d-flex justify-content-center"
        >
          <div class="deep d-flex justify-content-around align-items-center">
            <div
              class="d-flex justify-content-center align-items-center"
              :class="completed === 1 ? 'inside_box' : 'outside_box'"
              @click="
                invoiceItems = [];
                ext = [];
                completed = 1;
              "
            >
              <p class="text_three font-weight-bold mt-0 mb">Pending</p>
            </div>
            <div
              class="d-flex justify-content-center align-items-center"
              :class="completed === 2 ? 'inside_box' : 'outside_box'"
              @click="
                invoiceItems = [];
                ext = [];
                completed = 2;
              "
            >
              <p class="text_three font-weight-bold mt-0 mb">Completed</p>
            </div>
            <!-- <div class="d-flex justify-content-center align-items-center" :class="completed===3 ? 'inside_box' : 'outside_box'" @click="invoiceItems = []; ext = []; completed = 3">
              <p class="text_three font-weight-bold mb">
                Khata
              </p>
            </div> -->
          </div>
        </div>
      </div>
      <div
        v-if="spinner"
        class="d-flex justify-content-center align-items-center"
        style="height: 80vh"
      >
        <div
          class="spinner-border"
          style="width: 3rem; height: 3rem"
          role="status"
        >
          <span class="sr-only">Loading...</span>
        </div>
      </div>
      <!-- <div class="dateStuff d-flex justify-content-start align-items-center">
        <p class="pl-4 mb font-weight-bold">
          date
        </p>
      </div> -->
      <!-- <div v-if="completed===3" style="width:85vw" class="d-flex justify-content-center mx-auto flex-wrap mt-7 mb-8">
        <div class="mt-3 mb-2 p-3" style="width: 100%;border-radius: 16px;background-color: #F0F0F3; border: 2px solid #F0F0F3; box-shadow: 4px 4px 6px 0 #C6C6D2, -4px -4px 6px 0 #FFF;">
          <div class="d-flex justify-content-between align-items-center">
            <div style="color: #666;font-size: 10px; line-height: 10px;">
              10:30:45 am
            </div>
            <div style="color: #F3CA3E; font-size: 10px; font-weight: 700; line-height: 12px; text-align: right;">
              PAYMENT NOT VERIFIED
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-1">
            <div style="color: #666;font-size: 10px; line-height: 10px;">
              Manager - Mahesh Kumar
            </div>
            <div style="color: #666;font-size: 10px; line-height: 10px;">
              15 ITEMS
            </div>
          </div>
          <div class="d-flex justify-content-between align-items-center mt-1">
            <div style="color: #666;font-size: 10px; line-height: 10px;">
              Customer - +91962723243
            </div>
            <div style="color: #666; font-size: 10px; font-weight: 700; line-height: 14px; text-align: right;">
              RS 5500.00
            </div>
          </div>
        </div>
      </div> -->
      <div
        v-if="(completed === 3 || completed === 4) && !openInput"
        style="margin-top: 23vh; width: 100vw"
        class="justify-content-center d-flex align-items-center"
      >
        <div
          class="search box justify-content-center d-flex align-items-center mb-2"
        >
          <img
            alt="pic"
            class="pl-3"
            src="../static/icons/vender/Search Icon.webp"
          />
          <input
            id="searchBox"
            v-model="search_input"
            v-debounce:2000ms="search_item"
            list="search_box_stuff"
            class="input focus pl-2 pr-5"
            debounce="500"
            placeholder="Search for consumer's name"
            autocomplete="off"
            type="text"
            @focus="completed = 4"
            @focusout="focusOut()"
          />
        </div>
      </div>
      <div
        v-if="
          (CompletedInvoices.length === 0 && completed === 2) ||
          (PendingInvoices.length === 0 && completed === 1) ||
          (KhataInvoices.length === 0 && completed === 3) ||
          (completed === 4 && check && !openInput)
        "
        class="d-flex justify-content-center flex-wrap"
        :class="completed === 3 ? 'mt-2' : 'mt-7'"
      >
        <img alt="pic" src="../static/No Invoice.webp" class="mt-3" />
        <p class="text_three text_black font-weight-bold mt-3">
          You don't have any invoices!
        </p>
      </div>
      <div
        v-if="completed === 4 && !check && !openInput"
        class="d-flex justify-content-center flex-wrap mb-8 wid"
      >
        <div
          v-for="(invoice, idx) in SearchedResult"
          :key="idx"
          class="pl-3 pr-3 pt-3 plateau_box full_box_size mt-4"
          style="border-radius: 16px"
          @click="openTheSearchedItemhistory(idx, invoice)"
        >
          <p class="text_one text_grey-3" style="line-height: 10px">
            {{ parseDate(invoice.created) }}
          </p>
          <div class="d-flex justify-content-between">
            <p class="text_one mb float-left text_grey-3">
              Employee - {{ invoice.employee_name }}
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
          <!-- <img
          alt="pic" v-if="ext.includes(idx)" class="pb-3" src="../static/icons/vender/white_line.webp" /> -->
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
            src="../static/icons/vender/white_line.webp"
          />
          <div
            v-if="ext.includes(idx)"
            class="d-flex justify-content-center flex-wrap"
          >
            <div class="big_box">
              <p class="float-left text_two dark_gray ml-3 mt-2">Item List</p>
              <p class="float-right text_two dark_gray mr-3 mt-2">
                {{ getTotalQuantity(invoice.shopping_json) }} ITEMS
              </p>
              <div
                v-for="(item, idy) in invoiceItems"
                :key="idy"
                style="overflow-x: hidden"
                :class="{ mtop: idy === 0 }"
              >
                <div
                  :class="{ 'pt-4': idx === 0, 'pt-3': idx > 0 }"
                  style="width: 100%"
                >
                  <div>
                    <img
                      v-if="item.item_details.picurl === ''"
                      alt="pic"
                      class="float-left ml-3"
                      style="border-radius: 10px"
                      src="../static/OogashopBusiness.png"
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
                        invoice.shopping_json[
                          idy
                        ].final_chosen.quantity.toFixed(2) *
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
                      src="../static/icons/vender/white_line.webp"
                    />
                  </div>
                </div>
              </div>
            </div>
            <div
              v-if="!invoice.payment_completed"
              class="d-flex justify-content-around mb-3"
              style="width: 100%"
            >
              <div
                style="width: 35vw"
                class="btnnn ripple mt-2 d-flex justify-content-center align-items-center"
                @click="
                  PaymentSuccess(
                    invoice.payment_id,
                    invoice.visit_id,
                    true,
                    idx
                  )
                "
              >
                <p class="text_one blue_text mb font-weight-bold">Paid</p>
              </div>
              <!-- <div style="width: 35vw;" class="btnnn ripple mt-2 d-flex justify-content-center align-items-center" @click="PaymentSuccess(invoice.payment_id, invoice.visit_id, false, idx)">
                <p class="text_one text_red mb font-weight-bold">
                  Not paid
                </p>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="completed === 3 && !openInput"
        class="d-flex justify-content-center flex-wrap mb-8 wid10"
      >
        <div
          v-for="(invoice, idx) in KhataInvoices"
          :key="idx"
          class="pl-3 pr-3 pt-3 plateau_box full_box_size mt-4"
          style="border-radius: 16px"
          @click="openThehistory(idx, 'khata', invoice)"
        >
          <p class="text_one text_grey-3" style="line-height: 10px">
            {{ parseDate(invoice.created) }}
          </p>
          <div class="d-flex justify-content-between">
            <p class="text_one mb float-left text_grey-3">
              Employee - {{ invoice.employee_name }}
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
          <!-- <img
          alt="pic" v-if="ext.includes(idx)" class="pb-3" src="../static/icons/vender/white_line.webp" /> -->
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
            src="../static/icons/vender/white_line.webp"
          />
          <div
            v-if="ext.includes(idx)"
            class="d-flex justify-content-center flex-wrap"
          >
            <div class="big_box">
              <p class="float-left text_two dark_gray ml-3 mt-2">Item List</p>
              <p class="float-right text_two dark_gray mr-3 mt-2">
                {{ getTotalQuantity(invoice.shopping_json) }} ITEMS
              </p>
              <div
                v-for="(item, idy) in invoiceItems"
                :key="idy"
                style="overflow-x: hidden"
                :class="{ mtop: idy === 0 }"
              >
                <div
                  :class="{ 'pt-4': idx === 0, 'pt-3': idx > 0 }"
                  style="width: 100%"
                >
                  <div>
                    <img
                      v-if="item.item_details.picurl === ''"
                      src="../static/OogashopBusiness.png"
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
                        invoice.shopping_json[
                          idy
                        ].final_chosen.quantity.toFixed(2) *
                          invoice.shopping_json[
                            idy
                          ].final_chosen.discount.toFixed(2)
                      }}
                    </p>
                    <div
                      class="add_more mt-3 float-right d-flex justify-content-center mb align-items-center"
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
                      src="../static/icons/vender/white_line.webp"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- <div v-if="!invoice.payment_completed && !$store.getters.modeOff" class="d-flex justify-content-between align-items-centre mt-3 mb-3" style="width: 100%;" @click="stopPropogation($event)">
              <div style="color: #404040; font-size: 14px;font-weight: 700;line-height: 18px;">
                Select Payment mode:
              </div>
              <select v-model="curr" @change="selectMode()">
                <option v-for="(mode,i) in modes" :key="i" :value="mode">
                  {{ mode }}
                </option>
              </select>
            </div> -->
            <div
              v-if="!invoice.payment_completed"
              class="d-flex justify-content-around mb-3"
              style="width: 100%"
            >
              <!-- <div style="width: 35vw;" class="btnnn ripple mt-2 d-flex justify-content-center align-items-center" @click="PaymentSuccess(invoice.payment_id, invoice.visit_id, true, idx)">
                <p class="text_one blue_text mb font-weight-bold">
                  Paid
                </p>
              </div> -->
              <div
                style="width: 40%"
                class="btnnn ripple mt-2 d-flex justify-content-center align-items-center"
                @click="KhataDowloadpdf(invoice.visit_id)"
              >
                <p class="text_one blue_text mb pl-2 pr-2 font-weight-bold">
                  Khata Estimate
                </p>
              </div>
              <div
                style="width: 40%"
                class="btnnn ripple mt-2 d-flex justify-content-center align-items-center"
                @click="KhataDwnldOld(invoice.visit_id)"
              >
                <p class="text_one blue_text mb pl-2 pr-2 font-weight-bold">
                  Khata Estimate (Old Android)
                </p>
              </div>
              <a
                :href="shareLink"
                target="_blank"
                style="
                  box-shadow: 4px 4px 4px 0 #c6c6d2,
                    -4px -4px 4px 0 rgba(255, 255, 255, 0.8);
                  border-radius: 70px;
                  padding: 3px;
                "
                class="circ12 ml-4 d-flex justify-content-end align-items-center"
                :class="
                  $store.getters.theme
                    ? 'darkMode darkShadow'
                    : 'lightMode lightShadow'
                "
              >
                <img src="../static/WhatsApp.png" width="35" height="35" />
              </a>
              <!-- <div style="width: 35vw;" class="btnnn ripple mt-2 d-flex justify-content-center align-items-center" @click="PaymentSuccess(invoice.payment_id, invoice.visit_id, false, idx)">
                <p class="text_one text_red mb font-weight-bold">
                  Not paid
                </p>
              </div> -->
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="completed === 2 && !openInput"
        class="d-flex justify-content-center flex-wrap mt-7 mb-8 wid"
      >
        <div
          v-for="(invoice, idx) in CompletedInvoices"
          :key="idx"
          class="pl-3 pr-3 pt-3 plateau_box full_box_size mt-4"
          style="border-radius: 16px"
          @click="openThehistory(idx, 'completed', invoice, $event)"
        >
          <div class="d-flex justify-content-between">
            <p class="text_one text_grey-3" style="line-height: 10px">
              {{ parseDate(invoice.created) }}
            </p>
            <p
              class="mb text_one"
              :class="
                invoice.invoice_status === 'incomplete'
                  ? 'text_orange'
                  : 'text_green'
              "
            >
              {{ paymentStatus(invoice.invoice_status) }}
            </p>
          </div>
          <div class="d-flex justify-content-between">
            <p class="text_one mb float-left text_grey-3">
              Employee - {{ invoice.employee_name }}
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
            <p
              class="float-right mb text_one font-weight-bolder"
              style="color: #ff6c34"
            >
              {{ invoice.payment_mode }}
            </p>
          </div>
          <!-- <img
          alt="pic" v-if="ext.includes(idx)" class="pb-3" src="../static/icons/vender/white_line.webp" /> -->
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
            src="../static/icons/vender/white_line.webp"
          />
          <div
            v-if="ext.includes(idx)"
            class="d-flex justify-content-center flex-wrap"
          >
            <div class="big_box">
              <p class="float-left text_two dark_gray ml-3 mt-2">Item List</p>
              <p class="float-right text_two dark_gray mr-3 mt-2">
                {{ getTotalQuantity(invoice.shopping_json) }} ITEMS
              </p>
              <div
                v-for="(item, idy) in invoiceItems"
                :key="idy"
                style="overflow-x: hidden"
                :class="{ mtop: idy === 0 }"
              >
                <div
                  :class="{ 'pt-4': idx === 0, 'pt-3': idx > 0 }"
                  style="width: 100%"
                >
                  <div>
                    <img
                      v-if="item.item_details.picurl === ''"
                      alt="pic"
                      class="float-left ml-3"
                      style="border-radius: 10px"
                      src="../static/OogashopBusiness.png"
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
                        invoice.shopping_json[
                          idy
                        ].final_chosen.quantity.toFixed(2) *
                          invoice.shopping_json[
                            idy
                          ].final_chosen.discount.toFixed(2)
                      }}
                    </p>
                    <div
                      class="add_more mt-3 float-right d-flex justify-content-center mb align-items-center"
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
                      src="../static/icons/vender/white_line.webp"
                    />
                  </div>
                </div>
              </div>
              <div
                class="d-flex justify-content-between mb-5"
                style="
                  width: 95%;
                  margin-left: auto;
                  margin-right: auto;
                  flex-wrap: wrap;
                "
              >
                <div
                  class="d-flex justify-content-center align-items-center outside_box wids"
                  style="width: 20%; text-align: center"
                  @click="downloudableInvoice(invoice.visit_id, $event)"
                >
                  <p class="text_three font-weight-bold mb">Print Estimate</p>
                </div>
                <div
                  class="d-flex justify-content-center align-items-center outside_box wids"
                  style="width: 20%; text-align: center"
                  @click="dwnldThinInvoice(invoice.visit_id, $event)"
                >
                  <p class="text_three font-weight-bold mb">
                    Print Thin Estimate
                  </p>
                </div>
                <!-- <div
                  class="d-flex justify-content-center align-items-center outside_box wids"
                  style="width: 30%; text-align: center"
                  @click="dwnldThinInvoiceOld(invoice.visit_id, $event)"
                >
                  <p class="text_three font-weight-bold mb">
                    Print Thin Estimate <br />
                    (Old Android)
                  </p>
                </div> -->
                <div
                  class="d-flex justify-content-center align-items-center outside_box wids"
                  style="width: 20%; text-align: center"
                  @click="dowloadpdf(invoice.visit_id, $event)"
                >
                  <p class="text_three font-weight-bold mb">Print Invoice</p>
                </div>
                <div
                  class="d-flex justify-content-center align-items-center outside_box wids"
                  style="width: 20%; text-align: center"
                  @click="dowloadA4Pdf(invoice.visit_id, $event)"
                >
                  <p class="text_three font-weight-bold mb">
                    Print Invoice (A4)
                  </p>
                </div>
              </div>
              <!-- <div class="d-flex justify-content-center flex-wrap mb-5" style="width: 95%;margin-left:auto;margin-right: auto;flex-wrap:wrap">
                <a :href="SupLink" target="_blank" style="box-shadow: 4px 4px 4px 0 #C6C6D2, -4px -4px 4px 0 rgba(255,255,255,0.8);border-radius: 70px; padding: 3px;" class="circ12 ml-4 d-flex justify-content-end align-items-center" :class="$store.getters.theme?'darkMode darkShadow':'lightMode lightShadow'">
                  <img src="../static/WhatsApp.png" width="35" height="35" />
                </a>
                <p style="width: 100%;" class="text-center text_one text_grey-3 mt-2">
                  Share the bill using Whatsapp
                </p>
              </div> -->
              <div
                v-if="
                  invoice.order_type === 'Shop Billed' &&
                  showBtn(invoice.created)
                "
                class="d-flex justify-content-center mb-5"
                style="width: 100%"
              >
                <div
                  class="d-flex justify-content-center align-items-center outside_box wids"
                  style="width: 125px"
                  @click="
                    ($event) => {
                      $event.stopPropagation();
                      PopUpDelete = true;
                    }
                  "
                >
                  <p class="text_three font-weight-bold mb">Delete</p>
                </div>
              </div>
              <div
                id="myModal"
                v-if="PopUpDelete"
                class="modal d-flex justify-content-center flex-wrap"
                @click="popUp($event)"
                style="border-radius: 10px; syntax: 80vw"
              >
                <div class="modal-content">
                  <p class="m-0 name">
                    Do you want to delete this invoice and take cart items to
                    Live Order/Barcode Gun billing
                  </p>
                  <div
                    style="width: 100%"
                    class="d-flex justify-content-between mt-2"
                  >
                    <div
                      style="z-index: 1; width: 45%"
                      class="btnnn m-3 d-flex justify-content-center align-items-center"
                      @click="deleteInvoiceItem(invoice.visit_id)"
                    >
                      <p class="text_two mb text_dark font-weight-bold">
                        Delete
                      </p>
                    </div>
                    <!-- <div style="z-index: 1; width: 40%;" class="btnnn m-3 d-flex justify-content-center align-items-center" @click="deleteInv(invoice.visit_id, invoice.shopping_json, invoice.shopper_phone_number, 'cart')">
                      <p class="text_two mb blue_text font-weight-bold">
                        liveOrder
                      </p>
                    </div> -->
                    <div
                      style="z-index: 1; width: 45%"
                      class="btnnn m-3 d-flex justify-content-center align-items-center"
                      @click="
                        deleteInv(
                          invoice.visit_id,
                          invoice.shopping_json,
                          invoice.shopper_phone_number,
                          'barCodeGun'
                        )
                      "
                    >
                      <p class="text_two mb blue_text font-weight-bold">
                        BarcodeGun billing
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="completed === 1 && !openInput"
        class="d-flex justify-content-center flex-wrap mt-7 mb-8 wid"
      >
        <div
          v-for="(invoice, idx) in PendingInvoices"
          :key="idx"
          class="pl-3 pr-3 pt-3 plateau_box full_box_size mt-4"
          style="border-radius: 16px"
          @click="openThehistory(idx, 'pending', invoice)"
        >
          <p class="text_one text_grey-3" style="line-height: 10px">
            {{ parseDate(invoice.created) }}
          </p>
          <div class="d-flex justify-content-between">
            <p class="text_one mb float-left text_grey-3">
              Employee - {{ invoice.employee_name }}
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
          <!-- <img
          alt="pic" v-if="ext.includes(idx)" class="pb-3" src="../static/icons/vender/white_line.webp" /> -->
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
            src="../static/icons/vender/white_line.webp"
          />
          <div
            v-if="ext.includes(idx)"
            class="d-flex justify-content-center flex-wrap"
          >
            <div class="big_box">
              <p class="float-left text_two dark_gray ml-3 mt-2">Item List</p>
              <p class="float-right text_two dark_gray mr-3 mt-2">
                {{ getTotalQuantity(invoice.shopping_json) }} ITEMS
              </p>
              <div
                v-for="(item, idy) in invoiceItems"
                :key="idy"
                style="overflow-x: hidden"
                :class="{ mtop: idy === 0 }"
              >
                <div
                  :class="{ 'pt-4': idx === 0, 'pt-3': idx > 0 }"
                  style="width: 100%"
                >
                  <div>
                    <img
                      v-if="item.item_details.picurl === ''"
                      alt="pic"
                      class="float-left ml-3"
                      style="border-radius: 10px"
                      src="../static/OogashopBusiness.png"
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
                        invoice.shopping_json[
                          idy
                        ].final_chosen.quantity.toFixed(2) *
                          invoice.shopping_json[
                            idy
                          ].final_chosen.discount.toFixed(2)
                      }}
                    </p>
                    <div
                      class="add_more mt-3 float-right d-flex justify-content-center mb align-items-center"
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
                      src="../static/icons/vender/white_line.webp"
                    />
                  </div>
                </div>
              </div>
            </div>
            <!-- <div class="mt-2 mb-2 p-2 d-flex justify-content-center align-items-center" style="background-color: #353CEE;width:100%" @click="checkName(invoice.shopper_phone_number, invoice.shopper_name)">
              <p class="m-0 text_1">
                ADD TO KHATA
              </p>
            </div> -->
            <div
              v-if="!invoice.payment_completed && !$store.getters.modeOff"
              class="d-flex justify-content-between align-items-centre mt-3 mb-3"
              style="width: 100%"
              @click="stopPropogation($event)"
            >
              <div
                style="
                  color: #404040;
                  font-size: 14px;
                  font-weight: 700;
                  line-height: 18px;
                "
              >
                Select Payment mode:
              </div>
              <select v-model="curr" @change="selectMode()">
                <option v-for="(mode, i) in modes" :key="i" :value="mode">
                  {{ mode }}
                </option>
              </select>
            </div>
            <div class="d-flex justify-content-center mb-5" style="width: 100%">
              <a
                :href="tokenLink"
                target="_blank"
                class="d-flex justify-content-center align-items-center outside_box wids p-1"
                @click="
                  ($event) => {
                    $event.stopPropagation();
                  }
                "
              >
                <p class="text_three font-weight-bold mb">Download Token</p>
              </a>
            </div>
            <div
              v-if="!invoice.payment_completed"
              class="d-flex justify-content-around mb-3"
              style="width: 100%"
            >
              <div
                style="width: 35vw"
                class="btnnn ripple mt-2 d-flex justify-content-center align-items-center"
                @click="
                  PaymentSuccess(
                    invoice.payment_id,
                    invoice.visit_id,
                    true,
                    idx
                  )
                "
              >
                <p class="text_one blue_text mb font-weight-bold">
                  Payment done
                </p>
              </div>
              <div
                style="width: 35vw"
                class="btnnn ripple mt-2 d-flex justify-content-center align-items-center"
                @click="
                  PaymentSuccess(
                    invoice.payment_id,
                    invoice.visit_id,
                    false,
                    idx
                  )
                "
              >
                <p class="text_one text_red mb font-weight-bold">Not paid</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div v-if="openInput" style="width: 90%;margin: 0 auto; margin-top: 7.5rem">
        <div class="text mt-2">Items:</div>
        <div class="back p-2 d-flex justify-content-between align-items-center">
          <div style="width: 45%">
            <label for="input" class="text1">Consumer Name</label>
            <div class="d-flex justify-content-between">
              <input
                v-model="consumer_name"
                type="text"
                class="inputs pl-2 mt-1 focus"
              />
            </div>
            <label v-if="consumer_name" for="input" class="text_red"
              >Please do not leave this blank</label
            >
          </div>
          <div style="width: 45%">
            <label for="input" class="text1">Consumer Phone Number</label>
            <div class="d-flex justify-content-between">
              <input
                v-model="consumer_phn"
                type="text"
                class="inputs pl-2 mt-1 focus"
              />
            </div>
            <label v-if="consumer_phn" for="input" class="text_red"
              >Please do not leave this blank</label
            >
          </div>
        </div>
        <div class="back p-2 d-flex justify-content-between align-items-center">
          <div style="width: 45%">
            <label for="input" class="text1">Consumer GST</label>
            <div class="d-flex justify-content-between">
              <input
                v-model="consumer_gst"
                type="text"
                class="inputs pl-2 mt-1 focus"
              />
            </div>
            <label v-if="consumer_gst" for="input" class="text_red"
              >Please do not leave this blank</label
            >
          </div>
        </div>
        <div
          v-for="(item, i) in invoiceItems1"
          :key="i"
          class="mt-3 p-3 back d-flex justify-content-between align-items-center"
        >
          <div style="width: 100%">
            <div
              class="d-flex justify-content-between align-items-center"
              @click="openDetails(item, i)"
            >
              <div
                class="d-flex justify-content-start align-items-center"
                style="width: 100%"
              >
                <img
                  src="../static/OogashopBusiness.png"
                  width="48"
                  height="64"
                />
                <div class="ml-2">
                  <div
                    class="mb-1"
                    style="color: #8d8da5; font-size: 10px; line-height: 10px"
                  >
                    {{ item.item_details.brand }}
                  </div>
                  <div
                    class="mb-1"
                    style="color: #303234; font-size: 14px; line-height: 12px"
                  >
                    {{ item.item_details.name }}
                  </div>
                  <div
                    style="color: #8d8da5; font-size: 10px; line-height: 10px"
                  >
                    {{ item.item_details.quantity }}
                    {{ item.item_details.units }}
                  </div>
                </div>
              </div>
            </div>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-between align-items-center"
            >
              <div style="color: #303234; font-size: 14px; line-height: 12px">
                ITEM DETAILS
              </div>
              <!-- <img src="../static/icons/down.png" width="24" height="24" /> -->
            </div>
            <div v-if="indexArr.includes(i)">
              <div
                class="back p-2 d-flex justify-content-between align-items-center"
              >
                <div style="width: 45%">
                  <label for="input" class="text1">PURCHASE RATE</label>
                  <div class="d-flex justify-content-between">
                    <input
                      v-model="item.purchase_rate"
                      type="text"
                      class="inputs pl-2 mt-1 focus"
                    />
                  </div>
                </div>
              </div>
              <!-- <div
                class="back p-2 d-flex justify-content-start align-items-center"
              >
                <div style="width: 100%">
                  <label for="input" class="text1">HSN NUMBER</label>
                  <div class="d-flex justify-content-between">
                    <input
                      v-model="item.hsn_code"
                      type="text"
                      class="inputs pl-2 mt-1 focus"
                    />
                  </div>
                  <label
                    v-if="item.hsn_code === '' && breakLoop"
                    for="input"
                    class="text_red"
                    >Please do not leave this blank</label
                  >
                </div>
              </div> -->
              <div
                class="back p-2 d-flex justify-content-between align-items-center"
              >
                <div style="width: 45%">
                  <label for="input" class="text1">CGST %</label>
                  <div class="d-flex justify-content-between">
                    <input
                      v-model="item.cgst_rate"
                      type="text"
                      class="inputs pl-2 mt-1 focus"
                    />
                  </div>
                  <label
                    v-if="item.cgst_rate === 0 && breakLoop"
                    for="input"
                    class="text_red"
                    >Please do not leave this blank</label
                  >
                </div>
                <div style="width: 45%">
                  <label for="input" class="text1">SGST %</label>
                  <div class="d-flex justify-content-between">
                    <input
                      v-model="item.sgst_rate"
                      type="text"
                      class="inputs pl-2 mt-1 focus"
                    />
                  </div>
                  <label
                    v-if="item.sgst_rate === 0 && breakLoop"
                    for="input"
                    class="text_red"
                    >Please do not leave this blank</label
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="comp1"
          class="mt-2"
          style="font-size: 12px; font-weight: bold; color: red"
        >
          * Click to fill all the details of individual items
        </div>
      </div>
      <div
        v-if="openInput"
        style="position: fixed; bottom: 30px; width: 100%"
        class="d-flex justify-content-center"
      >
        <div
          class="addSupp d-flex justify-content-center align-items-center pt-2 pl-2 pr-2 pb-2"
          style="background-color: #bbdff6; border-radius: 20px"
          @click="dwnld()"
        >
          <p class="supp m-0" style="font-weight: bold">Download GST Invoice</p>
        </div>
      </div>
      <!-- <div class="foot d-flex justify-content-around pt-3 pb-3">
        <div style="width: 35vw;" class="btnnn ripple mt-2 d-flex justify-content-center align-items-center" @click="$router.push('/vender_home')">
          <p class="text_two text_red mb font-weight-bold">
            HOME
          </p>
        </div>
        <div style="width: 35vw;" class="btnnn ripple mt-2 d-flex justify-content-center align-items-center">
          <p class="text_grey-3 text_two mb font-weight-bold">
            SHARE INVOICE
          </p>
        </div>
      </div> -->
      <div
        id="modal-sm"
        v-if="add"
        body-class="modat d-flex justify-content-center flex-wrap"
        style="border-radius: 10px; syntax: 80vw"
      >
        <div style="width: 80%">
          <p class="m-0 name">Edit customer's name</p>
          <p class="mt-2 name1">customer's name</p>
          <input
            id="nameForKhataHolder"
            v-model="name"
            type="text"
            class="inputs pl-2 focus"
            placeholder="Mahesh"
          />
          <label
            v-if="errorMessageForName"
            for="Phone number"
            class="text_red text_three font_c"
            >Please enter Name</label
          ><br />
          <div style="width: 100%" class="d-flex justify-content-between mt-2">
            <div
              style="z-index: 1; width: 40%"
              class="btnnn mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="add = false"
            >
              <p class="text_two mb text_dark font-weight-bold">Cancel</p>
            </div>
            <div
              style="z-index: 1; width: 40%"
              class="btnnn mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="confirm(data.shopper_phone_number)"
            >
              <p class="text_two mb blue_text font-weight-bold">Confirm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { app, BrowserWindow } from "electron";
import { shell } from 'electron'
export default {
  data() {
    return {
      invoice_detail: false,
      ext: [],
      OOGaDiscount: null,
      search_input: "",
      comp: false,
      comp1: false,
      OOgaGift: null,
      SearchedResult: [],
      spinner: null,
      completed: 1,
      CompletedInvoices: [],
      PendingInvoices: [],
      PopUpDelete: false,
      KhataInvoices: [],
      invoiceItems: [],
      oogacash: 0,
      add: false,
      SupLink: "",
      shareLink: "",
      tokenLink: "",
      data: null,
      data1: null,
      name: "",
      errorMessageForName: false,
      invoiceDataToPrint: [],
      ItemsToPrint: [],
      check: false,
      items: [],
      pdf: "",
      invoiceItems1: [],
      vst: null,
      openInput: false,
      indexArr: [],
      modes: [],
      curr: "CASH",
      curr_mode: "CASH",
      a4: false,
      consumer_name: "",
      consumer_phn: "",
      consumer_gst: "",
      auth: null,
    };
  },
  async mounted() {
    this.auth = JSON.parse(localStorage.getItem("storeData"));
    this.$store.commit("toggle", localStorage.getItem("internet") === "true");
    this.$store.commit("modeOff", localStorage.getItem("mode") === "true");
    this.$store.commit("roundOff", localStorage.getItem("roundOff") === "true");
    this.$store.commit("estimate", localStorage.getItem("estimate") === "true");
    this.spinner = true;
    let invoicess = [];
    invoicess = await this.getShopInvoices();
    this.showBtn("03/03/2022");
    // debugger
    // invoicess = [...t1]
    // const completeArr = []
    if (invoicess !== undefined) {
      invoicess = invoicess.filter(
        (invoice) => invoice.shopping_json.length > 0
      );
      invoicess.map((invoice) => {
        invoice.shopping_json.map((items) => {
          if (items.final_chosen.quantity < 1 || !items.final_chosen.item_id) {
            const index = invoicess.findIndex((item) => item === invoice);
            invoicess.splice(index, 1);
            // completeArr.push(invoice)
          }
        });
      });
      // const arr = [...completeArr]
      const arr = [...invoicess];
      this.CompletedInvoices = invoicess.filter(
        (invoice) =>
          invoice.invoice_status === "complete" ||
          invoice.invoice_status === "incomplete"
      );
      // this.CompletedInvoices = completeArr.filter(invoice => invoice.invoice_status === 'complete')
      this.PendingInvoices = arr.filter(
        (invoice) =>
          invoice.invoice_status === "pending" ||
          invoice.invoice_status === "unpaid" ||
          invoice.invoice_status === "consumer needs to accept"
      );
      this.KhataInvoices = arr.filter(
        (invoice) => invoice.invoice_status === "khata"
      );
      this.spinner = false;
    } else {
      this.spinner = false;
      this.$router.go();
    }
    const data = await this.getPaymentMode();
    this.modes = data ? [...data] : [];
  },
  methods: {
    search_item() {
      this.check = false;
      this.ext = [];
      this.SearchedResult = [];
      this.KhataInvoices.forEach((key) => {
        const shopper = this.search_input.toLowerCase();
        const inGameName = key.shopper_name.toLowerCase();
        if (inGameName.includes(shopper)) {
          this.completed = 4;
          this.SearchedResult.push(key);
        }
      });
      if (this.SearchedResult.length === 0) {
        this.check = true;
      }
    },
    selectMode() {
      this.curr_mode = this.curr;
    },
    stopPropogation(e) {
      e.stopPropagation();
    },
    async getPaymentMode() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: "/getPaymentModes",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    openDetails(item, i) {
      if (!this.indexArr.includes(i)) {
        this.indexArr = [];
        this.indexArr.push(i);
      } else {
        this.indexArr = [];
      }
    },
    imageSource1(url) {
      if (url && !url.includes("https")) {
        return process.env.ENV === "dev"
          ? "https://integration.aistore.shop" + url
          : process.env.ENV === "prod"
          ? "https://integration.ooga.shop" + url
          : "http://127.0.0.1:5046" + url;
      } else {
        return url;
      }
    },
    imageSource(url) {
      if (url && !url.includes("https")) {
        return process.env.ENV === "dev"
          ? "https://api.aistore.shop" + url
          : process.env.ENV === "prod"
          ? "https://api.ooga.shop" + url
          : "http://127.0.0.1:4040" + url;
      } else {
        return url;
      }
    },
    focusOut() {
      if (!this.search_input.length) {
        this.completed = 3;
      }
    },
    async shareUsingWhatsapp(visit, phoneNumber) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getEstimatePDFFor/${visit}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        const res = response.data;
        if (res.pdf_link) {
          this.pdf = this.imageSource(res.pdf_link);
          const phoneNum = phoneNumber.slice(1);
          const link = this.pdf;
          // const link = this.pdf + '\n\n' + 'Thank you for shopping with OOGASHOP'
          this.SupLink = "whatsapp://send?text=" + link + "&phone=" + phoneNum;
        }
        return res;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    popUp(e) {
      e.stopPropagation();
      this.PopUpDelete = false;
    },
    addHSN() {
      const arr = [];
      this.invoiceItems1.forEach((key, i) => {
        const datalist = {
          // hsn_data: {
          //   hsn_code: key.hsn_code,
          //   barcode: key.item_details.barcode,
          //   sgst_rate: parseFloat(key.sgst_rate),
          //   cgst_rate: parseFloat(key.cgst_rate),
          //   catalog_item_id: key.item_details.catalog_connection,
          //   inventory_item_id: key.item_details.item_id,
          // },
          grn_data: {
            // hsn_code: key.hsn_code,
            sgst_rate: parseFloat(key.sgst_rate),
            cgst_rate: parseFloat(key.cgst_rate),
            price_currency: "INR",
            purchase_rate: parseFloat(key.purchase_rate),
            inventory_item_id: key.item_details.item_id,
          },
          shop_id: this.auth.shop_id,
        };
        arr.push(datalist);
      });
      this.data1 = [...arr];
    },
    async dwnld() {
      this.invoiceItems1.forEach((key) => {
        if (
          isNaN(key.sgst_rate) ||
          key.sgst_rate === "" ||
          isNaN(key.cgst_rate) ||
          key.cgst_rate === "" ||
          key.purchase_rate === undefined ||
          key.purchase_rate === ""
        ) {
          this.comp = true;
          this.comp1 = true;
        }
      });
      if (this.comp) {
        this.comp = false;
        alert("Please fill all the item details");
        return;
      }
      this.addHSN();
      try {
        const response = await this.$axios({
          method: "POST",
          url: `/createHSNEntries?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: this.data1,
        });
        if (response.status === 200) {
          if (this.a4) {
            this.dowloadA4Pdf(this.vst);
          } else {
            this.dowloadpdf(this.vst);
          }
          this.a4 = false;
          this.openInput = false;
        }
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getAll() {
      let invoicess = [];
      invoicess = await this.getShopInvoices();
      if (invoicess !== undefined) {
        invoicess = invoicess.filter(
          (invoice) => invoice.shopping_json.length > 0
        );
        invoicess.map((invoice) => {
          invoice.shopping_json.map((items) => {
            if (
              items.final_chosen.quantity < 1 ||
              !items.final_chosen.item_id
            ) {
              const index = invoicess.findIndex((item) => item === invoice);
              invoicess.splice(index, 1);
            }
          });
        });
        const arr = [...invoicess];
        this.CompletedInvoices = arr.filter(
          (invoice) =>
            invoice.invoice_status === "complete" ||
            invoice.invoice_status === "incomplete"
        );
        this.PendingInvoices = arr.filter(
          (invoice) =>
            invoice.invoice_status === "pending" ||
            invoice.invoice_status === "unpaid" ||
            invoice.invoice_status === "consumer needs to accept"
        );
        this.KhataInvoices = arr.filter(
          (invoice) => invoice.invoice_status === "khata"
        );
      }
    },
    async addToKhata(item) {
      const data = {
        payment_id: item.payment_id,
        visit_id: item.visit_id,
        timestamp: item.created,
      };
      const res = await this.addKhata(data);
      this.getAll();
      console.log(res);
    },
    async openTheSearchedItemhistory(idx, invoice) {
      this.OOgaGift = null;
      this.OOGaDiscount = null;
      this.data = invoice;
      if (!this.ext.includes(idx)) {
        this.invoiceItems = [];
        this.ext = [];
        this.ext.push(idx);
        let itemIDS = [];
        itemIDS = this.getItemID(this.SearchedResult[idx].shopping_json);
        this.getOogaDiscountPrice(this.SearchedResult[idx].visit_id);
        const invoiceItems = await this.getItemsFromID(itemIDS);
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
      this.oogacash = 0;
      const arr = await this.usedOogacash(invoice.visit_id);
      if (arr.length > 0) {
        this.oogacash = arr[0].amount.toFixed(2);
      }
    },
    async dwnldSales() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getTodaySalesReport?shopID=${
            this.auth.shop_id
          }&day=${new Date().getDate()}&month=${
            new Date().getMonth() + 1
          }&year=${new Date().getFullYear()}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        const href1 = this.imageSource(response.data.product_wise_report);
        const href2 = this.imageSource(response.data.transaction_wise_report);
        const a1 = document.createElement("a");
        a1.href = href1;
        a1.target = "_blank";
        a1.click();
        setTimeout(() => {
          window.location = href2;
        }, 100);
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async openThehistory(idx, status, invoice, event) {
      this.OOgaGift = null;
      this.OOGaDiscount = null;
      this.curr = "CASH";
      this.curr_mode = "CASH";
      if (this.completed === 1) {
        this.getTokenPdf(invoice.visit_id);
      }
      // if (this.completed === 2) {
      //   this.shareUsingWhatsapp(invoice.visit_id, invoice.shopper_phone_number)
      // }
      // if (this.completed === 3) {
      //   this.shareKhata(invoice.visit_id, invoice.shopper_phone_number)
      // }
      this.data = invoice;
      if (!this.ext.includes(idx)) {
        this.invoiceItems = [];
        this.ext = [];
        this.ext.push(idx);
        let itemIDS = [];
        if (status === "completed") {
          itemIDS = this.getItemID(this.CompletedInvoices[idx].shopping_json);
          // this.getOogaDiscountPrice(this.CompletedInvoices[idx].visit_id);
        } else if (status === "pending") {
          itemIDS = this.getItemID(this.PendingInvoices[idx].shopping_json);
          // this.getOogaDiscountPrice(this.PendingInvoices[idx].visit_id);
        } else if (status === "khata") {
          itemIDS = this.getItemID(this.KhataInvoices[idx].shopping_json);
          // this.getOogaDiscountPrice(this.KhataInvoices[idx].visit_id);
        }
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
    async addKhata(data) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/notifyKhataStatus?employeeID=${this.auth.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    // async DownloadPdf (visitId, event) {
    //   let response = null
    //   event.stopPropagation()
    //   try {
    //     response = await this.$axios({
    //       method: 'GET',
    //       url: `/getEstimatePDFFor/${visitId}?shopID=${this.auth.shop_id}`,
    //       headers: {
    //         'Content-Type': 'application/json'//       },
    //       progress: false
    //     })
    //     const fileName = 'Invoice' + visitId + '.pdf'
    //     const save = document.createElement('a')
    //     save.href = this.imageSource(response.data.pdf_link)
    //     save.target = '_blank'
    //     const filename = response.data.pdf_link.substring(response.data.pdf_link.lastIndexOf('/') + 1)
    //     save.download = fileName || filename
    //     if (navigator.userAgent.search('Chrome') < 0) {
    //       document.location = save.href
    //     } else {
    //       const evt = new MouseEvent('click', {
    //         view: window,
    //         bubbles: true,
    //         cancelable: false
    //       })
    //       save.dispatchEvent(evt);
    //       (window.URL || window.webkitURL).revokeObjectURL(save.href)
    //     }
    //     return response.data
    //   } catch (error) {
    //     console.log(error)
    //     return undefined
    //   }
    // },
    async downloudableInvoice(visitId, event) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      event.stopPropagation();
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getEstimatePDFFor/${visitId}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        // const save = document.createElement("a");
        // save.href = this.imageSource(response.data.pdf_link);
        // save.target = "_blank";
        shell.openExternal(this.imageSource(response.data.pdf_link));
        // save.click();
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async dwnldThinInvoice(visitId, event) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      event.stopPropagation();
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getThinEstimatePDFFor/${visitId}?shopID=${this.auth.shop_id}`,
          data,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        shell.openExternal(this.imageSource(response.data.pdf_link))
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async dwnldThinInvoiceOld(visitId, event) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      event.stopPropagation();
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getThinEstimateTXTFor/${visitId}?shopID=${this.auth.shop_id}`,
          data,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        const url = this.imageSource(response.data.txt_link);
        this.$axios({ url, method: "GET", responseType: "blob" }).then(
          (response) => {
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "ThinEstimate.txt");
            document.body.appendChild(link);
            link.click();
          }
        );
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getPdf(visit) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getGSTInvoicePDFFor/${visit}?consumer_name=${this.consumer_name}&consumer_phone_number=${this.consumer_phn}&consumer_gst_number=${this.consumer_gst}&shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getA4Pdf(visit) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
        visitID: parseInt(visit),
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getA4EstimateFor?consumer_name=${this.consumer_name}&consumer_phone_number=${this.consumer_phn}&consumer_gst_number=${this.consumer_gst}&shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getKhataPdf(visit) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getKhataEstimatePDFFor/${visit}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async KhataDowloadpdf(visit) {
      const res = await this.getKhataPdf(visit);
      if (res.pdf_link) {
        shell.openExternal(this.imageSource(res.pdf_link))
      } else if (res.reason && res.reason === "Tax Rates for items missing") {
        this.vst = visit;
        this.openInput = true;
        this.items = [...res.items];
        const res1 = await this.getItemsFromID(this.items);
        this.invoiceItems1 = [...res1];
      } else {
        alert("Fill the shop GST Details in GRN App");
      }
    },
    async KhataDwnldOld(visit) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getKhataEstimateTXTFor/${visit}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
        });
        const res = response.data;
        if (res.txtlink) {
          const url = this.imageSource(res.txtlink);
          this.$axios({ url, method: "GET", responseType: "blob" }).then(
            (response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "KhataEstimate.txt");
              document.body.appendChild(link);
              link.click();
            }
          );
        } else if (res.pdf_link) {
          const url = this.imageSource(res.pdf_link);
          this.$axios({ url, method: "GET", responseType: "blob" }).then(
            (response) => {
              const url = window.URL.createObjectURL(new Blob([response.data]));
              const link = document.createElement("a");
              link.href = url;
              link.setAttribute("download", "KhataEstimate.txt");
              document.body.appendChild(link);
              link.click();
            }
          );
        }
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async shareKhata(visit, phoneNumber) {
      const res = await this.getKhataPdf(visit);
      if (res.pdf_link) {
        const pdf = this.imageSource(res.pdf_link);
        const phoneNum = phoneNumber.slice(1);
        const link = pdf;
        // const link = this.pdf + '\n\n' + 'Thank you for shopping with OOGASHOP'
        this.shareLink = "whatsapp://send?text=" + link + "&phone=" + phoneNum;
      }
    },
    async getToken(visit) {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getTokenEstimatePDFFor/${visit}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getTokenPdf(visit) {
      const res = await this.getToken(visit);
      if (res.pdf_link) {
        const pdf = this.imageSource(res.pdf_link);
        this.tokenLink = pdf;
      }
    },
    async dowloadpdf(visit, event) {
      event.stopPropagation();
      this.comp1 = false;
      const res = await this.getPdf(visit);
      if (res.pdf_link) {
        shell.openExternal(this.imageSource(res.pdf_link));
      } else if (res.reason && res.reason.includes("CGST")) {
        this.vst = visit;
        this.openInput = true;
        this.items = [...res.items];
        const res1 = await this.getItemsFromID(this.items);
        this.invoiceItems1 = [...res1];
      } else {
        alert("Fill the shop GST Details in GRN App");
      }
    },
    async dowloadA4Pdf(visit, event) {
      event.stopPropagation();
      this.comp1 = false;
      const res = await this.getA4Pdf(visit);
      this.a4 = false;
      if (res.pdf_link) {
        this.pdf = this.imageSource(res.pdf_link);
        window.open(this.pdf, "_blank").focus();
      } else if (res.reason && res.reason.includes("CGST")) {
        this.vst = visit;
        this.openInput = true;
        this.items = [...res.items];
        const res1 = await this.getItemsFromID(this.items);
        this.invoiceItems1 = [...res1];
        this.a4 = true;
      } else {
        alert("Fill the shop GST Details in GRN App");
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
    async getShopInvoices() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/shopInvoices?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
      return [];
    },
    async confirm(num) {
      if (this.name.length > 0) {
        if (this.name === num) {
          this.errorMessageForName = true;
        } else {
          await this.setName(num);
          this.addToKhata(this.data);
          this.add = false;
        }
      }
    },
    async checkName(num, name) {
      const res = await this.isConsumer(num);
      console.log(res);
      if (res) {
        this.add = true;
        this.name = name;
        setTimeout(() => {
          document.getElementById("nameForKhataHolder").focus();
        }, 800);
      } else {
        this.addToKhata(this.data);
      }
    },
    async setName(num) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/setConsumerNameForKhataUsers?phoneNumber=${encodeURIComponent(
            num
          )}&consumerName=${this.name}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async isConsumer(num) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/isConsumerNameBlank/${num}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
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
            Authorization: localStorage.getItem("Credential"),
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
    paymentStatus(arg) {
      if (arg === "complete") {
        return "Payment Received";
      } else {
        return "Payment Not Received";
      }
    },
    async PaymentSuccess(paymentID, visitId, status, id) {
      const ts = new Date().getTime().toString();
      const payload = {
        payment_id: paymentID,
        visit_id: visitId,
        timestamp: ts,
        success: status,
        mode: this.curr_mode,
      };
      if (this.$store.getters.modeOff) {
        payload.mode = "UNKNOWN";
      }
      let response = null;
      try {
        const thiz = this;
        response = await thiz.$axios({
          method: "POST",
          url: `/notifyPaymentStatus?employeeID=${this.auth.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
          progress: false,
        });
        const elephantInTheRoom = { ...thiz.PendingInvoices[id] };
        if (status) {
          elephantInTheRoom.invoice_status = "complete";
        } else {
          elephantInTheRoom.invoice_status = "incomplete";
        }
        thiz.CompletedInvoices.unshift(elephantInTheRoom);
        thiz.PendingInvoices.splice(id, 1);
        thiz.getAll();
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    getItemID(items) {
      const itemIDs = [];
      items.forEach((item) => itemIDs.push(item.final_chosen.item_id));
      return itemIDs;
    },
    getTotalPrice(invoice) {
      let total = 0;
      invoice.forEach((item) => {
        total += item.final_chosen.unit_price * item.final_chosen.quantity;
      });
      total = total.toFixed(2);
      return total;
    },
    async usedOogacash(id) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getOOGACASHUsed/${id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        alert("Failed to update visit! Check logs for more info.");
      }
    },
    showBtn(time) {
      const today = new Date();
      const date = new Date(time);
      const rem = today.getTime() - date.getTime();
      if (rem > 86400000) {
        return false;
      } else {
        return true;
      }
    },
    async deleteInvoiceItem(visitID) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/discardVisit?visit_id=${visitID}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        this.ext = [];
        this.invoiceItems.shift();
        this.PopUpDelete = false;
        this.$router.go();
        console.log(response);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
      }
    },
    async deleteInv(visitID, json, num, redirect) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/discardVisit?visit_id=${visitID}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        // eslint-disable-next-line no-console
        json.forEach((item) => this.$store.commit("addToCartAlpha", item));
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
  },
};
</script>

<style scoped>
.deep {
  height: 72px;
  width: 100vw;
  background-color: #e8e8ed;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
}
.inside_box {
  height: 40px;
  color: #ff6c34;
  width: 90px;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset 2px 2px 2px 0 rgba(198, 198, 210, 0.8),
    inset -2px -2px 2px 0 #fff;
}
.outside_box {
  height: 40px;
  width: 90px;
  color: #4f4f4f;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: 4px 4px 4px 0 #c6c6d2, -4px -4px 4px 0 rgba(255, 255, 255, 0.8);
  margin: 0.5rem 0;
}
.name {
  color: #666;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 16px;
}
.name1 {
  color: #666;
  font-size: 12px;
  text-transform: uppercase;
  line-height: 12px;
}
.dateStuff {
  height: 38px;
  width: 80vw;
  background-color: #e8e8ed;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
}
.foot {
  position: fixed;
  bottom: 0;
  width: 100vw;
  background-color: #e8e8ed;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
}
.big_box {
  width: 85vw;
}
.full_box_size {
  width: 85vw;
}
.edit_profile_head {
  height: 12vh;
  width: 100vw;
  background: linear-gradient(180deg, #b5dcf6 0%, #d2e9f9 100%);
  box-shadow: 0 1px 2px 0 #aeaec0;
}
.mtop {
  margin-top: 54px;
}
.add_more {
  box-sizing: border-box;
  height: 22px;
  width: 70px;
  border-radius: 107px;
  box-shadow: inset -1px -1px 2px 0 rgba(198, 198, 210, 0.8),
    inset 2px 2px 4px 0 #fff;
}
.text_1 {
  color: #fff;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 16px;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
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
.input {
  border-radius: 16px;
  background-color: #f0f0f3;
  height: 20px;
  width: 100%;
  border: 0;
}
.input:focus {
  outline: none;
}
.inputs:focus {
  outline: none;
}
.search {
  border-radius: 16px;
  background-color: #f0f0f3;
  width: 100vw;
  border: 0;
  box-shadow: inset 4px 4px 6px 0 rgba(198, 198, 210, 0.8),
    inset -4px -4px 6px 0 #fff, 4px 4px 4px 0 #aeaec0, -4px -4px 4px 0 #fff;
}
.box {
  height: 41px;
  width: 80vw;
}
@media (min-width: 1000px) {
  .wid {
    width: 75vw;
    margin: 9rem 12.5vw !important;
  }
  .wid10 {
    width: 75vw;
    margin: 1rem 12.5vw !important;
  }
  .full_box_size {
    width: 75vw !important;
  }
  .ic {
    margin-left: 12.5vw !important;
    padding: 0 !important;
  }
  .deep {
    justify-content: space-between !important;
    padding: 0 12.5vw !important;
  }
  .wids {
    width: 140px;
  }
}
</style>
