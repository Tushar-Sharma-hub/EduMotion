import axios from "axios"

export const axiosInstance = axios.create({
  withCredentials: true,
})

export const apiConnector = (method, url, bodyData, headers, params) => {
  console.log(`[API CALL] ${method} -> ${url}`)
  return axiosInstance({
    method: `${method}`,
    url: `${url}`,
    data: bodyData ?? null,
    headers: headers ?? undefined,
    params: params ?? undefined,
  })
}