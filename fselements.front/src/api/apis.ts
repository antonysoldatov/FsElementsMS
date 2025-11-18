import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AUTH_BASE_URL = "https://localhost:65025";

interface LoginRequest {
    email: string,
    password: string,
}

export interface LoginResponse {
    accessToken: string,
    userId?: string,
    role?: string,
}

const parseAccessToken = (data: LoginResponse) => {
    const decodedToken = jwtDecode(data.accessToken);
    console.log(decodedToken);
    data.userId = (decodedToken as any).sub;
    data.role = (decodedToken as any)["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
};

axios.interceptors.request.use((config) => {
    const token = api.authToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

const userLogin = async (body: LoginRequest): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(AUTH_BASE_URL + '/auth/Login', body);
        const data: LoginResponse = response.data;
        if (data.accessToken) {
            api.authToken = data.accessToken;
            parseAccessToken(data);
        }
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
const userRegister = async (body: LoginRequest): Promise<LoginResponse> => {
    try {
        const response: AxiosResponse<LoginResponse> = await axios.post(AUTH_BASE_URL + '/auth/RegisterSeller', body);
        const data: LoginResponse = response.data;
        if (data.accessToken) {
            api.authToken = data.accessToken;
            parseAccessToken(data);
        }
        return data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};

const api = {
    authToken: '',
    user: {
        login: userLogin,
        register: userRegister
    }
};

export default api;