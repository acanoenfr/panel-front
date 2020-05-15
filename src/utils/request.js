const request = {
    get(jsonInput = true) {
        return {
            headers: headers(jsonInput),
            method: 'GET'
        }
    },
    post(body, jsonInput = true) {
        return {
            headers: headers(jsonInput),
            method: 'POST',
            body: JSON.stringify(body)
        }
    },
    put(body, jsonInput = true) {
        return {
            headers: headers(jsonInput),
            method: 'PUT',
            body: JSON.stringify(body)
        }
    },
    patch(body, jsonInput = true) {
        return {
            headers: headers(jsonInput),
            method: 'PATCH',
            body: JSON.stringify(body)
        }
    },
    delete(jsonInput = true) {
        return {
            headers: headers(jsonInput),
            method: 'DELETE'
        }
    }
}

const headers = jsonInput => {
    return {
        "Authorization": localStorage.getItem('token') ? `Bearer ${localStorage.getItem('token')}` : null,
        "Content-Type": jsonInput ? 'application/json; charset=UTF-8' : 'multipart/form-data; charset=UTF-8'
    }
}

export default request
