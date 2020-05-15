import Vue from 'vue'
import Vuex from 'vuex'
import users from "./services/users"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || {},
        snackbar: { text: '', color: '', show: false }
    },
    mutations: {
        AUTH_LOGIN: (state, info) => {
            state.token = info.token
            state.user = info.user
        },
        AUTH_LOGOUT: state => {
            state.token = ''
            state.user = {}
        },
        CALL_MSG: (state, info) => {
            state.snackbar = info
        }
    },
    actions: {
        login: ({ commit, dispatch }, user) => {
            return new Promise((resolve, reject) => {
                users.login(user.username, user.password)
                    .then(info => {
                        if (!info.error) {
                            localStorage.setItem('token', info.token)
                            localStorage.setItem('user', JSON.stringify(info.user))
                            commit('AUTH_LOGIN', info)
                            resolve(info)
                        } else {
                            dispatch('logout')
                            reject(info)
                        }
                    })
            })
        },
        logout: ({ commit }) => {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            commit('AUTH_LOGOUT')
        }
    },
    getters: {
        token: state => state.token,
        user: state => state.user,
        snackbar: state => state.snackbar,
        isLogged: state => !!state.token,
        isAdmin: state => state.user.isAdmin
    }
})
