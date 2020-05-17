import base from "../utils/base"
import request from "../utils/request"
import '@babel/polyfill'

const login = (username, password) => {
    return window.fetch(`${base}/users/login`, request.post({ username, password }))
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

const getUsers = () => {
    return window.fetch(`${base}/users`, request.get())
        .then(res => res.json())
}

const createUser = (user) => {
    return window.fetch(`${base}/users`, request.post(user))
        .then(res => res.json())
}

const updateUser = (user) => {
    return window.fetch(`${base}/users/${user.id}`, request.put(user))
        .then(res => res.json())
}

const deleteUser = (id) => {
    return window.fetch(`${base}/users/${id}`, request.delete())
        .then(res => res.json())
}

export default {
    login,
    updateProfile,
    getProfile,
    getUsers,
    createUser,
    updateUser,
    deleteUser
}
