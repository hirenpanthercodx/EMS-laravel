import axios from "axios"

function store(data) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/employee/store`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function update(data, id) {
    return new Promise((resolve, reject) => {
        axios.post(`http://127.0.0.1:8000/api/employee/${id}/update`, data)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function employeeData(param) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:8000/api/employee/show`, {params: param})
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function editEmployee(id) {
    return new Promise((resolve, reject) => {
        axios.get(`http://127.0.0.1:8000/api/employee/edit/${id}`)
        .then((response) => resolve(response))
        .catch((error) => reject(error))
    })
}

function deleteEmployee(id) {
  return new Promise((resolve, reject) => {
      axios.delete(`http://127.0.0.1:8000/api/employee/${id}/delete`)
      .then((response) => resolve(response))
      .catch((error) => reject(error))
  })
}

export const EmployeeService = {
    store,
    update,
    employeeData,
    editEmployee,
    deleteEmployee
}