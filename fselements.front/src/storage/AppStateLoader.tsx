import type React from "react";
import { useUser, useUserDispatch, type UserState } from "./UserContext";
import { useEffect } from "react";
import { getCookie, setCookie } from 'typescript-cookie';
import { useOrderDispatch, type OrderState } from "./OrderContext";

let isLoaded = false;

const AppStateLoader: React.FC<React.PropsWithChildren> = ({ children }) => {
    const userDispatch = useUserDispatch();
    const orderDispatch = useOrderDispatch();
    useEffect(() => {
        if (!isLoaded) {
            const userStr = getCookie('user');
            if (userStr) {
                const u = JSON.parse(userStr) as UserState;
                if (u.isAuthenticated) {
                    userDispatch({ type: 'Login', payload: { accessToken: u.token!, role: u.role, userId: u.userId } })
                }
            }
            const orderStr = getCookie('order');
            if (orderStr) {
                const data = JSON.parse(orderStr) as OrderState;
                orderDispatch({ type: 'Init', data: data });
            }

            isLoaded = true;
        }
    }, []);
    return children;
}

export default AppStateLoader;