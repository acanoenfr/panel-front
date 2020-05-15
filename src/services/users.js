import base from "../utils/base"
import request from "../utils/request"
import '@babel/polyfill'

const login = (username, password) => {
    return window.fetch(`${base}/users/login`, request.post({ username, password }))
        .then(res => res.json())
}

const register = user => {
    return window.fetch(`${base}/users/register`, request.post(user))
        .then(res => res.json())
}

const updateProfile = user => {
    return window.fetch(`${base}/users/me`, request.put(user))
        .then(res => res.json())
}

const getProfile = () => {
    return window.fetch(`${base}/users/me`, request.get())
        .then(res => res.json())
}

export default {
    login,
    register,
    updateProfile,
    getProfile
}
