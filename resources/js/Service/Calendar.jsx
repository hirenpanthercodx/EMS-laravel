
function createLeave(data) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/calendar/create`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function updateLeave(data, event_id) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/calendar/${event_id}/update`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function editLeave(event_id) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:8000/api/calendar/${event_id}/edit`)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function allCalendarData(data) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/calendar/all`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function deleteEvent(event_id) {
    return new Promise((resolve, reject) => {
        axios.delete(`http://127.0.0.1:8000/api/calendar/${event_id}/delete`)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

export const CalendarService = {
    createLeave,
    updateLeave,
    editLeave,
    allCalendarData,
    deleteEvent
}