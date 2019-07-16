import Vue from "vue";
import Router from "vue-router";
import login from "./views/login/login";

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: "/",
            redirect: "/login"
        },
        {
            path: "/login",
            component: login
        }
    ]
});
