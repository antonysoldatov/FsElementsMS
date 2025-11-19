import axios, { type AxiosResponse } from "axios";
import { jwtDecode } from "jwt-decode";
import type { ElementCategory, ElementForm, Element } from "../data/dto";

const AUTH_BASE_URL = "https://localhost:52456";
const FORMS_BASE_URL = "https://localhost:52453";
const ELEMENTS_BASE_URL = "https://localhost:52460";

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
const getAllCatergories = async (): Promise<ElementCategory[]> => {
    try {
        const response: AxiosResponse<ElementCategory[]> = await axios.get(FORMS_BASE_URL + '/Category/GetAll');
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
const getAllForms = async (): Promise<ElementForm[]> => {
    try {
        const response: AxiosResponse<ElementForm[]> = await axios.get(FORMS_BASE_URL + '/Form/GetAll');
        response.data.forEach(form => form.image = FORMS_BASE_URL + form.image);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
};
const getElementsBySeller = async (sellerId: string): Promise<Element[]> => {
    try {
        const response: AxiosResponse<Element[]> = await axios.get(ELEMENTS_BASE_URL + `/Element/GetBySeller?sellerId=${sellerId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}
const getElementById = async (elementId: string): Promise<Element> => {
    try {
        const response: AxiosResponse<Element> = await axios.get(ELEMENTS_BASE_URL + `/Element/GetById?id=${elementId}`);
        return response.data;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const saveElement = async (element: Element): Promise<void> => {
    try {
        const response = await axios.post(ELEMENTS_BASE_URL + `/Element/AddOrEdit`, element);
        return;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}

const deleteElement = async (elementId: string): Promise<void> => {
    try {
        const response = await axios.delete(ELEMENTS_BASE_URL + `/Element/Delete/${elementId}`);
        return;
    } catch (error) {
        console.error("Error:", error);
        throw error;
    }
}


const api = {
    authToken: '',
    user: {
        login: userLogin,
        register: userRegister
    },
    elements: {
        getAllCatergories: getAllCatergories,
        getAllForms: getAllForms,
        getElementsBySeller: getElementsBySeller,
        getElementById: getElementById,
        saveElement: saveElement,
        deleteElement: deleteElement,
    },
};

export default api;