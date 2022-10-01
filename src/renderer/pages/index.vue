<template>
  <!-- <div class="full" style="background-color: #F0F0F3; min-height: 100vh;">
    <div class="scroll">
      <input type="text" v-model="passKey">
      <button @click="login">press</button>
    </div>
  </div> -->
  <div
    class="sc"
    style="overflow: hidden; background-color: #f0f0f3; min-height: 100vh"
  >
    <div class="pt-4 pl-4 pr-4 d-flex justify-content-center" style="position: absolute; width: 100vw">
      <div class="d-flex justify-content-center flex-wrap">
        <div class="d-flex justify-content-center" style="width: 100vw">
          <img alt="pic" src="@/static/icons/bag_logo.webp" />
        </div>
        <p
          style="font-weight: 700; line-height: 24px"
          class="mt-3 text_four text-center text_gray-5 font-weight-bold pl-4 pr-4"
        >
          Login your account
        </p>
      </div>
    </div>
    <!-- <img
      alt="pic"
      src="@/static/icons/Blue shape with line.webp"
      height="460"
      class="top_design mar1"
      width="460"
      style="margin-left: -6%; margin-top: -27%; width: 112%"
    /> -->
    <div
      class="d-flex justify-content-center flex-wrap mar"
      style="margin-top: 7rem"
    >
    </div>
    <div class="d-flex justify-content-center" style="margin-top: 40%">
      <div class="mar2" style="width: 80vw; margin-top: 50%">
        <label for="Phone number" class="text_black text_three font_c"
          >Enter your Pass Key</label
        ><br />
        <div class="name-rectangle mt-3 d-flex align-items-center">
          <input
            v-model="passKey"
            type="tel"
            maxlength="10"
            class="input-rectangle pl-1 text_grey-3 font-weight-bold text_input wid2"
          />
          <div @click="pasteCode()" class="hover_inside passcodeBtn d-flex justify-content-center align-items-center mr-3">
            Paste code
          </div>
        </div>
        <label for="Phone number" class="text_red text_three font_c"
          >{{ text }}</label
        >
      </div>
    </div>
    <div class="f1" style="margin-top: 10%">
      <div v-if="!dataSyncOn" class="mb-2 d-flex justify-content-center">
        <div
          style="z-index: 1; width: 30vw"
          class="hover_inside  btnn mt-2 d-flex justify-content-center align-items-center"
          @click="login()"
        >
          <p class="text_four blue_text mb mt-0 font-weight-bold">Continue</p>
        </div>
      </div>
      <div v-else class="mb-2 d-flex justify-content-center">
        <div
          style="z-index: 1; width: 30vw"
          class="hover_inside  btnn mt-2 d-flex justify-content-center align-items-center"
        >
          <div class="loader">
          </div>
        </div>
      </div>
      <p class="text-center text_two font_c text_grey-3">
        You agree to the Ooga <span class="blue_text">Privacy Policy</span> and
        <span class="blue_text">Terms</span>.
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dataSyncOn: false,
      profile: {
        name: "Nitesh",
        phone_number: "+9188114477629",
        email: "dummy@gmail.com",
      },
      text: '',
      passKey: null      
    };
  },
  methods: {
    async pasteCode () {
      const text = await navigator.clipboard.readText();
      this.passKey = text;
    },
    async login() {
      let response = null;
      this.dataSyncOn = true
      const url = "http://localhost:4040/login?passkey=" + this.passKey;
      try {
        response = await this.$axios({
          method: "GET",
          url,
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (response.data.data.success) {
          console.log("setItemstarting");
          localStorage.setItem(
            "storeData",
            JSON.stringify(response.data.data.shop_data)
          );
          const token = 'Bearer ' + response.data.data.token
          localStorage.setItem("Credential", token);
          console.log("setItemDone");
          console.log(this.$store.getters.storeData);
          this.$router.push("/home");
        } else {
          this.dataSyncOn = false
          this.text = 'Please try new passkey'
          setTimeout(() => {
            this.text = ''
          }, 3000)
        }
        return response.data;
      } catch (error) {
        this.text = 'backend nahi chala hai'
        setTimeout(() => {
          this.text = ''
        }, 3000)
        this.dataSyncOn = false
        console.log(error);
        return [];
      }
    },
  },
};
</script>

<style scoped>
.passcodeBtn {
  height: 34px;
  cursor: pointer;
  width: 140px;
  border-radius: 2px;
  color: rgb(47, 47, 189);
  box-shadow: inset 1px 1px 1px 0 #fff, inset -2px -2px 2px 0 #c6c6d2,
    -4px -4px 6px 0 #fff, 4px 4px 6px 0 #c6c6d2;
}
.loader {
  border: 6px solid #f3f3f3;
  border-radius: 50%;
  border-top: 6px solid #031b2b;
  width: 15px;
  height: 15px;
  -webkit-animation: spin 1s linear infinite; /* Safari */
  animation: spin 1s linear infinite;
}

/* Safari */
@-webkit-keyframes spin {
  0% { -webkit-transform: rotate(0deg); }
  100% { -webkit-transform: rotate(360deg); }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
.f1 {
  position: absolute;
  top: 33rem;
  background-color: #f0f0f3;
  overflow: hidden;
  height: 10vh;
  width: 100vw;
}
.circ {
  height: 40px;
  width: 40px;
  border-radius: 100%;
  background-color: #f0f0f3;
  box-shadow: inset 1px 1px 1px 0 #fff, inset -2px -2px 2px 0 #c6c6d2,
    -4px -4px 6px 0 #fff, 4px 4px 6px 0 #c6c6d2;
}
.bounce-enter-active {
  animation: bounce-in 0.5s;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
}
.btnn {
  height: 40px;
  cursor: pointer;
  border-radius: 104px;
  background-color: #f0f0f3;
  box-shadow: inset -2px -2px 2px 0 #c6c6d2, inset 2px 2px 2px 0 #fff,
    2px 2px 3px 0 #c6c6d2, -2px -2px 3px 0 #fff;
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
.input-rectangle {
  height: 44px;
  padding: 0px;
  margin: 6px;
  width: 95%;
  border-radius: 8px;
  border: 0;
  background-color: #e8e8ed;
}
@media screen and (min-width: 390px) {
  .top_design {
    margin-left: -15%;
    margin-top: -35%;
  }
}
.top_design {
  margin-left: -6%;
  margin-top: -20%;
}
.otp_input {
  height: 32px;
  width: 10%;
  padding-left: 0.68rem;
  border-radius: 8px;
  background-color: #f0f0f3;
  border: 0px;
  box-shadow: inset 1px 1px 2px 0 #c6c6d2, inset -2px -2px 2px 0 #fff;
  -webkit-appearance: none;
  -webkit-box-shadow: inset 1px 1px 2px 0 #c6c6d2, inset -2px -2px 2px 0 #fff;
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
.rectangle-3 {
  height: 32px;
  border: 0px;
  width: 69px;
  border-radius: 8px;
  background-color: #f0f0f3;
  box-shadow: inset 1px 1px 2px 0 #c6c6d2, inset -2px -2px 2px 0 #fff;
}
.text_input::placeholder {
  padding-left: 1.42rem;
  color: #aeaec0;
}
.text_input:focus {
  outline: none;
}
@media (min-width: 1000px) {
  .mar {
    margin-top: -20% !important;
  }
  .mar1 {
    margin-top: 0% !important;
  }
  .sc {
    overflow-y: scroll !important;
    overflow-x: hidden !important;
  }
  .mar2 {
    margin-top: 2% !important;
  }
  .wid2 {
    width: 95% !important;
  }
}
</style>
