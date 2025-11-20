import { FormsContextProvider } from "./FormsContext";
import { OrderContextProvider } from "./OrderContext";
import { UserContextProvider } from "./UserContext";

const MultiContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <UserContextProvider>
            <FormsContextProvider>
                <OrderContextProvider>
                    {children}
                </OrderContextProvider>
            </FormsContextProvider>
        </UserContextProvider>
    );
}

export default MultiContextProvider;