import axios from 'axios'

const instance = axios.create()

function setInterceptors (instance) {
  instance.interceptors.request.use((config) => config)
  instance.interceptors.response.use((res) => res)

  return instance
}

export default setInterceptors(instance)
