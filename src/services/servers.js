import base from "../utils/base"
import request from "../utils/request"
import '@babel/polyfill'

const getAllServers = () => {
    return window.fetch(`${base}/servers`, request.get())
        .then(res => res.json())
}

const getOneServer = (id) => {
    return window.fetch(`${base}/servers/${id}`, request.get())
        .then(res => res.json())
}

const createServer = (server) => {
    return window.fetch(`${base}/servers`, request.post(server))
        .then(res => res.json())
}

const updateServer = (server) => {
    return window.fetch(`${base}/servers/${server.id}`, request.put(server))
        .then(res => res.json())
}

const deleteServer = (id) => {
    return window.fetch(`${base}/servers/${id}`, request.delete())
        .then(res => res.json())
}

export default {
    getAllServers,
    getOneServer,
    createServer,
    updateServer,
    deleteServer
}
