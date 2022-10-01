<template>
  <div class="full" style="background-color: #f0f0f3; min-height: 100vh">
    <div class="scroll">
      <div
        v-if="!open_cam || show_addItem"
        id="header"
        style="z-index: 2; position: fixed; width: 100vw; top: 0"
      >
        <div
          v-if="!cameraPridiction"
          class="pt-4 pb-3"
          style="
            background: linear-gradient(180deg, #b5dcf6 0%, #d2e9f9 100%);
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
                src="../static/Backward_arrow.webp"
                height="30"
                width="30"
              />
            </div>
          </div>
          <div class="d-flex justify-content-end align-items-center">
            <div style="width: 100vw" class="d-flex justify-content-center">
              <p
                v-if="!open_category && !show_addItem"
                class="text_four mb font-weight-bold"
              >
                Inventory
              </p>
              <p v-if="localSearchMode" class="text_four mb font-weight-bold">
                Result
              </p>
              <p
                v-if="open_category && !show_addItem && !localSearchMode"
                class="text_four mb font-weight-bold"
              >
                {{ currentCategory.category }}
              </p>
              <p
                v-if="show_addItem && !localSearchMode"
                class="text_four mb font-weight-bold"
              >
                Add items
              </p>
            </div>
            <div class="d-flex justify-content-end mr-4">
              <!-- <img
                v-if="!open_category && !open_cam && !liveOrder"
                alt="pic"
                style="width: 50%;"
                src="../static/bell.png"
                @click="fetchLowStockItems(); stocks = true;tab = 1"
              /> -->
              <img
                v-if="!open_cam"
                alt="pic"
                class="ml-4"
                style="width: 50%"
                src="../static/menu.png"
                @click="SearchModal = true"
              />
            </div>
          </div>
        </div>
      </div>
      <div v-if="showSearchBar" class="d-flex justify-content-center mt-6">
        <div class="search box d-flex align-items-center mt-4 mb-3">
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
        </div>
      </div>
      <div
        id="modal-sm"
        v-if="SearchModal"
        class="modal d-flex justify-content-center flex-wrap"
        style="border-radius: 10px; syntax: 80vw"
        @click="popUp($event)"
      >
        <div
          class="modal-content d-flex justify-content-center align-items-center flex-column"
        >
          <div
            class="mt-3 d-flex hover_inside justify-content-start mb-4 align-items-center button"
            @click="textSearch()"
          >
            <img
              alt="pic"
              class="ml-3"
              src="../static/icons/vender/Search Icon.webp"
            />
            <p class="blue_text text_three pt-2 pl-3 pb-2 mb">
              Search for an item
            </p>
          </div>
          <div
            class="d-flex hover_inside justify-content-start mb-4 align-items-center button"
            @click="
              searchViaAi();
              SearchModal = false;
            "
          >
            <img
              alt="pic"
              class="ml-3"
              src="../static/Camera.webp"
              height="25"
              width="25"
            />
            <p class="text_red text_three pt-2 pl-3 pb-2 mb">
              Search with item photo
            </p>
          </div>
          <div
            class="d-flex hover_inside justify-content-start mb-4 align-items-center button"
            @click="
              SearchWithBar();
              SearchModal = false;
            "
          >
            <img
              alt="pic"
              class="ml-3"
              src="../static/file_icon.webp"
              height="20"
              width="20"
            />
            <p class="blue_text text_three pt-2 pl-3 pb-2 mb">
              Search with barcode
            </p>
          </div>
        </div>
      </div>
      <div
        id="modal-center"
        v-if="StockModel"
        class="modal d-flex justify-content-center"
        @click="popUp($event)"
        style="border-radius: 10px; syntax: 80vw"
      >
        <div
          class="modal-content d-flex justify-content-start flex-wrap"
          style="height: auto; width: 50vw"
        >
          <div style="width: 100%" class="pl-4">
            <p class="text_grey-3 mb text_three mt-2">Update Stock</p>
          </div>
          <div class="inps pl-4">
            <label for="input" class="text_grey-1 mb font_small text_two"
              >enter new stock value</label
            >
            <input v-model="NewStock" type="text" class="pl-2 inputs focus" />
          </div>
          <div style="width: 100%" class="d-flex justify-content-around">
            <div
              style="z-index: 1"
              class="btnn bns mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="StockModel = false"
            >
              <p class="text_two mb text_dark font-weight-bold">Discard</p>
            </div>
            <div
              style="z-index: 1"
              class="btnn bns mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="updateStock()"
            >
              <p class="text_two mb blue_text font-weight-bold">Update</p>
            </div>
          </div>
        </div>
      </div>
      <div
        id="modal-center"
        v-if="removeItemPopUp"
        class="modal d-flex justify-content-center"
        @click="popUp($event)"
        style="border-radius: 10px; syntax: 80vw"
      >
        <div
          class="modal-content d-flex justify-content-start flex-wrap"
          style="height: auto; width: 30vw"
        >
          <div style="width: 100%" class="pl-4">
            <p class="text_grey-3 mb text_three mt-2">
              Are you sure you want to delete this item ?
            </p>
          </div>
          <div style="width: 100%" class="d-flex justify-content-around">
            <div
              style="z-index: 1; width: 28vw"
              class="btnn bns mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="removeItemPopUp = false"
            >
              <p class="text_two mb text_dark font-weight-bold">Cancel</p>
            </div>
            <div
              style="z-index: 1; width: 28vw"
              class="btnn bns mt-3 mb-3 d-flex justify-content-center align-items-center"
              @click="removeItemFromInv()"
            >
              <p class="text_two mb blue_text font-weight-bold">Delete</p>
            </div>
          </div>
        </div>
      </div>
      <div
        id="swipeetop"
        class="mar"
        style="transition-timing-function: ease-in-out"
      >
        <div v-if="stocks" class="d-flex justify-content-center flex-wrap mt-6">
          <div class="d-flex justify-content-center" style="z-index: 3">
            <div class="deep d-flex justify-content-around align-items-center">
              <div
                class="mx-auto d-flex justify-content-between align-items-center pl-1 pr-1 wid1"
                style="width: 90vw"
              >
                <div
                  class="d-flex justify-content-center align-items-center"
                  :class="tab === 1 ? 'inside_box' : 'outside_box'"
                  @click="tab = 1"
                >
                  <p
                    style="font-size: 10px"
                    class="text_three font-weight-bold mb"
                  >
                    SKU
                  </p>
                </div>
                <div
                  class="d-flex justify-content-center align-items-center"
                  :class="tab === 2 ? 'inside_box' : 'outside_box'"
                  @click="
                    tab = 2;
                    getExpiryItems();
                  "
                >
                  <p
                    style="font-size: 10px"
                    class="text_three font-weight-bold mb"
                  >
                    EXPIRY
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div v-if="tab === 1">
            <div
              v-for="(item, id) in lowStockItems"
              :key="id"
              style="width: 80vw"
              class="d-flex flex-row stock_card mt-3 pt-2 pb-2 wid1"
            >
              <div style="width: 80%" class="ml-2">
                <p class="mb text_grey-1 text_one">
                  {{ item.brand }}
                </p>
                <p class="mb text_grey-4 text_two">
                  {{ item.name }}
                </p>
                <p v-if="item.stock > 0" class="mb text_grey-4 text_two">
                  STOCK: {{ item.stock }} PIECES
                </p>
              </div>
              <div
                class="d-flex justify-content-center align-items-center"
                style="width: 20%"
              >
                <div
                  class="addStock"
                  @click="
                    StockModel = true;
                    StockId = id;
                  "
                >
                  <img
                    alt="pic"
                    src="../static/addStock.webp"
                    height="35"
                    width="35"
                  />
                </div>
              </div>
            </div>
          </div>
          <div v-if="tab === 2">
            <div
              v-for="(ExpiringItem, i) in ExpiringItems"
              :key="i"
              class="stock_card d-flex justify-content-between align-items-center p-2 wid1 mt-2"
              style="width: 85vw"
              @click="
                ExpiryPopUp = true;
                ExpiryItemDetails = ExpiringItem;
              "
            >
              <div style="width: 80%" class="ml-2">
                <p class="mb text_grey-1 text_one">
                  {{ ExpiringItem.brand }}
                </p>
                <p class="mb mt-1 text_grey-4 text_two">
                  {{ ExpiringItem.name }}
                </p>
                <p
                  class="m-0 mt-1"
                  style="
                    color: #4f4f4f;
                    font-size: 12px;
                    font-weight: 700;
                    line-height: 12px;
                  "
                >
                  Expiry: {{ expiryDate(ExpiringItem.expiry_date) }}
                </p>
              </div>
              <div
                class="d-flex justify-content-center align-items-center"
                style="
                  flex-direction: column;
                  height: 60px;
                  width: 60px;
                  border-radius: 4px;
                  border: 1px solid #cc3a00;
                  color: #cc3a00;
                  font-size: 20px;
                  font-weight: 700;
                  line-height: 20px;
                  text-align: center;
                "
              >
                <!-- 3 <br> <span style="font-size: 10px; font-weight: 700; line-height: 12px; text-align: center;">Months</span> -->
                <div
                  v-if="expiryTime(ExpiringItem.expiry_date) >= 0"
                  class="mb-1"
                >
                  {{ expiryTime(ExpiringItem.expiry_date) }}
                </div>
                <div
                  style="
                    font-size: 10px;
                    font-weight: 700;
                    line-height: 12px;
                    text-align: center;
                  "
                >
                  {{ expirylog(ExpiringItem.expiry_date) }}
                </div>
              </div>
            </div>
          </div>
          <div
            style="height: 10vh; width: 100vw; background-color: #f0f0f3"
            class="mt-3"
          />
          <div
            id="modal-sm"
            v-if="ExpiryPopUp"
            class="modal"
            @click="popUp($event)"
            style="border-radius: 10px; syntax: 80vw"
          >
            <div class="modal-content">
              <div class="text12">Update Expiry Date</div>
              <div
                class="mt-2 d-flex justify-content-between align-items-center"
              >
                <div style="width: 15%">
                  <div
                    class="mb-2"
                    style="color: #8d8da5; font-size: 12px; line-height: 12px"
                  >
                    Date
                  </div>
                  <input
                    v-model="expiry.date"
                    type="number"
                    class="pl-2 inputs focus"
                  />
                </div>
                <div style="width: 40%">
                  <div
                    class="mb-2"
                    style="color: #8d8da5; font-size: 12px; line-height: 12px"
                  >
                    Month
                  </div>
                  <select
                    id="exampleFormControlSelect1"
                    v-model="expiry.month"
                    class="select_box1 text_grey-3 focus"
                  >
                    <option
                      v-for="(m, i) in mahina"
                      :key="i"
                      class="options text_grey"
                    >
                      {{ m }}
                    </option>
                  </select>
                </div>
                <div style="width: 30%">
                  <div
                    class="mb-2"
                    style="color: #8d8da5; font-size: 12px; line-height: 12px"
                  >
                    Year
                  </div>
                  <select
                    id="exampleFormControlSelect1"
                    v-model="expiry.year"
                    class="select_box1 text_grey-3 focus"
                  >
                    <option
                      v-for="(y, i) in saal"
                      :key="i"
                      class="options text_grey"
                    >
                      {{ y }}
                    </option>
                  </select>
                </div>
              </div>
              <div
                style="width: 100%"
                class="mt-2 d-flex justify-content-around"
              >
                <div
                  style="z-index: 1; width: 40%"
                  class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="ExpiryPopUp = false"
                >
                  <p class="text_two mb text_dark font-weight-bold">Discard</p>
                </div>
                <div
                  style="z-index: 1; width: 40%"
                  class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="UpdateExpiryDate()"
                >
                  <p class="text_two mb blue_text font-weight-bold">Update</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div v-if="!open_cam && !stocks">
          <div
            v-if="!showSearchBar && !localSearchMode"
            class="d-flex justify-content-center"
          >
            <div
              v-if="!open_category && !cameraPridiction && !scanned_result"
              style="width: 90vw"
              class="d-flex flex-wrap mt-6 pb-4 justify-content-around wid"
            >
              <div
                v-for="(category, i) in categoryList"
                :key="i"
                class="hover_inside inventory_item mt-4 mar"
                @click="loadInventoryItems(category, i)"
              >
                <div
                  style="height: 60%; margin-top: 0.5rem"
                  class="d-flex justify-content-center"
                >
                  <img
                    v-if="
                      (live && $store.getters.toggle) || category.picurl === ''
                    "
                    alt="pic"
                    height="75"
                    width="80"
                    src="../static/OogashopBusiness.png"
                  />
                  <img
                    v-else
                    alt="pic"
                    height="75"
                    width="80"
                    :src="imageSource(category.picurl)"
                  />
                </div>
                <div class="pt-2 pl-1 text-center text_two">
                  <p>{{ category.category }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="d-flex justify-content-center" style="width: 100vw">
            <div
              v-if="spinner"
              class="d-flex justify-content-center align-items-center"
              style="height: 80vh; z-index: 2; position: absolute"
            >
              <div
                class="spinner-border"
                style="width: 3rem; height: 3rem"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
          <div v-if="open_category && !spinner" class="mb-8">
            <div
              v-if="catalogActivated"
              class="d-flex justify-content-center mt-6"
            >
              <div
                v-if="!BarGunFromCatalog"
                style="z-index: 1; width: 62vw"
                class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                @click="activateMultpleMode = !activateMultpleMode"
              >
                <p
                  v-if="activateMultpleMode"
                  class="text_two mb blue_text font-weight-bold"
                >
                  Stop adding multiple Items
                </p>
                <p v-else class="text_two mb blue_text font-weight-bold">
                  Add multiple Items
                </p>
              </div>
            </div>
            <div v-if="catalogActivated">
              <div
                v-if="BarGunFromCatalog"
                class="d-flex justify-content-center align-items-center"
              >
                <p>Please scan barcode</p>
              </div>
              <div
                v-for="(item, i) in catalogItems"
                :key="i"
                class="d-flex justify-content-center flex-wrap"
              >
                <div
                  class="hover_inside inventory_box d-flex align-items-center mt-3 pt-2"
                  @click="editItem(item)"
                >
                  <div>
                    <img
                      v-if="
                        (live && $store.getters.toggle) ||
                        item.item_details.picurl === ''
                      "
                      alt="pic"
                      class="float-left ml-3"
                      style="border-radius: 10px"
                      src="../static/OogashopBusiness.png"
                      height="85"
                      width="60"
                    />
                    <img
                      v-else
                      alt="pic"
                      class="float-left ml-3"
                      style="border-radius: 10px"
                      :src="imageSource1(item.item_details.picurl)"
                      height="85"
                      width="60"
                    />
                  </div>
                  <div class="flex-grow-1 pl-3">
                    <div class="d-flex flex-row">
                      <div style="width: 45vw" class="txt1">
                        <p class="text-left gray mb text_one">
                          {{ item.item_details.brand }}
                        </p>
                        <p class="text-left mb text_two">
                          {{ item.item_details.name }}
                        </p>
                        <p
                          v-if="item.item_details.stock > 0"
                          class="mb text_grey-4 text_two"
                        >
                          STOCK: {{ item.item_details.stock }} PIECES
                        </p>
                      </div>
                      <div v-if="catalogActivated && activateMultpleMode">
                        <div
                          class="switch2 d-flex justify-content-center align-items-center"
                        >
                          <div
                            v-if="multipleItems.includes(item)"
                            class="circ2"
                          />
                          <div v-else class="circ1" />
                        </div>
                      </div>
                    </div>
                    <div
                      class="mt-4 d-flex justify-content-between txt1"
                      style="width: 45vw"
                    >
                      <p class="text_grey-3 text_two mb">
                        {{ item.item_details.quantity }}
                        {{ item_unit(item.item_details.units) }}
                      </p>
                      <p
                        v-if="catalogActivated"
                        class="mb text_grey-3 font-weight-bold text_two"
                      >
                        Rs {{ item.item_details.unit_price }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="!catalogActivated && !showSearchBar" class="mt-6">
              <div
                v-if="categoryItems.length === 0"
                class="d-flex align-items-center justify-content-center"
                style="width: 100%; height: 60vh"
              >
                <p>No item found</p>
              </div>
              <div
                v-for="(item, i) in categoryItems"
                :key="i"
                class="d-flex justify-content-center flex-wrap wid1"
              >
                <div
                  class="hover_inside inventory_box d-flex align-items-center mt-3 pt-2"
                  @click="editItem(item)"
                >
                  <div
                    class="pt-2 d-flex align-items-center"
                    style="width: 70vw; height: 120px"
                  >
                    <div
                      style="position: relative; width: 17.5vw"
                      class="ml-2 img1"
                    >
                      <!-- <div v-if="item.item_oogadiscount.length>0 && item.item_oogadiscount[0].ooga_discount!==0 && !item.item_oogadiscount[0].inactive && validLocation" class="d-flex align-items-center justify-content-center p-1" style="z-index:3; width: 100%; border-radius: 4px; background-color: #F6251B;position:absolute;top:0;">
                        <p class="m-0" style="font-size: 10px; font-weight: 700; line-height: 12px; text-align: center;color:#fff;font-weight:bold">
                          Rs {{ item.item_oogadiscount[0].ooga_discount }} OFF
                        </p>
                      </div> -->
                      <img
                        v-if="
                          (live && $store.getters.toggle) ||
                          item.item_details.picurl === ''
                        "
                        alt="pic"
                        class="float-left img2"
                        style="border-radius: 10px; width: 17.5vw"
                        src="../static/OogashopBusiness.png"
                        height="85"
                      />
                      <img
                        v-else
                        alt="pic"
                        class="float-left img2"
                        style="border-radius: 10px; width: 17.5vw"
                        :src="imageSource1(item.item_details.picurl)"
                        height="85"
                      />
                    </div>
                    <div class="ml-3 mt-1 wid9">
                      <div class="d-flex justify-content-between">
                        <div>
                          <p class="text-left gray mb text_one">
                            {{ item.item_details.brand }}
                          </p>
                          <p class="text-left mb text_two" style="width: 45vw">
                            {{ item.item_details.name }}
                          </p>
                          <p
                            v-if="item.item_details.stock > 0"
                            class="mb text_grey-4 text_two"
                          >
                            STOCK: {{ item.item_details.stock }} PIECES
                          </p>
                        </div>
                        <img
                          v-if="!liveOrder"
                          alt="pic"
                          src="../static/delete icon.webp"
                          class="mr-4"
                          style="margin-top: -5px; height: 50%"
                          @click="deleteItem(item.item_details, $event)"
                        />
                      </div>
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
                        <div style="width: 27.5vw" class="txt1">
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
                        <div
                          v-if="added(item.item_details) && inventoryForCart"
                          class="addBtn ml-4 mr-3 d-flex align-items-center justify-content-center lightMode btnShadow"
                          @click="addRemove(item)"
                        >
                          <p class="m-0">ADD</p>
                        </div>
                        <div
                          v-if="!added(item.item_details)"
                          class="d-flex justify-content-between add_more mr-3 ml-4 float-right"
                        >
                          <div
                            class="d-flex align-items-center justify-content-center lightMode btnShadow"
                            style="border-radius: 100%"
                          >
                            <img
                              v-if="
                                currentQuantity(item.item_details.item_id) === 1
                              "
                              alt="pic"
                              :class="
                                currentQuantity(item.item_id) < 2
                                  ? 'disable'
                                  : ''
                              "
                              src="../static/minus1.png"
                              style="width: 60%"
                              @click="$store.commit('removeItemFromCart', item)"
                            />
                            <img
                              v-if="
                                currentQuantity(item.item_details.item_id) > 1
                              "
                              alt="pic"
                              src="../static/minus1.png"
                              style="width: 60%"
                              @click="
                                $store.commit('changeItemCount', [
                                  'minus',
                                  item.item_details.item_id,
                                ])
                              "
                            />
                          </div>
                          <p
                            class="text-center text_three mb font-weight-bold m-0 mt-1"
                          >
                            {{ currentQuantity(item.item_details.item_id) }}
                          </p>
                          <div
                            class="d-flex align-items-center justify-content-center lightMode btnShadow"
                            style="border-radius: 100%"
                          >
                            <img
                              alt="pic"
                              src="../static/plus1.png"
                              style="width: 60%"
                              @click="
                                $store.commit('changeItemCount', [
                                  'plus',
                                  item.item_details.item_id,
                                ])
                              "
                            />
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
          v-if="cameraPridiction"
          style="overflow-y: hidden; height: 100vh; width: 100vw"
        >
          <canvas
            v-if="!ai_processing"
            id="Aicamera--sensor"
            style="z-index: -1; height: fit-content"
          />
          <video
            id="Aicamera--view"
            :class="{ low_opcty: ai_processing }"
            autoPlay="{true}"
            style="
              z-index: 0;
              position: absolute;
              width: 104vw;
              height: 100vh;
              border: 0px;
            "
            playsinline
          />
          <div
            v-if="!ai_processing"
            style="height: 85vh; width: 100vw; margin-top: 40px"
          >
            <img
              alt="pic"
              src="../static/icons/Close Button (4).webp"
              style="position: fixed; top: 5vh; margin-left: 40px"
              @click="
                cameraPridiction = false;
                localSearchMode = false;
                stopCameraTracks();
                open_category = false;
              "
            />
            <img
              alt="pic"
              src="../static/icons/Help Button (1).webp"
              style="margin-left: 75vw; position: fixed; top: 5vh"
              class="pt-1"
            />
          </div>
          <div
            v-if="!ai_processing"
            class="d-flex justify-content-center"
            style="position: fixed; bottom: 35vh; width: 100vw"
          >
            <img alt="pic" src="../static/Can Grid.webp" />
          </div>
          <div v-if="!ai_processing" class="d-flex justify-content-center">
            <div class="scan_css_box" style="z-index: 2" @click="getPhoto()">
              <img
                alt="pic"
                src="../static/Camera.webp"
                height="25"
                width="25"
              />
            </div>
          </div>
          <div
            v-if="ai_processing"
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
          <!-- <aiCamera v-if="ai_processing" :first-render="false" @itemJson="aiPro($event)" /> -->
        </div>
        <div
          v-if="scanned_result"
          class="mt-6 d-flex flex-wrap justify-content-center"
          style="height: auto"
        >
          <div
            v-for="(item, idx) in aiOutputs"
            :key="idx"
            class="hover_inside inventory_box d-flex align-items-center item_card mt-3 pb-3"
            @click="select_AiItem(item)"
          >
            <div>
              <img
                v-if="
                  (live && $store.getters.toggle) ||
                  item.item_details.picurl === ''
                "
                alt="pic"
                class="float-left ml-3"
                style="border-radius: 10px"
                src="../static/OogashopBusiness.png"
                height="85"
                width="60"
              />
              <img
                v-else
                alt="pic"
                class="float-left ml-3"
                style="border-radius: 10px"
                :src="imageSource1(item.item_details.picurl)"
                height="85"
                width="60"
              />
            </div>
            <div class="flex-grow-1 pl-3">
              <div class="d-flex flex-row">
                <div style="width: 45vw" class="txt1">
                  <p class="text-left gray mb text_one">
                    {{ item.item_details.brand }}
                  </p>
                  <p class="text-left mb text_two">
                    {{ item.item_details.name }}
                  </p>
                  <p
                    v-if="item.item_details.stock > 0"
                    class="mb text_grey-4 text_two"
                  >
                    STOCK: {{ item.item_details.stock }} PIECES
                  </p>
                </div>
                <div v-if="catalogActivated && activateMultpleMode">
                  <div
                    class="switch2 d-flex justify-content-center align-items-center"
                  >
                    <div v-if="multipleItems.includes(item)" class="circ2" />
                    <div v-else class="circ1" />
                  </div>
                </div>
              </div>
              <div
                class="mt-4 d-flex justify-content-between txt1"
                style="width: 45vw"
              >
                <p class="text_grey-3 text_two mb">
                  {{ item.item_details.quantity }}
                  {{ item_unit(item.item_details.units) }}
                </p>
                <p
                  v-if="catalogActivated"
                  class="mb text_grey-3 font-weight-bold text_two"
                >
                  Rs {{ item.item_details.unit_price }}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="open_cam"
          style="overflow: hidden; width: 100vw; min-height: 100vh"
        >
          <div v-if="!show_addItem" style="background-color: #303234">
            <div
              v-if="test_image"
              class="d-flex justify-content-center"
              style="height: 100vh; width: 100vw"
            >
              <div
                class="d-flex justify-content-center"
                style="position: absolute; top: 20vh"
              >
                <div class="outer_box d-flex justify-content-center flex-wrap">
                  <div
                    style="width: 100%"
                    class="d-flex justify-content-center justify-content-md-center"
                  >
                    <p
                      v-if="!barcode_trigger"
                      class="text-white text_four pt-3"
                    >
                      Item front
                    </p>
                    <p v-if="barcode_trigger" class="text-white text_four pt-3">
                      Bar code
                    </p>
                  </div>
                  <img
                    v-if="!barcode_trigger"
                    alt="pic"
                    class="inner_box"
                    :src="clicked_img"
                    height="280"
                    width="280"
                  />
                  <img
                    v-if="barcode_trigger"
                    alt="pic"
                    class="inner_box"
                    :src="barcode_img"
                    height="280"
                    width="280"
                  />
                </div>
              </div>
              <div
                v-if="barcode_trigger"
                class="d-flex justify-content-center"
                style="position: absolute; bottom: 15vh"
              >
                <div
                  class="tab-background d-flex justify-content-center align-items-center"
                >
                  <p class="mb text-white">
                    {{ generated_barcode }}
                  </p>
                </div>
              </div>
              <div class="img_foot d-flex justify-content-around">
                <div
                  v-if="!barcode_trigger"
                  style="z-index: 1; width: 25vw"
                  class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                  @click="click_ImgAgain_btn()"
                >
                  <p class="text_two mb font-weight-bold">Click again</p>
                </div>
                <div
                  v-if="barcode_trigger"
                  style="z-index: 1; width: 25vw"
                  class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                  @click="click_BarAgain_btn()"
                >
                  <p class="text_two mb font-weight-bold">Click again</p>
                </div>
                <div
                  v-if="!barcode_trigger"
                  style="z-index: 1; width: 25vw"
                  class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                  @click="
                    stopCameraTracks();
                    barcode_again = true;
                    test_image = false;
                    barcode_trigger = true;
                  "
                >
                  <p class="text_two mb blue_text font-weight-bold">Save</p>
                </div>
                <div
                  v-if="!barcode_trigger"
                  style="z-index: 1; width: 25vw"
                  class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                  @click="
                    stopCameraTracks();
                    show_addItem = true;
                    barcode_again = false;
                    test_image = false;
                  "
                >
                  <p class="text_two mb blue_text font-weight-bold">Skip</p>
                </div>
                <div
                  v-if="barcode_trigger"
                  style="z-index: 1; width: 25vw"
                  class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                  @click="
                    show_addItem = true;
                    edit_item.barcode = generated_barcode;
                    barcode_again = false;
                    test_image = false;
                  "
                >
                  <p class="text_two mb blue_text font-weight-bold">Save</p>
                </div>
              </div>
            </div>
            <div v-if="!test_image">
              <canvas
                v-show="!barcode_trigger"
                id="camera--sensor"
                style="z-index: -1"
              />
              <video
                v-show="!barcode_trigger"
                id="camera--view"
                autoPlay="{true}"
                style="
                  z-index: 0;
                  position: absolute;
                  width: 104vw;
                  height: 100vh;
                  border: 0px;
                "
                playsinline
              />
              <!-- <bar
                v-if="cam_band && barcode_trigger && barcode_again"
                style="height: 90vh;"
                :camera_number="selected_cam"
                :on-detected="logIt"
                :reader-size="readerSize"
                :reader-types="['ean_reader']"
              /> -->
              <div
                v-if="!test_image"
                class="d-flex justify-content-around"
                style="position: fixed; width: 100vw; top: 30px"
              >
                <img
                  alt="pic"
                  src="../static/icons/vender/Close_btn.webp"
                  @click="cancelItemMaking()"
                />
                <div
                  v-if="barcode_trigger"
                  class="d-flex justify-content-center align-items-center select_cam_css"
                  style="width: 33vw"
                >
                  <select v-model="selected_cam" @change="change_cam()">
                    <option v-for="(cam, i) in back_cams" :key="i" :value="cam">
                      camera {{ i + 1 }}
                    </option>
                  </select>
                </div>
                <img alt="pic" src="../static/icons/vender/help_btn.webp" />
              </div>
              <div
                class="d-flex justify-content-center"
                style="position: fixed; width: 100vw; top: 28vh"
              >
                <img alt="pic" src="../static/icons/vender/Cam.webp" />
              </div>
              <!-- Camera output -->
              <div
                class="d-flex justify-content-center"
                style="position: fixed; width: 100vw; bottom: 80px"
              >
                <img
                  v-if="!barcode_trigger"
                  alt="pic"
                  src="../static/scn.webp"
                  @click="cameraTrigger()"
                />
              </div>
              <div
                class="img_foot d-flex justify-content-around align-items-center"
              >
                <p v-if="!barcode_trigger" class="text_grey-3 text_three">
                  Take a photo of the front
                </p>
                <p
                  v-if="barcode_trigger"
                  class="text_grey-3 font-weight-bold pt-2 text_three"
                >
                  Take a photo of the barcode
                </p>
                <div
                  v-if="barcode_trigger && !searchViaBarcode"
                  style="z-index: 1; width: 32vw"
                  class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
                  @click="
                    stopCameraTracks();
                    show_addItem = true;
                    barcode_again = false;
                  "
                >
                  <p class="text_two mb blue_text font-weight-bold">Skip</p>
                </div>
              </div>
            </div>
          </div>
          <div
            v-if="show_addItem"
            :class="{ lowOpacity: UpdateSpinner, lowIndex: UpdateSpinner }"
            class="d-flex justify-content-center mt-6"
          >
            <img
              v-if="clicked_img !== '' && clicked_img"
              id="camera--output"
              class="ml-2 img2"
              :class="{ invisi: !show_addItem }"
              :src="imageSource(clicked_img)"
              style="
                height: 20vh;
                width: 30vw;
                border-radius: 16px;
                border: 2px solid #f0f0f3;
                box-shadow: inset 0 6px 4px 0 rgba(174, 174, 192, 0.6),
                  inset 0 -6px 4px 0 #fff;
              "
            />
            <img
              v-else-if="edit_item.picurl !== '' && !clicked_img"
              id="camera--output"
              class="ml-2 img2"
              :class="{ invisi: !show_addItem }"
              :src="imageSource1(edit_item.picurl)"
              style="
                height: 20vh;
                width: 30vw;
                border-radius: 16px;
                border: 2px solid #f0f0f3;
                box-shadow: inset 0 6px 4px 0 rgba(174, 174, 192, 0.6),
                  inset 0 -6px 4px 0 #fff;
              "
            />
            <img
              v-else
              id="camera--output"
              class="ml-2 img2"
              :class="{ invisi: !show_addItem }"
              src="../static/OogashopBusiness.png"
              style="
                height: 20vh;
                width: 30vw;
                border-radius: 16px;
                border: 2px solid #f0f0f3;
                box-shadow: inset 0 6px 4px 0 rgba(174, 174, 192, 0.6),
                  inset 0 -6px 4px 0 #fff;
              "
            />
            <img
              alt="pic"
              style="margin-top: 16vh; margin-left: 113px; z-index: 1"
              src="../static/icons/vender/select_pic.webp"
              :class="{ invisi: !show_addItem }"
              class="focus"
              height="50"
              width="50"
              @click="EditImg()"
            />
          </div>
          <div class="d-flex justify-content-center" style="width: 100vw">
            <div
              v-if="UpdateSpinner"
              class="d-flex justify-content-center align-items-center"
              style="height: 60vh; position: absolute; z-index: 2"
            >
              <div
                class="spinner-border"
                style="width: 3rem; height: 3rem"
                role="status"
              >
                <span class="sr-only">Loading...</span>
              </div>
            </div>
          </div>
          <div v-if="show_addItem" :class="{ lowOpacity: UpdateSpinner }">
            <div class="d-flex justify-content-center flex-wrap mt-4">
              <div style="width: 75vw">
                <select
                  id="exampleFormControlSelect1"
                  v-model="currentCategory"
                  class="select_box text_grey-3 focus"
                  @change="changeCat()"
                >
                  <option
                    v-for="category in categoryList"
                    :key="category.category_number"
                    :value="category"
                    class="options text_grey text_three"
                  >
                    {{ category.category }}
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
                    class="options text_grey text_three"
                  >
                    {{ category }}
                  </option>
                </select>
                <!-- <label v-if="validation[1] === false && validationTrigger" for="input" class="text_red mb font_small text_two">Do not leave this blank</label> -->
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
                    class="options text_grey text_three"
                  >
                    {{ category }}
                  </option>
                </select>
                <!-- <label v-if="validation[2] === false && validationTrigger" for="input" class="text_red mb font_small text_two">Do not leave this blank</label> -->
              </div>
              <div style="width: 75vw" class="mt-3">
                <label for="input" class="text_grey-1 mb font_small text_two"
                  >BARCODE</label
                >
                <div class="d-flex justify-content-between">
                  <input
                    v-model="edit_item.barcode"
                    type="text"
                    class="inputs pl-2 mt-2 focus"
                  />
                  <div class="barcodeBtn mr-2">
                    <img
                      alt="pic"
                      height="30"
                      class="mt-1"
                      width="30"
                      src="../static/barcodeIcon.webp"
                      @click="editBarcode()"
                    />
                  </div>
                </div>
              </div>
              <!-- <div
                class="d-flex justify-content-between mx-auto"
                style="width: 75vw"
              >
                <div
                  style="width: 45%"
                  class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="generateBarcode()"
                >
                  <p class="mb text_grey-1">Generate Barcode</p>
                </div>
                <div
                  style="width: 45%"
                  class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="dwnldBarcode(edit_item.item_id)"
                >
                  <p class="mb text_grey-1">Download Barcode</p>
                </div>
              </div> -->
              <div style="width: 75vw" class="mt-3">
                <label for="input" class="text_grey-1 mb font_small text_two"
                  >BRAND</label
                >
                <input
                  v-model="edit_item.brand"
                  type="text"
                  class="inputs pl-2 focus"
                />
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
              </div>
              <!-- {{ barcode_trigger }} {{ cam_band }} {{ barcode_again }} {{ test_image }} -->
              <div v-if="!perKg" style="width: 75vw" class="mt-3">
                <div style="width: 33vw">
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
                </div>
                <select
                  id="exampleFormControlSelect1"
                  v-model="edit_item.units"
                  class="select_box float-right text_grey-3 focus"
                  style="width: 30vw"
                >
                  <option class="options text_grey" selected>UNITS</option>
                  <option class="options text_grey">ML</option>
                  <option class="options text_grey">LITRE</option>
                  <option class="options text_grey">GRAM</option>
                  <option class="options text_grey">KILOGRAM</option>
                </select>
              </div>
              <div
                style="width: 75vw"
                class="mt-3 d-flex justify-content-start"
              >
                <input v-model="perKg" type="checkbox" class="mt-1" />
                <p class="text_grey-1 mb font_small text_two ml-2">
                  Item per Kg
                </p>
              </div>
              <div
                style="width: 75vw"
                class="mt-3 d-flex justify-content-between flex-wrap"
              >
                <div class="mt-3">
                  <div style="width: 33vw">
                    <label
                      for="input"
                      class="text_grey-1 mb font_small text_two"
                      >MRP <span v-if="perKg">(per Kg)</span></label
                    >
                    <input
                      v-model="edit_item.unit_price"
                      type="text"
                      class="pl-2 inputs focus"
                    />
                  </div>
                </div>
                <div
                  class="permission_card d-flex align-items-center pt-2"
                  style="margin-top: 2.5rem"
                >
                  <label class="switch ml-2 float-left">
                    <input v-model="essential" type="checkbox" />
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
                    >Selling price <span v-if="perKg">(per Kg)</span></label
                  >
                  <!-- NOT IN DATABASE YET
              <input v-model="edit_item.selling_price" type="text" class="inputs focus"> -->
                  <p class="pl-2 inputs focus">
                    {{ calculateSP }}
                  </p>
                  <!-- <input v-model="edit_item.selling_price" type="number" class=" pl-2 inputs focus"> -->
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
                  <!-- NOT IN DATABASE YET
              <input v-model="edit_item.selling_price" type="text" class="inputs focus"> -->
                  <input
                    v-model="edit_item.stock"
                    type="number"
                    class="pl-2 inputs focus"
                  />
                </div>
              </div>
              <div
                style="width: 75vw"
                class="mt-3 d-flex justify-content-start flex-wrap"
              >
                <div style="width: 100%">
                  <label
                    for="input"
                    style="color: #4f4f4f; font-size: 14px; line-height: 16px"
                    >Expiry Date</label
                  >
                  <!-- NOT IN DATABASE YET
              <input v-model="edit_item.selling_price" type="text" class="inputs focus"> -->
                  <div
                    class="d-flex justify-content-between align-items-center"
                  >
                    <div style="width: 15%">
                      <div
                        class="mb-2"
                        style="
                          color: #8d8da5;
                          font-size: 12px;
                          line-height: 12px;
                        "
                      >
                        Date
                      </div>
                      <input
                        v-model="expiry.date"
                        type="number"
                        class="pl-2 inputs focus"
                      />
                    </div>
                    <div style="width: 40%">
                      <div
                        class="mb-2"
                        style="
                          color: #8d8da5;
                          font-size: 12px;
                          line-height: 12px;
                        "
                      >
                        Month
                      </div>
                      <select
                        id="exampleFormControlSelect1"
                        v-model="expiry.month"
                        class="select_box1 text_grey-3 focus"
                      >
                        <option
                          v-for="(m, i) in mahina"
                          :key="i"
                          class="options text_grey"
                        >
                          {{ m }}
                        </option>
                      </select>
                    </div>
                    <div style="width: 30%">
                      <div
                        class="mb-2"
                        style="
                          color: #8d8da5;
                          font-size: 12px;
                          line-height: 12px;
                        "
                      >
                        Year
                      </div>
                      <select
                        id="exampleFormControlSelect1"
                        v-model="expiry.year"
                        class="select_box1 text_grey-3 focus"
                      >
                        <option
                          v-for="(y, i) in saal"
                          :key="i"
                          class="options text_grey"
                        >
                          {{ y }}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div
                style="width: 75vw"
                class="mt-3 d-flex justify-content-around mt-3 mb-4"
              >
                <div
                  v-if="!rareItemStuff"
                  style="z-index: 1; width: 32vw"
                  class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="endAddItem"
                >
                  <p class="text_two mb blue_text font-weight-bold">Cancel</p>
                </div>
                <div
                  v-if="
                    !rareItemStuff &&
                    !catalogActivated &&
                    !$store.getters.searchFromCatalog
                  "
                  style="z-index: 1; width: 32vw"
                  class="btnn mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="addNewInventoryItem()"
                >
                  <p class="text_two mb blue_text font-weight-bold">Save</p>
                </div>
                <div
                  v-if="
                    rareItemStuff ||
                    catalogActivated ||
                    $store.getters.searchFromCatalog
                  "
                  style="z-index: 1; width: 32vw"
                  class="btnn focus mt-3 mb-3 d-flex justify-content-center align-items-center"
                  @click="add_items_to_cart()"
                >
                  <p
                    v-if="!$store.getters.searchFromCatalog"
                    class="text_two mb blue_text font-weight-bold"
                  >
                    Add
                  </p>
                  <p
                    v-if="$store.getters.searchFromCatalog"
                    class="text_two mb blue_text font-weight-bold"
                  >
                    Proceed
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="toaster_text"
        class="d-flex justify-content-center"
        style="z-index: 2"
      >
        <div
          class="toaster d-flex align-items-center pl-4"
          style="color: white"
        >
          {{ toaster_text }}
        </div>
      </div>
      <div
        v-if="multipleItems.length > 20 && !quickSelect"
        class="d-flex justify-content-center"
        style="z-index: 2"
      >
        <div
          class="toaster d-flex align-items-center pl-4"
          style="color: white"
        >
          only 20 Items can be added at once
        </div>
      </div>
      <div
        v-if="
          !open_cam &&
          open_category &&
          !localSearchMode &&
          allowAddInventory &&
          !inventoryForCart &&
          !catalogActivated &&
          !rareItemStuff
        "
        class="d-flex justify-content-center align-items-center"
        style="z-index: 2; position: fixed; bottom: 25px; width: 100vw"
      >
        <div
          style="border-radius: 102px; width: 50vw; background-color: #b5dcf6"
          class="d-flex justify-content-start flex-row align-items-center ripple just"
          @click="modelOpen = true"
        >
          <img
            alt="pic"
            src="../static/addStock.webp"
            height="55"
            class="pt-2 pb-2 pl-4"
          />
          <p class="text_four text_grey-4 ml-2 font-weight-bold mb">ADD ITEM</p>
        </div>
      </div>
      <div
        v-if="activateMultpleMode && !quickSelect"
        class="d-flex justify-content-center"
        style="position: fixed; bottom: 20px; width: 100vw"
      >
        <div
          style="z-index: 1; width: 32vw"
          class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
          @click="AddMultipleItems()"
        >
          <p class="text_two mb blue_text font-weight-bold">Add</p>
        </div>
      </div>
      <div
        v-if="activateMultpleMode && quickSelect"
        class="d-flex justify-content-center"
        style="position: fixed; bottom: 20px; width: 100vw"
      >
        <div
          style="z-index: 1; width: 32vw"
          class="btnn mt-3 p-2 mb-3 d-flex justify-content-center align-items-center"
          @click="AddMultipleItemsQuickly()"
        >
          <p class="text_two mb blue_text font-weight-bold">Add</p>
        </div>
      </div>
    </div>
    <div
      id="myModal"
      v-if="modelOpen"
      class="modal d-flex justify-content-center"
      style="border-radius: 10px; syntax: 80vw"
      @click="popUp($event)"
    >
      <div
        class="modal-content d-flex justify-content-center flex-column align-items-center"
        style="height: auto; width: 80vw"
      >
        <p class="text_grey-3 text_three mt-2 txt">Choose an option</p>
        <div
          class="d-flex hover_inside justify-content-center mb-4 align-items-center button"
          @click="
            modelOpen = false;
            addFromAI();
          "
        >
          <img
            alt="pic"
            height="20"
            src="../static/file_icon.webp"
            width="20"
          />
          <p class="blue_text text_three pt-2 pl-3 pb-2 mb">Click Photo</p>
        </div>
        <!-- <div
              class="d-flex hover_inside justify-content-center mb-4 align-items-center button"
              @click="AddItemQuickSelect()"
            >
              <img
                alt="pic"
                src="../static/file_icon.webp"
                height="25"
                width="25"
              />
              <p class="text_red text_three pt-2 pl-3 pb-2 mb">Quick add</p>
            </div> -->
        <!-- <div
              class="d-flex hover_inside justify-content-center mb-4 align-items-center button"
              @click="openCatalog()"
            >
              <img
                alt="pic"
                src="../static/file_icon.webp"
                height="20"
                width="20"
              />
              <p class="blue_text text_three pt-2 pl-3 pb-2 mb">
                Add from list
              </p>
            </div> -->
        <div
          class="d-flex hover_inside justify-content-center mb-4 align-items-center button"
          @click="
            catalogItems = [];
            BarGunFromCatalog = true;
            modelOpen = false;
            catalogActivated = true;
            open_category = true;
          "
        >
          <img
            alt="pic"
            src="../static/file_icon.webp"
            height="20"
            width="20"
          />
          <p class="blue_text text_three pt-2 pl-3 pb-2 mb">
            Add from barcode gun
          </p>
        </div>
        <div
          class="d-flex hover_inside justify-content-center mb-4 align-items-center button"
          @click="AddItemManually()"
        >
          <img alt="pic" src="../static/Camera.webp" height="25" width="25" />
          <p class="text_red text_three pt-2 pl-3 pb-2 mb">Add a new item</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// import Localbase from "localbase";
// import bar from '~/components/bar.vue'
// import aiCamera from '~/components/aicam.vue'
// const db = new Localbase("db");
export default {
  //   components: {
  //     bar,
  //     aiCamera
  //   },
  props: {
    rareItemStuff: {
      type: Object,
      default: null,
    },
    inventoryForCart: {
      type: Boolean,
      default: false,
    },
    liveOrder: {
      type: Boolean,
      default: false,
    },
    live: {
      type: Boolean,
    },
  },
  data() {
    return {
      multipleItems: [],
      SearchModal: false,
      auth: null,
      perKg: false,
      activateMultpleMode: false,
      showSearchBar: false,
      searchViaBarcode: false,
      localSearchMode: false,
      barcodeGenerate: {},
      scanned_result: false,
      stocks: false,
      quickSelect: false,
      validationTrigger: false,
      cameraPridiction: false,
      ai_processing: false,
      removeItemPopUp: false,
      subCategoryList: [],
      CategoryHierarchy: {},
      subsubcatList: [],
      NewStock: 0,
      aiOutputs: [],
      open_category: false,
      modelOpen: false,
      StockModel: false,
      StockId: null,
      search_input: "",
      toaster_text: null,
      lowStockItems: null,
      itemToBeDeleted: null,
      open_cam: false,
      essential: false,
      dummyCatJson: [],
      UpdateSpinner: false,
      spinner: null,
      barcode_again: false,
      back_cams: [],
      cam_band: true,
      defaultBarcodeImg:
        "https://www.incimages.com/uploaded_files/image/1920x1080/*Barcode_32896.jpg",
      barcode_img: null,
      barcode_trigger: false,
      test_image: false,
      currentCategory: {},
      BarGunFromCatalog: false,
      ExpiringItems: [],
      subcategory: null,
      subsubcategory: null,
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
        // ai_data_url: '',
        disabled: false,
        selling_price: 0,
      },
      catalogItems: [],
      selected_cam: 2,
      clicked_img: null,
      catalogActivated: false,
      show_addItem: false,
      constraints: { video: { facingMode: "environment" }, audio: false },
      cameraStream: null,
      inventoryFromAPI: [],
      categoryList: [],
      generated_barcode: null,
      shopAPI: {
        inventory_json: {
          ai_model_version_for_processing: "",
        },
      },
      mahina: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      saal: [2021, 2022, 2023, 2024, 2025, 2026, 2027, 2028, 2029, 2030],
      timeStamp: null,
      categoryItems: [],
      readerSize: {
        width: { min: 640, ideal: 1280, max: 1920 },
        height: { min: 680, ideal: 1020, max: 1080 },
      },
      product_categorization: {},
      tab: 1,
      expiry: {
        date: "1",
        month: "December",
        year: 2021,
      },
      ExpiryItemDetails: {},
      ExpiryPopUp: false,
      img: "../static/OogashopBusiness.png",
    };
  },
  computed: {
    validation() {
      const testo = [false, true, true];
      if (Object.keys(this.currentCategory).length) {
        testo[0] = true;
      }
      if (this.subcategory) {
        testo[1] = true;
      }
      if (this.subsubcategory) {
        testo[2] = true;
      }
      return testo;
    },
    calculateSP() {
      return this.edit_item.unit_price - this.edit_item.discount;
    },
    allowAddInventory() {
      return this.auth.permission_add_inventory;
    },
    allowEditInventory() {
      return this.auth.permission_edit_inventory;
    },
    allowDeleteInventory() {
      return this.auth.permission_delete_inventory;
    },
  },
  async mounted() {
    this.auth = JSON.parse(localStorage.getItem("storeData"));
    // db.collection('yo').add({ 1: 'hello' })
    this.$store.commit("toggle", localStorage.getItem("internet") === "true");
    this.$store.commit("modeOff", localStorage.getItem("mode") === "true");
    document.querySelector("#swipeetop").style.transition =
      "transform 200ms linear";
    setTimeout(() => {
      document.querySelector("#swipeetop").style.transform = "translateY(0%)";
      document.querySelector("#swipeetop").style.willChange = "transform";
    }, 10);
    if (this.rareItemStuff) {
      if (this.rareItemStuff.item_json) {
        this.open_cam = true;
        this.show_addItem = true;
        this.clicked_img = this.rareItemStuff.item_json.customer_input_picurl;
      }
    }
    let barcode = "";
    let interval;
    const thiz = this;
    thiz.timeStamp = async function (evt) {
      if (interval) {
        clearInterval(interval);
      }
      if (evt.code === "Enter") {
        if (barcode) {
          const dataset = await thiz.barcodeGunitemCall(barcode);
          if (dataset.length) {
            thiz.barcodeGun(dataset[0].product_id);
            // const item = await thiz.getItemsFromID([dataset[0].product_id])
          } else {
            thiz.NoitemFound = true;
            barcode = "";
            return;
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
    document.addEventListener("keydown", this.timeStamp);
    let temp = null;
    temp = await navigator.mediaDevices.enumerateDevices();
    temp.map((key) => {
      if (key.kind === "videoinput" && key.label.includes("back")) {
        this.back_cams.push(temp.indexOf(key));
      }
    });
    const Activecamera = this.back_cams[this.back_cams.length - 1];
    this.CategoryHierarchy = await this.getCategoryHierarchy();
    this.selected_cam = Activecamera;
    this.spinner = true;
    const inventory = await this.getInventory();
    if (typeof inventory !== "undefined") {
      this.inventoryFromAPI = inventory[0]
        ? inventory[0].inventory_json
        : null;
      this.categoryList = this.inventoryFromAPI
        ? this.inventoryFromAPI.inventory_items
        : [];
      this.$store.commit("inventoryData", inventory);
    } else {
      alert("Failed to fetch shop inventory! Check logs for more info.");
    }
    console.log(this.categoryList);
    this.spinner = false;
  },
  destroyed() {
    document.removeEventListener("keydown", this.timeStamp);
    this.stopCameraTracks();
  },
  methods: {
    expirylog(dateTime) {
      // 2021-11-23T06:29:00.830Z
      // 2021-11-23T06:32:26.745Z
      // const today = new Date().toISOString()
      // // today.slice(5, 10)
      // console.log(today)
      // if (today.slice(5, 7) !== dateTime.slice(5, 7)) {
      //   return 'Month'
      // } else {
      //   return 'Days'
      // }
      const today = new Date().getTime();
      const res = new Date(dateTime).getTime();
      let rem = (res - today) / (1000 * 60 * 60 * 24 * 30);
      rem = parseInt(rem);
      if (rem === 0) {
        return "Days";
      }
      if (rem < 0) {
        return "Expired";
      }
      return "Months";
    },
    expiryTime(dateTime) {
      // 2021-11-23T06:29:00.830Z
      // 2021-11-23T06:32:26.745Z.slice(5, 7)
      // const today = new Date().toISOString()
      // // today.slice(5, 10)
      // if (today.slice(5, 7) !== dateTime.slice(5, 7)) {
      //   return dateTime.slice(5, 7) - today.slice(5, 7)
      // } else {
      //   return dateTime.slice(8, 10) - today.slice(8, 10)
      // }
      const today = new Date().getTime();
      const res = new Date(dateTime).getTime();
      let rem = (res - today) / (1000 * 60 * 60 * 24 * 30);
      rem = parseInt(rem);
      if (rem === 0) {
        rem = (res - today) / (1000 * 60 * 60 * 24);
        rem = parseInt(rem);
      }
      return rem;
    },
    async getExpiryItems() {
      const date = new Date();
      const month = date.getMonth() + 2;
      let year = date.getYear();
      const yearLastTerm = year.toString();
      year = 20 + yearLastTerm.slice(1, yearLastTerm.length);
      const response = await this.$axios({
        method: "GET",
        url: `/getExpiryWithin/${this.auth.shop_id}/${month}/${year}/?employeeID=${this.auth.employee_id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Credential"),
        },
        progress: false,
      });
      const a = [...response.data.soon_expiring_items];
      a.sort((x, y) => {
        const p = new Date(x.expiry_date).getTime();
        const q = new Date(y.expiry_date).getTime();
        return p - q;
      });
      this.ExpiringItems = [...a];
    },
    expiryDate(dateStr) {
      return dateStr.slice(0, 10);
    },
    async UpdateExpiryDate() {
      const mahina = this.mahina.indexOf(this.expiry.month) + 1;
      const expiryDate =
        this.expiry.year +
        "-" +
        mahina +
        "-" +
        this.expiry.date +
        "T00:02:07.648Z";
      const payload = {
        name: this.ExpiryItemDetails.name,
        brand: this.ExpiryItemDetails.brand,
        quantity: this.ExpiryItemDetails.quantity,
        units: this.ExpiryItemDetails.units,
        unit_price: this.ExpiryItemDetails.unit_price,
        unit_price_currency: this.ExpiryItemDetails.unit_price_currency,
        selling_price: this.ExpiryItemDetails.selling_price,
        discount: this.ExpiryItemDetails.discount,
        picurl: this.ExpiryItemDetails.picurl,
        barcode: this.ExpiryItemDetails.barcode,
        disabled: this.ExpiryItemDetails.disabled,
        stock: this.ExpiryItemDetails.stock,
        expiry_date: expiryDate,
        catalog_connection: this.ExpiryItemDetails.catalog_connection,
      };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/editInventoryItem?itemID=${this.ExpiryItemDetails.item_id}&employeeID=${this.auth.employee_id}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
        });
        this.ExpiryPopUp = false;
        this.expiry = {
          date: "1",
          month: "December",
          year: 2021,
        };
        this.getExpiryItems();
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    SearchWithBar() {
      alert("This feature is not available right now");
      return;
      this.searchViaBarcode = true;
      this.barcode_trigger = true;
      this.barcode_again = true;
      this.test_image = false;
      this.open_cam = true;
      // this.ai_processing = false
      // this.scanned_result = true
      // this.cameraPridiction = false
    },
    added(item) {
      const idy = this.$store.getters.cartItems.findIndex(
        (key) => key.final_chosen.item_id === item.item_id
      );
      if (idy === -1) {
        return true;
      } else {
        return false;
      }
    },
    currentQuantity(idx) {
      const idy = this.$store.getters.cartItems.findIndex(
        (item) => item.final_chosen.item_id === idx
      );
      if (idy !== -1) {
        const cart = this.$store.getters.cartItems;
        console.log(cart);
        return this.$store.getters.cartItems[idy].final_chosen.quantity;
      } else {
        return 0;
      }
    },
    addRemove(i) {
      // if (this.ext.includes(i.sno)) {
      //   this.ext.splice(this.ext.indexOf(i.sno), 1)
      // } else {
      //   this.ext.push(i.sno)
      // }
      const ItemToProcceed = {
        customer_input_picurl: "string",
        customer_input_barcode: "string",
        customer_input_text: "string",
        customer_input_speechurl: "string",
        ai_outputs_item_ids: [0],
        final_chosen: {
          item_id: i.item_details.item_id,
          quantity: 1,
          unit_price: i.item_details.unit_price,
          final_price: i.item_details.final_price,
          discount: i.item_details.discount,
          discountReason: "non",
        },
      };
      this.$store.commit("addToCartAlpha", ItemToProcceed);
    },
    async AddMultipleItemsQuickly() {
      const payload = {
        catalog_items: [],
      };
      const itemsList = this.multipleItems;
      itemsList.forEach((key) => {
        const item = {
          shop_id: this.auth.shop_id,
          catalog_item_id: key.item_details.item_id,
          category_number: key.item_details.category_number,
          category_name: this.currentCategory.category,
          subcategory_name: key.item_classification.subcategory,
          subsubcategory_name: key.item_classification.subsubcategory,
          oogadiscount: null,
          giftitem: null,
          essential: null,
        };
        payload.catalog_items.push(item);
      });
      try {
        const response = await this.$axios({
          method: "POST",
          url: "/addManyCatalogProductsToShop",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: payload,
        });
        // eslint-disable-next-line no-unused-vars
        const responseM = response.data;
        this.toaster_text = "Item added successfully";
        setTimeout(() => {
          this.toaster_text = null;
        }, 2000);
        this.catalogItems = [];
        this.catalogActivated = false;
        this.activateMultpleMode = false;
        this.getItemsFromCategory(this.currentCategory);
        this.multipleItems = [];
        return response.data;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return undefined;
      }
    },
    popUp(e) {
      e.stopPropagation();
      this.modelOpen = false;
      this.SearchModal = false;
      this.removeItemPopUp = false;
      this.StockModel = false;
      this.ExpiryPopUp = false;
    },
    async AddMultipleItems() {
      if (this.multipleItems.length > 20) {
      } else {
        const shopID = this.auth.shop_id;
        const categoryData = [];
        this.multipleItems.forEach((key) => {
          const categorization = {
            subcategory: key.item_classification.subcategory,
            subsubcategory: key.item_classification.subsubcategory,
            essential_item: key.item_classification.essential_item,
          };
          delete key.item_classification;
          key.product_categorization = categorization;
          key.item_details.discount = 0;
          key.item_details.selling_price = key.unit_price * key.discount;
          key.item_details.disabled = false;
          key.item_details.stock = -1;
          key.item_details.expiry_date = "2021-07-17T11:57:40.586Z";
          key.item_details.catalog_connection = key.item_details.item_id;
          delete key.item_details.item_id;
          delete key.item_details.created_by_id;
          delete key.item_details.category_number;
          delete key.item_details.created;
          delete key.item_details.last_touched;
          key.product_data = { ...key.item_details };
          delete key.item_details;
        });
        let response = null;
        try {
          response = await this.$axios({
            method: "POST",
            url: `/addInventoryItemsWithCategorizationList?employeeID=${this.auth.employee_id}`,
            headers: {
              "Content-Type": "application/json",
              Authorization: localStorage.getItem("Credential"),
            },
            data: this.multipleItems,
          });
          const responseM = response.data;
          this.toaster_text = "Item added successfully";
          setTimeout(() => {
            this.toaster_text = null;
          }, 2000);
          responseM.forEach((key) => {
            const item = {
              shopID,
              category_number: this.currentCategory.category_number,
              inventory_item_id: key[0].item_id,
            };
            this.$store.commit("updateInventory", [
              key[0].item_id,
              this.currentCategory.category_number - 1,
            ]);
            categoryData.push(item);
          });
          this.catalogItems = [];
          await this.addInventoryItemListToCategory(categoryData);
          this.catalogActivated = false;
          this.activateMultpleMode = false;
          this.getItemsFromCategory(this.currentCategory);
          this.multipleItems = [];
          return response.data;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.log(error);
          return undefined;
        }
      }
    },
    async getCategoryHierarchy() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: "/getCategoryHierarchy",
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
    async aiPro($event) {
      this.ai_processing = false;
      this.cameraPridiction = false;
      let Aioutputs = [];
      this.localSearchMode
        ? (Aioutputs = await this.getItemsFromID($event))
        : (Aioutputs = await this.getCatItemFromId($event));
      Aioutputs.map((key) => {
        key = key[0];
      });
      if (this.localSearchMode) {
        this.scanned_result = false;
        this.catalogActivated = false;
        this.open_category = true;
        this.categoryItems = [...Aioutputs];
      } else {
        this.scanned_result = true;
        this.aiOutputs = [...Aioutputs];
      }
      this.stopCameraTracks();
    },
    async getCatItemFromId(tempInventory) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/getDetailedCatalogItems ",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: tempInventory,
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async searchViaAi() {
      alert("This feature is not available right now");
      return;
      this.open_category = false;
      this.$store.commit("AiType", "InShop");
      this.addFromAI();
      this.SearchModal = false;
      this.localSearchMode = true;
      const response = await this.$axios({
        method: "GET",
        url: `/shopDetails/${this.auth.shop_id}`,
      });
      this.shopAPI = response.data;
    },
    hitTheAiCamera() {
      console.log(this.constraints);
      navigator.mediaDevices
        .getUserMedia(this.constraints)
        .then((stream) => {
          const cameraView = document.querySelector("#Aicamera--view");
          const canvas = (window.canvas =
            document.querySelector("#Aicamera--sensor"));
          canvas.width = cameraView.videoWidth;
          canvas.height = cameraView.videoHeight;
          window.stream = stream; // make stream available to browser console
          cameraView.srcObject = stream;
          this.cameraStream = stream;
        })
        .catch((err) => {
          // eslint-disable-next-line no-console
          this.cameraStream = null;
          console.log(err);
          if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            alert("Oops! No camera device found!");
            // this.$router.push('/home')
          } else if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            alert("Please give camera permission!");
            // this.$router.push('/home')
          } else {
            alert("Oops! Some error occured. Check logs for more info.");
            // this.$router.push('/home')
          }
        });
    },
    getPhoto() {
      const cameraView = document.querySelector("#Aicamera--view");
      const cameraSensor = document.querySelector("#Aicamera--sensor");
      cameraSensor.width = cameraView.videoWidth;
      cameraSensor.height = cameraView.videoHeight;
      cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
      const productImage = cameraSensor.toDataURL("image/jpeg");
      this.$store.commit("imageForAi", productImage);
      this.ai_processing = true;
    },
    addFromAI() {
      alert("This feature is not available right now");
      return;
      setTimeout(() => {
        this.choose_screen = false;
        this.cameraPridiction = true;
        this.hitTheAiCamera();
      }, 500);
    },
    deleteItem(item, event) {
      this.removeItemPopUp = true;
      this.itemToBeDeleted = item.item_id;
      event.stopPropagation();
    },
    AddItemQuickSelect() {
      this.quickSelect = true;
      this.openCatalog();
    },
    AddItemManually() {
      document.querySelector("#swipeetop").style.transition =
        "transform 10ms linear";
      setTimeout(() => {
        document.querySelector("#swipeetop").style.transform = "translateY(0%)";
        document.querySelector("#swipeetop").style.willChange = "transform";
      }, 100);
      this.modelOpen = false;
      this.hitTheCamera();
    },
    cancelItemMaking() {
      if (!this.localSearchMode) {
        this.open_cam = false;
        this.open_category = true;
        this.barcode_trigger = false;
        this.stopCameraTracks();
        document.querySelector("#swipeetop").style.transition =
          "transform 10ms linear";
        setTimeout(() => {
          document.querySelector("#swipeetop").style.transform =
            "translateY(0%)";
          document.querySelector("#swipeetop").style.willChange = "transform";
        }, 100);
        document.querySelector("#swipeetop").style.transition =
          "transform 10ms linear";
        setTimeout(() => {
          document.querySelector("#swipeetop").style.transform =
            "translateY(0%)";
          document.querySelector("#swipeetop").style.willChange = "transform";
        }, 100);
      } else {
        this.localSearchMode = false;
        this.stopCameraTracks();
        this.open_category = false;
        this.cameraPridiction = false;
        this.open_cam = false;
        this.showSearchBar = false;
        this.scanned_result = false;
      }
    },
    async fetchLowStockItems() {
      const response = await this.$axios({
        method: "GET",
        url: `/lowStockItems/${this.auth.shop_id}?employeeID=${this.auth.employee_id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Credential"),
        },
        progress: false,
      });
      this.lowStockItems = [...response.data];
      console.log(response.data);
    },
    async updateStock() {
      const itemObj = {
        item_id: this.lowStockItems[this.StockId].item_id,
        newstock: this.NewStock,
      };
      const response = await this.$axios({
        method: "POST",
        url: `/updateStock?employeeID=${this.auth.employee_id}`,
        headers: {
          "Content-Type": "application/json",
          Authorization: localStorage.getItem("Credential"),
        },
        data: itemObj,
        progress: false,
      });
      console.log(response.data);
      this.StockModel = false;
      this.toaster_text = "Stock is Added";
      this.NewStock = 0;
      this.lowStockItems.splice(this.StockId, 1);
      setTimeout(() => {
        this.toaster_text = null;
      }, 2000);
    },
    async openCatalog() {
      let CatCat = await this.GetCatlogFromCategory();
      const catItemId = [];
      this.categoryItems.map((key) => {
        if (key.item_details.catalog_connection) {
          catItemId.push(key.item_details.catalog_connection);
        }
        // key.catalog_connection === key.item_id
      });
      CatCat = CatCat.filter((key) => {
        if (!catItemId.includes(key.item_details.item_id)) {
          return key;
        }
      });
      if (CatCat.length > 0) {
        const a = [...CatCat];
        a.sort((p, q) => {
          if (p.item_details.brand > q.item_details.brand) {
            return 1;
          }
          if (q.item_details.brand > p.item_details.brand) {
            return -1;
          }
          return 0;
        });
        this.catalogItems = [...a];
        this.catalogActivated = true;
        this.open_category = true;
        this.modelOpen = false;
      } else {
        this.modelOpen = false;
        this.toaster_text = "Catalog is Empty";
        setTimeout(() => {
          this.toaster_text = null;
        }, 2000);
      }
    },
    async GetCatlogFromCategory() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getCatalogItemsForCategoryWithCategorization/${this.currentCategory.category_number}`,
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
    editBarcode() {
      this.barcode_again = true;
      this.show_addItem = false;
      this.barcode_trigger = true;
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
    gobAck() {
      if (this.stocks) {
        this.stocks = false;
        return;
      }
      if (this.show_addItem) {
        if (this.$store.getters.AiType === "Catalog") {
          this.aiOutputs = [];
        }
        this.show_addItem = false;
        this.open_cam = false;
        if (this.searchViaBarcode) {
          this.localSearchMode = false;
          this.searchViaBarcode = false;
          this.open_category = false;
          this.scanned_result = false;
        } else {
          this.open_category = true;
          this.scanned_result = true;
        }
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
          // ai_data_url: '',
          disabled: false,
          selling_price: 0,
        };
        this.subcategory = "";
        this.subsubcategory = "";
        this.essential = false;
      } else if (this.clicked_img) {
        this.clicked_img = null;
      } else if (this.open_category) {
        this.localSearchMode = false;
        this.open_category = false;
        this.scanned_result = false;
        this.localSearchMode = false;
        this.categoryItems = [];
        this.catalogActivated = false;
      } else if (this.liveOrder && !this.open_category) {
        this.$store.commit("itemToCarry", null);
        this.$emit("Back", false);
        return;
      } else if (this.inventoryForCart) {
        this.$emit("Back", false);
      } else {
        document.querySelector("#swipeetop").style.transition =
          "transform 200ms linear";
        setTimeout(() => {
          document.querySelector("#swipeetop").style.transform =
            "translateY(100%)";
          document.querySelector("#swipeetop").style.willChange = "transform";
        }, 200);
        setTimeout(() => {
          this.$router.push("/home");
        }, 200);
      }
      this.search_input = "";
      this.clicked_img = null;
      this.barcode_trigger = false;
      this.activateMultpleMode = false;
      this.showSearchBar = false;
      if (this.BarGunFromCatalog) {
        this.catalogActivated = false;
      }
      // switch (this.displayedScreen) {
      //   case 'genere':
      //     if (this.genereId !== null) {
      //       this.LastRoute = 'genere'
      //     }
      //     this.displayedScreen = 'categories'
      //     break
      //   case 'playlist':
      //     this.LastRoute = 'playlist'
      //     this.displayedScreen = 'genere'
      //     break
      //   case 'filteredsearchResult':
      //     this.LastRoute = 'filteredsearchResult'
      //     this.displayedScreen = 'categories'
      //     break
      //   case 'newReleasePlaylist':
      //     this.LastRoute = 'newReleasePlaylist'
      //     this.displayedScreen = 'NewRelease'
      //     break
      //   case 'NewRelease':
      //     this.LastRoute = 'NewRelease'
      //     this.displayedScreen = 'categories'
      //     break
      // }
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
    textSearch() {
      this.SearchModal = false;
      this.showSearchBar = true;
      setTimeout(() => {
        document.getElementById("searchBox").focus();
      }, 300);
    },
    loadInventoryItems(category, i) {
      setTimeout(() => {
        const thiz = this;
        thiz.open_category = true;
        thiz.spinner = true;
        thiz.currentCategory = category;
        thiz.getItemsFromCategory(category);
        // const index = Object.keys(this.CategoryHierarchy).findIndex(name => name === category.category)
        const cats = { ...thiz.CategoryHierarchy[category.category] };
        thiz.subCategoryList = Object.keys(cats);
      }, 100);
    },
    changeCat() {
      const thiz = this;
      this.subcategory = "";
      this.subsubcategory = "";
      const cats = { ...thiz.CategoryHierarchy[thiz.currentCategory.category] };
      thiz.subCategoryList = Object.keys(cats);
    },
    changeSubSub() {
      const thiz = this;
      const cats =
        thiz.CategoryHierarchy[thiz.currentCategory.category][thiz.subcategory];
      // debugger
      thiz.subsubcatList = cats;
    },
    change_cam() {
      this.cam_band = false;
      setTimeout(() => {
        this.cam_band = true;
      }, 500);
    },
    async localSearch() {
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
        return response.data;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async search_item() {
      this.spinner = true;
      const res = await this.localSearch();
      if (res.length) {
        const id = [];
        res.map((item) => {
          id.push(item.product_id);
        });
        const list = await this.getItemsFromID(id);
        // const dummyCatJson = [...this.dummyCatJson]
        // dummyCatJson.map((key) => {
        //   const itemBrand = key.item_details.brand.toLowerCase()
        //   const itemName = key.item_details.name.toLowerCase()
        //   if (itemName.includes(this.search_input) || itemBrand.includes(this.search_input)) {
        //     dummyCat.push(key)
        //   }
        // })
        document.querySelector("#swipeetop").style.transition =
          "transform 200ms linear";
        setTimeout(() => {
          document.querySelector("#swipeetop").style.transform =
            "translateY(0%)";
          document.querySelector("#swipeetop").style.willChange = "transform";
        }, 200);
        this.categoryItems = [...list];
      } else {
        this.categoryItems = [];
      }
      this.spinner = false;
      this.showSearchBar = false;
      this.localSearchMode = true;
      this.open_category = true;
      this.catalogActivated = false;
    },
    async removeItemFromInv() {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/disableInventoryItem?item_id=${this.itemToBeDeleted}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
        });
        this.removeItemPopUp = false;
        if (this.localSearchMode) {
          const res = await this.localSearch();
          if (res.length) {
            const id = [];
            res.map((item) => {
              id.push(item.product_id);
            });
            const list = await this.getItemsFromID(id);
            this.categoryItems = [...list];
          } else {
            this.categoryItems = [];
          }
        } else {
          this.getItemsFromCategory(this.currentCategory);
        }
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
    async getCategoryForItem(datalist) {
      const data = { inventoryIDs: datalist };
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/getInventoryCategoryForShop?shopID=${this.auth.shop_id}`,
          
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
    select_AiItem(item) {
      const cloneItem = { ...item };
      const thiz = this;
      thiz.currentCategory =
        thiz.categoryList[cloneItem.item_details.category_number - 1];
      const cats = { ...thiz.CategoryHierarchy[thiz.currentCategory.category] };
      thiz.subCategoryList = Object.keys(cats);
      thiz.subcategory = cloneItem.item_classification.subcategory;
      const cats2 =
        thiz.CategoryHierarchy[thiz.currentCategory.category][thiz.subcategory];
      thiz.subsubcatList = cats2;
      thiz.subsubcategory = cloneItem.item_classification.subsubcategory;
      cloneItem.catalog_connection = cloneItem.item_details.item_id;
      delete cloneItem.item_details.item_id;
      delete cloneItem.item_details.unit_price_currency;
      delete cloneItem.item_details.category_number;
      delete cloneItem.item_details.created;
      delete cloneItem.item_details.created_by_id;
      delete cloneItem.item_details.last_touched;
      cloneItem.discount = 0;
      cloneItem.stock = "";
      thiz.edit_item = { ...cloneItem.item_details };
      thiz.open_cam = true;
      thiz.scanned_result = false;
      thiz.show_addItem = true;
    },
    EditImg() {
      this.barcode_again = false;
      this.hitTheCamera();
      this.test_image = false;
    },
    click_ImgAgain_btn() {
      this.hitTheCamera();
      this.test_image = false;
    },
    click_BarAgain_btn() {
      if (!this.barcode_again) {
        this.barcode_again = true;
      }
      this.test_image = false;
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
    async logIt(data) {
      if (!this.searchViaBarcode) {
        this.test_image = true;
        this.barcode_again = false;
        const cameraView = document.querySelector("#camera--view");
        const cameraSensor = document.querySelector("#camera--sensor");
        cameraSensor.width = cameraView.videoWidth;
        cameraSensor.height = cameraView.videoHeight;
        cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
        const barcode = cameraSensor.toDataURL("image/jpeg");
        if (barcode === "data:,") {
          this.barcode_img = this.defaultBarcodeImg;
        } else {
          this.barcode_img = cameraSensor.toDataURL("image/jpeg");
        }
        this.generated_barcode = data.codeResult.code;
      } else {
        const barcode = data.codeResult.code;
        const dataset = await this.searchBarcode(barcode);
        if (dataset.length) {
          let item = await this.getItemsFromID([dataset[0].product_id]);
          item = item[0];
          const arr = await this.getCategoryForItem([dataset[0].product_id]);
          this.currentCategory = arr[0][1];
          const cats = {
            ...this.CategoryHierarchy[this.currentCategory.category],
          };
          this.subCategoryList = Object.keys(cats);
          this.edit_item = { ...item.item_details };
          if (item.item_classification.length) {
            this.subcategory = item.item_classification[0].subcategory;
            this.changeSubSub();
            this.subsubcategory = item.item_classification[0].subsubcategory;
            this.essential = item.item_classification[0].essential_item;
          }
          if (item.item_details.stock === -1) {
            this.edit_item.stock = "";
          }
          if (!this.edit_item.discount) {
            this.edit_item.discount = 0;
          }
          this.open_cam = true;
          this.show_addItem = true;
        }
        // const inventory = await this.getShopInventory(1)
        // this.inventory.map((key) => {
        //   if (key.barcode) {
        //     if (!this.allBarcodes.includes(key.barcode)) {
        //       this.allBarcodes.push(key.barcode)
        //     }
        //   }
        // })
        // const barcodeResult = await this.barcode_match(this.allBarcodes, data.codeResult.code)
        // this.inventory.map((key) => {
        //   if (key.barcode) {
        //     if (key.barcode === barcodeResult) {
        //       this.cartItem = {
        //         ai_outputs: this.newAiOutputs,
        //         customer_input_picurl: this.uploadedImageUrl
        //       }
        //       this.cartItem.final_chosen = key
        //       this.item_quantity = key.quantity
        //       this.displayedScreen = 'addToCart'
        //       // this.getOogaDiscount(this.cartItem.final_chosen.item_id)
        //       this.final_price = this.cartItem.final_chosen.unit_price
        //     }
        //   }
        // })
      }
    },
    async getShopInventory(shopID) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/fetchInventory/${shopID}`,
          
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
    async barcode_match(inventoryBarcodes, detectedBarcode) {
      // eslint-disable-next-line no-undef
      const fuzzysetForBarcode = FuzzySet(inventoryBarcodes);
      const matches = await fuzzysetForBarcode.get(detectedBarcode);
      if (matches == null) {
        this.barcode_result = true;
        this.cam_band = false;
      } else {
        const device = navigator.userAgent.toLowerCase();
        if (device.includes("android")) {
          navigator.vibrate(300);
        }
        return matches[0][1];
      }
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
    async getItemsFromCategory(categoryObj) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/getDetailedItemsTimesorted",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: categoryObj,
          progress: false,
        });
        const items = response.data;
        this.dummyCatJson = items;
        this.categoryItems = items;
      } catch (error) {
        response = error.response;
        console.log(error);
        return undefined;
      } finally {
        this.spinner = false;
      }
    },
    async updateInventoryItem(itemObj) {
      // itemObj.itemID = itemObj.item_id;
      // delete itemObj.item_id;
      // editInventoryItemWithCategorizationAndSaveBarcode
      if (this.allowEditInventory) {
        let response = null;
        let url;
        if (Object.keys(this.barcodeGenerate).length) {
          const invItem2 = { ...itemObj };
          itemObj = {};
          itemObj.item_data = {
            ...invItem2,
          };
          itemObj.barcode_data = {
            use_auto_generated_barcode: true,
            barcode_image_link: this.barcodeGenerate.barcode_link,
            barcode_count: this.barcodeGenerate.barcode_count,
          };
          url = `editInventoryItemWithCategorizationAndSaveBarcode?shop_id=${this.auth.shop_id}&employeeID=${this.auth.employee_id}`;
        } else {
          url = `/editInventoryItemWithCategorization?employeeID=${this.auth.employee_id}`;
        }
        try {
          response = await this.$axios({
            method: "POST",
            url,
            headers: {
              "Content-Type": "application/json",
            },
            data: itemObj,
            progress: false,
          });
          this.barcodeGenerate = {};
          return response.data;
        } catch (error) {
          console.log(error);
          return undefined;
        }
      }
    },
    async addNewInventoryItem() {
      const judge = this.validation.includes(false);
      if (judge) {
        this.validationTrigger = true;
        return;
      }
      this.UpdateSpinner = true;
      if (this.edit_item.item_id) {
        if (!this.allowEditInventory) {
          this.UpdateSpinner = false;
          alert("Bad Permissions!");
          return;
        }
        const shopID = this.auth.shop_id;
        let stock = -1;
        if (this.edit_item.stock) {
          if (this.edit_item.stock.length > 0) {
            stock = this.edit_item.stock;
          }
        }
        let mahina = this.mahina.indexOf(this.expiry.month) + 1;
        if (parseInt(mahina) < 10) {
          mahina = "0" + mahina.toString();
        }
        if (parseInt(this.expiry.date) < 10) {
          this.expiry.date = "0" + this.expiry.date.toString();
        }
        const expiryDate =
          this.expiry.year +
          "-" +
          mahina +
          "-" +
          this.expiry.date +
          "T00:02:07.648Z";
        const updatedObj = {
          item_id: this.edit_item.item_id,
          product_data: {
            name: this.edit_item.name,
            brand: this.edit_item.brand,
            quantity: this.perKg ? 1 : this.edit_item.quantity,
            units: this.perKg ? "GRAM" : this.edit_item.units,
            unit_price: this.perKg
              ? this.edit_item.unit_price / 1000
              : this.edit_item.unit_price,
            unit_price_currency: this.edit_item.unit_price_currency,
            discount: this.perKg
              ? this.edit_item.discount / 1000
              : this.edit_item.discount,
            picurl: this.edit_item.picurl,
            barcode: this.edit_item.barcode,
            stock: parseInt(stock),
            expiry_date: expiryDate,
            // ai_data_url: this.edit_item.ai_data_url,
            disabled: false,
            selling_price: this.edit_item.selling_price,
            catalog_connection: this.catalogActivated
              ? this.edit_item.catalog_connection
              : null,
          },
          product_categorization: {
            subcategory: this.subcategory,
            subsubcategory: this.subsubcategory,
            essential_item: this.essential,
          },
        };
        if (this.generated_barcode) {
          updatedObj.barcode = this.generated_barcode.toString();
        }
        const updatedRes = await this.updateInventoryItem(updatedObj);
        if (updatedRes !== undefined) {
          // REMOVE ITEM FROM OLD CATEGORY HERE
          let oldCategoryNumber;
          const index = this.categoryList.findIndex((category) =>
            category.item_ids.includes(this.edit_item.item_id)
          );
          if (index !== -1) {
            oldCategoryNumber = this.categoryList[index].category_number;
            const removeData = {
              shopID,
              category_number: oldCategoryNumber,
              inventory_item_id: this.edit_item.item_id,
            };
            const removeResponse = await this.removeInventoryItemFromCategory(
              removeData
            );
            if (removeResponse !== undefined) {
              const addData = {
                shopID,
                category_number: this.currentCategory.category_number,
                inventory_item_id: this.edit_item.item_id,
              };
              const addResponse = await this.addInventoryItemToCategory(
                addData
              );
              // this.$store.commit('updateInventory', [this.edit_item.item_id, this.inventory_id])
              // eslint-disable-next-line no-console
              console.log(addResponse);
              this.toaster_text = "Item updated successfully";
              this.reset();
              setTimeout(() => {
                this.toaster_text = null;
              }, 2000);
            } else {
              alert(
                "Failed to remove item from old category! Check logs for more info."
              );
            }
          } else {
            // eslint-disable-next-line no-console
            console.error("Item not present in any category");
          }
        } else {
          alert("Failed to update item! Check logs for more info.");
          this.open_cam = false;
        }
      } else {
        if (!this.allowAddInventory) {
          this.UpdateSpinner = false;
          alert("Bad Permissions!");
          return;
        }
        // edit_item.selling_price edit_item.discount edit_item.unit_price edit_item.units edit_item.quantity edit_item.name edit_item.brand currentCategory
        const shopID = this.auth.shop_id;
        if (typeof this.edit_item.stock !== "undefined") {
          if (this.edit_item.stock.length < 1) {
            this.edit_item.stock = -1;
          }
        }
        const finalI = {};
        finalI.product_data = { ...this.edit_item };
        finalI.product_data.quantity = this.perKg ? 1 : this.edit_item.quantity;
        finalI.product_data.units = this.perKg ? "GRAM" : this.edit_item.units;
        finalI.product_data.unit_price = this.perKg
          ? this.edit_item.unit_price / 1000
          : this.edit_item.unit_price;
        finalI.product_data.discount = this.perKg
          ? this.edit_item.discount / 1000
          : this.edit_item.discount;
        finalI.product_categorization = {
          subcategory: this.subcategory,
          subsubcategory: this.subsubcategory,
          essential_item: this.essential,
        };
        const addedItem = await this.addInventoryItem(finalI);
        const thiz = this;
        if (addedItem !== undefined) {
          thiz.$store.commit("itemToCarry", addedItem.product_data);
          const itemJson = {};
          itemJson.item_details = addedItem.product_data;
          itemJson.item_classification = addedItem.product_categorization;
          thiz.categoryItems.push(itemJson);
          thiz.$store.commit("updateInventory", [
            addedItem.item_id,
            thiz.currentCategory.category_number - 1,
          ]);
          thiz.reset();
          const data = {
            shopID,
            category_number: thiz.currentCategory.category_number,
            inventory_item_id: addedItem.item_id,
          };
          currentCategory.item_ids = [
            ...currentCategory.item_ids,
            addedItem.item_id,
          ];
          const d = thiz.currentCategory;
          await thiz.addInventoryItemToCategory(data);
          await thiz.getItemsFromCategory(d);
          this.$emit("Back", false);
          thiz.toaster_text = "Item added successfully";
          setTimeout(() => {
            thiz.toaster_text = null;
          }, 2000);
        } else {
          alert("Failed to add item to inventory! Check logs for more info.");
          thiz.open_cam = false;
        }
      }
      this.UpdateSpinner = false;
      this.BarGunFromCatalog = false;
      this.show_addItem = false;
      if (this.localSearchMode) {
        this.localSearchMode = false;
        this.open_category = false;
        this.scanned_result = false;
      }
    },
    reset() {
      this.UpdateSpinner = false;
      this.generated_barcode = "";
      this.barcode_trigger = false;
      this.open_cam = false; // categoryItems
      this.open_category = true;
      this.clicked_img = null;
      setTimeout(async () => {
        await this.getItemsFromCategory(this.currentCategory);
      }, 2000);
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
        // ai_data_url: '',
        disabled: false,
        selling_price: 0,
      };
      this.subcategory = "";
      this.subsubcategory = "";
      this.essential = false;
    },
    endAddItem() {
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
        // ai_data_url: '',
        disabled: false,
        selling_price: 0,
      };
      this.show_addItem = false;
      this.barcode_trigger = false;
      this.open_cam = false;
      this.clicked_img = "";
      this.generated_barcode = "";
    },
    async add_items_to_cart() {
      if (this.catalogActivated) {
        this.addNewInventoryItem();
        this.getItemsFromCategory(this.currentCategory);
        this.catalogActivated = false;
      } else {
        this.UpdateSpinner = true;
        const shopID = this.auth.shop_id;
        // this.edit_item.picurl = this.clicked_img
        const finalI = {};
        finalI.product_data = { ...this.edit_item };
        finalI.product_categorization = {
          subcategory: this.subcategory,
          subsubcategory: this.subsubcategory,
          essential_item: this.essential,
        };
        const newItem = await this.addInventoryItem(finalI);
        if (newItem !== undefined) {
          const categoryData = {
            shopID,
            category_number: this.currentCategory.category_number,
            inventory_item_id: newItem[0].item_id,
          };
          await this.addInventoryItemToCategory(categoryData);
          this.clicked_img = "";
          newItem[0].qty = newItem[0].quantity;
          newItem[0].quantity = 1;
          this.$emit("addedRareItem", newItem[0]);
          this.$store.commit("clearEditItemBoolean");
        } else {
          alert("Failed to add item to inventory! Check logs for more info.");
        }
        this.UpdateSpinner = false;
      }
    },
    async generateBarcode() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/generateBarcode?shopID=${this.auth.shop_id}&employeeID=${this.auth.employee_id}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        this.barcodeGenerate = response.data;
        this.edit_item.barcode = response.data.barcode;
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async dwnldBarcode(id) {
      if (!id) {
        await this.generateBarcode();
        const link = this.imageSource(this.barcodeGenerate.barcode_link);
        console.log(link);
        const a = document.createElement("a");
        a.href = link;
        a.target = "_blank";
        a.click();
        return;
      }
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/getGeneratedBarcodeForItem?item_id=${id}&shopID=${this.auth.shop_id}&employeeID=${this.auth.employee_id}`,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          progress: false,
        });
        if (response.data.barcode_link) {
          const link = this.imageSource(response.data.barcode_link);
          const a = document.createElement("a");
          a.href = link;
          a.target = "_blank";
          a.click();
        } else {
          alert("Barcode not found");
        }
      } catch (error) {
        console.log(error);
        return undefined;
      }
    },
    async addInventoryItem(invItem) {
      let response = null;
      let url;
      if (invItem.product_data.barcode.length) {
        const invItem2 = { ...invItem };
        invItem = {};
        invItem.item_data = {
          ...invItem2,
        };
        if (Object.keys(this.barcodeGenerate).length) {
          invItem.barcode_data = {
            use_auto_generated_barcode: true,
            barcode_image_link: this.barcodeGenerate.barcode_link,
            barcode_count: this.barcodeGenerate.barcode_count,
          };
        }
        // invItem.barcode_data.use_auto_generated_barcode = { ...this.barcodeGenerate }
        url = `addInventoryItemWithCategorizationAndAutoGeneratedBarcodeForBarcodeBilling?shopID=${this.auth.shop_id}&employeeID=${this.auth.employee_id}`;
      } else {
        url = `/addInventoryItemWithCategorization?employeeID=${this.auth.employee_id}`;
      }
      if (invItem.item_data && invItem.item_data.product_data) {
        invItem.item_data.product_data.stock = parseInt(
          invItem.item_data.product_data.stock
        );
      }
      if (!invItem.item_data.product_data.stock) {
        invItem.item_data.product_data.stock = -1;
      }
      try {
        response = await this.$axios({
          method: "POST",
          url,
          
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem("Credential"),
          },
          data: invItem,
          progress: false,
        });
        this.barcodeGenerate = {};
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
    async removeInventoryItemFromCategory(data) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: "/removeInventoryItemFromShopCategory",
          
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
    async imageRescale(dataURL) {
      const base64Img = dataURL.split(",")[1];
      const buffer = Buffer.from(base64Img, "base64");
      try {
        // eslint-disable-next-line no-undef
        let image = await Jimp.read(buffer);
        // eslint-disable-next-line no-undef
        image = await image.resize(Jimp.AUTO, 720);
        // eslint-disable-next-line no-undef
        const base64 = await image.getBase64Async(Jimp.AUTO);
        return base64;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        alert(
          "Some error occured while rescaling image! Check logs for more info."
        );
        return dataURL;
      }
    },
    async uploadImage(image) {
      const productImage = await this.imageRescale(image);
      const blob = await fetch(productImage).then((res) => res.blob());
      const formData = new FormData();
      formData.append("employee_phone", this.$auth.employee.phone_number);
      formData.append("shop_name", this.$auth.user.shop.shop_name);
      formData.append("uploaded_file", blob, "product.jpeg");
      const response = await this.$axios({
        method: "POST",
        url: "/uploadInventoryImage",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        data: formData,
        progress: false,
      });
      const uploadedImagePath = response.data.path;
      return uploadedImagePath;
    },
    stopCameraTracks() {
      if (this.cameraStream !== null) {
        const tracks = this.cameraStream.getTracks();
        if (tracks.length > 0) {
          tracks.forEach((track) => track.stop());
        }
      }
    },
    async cameraTrigger() {
      const cameraView = document.querySelector("#camera--view");
      const cameraSensor = document.querySelector("#camera--sensor");
      cameraSensor.width = cameraView.videoWidth;
      cameraSensor.height = cameraView.videoHeight;
      cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
      // this.clicked_img = cameraSensor.toDataURL("image/jpeg");
      this.clicked_img = null;
      this.test_image = true;
      setTimeout(() => {
        this.stopCameraTracks();
      }, 10);
      if (this.clicked_img) {
        // const uploadedFilePath = await this.uploadImage(this.clicked_img);
        // this.edit_item.picurl = uploadedFilePath;
      }
    },
    selectItem() {
      this.modelOpen = true;
    },
    hitTheCamera() {
      this.show_addItem = false;
      this.open_cam = true;
      const thiz = this;
      navigator.mediaDevices
        .getUserMedia(thiz.constraints)
        .then((stream) => {
          const cameraView = document.querySelector("#camera--view");
          const canvas = (window.canvas =
            document.querySelector("#camera--sensor"));
          canvas.width = cameraView.videoWidth;
          canvas.height = cameraView.videoHeight;
          window.stream = stream; // make stream available to browser console
          cameraView.srcObject = stream;
          thiz.cameraStream = stream;
        })
        .catch((err) => {
          thiz.cameraStream = null;
          // eslint-disable-next-line no-console
          console.log(err);
          if (
            err.name === "NotFoundError" ||
            err.name === "DevicesNotFoundError"
          ) {
            alert("Oops! No camera device found!");
            thiz.$router.push("/inventory");
          } else if (
            err.name === "NotAllowedError" ||
            err.name === "PermissionDeniedError"
          ) {
            alert("Please give camera permission!");
            thiz.$router.push("/inventory");
          }
        });
    },
    async addInventoryItemListToCategory(data) {
      let response = null;
      try {
        response = await this.$axios({
          method: "POST",
          url: `/addInventoryItemListToShopCategories?employeeID=${this.auth.employee_id}`,
          
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
    async GetCatlogFromId(id) {
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
    async barcodeGun(itemIid) {
      // const itemjson = await this.barcodeGunitemCall(code)
      // const itemIid = itemjson[0].product_id
      const item = await this.GetCatlogFromId(itemIid);
      delete item[0].unit_price_currency;
      delete item[0].category_number;
      delete item[0].created;
      delete item[0].created_by_id;
      delete item[0].last_touched;
      item.discount = 0;
      item.stock = "";
      const itemId = item[0].item_id;
      delete item[0].item_id;
      this.edit_item = { ...item[0] };
      this.edit_item.catalog_connection = itemId;
      this.edit_item.discount = 0;
      if (Object.keys(item[1]).length) {
        this.subcategory = item[1].subcategory;
        this.changeSubSub();
        this.subsubcategory = item[1].subsubcategory;
        this.essential = item[1].essential_item;
      }
      this.open_cam = true;
      this.show_addItem = true;
      this.catalogActivated = false;
      this.open_category = false;
    },
    editItem(item) {
      setTimeout(async () => {
        if (this.inventoryForCart) {
          // item.item_details.qty = item.item_details.quantity
          // item.item_details.quantity = 1
          // this.$store.commit('itemToCarry', item.item_details)
          // this.$emit('Back', false)
        } else if (this.$store.getters.edit_item_from_inventory) {
          if (
            this.$store.getters.rare_item_id ||
            this.$store.getters.rare_item_id === 0
          ) {
            item.item_details.qty = item.item_details.quantity;
            item.item_details.quantity = 1;
            item.item_details.final_price = item.item_details.unit_price;
          } else if (
            this.$store.getters.regular_item_id ||
            this.$store.getters.regular_item_id === 0
          ) {
            item.item_details.qty = item.item_details.quantity;
            item.item_details.quantity = 1;
            item.item_details.final_price = item.item_details.unit_price;
          }
          this.$store.commit("itemToCarry", item.item_details);
          this.$emit("Back", false);
        } else if (this.activateMultpleMode && this.catalogActivated) {
          this.multipleItems.includes(item)
            ? this.multipleItems.splice(this.multipleItems.indexOf(item), 1)
            : this.multipleItems.push(item);
        } else {
          if (this.catalogActivated) {
            delete item.item_details.unit_price_currency;
            delete item.item_details.category_number;
            delete item.item_details.created;
            delete item.item_details.created_by_id;
            delete item.item_details.last_touched;
            item.discount = 0;
            item.stock = "";
            const itemId = item.item_details.item_id;
            delete item.item_details.item_id;
            this.edit_item = { ...item.item_details };
            this.edit_item.catalog_connection = itemId;
            this.edit_item.discount = 0;
            if (item.item_classification.length) {
              this.subcategory = item.item_classification[0].subcategory;
              this.changeSubSub();
              this.subsubcategory = item.item_classification[0].subsubcategory;
              this.essential = item.item_classification[0].essential_item;
            }
          } else {
            if (this.localSearchMode) {
              const data = [item.item_details.item_id];
              const arr = await this.getCategoryForItem(data);
              this.currentCategory = arr[0][1];
              const cats = {
                ...this.CategoryHierarchy[this.currentCategory.category],
              };
              this.subCategoryList = Object.keys(cats);
            }
            this.edit_item = { ...item.item_details };
            if (
              item.item_details.units === "GRAM" &&
              item.item_details.quantity === 1
            ) {
              this.perKg = true;
              this.edit_item.unit_price = item.item_details.unit_price * 1000;
              this.edit_item.discount = item.item_details.discount * 1000;
            }
            // 2021-11-23T06:32:26.745Z.slice(5, 7)
            if (item.item_details.expiry_date) {
              this.expiry.month =
                this.mahina[
                  parseInt(item.item_details.expiry_date.slice(5, 7)) - 1
                ];
              this.expiry.date = parseInt(
                item.item_details.expiry_date.slice(8, 10)
              );
              this.expiry.year = item.item_details.expiry_date.slice(0, 4);
            } else {
              this.expiry = {
                date: "1",
                month: "December",
                year: 2021,
              };
            }
            if (item.item_classification.length) {
              this.subcategory = item.item_classification[0].subcategory;
              this.changeSubSub();
              this.subsubcategory = item.item_classification[0].subsubcategory;
              this.essential = item.item_classification[0].essential_item;
            }
            if (item.item_details.stock === -1) {
              this.edit_item.stock = "";
            }
            if (!this.edit_item.discount) {
              this.edit_item.discount = 0;
            }
          }
          this.open_cam = true;
          this.show_addItem = true;
        }
      }, 100);
    },
  },
};
</script>
<style scoped>
.lightMode {
  background-color: #f0f0f3;
}
.btnShadow {
  box-shadow: inset -1px -1px 1px 0 rgba(198, 198, 210, 0.8),
    inset 2px 2px 1px 0 #fff, 1px 1px 2px 0 #aeaec0, -1px -1px 2px 0 #fff;
}
.add_more {
  box-sizing: border-box;
  width: 80px;
  border-radius: 107px;
}
.addBtn {
  height: 25px;
  width: 80px;
  border-radius: 107px;
}
.addBtn > p {
  font-size: 12px;
  font-weight: 700;
  line-height: 10px;
  text-align: center;
}
.permission_card {
  height: 32px;
  width: 140px;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: 2px 2px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 18px;
  border-radius: 38px;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: 0.4s;
  transition: 0.4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 19px;
  left: 0px;
  bottom: 0px;
  -webkit-transition: 0.4s;
  transition: 0.4s;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 1px 0 #aeaec0, inset 2px 2px 1px 0 #fff;
}

input:checked + .slider {
  background-color: #ff6c34;
  box-shadow: inset -1px -1px 1px 0 #d4d4dd, inset 1px 1px 1px 0 #666;
}

input:focus + .slider {
  box-shadow: 0 0 1px #ff6c34;
  box-shadow: inset -1px -1px 1px 0 #d4d4dd, inset 1px 1px 1px 0 #666;
}

input:checked + .slider:before {
  -webkit-transform: translateX(20px);
  -ms-transform: translateX(20px);
  transform: translateX(20px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}
.item_card {
  height: auto;
  width: 296px;
  border-radius: 16px;
  background-color: #f0f0f3;
  box-shadow: 4px 4px 6px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.scan_css_box {
  position: fixed;
  padding: 12px;
  bottom: 15vh;
  border-radius: 8px;
  background: linear-gradient(134.59deg, #666 0%, #333 100%);
  box-shadow: inset -2px -2px 3px 0 #333, inset 2px 2px 3px 0 #999,
    1px 1px 6px 0 #1a1a1a, -1px -1px 4px 0 #676f7e;
}
.stockCss {
  border-radius: 80px;
  position: absolute;
  height: 32px;
  width: 32px;
  background: linear-gradient(180deg, #ffcb86 0%, #ff6c34 100%);
  box-shadow: inset -2px -2px 2px 0 #cc3a00, inset 2px 2px 2px 0 #ffaf8f,
    -2px -2px 4px 0 #ff9970, 2px 2px 4px 0 #cc3a00;
}
html {
  background-color: #f0f0f3;
}
.stock_card {
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: -4px -4px 8px 0 #fff, 4px 4px 6px 0 #aeaec0;
}
.addStock {
  border-radius: 80px;
  background-color: #f0f0f3;
  box-shadow: inset -1px -1px 1px 0 rgba(198, 198, 210, 0.8),
    inset 1px 1px 1px 0 #fff, 2px 2px 2px 0 #c6c6d2, -2px -2px 2px 0 #fff;
}
.scroller {
  height: 100%;
}
.lowOpacity {
  opacity: 0.4;
}
.lowIndex {
  z-index: -1;
}
.button {
  width: 70%;
  border-radius: 12px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(198, 198, 210, 0.8),
    inset 2px 2px 2px 0 #fff, 4px 4px 6px 0 #aeaec0, -4px -4px 6px 0 #fff;
}
.btnn {
  height: 40px;
  border-radius: 104px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 #c6c6d2, inset 2px 2px 2px 0 #fff,
    2px 2px 3px 0 #c6c6d2, -2px -2px 3px 0 #fff;
}
.bns {
  width: 28vw;
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
.circ1 {
  box-sizing: border-box;
  height: 16px;
  width: 16px;
  border: 2px solid #aeaec0;
  box-shadow: -1px -1px 2px 0 #fff, 1px 1px 2px 0 #aeaec0;
  border-radius: 100%;
}
.circ2 {
  height: 16px;
  width: 16px;
  background: linear-gradient(180deg, #ffcb86 0%, #ff6c34 100%);
  box-shadow: inset -1px -1px 1px 0 #cc3a00, inset 1px 1px 1px 0 #ffaf8f,
    -2px -2px 4px 0 #fff, 2px 2px 4px 0 #aeaec0;
  border-radius: 100%;
}
.switch2 {
  box-sizing: border-box;
  height: 32px;
  width: 32px;
  background-color: #f0f0f3;
  border: 1px solid #f0f0f3;
  box-shadow: inset 1px 1px 2px 0 #aeaec0, inset -2px -2px 3px 0 #fff;
  border-radius: 100%;
}
.tab-background {
  height: 48px;
  width: 296px;
  border-radius: 8px;
  background: linear-gradient(180deg, #666 0%, #333 100%);
  box-shadow: inset 1px 1px 4px 0 rgba(0, 0, 0, 0.5), inset 2px 2px 2px 0 #333,
    inset -2px -2px 2px 0 #666, 2px 2px 4px 0 #1a1a1a, -2px -2px 4px 0 #56595d;
}
.viewport canvas[data-v-d5581cb0],
.viewport video[data-v-d5581cb0] {
  height: 90vh;
}
.select_cam_css select {
  border-radius: 30px;
  position: fixed;
  top: 6vh;
  background: linear-gradient(134.59deg, #666 0%, #333 100%);
  box-shadow: inset -2px -2px 3px 0 #333, inset 2px 2px 3px 0 #999,
    1px 1px 6px 0 #1a1a1a, -1px -1px 4px 0 #676f7e;
  background-color: black;
  -webkit-appearance: button;
  outline: none;
}
.outer_box {
  height: 364px;
  width: 85vw;
  border-radius: 16px;
  background: linear-gradient(180deg, #666 0%, #333 100%);
  box-shadow: inset 1px 1px 4px 0 rgba(0, 0, 0, 0.5), inset 2px 2px 2px 0 #333,
    inset -2px -2px 2px 0 #666, 2px 2px 4px 0 #1a1a1a, -2px -2px 4px 0 #56595d;
}
.inner_box {
  border-radius: 8px;
  box-shadow: inset -2px -2px 3px 0 #333, inset 2px 2px 3px 0 #999,
    1px 1px 6px 0 #1a1a1a, -1px -1px 4px 0 #676f7e;
}
.img_foot {
  position: fixed;
  bottom: 0px;
  height: 10vh;
  width: 100vw;
  background-color: #e8e8ed;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
  /* -webkit-appearance: none; */
  /* -webkit-box-shadow: inset -2px -2px 2px 0 rgba(255,255,255,0.8), inset 2px 2px 2px 0 rgba(174,174,192,0.45); */
}
.barcodeBtn {
  padding: 6px;
  border-radius: 80px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 #c6c6d2, inset 2px 2px 2px 0 #fff,
    2px 2px 3px 0 #c6c6d2, -2px -2px 3px 0 #fff;
}
.toaster {
  height: 48px;
  position: fixed;
  bottom: 105px;
  width: 328px;
  border-radius: 8px;
  background: linear-gradient(91.06deg, #666 0%, #333 100%);
  box-shadow: inset 0 1px 8px 0 rgba(0, 0, 0, 0.5), inset 3px 3px 3px 0 #333,
    inset -3px -3px 3px 0 #666, 2px 2px 4px 0 #666, -2px -2px 4px 0 #fff;
}
.text12 {
  color: #666;
  font-family: Arial, Helvetica, sans-serif;
  font-size: 14px;
  font-weight: 700;
  line-height: 14px;
}
.btns {
  height: 40px;
  width: 92px;
  border-radius: 24px;
  background-color: #f0f0f3;
  box-shadow: inset -1px -1px 1px 0 rgba(198, 198, 210, 0.8),
    inset 1px 2px 1px 0 #fff, 4px 4px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
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
.select_box {
  height: 32px;
  width: 100%;
  border: 0;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: 2px 2px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.select_box1 {
  height: 32px;
  width: 100%;
  border: 0;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 rgba(255, 255, 255, 0.8),
    inset 2px 2px 2px 0 rgba(174, 174, 192, 0.45);
}
.inventory_item {
  height: 140px;
  width: 140px;
  border-radius: 16px;
  background-color: #f0f0f3;
  box-shadow: 6px 6px 10px 0 #c6c6d2, -6px -6px 8px 0 #fff;
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
.form-control {
  height: 11px;
}
.input {
  border-radius: 16px;
  background-color: #f0f0f3;
  height: 20px;
  border: 0;
}
.form-control.focus {
  background-color: #f0f0f3;
}
.focus:focus {
  outline: -webkit-focus-ring-color auto 0px;
}
.inventory_box {
  width: 80vw;
  height: 120px;
  border-radius: 16px;
  background-color: #f0f0f3;
  box-shadow: 4px 4px 6px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
#camera,
#camera--view,
#camera--sensor,
#camera--output {
  border: 0px;
  position: absolute;
  height: 95vh;
  margin-left: -4vw;
  width: 100vw;
  object-fit: cover;
}

#camera--view,
#camera--sensor,
#camera--output {
  border: 0px;
}
#camera,
#Aicamera--view,
#Aicamera--sensor,
#camera--output {
  border: 0px;
  position: absolute;
  height: 95vh;
  margin-left: -4vw;
  width: 100vw;
  object-fit: cover;
}

#Aicamera--view,
#Aicamera--sensor,
#camera--output {
  border: 0px;
}
.invisi {
  visibility: hidden;
}
#camera--trigger {
  width: 200px;
  background-color: black;
  color: white;
  font-size: 16px;
  border-radius: 30px;
  border: none;
  padding: 15px 20px;
  text-align: center;
  box-shadow: 0 5px 10px 0 rgba(0, 0, 0, 0.2);
  position: fixed;
  bottom: 30px;
  left: calc(50% - 100px);
}
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
  width: 40%;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset 2px 2px 2px 0 rgba(198, 198, 210, 0.8),
    inset -2px -2px 2px 0 #fff;
}
.outside_box {
  height: 40px;
  width: 40%;
  color: #4f4f4f;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: 4px 4px 4px 0 #c6c6d2, -4px -4px 4px 0 rgba(255, 255, 255, 0.8);
}
.inps {
  width: 70vw;
}

@media (min-width: 1000px) {
  .wid {
    width: 75vw !important;
    justify-content: flex-start !important;
  }
  .wid1 {
    width: 75vw !important;
    margin-left: auto !important;
    margin-right: auto !important;
  }
  .mar {
    margin: 1rem !important;
  }
  .inventory_box {
    width: 75vw !important;
  }
  .img1 {
    width: 7.5vw !important;
  }
  .img2 {
    width: 7.5vw !important;
  }
  .wid9 {
    width: 100% !important;
  }
  .just {
    justify-content: center !important;
    width: 20rem !important;
  }
  .txt {
    width: 100% !important;
    text-align: center !important;
  }
  .txt1 {
    width: 90% !important;
  }
  .mar {
    margin-top: 1rem !important;
  }
  .bns {
    width: 12vw !important;
  }
  .inps {
    width: 20vw;
  }
}
</style>
