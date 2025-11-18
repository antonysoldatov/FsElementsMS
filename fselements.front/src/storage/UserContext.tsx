import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import api, { type LoginResponse } from '../api/apis';

const UserContext = createContext<UserState | undefined>(undefined);

const UserDispatchContext = createContext<Dispatch<UserAction> | undefined>(undefined);

export const UserContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [user, dispatch] = useReducer(
        userReducer,
        initialUser
    );

    return (
        <UserContext value={user}>
            <UserDispatchContext value={dispatch}>
                {children}
            </UserDispatchContext>
        </UserContext>
    );
}

export function useUser() {
    const c = useContext(UserContext);
    if (!c) {
        throw new Error("useUser must be used within a UserContextProvider");
    }
    return c;
}

export function useUserDispatch() {
    const c = useContext(UserDispatchContext);
    if (!c) {
        throw new Error("useUserDispatch must be used within a UserContextProvider");
    }
    return c;
}

export const UserActionType = {
    Login: "Login",
    Logout: "Logout",
} as const

export type UserActionType = (typeof UserActionType)[keyof typeof UserActionType]


type UserAction =
    | { type: "Login"; payload: LoginResponse }
    | { type: "Logout" }


interface UserState {
    isAuthenticated: boolean,
    token?: string,
    userId?: string,
    role?: string,
}

function userReducer(user: UserState, action: UserAction): UserState {
    switch (action.type) {
        case UserActionType.Login: {
            return {
                ...user,
                isAuthenticated: true,
                token: action.payload.accessToken,
                userId: action.payload.userId,
                role: action.payload.role,
            };
        }
        case UserActionType.Logout: {
            return {
                ...user,
                isAuthenticated: false,
                token: undefined,
                userId: undefined,
            };
        }
        default: {
            return user;
        }
    }
}

const initialUser: UserState = {
    isAuthenticated: false,
    token: undefined,
    userId: undefined,
    role: undefined,
};
