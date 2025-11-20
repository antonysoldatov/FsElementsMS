import { createContext, useContext, useReducer, type Dispatch } from "react";
import type { ElementMakeOrder } from "../data/dto";

export interface OrderState {
    elementsOrder: ElementMakeOrder[]
}

type OrderAction =
    | { type: "Add"; element: ElementMakeOrder }
    | { type: "Remove"; elementId: string }
    | { type: "ChangeCount"; elementId: string, count: number }
    | { type: "Clear" }


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
    switch (action.type) {
        case "Add": {
            return {
                ...state,
                elementsOrder: [...state.elementsOrder, action.element]
            };
        }
        case "Remove": {
            return {
                ...state,
                elementsOrder: state.elementsOrder.filter(e => e.elementId != action.elementId)
            };
        }
        case 'ChangeCount': {
            return {
                ...state,
                elementsOrder: state.elementsOrder.map(e => {
                    if (e.elementId == action.elementId) {
                        return { ...e, count: action.count };
                    }
                    return e;
                })
            };
        }
        case "Clear": {
            return initialState;
        }
        default: {
            return state;
        }
    }
}

const initialState: OrderState = {
    elementsOrder: []
};