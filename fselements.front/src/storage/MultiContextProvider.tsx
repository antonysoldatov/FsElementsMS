import { FormsContextProvider } from "./FormsContext";
import { UserContextProvider } from "./UserContext";

const MultiContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <UserContextProvider>
            <FormsContextProvider>
                {children}
            </FormsContextProvider>
        </UserContextProvider>
    );
}

export default MultiContextProvider;