import axios from "axios";
import { useAuthStore } from "../store/authStore"; // import your zustand store

export interface IAxiosHelper {
  url: string;
  method: string;
  credentials: boolean;
  body?: {
    username?: string;
    email?: string;
    password?: string;
    sender_id?: number;
    receiver_id?: number;
    id?: number;
    about?: string;
  };
}

// ✅ Helper to refresh token
const refreshToken = async () => {
  try {
    const res = await axios.patch(
      "http://localhost:64000/api/auth/refresh",
      {},
      { withCredentials: true }
    );
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, data: err };
  }
};

export const axios_helper = async ({ url, method, credentials, body }: IAxiosHelper) => {
  const { logout } = useAuthStore.getState();

  method = method.toLowerCase().trim();

  try {
    const res = await axios({
      url,
      method,
      data: body,
      withCredentials: credentials,
    });

    return {
      error: false,
      data: res.data
    };
  }
  catch (err: any) {
    if (err?.response?.status === 401) {

      const refreshRes = await refreshToken();

      if (refreshRes.success) {

        try {
          const retryRes = await axios({
            url,
            method,
            data: body,
            withCredentials: credentials,
          });

          return {
            error: false,
            data: retryRes.data
          };
        } catch (retryErr) {
          console.error("Retry failed", retryErr);
          return {
            error: true,
            data: retryErr
          };
        }
      } else {
        console.error("Refresh failed. Logging out...");
        await axios.delete("http://localhost:64000/api/auth/logout", {
          withCredentials: true,
        });

        logout();
      }
    }

    return {
      error: true,
      data: err
    };
  }
};
