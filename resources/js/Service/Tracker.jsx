import axios from "axios"

function saveTracker(data) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/tracker/add`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function getTrackerDetail(data) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:8000/api/tracker/getTracker`, {params: data})
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

export const TrackerService = {
    saveTracker,
    getTrackerDetail
}