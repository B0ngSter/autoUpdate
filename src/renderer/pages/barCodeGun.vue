<template>
  <div
    style="
      background-color: #f0f0f3;
      overflow-x: hidden;
      height: auto;
      width: 100vw;
    "
  >
    <div>
      <div
        class="pt-4 pb-1 d-flex justify-content-between align-items-center"
        :class="activateFreeGift ? 'giftBg' : 'noGiftBg'"
        style="height: 10vh; box-shadow: 0 1px 2px 0 rgba(92, 165, 214, 0.8)"
      >
        <div class="pr-4 pl-3 d-flex justify-content-center align-items-center">
          <div
            v-if="!openInput"
            style="
              height: auto;
              border-radius: 70px;
              width: 100%;
              box-shadow: inset -1px -1px 1px 0 rgba(92, 165, 214, 0.8),
                inset 2px 2px 2px 0 rgba(232, 244, 252, 0.8),
                2px 2px 4px 0 rgba(92, 165, 214, 0.8), -1px -1px 2px 0 #e8f4fc;
            "
          >
            <img
              alt="pic"
              src="../static/white.png"
              height="42"
              width="42"
              @click="back()"
            />
          </div>
        </div>
        <div
          v-if="open_number"
          class="hover_inside btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
          style="width: 100px"
        >
          <p class="p-5 mb blue_text font-weight-bold" @click="reset()">
            reset
          </p>
        </div>
        <div
          class="d-flex justify-content-center align-items-center"
          style="width: 60vw"
        >
          <p class="text_four font-weight-bold pt-2">
            Scan and add
            <!-- +91 {{ $store.getters.EnterToNumber[0] }} cart -->
          </p>
        </div>
        <div
          v-if="open_number && !openInput"
          class="d-flex justify-content-around"
        >
          <div
            style="z-index: 1; width: 6vw"
            class="hover_inside btnn mt-3 mr-3 mb-3 d-flex justify-content-center align-items-center"
            @click="AddNewItem()"
          >
            <h2 class="text_five mb blue_text font-weight-bold">+</h2>
          </div>
          <div
            v-if="open_number && allCartItems.length > 0 && !openInput"
            style="z-index: 1; width: 10vw"
            class="hover_inside btnn mt-3 mr-3 mb-3 d-flex justify-content-center align-items-center"
            @click="holdBill()"
          >
            <p class="text_two mb text_orange font-weight-bold">Hold</p>
          </div>
        </div>
        <div v-else style="z-index: 1; width: 8vw" />
      </div>
      <div
        v-if="!open_number"
        style="background-color: #f0f0f3; min-height: 90vh"
      >
        <div
          class="d-flex justify-content-center flex-wrap"
          style="margin-top: 13vh"
        >
          <div style="width: 80vw">
            <label for="Phone number" class="text_black text_two text-left"
              >Customer's Name</label
            ><br />
          </div>
          <div
            class="name-rectangle mb-2 d-flex align-items-center"
            style="width: 80vw"
          >
            <input
              id="userName"
              v-model="userName"
              style="border: 0; background-color: #e8e8ed"
              class="ml-2 text_grey-3 pl-4 inputs2 focus font-weight-bold text_input"
            />
          </div>
          <div
            class="d-flex justify-content-center mx-auto"
            style="width: 80vw"
          >
            <select
              v-if="list.length > 0"
              id="exampleFormControlSelect1"
              v-model="cust"
              class="select_box text_grey-3 focus mb-3"
              @change="confirmNum2()"
            >
              <option value="">Select the customer</option>
              <option
                v-for="(item, i) in list"
                :key="i"
                :value="item"
                class="options text_grey-3 text_three"
              >
                {{ item ? item.name : "" }} -
                {{ item ? item.phone_number : "" }}
              </option>
            </select>
          </div>
          <div style="width: 80vw">
            <label for="Phone number" class="text_black text_two text-left"
              >Customer's Mobile Number</label
            ><br />
          </div>
          <div
            class="name-rectangle d-flex align-items-center"
            style="width: 80vw"
          >
            <p class="float-left mb pl-2 font-weight-bold text_grey-3">+91</p>
            <input
              id="PhoneNumber"
              v-model="phone_num"
              maxlength="10"
              type="tel"
              style="border: 0; background-color: #e8e8ed"
              class="pl-1 text_grey-3 pl-2 inputs2 focus font-weight-bold text_input"
            />
          </div>
          <transition name="bounce">
            <p
              v-if="phone_num.length > 10"
              style="width: 100%"
              class="text_red text-center text_zero"
            >
              Please check the number
            </p>
          </transition>
        </div>
        <div class="d-flex justify-content-center mt-6">
          <div
            style="z-index: 1; width: 38vw; margin-top: 13vh"
            class="hover_inside btnnn ripple mt-2 d-flex justify-content-center align-items-center"
            @click="confirmNumber()"
          >
            <p
              :class="phone_num.length > 9 ? 'blue_text' : 'text_grey-2'"
              class="text_four mb font-weight-bold"
            >
              Confirm
            </p>
          </div>
        </div>
      </div>
      <div
        v-if="open_number"
        style="min-height: 80vh; overflow-y: scroll; overflow-x: hidden"
        class="d-flex justify-content-center align-items-start flex-wrap"
      >
        <div
          v-if="!show_addItem && !openInput"
          class="d-flex justify-content-center flex-wrap mt-4"
        >
          <div class="search box d-flex align-items-center mb-2">
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
              placeholder="Search for an item"
              autocomplete="off"
              type="text"
            />
            <img
              alt="pic"
              class="pl-3 mr-3"
              @click="searchLooseProductOuter()"
              style="width: 2%"
              src="../static/shopBag.webp"
            />
          </div>
          <div
            v-if="empty_cart() && !searchResult && !show_addItem"
            style="width: 35%"
            class="d-flex justify-content-center mt-5 flex-column"
          >
            <p class="text_four text-center text_dark font-weight-bold">
              Your cart is empty!
            </p>
            <img alt="pic" src="../static/CART.webp" class="mt-4" />
          </div>

          <div
            id="modal-sm"
            v-if="middleLayer"
            class="modal d-flex justify-content-center flex-wrap"
            @click="popUp($event)"
            style="border-radius: 20px"
          >
            <div class="modal-content">
              <p class="text-center">Pick an Item</p>
              <div
                v-for="(item, i) in midLayerEl"
                :key="i"
                class="d-flex justify-content-center flex-wrap"
              >
                <div
                  class="hover_inside inventory_box2 d-flex align-items-center mt-3 pt-2"
                  @click="selectItem(item)"
                >
                  <div
                    class="pt-2 d-flex align-items-center"
                    style="width: 100%; height: 120px"
                  >
                    <div
                      style="position: relative; width: 6.5vw"
                      class="ml-2 img1"
                    >
                      <img
                        alt="pic"
                        class="float-left img3"
                        style="border-radius: 10px; width: 5.5vw"
                        :src="
                          item.item_details.picurl.length > 0
                            ? imageSource1(item.item_details.picurl)
                            : defaultItemImg
                        "
                        height="85"
                      />
                    </div>
                    <div class="ml-3 mt-1">
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
                      <div
                        class="mt-2 mb-3 d-flex align-items-center justify-content-between"
                        style="width: 100%"
                      >
                        <div style="width: 27.5vw">
                          <p
                            class="m-0 float-left"
                            style="
                              color: #ff6c34;
                              font-family: Century Gothic, sans-serif;
                              font-size: 12px;
                              font-weight: 700;
                              line-height: 12px;
                            "
                          >
                            Rs
                            {{
                              item.item_details.unit_price -
                              item.item_details.discount
                            }}
                          </p>
                          <strike
                            v-if="
                              item.item_details.unit_price -
                                item.item_details.discount !==
                              item.item_details.unit_price
                            "
                            class="m-0 ml-3 ext_grey-3 text_two float-right"
                            style="
                              font-family: Century Gothic, sans-serif;
                              font-size: 12px;
                              line-height: 12px;
                              font-weight: 700;
                            "
                          >
                            Rs {{ item.item_details.unit_price }}
                          </strike>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="searchResult && !show_addItem && !openInput"
          style="width: 100%"
          class="mbT"
        >
          <div
            v-if="categoryItems && categoryItems.length === 0"
            class="d-flex align-items-center justify-content-center"
            style="width: 100%; height: 60vh"
          >
            <p>No item found</p>
          </div>
          <div
            v-for="(item, i) in categoryItems"
            :key="i"
            class="d-flex justify-content-center flex-wrap"
          >
            <div
              class="hover_inside inventory_box d-flex align-items-center mt-3 pt-2"
              :class="{
                highLight: searchHighLight.includes(item.item_details.item_id),
                colorBox: !searchHighLight.includes(item.item_details.item_id),
              }"
              @click="addItemm(item)"
            >
              <div
                class="pt-2 d-flex align-items-center"
                style="width: 70vw; height: 120px"
              >
                <div style="position: relative" class="ml-2 imggg">
                  <div
                    v-if="
                      item.item_oogadiscount &&
                      item.item_oogadiscount.length > 0 &&
                      item.item_oogadiscount[0].ooga_discount !== 0 &&
                      !item.item_oogadiscount[0].inactive
                    "
                    class="d-flex align-items-center justify-content-center p-1"
                    style="
                      z-index: 3;
                      width: 100%;
                      border-radius: 4px;
                      background-color: #f6251b;
                      position: absolute;
                      top: 0;
                    "
                  >
                    <p
                      class="m-0"
                      style="
                        font-size: 10px;
                        font-weight: 700;
                        line-height: 12px;
                        text-align: center;
                        color: #fff;
                        font-weight: bold;
                      "
                    >
                      Rs {{ item.item_oogadiscount[0].ooga_discount }} OFF
                    </p>
                  </div>
                  <img
                    v-if="$store.getters.toggle"
                    alt="pic"
                    class="float-left imggg"
                    style="border-radius: 10px"
                    src="../static/OogashopBusiness.png"
                    height="85"
                  />
                  <img
                    v-else
                    alt="pic"
                    class="float-left imggg"
                    style="border-radius: 10px"
                    :src="
                      item.item_details.picurl &&
                      item.item_details.picurl.length > 0
                        ? imageSource1(item.item_details.picurl)
                        : defaultItemImg
                    "
                    height="85"
                  />
                </div>
                <div class="ml-3 mt-1">
                  <p class="text-left gray mb text_three">
                    {{ item.item_details.brand }}
                  </p>
                  <p class="text-left mb text_three" style="width: 45vw">
                    {{ item.item_details.name }}
                  </p>
                  <div class="mt-2" style="width: 45vw">
                    <p class="text_grey-3 text_three mb">
                      {{ item.item_details.quantity }}
                      {{ item_unit(item.item_details.units) }}
                    </p>
                  </div>
                  <div
                    class="mt-2 mb-3 d-flex align-items-center justify-content-between"
                    style="width: 100%"
                  >
                    <div style="width: 27.5vw">
                      <p
                        class="m-0 float-left"
                        style="
                          color: #ff6c34;
                          font-family: Century Gothic, sans-serif;
                          font-size: 12px;
                          font-weight: 700;
                          line-height: 12px;
                        "
                      >
                        Rs {{ FixedAmount(item) }}
                      </p>
                      <strike
                        v-if="
                          item.item_details.unit_price -
                            item.item_details.discount !==
                          item.item_details.unit_price
                        "
                        class="m-0 ml-3 ext_grey-3 text_two float-right"
                        style="
                          font-family: Century Gothic, sans-serif;
                          font-size: 12px;
                          line-height: 12px;
                          font-weight: 700;
                        "
                      >
                        Rs {{ item.item_details.unit_price }}
                      </strike>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!searchResult && !show_addItem && !openInput">
          <div
            id="modal-sm"
            v-if="NoitemFound"
            class="modal d-flex justify-content-center flex-wrap"
            style="border-radius: 10px; syntax: 80vw"
            @click="popUp($event)"
          >
            <div class="modal-content">
              <p>No item found</p>
            </div>
          </div>
          <div
            class="d-flex justify-content-center flex-wrap"
            style="width: 100vw"
          >
            <div
              v-if="!empty_cart()"
              :class="$store.getters.compress ? 'mt-2' : 'mt-5'"
              class="big_box mb-2 d-flex align-items-center justify-content-between"
              style="height: auto"
            >
              <div style="width: 100%" class="d-flex flex-column">
                <div class="align-items-center justify-content-between">
                  <p
                    class="font-weight-bold mb float-left dark_gray ml-3 mt-2 mb-2"
                    :style="$store.getters.compress ? 'font-size:10px' : ''"
                  >
                    Amount Paid
                  </p>
                  <div
                    class="d-flex justify-content-end float-right align-items-center mr-2 mt-2 mb-2"
                  >
                    <input
                      v-model="amountPaid"
                      class="focus pl-3"
                      style="
                        width: 45%;
                        background-color: #f0f0f3;
                        border: 1px solid #b3b3b8;
                      "
                      :style="$store.getters.compress ? 'font-size:10px' : ''"
                      type="number"
                    />
                  </div>
                </div>
                <div class="align-items-center justify-content-between">
                  <p
                    class="font-weight-bold mb float-left dark_gray ml-3 mt-2 mb-2"
                    :style="$store.getters.compress ? 'font-size:10px' : ''"
                  >
                    Total
                  </p>
                  <div
                    class="d-flex justify-content-center float-right align-items-center mr-3 mt-2 mb-2"
                  >
                    <p
                      class="mb blue_text font-weight-bold"
                      :style="$store.getters.compress ? 'font-size:10px' : ''"
                    >
                      Rs {{ final_amount.toFixed(2) }}
                    </p>
                  </div>
                </div>
                <div
                  v-if="amountPaid > 0"
                  class="align-items-center justify-content-between"
                >
                  <p
                    class="font-weight-bold mb float-left dark_gray ml-3 mt-2 mb-2"
                    :style="$store.getters.compress ? 'font-size:10px' : ''"
                  >
                    Final Amount
                  </p>
                  <div
                    class="d-flex justify-content-center float-right align-items-center mr-3 mt-2 mb-2"
                    :style="$store.getters.compress ? 'font-size:10px' : ''"
                  >
                    <p class="mb blue_text font-weight-bold">
                      Rs {{ amountPaid - final_amount.toFixed(2) }}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <p v-if="LastBarcode" style="width: 80vw">
              Last scanned barcode: {{ LastBarcode }}
            </p>
            <p v-if="activateFreeGift" style="width: 80vw; color: green">
              Add gift item
            </p>
          </div>
          <div
            v-if="cartItemsFromAPI.length > 0"
            class="d-flex mbT justify-content-center"
            style="position: relative"
          >
            <div class="big_box mt-3" style="height: auto">
              <p class="float-left text_two dark_gray ml-3 mt-2">Item List</p>
              <p
                v-if="
                  cartItemsFromAPI.findIndex(
                    (item) =>
                      item.item_details.units === 'GRAM' &&
                      item.item_details.quantity === 1
                  ) === -1
                "
                class="float-right text_two dark_gray mr-3 mt-2"
              >
                {{ getTotalRegularCart }} ITEMS
              </p>
              <div v-if="$store.getters.compress">
                <div
                  v-for="(item, idx) in cartItemsFromAPI"
                  :key="idx"
                  class="itemBox"
                >
                  <div
                    :class="{
                      'pt-5': idx === 0,
                      'pb-2': idx === cartItemsFromAPI.length - 1,
                      'pt-1': idx > 0,
                      CatalogHighLight: catalogItemIds.includes(
                        item.item_details.item_id
                      ),
                      GiftItem: highLightFreeItem(allCartItems[idx]),
                      highLight: highLight.includes(item.item_details.item_id),
                    }"
                    @click="
                      highLight = [];
                      highLight.push(item.item_details.item_id);
                    "
                  >
                    <div
                      class="d-flex justify-content-between align-items-center"
                    >
                      <div>
                        <img
                          v-if="$store.getters.toggle"
                          alt="pic"
                          class="float-left ml-3 mr-4"
                          style="border-radius: 10px"
                          src="../static/OogashopBusiness.png"
                          height="30"
                          width="25"
                        />
                        <img
                          v-else
                          alt="pic"
                          class="float-left ml-3 mr-4"
                          style="border-radius: 10px"
                          :src="
                            item.item_details.picurl.length > 0
                              ? imageSource1(item.item_details.picurl)
                              : defaultItemImg
                          "
                          height="30"
                          width="25"
                        />
                      </div>
                      <div style="width: 35%">
                        <div class="d-flex justify-content-between">
                          <p class="gray mb text_three" style="font-size: 10px">
                            {{ item.item_details.brand }}
                          </p>
                        </div>
                        <div class="d-flex">
                          <p class="mb text_three" style="font-size: 9px">
                            {{ item.item_details.name }}
                          </p>
                          <p
                            v-if="rollout(item.item_details)"
                            class="gray mb ml-2 text_three"
                            style="font-size: 9px"
                          >
                            {{ item.item_details.quantity }}
                            {{ item.item_details.units }}
                          </p>
                        </div>
                      </div>
                      <div
                        v-if="!allCartItems[idx].final_chosen.giftItem"
                        class="d-flex flex-column"
                        style="width: 30%"
                      >
                        <div class="d-flex mb-1">
                          <p
                            v-if="
                              $store.getters.cartItems[idx] &&
                              !inputIndex.includes(idx)
                            "
                            class="m-0 float-left"
                            style="
                              color: #ff6c34;
                              font-family: Century Gothic, sans-serif;
                              font-size: 9px;
                              font-weight: 700;
                              line-height: 12px;
                            "
                          >
                            MRP: Rs {{ itemMRP(idx, item) }}
                            <span
                              v-if="
                                item.item_details.units === 'GRAM' &&
                                item.item_details.quantity === 1
                              "
                            >
                              / Kg</span
                            >
                          </p>
                          <p
                            v-if="
                              $store.getters.cartItems[idx] &&
                              !inputIndex.includes(idx)
                            "
                            class="m-0 ml-2 float-left"
                            style="
                              color: #ff6c34;
                              font-family: Century Gothic, sans-serif;
                              font-size: 9px;
                              font-weight: 700;
                              line-height: 12px;
                            "
                          >
                            Final: Rs {{ itemVariableSP(idx, item) }}
                          </p>
                        </div>
                        <div class="d-flex">
                          <p
                            v-if="
                              $store.getters.cartItems[idx] &&
                              !inputIndex.includes(idx)
                            "
                            class="m-0 float-left"
                            @click="openChangeSPricePop(idx, item)"
                            style="
                              color: #ff6c34;
                              font-family: Century Gothic, sans-serif;
                              font-size: 9px;
                              font-weight: 700;
                              line-height: 12px;
                            "
                          >
                            SP: Rs {{ itemSP(idx, item) }}
                            <span
                              v-if="
                                item.item_details.units === 'GRAM' &&
                                item.item_details.quantity === 1
                              "
                            >
                              / Kg</span
                            >
                          </p>
                          <div class="ml-2">
                            <p
                              v-if="allCartItems[idx].final_chosen.discount > 0"
                              class="m-0 ml-3 text_two float-right"
                              style="
                                font-family: Century Gothic, sans-serif;
                                font-size: 9px;
                                line-height: 12px;
                                font-weight: 700;
                                color: green;
                              "
                            >
                              <span
                                @click="
                                  openChangeDiscountPop(
                                    idx,
                                    item.item_details.discount
                                  )
                                "
                                >{{ DynamicDisount(idx, item) }}</span
                              >
                              <span
                                v-if="!percentageDiscount"
                                @click="
                                  percentageDiscount = !percentageDiscount
                                "
                                >Rs</span
                              >
                              <span
                                v-else
                                @click="
                                  percentageDiscount = !percentageDiscount
                                "
                                >%
                              </span>
                              OFF
                              <span
                                v-if="
                                  item.item_details.units === 'GRAM' &&
                                  item.item_details.quantity === 1
                                "
                              >
                                / Kg</span
                              >
                            </p>
                            <!-- <p v-if="allCartItems[idx].final_chosen.discount === 0 && !inputDiscountIndex.length && !allCartItems[idx].final_chosen.giftItem" class="m-0 done_btn ripple d-flex justify-content-center align-items-center ml-3 text_two float-right" style="font-family:Century Gothic, sans-serif; font-size: 12px; line-height: 12px; font-weight: 700;color: green;" @click="openChangeDiscountPop(idx, item.item_details.discount)">
                              add discount
                            </p> -->
                          </div>
                        </div>
                      </div>
                      <div
                        v-if="!ready_to_checkout"
                        style="width: 60px; height: 100%"
                        :class="{ add_more: rollout(item.item_details) }"
                        class="d-flex justify-content-between align-items-center"
                      >
                        <div
                          v-if="
                            item.item_details.units === 'GRAM' &&
                            item.item_details.quantity === 1
                          "
                        />
                        <div v-else>
                          <img
                            v-if="allCartItems[idx].final_chosen.quantity === 1"
                            alt="pic"
                            width="15"
                            height="15"
                            :class="
                              allCartItems[idx].final_chosen.quantity < 2
                                ? 'disable'
                                : ''
                            "
                            src="../static/icons/minus.webp"
                          />
                          <img
                            v-if="allCartItems[idx].final_chosen.quantity > 1"
                            alt="pic"
                            src="../static/icons/minus.webp"
                            width="15"
                            height="15"
                            @click="
                              $store.commit('changeItemCount', [
                                'minus',
                                item.item_details.item_id,
                              ])
                            "
                          />
                        </div>
                        <div
                          v-if="
                            item.item_details.units === 'GRAM' &&
                            item.item_details.quantity === 1
                          "
                        >
                          <div
                            id="hi"
                            class="d-flex justify-content-start align-items-center"
                            style="
                              width: 140px;
                              height: 40px;
                              background-color: #f0f0f3;
                              border: 0;
                              box-shadow: inset 2px 2px 2px 0 #c6c6d2,
                                inset -3px -3px 3px 0 #fff;
                            "
                          >
                            <input
                              style="
                                background-color: #f0f0f3;
                                width: 90px;
                                border: 0;
                                height: 30px;
                                margin-left: 5px;
                              "
                              :value="allCartItems[idx].final_chosen.quantity"
                              class="focus"
                              type="number"
                              @keyup="
                                ($event) => {
                                  $store.commit('changeItemCountWithInput', [
                                    $event.target.value,
                                    item.item_details.item_id,
                                    item ? item.dis : 0,
                                    allCartItems[idx].percent,
                                  ]);
                                }
                              "
                            />
                            <p
                              class="gray mb text_one pt-1 ml-1"
                              style="width: 30px"
                            >
                              Gram
                            </p>
                          </div>
                          <div
                            id="hi"
                            class="d-flex justify-content-start align-items-center"
                            style="
                              width: 140px;
                              height: 40px;
                              background-color: #f0f0f3;
                              border: 0;
                              box-shadow: inset 2px 2px 2px 0 #c6c6d2,
                                inset -3px -3px 3px 0 #fff;
                            "
                          >
                            <input
                              :value="
                                allCartItems[idx].final_chosen.final_price
                              "
                              class="focus pl-3"
                              style="
                                background-color: #f0f0f3;
                                width: 90px;
                                border: 0;
                                height: 30px;
                                margin-left: 5px;
                              "
                              type="number"
                              @keyup="
                                ($event) => {
                                  $store.commit('changePriceWithInput', [
                                    $event.target.value,
                                    item.item_details.item_id,
                                    item ? item.dis : 0,
                                    allCartItems[idx].percent,
                                  ]);
                                }
                              "
                            />
                            <p
                              class="gray mb text_one pt-1 ml-1"
                              style="width: 30px"
                            >
                              Rupee
                            </p>
                          </div>
                        </div>
                        <p
                          v-else
                          class="text-center text_three mb font-weight-bold"
                          style="font-size: 10px"
                        >
                          {{ allCartItems[idx].final_chosen.quantity }}
                        </p>
                        <div
                          v-if="
                            item.item_details.units === 'GRAM' &&
                            item.item_details.quantity === 1
                          "
                        />
                        <div v-else>
                          <img
                            alt="pic"
                            src="../static/icons/plus.webp"
                            width="15"
                            height="15"
                            @click="
                              $store.commit('changeItemCount', [
                                'plus',
                                item.item_details.item_id,
                              ])
                            "
                          />
                        </div>
                      </div>
                      <img
                        v-if="!$store.getters.readyToCheckout"
                        alt="pic"
                        src="../static/delete.png"
                        class="mr-4 deleteBtn"
                        style="margin-top: -5px"
                        width="15"
                        height="15"
                        @click="removeItemFromCart(idx)"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div
                  v-for="(item, idx) in cartItemsFromAPI"
                  :key="idx"
                  class="itemBox"
                >
                  <div
                    class="d-flex justify-content-between align-items-center"
                    style="width: 100%"
                    :class="{
                      'pt-2 pb-5': idx === 0,
                      'pb-5 mb-0': idx === cartItemsFromAPI.length - 1,
                      'pb-5':
                        idx !== cartItemsFromAPI.length - 1 &&
                        !rollout(item.item_details),
                      'pb-5':
                        idx !== cartItemsFromAPI.length - 1 &&
                        rollout(item.item_details),
                      'pt-4': idx > 0,
                      CatalogHighLight: catalogItemIds.includes(
                        item.item_details.item_id
                      ),
                      GiftItem: highLightFreeItem(allCartItems[idx]),
                      highLight: highLight.includes(item.item_details.item_id),
                    }"
                    @click="
                      highLight = [];
                      highLight.push(item.item_details.item_id);
                    "
                  >
                    <div>
                      <img
                        v-if="$store.getters.toggle"
                        alt="pic"
                        class="float-left ml-3 mr-4 imggg"
                        style="border-radius: 10px"
                        src="../static/OogashopBusiness.png"
                        height="95"
                        width="60"
                      />
                      <img
                        v-else
                        alt="pic"
                        class="float-left ml-3 mr-4 imggg"
                        style="border-radius: 10px"
                        :src="
                          item.item_details.picurl.length > 0
                            ? imageSource1(item.item_details.picurl)
                            : defaultItemImg
                        "
                        height="95"
                        width="60"
                      />
                    </div>
                    <div style="height: 130px" class="flex-grow-1">
                      <p
                        v-if="highLightFreeItem(allCartItems[idx])"
                        style="
                          font-size: 12px;
                          line-height: 12px;
                          font-weight: 700;
                          color: green;
                        "
                        class="mb"
                      >
                        Gift Item
                      </p>
                      <div class="d-flex justify-content-between mt-2 mb-0">
                        <p class="gray mb text_three float-left">
                          {{ item.item_details.brand }}
                        </p>
                        <img
                          v-if="!$store.getters.readyToCheckout"
                          alt="pic"
                          src="../static/delete.png"
                          class="mr-4 deleteBtn"
                          style="margin-top: -5px; width: 1%"
                          @click="removeItemFromCart(idx)"
                        />
                      </div>
                      <div
                        class="d-flex align-items-center"
                        style="height: 30px"
                      >
                        <p class="mb text_three" style="width: 25%">
                          {{ item.item_details.name }}
                        </p>
                        <div class="ml-3">
                          <p
                            v-if="allCartItems[idx].final_chosen.discount > 0"
                            class="m-0 ml-3 text_two float-right"
                            style="
                              font-family: Century Gothic, sans-serif;
                              font-size: 12px;
                              line-height: 12px;
                              font-weight: 700;
                              color: green;
                            "
                          >
                            <span
                              @click="
                                openChangeDiscountPop(
                                  idx,
                                  item.item_details.discount
                                )
                              "
                              >{{ DynamicDisount(idx, item) }}</span
                            >
                            <span
                              v-if="!percentageDiscount"
                              @click="percentageDiscount = !percentageDiscount"
                              >Rs</span
                            >
                            <span
                              v-else
                              @click="percentageDiscount = !percentageDiscount"
                              >%
                            </span>
                            OFF
                            <span
                              v-if="
                                item.item_details.units === 'GRAM' &&
                                item.item_details.quantity === 1
                              "
                            >
                              / Kg</span
                            >
                          </p>
                          <p
                            v-if="
                              parseFloat(
                                allCartItems[idx].final_chosen.discount
                              ) === 0 &&
                              !inputDiscountIndex.length &&
                              !allCartItems[idx].final_chosen.giftItem
                            "
                            class="mb-4 done_btn ripple d-flex justify-content-center align-items-center ml-3 text_two float-right"
                            style="
                              font-family: Century Gothic, sans-serif;
                              font-size: 12px;
                              line-height: 12px;
                              font-weight: 700;
                              color: green;
                            "
                            @click="
                              openChangeDiscountPop(
                                idx,
                                item.item_details.discount
                              )
                            "
                          >
                            add discount
                          </p>
                        </div>
                      </div>
                      <div class="d-flex align-items-center">
                        <p
                          v-if="rollout(item.item_details)"
                          class="gray mb text_three"
                          style="width: 25%; margin-top: -15px"
                        >
                          {{ item.item_details.quantity }}
                          {{ item.item_details.units }}
                        </p>
                        <p v-else style="width: 25%" />
                        <div class="ml-3">
                          <div
                            class="d-flex align-items-center mb-1"
                            style="font-size: 12px"
                          >
                            <input
                              v-model="allCartItems[idx].percent"
                              type="checkbox"
                              class="ml-3"
                              @click="
                                hi1(idx);
                                hi2(idx, item);
                              "
                            />
                            <div class="ml-2">(In percentage)</div>
                          </div>
                          <div
                            class="d-flex justify-content-start align-items-center mr-2 mb-2 ml-3"
                          >
                            <p
                              class="m-0"
                              style="font-size: 11px; font-weight: bold"
                            >
                              One Time Discount:
                            </p>
                            <input
                              v-model="item.dis"
                              class="focus ml-3"
                              style="
                                width: 3rem;
                                background-color: #f0f0f3;
                                border: 1px solid #b3b3b8;
                              "
                              :style="
                                $store.getters.compress
                                  ? 'font-size:9px'
                                  : 'font-size:11px'
                              "
                              type="number"
                              @change="hi(idx, item)"
                            />
                          </div>
                        </div>
                      </div>
                      <div
                        class="pb-5 d-flex align-items-center justify-content-between"
                      >
                        <div
                          class="mt-1 mb-3 d-flex align-items-center justify-content-between"
                          style="width: 70%"
                        >
                          <div style="width: 100%" class="d-flex flex-row">
                            <div
                              v-if="!allCartItems[idx].final_chosen.giftItem"
                              style="width: 60%"
                              class="d-flex flex-column"
                            >
                              <div class="d-flex mt-1">
                                <p
                                  v-if="
                                    $store.getters.cartItems[idx] &&
                                    !inputIndex.includes(idx)
                                  "
                                  class="m-0"
                                  style="
                                    margin-top: -20px;
                                    color: #ff6c34;
                                    font-family: Century Gothic, sans-serif;
                                    font-size: 12px;
                                    font-weight: 700;
                                    line-height: 12px;
                                    width: 50%;
                                  "
                                  @click="openChangePricePop(idx, item)"
                                >
                                  MRP: Rs {{ itemMRP(idx, item) }}
                                  <span
                                    v-if="
                                      item.item_details.units === 'GRAM' &&
                                      item.item_details.quantity === 1
                                    "
                                  >
                                    / Kg</span
                                  >
                                </p>
                              </div>
                              <p
                                v-if="
                                  $store.getters.cartItems[idx] &&
                                  !inputIndex.includes(idx)
                                "
                                class="m-0 mt-1 float-left"
                                style="
                                  width: 50%;
                                  margin-top: -20px;
                                  color: #ff6c34;
                                  font-family: Century Gothic, sans-serif;
                                  font-size: 12px;
                                  font-weight: 700;
                                  line-height: 12px;
                                "
                                @click="openChangeSPricePop(idx, item)"
                              >
                                SP: Rs {{ itemSP(idx, item) }}
                                <span
                                  v-if="
                                    item.item_details.units === 'GRAM' &&
                                    item.item_details.quantity === 1
                                  "
                                >
                                  / Kg</span
                                >
                              </p>
                              <div class="d-flex">
                                <p
                                  v-if="
                                    $store.getters.cartItems[idx] &&
                                    !inputIndex.includes(idx)
                                  "
                                  class="m-0 mt-1"
                                  style="
                                    width: 50%;
                                    margin-top: -20px;
                                    color: #ff6c34;
                                    font-family: Century Gothic, sans-serif;
                                    font-size: 12px;
                                    font-weight: 700;
                                    line-height: 12px;
                                  "
                                >
                                  Final: Rs {{ itemVariableSP(idx, item) }}
                                </p>
                              </div>
                            </div>
                            <div
                              v-if="inputIndex.includes(idx)"
                              class="dark_gray text_two float-left d-flex justify-content-around"
                            >
                              <input
                                :id="'changePrice' + idx"
                                v-model="changedPrice"
                                class="focus pl-3"
                                style="
                                  width: 70%;
                                  background-color: #f0f0f3;
                                  border: 1px solid #b3b3b8;
                                "
                                type="number"
                              />
                              <div
                                class="hover_inside done_btn ripple d-flex justify-content-center align-items-center"
                                @click="doneBtn(item.item_details, idx)"
                              >
                                <p
                                  style="font-weight: 700; line-height: 15px"
                                  class="text_two mb font-weight-bold blue_text"
                                >
                                  done
                                </p>
                              </div>
                            </div>
                            <div
                              v-if="inputDiscountIndex.includes(idx)"
                              class="dark_gray text_two float-left d-flex justify-content-around"
                            >
                              <input
                                :id="'changeDiscount' + idx"
                                v-model="changedPrice"
                                class="focus pl-3"
                                style="
                                  width: 70%;
                                  height: 20px;
                                  background-color: #f0f0f3;
                                  border: 1px solid #b3b3b8;
                                "
                                type="number"
                              />
                              <select
                                id="exampleFormControlSelect1"
                                v-model="discountType"
                                class="select_box1 ml-2 mr-2 text_grey-3 focus"
                                @change="switchDiscountType()"
                              >
                                <option class="options text_grey">Rs</option>
                                <option class="options text_grey">%</option>
                              </select>
                              <div
                                v-if="
                                  item.item_details.units === 'GRAM' &&
                                  item.item_details.quantity === 1
                                "
                                class="hover_inside done_btn ripple d-flex justify-content-center align-items-center"
                                @click="sabjiDiscount(idx, item)"
                              >
                                <p
                                  style="font-weight: 700; line-height: 15px"
                                  class="text_two mb font-weight-bold blue_text"
                                >
                                  done
                                </p>
                              </div>
                              <div
                                v-else
                                class="hover_inside done_btn ripple d-flex justify-content-center align-items-center"
                                @click="
                                  changeDiscountPriceFn(
                                    idx,
                                    item.item_details,
                                    allCartItems[idx].final_chosen
                                  )
                                "
                              >
                                <p
                                  style="font-weight: 700; line-height: 15px"
                                  class="text_two mb font-weight-bold blue_text"
                                >
                                  done
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div
                          v-if="
                            $store.getters.cartItems[idx] &&
                            !allCartItems[idx].final_chosen.giftItem
                          "
                          class="mr-4 float-right"
                        >
                          <div
                            v-if="!ready_to_checkout"
                            :class="{ add_more: rollout(item.item_details) }"
                            class="d-flex justify-content-between align-items-center"
                          >
                            <div
                              v-if="
                                item.item_details.units === 'GRAM' &&
                                item.item_details.quantity === 1
                              "
                            />
                            <div v-else>
                              <img
                                v-if="
                                  allCartItems[idx].final_chosen.quantity === 1
                                "
                                alt="pic"
                                :class="
                                  allCartItems[idx].final_chosen.quantity < 2
                                    ? 'disable'
                                    : ''
                                "
                                src="../static/icons/minus.webp"
                              />
                              <img
                                v-if="
                                  allCartItems[idx].final_chosen.quantity > 1
                                "
                                alt="pic"
                                src="../static/icons/minus.webp"
                                @click="
                                  $store.commit('changeItemCount', [
                                    'minus',
                                    item.item_details.item_id,
                                  ])
                                "
                              />
                            </div>
                            <div
                              v-if="
                                item.item_details.units === 'GRAM' &&
                                item.item_details.quantity === 1
                              "
                            >
                              <div
                                id="hi"
                                class="d-flex justify-content-start align-items-center"
                                style="
                                  width: 140px;
                                  height: 40px;
                                  background-color: #f0f0f3;
                                  border: 0;
                                  box-shadow: inset 2px 2px 2px 0 #c6c6d2,
                                    inset -3px -3px 3px 0 #fff;
                                "
                              >
                                <input
                                  style="
                                    background-color: #f0f0f3;
                                    width: 90px;
                                    border: 0;
                                    height: 30px;
                                    margin-left: 5px;
                                  "
                                  :value="
                                    allCartItems[idx].final_chosen.quantity
                                  "
                                  class="focus"
                                  type="number"
                                  @keyup="
                                    ($event) => {
                                      $store.commit(
                                        'changeItemCountWithInput',
                                        [
                                          $event.target.value,
                                          item.item_details.item_id,
                                          item ? item.dis : 0,
                                          allCartItems[idx].percent,
                                        ]
                                      );
                                    }
                                  "
                                />
                                <p
                                  class="gray mb text_one pt-1 ml-1"
                                  style="width: 30px"
                                >
                                  Gram
                                </p>
                              </div>
                              <div
                                id="hi"
                                class="d-flex justify-content-start align-items-center"
                                style="
                                  width: 140px;
                                  height: 40px;
                                  background-color: #f0f0f3;
                                  border: 0;
                                  box-shadow: inset 2px 2px 2px 0 #c6c6d2,
                                    inset -3px -3px 3px 0 #fff;
                                "
                              >
                                <input
                                  :value="
                                    allCartItems[idx].final_chosen.final_price
                                  "
                                  class="focus"
                                  style="
                                    background-color: #f0f0f3;
                                    width: 90px;
                                    border: 0;
                                    height: 30px;
                                    margin-left: 5px;
                                  "
                                  type="number"
                                  @keyup="
                                    ($event) => {
                                      $store.commit('changePriceWithInput', [
                                        $event.target.value,
                                        item.item_details.item_id,
                                        item ? item.dis : 0,
                                        allCartItems[idx].percent,
                                      ]);
                                    }
                                  "
                                />
                                <p
                                  class="gray mb text_one pt-1 ml-1"
                                  style="width: 30px"
                                >
                                  Rupee
                                </p>
                              </div>
                            </div>
                            <p
                              v-else
                              class="text-center text_three mb font-weight-bold"
                            >
                              {{ allCartItems[idx].final_chosen.quantity }}
                            </p>
                            <div
                              v-if="
                                item.item_details.units === 'GRAM' &&
                                item.item_details.quantity === 1
                              "
                            />
                            <div v-else>
                              <img
                                alt="pic"
                                src="../static/icons/plus.webp"
                                @click="
                                  $store.commit('changeItemCount', [
                                    'plus',
                                    item.item_details.item_id,
                                  ])
                                "
                              />
                            </div>
                          </div>
                          <div
                            class="d-flex justify-content-center align-items-center"
                          >
                            <p
                              v-if="ready_to_checkout"
                              class="pt-1 pb-1 mb text_one text-center dark_gray"
                            >
                              Qty:
                              {{
                                allCartItems.length > 0
                                  ? allCartItems[idx].final_chosen.quantity
                                  : 0
                              }}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="PullOut"
          class="modal d-flex justify-content-center flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div class="d-flex flex-column modal-content">
            <div style="width: 100%">
              <p class="text-center">Do you want to cancel the order ?</p>
            </div>
            <div class="d-flex justify-content-around" style="width: 100%">
              <div
                class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center mr-4"
                @click="PullOut = false"
              >
                <p
                  style="font-weight: 700; line-height: 15px"
                  class="text_two mb font-weight-bold blue_text"
                >
                  No
                </p>
              </div>
              <div
                class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center ml-4"
                @click="$router.push('/home')"
              >
                <p
                  style="font-weight: 700; line-height: 15px"
                  class="text_two mb font-weight-bold blue_text"
                >
                  Yes
                </p>
              </div>
              <div
                v-if="open_number"
                style="z-index: 1; width: 8vw"
                class="hover_inside btnn d-flex justify-content-center align-items-center"
                @click="holdBill()"
              >
                <p class="text_two mb text_orange font-weight-bold">Hold</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="NoItemFoundInCatalog"
          class="modal d-flex justify-content-center flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div class="modal-content d-flex flex-column">
            <div style="width: 100%">
              <p class="text-center">
                Do you want to add item ({{ LastBarcode }})
              </p>
            </div>
            <div class="d-flex justify-content-around" style="width: 100%">
              <div
                class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center mr-4"
                style="width: 100px"
                @click="reset()"
              >
                <p
                  style="font-weight: 700; line-height: 15px"
                  class="text_two mb font-weight-bold blue_text"
                >
                  Wrong barcode
                </p>
              </div>
              <div
                class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center mr-4"
                @click="NoItemFoundInCatalog = false"
              >
                <p
                  style="font-weight: 700; line-height: 15px"
                  class="text_two mb font-weight-bold blue_text"
                >
                  No
                </p>
              </div>
              <div
                class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center ml-4"
                @click="AddNewItem()"
              >
                <p
                  style="font-weight: 700; line-height: 15px"
                  class="text_two mb font-weight-bold blue_text"
                >
                  Yes
                </p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="d-flex justify-content-center" style="width: 100vw;">
          <div v-if="UpdateSpinner" class=" d-flex justify-content-center align-items-center" style="height: 60vh; position: absolute; z-index: 2;">
            <div class="spinner-border" style="width: 3rem; height: 3rem;" role="status">
              <span class="sr-only">Loading...</span>
            </div>
          </div>
        </div> -->
        <div v-if="addItemCheck()">
          <div class="d-flex justify-content-center flex-wrap mt-4">
            <div style="width: 75vw">
              <select
                id="exampleFormControlSelect1"
                v-model="currentCategory"
                class="select_box text_grey-3 focus"
                @change="changeCat(currentCategory)"
              >
                <option
                  v-for="category in categoryList"
                  :key="category"
                  :value="category"
                  class="options text_grey-3 text_three"
                >
                  {{ category }}
                </option>
              </select>
              <label
                v-if="validation[0] === false && validationTrigger"
                for="input"
                class="text_red mb font_small text_two"
                >Do not leave this blank</label
              >
            </div>
            <div style="width: 75vw" class="mt-3">
              <label for="input" class="text_grey-1 mb font_small text_two"
                >Sub category</label
              >
              <select
                id="exampleFormControlSelect1"
                v-model="subcategory"
                class="select_box mt-1 text_grey-3 focus"
                @change="changeSubSub()"
              >
                <option
                  v-for="category in subCategoryList"
                  :key="category.category_number"
                  :value="category"
                  class="options text_grey-3 text_three"
                >
                  {{ category }}
                </option>
              </select>
              <label
                v-if="validation[1] === false && validationTrigger"
                for="input"
                class="text_red mb font_small text_two"
                >Do not leave this blank</label
              >
            </div>
            <div style="width: 75vw" class="mt-3">
              <label for="input" class="text_grey-1 mb font_small text_two"
                >Sub sub category</label
              >
              <select
                id="exampleFormControlSelect1"
                v-model="subsubcategory"
                class="select_box mt-1 text_grey-3 focus"
              >
                <option
                  v-for="category in subsubcatList"
                  :key="category.category_number"
                  :value="category"
                  class="options text_grey-3 text_three"
                >
                  {{ category }}
                </option>
              </select>
              <label
                v-if="validation[2] === false && validationTrigger"
                for="input"
                class="text_red mb font_small text_two"
                >Do not leave this blank</label
              >
            </div>
            <div style="width: 75vw" class="mt-3">
              <label for="input" class="text_grey-1 mb font_small text_two"
                >BARCODE</label
              >
              <div class="d-flex flex-column">
                <input
                  v-model="edit_item.barcode"
                  type="text"
                  class="inputs pl-2 mt-2 focus"
                />
                <label
                  v-if="validation[8] === false && validationTrigger"
                  for="input"
                  class="text_red mb font_small text_two"
                  >Atleast 4 digit barcode is needed</label
                >
              </div>
            </div>
            <div style="width: 75vw" class="mt-3">
              <label for="input" class="text_grey-1 mb font_small text_two"
                >BRAND</label
              >
              <input
                v-model="edit_item.brand"
                type="text"
                class="inputs pl-2 focus"
              />
              <label
                v-if="validation[3] === false && validationTrigger"
                for="input"
                class="text_red mb font_small text_two"
                >Do not leave this blank</label
              >
            </div>
            <div style="width: 75vw" class="mt-3">
              <label for="input" class="text_grey-1 mb font_small text_two"
                >NAME</label
              >
              <input
                v-model="edit_item.name"
                type="text"
                class="inputs pl-2 focus"
              />
              <label
                v-if="validation[4] === false && validationTrigger"
                for="input"
                class="text_red mb font_small text_two"
                >Do not leave this blank</label
              >
            </div>
            <div
              style="width: 75vw"
              class="mt-3 d-flex justify-content-between"
            >
              <div v-if="!perKg" style="width: 33vw">
                <label
                  for="input"
                  class="text_grey-1 mb float-left font_small text_two"
                  >QUANTITY</label
                >
                <input
                  v-model="edit_item.quantity"
                  type="text"
                  class="inputs pl-2 focus float-left"
                  style="width: 33vw"
                />
                <!-- <label v-if="validation[5] === false && validationTrigger" for="input" class="text_red mb font_small text_two">Do not leave this blank</label> -->
              </div>
              <div v-if="!perKg" style="width: 33vw">
                <select
                  id="exampleFormControlSelect1"
                  v-model="edit_item.units"
                  class="select_box mt-3 float-right text_grey-3 focus"
                  style="width: 30vw"
                >
                  <option class="options text_grey" selected>UNITS</option>
                  <option class="options text_grey">ML</option>
                  <option class="options text_grey">LITRE</option>
                  <option class="options text_grey">GRAM</option>
                  <option class="options text_grey">KILOGRAM</option>
                </select>
                <label
                  v-if="validation[6] === false && validationTrigger"
                  for="input"
                  class="text_red mb font_small text_two"
                  >Do not leave this blank</label
                >
              </div>
            </div>
            <div style="width: 75vw" class="mt-3 d-flex justify-content-start">
              <input v-model="perKg" type="checkbox" class="mt-1" />
              <p class="text_grey-1 mb font_small text_two ml-2">Item per Kg</p>
            </div>
            <div
              style="width: 75vw"
              class="mt-3 d-flex justify-content-between flex-wrap"
            >
              <div class="mt-3">
                <div style="width: 33vw">
                  <label for="input" class="text_grey-1 mb font_small text_two"
                    >MRP <span v-if="perKg">(per Kg)</span></label
                  >
                  <input
                    v-model="edit_item.unit_price"
                    type="text"
                    class="pl-2 inputs focus"
                  />
                  <label
                    v-if="validation[7] === false && validationTrigger"
                    for="input"
                    class="text_red mb font_small text_two"
                    >Do not leave this blank</label
                  >
                </div>
              </div>
              <div
                class="permission_card d-flex align-items-center pt-2"
                style="margin-top: 2.5rem"
              >
                <label class="switch ml-2 float-left">
                  <input v-model="edit_item.essential" type="checkbox" />
                  <span class="slider round" />
                </label>
                <p class="float-right pt-2 text_grey-3 pl-3">Essential</p>
              </div>
            </div>
            <div
              style="width: 75vw"
              class="mt-3 d-flex justify-content-start flex-wrap"
            >
              <div style="width: 33vw">
                <label for="input" class="text_grey-1 mb font_small text_two"
                  >Discount <span v-if="perKg">(per Kg)</span></label
                >
                <input
                  v-model="edit_item.discount"
                  type="text"
                  class="pl-2 inputs focus"
                />
              </div>
            </div>
            <div
              style="width: 75vw"
              class="mt-3 d-flex justify-content-start flex-wrap"
            >
              <div style="width: 33vw">
                <label for="input" class="text_grey-1 mb font_small text_two"
                  >Stocks</label
                >
                <input
                  v-model="edit_item.stock"
                  type="number"
                  class="pl-2 inputs focus"
                />
              </div>
            </div>
            <div
              style="width: 75vw"
              class="mt-3 d-flex justify-content-around mt-3 mb-4"
            >
              <div
                style="z-index: 1; width: 32vw"
                class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                @click="
                  () => {
                    currentCategory = '';
                    subcategory = null;
                    (subsubcategory = null),
                      (edit_item = {
                        name: '',
                        brand: '',
                        quantity: 0,
                        units: 'UNITS',
                        unit_price: 0,
                        unit_price_currency: 'INR',
                        discount: 0,
                        picurl: '',
                        barcode: '',
                        essential: false,
                        // ai_data_url: '',
                        disabled: false,
                        selling_price: 0,
                      });
                    show_addItem = false;
                  }
                "
              >
                <p class="text_two mb blue_text font-weight-bold">Cancel</p>
              </div>
              <div
                v-if="
                  edit_item.unit_price > 0 &&
                  edit_item.name.length &&
                  edit_item.barcode.length > 3 &&
                  edit_item.brand.length &&
                  currentCategory.length
                "
                style="z-index: 1; width: 32vw"
                class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                @click="addNewInventoryItemFromScratch()"
              >
                <p class="text_two mb blue_text font-weight-bold">Save</p>
              </div>
              <div
                v-else
                style="z-index: 1; width: 32vw"
                class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                @click="validationTrigger = true"
              >
                <p class="text_two mb font-weight-bold">Save</p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="resetPopUp"
          style="background-color: green"
          class="d-flex justify-content-center align-items-center PopUpFooter text-center text-white"
        >
          {{ resetPopUp }}
        </div>
        <div
          v-if="!searchResult && !openInput && !empty_cart() && !show_addItem"
          style="z-index: 0"
          class="footer d-flex align-items-center justify-content-around"
        >
          <div
            v-if="!empty_cart()"
            class="hover_inside ripple d-flex justify-content-center align-items-center cmp"
            @click="
              updateVisit();
              $router.push('/home');
            "
          >
            <p
              style="font-weight: 700; line-height: 15px"
              class="text_two mb font-weight-bold blue_text"
            >
              Completed
            </p>
          </div>
          <div
            v-if="!empty_cart()"
            class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center"
            @click="!$store.getters.modeOff ? (show1 = true) : direct()"
          >
            <p
              style="font-weight: 700; line-height: 15px"
              class="text_two mb font-weight-bold blue_text"
            >
              Direct Estimate
            </p>
          </div>
          <div
            v-if="!empty_cart()"
            class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center"
            @click="!$store.getters.modeOff ? (show2 = true) : direct2()"
          >
            <p
              style="font-weight: 700; line-height: 15px"
              class="text_two mb font-weight-bold blue_text"
            >
              Direct Thin Estimate
            </p>
          </div>
          <!-- <div
            v-if="!empty_cart()"
            class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center"
            @click="!$store.getters.modeOff ? (show3 = true) : direct3()"
          >
            <p
              style="font-weight: 700; line-height: 15px; text-align: center"
              class="text_two mb font-weight-bold blue_text"
            >
              Direct Thin Estimate <br />
              (Old Android)
            </p>
          </div> -->
          <div
            v-if="!empty_cart()"
            class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center"
            @click="!$store.getters.modeOff ? (show4 = true) : direct1()"
          >
            <p
              style="font-weight: 700; line-height: 15px"
              class="text_two mb font-weight-bold blue_text"
            >
              Direct Invoice
            </p>
          </div>
          <div
            v-if="!empty_cart()"
            class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center"
            @click="!$store.getters.modeOff ? (show5 = true) : direct5()"
          >
            <p
              style="font-weight: 700; line-height: 15px"
              class="text_two mb font-weight-bold blue_text"
            >
              Direct Invoice (A4)
            </p>
          </div>
          <div
            v-if="!empty_cart()"
            class="hover_inside footer_btn ripple d-flex justify-content-center align-items-center"
            @click="activateFreeGift = !activateFreeGift"
          >
            <p
              style="font-weight: 700; line-height: 15px; text-align: center"
              class="text_two mb font-weight-bold blue_text"
            >
              Free Gift
            </p>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="confirmBill"
          class="modal d-flex justify-content-center align-items-center flex-wrap"
          @click="popUp($event)"
          style="border-radius: 10px; syntax: 80vw"
        >
          <div class="modal-content" style="width: 35vw">
            <div
              style="
                color: #404040;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
              "
            >
              Are you sure you want to complete the order ?
            </div>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-around align-items-center"
            >
              <div
                class="btn2 d-flex justify-content-center align-items-center"
                @click="
                  updateVisit();
                  $router.push('/home');
                "
              >
                <p class="m-0 txt2 text_green">Yes</p>
              </div>
              <div
                class="btn2 d-flex justify-content-center align-items-center"
                @click="confirmBill = false"
              >
                <p class="m-0 txt2 text_orange">No</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="show1"
          class="modal flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div
            class="modal-content d-flex align-item-center flex-column justify-content-center"
            style="width: 40vw"
          >
            <div
              style="
                color: #404040;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
              "
            >
              Select Payment mode:
            </div>
            <select
              v-model="curr"
              class="mt-2 mb-2 select_box1 text_grey-3 focus"
              style="width: 35%; margin: 0 auto"
              @change="selectMode()"
              @click="stopProp($event)"
            >
              <option v-for="(mode, i) in modes" :key="i" :value="mode">
                {{ mode }}
              </option>
            </select>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-center align-items-center"
            >
              <div
                class="btn1 d-flex justify-content-center align-items-center"
                @click="direct()"
              >
                <p class="m-0 txt2">Done</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="show2"
          class="modal flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div
            class="modal-content d-flex align-item-center flex-column justify-content-center"
            style="width: 40vw"
          >
            <div
              style="
                color: #404040;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
              "
            >
              Select Payment mode:
            </div>
            <select
              v-model="curr"
              class="select_box1 mt-2 mb-2 text_grey-3 focus"
              style="width: 35%; margin: 0 auto"
              @change="selectMode()"
              @click="stopProp($event)"
            >
              <option v-for="(mode, i) in modes" :key="i" :value="mode">
                {{ mode }}
              </option>
            </select>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-center align-items-center"
            >
              <div
                class="btn1 d-flex justify-content-center align-items-center"
                @click="direct2()"
              >
                <p class="m-0 txt2">Done</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="show3"
          class="modal flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div
            class="modal-content d-flex align-item-center flex-column justify-content-center"
            style="width: 40vw"
          >
            <div
              style="
                color: #404040;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
              "
            >
              Select Payment mode:
            </div>
            <select
              v-model="curr"
              class="select_box1 mt-2 mb-2 text_grey-3 focus"
              style="width: 35%; margin: 0 auto"
              @change="selectMode()"
              @click="stopProp($event)"
            >
              <option v-for="(mode, i) in modes" :key="i" :value="mode">
                {{ mode }}
              </option>
            </select>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-center align-items-center"
            >
              <div
                class="btn1 d-flex justify-content-center align-items-center"
                @click="direct3()"
              >
                <p class="m-0 txt2">Done</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="show5"
          class="modal flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div
            class="modal-content d-flex align-item-center flex-column justify-content-center"
            style="width: 40vw"
          >
            <div
              style="
                color: #404040;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
              "
            >
              Select Payment mode:
            </div>
            <select
              v-model="curr"
              class="select_box1 mt-2 mb-2 text_grey-3 focus"
              style="width: 35%; margin: 0 auto"
              @change="selectMode()"
              @click="stopProp($event)"
            >
              <option v-for="(mode, i) in modes" :key="i" :value="mode">
                {{ mode }}
              </option>
            </select>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-center align-items-center"
            >
              <div
                class="btn1 d-flex justify-content-center align-items-center"
                @click="direct5()"
              >
                <p class="m-0 txt2">Done</p>
              </div>
            </div>
          </div>
        </div>
        <div
          id="modal-sm"
          v-if="show4"
          class="modal flex-wrap"
          style="border-radius: 10px; syntax: 80vw"
          @click="popUp($event)"
        >
          <div
            class="modal-content d-flex align-item-center flex-column justify-content-center"
            style="width: 40vw"
          >
            <div
              style="
                color: #404040;
                font-size: 14px;
                font-weight: 700;
                line-height: 18px;
                text-align: center;
              "
            >
              Select Payment mode:
            </div>
            <select
              v-model="curr"
              class="select_box1 mt-2 mb-2 text_grey-3 focus"
              style="width: 35%; margin: 0 auto"
              @change="selectMode()"
              @click="stopProp($event)"
            >
              <option v-for="(mode, i) in modes" :key="i" :value="mode">
                {{ mode }}
              </option>
            </select>
            <div
              style="width: 100%"
              class="mt-2 d-flex justify-content-center align-items-center"
            >
              <div
                class="btn1 d-flex justify-content-center align-items-center"
                @click="direct1()"
              >
                <p class="m-0 txt2">Done</p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="openInput"
          class="mx-auto mt-3"
          style="width: 90%; margin-bottom: 4rem"
        >
          <div class="text mt-2">Items:</div>
          <div
            class="back p-2 d-flex justify-content-between align-items-center"
          >
            <div style="width: 45%">
              <label for="input" class="text1">Consumer Name</label>
              <div class="d-flex justify-content-between">
                <input
                  v-model="consumer_name"
                  type="text"
                  class="inputs pl-2 mt-1 focus"
                />
              </div>
              <!-- <label v-if="consumer_name" for="input" class="text_red"
                >Please do not leave this blank</label
              > -->
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
              <!-- <label v-if="consumer_phn" for="input" class="text_red"
                >Please do not leave this blank</label
              > -->
            </div>
          </div>
          <div
            class="back p-2 d-flex justify-content-between align-items-center"
          >
            <div style="width: 45%">
              <label for="input" class="text1">Consumer GST</label>
              <div class="d-flex justify-content-between">
                <input
                  v-model="consumer_gst"
                  type="text"
                  class="inputs pl-2 mt-1 focus"
                />
              </div>
              <!-- <label v-if="consumer_gst" for="input" class="text_red"
                >Please do not leave this blank</label
              > -->
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
                  <!-- <img
                    :src="imageSource1(item.item_details.picurl)"
                    width="48"
                    height="64"
                  /> -->
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
            <p class="supp m-0" style="font-weight: bold">
              Download GST Invoice
            </p>
          </div>
        </div>
      </div>
      <!-- <div style="width: 100vw; height: 40vh;" /> -->
    </div>
  </div>
</template>

<script>
import { shell } from "electron";

export default {
  data() {
    return {
      cart: [],
      changeSp: false,
      percentageDiscount: false,
      temp_solution: true,
      perKg: false,
      searchHighLight: [],
      show_addItem: false,
      validationTrigger: false,
      subCategoryList: [],
      userName: "",
      CategoryHierarchy: {},
      discountType: "Rs",
      categoryList: [],
      subsubcatList: [],
      inputDiscountIndex: [],
      currentCategory: "",
      subcategory: null,
      subsubcategory: null,
      confirmBill: false,
      auth: null,
      curr_cat: "",
      a4: false,
      edit_item: {
        name: "",
        brand: "",
        quantity: 0,
        units: "UNITS",
        unit_price: 0,
        unit_price_currency: "INR",
        discount: 0,
        picurl: "",
        barcode: "",
        essential: false,
        // ai_data_url: '',
        disabled: false,
        selling_price: 0,
      },
      changedPrice: 0,
      PullOut: false,
      ready_to_checkout: false,
      searchResult: false,
      inputIndex: [],
      // default_store_img: 'https://i.pinimg.com/originals/77/c3/66/77c366436d8bd35fe8b3ce5b8c66992e.png',
      cartItemsFromAPI: [],
      updatedInvoice: {},
      defaultItemImg:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTgLogBhkaH4RpL3DxpWXACSxVu846VeDiG9Q&usqp=CAU",
      open_number: false,
      allCartItems: [],
      phone_num: "",
      search_input: "",
      HeightFromTop: 0,
      itemIDS: [],
      resetPopUp: false,
      oldInvoice: null,
      NoitemFound: false,
      show5: false,
      dataset: null,
      LastBarcode: "",
      timeStamp: null,
      NoItemFoundInCatalog: false,
      lastScannedItem: null,
      highLight: [],
      amountPaid: 0,
      middleLayer: false,
      catalogItemIds: [],
      midLayerEl: [],
      items: [],
      caseHandled: false,
      pdf: "",
      invoiceItems1: [],
      data1: null,
      vst: null,
      openInput: false,
      categoryItems: [],
      comp: false,
      comp1: false,
      indexArr: [],
      modes: [],
      curr: "CASH",
      curr_mode: "CASH",
      freeGift: [{ final_chosen: { item_id: null } }],
      activateFreeGift: false,
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      list: [],
      cust: "",
      consumer_name: "",
      consumer_phn: "",
      consumer_gst: "",
      ItemFromCatalog: [
        {
          picurl: "",
        },
      ],
    };
  },
  computed: {
    validation() {
      const testo = [
        false,
        true,
        true,
        false,
        false,
        false,
        true,
        false,
        false,
      ];
      if (Object.keys(this.currentCategory).length) {
        testo[0] = true;
      }
      if (this.subcategory) {
        testo[1] = true;
      }
      if (this.subsubcategory) {
        testo[2] = true;
      }
      if (this.edit_item.brand.length) {
        testo[3] = true;
      }
      if (this.edit_item.name.length) {
        testo[4] = true;
      }
      // if (this.edit_item.quantity > 0 || this.perKg === true) {
      //   testo[5] = true
      // }
      if (this.edit_item.units !== "UNITS") {
        testo[6] = true;
      }
      if (this.edit_item.unit_price > 0) {
        testo[7] = true;
      }
      if (this.edit_item.barcode.length > 3) {
        testo[8] = true;
      }
      return testo;
    },
    final_amount() {
      let dummy = 0;
      if (this.allCartItems) {
        this.allCartItems.forEach((item, idx) => {
          if (item.percent && !item.final_chosen.giftItem) {
            let dis = 0;
            if (this.cartItemsFromAPI[idx]) {
              dis =
                (this.cartItemsFromAPI[idx].dis *
                  item.final_chosen.unit_price) /
                100;
            }
            if (this.cartItemsFromAPI[idx] && dis) {
              if (
                this.cartItemsFromAPI[idx].item_details.units === "GRAM" &&
                this.cartItemsFromAPI[idx].item_details.quantity === 1
              ) {
                dummy +=
                  item.final_chosen.unit_price * item.final_chosen.quantity -
                  item.final_chosen.quantity * dis;
              } else {
                dummy +=
                  item.final_chosen.unit_price * item.final_chosen.quantity -
                  item.final_chosen.quantity * dis;
              }
            } else {
              dummy +=
                item.final_chosen.unit_price * item.final_chosen.quantity -
                item.final_chosen.quantity * item.final_chosen.discount;
            }
          } else if (!item.percent && !item.final_chosen.giftItem) {
            if (this.cartItemsFromAPI[idx] && this.cartItemsFromAPI[idx].dis) {
              if (
                this.cartItemsFromAPI[idx].item_details.units === "GRAM" &&
                this.cartItemsFromAPI[idx].item_details.quantity === 1
              ) {
                dummy +=
                  item.final_chosen.unit_price * item.final_chosen.quantity -
                  (item.final_chosen.quantity *
                    this.cartItemsFromAPI[idx].dis) /
                    1000;
              } else {
                dummy +=
                  item.final_chosen.unit_price * item.final_chosen.quantity -
                  item.final_chosen.quantity * this.cartItemsFromAPI[idx].dis;
              }
            } else {
              dummy +=
                item.final_chosen.unit_price * item.final_chosen.quantity -
                item.final_chosen.quantity * item.final_chosen.discount;
            }
          }
        });
        return dummy;
      } else {
        return 0;
      }
    },
    getTotalRegularCart() {
      let quantity = 0;
      if (this.cart) {
        this.cart.forEach((item, i) => {
          if (
            this.cartItemsFromAPI[i].item_details.units === "GRAM" &&
            this.cartItemsFromAPI[i].item_details.quantity === 1
          ) {
            quantity += 1;
          } else {
            quantity += item.final_chosen.quantity;
          }
        });
      }
      return quantity;
    },
  },
  watch: {
    async allCartItems(cartItems) {
      const itemIDS = this.getItemID(cartItems);
      const a = [];
      this.cartItemsFromAPI.forEach((item, i) => {
        a.push({ dis: item.dis ? item.dis : 0, id: item.item_details.item_id });
      });
      this.cartItemsFromAPI = await this.getItemsFromID(itemIDS);
      this.cartItemsFromAPI.forEach((item, i) => {
        a.forEach((it) => {
          if (it.id === item.item_details.item_id) {
            item.dis = it.dis;
          }
        });
      });
      if (this.cartItemsFromAPI) {
        this.cart = this.allCartItems.filter(
          (item) => item.final_chosen.item_id
        );
      }
    },
  },
  async mounted() {
    this.auth = JSON.parse(localStorage.getItem("storeData"));
    this.$store.commit("toggle", localStorage.getItem("internet") === "true");
    this.$store.commit("modeOff", localStorage.getItem("mode") === "true");
    this.$store.commit("roundOff", localStorage.getItem("roundOff") === "true");
    this.$store.commit("compress", localStorage.getItem("compress") === "true");
    this.$store.commit("estimate", localStorage.getItem("estimate") === "true");
    const data = await this.getPaymentMode();
    this.modes = data ? [...data] : [];
    if (this.$store.getters.delInvoice) {
      const response = await this.CheckAdvanceNumber();
      const shopperId = response.shopper_id;
      await this.handleAdvanceRelationship(shopperId);
      this.$store.commit("delInvoice", false);
      this.open_number = true;
    }
    this.allCartItems = this.$store.getters.cartItems;
    this.allCartItems.forEach((key) => {
      if (key.final_chosen.unit_price === 0) {
        this.freeGift.push(key);
      }
    });
    this.cart = this.allCartItems.filter((item) => item.final_chosen.item_id);
    this.CategoryHierarchy = await this.getCategoryHierarchy();
    if (this.cart) {
      const itemIDS = this.getItemID(this.allCartItems);
      const cartItems = await this.getItemsFromID(itemIDS);
      if (cartItems !== undefined) {
        this.cartItemsFromAPI = cartItems;
      } else {
        alert(
          "Failed to fetch product details from server! Check logs for more info."
        );
      }
    }
    this.cartItemsFromAPI.forEach((item) => {
      item.dis = 0;
    });
    if (this.$store.getters.shortCutToBarcodeGun) {
      this.phone_num = "9999999999";
      this.confirmNumber();
      this.$store.commit("shortCutToBarcodeGun", false);
    }
    let barcode = "";
    let interval;
    const thiz = this;
    const evtCodes = [
      64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
      82, 83, 84, 85, 86, 87, 88, 89, 90,
    ];
    // const evtCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
    // const evtCodes = [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
    setTimeout(() => {
      document.getElementById("PhoneNumber").focus();
    }, 1000);
    thiz.timeStamp = async function (evt) {
      if (interval) {
        clearInterval(interval);
      }
      let BarcodeTrigger = false;
      if (evt.code === "Enter") {
        if (barcode) {
          BarcodeTrigger = true;
        }
        if (barcode) {
          console.log(barcode, "first");
          if (barcode.includes(thiz.LastBarcode) && thiz.LastBarcode.length) {
            barcode = thiz.LastBarcode;
          } else {
            thiz.LastBarcode = barcode;
          }
          console.log(barcode, "second");
          // const regExp = /[a-zA-Z]/g
          // if (regExp.test(thiz.LastBarcode)) {
          //   thiz.LastBarcode = thiz.LastBarcode.slice(0, -6)
          // }
          // if (regExp.test(barcode)) {
          //   barcode = barcode.slice(0, -6)
          // }
          thiz.dataset = await thiz.searchBarcode(barcode);
          if (
            thiz.dataset.catalog_list == null &&
            thiz.dataset.inventory_list == null
          ) {
            thiz.NoitemFound = true;
            setTimeout(() => {
              thiz.NoitemFound = false;
            }, 1000);
            thiz.NoItemFoundInCatalog = true;
          }
          // const dataset = [
          //   {
          //     product_description: '1900508000697',
          //     product_id: 65,
          //     score: 1.4733058214187622,
          //     shop_id: 1
          //   },
          //   {
          //     product_description: '1900508000697',
          //     product_id: 64,
          //     score: 1.4733058214187622,
          //     shop_id: 1
          //   }
          // ]
          if (thiz.dataset.inventory_list !== null) {
            if (thiz.dataset.inventory_list.length > 1) {
              const itemIds = [];
              thiz.dataset.inventory_list.forEach((key) => {
                itemIds.push(key.product_id);
              });
              const itemDetails = await thiz.getItemsFromID(itemIds);
              if (itemDetails.length > 1) {
                thiz.middleLayer = true;
                thiz.midLayerEl = [...itemDetails];
              } else if (itemDetails.length === 1) {
                const ItemToProcceed = {
                  customer_input_picurl: "string",
                  customer_input_barcode: "string",
                  customer_input_text: "string",
                  customer_input_speechurl: "string",
                  ai_outputs_item_ids: [0],
                  final_chosen: {
                    giftItem: false,
                    item_id: itemDetails[0].item_details.item_id,
                    quantity: 1,
                    unit_price: itemDetails[0].item_details.unit_price,
                    final_price: itemDetails[0].item_details.unit_price,
                    discount: itemDetails[0].item_details.discount,
                    discountReason: "non",
                  },
                };
                if (thiz.activateFreeGift) {
                  ItemToProcceed.final_chosen.giftItem = true;
                  ItemToProcceed.final_chosen.discount = 0;
                  ItemToProcceed.final_chosen.final_price = 0;
                  ItemToProcceed.final_chosen.unit_price = 0;
                  thiz.freeGift.push(ItemToProcceed);
                }
                thiz.activateFreeGift = false;
                thiz.lastScannedItem = itemDetails[0].item_details.item_id;
                thiz.$store.commit("addToCartAlpha", ItemToProcceed);
              } else {
                thiz.barcodeGunitemCall(barcode);
              }
            } else {
              const item = await thiz.getItemsFromID([
                thiz.dataset.inventory_list[0].product_id,
              ]);
              if (item.length) {
                const ItemToProcceed = {
                  customer_input_picurl: "string",
                  customer_input_barcode: "string",
                  customer_input_text: "string",
                  customer_input_speechurl: "string",
                  ai_outputs_item_ids: [0],
                  final_chosen: {
                    giftItem: false,
                    item_id: item[0].item_details.item_id,
                    quantity: 1,
                    unit_price: item[0].item_details.unit_price,
                    final_price: item[0].item_details.unit_price,
                    discount: item[0].item_details.discount,
                    discountReason: "non",
                  },
                };
                if (thiz.activateFreeGift) {
                  ItemToProcceed.final_chosen.giftItem = true;
                  ItemToProcceed.final_chosen.discount = 0;
                  ItemToProcceed.final_chosen.unit_price = 0;
                  ItemToProcceed.final_chosen.final_price = 0;
                  thiz.freeGift.push(ItemToProcceed);
                }
                // let giftCheck = false
                // thiz.freeGift.forEach((key) => {
                //   if (key.final_chosen.item_id === ItemToProcceed.final_chosen.item_id) {
                //     giftCheck = true
                //   }
                // })
                thiz.activateFreeGift = false;
                thiz.lastScannedItem = item[0].item_details.item_id;
                thiz.$store.commit("addToCartAlpha", ItemToProcceed);
              } else {
                thiz.NoitemFound = true;
                setTimeout(() => {
                  thiz.NoitemFound = false;
                  thiz.barcodeGunitemCall(barcode);
                }, 1000);
                setTimeout(() => {
                  barcode = "";
                }, 30);
                return;
              }
            }
          } else {
            thiz.NoitemFound = true;
            setTimeout(() => {
              thiz.NoitemFound = false;
              thiz.barcodeGunitemCall(barcode);
            }, 1000);
            setTimeout(() => {
              barcode = "";
            }, 30);
            return;
          }
        }
      }
      const evtobj = window.event ? event : evt;
      if (evt.keyCode === 13 && thiz.confirmBill && thiz.open_number) {
        thiz.updateVisit();
        thiz.$router.push("/home");
      }
      if (
        evt.keyCode === 13 &&
        !thiz.show3 &&
        !thiz.show1 &&
        !thiz.show2 &&
        !thiz.show4 &&
        !thiz.show5 &&
        !thiz.empty_cart() &&
        !thiz.addItemCheck() &&
        !thiz.search_input.length &&
        !thiz.searchResult &&
        thiz.open_number &&
        !BarcodeTrigger &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length
      ) {
        thiz.confirmBill = true;
      }
      if (
        evt.keyCode === 27 &&
        !thiz.show3 &&
        !thiz.show1 &&
        !thiz.show2 &&
        !thiz.show4 &&
        !thiz.show5 &&
        !thiz.empty_cart() &&
        !thiz.addItemCheck() &&
        !thiz.search_input.length &&
        !thiz.searchResult &&
        thiz.open_number &&
        !BarcodeTrigger &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length &&
        thiz.confirmBill
      ) {
        thiz.confirmBill = false;
      }
      if (
        evt.keyCode === 27 &&
        (thiz.show3 || thiz.show1 || thiz.show2 || thiz.show4 || thiz.show5) &&
        !thiz.empty_cart() &&
        !thiz.addItemCheck() &&
        !thiz.search_input.length &&
        !thiz.searchResult &&
        thiz.open_number &&
        !BarcodeTrigger &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length &&
        !thiz.confirmBill
      ) {
        thiz.show3 = false;
        thiz.show1 = false;
        thiz.show2 = false;
        thiz.show4 = false;
        thiz.show5 = false;
      }
      if (evtobj.keyCode === 88 && evtobj.ctrlKey && !thiz.open_number) {
        thiz.phone_num = "9999999999";
        thiz.confirmNumber();
      }
      if (evtobj.keyCode === 18 && evtobj.keyCode === 83) {
        thiz.openChangeSPricePop();
      }
      if (evt.code !== "Shift") {
        barcode += evt.key;
      }
      interval = setInterval(() => {
        barcode = "";
      }, 20);
      if (
        evtCodes.includes(evt.keyCode) &&
        !evtobj.ctrlKey &&
        !thiz.show_addItem &&
        !thiz.mixCheck() &&
        evt.code !== "Digit0"
      ) {
        if (
          !this.show_addItem &&
          !this.openInput &&
          document.getElementById("searchBox")
        )
          document.getElementById("searchBox").focus();
      }
      if (evt.keyCode === 27 && evtobj.ctrlKey) {
        if (thiz.open_number) {
          thiz.PullOut = true;
        } else {
          thiz.$store.commit("CLEAR_CART");
          thiz.$store.commit("EnterToNumber", []);
          thiz.$router.push("/home");
        }
      }
      let ItemSelected = false;
      if (
        evt.keyCode === 38 &&
        !thiz.searchResult &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length
      ) {
        if (document.documentElement.scrollTop === 0) {
          thiz.HeightFromTop = 0;
          window.scrollTo(0, 0);
        } else {
          thiz.HeightFromTop -= 200;
          window.scrollTo(0, thiz.HeightFromTop);
        }
        if (!thiz.highLight.length) {
          thiz.highLight.push(thiz.cartItemsFromAPI[0].item_details.item_id);
        } else {
          thiz.cartItemsFromAPI.forEach((key, i) => {
            if (
              thiz.highLight[0] === key.item_details.item_id &&
              !ItemSelected
            ) {
              if (i !== 0) {
                thiz.highLight = [];
                // window.scrollTo(0, -500)
                thiz.highLight.push(
                  thiz.cartItemsFromAPI[i - 1].item_details.item_id
                );
                ItemSelected = true;
              }
            }
          });
        }
      }
      if (
        evt.keyCode === 40 &&
        !thiz.searchResult &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length
      ) {
        // const height = document.documentElement.scrollTop
        if (!thiz.highLight.length) {
          thiz.highLight.push(thiz.cartItemsFromAPI[0].item_details.item_id);
        } else {
          thiz.cartItemsFromAPI.forEach((key, i) => {
            if (
              thiz.highLight[0] === key.item_details.item_id &&
              !ItemSelected
            ) {
              if (typeof thiz.cartItemsFromAPI[i + 1] !== "undefined") {
                thiz.highLight = [];
                thiz.highLight.push(
                  thiz.cartItemsFromAPI[i + 1].item_details.item_id
                );
                ItemSelected = true;
                thiz.searchHighLight = [];
                window.scrollTo(0, thiz.HeightFromTop);
                thiz.HeightFromTop += 200;
              }
            }
          });
        }
      }
      ItemSelected = true;
      if (
        evt.keyCode === 39 &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length
      ) {
        if (!thiz.highLight.length) {
          thiz.$store.commit("changeItemCount", ["plus", thiz.lastScannedItem]);
        } else {
          thiz.$store.commit("changeItemCount", ["plus", thiz.highLight[0]]);
        }
      }
      if (
        evt.keyCode === 37 &&
        !thiz.inputIndex.length &&
        !thiz.inputDiscountIndex.length
      ) {
        if (!thiz.highLight.length) {
          thiz.$store.commit("changeItemCount", [
            "minus",
            thiz.lastScannedItem,
          ]);
        } else {
          const idx = thiz.cartItemsFromAPI.findIndex(
            (item) => item.item_details.item_id === thiz.highLight[0]
          );
          const tempData = [...thiz.highLight];
          if (thiz.allCartItems[idx].final_chosen.quantity === 1) {
            thiz.highLight = [];
          }
          thiz.$store.commit("changeItemCount", ["minus", tempData[0]]);
        }
      }
      const el = document.getElementById("userName");
      if (evt.keyCode === 13 && el === document.activeElement) {
        setTimeout(async () => {
          await thiz.searchUserByName();
        }, 100);
      }
      if (
        evt.keyCode === 13 &&
        !thiz.searchResult &&
        !thiz.open_number &&
        el !== document.activeElement
      ) {
        thiz.confirmNumber();
      }
      if (evt.keyCode === 81 && evtobj.ctrlKey && !thiz.empty_cart()) {
        if (thiz.$store.getters.modeOff) {
          thiz.direct();
        } else {
          thiz.show1 = true;
          thiz.show2 = false;
          thiz.show3 = false;
          thiz.show4 = false;
          thiz.curr = "CASH";
          thiz.curr_mode = "CASH";
        }
      }
      if (evt.keyCode === 66 && evtobj.ctrlKey && !thiz.empty_cart()) {
        if (thiz.$store.getters.modeOff) {
          thiz.direct2();
        } else {
          thiz.show1 = false;
          thiz.show2 = true;
          thiz.show3 = false;
          thiz.show4 = false;
          thiz.curr = "CASH";
          thiz.curr_mode = "CASH";
        }
      }
      if (evt.keyCode === 73 && evtobj.ctrlKey && !thiz.empty_cart()) {
        if (thiz.$store.getters.modeOff) {
          thiz.direct3();
        } else {
          thiz.show1 = false;
          thiz.show2 = false;
          thiz.show3 = true;
          thiz.show4 = false;
          thiz.curr = "CASH";
          thiz.curr_mode = "CASH";
        }
      }
      if (evt.keyCode === 77 && evtobj.ctrlKey && !thiz.empty_cart()) {
        if (thiz.$store.getters.modeOff) {
          thiz.direct1();
        } else {
          thiz.show1 = false;
          thiz.show2 = false;
          thiz.show3 = false;
          thiz.show4 = true;
          thiz.curr = "CASH";
          thiz.curr_mode = "CASH";
        }
      }
      BarcodeTrigger = false;
      thiz.shortCuts(evt, evtobj);
    };
    document.addEventListener("keydown", thiz.timeStamp);
  },
  destroyed() {
    document.removeEventListener("keydown", this.timeStamp);
  },
  methods: {
    reset() {
      document.removeEventListener("keydown", this.timeStamp);
      let barcode = "";
      let interval;
      const thiz = this;
      const evtCodes = [
        64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81,
        82, 83, 84, 85, 86, 87, 88, 89, 90,
      ];
      // const evtCodes = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90]
      // const evtCodes = [64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122]
      thiz.timeStamp = async function (evt) {
        if (interval) {
          clearInterval(interval);
        }
        let BarcodeTrigger = false;
        if (evt.code === "Enter") {
          if (barcode) {
            BarcodeTrigger = true;
          }
          if (barcode) {
            thiz.LastBarcode = barcode;
            // const regExp = /[a-zA-Z]/g
            // if (regExp.test(thiz.LastBarcode)) {
            //   thiz.LastBarcode = thiz.LastBarcode.slice(0, -6)
            // }
            // if (regExp.test(barcode)) {
            //   barcode = barcode.slice(0, -6)
            // }
            thiz.dataset = await thiz.searchBarcode(barcode);
            thiz.dataset = await thiz.searchBarcode(barcode);
            if (
              thiz.dataset.catalog_list == null &&
              thiz.dataset.inventory_list == null
            ) {
              thiz.NoitemFound = true;
              setTimeout(() => {
                thiz.NoitemFound = false;
              }, 1000);
              thiz.NoItemFoundInCatalog = true;
            }
            // const dataset = [
            //   {
            //     product_description: '1900508000697',
            //     product_id: 65,
            //     score: 1.4733058214187622,
            //     shop_id: 1
            //   },
            //   {
            //     product_description: '1900508000697',
            //     product_id: 64,
            //     score: 1.4733058214187622,
            //     shop_id: 1
            //   }
            // ]
            if (thiz.dataset.inventory_list !== null) {
              if (thiz.dataset.inventory_list.length > 1) {
                const itemIds = [];
                thiz.dataset.inventory_list.forEach((key) => {
                  itemIds.push(key.product_id);
                });
                const itemDetails = await thiz.getItemsFromID(itemIds);
                if (itemDetails.length > 1) {
                  thiz.middleLayer = true;
                  thiz.midLayerEl = [...itemDetails];
                } else if (itemDetails.length === 1) {
                  const ItemToProcceed = {
                    customer_input_picurl: "string",
                    customer_input_barcode: "string",
                    customer_input_text: "string",
                    customer_input_speechurl: "string",
                    ai_outputs_item_ids: [0],
                    final_chosen: {
                      giftItem: false,
                      item_id: itemDetails[0].item_details.item_id,
                      quantity: 1,
                      unit_price: itemDetails[0].item_details.unit_price,
                      final_price: itemDetails[0].item_details.unit_price,
                      discount: itemDetails[0].item_details.discount,
                      discountReason: "non",
                    },
                  };
                  if (thiz.activateFreeGift) {
                    ItemToProcceed.final_chosen.giftItem = true;
                    ItemToProcceed.final_chosen.discount = 0;
                    ItemToProcceed.final_chosen.final_price = 0;
                    ItemToProcceed.final_chosen.unit_price = 0;
                    thiz.freeGift.push(ItemToProcceed);
                  }
                  thiz.activateFreeGift = false;
                  thiz.lastScannedItem = itemDetails[0].item_details.item_id;
                  thiz.$store.commit("addToCartAlpha", ItemToProcceed);
                } else {
                  thiz.barcodeGunitemCall(barcode);
                }
              } else {
                const item = await thiz.getItemsFromID([
                  thiz.dataset.inventory_list[0].product_id,
                ]);
                if (item.length) {
                  const ItemToProcceed = {
                    customer_input_picurl: "string",
                    customer_input_barcode: "string",
                    customer_input_text: "string",
                    customer_input_speechurl: "string",
                    ai_outputs_item_ids: [0],
                    final_chosen: {
                      giftItem: false,
                      item_id: item[0].item_details.item_id,
                      quantity: 1,
                      unit_price: item[0].item_details.unit_price,
                      final_price: item[0].item_details.unit_price,
                      discount: item[0].item_details.discount,
                      discountReason: "non",
                    },
                  };
                  if (thiz.activateFreeGift) {
                    ItemToProcceed.final_chosen.giftItem = true;
                    ItemToProcceed.final_chosen.discount = 0;
                    ItemToProcceed.final_chosen.unit_price = 0;
                    ItemToProcceed.final_chosen.final_price = 0;
                    thiz.freeGift.push(ItemToProcceed);
                  }
                  // let giftCheck = false
                  // thiz.freeGift.forEach((key) => {
                  //   if (key.final_chosen.item_id === ItemToProcceed.final_chosen.item_id) {
                  //     giftCheck = true
                  //   }
                  // })
                  thiz.activateFreeGift = false;
                  thiz.lastScannedItem = item[0].item_details.item_id;
                  thiz.$store.commit("addToCartAlpha", ItemToProcceed);
                } else {
                  thiz.NoitemFound = true;
                  setTimeout(() => {
                    thiz.NoitemFound = false;
                    thiz.barcodeGunitemCall(barcode);
                  }, 1000);
                  setTimeout(() => {
                    barcode = "";
                  }, 30);
                  return;
                }
              }
            } else {
              thiz.NoitemFound = true;
              setTimeout(() => {
                thiz.NoitemFound = false;
                thiz.barcodeGunitemCall(barcode);
              }, 1000);
              setTimeout(() => {
                barcode = "";
              }, 30);
              return;
            }
          }
        }
        const evtobj = window.event ? event : evt;
        if (evt.keyCode === 13 && thiz.confirmBill && thiz.open_number) {
          thiz.updateVisit();
          thiz.$router.push("/home");
        }
        if (
          evt.keyCode === 13 &&
          !thiz.show3 &&
          !thiz.show1 &&
          !thiz.show2 &&
          !thiz.show4 &&
          !thiz.addItemCheck() &&
          !thiz.search_input.length &&
          !thiz.searchResult &&
          thiz.open_number &&
          !BarcodeTrigger &&
          !thiz.inputIndex.length &&
          !thiz.inputDiscountIndex.length
        ) {
          thiz.confirmBill = true;
        }
        if (evtobj.keyCode === 88 && evtobj.ctrlKey && !thiz.open_number) {
          thiz.phone_num = "9999999999";
          thiz.confirmNumber();
        }
        if (evt.code !== "Shift") {
          barcode += evt.key;
        }
        interval = setInterval(() => {
          barcode = "";
        }, 20);
        if (
          evtCodes.includes(evt.keyCode) &&
          !evtobj.ctrlKey &&
          !thiz.show_addItem &&
          !thiz.mixCheck() &&
          evt.code !== "Digit0"
        ) {
          document.getElementById("searchBox").focus();
        }
        if (evt.keyCode === 27 && evtobj.ctrlKey) {
          if (thiz.open_number) {
            thiz.PullOut = true;
          } else {
            thiz.$store.commit("CLEAR_CART");
            thiz.$store.commit("EnterToNumber", []);
            thiz.$router.push("/home");
          }
        }
        let ItemSelected = false;
        if (
          evt.keyCode === 38 &&
          !thiz.searchResult &&
          !thiz.inputIndex.length &&
          !thiz.inputDiscountIndex.length
        ) {
          if (document.documentElement.scrollTop === 0) {
            thiz.HeightFromTop = 0;
            window.scrollTo(0, 0);
          } else {
            thiz.HeightFromTop -= 200;
            window.scrollTo(0, thiz.HeightFromTop);
          }
          if (!thiz.highLight.length) {
            thiz.highLight.push(thiz.cartItemsFromAPI[0].item_details.item_id);
          } else {
            thiz.cartItemsFromAPI.forEach((key, i) => {
              if (
                thiz.highLight[0] === key.item_details.item_id &&
                !ItemSelected
              ) {
                if (i !== 0) {
                  thiz.highLight = [];
                  // window.scrollTo(0, -500)
                  thiz.highLight.push(
                    thiz.cartItemsFromAPI[i - 1].item_details.item_id
                  );
                  ItemSelected = true;
                }
              }
            });
          }
        }
        if (
          evt.keyCode === 40 &&
          !thiz.searchResult &&
          !thiz.inputIndex.length &&
          !thiz.inputDiscountIndex.length
        ) {
          // const height = document.documentElement.scrollTop
          if (!thiz.highLight.length) {
            thiz.highLight.push(thiz.cartItemsFromAPI[0].item_details.item_id);
          } else {
            thiz.cartItemsFromAPI.forEach((key, i) => {
              if (
                thiz.highLight[0] === key.item_details.item_id &&
                !ItemSelected
              ) {
                if (typeof thiz.cartItemsFromAPI[i + 1] !== "undefined") {
                  thiz.highLight = [];
                  thiz.highLight.push(
                    thiz.cartItemsFromAPI[i + 1].item_details.item_id
                  );
                  ItemSelected = true;
                  thiz.searchHighLight = [];
                  window.scrollTo(0, thiz.HeightFromTop);
                  thiz.HeightFromTop += 200;
                }
              }
            });
          }
        }
        ItemSelected = true;
        if (
          evt.keyCode === 39 &&
          !thiz.inputIndex.length &&
          !thiz.inputDiscountIndex.length
        ) {
          if (!thiz.highLight.length) {
            thiz.$store.commit("changeItemCount", [
              "plus",
              thiz.lastScannedItem,
            ]);
          } else {
            thiz.$store.commit("changeItemCount", ["plus", thiz.highLight[0]]);
          }
        }
        if (
          evt.keyCode === 37 &&
          !thiz.inputIndex.length &&
          !thiz.inputDiscountIndex.length
        ) {
          if (!thiz.highLight.length) {
            thiz.$store.commit("changeItemCount", [
              "minus",
              thiz.lastScannedItem,
            ]);
          } else {
            const idx = thiz.cartItemsFromAPI.findIndex(
              (item) => item.item_details.item_id === thiz.highLight[0]
            );
            const tempData = [...thiz.highLight];
            if (thiz.allCartItems[idx].final_chosen.quantity === 1) {
              thiz.highLight = [];
            }
            thiz.$store.commit("changeItemCount", ["minus", tempData[0]]);
          }
        }
        if (evt.keyCode === 13 && !thiz.searchResult && !thiz.open_number) {
          thiz.confirmNumber();
        }
        const el = document.getElementById("userName");
        if (evt.keyCode === 13 && el === document.activeElement) {
          setTimeout(async () => {
            await thiz.searchUserByName();
          }, 100);
        }
        if (evt.keyCode === 81 && evtobj.ctrlKey && !thiz.empty_cart()) {
          if (thiz.$store.getters.modeOff) {
            thiz.direct();
          } else {
            thiz.show1 = true;
            thiz.show2 = false;
            thiz.show3 = false;
            thiz.show4 = false;
            thiz.curr = "CASH";
            thiz.curr_mode = "CASH";
          }
        }
        if (evt.keyCode === 66 && evtobj.ctrlKey && !thiz.empty_cart()) {
          if (thiz.$store.getters.modeOff) {
            thiz.direct2();
          } else {
            thiz.show1 = false;
            thiz.show2 = true;
            thiz.show3 = false;
            thiz.show4 = false;
            thiz.curr = "CASH";
            thiz.curr_mode = "CASH";
          }
        }
        if (evt.keyCode === 73 && evtobj.ctrlKey && !thiz.empty_cart()) {
          if (thiz.$store.getters.modeOff) {
            thiz.direct3();
          } else {
            thiz.show1 = false;
            thiz.show2 = false;
            thiz.show3 = true;
            thiz.show4 = false;
            thiz.curr = "CASH";
            thiz.curr_mode = "CASH";
          }
        }
        if (evt.keyCode === 77 && evtobj.ctrlKey && !thiz.empty_cart()) {
          if (thiz.$store.getters.modeOff) {
            thiz.direct1();
          } else {
            thiz.show1 = false;
            thiz.show2 = false;
            thiz.show3 = false;
            thiz.show4 = true;
            thiz.curr = "CASH";
            thiz.curr_mode = "CASH";
          }
        }
        BarcodeTrigger = false;
        thiz.shortCuts(evt, evtobj);
      };
      thiz.resetPopUp = "Reset done";
      setTimeout(() => {
        thiz.resetPopUp = false;
      }, 3000);
      document.addEventListener("keydown", thiz.timeStamp);
    },
    mixCheck() {
      return this.LastBarcode !== null && this.LastBarcode.includes("0064");
    },
    FixedAmount(item) {
      const amount = item.item_details.unit_price - item.item_details.discount;
      return amount.toFixed(2);
    },
    addItemCheck() {
      if (this.show_addItem === true && this.openInput === false) {
        return true;
      } else {
        return false;
      }
    },
    async searchUserByName() {
      if (!this.userName) {
        return;
      }
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/searchUserWithNameOrPhone?search_string=${this.userName}&shop_id=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        console.log(response.data);
        const arr = response.data;
        this.list = [...arr];
      } catch (error) {
        console.log(error);
        alert("Failed to update visit! Check logs for more info.");
      }
    },
    holdBill() {
      const today = new Date();
      const date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      const pastOrders = JSON.parse(localStorage.getItem(date));
      let listOfAllTheHoldedVisits = [];
      if (pastOrders) {
        listOfAllTheHoldedVisits = [...pastOrders];
      }
      listOfAllTheHoldedVisits.push(this.$store.getters.visitObj);
      localStorage.setItem(date, JSON.stringify(listOfAllTheHoldedVisits));
      this.updateVisit();
      this.$router.push("/home");
    },
    selectMode() {
      this.curr_mode = this.curr;
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
    shortCuts(evt, evtobj) {
      const thiz = this;
      let ItemSelected = false;
      if (evt.keyCode === 38 && thiz.searchResult) {
        // console.log('up')
        // console.log(document.documentElement.scrollTop)
        // console.log(document.body.clientHeight)
        // console.log(screen.height)
        if (document.documentElement.scrollTop === 0) {
          thiz.HeightFromTop = 0;
          window.scrollTo(0, 0);
        } else {
          window.scrollTo(0, thiz.HeightFromTop);
          thiz.HeightFromTop -= 150;
        }
        if (!thiz.searchHighLight.length) {
          thiz.searchHighLight.push(thiz.categoryItems[0].item_details.item_id);
        } else {
          thiz.categoryItems.forEach((key, i) => {
            if (
              thiz.searchHighLight[0] === key.item_details.item_id &&
              !ItemSelected
            ) {
              if (i !== 0) {
                thiz.searchHighLight = [];
                // window.scrollTo(0, -500)
                thiz.searchHighLight.push(
                  thiz.categoryItems[i - 1].item_details.item_id
                );
                ItemSelected = true;
              }
            }
          });
        }
      }
      if (evt.keyCode === 40 && thiz.searchResult) {
        // window.scrollTo({
        //   top: 100,
        //   behavior: 'smooth'
        // })
        // document.documentElement.scrollTop = document.body.scrollTop = 120
        console.log(document.documentElement.scrollTop);
        console.log(document.body.clientHeight);
        if (!thiz.searchHighLight.length) {
          thiz.searchHighLight.push(thiz.categoryItems[0].item_details.item_id);
        } else {
          thiz.categoryItems.forEach((key, i) => {
            if (
              thiz.searchHighLight[0] === key.item_details.item_id &&
              !ItemSelected
            ) {
              if (typeof thiz.categoryItems[i + 1] !== "undefined") {
                thiz.searchHighLight = [];
                window.scrollTo(0, thiz.HeightFromTop);
                thiz.HeightFromTop += 140;
                thiz.searchHighLight.push(
                  thiz.categoryItems[i + 1].item_details.item_id
                );
                ItemSelected = true;
              } else {
              }
            }
          });
        }
      }
      if (
        evt.keyCode === 38 &&
        (thiz.show1 || thiz.show2 || thiz.show3 || thiz.show4)
      ) {
        // code for upward changing options
        let idx = thiz.modes.findIndex((item) => item === thiz.curr);
        if (idx === 0) {
          idx = thiz.modes.length - 1;
        } else {
          idx--;
        }
        thiz.curr = thiz.modes[idx];
        thiz.curr_mode = thiz.modes[idx];
      }
      if (
        evt.keyCode === 40 &&
        (thiz.show1 || thiz.show2 || thiz.show3 || thiz.show4)
      ) {
        // code for downward changing options
        let idx = thiz.modes.findIndex((item) => item === thiz.curr);
        if (idx === thiz.modes.length - 1) {
          idx = 0;
        } else {
          idx++;
        }
        thiz.curr = thiz.modes[idx];
        thiz.curr_mode = thiz.modes[idx];
      }
      if (evt.keyCode === 13 && thiz.searchResult) {
        const index2 = thiz.categoryItems.findIndex(
          (item) => item.item_details.item_id === thiz.searchHighLight[0]
        );
        thiz.addItemm(thiz.categoryItems[index2]);
        window.scrollTo(0, 0);
        thiz.searchHighLight = [];
      }
      if (
        this.show3 &&
        !this.show4 &&
        !this.show1 &&
        !this.show2 &&
        evt.keyCode === 13
      ) {
        this.direct3();
      }
      if (
        this.show1 &&
        !this.show4 &&
        !this.show3 &&
        !this.show2 &&
        evt.keyCode === 13
      ) {
        this.direct();
      }
      if (
        this.show2 &&
        !this.show4 &&
        !this.show1 &&
        !this.show3 &&
        evt.keyCode === 13
      ) {
        this.direct2();
      }
      if (
        this.show4 &&
        !this.show2 &&
        !this.show1 &&
        !this.show3 &&
        evt.keyCode === 13
      ) {
        this.direct1();
      }
      // if (evt.keyCode === 13 && thiz.searchResult) {
      //   const index2 = thiz.categoryItems.findIndex(item => item.item_details.item_id === thiz.searchHighLight[0])
      //   thiz.addItemm(thiz.categoryItems[index2])
      //   thiz.searchHighLight = []
      // }
      if (evt.keyCode === 27 && thiz.open_number) {
        thiz.searchResult = false;
        thiz.search_input = "";
        thiz.show_addItem = false;
        // thiz.openInput = false
      }
      let index2 = 0;
      if (thiz.highLight.length) {
        thiz.cartItemsFromAPI.forEach((key, i) => {
          if (key.item_details.item_id === thiz.highLight[0]) {
            index2 = i;
          }
        });
      } else if (thiz.inputIndex.length) {
        thiz.cartItemsFromAPI.forEach((key, i) => {
          if (
            key.item_details.item_id ===
            thiz.cartItemsFromAPI[thiz.inputIndex[0]].item_details.item_id
          ) {
            index2 = i;
          }
        });
      } else {
        thiz.cartItemsFromAPI.forEach((key, i) => {
          if (thiz.inputDiscountIndex.length) {
            if (
              key.item_details.item_id ===
              thiz.cartItemsFromAPI[thiz.inputDiscountIndex[0]].item_details
                .item_id
            ) {
              index2 = i;
            }
          }
        });
      }
      if (evt.keyCode === 67 && evtobj.ctrlKey) {
        thiz.openChangePricePop(index2, thiz.cartItemsFromAPI[index2]);
        setTimeout(() => {
          const idz = "changePrice" + index2;
          document.getElementById(idz).focus();
        }, 500);
      }
      if (evt.keyCode === 46 && thiz.highLight.length) {
        thiz.removeItemFromCart(index2);
      }
      if (evtobj.altKey) {
        thiz.percentageDiscount = !thiz.percentageDiscount;
      }
      if (evt.keyCode === 89 && evtobj.ctrlKey) {
        const idz = "changeDiscount" + index2;
        thiz.openChangeSPricePop(index2, thiz.cartItemsFromAPI[index2]);
        setTimeout(() => {
          document.getElementById(idz).focus();
        }, 500);
      }
      if (evt.keyCode === 86 && evtobj.ctrlKey) {
        const idz = "changeDiscount" + index2;
        thiz.openChangeDiscountPop(
          index2,
          thiz.cartItemsFromAPI[index2].item_details.discount
        );
        setTimeout(() => {
          document.getElementById(idz).focus();
        }, 500);
      }
      if (evt.keyCode === 13 && thiz.search_input.length) {
        return;
      }
      if (evt.keyCode === 13 && thiz.inputIndex.length) {
        thiz.doneBtn(thiz.cartItemsFromAPI[index2].item_details);
      }
      if (evt.keyCode === 13 && thiz.inputDiscountIndex.length) {
        if (
          thiz.cartItemsFromAPI[index2].item_details.units === "GRAM" &&
          thiz.cartItemsFromAPI[index2].item_details.quantity === 1
        ) {
          thiz.sabjiDiscount(index2, thiz.cartItemsFromAPI[index2]);
        } else {
          thiz.changeDiscountPriceFn(
            index2,
            thiz.cartItemsFromAPI[index2].item_details,
            thiz.allCartItems[index2].final_chosen
          );
        }
      }
    },
    async CheckAdvanceNumber() {
      let response = null;
      const payload = {
        phone_number: this.$store.getters.phone_number,
      };
      console.log(localStorage.getItem("Credential"));
      try {
        response = await this.$axios({
          method: "POST",
          url: "checkIfCustomerExistsOrCreateNewCustomer",
          data: payload,
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
    async handleAdvanceRelationship(shopperId) {
      // eslint-disable-next-line camelcase
      const shopper_id = shopperId;
      // eslint-disable-next-line camelcase
      const shop_id = this.auth.shop_id;
      const relationship = await this.createOrRetrieveRelationship(
        shopper_id,
        shop_id
      );
      console.log(relationship);
      if (relationship !== undefined) {
        let response = null;
        const dataObj = {
          relationship_id: relationship.relationship_id,
          visit: {
            shopping_json: {},
            discarded: false,
          },
        };
        try {
          response = await this.$axios({
            method: "POST",
            url: "/createVisit",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Credential"),
            },
            data: dataObj,
          });
          // eslint-disable-next-line no-console
          console.log(response.data);
          const visit = response.data;
          this.$store.commit("SET_VISIT", visit.visit_id);
        } catch (error) {
          console.log(error);
          alert("Failed to create a visit! Check logs for more info.");
        }
      } else {
        alert("Failed to create a relationship! Check logs for more info.");
      }
    },
    async setShopperName() {
      if (
        this.userName.length > 0 &&
        this.ShopperName === "+91" + this.phone_num
      ) {
        await this.setName();
      }
    },
    rollout(item) {
      const itemType = item.quantity + " " + item.units;
      if (itemType === "1 GRAM") {
        return false;
      } else {
        return true;
      }
    },
    async setName() {
      let response = null;
      const num = encodeURIComponent("+91" + this.phone_num);
      try {
        response = await this.$axios({
          method: "POST",
          url: `/setConsumerNameForKhataUsers?phoneNumber=${num}&consumerName=${this.userName}`,
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
    highLightFreeItem(item) {
      let returnStatement = false;
      if (item.final_chosen.giftItem) {
        returnStatement = true;
      }
      return returnStatement;
    },
    async updateVisit() {
      if (this.allCartItems.length > 0) {
        const alphaJSON = this.allCartItems.map((item, idx) => {
          const itemJson = {};
          itemJson.customer_input_picurl = item.customer_input_picurl;
          itemJson.customer_input_barcode = null;
          itemJson.customer_input_text = null;
          itemJson.customer_input_speechurl = null;
          itemJson.ai_outputs_item_ids = [1, 2, 3];
          if (item.percent) {
            let dis = 0;
            if (this.cartItemsFromAPI[idx]) {
              dis =
                (this.cartItemsFromAPI[idx].dis / 100) *
                item.final_chosen.unit_price;
            }
            itemJson.final_chosen = {
              item_id: item.final_chosen.item_id,
              quantity: parseInt(item.final_chosen.quantity),
              final_price: 0,
              unit_price: parseFloat(item.final_chosen.unit_price),
              discount:
                item.final_chosen.discount === null ||
                item.final_chosen.discount === ""
                  ? 0
                  : dis >= 0
                  ? dis
                  : item.final_chosen.discount,
              discountReason: "",
            };
            if (
              this.cartItemsFromAPI[idx].item_details.units === "GRAM" &&
              this.cartItemsFromAPI[idx].item_details.quantity === 1 &&
              dis
            ) {
              itemJson.final_chosen.discount = dis;
            }
            if (item.final_chosen.giftItem) {
              itemJson.final_chosen.discount = 0;
            }
          } else {
            itemJson.final_chosen = {
              item_id: item.final_chosen.item_id,
              quantity: parseInt(item.final_chosen.quantity),
              final_price: 0,
              unit_price: parseFloat(item.final_chosen.unit_price),
              discount:
                item.final_chosen.discount === null ||
                item.final_chosen.discount === ""
                  ? 0
                  : this.cartItemsFromAPI[idx] && this.cartItemsFromAPI[idx].dis
                  ? parseFloat(this.cartItemsFromAPI[idx].dis)
                  : parseFloat(item.final_chosen.discount),
              discountReason: "",
            };
            if (
              this.cartItemsFromAPI[idx].item_details.units === "GRAM" &&
              this.cartItemsFromAPI[idx].item_details.quantity === 1 &&
              this.cartItemsFromAPI[idx] &&
              this.cartItemsFromAPI[idx].dis
            ) {
              itemJson.final_chosen.discount =
                this.cartItemsFromAPI[idx].dis / 1000;
            }
            if (item.final_chosen.giftItem) {
              itemJson.final_chosen.discount = 0;
            }
          }
          return itemJson;
        });
        const visit = this.$store.getters.visitObj;
        // const token = this.$store.getters.userData[0]
        const dataObj = {
          shopping_json: alphaJSON,
          shop_employee_driven_btc: true,
          discarded: false,
          // shop_employee_driven_btc_sca1: 1,
          advanced_order_type: "NA",
        };
        // document.getElementById('window').style.height = '100vh'
        let response = null;
        try {
          response = await this.$axios({
            method: "POST",
            url: `/updateVisit/${visit}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Credential"),
            },
            data: dataObj,
          });
          console.log(response.data);
          this.setShopperName();
          this.$store.commit("CLEAR_CART");
          this.userName = "";
          this.$store.commit("EnterToNumber", []);
          return response;
        } catch (error) {
          console.log(error);
          alert("Failed to update visit! Check logs for more info.");
        }
      }
    },
    doneBtn(item) {
      this.changePriceFn(item);
      this.inputIndex = [];
      if (item.units === "GRAM" && item.quantity === 1) {
        this.$store.commit("changeItemPrice", [
          item.item_id,
          this.changedPrice / 1000,
        ]);
      } else {
        this.$store.commit("changeItemPrice", [
          item.item_id,
          this.changedPrice,
        ]);
      }
    },
    switchDiscountType() {
      const thiz = this;
      if (thiz.discountType === "Rs") {
        thiz.percentageDiscount = false;
      } else {
        thiz.percentageDiscount = true;
      }
    },
    openChangeSPricePop(idx, item) {
      this.changeSp = true;
      this.inputDiscountIndex = [];
      this.inputIndex = [];
      if (this.inputIndex.length === 0) {
        this.inputDiscountIndex.push(idx);
        if (
          item.item_details &&
          item.item_details.units === "GRAM" &&
          item.item_details.quantity === 1
        ) {
          this.changedPrice =
            item.item_details.unit_price * 1000 -
            item.item_details.discount * 1000;
        } else if (item.item_details) {
          this.changedPrice =
            item.item_details.unit_price - item.item_details.discount;
        }
      } else {
      }
    },
    async sabjiDiscount(idx, item) {
      if (this.changeSp) {
        const temp = this.changedPrice;
        this.changedPrice = item.item_details.unit_price * 1000 - temp;
      }
      if (this.percentageDiscount) {
        const discount =
          this.changedPrice *
          this.allCartItems[idx].final_chosen.unit_price *
          10;
        this.$store.commit("changeDiscountPriceFnForSabjiItems", [
          item.item_details.item_id,
          discount,
        ]);
      } else {
        this.$store.commit("changeDiscountPriceFnForSabjiItems", [
          item.item_details.item_id,
          this.changedPrice,
        ]);
      }
      this.inputDiscountIndex = [];
      const payload = {
        name: item.item_details.name,
        brand: item.item_details.brand,
        quantity: item.item_details.quantity,
        units: item.item_details.units,
        unit_price: item.item_details.unit_price,
        unit_price_currency: item.item_details.unit_price_currency,
        selling_price: item.item_details.selling_price,
        discount: this.changedPrice / 1000,
        picurl: item.item_details.picurl,
        barcode: item.item_details.barcode,
        disabled: item.item_details.disabled,
        stock: item.item_details.stock,
        expiry_date: item.item_details.expiry_date,
        catalog_connection: item.item_details.catalog_connection,
      };
      const index = this.cartItemsFromAPI.findIndex(
        (item2) => item2.item_details.item_id === item.item_details.item_id
      );
      this.cartItemsFromAPI[index].item_details.discount =
        this.changedPrice / 1000;
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/editInventoryItem?itemID=${item.item_details.item_id}&employeeID=${this.$auth.user.employee.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
        });
        this.allCartItems[idx].final_chosen.discount = this.changedPrice / 1000;
        this.changedPrice = 0;
        this.changeSp = false;
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    DynamicDisount(idx, item) {
      if (this.percentageDiscount) {
        let percentage = 0;
        percentage =
          (100 * this.allCartItems[idx].final_chosen.discount) /
          this.allCartItems[idx].final_chosen.unit_price;
        return percentage.toFixed(2);
      } else {
        let final = parseFloat(this.allCartItems[idx].final_chosen.discount);
        if (
          item.item_details.units === "GRAM" &&
          item.item_details.quantity === 1
        ) {
          final =
            parseFloat(this.allCartItems[idx].final_chosen.discount) * 1000;
        } else {
          final = parseFloat(this.allCartItems[idx].final_chosen.discount);
        }
        return final.toFixed(2);
      }
    },
    openChangeDiscountPop(idx, item) {
      this.inputDiscountIndex = [];
      this.inputIndex = [];
      if (this.percentageDiscount) {
        const percentage =
          (100 * this.allCartItems[idx].final_chosen.discount) /
          this.allCartItems[idx].final_chosen.unit_price;
        this.inputDiscountIndex.push(idx);
        this.changedPrice = percentage.toFixed(2);
      } else if (this.inputDiscountIndex.length === 0) {
        this.inputDiscountIndex.push(idx);
        this.changedPrice = item;
      }
    },
    openChangePricePop(idx, item) {
      this.inputDiscountIndex = [];
      this.inputIndex = [];
      if (this.inputIndex.length === 0) {
        this.inputIndex.push(idx);
        if (
          item.item_details.units === "GRAM" &&
          item.item_details.quantity === 1
        ) {
          this.changedPrice = item.item_details.unit_price * 1000;
        } else {
          this.changedPrice = item.item_details.unit_price;
        }
      } else {
      }
    },
    async changeDiscountPriceFn(id, item, daam) {
      if (this.changeSp) {
        const temp = this.changedPrice;
        this.changedPrice = item.unit_price - temp;
      }
      this.cartItemsFromAPI[id].item_details.discount = this.changedPrice;
      this.inputDiscountIndex = [];
      if (!this.changedPrice) {
        this.changedPrice = 0;
      }
      this.$store.commit("changeItemDiscount", [
        item.item_id,
        this.changedPrice,
      ]);
      if (this.percentageDiscount) {
        const xyz = this.changedPrice;
        const discountInRs =
          (parseFloat(xyz) * parseFloat(daam.unit_price)) / 100;
        this.changedPrice = discountInRs;
      }
      const payload = {
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        units: item.units,
        unit_price: item.unit_price,
        unit_price_currency: item.unit_price_currency,
        selling_price: item.selling_price,
        discount: this.changedPrice,
        picurl: item.picurl,
        barcode: item.barcode,
        disabled: item.disabled,
        stock: parseInt(item.stock),
        expiry_date: item.expiry_date,
        catalog_connection: item.catalog_connection,
      };
      const index = this.cartItemsFromAPI.findIndex(
        (item2) => item2.item_details.item_id === item.item_id
      );
      this.cartItemsFromAPI[index].item_details.discount = this.changedPrice;
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/editInventoryItem?itemID=${item.item_id}&employeeID=${this.auth.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
        });
        // this.allCartItems[id].final_chosen.discount = this.changedPrice;
        this.$store.commit("edit_cart", [id, this.changedPrice]);
        this.changedPrice = 0;
        this.changeSp = false;
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async changePriceFn(item) {
      const payload = {
        name: item.name,
        brand: item.brand,
        quantity: item.quantity,
        units: item.units,
        unit_price:
          item.units === "GRAM" && item.quantity === 1
            ? this.changedPrice / 1000
            : this.changedPrice,
        unit_price_currency: item.unit_price_currency,
        selling_price: item.selling_price,
        discount: item.discount,
        picurl: item.picurl,
        barcode: item.barcode,
        disabled: item.disabled,
        stock: parseInt(item.stock),
        expiry_date: item.expiry_date,
        catalog_connection: item.catalog_connection,
      };
      const index = this.cartItemsFromAPI.findIndex(
        (item2) => item2.item_details.item_id === item.item_id
      );
      this.cartItemsFromAPI[index].item_details.unit_price =
        item.units === "GRAM" && item.quantity === 1
          ? this.changedPrice / 1000
          : this.changedPrice;
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/editInventoryItem?itemID=${item.item_id}&employeeID=${this.auth.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    selectItem(item) {
      this.middleLayer = false;
      const ItemToProcceed = {
        customer_input_picurl: "string",
        customer_input_barcode: "string",
        customer_input_text: "string",
        customer_input_speechurl: "string",
        ai_outputs_item_ids: [0],
        final_chosen: {
          giftItem: false,
          item_id: item.item_details.item_id,
          quantity: 1,
          unit_price: item.item_details.unit_price,
          final_price: item.item_details.unit_price,
          discount: item.item_details.discount,
          discountReason: "non",
        },
      };
      this.lastScannedItem = item.item_details.item_id;
      this.$store.commit("addToCartAlpha", ItemToProcceed);
    },
    async addNewInventoryItemFromScratch() {
      // let isEmpt = false
      // Object.values(this.edit_item).forEach((val) => {
      //   if (val === '') {
      //     isEmpt = true
      //   }
      // })
      // if (this.subcategory === '' || this.subsubcategory === '') {
      //   isEmpt = true
      // }
      // if (isEmpt) {
      //   return
      // }
      let qty;
      this.edit_item.quantity.length
        ? (qty = this.edit_item.quantity)
        : (qty = "1");
      const payload = {
        product_data: {
          name: this.edit_item.name,
          brand: this.edit_item.brand,
          quantity: this.perKg ? 1 : qty,
          units: this.perKg ? "GRAM" : this.edit_item.units,
          unit_price: this.perKg
            ? this.edit_item.unit_price / 1000
            : this.edit_item.unit_price,
          discount: this.perKg
            ? this.edit_item.discount / 1000
            : this.edit_item.discount,
          unit_price_currency: this.edit_item.unit_price_currency,
          picurl: "",
          barcode: this.edit_item.barcode,
          stock: parseInt(this.edit_item.stock)
            ? parseInt(this.edit_item.stock)
            : -1,
          expiry_date: null,
          disabled: false,
          selling_price: this.edit_item.selling_price,
          catalog_connection: this.edit_item.catalog_connection || null,
        },
        product_categorization: {
          subcategory: this.subcategory ? this.subcategory : "",
          subsubcategory: this.subsubcategory ? this.subsubcategory : "",
          essential_item: this.edit_item.essential_item,
        },
      };
      await this.addInventoryItem(payload);
    },
    back() {
      if (this.searchResult) {
        this.searchResult = false;
      } else if (this.openInput) {
        this.openInput = false;
      } else if (this.show_addItem) {
        this.show_addItem = false;
      } else if (this.open_number) {
        this.open_number = false;
        this.phone_num = "";
        this.list = [];
        this.cust = "";
        this.userName = "";
      } else {
        this.$store.commit("CLEAR_CART");
        this.$store.commit("EnterToNumber", []);
        this.$router.push("/home");
      }
    },
    async getCategoryHierarchy() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: "/getCategoryHierarchy",
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    changeCat(val) {
      const thiz = this;
      this.subcategory = null;
      this.subsubcategory = null;
      thiz.curr_cat = val;
      const cats = { ...thiz.CategoryHierarchy[thiz.currentCategory] };
      thiz.subCategoryList = Object.keys(cats);
    },
    changeSubSub() {
      const thiz = this;
      const cats =
        thiz.CategoryHierarchy[thiz.currentCategory][thiz.subcategory];
      thiz.subsubcatList = cats;
    },
    AddNewItem() {
      this.NoItemFoundInCatalog = false;
      this.show_addItem = true;
      this.categoryList = Object.keys(this.CategoryHierarchy);
      this.edit_item.barcode = this.LastBarcode;
    },
    async getInventory() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getShopInventory?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return undefined;
      }
    },
    hi(idx, item) {
      setTimeout(() => {
        this.hi1(idx);
        this.hi1(idx);
        this.hi2(idx, item);
      }, 100);
    },
    hi1(idx) {
      this.$store.commit("per", [idx, !this.allCartItems[idx].percent]);
    },
    hi2(idx, item) {
      this.$store.commit("changeItemCountWithInput", [
        this.allCartItems[idx].final_chosen.quantity,
        item.item_details.item_id,
        item ? item.dis : 0,
        this.allCartItems[idx].percent,
      ]);
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
    async barcodeGunitemCall() {
      if (this.dataset.catalog_list.length) {
        console.log(this.dataset.catalog_list);
        this.ItemFromCatalog = await this.getCatItemFromID([
          this.dataset.catalog_list[0].product_id,
        ]);
        this.curr_cat = this.ItemFromCatalog[0].category_number;
        this.addNewInventoryItem();
      } else {
        this.NoItemFoundInCatalog = true;
      }
    },
    async addNewInventoryItem() {
      const payload = {
        product_data: {
          name: this.ItemFromCatalog[0].name,
          brand: this.ItemFromCatalog[0].brand,
          quantity: this.ItemFromCatalog[0].quantity,
          units: this.ItemFromCatalog[0].units,
          unit_price: this.ItemFromCatalog[0].unit_price,
          unit_price_currency: this.ItemFromCatalog[0].unit_price_currency,
          discount: 0,
          picurl: this.ItemFromCatalog[0].picurl,
          barcode: this.ItemFromCatalog[0].barcode,
          stock: -1,
          category_number: this.ItemFromCatalog[0].category_number,
          expiry_date: null,
          disabled: false,
          selling_price: 0,
          catalog_connection: this.ItemFromCatalog[0].item_id || null,
        },
        product_categorization: {
          subcategory: this.ItemFromCatalog[1].subcategory,
          subsubcategory: this.ItemFromCatalog[1].subsubcategory,
          essential_item: this.ItemFromCatalog[1].essential_item,
        },
      };
      await this.addInventoryItem(payload, "catalog");
      setTimeout(() => {
        this.ItemFromCatalog = [
          {
            picurl: "",
          },
        ];
      }, 2000);
    },
    async addInventoryItem(invItem, type) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `addInventoryItemWithCategorizationForBarcodeBilling?shopID=${this.auth.shop_id}&employeeID=${this.auth.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: invItem,
          progress: false,
        });
        const ItemToProcceed = {
          customer_input_picurl: "string",
          customer_input_barcode: "string",
          customer_input_text: "string",
          customer_input_speechurl: "string",
          ai_outputs_item_ids: [0],
          final_chosen: {
            item_id: response.data ? response.data.item_id : null,
            quantity: 1,
            unit_price: response.data
              ? response.data.product_data.unit_price
              : null,
            final_price: response.data
              ? response.data.product_data.final_price
              : null,
            discount: response.data
              ? response.data.product_data.discount
              : null,
            discountReason: "non",
          },
        };
        if (type === "catalog" && response.data) {
          this.catalogItemIds.push(response.data.item_id);
        }
        let categoryNumber = 0;
        console.log(this.curr_cat);
        const inventory = await this.getInventory();
        if (inventory.length && inventory[0].inventory_json) {
          inventory[0].inventory_json.inventory_items.forEach((key) => {
            if (key.category === this.curr_cat) {
              categoryNumber = key.category_number;
              console.log(categoryNumber);
            }
          });
        }
        const data = {
          shopID: this.auth.shop_id,
          category_number:
            categoryNumber === 0 ? this.curr_cat : categoryNumber,
          inventory_item_id: response.data ? response.data.item_id : null,
        };
        await this.addInventoryItemToCategory(data);
        this.lastScannedItem = response.data ? response.data.item_id : null;
        this.$store.commit("addToCartAlpha", ItemToProcceed);
        this.show_addItem = false;
        this.edit_item = {
          name: "",
          brand: "",
          quantity: 0,
          units: "UNITS",
          unit_price: 0,
          unit_price_currency: "INR",
          discount: 0,
          picurl: "",
          barcode: "",
          essential: false,
          // ai_data_url: '',
          disabled: false,
          selling_price: 0,
        };
        this.currentCategory = "";
        this.subcategory = null;
        this.subsubcategory = null;
        this.validationTrigger = false;
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async getCatItemFromID(id) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getCatalogItemWithCategorization?itemID=${id}`,
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
    changePrice(idx) {
      this.allCartItems[idx].final_chosen.unit_price = this.changedPrice;
    },
    addItemm(item) {
      const thiz = this;
      const ItemToProcceed = {
        customer_input_picurl: "string",
        customer_input_barcode: "string",
        customer_input_text: "string",
        customer_input_speechurl: "string",
        ai_outputs_item_ids: [0],
        percent: false,
        final_chosen: {
          giftItem: false,
          item_id: item.item_details.item_id,
          quantity: 1,
          unit_price: item.item_details.unit_price,
          final_price: item.item_details.unit_price,
          discount: item.item_details.discount,
          discountReason: "non",
        },
      };
      if (thiz.activateFreeGift) {
        ItemToProcceed.final_chosen.giftItem = true;
        ItemToProcceed.final_chosen.discount = 0;
        ItemToProcceed.final_chosen.unit_price = 0;
        ItemToProcceed.final_chosen.final_price = 0;
        thiz.freeGift.push(ItemToProcceed);
      }
      // let confirmation = false
      // thiz.freeGift.forEach((key) => {
      //   if (key.final_chosen.item_id === ItemToProcceed.final_chosen.item_id) {
      //     confirmation = true
      //   }
      // })
      // if (confirmation) {
      //   thiz.$store.commit('addGiftedItemToCartAlpha', ItemToProcceed)
      // } else {
      //   if (thiz.activateFreeGift) {
      //     ItemToProcceed.final_chosen.discount = 0
      //     ItemToProcceed.final_chosen.unit_price = 0
      //     ItemToProcceed.final_chosen.final_price = 0
      //     thiz.freeGift.push(ItemToProcceed)
      //   }
      // }
      thiz.activateFreeGift = false;
      thiz.lastScannedItem = item.item_details.item_id;
      thiz.$store.commit("addToCartAlpha", ItemToProcceed);
      thiz.searchResult = false;
      thiz.search_input = "";
    },
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
    async localSearch() {
      if (this.search_input && this.search_input.length > 2) {
        let response = null;
        try {
          response = await this.$axios({
            method: "GET",
            url: `/vendorSideSearchInShop?shop_id=${this.auth.shop_id}&searchstr=${this.search_input}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Credential"),
            },
          });
          if (response && response.data && !response.data.length) {
            this.search_input = "";
          }
          return response.data;
        } catch (error) {
          console.log(error);
          return undefined;
        }
      }
    },
    async search_item() {
      const res = await this.localSearch();
      if (res && res.length) {
        const id = [];
        res.map((item) => {
          id.push(item.product_id);
        });
        const list = await this.getItemsFromID(id);
        this.categoryItems = [...list];
      } else {
        this.categoryItems = [];
        setTimeout((key) => {
          this.searchResult = false;
        }, 1300);
        this.search_input = "";
      }
      this.HeightFromTop = 0;
      document.getElementById("searchBox").blur();
      window.scrollTo(0, 0);
      this.searchResult = true;
    },
    // eslint-disable-next-line camelcase
    async createOrRetrieveRelationship(user_id, shop_id) {
      let response = null;
      const dataObj = {
        shop_id,
        shopper_id: user_id,
        relationship_data: {
          allow_self_checkout: false,
          allow_pay_later: false,
        },
      };
      try {
        response = await this.$axios({
          method: "POST",
          url: "/createOrRetrieveRelationship",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: dataObj,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async handleRelationship(shopperId) {
      // eslint-disable-next-line camelcase
      const shop_id = this.auth.shop_id;
      const relationship = await this.createOrRetrieveRelationship(
        shopperId,
        shop_id
      );
      if (relationship !== undefined) {
        let response = null;
        const dataObj = {
          relationship_id: relationship.relationship_id,
          visit: {
            shopping_json: {},
            discarded: false,
          },
        };
        try {
          response = await this.$axios({
            method: "POST",
            url: "/createVisit",
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Credential"),
            },
            data: dataObj,
          });
          // eslint-disable-next-line no-console
          console.log(response.data);
          const visit = response.data;
          this.$store.commit("SET_VISIT", visit.visit_id);
          this.open_number = true;
        } catch (error) {
          console.log(error);
          alert("Failed to create a visit! Check logs for more info.");
        }
      } else {
        alert("Failed to create a relationship! Check logs for more info.");
      }
    },
    stopProp(e) {
      e.stopPropagation();
    },
    popUp() {
      this.confirmBill = false;
      this.middleLayer = false;
      this.NoitemFound = false;
      this.PullOut = false;
      this.NoItemFoundInCatalog = false;
      this.show1 = false;
      this.show2 = false;
      this.show3 = false;
      this.show4 = false;
      this.show5 = false;
    },
    async getShopperInfo(id) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: "/getUserByID?userID=" + id,
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
    async CheckNumber() {
      let response = null;
      const payload = {
        phone_number: "+91" + this.phone_num,
      };
      try {
        response = await this.$axios({
          method: "POST",
          url: "checkIfCustomerExistsOrCreateNewCustomer",
          data: payload,
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
    async confirmNum2() {
      if (!this.cust) {
        return;
      }
      let num = this.cust.phone_number;
      num = num ? num.substring(3, num.length) : "";
      this.phone_num = num;
      if (this.phone_num.length === 10) {
        const shopperId = this.cust.id;
        const shopperInfo = await this.getShopperInfo(shopperId);
        this.ShopperName = shopperInfo ? shopperInfo.name : "";
        await this.handleRelationship(shopperId);
        this.$store.commit("EnterToNumber", [this.phone_num]);
      }
    },
    confirmNumber() {
      setTimeout(async () => {
        if (this.phone_num.length !== 10 || /[a-zA-Z]/.test(this.phone_num)) {
          alert("Please enter the valid mobile number");
          return;
        } else {
          const response = await this.CheckNumber();
          const shopperId = response.shopper_id;
          const shopperInfo = await this.getShopperInfo(shopperId);
          this.ShopperName = shopperInfo.name;
          await this.handleRelationship(shopperId);
          this.$store.commit("EnterToNumber", [this.phone_num]);
        }
      }, 100);
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
    async searchLooseProductOuter() {
      const res = await this.searchLooseBarcode();
      if (res.inventory_list.length) {
        const id = [];
        res.inventory_list.map((item) => {
          id.push(item.product_id);
        });
        const list = await this.getItemsFromID(id);
        this.categoryItems = [...list];
      } else {
        this.categoryItems = [];
        setTimeout((key) => {
          this.searchResult = false;
        }, 1300);
        this.search_input = "";
      }
      this.HeightFromTop = 0;
      document.getElementById("searchBox").blur();
      window.scrollTo(0, 0);
      this.searchResult = true;
    },
    async searchLooseBarcode(data) {
      let response = null;
      // const url = 'https://api.aistore.shop/' + 'searchLooseProducts?shop_id=6'
      try {
        response = await this.$axios({
          method: "GET",
          url: `/searchLooseProducts?shop_id=${this.auth.shop_id}`,
          // url,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    async searchBarcode(data) {
      let response = null;
      // const url = 'https://geo.aistore.shop/' + 'searchProductFromBarcode?shop_id=6&barcodestr=' + data
      try {
        response = await this.$axios({
          method: "GET",
          url: `/advancedSearchBarcode?shop_id=${this.auth.shop_id}&barcodestr=${data}`,
          // url,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
      }
    },
    itemSP(idx, item) {
      if (this.allCartItems[idx].final_chosen.discount === null) {
        this.allCartItems[idx].final_chosen.discount = 0;
      }
      let final;
      if (this.allCartItems[idx].percent) {
        const dis =
          ((item ? item.dis : 0) / 100) *
          this.allCartItems[idx].final_chosen.unit_price;
        if (
          item.item_details.units === "GRAM" &&
          item.item_details.quantity === 1
        ) {
          if (!isNaN(dis)) {
            final =
              (this.allCartItems[idx].final_chosen.unit_price - dis) * 1000;
          } else {
            final =
              (this.allCartItems[idx].final_chosen.unit_price -
                this.allCartItems[idx].final_chosen.discount) *
              1000;
          }
        } else if (!isNaN(dis)) {
          final = this.allCartItems[idx].final_chosen.unit_price - dis;
        } else {
          final =
            this.allCartItems[idx].final_chosen.unit_price -
            this.allCartItems[idx].final_chosen.discount;
        }
      } else if (!this.allCartItems[idx].percent) {
        if (
          item.item_details.units === "GRAM" &&
          item.item_details.quantity === 1
        ) {
          if (item && item.dis) {
            final =
              this.allCartItems[idx].final_chosen.unit_price * 1000 - item.dis;
          } else {
            final =
              this.allCartItems[idx].final_chosen.unit_price * 1000 -
              this.allCartItems[idx].final_chosen.discount * 1000;
          }
        } else if (item && item.dis) {
          final = this.allCartItems[idx].final_chosen.unit_price - item.dis;
        } else {
          final =
            this.allCartItems[idx].final_chosen.unit_price -
            this.allCartItems[idx].final_chosen.discount;
        }
      }
      return final.toFixed(2);
    },
    itemVariableSP(idx, item) {
      if (this.allCartItems[idx].final_chosen.discount === null) {
        this.allCartItems[idx].final_chosen.discount = 0;
      }
      let final = 0;
      if (this.allCartItems[idx].percent) {
        const dis =
          (item.dis / 100) * this.allCartItems[idx].final_chosen.unit_price;
        if (!isNaN(dis)) {
          if (
            item.item_details.units === "GRAM" &&
            item.item_details.quantity === 1
          ) {
            final =
              this.allCartItems[idx].final_chosen.unit_price *
                this.allCartItems[idx].final_chosen.quantity -
              dis * this.allCartItems[idx].final_chosen.quantity;
          } else {
            final =
              this.allCartItems[idx].final_chosen.unit_price *
                this.allCartItems[idx].final_chosen.quantity -
              dis * this.allCartItems[idx].final_chosen.quantity;
          }
        } else {
          final =
            this.allCartItems[idx].final_chosen.unit_price *
              this.allCartItems[idx].final_chosen.quantity -
            this.allCartItems[idx].final_chosen.discount *
              this.allCartItems[idx].final_chosen.quantity;
        }
      } else if (!this.allCartItems[idx].percent) {
        if (item && item.dis) {
          if (
            item.item_details.units === "GRAM" &&
            item.item_details.quantity === 1
          ) {
            final =
              this.allCartItems[idx].final_chosen.unit_price *
                this.allCartItems[idx].final_chosen.quantity -
              (item.dis * this.allCartItems[idx].final_chosen.quantity) / 1000;
          } else {
            final =
              this.allCartItems[idx].final_chosen.unit_price *
                this.allCartItems[idx].final_chosen.quantity -
              item.dis * this.allCartItems[idx].final_chosen.quantity;
          }
        } else {
          final =
            this.allCartItems[idx].final_chosen.unit_price *
              this.allCartItems[idx].final_chosen.quantity -
            this.allCartItems[idx].final_chosen.discount *
              this.allCartItems[idx].final_chosen.quantity;
        }
      }
      return final.toFixed(2);
    },
    itemMRP(idx, item) {
      let final;
      if (
        item.item_details.units === "GRAM" &&
        item.item_details.quantity === 1
      ) {
        final = this.allCartItems[idx].final_chosen.unit_price * 1000;
      } else {
        final = this.allCartItems[idx].final_chosen.unit_price;
      }
      return parseFloat(final).toFixed(2);
    },
    getItemID(items) {
      const itemIDs = [];
      if (items) {
        items.forEach((item) => {
          if (item.final_chosen.item_id) {
            itemIDs.push(item.final_chosen.item_id);
          }
        });
        return itemIDs;
      }
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
    empty_cart() {
      if (this.cartItemsFromAPI.length === 0) {
        return true;
      } else {
        return false;
      }
    },
    doSocketWork(payload) {
      let response = null;
      const socket = new WebSocket("ws://localhost:4040/ws");
      socket.onopen = function (e) {
        socket.send(JSON.stringify(payload));
      };
      socket.onmessage = function (event) {
        response = event.data;
        // eslint-disable-next-line no-console
        console.log(response);
      };
    },
    removeItemFromCart(id) {
      if (
        this.catalogItemIds.includes(
          this.cartItemsFromAPI[id].item_details.item_id
        )
      ) {
        this.removeItemFromInv(this.cartItemsFromAPI[id].item_details.item_id);
      }
      this.highLight = [];
      const item = this.cartItemsFromAPI[id];
      this.cartItemsFromAPI.splice(id, 1);
      this.$store.commit("removeItemFromCart", item);
      const index2 = this.cart.findIndex(
        (cartItem) => cartItem.final_chosen.item_id === item.item_id
      );
      this.cart.splice(index2, 1);
    },
    async removeItemFromInv(id) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/disableInventoryItem?item_id=${id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return undefined;
      }
    },
    async direct() {
      const res = await this.updateVisit();
      if (res.status === 200) {
        const res1 = await this.PaymentSuccess(
          res.data.visit_info[0].payment_id
        );
        if (res1.status === 200) {
          this.downloudableInvoice();
        }
      }
    },
    async direct2() {
      const res = await this.updateVisit();
      if (res.status === 200) {
        const res1 = await this.PaymentSuccess(
          res.data.visit_info[0].payment_id
        );
        if (res1.status === 200) {
          this.dwnldThinInvoice();
        }
      }
    },
    async direct3() {
      const res = await this.updateVisit();
      if (res.status === 200) {
        const res1 = await this.PaymentSuccess(
          res.data.visit_info[0].payment_id
        );
        if (res1.status === 200) {
          this.dwnldThinInvoiceOld();
        }
      }
    },
    async direct1() {
      const res = await this.updateVisit();
      if (res.status === 200) {
        const res1 = await this.PaymentSuccess(
          res.data.visit_info[0].payment_id
        );
        if (res1.status === 200) {
          this.dowloadpdf(this.$store.getters.visitObj);
        }
      }
    },
    async direct5() {
      const res = await this.updateVisit();
      if (res.status === 200) {
        const res1 = await this.PaymentSuccess(
          res.data.visit_info[0].payment_id
        );
        if (res1.status === 200) {
          this.dowloadA4Pdf(this.$store.getters.visitObj);
        }
      }
    },
    async downloudableInvoice() {
      let response = null;
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getEstimatePDFFor/${this.$store.getters.visitObj}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        shell.openExternal(this.imageSource(response.data.pdf_link));
        this.$router.push("/home");
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async dwnldThinInvoice() {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getThinEstimatePDFFor/${this.$store.getters.visitObj}?shopID=${this.auth.shop_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data,
          progress: false,
        });
        shell.openExternal(this.imageSource(response.data.pdf_link));
        this.$router.push("/home");
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async dwnldThinInvoiceOld() {
      const data = {
        rounded_off: this.$store.getters.roundOff,
        show_invoice_number: !this.$store.getters.estimate,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getThinEstimateTXTFor/${this.$store.getters.visitObj}?shopID=${this.auth.shop_id}`,
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
        this.$router.push("/home");
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
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
          data,
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
          data,
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
    async dowloadpdf(visit) {
      this.comp1 = false;
      const res = await this.getPdf(visit);
      if (res.pdf_link) {
        this.pdf = this.imageSource(res.pdf_link);
        shell.openExternal(this.imageSource(res.pdf_link));
        this.$router.push("/home");
      } else if (res.reason && res.reason.includes("CGST")) {
        this.vst = visit;
        this.openInput = true;
        this.show4 = false;
        this.items = [...res.items];
        const res1 = await this.getItemsFromID(this.items);
        this.invoiceItems1 = [...res1];
        this.show4 = false;
      } else {
        alert("Fill the shop GST Details in GRN App");
      }
    },
    async dowloadA4Pdf(visit) {
      this.comp1 = false;
      const res = await this.getA4Pdf(visit);
      this.a4 = false;
      if (res.pdf_link) {
        this.pdf = this.imageSource(res.pdf_link);
        shell.openExternal(this.imageSource(res.pdf_link));
        this.$router.push("/home");
      } else if (res.reason && res.reason.includes("CGST")) {
        this.vst = visit;
        this.openInput = true;
        this.items = [...res.items];
        const res1 = await this.getItemsFromID(this.items);
        this.invoiceItems1 = [...res1];
        this.a4 = true;
        this.show5 = false;
      } else {
        alert("Fill the shop GST Details in GRN App");
      }
    },
    async PaymentSuccess(paymentID) {
      const ts = new Date().getTime().toString();
      const payload = {
        payment_id: paymentID,
        visit_id: this.$store.getters.visitObj,
        timestamp: ts,
        success: true,
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
        this.curr = "CASH";
        this.curr_mode = "CASH";
        return response;
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
  },
};
</script>
<style scoped>
#hi {
  box-shadow: inset 2px 2px 2px 0 #c6c6d2, inset -3px -3px 3px 0 #fff !important;
}

.select_box {
  height: 32px;
  width: 100%;
  border: 0;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: 2px 2px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.btn1 {
  height: 32px;
  width: 30vw;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset -1px -1px 1px 0 rgba(198, 198, 210, 0.8),
    inset 1px 2px 1px 0 #fff, 4px 4px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.btn2 {
  height: 32px;
  width: 130px;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset -1px -1px 1px 0 rgba(198, 198, 210, 0.8),
    inset 1px 2px 1px 0 #fff, 4px 4px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.select_box1 {
  height: 26px;
  width: 40px;
  border: 0;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
}
.deleteBtn {
  padding: 5px;
  box-shadow: inset 1px 2px 1px 0 #fff,
    inset -1px -1px 1px 0 rgb(198 198 210 / 80%), -6px -6px 8px 0 #fff,
    6px 6px 8px 0 #c6c6d2;
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
.inputs:focus {
  outline: none;
}
.btnn {
  height: 40px;
  border-radius: 104px;
  box-shadow: 20px 20px 60px #b7b6b6, -20px -20px 60px #ffffff;
  background-color: #f0f0f3;
  cursor: pointer;
}
.highLight {
  background-color: #99f36f;
  box-sizing: border-box;
  border-radius: 16px;
  border: 1px solid #99f36f;
  box-shadow: 6px 6px 10px 0 #c6c6d2, -6px -6px 8px 0 #fff;
}
body {
  background-color: #f0f0f3;
}

.hover_inside:hover {
  animation-name: btn;
  animation-duration: 0.5s;
}
.CatalogHighLight {
  background-color: #b2c2e9 !important;
  border-radius: 16px;
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
@media screen and (min-width: 480px) {
  .imggg {
    width: 5.5vw;
  }
  /* .big_box {
    width: 20vw;
  } */
  /* .sideBit {
    margin-left: 10rem;
  } */
}
.inputs2 {
  border-radius: 8px;
  border: 0;
  height: 30px;
  width: 87%;
  background-color: #e8e8ed;
}
.border {
  box-sizing: border-box;
  height: 1px;
  width: 626px;
  border: 1px solid #808080;
}
.GiftItem {
  background-color: #fd00a338 !important;
  border-radius: 16px;
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
  box-shadow: inset 1px 1px 2px 0 #c6c6d2, inset -2px -2px 2px 0 #fff;
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
.cmp {
  height: 40px;
  width: 100px;
  border-radius: 18px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(174, 174, 192, 0.8),
    inset 2px 2px 2px 0 #fff, 2px 2px 4px 0 #c6c6d2, -2px -2px 4px 0 #fff;
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
}
.colorBox {
  background-color: #f0f0f3;
  box-shadow: 4px 4px 6px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.inventory_box2 {
  width: 20vw;
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
.PopUpFooter {
  position: fixed;
  color: #d0d0d4;
  bottom: 10vh;
  height: 6vh;
  width: 100vw;
  left: 0;
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

.Chotadone_btn {
  height: 20px;
  width: 48px;
  border-radius: 18px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(174, 174, 192, 0.8),
    inset 2px 2px 2px 0 #fff, 2px 2px 4px 0 #c6c6d2, -2px -2px 4px 0 #fff;
}
.done_btn {
  height: 20px;
  width: 88px;
  border-radius: 18px;
  background-color: #f0f0f3;
  box-shadow: inset 1px 2px 1px 0 #fff,
    inset -1px -1px 1px 0 rgb(198 198 210 / 80%), -6px -6px 8px 0 #fff,
    6px 6px 8px 0 #c6c6d2;
}
.giftBg {
  background: linear-gradient(180deg, #23f823 0%, #a8f3a8 100%);
}
.noGiftBg {
  background: linear-gradient(180deg, #b5dcf6 0%, #b3daf5 100%);
}
.footer_btn {
  height: 40px;
  width: 125px;
  border-radius: 18px;
  background-color: #f0f0f3;
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
  box-shadow: 20px 20px 60px #bebebe, -20px -20px 60px #ffffff;
}
.mbT {
  margin-bottom: 25rem !important;
}

@media (min-width: 1000px) {
  .footer_btn {
    width: 140px;
  }
  .cmp {
    width: 140px;
  }
}
</style>
