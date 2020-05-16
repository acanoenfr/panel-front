import base from "../utils/base"
import request from "../utils/request"
import '@babel/polyfill'

const getServerStatus = (id) => {
    return window.fetch(`${base}/actions/status/${id}`, request.get())
        .then(res => res.json())
}

const getServerLogs = (id) => {
    return window.fetch(`${base}/actions/logs/${id}`, request.get())
        .then(res => res.text())
}

const startServer = (id) => {
    return window.fetch(`${base}/actions/start/${id}`, request.post())
        .then(res => res.json())
}

const stopServer = (id) => {
    return window.fetch(`${base}/actions/stop/${id}`, request.post())
        .then(res => res.json())
}

const sendCommand = (id, command) => {
    return window.fetch(`${base}/actions/command/${id}`, request.post({
        command: command
    }))
        .then(res => res.json())
}

export default {
    getServerStatus,
    getServerLogs,
    startServer,
    stopServer,
    sendCommand
}
