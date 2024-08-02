import axios from "axios";
import { response } from "express";
import { error } from "winston";

const alicloudapi = axios.create({
  baseURL: "https://qryip.market.alicloudapi.com",
  headers: {
    "Content-Type": "application/json", // 设置默认的 Content-Type
    Authorization: "AppCode f4b19daa8e1d46f3b1e0a283d0ac36e4", // 设置默认的 Authorization 头部
  },
});

alicloudapi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // 对响应错误做些什么
    if (error.response) {
      // 请求已发出，但服务器响应状态码不在 2xx 范围内
      console.error("Error response status:", error.response.status);
      console.error("Error response data:", error.response.data);
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      console.error("No response received:", error.request);
    } else {
      // 发送请求时发生了一些错误
      console.error("Request error:", error.message);
    }
    // 返回一个带有错误信息的 Promise
    return Promise.reject(error);
  }
);

// ip定位
export const getIpLocation = async (params) =>
  await alicloudapi.get("/lundear/qryip", {
    params,
  });

export const getSpecificLocation = async (params) =>
  await axios.get("https://apis.map.qq.com/ws/place/v1/suggestion", {
    params: {
      key: "YGHBZ-TXOE4-U7FUP-FIZ7G-P62O5-XXBLW",
      ...params,
      page_size: 10,
    },
  });
