import React, { createContext, useContext, useReducer, type Dispatch } from 'react';
import type { ElementCategory, ElementForm } from '../data/dto';
import api from '../api/apis';

export interface FormsState {
    categories: ElementCategory[],
    forms: ElementForm[]
}

type FormsAction =
    | { type: "SetCatergories"; categories: ElementCategory[] }
    | { type: "SetForms"; forms: ElementForm[] }


const FormsContext = createContext<FormsState | undefined>(undefined);
const FormsActionContext = createContext<Dispatch<FormsAction> | undefined>(undefined);

export function useForms() {
    const c = useContext(FormsContext);
    if (!c) {
        throw new Error("useForms must be used within a FormsContextProvider");
    }
    return c;
}

export function useFormsDispatch() {
    const c = useContext(FormsActionContext);
    if (!c) {
        throw new Error("useFormsDispatch must be used within a FormsContextProvider");
    }
    return c;
}

export const FormsContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [forms, dispatch] = useReducer(
        formsReducer,
        initialState
    );

    return (
        <FormsContext value={forms}>
            <FormsActionContext value={dispatch}>
                {children}
            </FormsActionContext>
        </FormsContext>
    );
}

const formsReducer = (state: FormsState, action: FormsAction): FormsState => {
    switch (action.type) {
        case "SetCatergories": {
            return {
                ...state,
                categories: action.categories as ElementCategory[]
            };
        }
        case "SetForms": {
            return {
                ...state,
                forms: action.forms as ElementForm[]
            };
        }
        default: {
            return state;
        }
    }
}

const initialState: FormsState = {
    categories: [],
    forms: []
};



export const fetchAllCategories = (dispatch: Dispatch<FormsAction>) => {
    api.elements.getAllCatergories()
        .then(categories => dispatch({ type: 'SetCatergories', categories: categories }));
};

export const fetchAllForms = (dispatch: Dispatch<FormsAction>) => {
    api.elements.getAllForms()
        .then(forms => dispatch({ type: 'SetForms', forms: forms }));
};