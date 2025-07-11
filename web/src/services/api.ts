import axios, { AxiosError } from "axios";
import { parseCookies } from "nookies";

export function setupApiClient(ctx = undefined) {
  let cookies = parseCookies(ctx);
  const api = axios.create({
    baseURL: "http://localhost:3001/api/cars",
    headers: {
      Authorization: `Bearer ${cookies["@barber.token"]}`,
    },
  });

  // api.interceptors.response.use(
  //   (response) => {
  //     return response;
  //   },
  //   (error: AxiosError) => {
  //     if (error.response.status === 401) {
  //       if (typeof window !== undefined) {
  //         signOut();
  //       } else {
  //         return Promise.reject(new AuthTokenError());
  //       }
  //     }

  //     return Promise.reject(error);
  //   }
  // );

  return api;
}
