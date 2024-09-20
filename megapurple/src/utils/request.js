import axios from 'axios'
import { Toast, Dialog } from 'vant';

const TIMEOUT = 30000
const BASE_URL = 'https://purpleball.io'
// const BASE_URL = ''


const service = axios.create({
    baseURL: BASE_URL,
    timeout: TIMEOUT,
})

service.interceptors.request.use(config => {
    const token = localStorage.getItem('TOKEN')
    if (token) {
        config.headers.token = token
    }
    return config
})

service.interceptors.response.use(response => {
    const data = response.data
    try {
        if (data.code === 200) {
            return data
        } else {
            const message = data.msg
            if (message) {
                Toast({
                    title: "Tips",
                    message: message,
                    confirmButtonText: "OK",
                })
            } else {
                Toast({
                    title: "Tips",
                    message: 'System error!',
                    confirmButtonText: "OK",
                })
            }

            return Promise.reject(data)
        }
    } catch (e) {
        Toast({
            title: "Tips",
            message: 'System error!',
            confirmButtonText: "OK",
        })
    }

}, error => {
    try {
        const message = error.response.data.msg
        if (message) {
            // Toast.fail(message)
        } else {
            Toast({
                title: "Tips",
                message: 'System error!',
                confirmButtonText: "OK",
            })
        }

        return Promise.reject(error)
    } catch (e) {
        Toast({
            title: "Tips",
            message: 'System error!',
            confirmButtonText: "OK",
        })
    }

})

export default service