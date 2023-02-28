import axios from 'axios';


export const BASE_URL = process.env.NODE_ENV==="production"? "http://be.dummy-fullstack.course-xai-iml23.isginf.ch/api/v1":"http://localhost:8000/api/v1"

const axiosClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
})

export default axiosClient