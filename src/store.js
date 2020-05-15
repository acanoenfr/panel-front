import Vue from 'vue'
import Vuex from 'vuex'
import users from "./services/users"

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        token: localStorage.getItem('token') || '',
        user: JSON.parse(localStorage.getItem('user')) || {}
    },
    mutations: {
        [AUTH_LOGIN]: (state, info) => {
            state.token = info.token
            state.user = info.user
        },
        [AUTH_LOGOUT]: state => {
            state.token = ''
            state.user = {}
        }
    },
    actions: {
        login: ({ commit, dispatch }, username, password) => {
            return new Promise((resolve, reject) => {
                users.login(username, password)
                    .then(info => {
                        localStorage.setItem('token', info.token)
                        localStorage.setItem('user', info.user)
                        commit('AUTH_LOGIN', info)
                        resolve(info)
                    })
                    .catch(err => {
                        dispatch('logout')
                        reject(err)
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
        isLogged: state => !!state.token,
        isAdmin: state => state.user.isAdmin
    }
})
