import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import "./assets/css/base.css";
import "./assets/fonts/iconfont.css";
import "./plugins/element.js";
import "./api/index.js";

Vue.config.productionTip = false;

new Vue({
    router,
    render: h => h(App)
}).$mount("#app");
