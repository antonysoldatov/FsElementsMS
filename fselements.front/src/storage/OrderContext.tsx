import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { ElementMakeOrder } from "../data/dto";
import { setCookie } from "typescript-cookie";

export interface OrderState {
    elementsOrder: ElementMakeOrder[]
}

type OrderAction =
    | { type: "Add"; element: ElementMakeOrder }
    | { type: "Remove"; elementId: string }
    | { type: "ChangeCount"; elementId: string, count: number }
    | { type: "Clear" }
    | { type: "Init"; data: OrderState }


const OrderContext = createContext<OrderState | undefined>(undefined);
const OrderActionContext = createContext<Dispatch<OrderAction> | undefined>(undefined);

export function useOrder() {
    const c = useContext(OrderContext);
    if (!c) {
        throw new Error("useOrder must be used within a OrderContextProvider");
    }
    return c;
}

export function useOrderDispatch() {
    const c = useContext(OrderActionContext);
    if (!c) {
        throw new Error("useOrderDispatch must be used within a OrderContextProvider");
    }
    return c;
}

export const OrderContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    const [forms, dispatch] = useReducer(
        reducer,
        initialState
    );

    return (
        <OrderContext value={forms}>
            <OrderActionContext value={dispatch}>
                {children}
            </OrderActionContext>
        </OrderContext>
    );
}

const reducer = (state: OrderState, action: OrderAction): OrderState => {
    let stateNew = state;
    switch (action.type) {
        case "Add": {
            stateNew = {
                ...state,
                elementsOrder: [...state.elementsOrder, action.element]
            };
            break;
        }
        case "Remove": {
            stateNew = {
                ...state,
                elementsOrder: state.elementsOrder.filter(e => e.elementId != action.elementId)
            };
            break;
        }
        case 'ChangeCount': {
            stateNew = {
                ...state,
                elementsOrder: state.elementsOrder.map(e => {
                    if (e.elementId == action.elementId) {
                        return { ...e, count: action.count };
                    }
                    return e;
                })
            };
            break;
        }
        case "Clear": {
            stateNew = initialState;
            break;
        }
        case "Init": {
            return action.data;
        }
    }

    setCookie('order', JSON.stringify(stateNew));

    return stateNew;
}

const initialState: OrderState = {
    elementsOrder: []
};