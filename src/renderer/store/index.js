export const state = () => {
  return {
    edit_item_from_inventory: false,
    cart_item: null,
    add_new_item: null,
    item_to_be_added_in_cart: null,
    phone_number: null,
    rare_item_id: null,
    regular_item_id: null,
    shortCutToBarcodeGun: false,
    ekBaarHoGyaAi: false,
    rare_item_json: null,
    imageForAi: null,
    itemToCarry: null,
    userInfo: null,
    AiType: "",
    searchFromCatalog: false,
    TravellerCatalogItem: null,
    otpVerifiedInfo: {},
    inventoryData: null,
    shopInventory: null,
    EnterToNumber: [],
    currVisit: {},
    cartAlpha: [],
    toggle: false,
    modeOff: false,
    roundOff: false,
    delInvoice: false,
    compress: false,
    storeData: null,
    Credential: null,
    estimate: true,
  };
};

export const actions = {
  set_auth_cookies(context, data) {
    this.$cookies.set("vendor_auth_token", data, {
      path: "/",
      maxAge: 60 * 60 * 24 * 10,
    });
  },
  setVisit({ commit }, payload) {
    commit("SET_VISIT", payload);
  },
  set_employee_cookies(context, data) {
    this.$cookies.set("employee_data", data, {
      path: "/",
      maxAge: 60 * 60 * 24 * 10,
    });
  },
  setShopInventory({ commit }, payload) {
    commit("SET_SHOP_INVENTORY", payload);
  },
  setOTPVerifiedInfo({ commit }, payload) {
    commit("SET_OTP_VERIFIED_INFO", payload);
  },
};

export const mutations = {
  Credential(state, context) {
    state.Credential = context;
  },
  storeData(state, context) {
    state.storeData = context;
  },
  shortCutToBarcodeGun(state, context) {
    state.shortCutToBarcodeGun = context;
  },
  per(state, context) {
    state.cartAlpha[context[0]].percent = context[1]
  },
  SET_OTP_VERIFIED_INFO(state, payload) {
    state.otpVerifiedInfo = payload;
  },
  TravellerCatalogItem(state, context) {
    state.TravellerCatalogItem = context;
  },
  searchFromCatalog(state, context) {
    state.searchFromCatalog = context;
  },
  AiType(state, context) {
    state.AiType = context;
  },
  SET_VISIT(state, context) {
    state.currVisit = context;
  },
  StoreuserInfo(state, arg) {
    state.userInfo = arg;
  },
  toggle(state, arg) {
    state.toggle = arg;
  },
  modeOff(state, arg) {
    state.modeOff = arg;
  },
  roundOff(state, arg) {
    state.roundOff = arg;
  },
  compress(state, arg) {
    state.compress = arg;
  },
  estimate(state, arg) {
    state.estimate = arg;
  },
  SET_SHOP_INVENTORY(state, payload) {
    state.shopInventory = payload;
  },
  edit_items(state, arg) {
    state.edit_item_from_inventory = true;
    if (arg[0] === "rare") {
      state.rare_item_id = arg[1];
    } else if (arg[0] === "regular") {
      state.regular_item_id = arg[1];
    }
  },
  imageForAi(state, context) {
    state.imageForAi = context;
  },
  add_items(state, arg) {
    state.add_new_item = true;
    state.edit_item_from_inventory = true;
    state.rare_item_id = arg.id;
    state.rare_item_json = arg.item_json;
  },
  add_phone_num(state, phoneNum) {
    state.phone_number = phoneNum;
  },
  delInvoice(state, arg) {
    state.delInvoice = arg;
  },
  cart_item(state, items) {
    state.cart_item = items;
  },
  renew_item_section(state) {
    state.add_new_item = false;
  },
  inventoryData(state, args) {
    state.inventoryData = args;
  },
  updateInventory(state, args) {
    state.inventoryData[0].inventory_json.inventory_items[
      args[1]
    ].item_ids.unshift(args[0]);
  },
  itemToCarry(state, arg) {
    state.itemToCarry = arg;
  },
  reset_id(state) {
    state.rare_item_id = null;
    state.regular_item_id = null;
  },
  edit_cart(state, payload) {
    if (state.cartAlpha.length > 0) {
      const idx = payload[0]
      const discount = payload[1]
      state.cartAlpha[idx].final_chosen.discount = discount
    }
  },
  addToCartAlpha(state, payload) {
    if (state.cartAlpha.length > 0) {
      if (payload.final_chosen.item_id) {
        const id = state.cartAlpha.findIndex(
          (item) => item.final_chosen.item_id === payload.final_chosen.item_id
        );
        if (
          id !== -1 &&
          !payload.final_chosen.giftItem &&
          !state.cartAlpha[id].final_chosen.giftItem
        ) {
          state.cartAlpha[id].final_chosen.quantity +=
            payload.final_chosen.quantity;
          state.cartAlpha[id].final_chosen.final_price +=
            payload.final_chosen.final_price;
        } else {
          state.cartAlpha.unshift(payload);
        }
      } else {
        state.cartAlpha.unshift(payload);
      }
    } else {
      state.cartAlpha.unshift(payload);
    }
    state.readyToCheckout = false;
  },
  CLEAR_CART(state) {
    state.cartAlpha = [];
  },
  minusItem(state, context) {
    state.cartAlpha.map((item) => {
      if (item === context) {
        // eslint-disable-next-line no-unused-expressions
        item.final_chosen.quantity >= 0 ? item.final_chosen.quantity-- : null;
      }
    });
  },
  plusItem(state, context) {
    state.cartAlpha.map((item) => {
      if (item === context) {
        // eslint-disable-next-line no-unused-expressions
        item.final_chosen.quantity >= 0 ? item.final_chosen.quantity++ : null;
      }
    });
  },
  changeItemCount(state, context) {
    const idx = state.cartAlpha.findIndex(
      (item) => item.final_chosen.item_id === context[1]
    );
    if (state.cartAlpha) {
      if (context[0] === "minus") {
        if (state.cartAlpha[idx].final_chosen.quantity === 1) {
          state.cartAlpha.splice(idx, 1);
        } else if (state.cartAlpha[idx].final_chosen.quantity > 1) {
          state.cartAlpha[idx].final_chosen.quantity =
            state.cartAlpha[idx].final_chosen.quantity - 1;
          state.cartAlpha[idx].final_chosen.final_price =
            state.cartAlpha[idx].final_chosen.quantity *
            state.cartAlpha[idx].final_chosen.unit_price;
        }
      } else {
        state.cartAlpha[idx].final_chosen.quantity += 1;
        state.cartAlpha[idx].final_chosen.final_price =
          state.cartAlpha[idx].final_chosen.quantity *
          state.cartAlpha[idx].final_chosen.unit_price;
      }
    }
  },
  changePriceWithInput(state, context) {
    context[2] = parseFloat(context[2]);
    const idx = state.cartAlpha.findIndex(
      (item) => item.final_chosen.item_id === context[1]
    );
    if (state.cartAlpha) {
      let diff;
      if (!isNaN(context[2])) {
        diff = state.cartAlpha[idx].final_chosen.unit_price - context[2] / 1000;
      } else {
        diff =
          state.cartAlpha[idx].final_chosen.unit_price -
          state.cartAlpha[idx].final_chosen.discount;
      }
      const final = parseFloat(parseInt(context[0]) / diff);
      state.cartAlpha[idx].final_chosen.quantity = final.toFixed(2);
      state.cartAlpha[idx].final_chosen.final_price = parseInt(context[0]);
    }
  },
  changeItemCountWithInput(state, context) {
    context[2] = parseFloat(context[2]);
    const idx = state.cartAlpha.findIndex(
      (item) => item.final_chosen.item_id === context[1]
    );
    if (state.cartAlpha) {
      state.cartAlpha[idx].final_chosen.quantity = parseInt(context[0]);
      if (!isNaN(context[2])) {
        state.cartAlpha[idx].final_chosen.final_price =
          state.cartAlpha[idx].final_chosen.quantity *
            state.cartAlpha[idx].final_chosen.unit_price -
          (context[2] / 1000) * state.cartAlpha[idx].final_chosen.quantity;
      } else {
        state.cartAlpha[idx].final_chosen.final_price =
          state.cartAlpha[idx].final_chosen.quantity *
            state.cartAlpha[idx].final_chosen.unit_price -
          state.cartAlpha[idx].final_chosen.discount *
            state.cartAlpha[idx].final_chosen.quantity;
      }
    }
  },
  changeItemDiscount(state, context) {
    const idx = state.cartAlpha.findIndex(
      (item) => item.final_chosen.item_id === context[0]
    );
    state.cartAlpha[idx].final_chosen.discount = context[1];
  },
  changeDiscountPriceFnForSabjiItems(state, context) {
    const idx = state.cartAlpha.findIndex(
      (item) => item.final_chosen.item_id === context[0]
    );
    state.cartAlpha[idx].final_chosen.discount = context[1] / 1000;
  },
  changeItemPrice(state, context) {
    const idx = state.cartAlpha.findIndex(
      (item) => item.final_chosen.item_id === context[0]
    );
    state.cartAlpha[idx].final_chosen.unit_price = context[1];
    // const delta = state.cartAlpha[idx].final_chosen.unit_price - context[1]
    // delta > 0 ? state.cartAlpha[idx].final_chosen.discount = delta : state.cartAlpha[idx].final_chosen.unit_price -= delta
    // if (delta < 0) {
    //   state.cartAlpha[idx].final_chosen.discount = 0
    // }
    // state.cartAlpha[idx].final_chosen.discount = 0
    // state.cartAlpha[idx].final_chosen.checked = true
    // state.cartAlpha[idx].final_chosen.unit_price = context[1]
  },
  updateCart(state, data) {
    state.cartAlpha = data;
  },
  ekBaarHoGyaAi(state) {
    state.ekBaarHoGyaAi = true;
  },
  removeItemFromCart(state, context) {
    const index = state.cartAlpha.findIndex(
      (cartItem) =>
        cartItem.final_chosen.item_id === context.item_details.item_id
    );
    state.cartAlpha.splice(index, 1);
  },
  removeItemFromCart2(state, context) {
    const index = state.cartAlpha.findIndex(
      (cartItem) => cartItem.final_chosen.item_id === context.item_id
    );
    state.cartAlpha.splice(index, 1);
  },
  clearEditItemBoolean(state) {
    state.edit_item_from_inventory = false;
    state.rare_item_json = null;
  },
  EnterToNumber(state, arg) {
    state.EnterToNumber = arg;
  },
};

export const getters = {
  Credential(state) {
    return state.Credential
  },
  storeData(state) {
    return state.storeData
  },
  shortCutToBarcodeGun(state) {
    return state.shortCutToBarcodeGun;
  },
  estimate(state) {
    return state.estimate;
  },
  compress(state) {
    return state.compress;
  },
  modeOff(state) {
    return state.modeOff;
  },
  roundOff(state) {
    return state.roundOff;
  },
  toggle(state) {
    return state.toggle;
  },
  searchFromCatalog(state) {
    return state.searchFromCatalog;
  },
  TravellerCatalogItem(state) {
    return state.TravellerCatalogItem;
  },
  AiType(state) {
    return state.AiType;
  },
  userInfo(state) {
    return state.userInfo;
  },
  ekBaarHoGyaAi(state) {
    return state.ekBaarHoGyaAi;
  },
  EnterToNumber(state) {
    return state.EnterToNumber;
  },
  imageForAi(state) {
    return state.imageForAi;
  },
  inventoryData(state) {
    return state.inventoryData;
  },
  itemToCarry(state) {
    return state.itemToCarry;
  },
  visitObj(state) {
    return state.currVisit;
  },
  rare_item_json(state) {
    return state.rare_item_json;
  },
  rare_item_id(state) {
    return state.rare_item_id;
  },
  add_new_item(state) {
    return state.add_new_item;
  },
  cart_item(state) {
    return state.cart_item;
  },
  edit_item_from_inventory(state) {
    return state.edit_item_from_inventory;
  },
  regular_item_id(state) {
    return state.regular_item_id;
  },
  item_to_be_added_in_cart(state) {
    return state.item_to_be_added_in_cart;
  },
  cartItems(state) {
    // return state.cart
    return state.cartAlpha;
  },
  inventoryObj(state) {
    return state.shopInventory;
  },
  phone_number(state) {
    return state.phone_number;
  },
  delInvoice(state) {
    return state.delInvoice;
  },
};
