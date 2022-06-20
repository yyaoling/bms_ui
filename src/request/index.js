import axios from "axios";
import Cookie from "js-cookie";
import nprogress from 'nprogress';
import "nprogress/nprogress.css";

const isDev = process.env.NODE_ENV;
const ins = axios.create({
  baseURL: isDev ? 'http://localhost:8080/api' : 'http://localhost:8080/api',
  timeout: 5000,
})
ins.interceptors.request.use((config) => {
  nprogress.start();
  config.headers['Authorization'] = 'Bearer ' + Cookie.get('token') || ''
  return config
}, error => {
  return Promise.reject(error)
})
ins.interceptors.response.use(response => {
  nprogress.done();
  return response
}, error => {
  return Promise.reject(error)
})
function request(config) {
  let { url, params, data, method, headers } = config
  url = url || ''
  params = params || ''
  data = data || ''
  method = method || 'GET'
  headers = headers || ''
  if (method.toUpperCase() === 'GET') {
    return ins.get(url, { params: params })
  }
  if (method.toUpperCase() === 'POST') {
    if (headers['content-type'] === 'application/x-www-form-url-encoded') {
      const p = new URLSearchParams()
      for (let key in data) {
        p.append(key, data[key])
      }
      return ins.post(url, p, { headers })
    }
    if (headers['content-type'] === 'multipart/form-data') {
      const p = new FormData()
      for (let key in data) {
        p.append(key, data[key])
      }
      return ins.post(url, p, { headers })
    }
    return ins.post(url, data)
  }
  if (method.toUpperCase() === 'PUT') {
    return ins.put(url, data, { params: params })
  }
  if (method.toUpperCase() === 'PATCH') {
    return ins.patch(url, data, { params: params })
  }
  if (method.toUpperCase() === 'DELETE') {
    return ins.delete(url, { data })
  }
  return ins(config)
}
export default request
