import axios from "axios"

function login(data) {
    axios.interceptors.request.use(
        config => {
            config.headers.Authorization = null
          return config
        },
        error => Promise.reject(error)
    )
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/login`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function logout() {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/logout`)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

export const AuthService = {
    login,
    logout
}