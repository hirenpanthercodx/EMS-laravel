import axios from "axios"

function userData() {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:8000/api/userInfo`)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

export const UserService = {
    userData
}