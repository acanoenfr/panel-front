import Vue from 'vue'
import VueRouter from "vue-router"
import store from "./store"
import Home from "./views/Home"
import Login from "./views/Login"
import Params from "./views/Params"

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/Home',
            name: 'Home',
            component: Home,
            meta: { requiresAuth: true }
        },
        {
            path: '/Login',
            name: 'Login',
            component: Login
        },
        {
            path: '/Params',
            name: 'Params',
            component: Params,
            meta: { requiresAuth: true }
        },
        // otherwise, redirect to Home
        { path: '*', redirect: '/Home' }
    ]
})

// require authentication
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (store.getters.isLogged) next()
        else next('/Login')
    } else {
        next()
    }
})

// require admin permissions
router.beforeEach((to, from, next) => {
    if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (store.getters.isAdmin) next()
        else next('/')
    } else {
        next()
    }
})

export default router
