<template>
  <div class="full" style="background-color: #f0f0f3; min-height: 100vh">
    <div class="scroll">
      <div
        style="
          position: fixed;
          top: 0;
          height: 18vh;
          width: 100vw;
          background: linear-gradient(180deg, #b5dcf6 0%, #d2e9f9 100%);
          box-shadow: 0 1px 2px 0 rgba(92, 165, 214, 0.8);
        "
      >
        <div class="d-flex justify-content-center mb-1">
          <div
            style="width: 90vw"
            class="d-flex justify-content-start pt-4 pb-4"
          >
            <div class="d-flex justify-content-center align-items-center">
              <div
                class="d-flex justify-content-center align-items-center"
                style="
                  padding: 6px;
                  border-radius: 70px;
                  background-color: rgb(6, 228, 62);
                  box-shadow: inset 2px 2px 2px 0 rgba(198, 198, 210, 0.8),
                    inset -2px -2px 2px 0 #fff, 1px 1px 2px 0 #c6c6d2,
                    -1px -1px 2px 0 #fff;
                "
              >
                <img
                  alt="pic"
                  src="../static/shop.jpg"
                  width="60"
                  height="60"
                  style="border-radius: 50%;"
                />
              </div>
            </div>
            <div style="width: 90%" class="d-flex ml-5 mt-2 justify-content-start">
              <div class="">
                <p class="mb font-weight-bold text_four">
                  {{ employeeProfile ? employeeProfile.employee_name : "" }}
                </p>
                <p class="mb text_three">
                  {{ employeeProfile ? employeeProfile.phone_number : "" }}
                </p>
                <p class="mb text_three">
                  {{ employeeProfile ? employeeProfile.shop_name : "" }}
                </p>
              </div>
            </div>
            <div class="pt-4">
              <img
                alt="pic"
                src="../static/logout.png"
                width="25"
                height="25"
                style="cursor: pointer"
                @click="logout()"
              />
            </div>
          </div>
        </div>
      </div>
      <div
        class="d-flex align-items-center pt-4 pb-4"
        style="margin-top: 21vh"
        @click="$router.push('barCodeGun')"
      >
        <div class="d-flex flex-grow-1">
          <div class="d-flex justify-content-end" style="width: 9vw">
            <div class="d-flex align-items-center justify-content-center">
              <img alt="pic" src="../static/icons/vender/Invoice.svg" />
            </div>
          </div>
          <div class="flex-grow-1 pl-4">
            <p class="mb font-weight-bold text_grey-3 text_three">
              Barcode Billing
            </p>
            <p class="mb small_text text_grey-3">Scan product and bill</p>
          </div>
        </div>
        <div class="pr-3">
          <img
            alt="pic"
            id="GoInvoice"
            src="../static/icons/next_white.webp"
          />
        </div>
      </div>
      <div class="d-flex align-items-center pt-4 pb-4">
        <div class="d-flex flex-grow-1">
          <div class="d-flex justify-content-end"  style="width: 9vw">
            <div class="d-flex align-items-center justify-content-center">
              <img alt="pic" src="../static/icons/vender/Invoice.svg" />
            </div>
          </div>
          <div class="flex-grow-1 pl-4" @click="GoInvoice()">
            <p class="mb font-weight-bold text_grey-3 text_three">Invoice</p>
            <p class="mb small_text text_grey-3">
              All Invoices, OogaPay Summary &amp; <br />
              Order History
            </p>
          </div>
        </div>
        <div class="pr-3">
          <img
            alt="pic"
            id="GoInvoice"
            src="../static/icons/next_white.webp"
          />
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <img alt="pic" src="../static/icons/Path 2.webp" />
      </div>
      <div class="d-flex align-items-center pt-4 pb-4">
        <div class="d-flex flex-grow-1">
          <div class="d-flex justify-content-end"  style="width: 9vw">
            <div class="d-flex align-items-center justify-content-center">
              <img alt="pic" src="../static/icons/vender/Inventory.svg" />
            </div>
          </div>
          <div class="flex-grow-1 pl-4" @click="GoInventory()">
            <p class="mb font-weight-bold text_grey-3 text_three">Inventory</p>
            <p class="mb small_text text_grey-3">Manage store inventory</p>
          </div>
        </div>
        <div class="pr-3">
          <img
            alt="pic"
            id="GoInventory"
            src="../static/icons/next_white.webp"
          />
        </div>
      </div>
      <div class="d-flex justify-content-center">
        <img alt="pic" src="../static/icons/Path 2.webp" />
      </div>
      <!-- <div class="d-flex align-items-center pt-4 pb-4">
        <div class="d-flex flex-grow-1">
          <div class="d-flex justify-content-end"  style="width: 9vw">
            <div class="d-flex align-items-center justify-content-center">
              <img alt="pic" src="../static/icons/vender/Inventory.svg" />
            </div>
          </div>
          <div class="flex-grow-1 pl-4" @click="GoHSN()">
            <p class="mb font-weight-bold text_grey-3 text_three">
              Item details using barcode Gun
            </p>
            <p class="mb small_text text_grey-3">Fill/Edit item Details</p>
          </div>
        </div>
        <div class="pr-3">
          <img
            alt="pic"
            id="GoInventory"
            src="../static/icons/next_white.webp"
          />
        </div>
      </div> -->
      <div class="d-flex justify-content-center">
        <img alt="pic" src="../static/icons/Path 2.webp" />
      </div>
      <div class="d-flex align-items-center pt-4 pb-4">
        <div class="d-flex flex-grow-1">
          <div class="d-flex justify-content-end"  style="width: 9vw">
            <div class="d-flex align-items-center justify-content-center">
              <img alt="pic" src="../static/icons/vender/Inventory.svg" />
            </div>
          </div>
          <div class="flex-grow-1 pl-4" @click="GoBill()">
            <p class="mb font-weight-bold text_grey-3 text_three">
              Bills On Hold
            </p>
            <p class="mb small_text text_grey-3">Continue the bills</p>
          </div>
        </div>
        <div class="pr-3">
          <img
            alt="pic"
            id="GoInventory"
            src="../static/icons/next_white.webp"
          />
        </div>
      </div>
      <!-- <div v-if="employeeProfile.permission_view_staff" class="d-flex justify-content-center">
        <img alt="pic" src="../static/icons/Path 2.png" />
      </div> -->
      <!-- <div v-if="employeeProfile.permission_allow_oogapay" class="d-flex align-items-center pt-4 pb-4" @click="GoOogaPay()">
        <div class="d-flex flex-grow-1">
          <div class="d-flex justify-content-end" style="width: 20vw;">
            <div class="d-flex align-items-center justify-content-center">
              <img alt="pic" src="../static/icons/vender/Oogapay.svg" />
            </div>
          </div>
          <div class="flex-grow-1 pl-4">
            <p class="mb font-weight-bold text_grey-3 text_three">
              OogaPay
            </p>
            <p class="mb small_text text_grey-3">
              Verify Customers and Enable OogaPay
            </p>
          </div>
        </div>
        <div class="pr-3">
          <img alt="pic" id="oogaPay" src="../static/icons/next_white.png" />
        </div>
      </div> -->
      <div 
      id="modal-sm"
          @click="popUp($event)"
       class="modal" v-if="settings" >
        <div class="modal-content">
          <p class="text-center">Settings</p>
          <div style="width:80vw;" class="permission_card d-flex align-items-center pt-2 mt-4">
            <label class="switch ml-2 float-left" @click="stopProp($event)">
              <input v-model="mode" type="checkbox" @change="loc1($event)">
              <span class="slider round" />
            </label>
            <p class="float-right pt-2 text_grey-3 pl-3">
              Payment Mode Off
            </p>
          </div>
          <div style="width:80vw;" class="permission_card d-flex align-items-center pt-2 mt-4">
            <label class="switch ml-2 float-left" @click="stopProp($event)">
              <input v-model="round" type="checkbox" @change="loc2($event)">
              <span class="slider round" />
            </label>
            <p class="float-right pt-2 text_grey-3 pl-3">
              Round Off
            </p>
          </div>
          <div style="width:80vw;" class="permission_card d-flex align-items-center pt-2 mt-4">
            <label class="switch ml-2 float-left" @click="stopProp($event)">
              <input v-model="estimate" type="checkbox" @change="loc4($event)">
              <span class="slider round" />
            </label>
            <p class="float-right pt-2 text_grey-3 pl-3">
              Estimate Off
            </p>
          </div>
          <div style="width:80vw;" class="permission_card d-flex align-items-center pt-2 mt-4">
            <label class="switch ml-2 float-left" @click="stopProp($event)">
              <input v-model="compress" type="checkbox" @change="loc3($event)">
              <span class="slider round" />
            </label>
            <p class="float-right pt-2 text_grey-3 pl-3">
              Compressed View
            </p>
          </div>
        </div>
      </div>
      <div class="d-flex justify-content-end mt-5 mr-3">
        <img id="settingIcon" alt="pic" src="../static/RoundShape.webp" style="width: 3%;" @click="openSetting()" />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      profile: {
        name: "Nitesh",
        phone_number: "+9188114477629",
        email: "dummy@gmail.com",
      },
      auth: null,
      employeeProfile: {},
      settings: false,
      mode: false,
      round: false,
      compress: false,
      estimate: true,
      shopDetails: {},
    };
  },
  async mounted() {
    this.auth = JSON.parse(localStorage.getItem('storeData'));
    // navigator.mediaDevices.getUserMedia({ audio: false, video: { facingMode: 'environment' } })
    //   .then((stream) => {
    //     stream.getTracks().forEach(track => track.stop())
    //     // eslint-disable-next-line no-console
    //     console.log('permission granted')
    //   })
    // const employeeFromAPI = this.$auth.user.employee
    this.employeeProfile = this.auth;
    // const shopDetails = this.$auth.user.shop
    // this.shopDetails = shopDetails
    this.mode = localStorage.getItem('mode') === 'true'
    this.round = localStorage.getItem('roundOff') === 'true'
    this.compress = localStorage.getItem('compress') === 'true'
    this.estimate = localStorage.getItem('estimate') === 'true'
    const thiz = this;
    thiz.shortCutTrigger = function (evt) {
      const evtobj = window.event ? event : evt
      if (evtobj.keyCode === 90 && evtobj.ctrlKey) {
        thiz.$router.push('/barCodeGun');
      }
      if (evtobj.keyCode === 66) {
        thiz.$store.commit('shortCutToBarcodeGun', true);
        thiz.$router.push('/barCodeGun');
      }
    }
    document.addEventListener('keydown', thiz.shortCutTrigger);
    // const inventory = await this.getShopInventory(shopDetails.shop_id)
    // const shopInventory = {
    //   shop: shopDetails,
    //   inventory
    // }
    // this.$store.dispatch('setShopInventory', shopInventory)
  },
  destroyed() {
    document.removeEventListener("keydown", this.shortCutTrigger);
  },
  methods: {
    stopProp (e) {
      e.stopPropagation();
    },
    popUp () {
      document.querySelector('#settingIcon').style.transform = 'rotate(0deg)'
      document.querySelector('#settingIcon').style.transitionTimingFunction = 'ease-in-out'
      document.querySelector('#settingIcon').style.transition = 'transform 800ms'
      setTimeout(() => {
        this.settings = false
      }, 700)
    },
    loc1 (e) {
      e.stopPropagation();
      if (!this.mode) {
        localStorage.setItem('mode', false)
      } else {
        localStorage.setItem('mode', true)
      }
    },
    loc2 (e) {
      e.stopPropagation();
      if (!this.round) {
        localStorage.setItem('roundOff', false)
      } else {
        localStorage.setItem('roundOff', true)
      }
    },
    loc3 (e) {
      e.stopPropagation();
      if (!this.compress) {
        localStorage.setItem('compress', false)
      } else {
        localStorage.setItem('compress', true)
      }
    },
    loc4 (e) {
      e.stopPropagation();
      if (!this.estimate) {
        localStorage.setItem('estimate', false)
      } else {
        localStorage.setItem('estimate', true)
      }
    },
    openSetting () {
      document.querySelector('#settingIcon').style.transform = 'rotate(130deg)'
      document.querySelector('#settingIcon').style.transitionTimingFunction = 'ease-in-out'
      document.querySelector('#settingIcon').style.transition = 'transform 800ms'
      setTimeout(() => {
        this.settings = true
      }, 600)
    },
    logout () {
      localStorage.removeItem('Credential');
      this.$router.push('/')
    },
    GoDash() {
      document.querySelector("#GoInvoice").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoInvoice").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoInvoice").style.willChange = "transform";
        this.$router.push("/dashboard");
      }, 100);
    },
    GoHSN() {
      document.querySelector("#GoInvoice").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoInvoice").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoInvoice").style.willChange = "transform";
        this.$router.push("/hsn");
      }, 100);
    },
    GoBill() {
      document.querySelector("#GoInvoice").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoInvoice").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoInvoice").style.willChange = "transform";
        this.$router.push("/holdedBills");
      }, 100);
    },
    GoInvoice() {
      document.querySelector("#GoInvoice").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoInvoice").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoInvoice").style.willChange = "transform";
        this.$router.push("/invoice");
      }, 100);
    },
    GoConsumerOrder() {
      document.querySelector("#GoConsumerOrder").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoConsumerOrder").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoConsumerOrder").style.willChange =
          "transform";
        this.$router.push("/customer_billing");
      }, 100);
    },
    GoLive() {
      document.querySelector("#GoLive").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoLive").style.transform = "translateX(20vw)";
        document.querySelector("#GoLive").style.willChange = "transform";
        this.$router.push("/liveOrder");
      }, 100);
    },
    GoInventory() {
      document.querySelector("#GoInventory").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoInventory").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoInventory").style.willChange = "transform";
        this.$router.push("/inventory");
      }, 100);
    },
    GoManager() {
      document.querySelector("#GoManager").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoManager").style.transform =
          "translateX(20vw)";
        document.querySelector("#GoManager").style.willChange = "transform";
        this.$router.push("/manager");
      }, 100);
    },
    GoStaff() {
      document.querySelector("#GoStaff").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#GoStaff").style.transform = "translateX(20vw)";
        document.querySelector("#GoStaff").style.willChange = "transform";
        this.$router.push("/staff");
      }, 100);
    },
    GoOogaPay() {
      document.querySelector("#oogaPay").style.transition =
        "transform 100ms linear";
      setTimeout(() => {
        document.querySelector("#oogaPay").style.transform = "translateX(20vw)";
        document.querySelector("#oogaPay").style.willChange = "transform";
        this.$router.push("/self_checkout");
      }, 100);
    },
    async getShopInventory(shopID) {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: `/fetchInventory/${shopID}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('Credential'),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return [];
      }
    },
    async getRandomStores() {
      let response = null;
      try {
        response = await this.$axios({
          method: "GET",
          url: "/allShops",
          headers: {
            "Content-Type": "application/json",
            Authorization: localStorage.getItem('Credential'),
          },
        });
        return response.data;
      } catch (error) {
        console.log(error);
        return [];
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
  },
};
</script>

<style scoped>
  
.notif {
  background-color: #09ff00;
  height: 8vh;
  position: absolute;
  bottom: 10vh;
  border-radius: 8px;
  z-index: 10;
}
.hover_inside:hover {
  background-color: #F0F0F3;
  animation-name: btn;
  animation-duration: 0.5s;
}
@keyframes btn {
  0%{
    box-shadow: inset 2px 2px 2px 0 rgba(198,198,210,0.8), inset -2px -2px 2px 0 #FFF;
  }
}
#topBottomAnimation {
  transform: translateY(-5vh);
}
#swipee2 {
  transform: translateX(-100vw);
}
.btnn {
  height: 40px;
  border-radius: 104px;
  background-color: #F0F0F3;
  box-shadow: inset -2px -2px 2px 0 #C6C6D2, inset 2px 2px 2px 0 #FFF, 2px 2px 3px 0 #C6C6D2, -2px -2px 3px 0 #FFF;
}
.select_box {
  height: 36px;
  width: 80vw;
  border-radius: 8px;
  background-color: #F0F0F3;
  border: 0;
  box-shadow: 2px 2px 4px 0 #C6C6D2, -4px -4px 6px 0 #FFF;
}
option {
  border-radius: 8px;
  background-color: #F0F0F3;
  border: 0 !important;
  box-shadow: 2px 2px 4px 0 #C6C6D2, -4px -4px 6px 0 #FFF;
}
.focus:focus {
  outline: -webkit-focus-ring-color auto 0px;
}
.image:focus {
  outline: -webkit-focus-ring-color auto 0px;
}
.fake_bottom {
  background-color: #F0F0F3;
  box-shadow: 0 12px 10px 0 rgba(92,165,214,0.8), 0 -4px 4px 0 #C6C6D2;
  width: 100vw;
  height: 15vh;
  position: fixed;
  border-top-left-radius: 23px;
  border-top-right-radius: 23px;
  bottom: 0vh;
}
input {
  color: #666;
}
.input_div {
  background-color: #F0F0F3;
  border-bottom: 1px solid #C6C6D2;
  width: 80vw;
  border-top: 0;
  border-left: 0;
  border-right: 0;
  height: 29px;
}
.text_input::placeholder {
  padding-left: 0.02rem;
  color: #AEAEC0;
  font-size: 14px;
}
.text_input:focus {
  outline: none;
}
.text_input {
  height: 25px;
  background-color: #F0F0F3;
  width: 76vw;
  border: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}
.language_box_clicked_up {
  box-shadow: inset 2px 2px 2px 0 rgba(198,198,210,0.8), inset -2px -2px 2px 0 #FFF, 4px 4px 10px 0 #C6C6D2, -4px -4px 10px 0 #FFF;
}
.language_box_clicked_down {
  box-shadow: inset -1px -1px 1px 0 rgba(198, 198, 210, 0.8),
    inset 1px 2px 1px 0 #fff, 4px 4px 4px 0 #c6c6d2, -4px -4px 6px 0 #fff;
}
.language_box {
  height: 31px;
  width: 110px;
  border-radius: 24px;
  background-color: #f0f0f3;
}
.edit_profile_head {
  height: 12vh;
  width: 100vw;
  background: linear-gradient(180deg, #B5DCF6 0%, #D2E9F9 100%);
  box-shadow: 0 1px 2px 0 #AEAEC0;
}
.small_text {
  color: #666;
  font-family: "Century Gothic";
  font-size: 10px;
  width: 60vw;
  line-height: 12px;
}
.mb {
  margin-bottom: 0px;
}
.modal_class {
  background-color: #F0F0F3;
  border-radius: 10px;
}
.done_box {
  height: 32px;
  width: 92px;
  border-radius: 24px;
  background-color: #F0F0F3;
  box-shadow: inset -1px -1px 1px 0 rgba(198,198,210,0.8), inset 1px 2px 1px 0 #FFF, 4px 4px 4px 0 #C6C6D2, -4px -4px 6px 0 #FFF;
}
.done_box {
  height: 32px;
  width: 92px;
  border-radius: 24px;
  background-color: #F0F0F3;
  box-shadow: inset -1px -1px 1px 0 rgba(198,198,210,0.8), inset 1px 2px 1px 0 #FFF, 4px 4px 4px 0 #C6C6D2, -4px -4px 6px 0 #FFF;
}
.img_container2 {
  height: 43px;
  width: 43px;
  border-radius: 40px;
  background-color: #F0F0F3;
  box-shadow: inset 2px 2px 2px 0 rgba(198,198,210,0.8), inset -2px -2px 2px 0 #FFF, 1px 1px 2px 0 #C6C6D2, -1px -1px 2px 0 #FFF;
}
.img_container {
  height: 70px;
  width: 70px;
  border-radius: 40px;
  background-color: #F0F0F3;
  box-shadow: inset 2px 2px 2px 0 rgba(198,198,210,0.8), inset -2px -2px 2px 0 #FFF, 1px 1px 2px 0 #C6C6D2, -1px -1px 2px 0 #FFF;
}
.head {
  height: 20vh;
  width: 100vw;
  background: linear-gradient(180deg, #B5DCF6 0%, #D2E9F9 100%);
  box-shadow: 0 1px 2px 0 rgba(92,165,214,0.8);
}
.card{
  height: 32px;
  width: 100%;
  border-radius: 8px;
  background-color: #F0F0F3;
  box-shadow: -4px -4px 6px 0 #FFF, 2px 2px 4px 0 #AEAEC0;
  flex-direction: row !important;
}

.switch {
  position: relative;
  display: inline-block;
  width: 40px;
  height: 18px;
  border-radius: 38px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 19px;
  left: 0px;
  bottom: 0px;
  -webkit-transition: .4s;
  transition: .4s;
  background-color: #F0F0F3;
  box-shadow: inset -2px -2px 1px 0 #AEAEC0, inset 2px 2px 1px 0 #FFF;
}

input:checked + .slider {
  background-color: #FF6C34;
  box-shadow: inset -1px -1px 1px 0 #D4D4DD, inset 1px 1px 1px 0 #666;
}

input:focus + .slider {
  box-shadow: 0 0 1px #FF6C34;
  box-shadow: inset -1px -1px 1px 0 #D4D4DD, inset 1px 1px 1px 0 #666;
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
</style>
