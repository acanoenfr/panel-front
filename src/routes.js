import Vue from 'vue'
import VueRouter from "vue-router"
import store from "./store"
import Home from "./views/Home"
import Login from "./views/Login"

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: Home,
            meta: { requiresAuth: true }
        },
        {
            path: '/Login',
            name: 'Login',
            component: Login
        },
        // otherwise, redirect to Home
        { path: '*', redirect: '/' }
    ]
})

router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLogged) next()
        else next('/Login')
    } else {
        next()
    }
})

export default router
