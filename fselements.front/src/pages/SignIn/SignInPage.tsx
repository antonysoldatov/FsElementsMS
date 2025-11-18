import { Alert, Button, Stack } from "@mui/material";
import LoginView from "./LoginView";
import { useContext, useState } from "react";
import RegisterView from "./RegisterView";
import { UserActionType, useUserDispatch } from "../../storage/UserContext";
import api from "../../api/apis";
import { useNavigate } from "react-router-dom";

function SignInPage() {
    const [isLoginMode, setIsLoginMode] = useState(true);
    const [isErrorShow, setIsErrorShow] = useState(false);
    const userDispatch = useUserDispatch();
    const navigate = useNavigate();

    const handleLoginClick = (username: string, password: string) => {
        setIsErrorShow(false);
        api.user.login({ email: username, password: password })
            .then(value => {                
                userDispatch({ type: UserActionType.Login, payload: value });
                navigate('/');
            })
            .catch(err => {
                setIsErrorShow(true);
            });        
    }

    const handleRegisterClick = (username: string, password: string) => {
        setIsErrorShow(false);
        api.user.register({ email: username, password: password })
            .then(value => {
                userDispatch({ type: UserActionType.Login, payload: value });
                navigate('/');
            })
            .catch(err => {
                setIsErrorShow(true);
            }); 
    }

    return (
        <Stack sx={{
            maxWidth: '60ch',
        }}
        >
            {isErrorShow &&
                <Alert severity="error">Sign in error. Try later</Alert>}
            {isLoginMode ?
                <>
                    <LoginView onLoginClick={handleLoginClick}>
                    </LoginView>
                    <Button sx={{ mt: 2 }} onClick={() => setIsLoginMode(false)}>
                        Don't have an account? Sign Up
                    </Button>
                </>
                :
                <>
                    <RegisterView onOkClick={handleRegisterClick}>
                    </RegisterView>
                    <Button sx={{ mt: 2 }} onClick={() => setIsLoginMode(true)}>
                        Already have an account? Sign In
                    </Button>
                </>
            }

        </Stack>
    );
}

export default SignInPage;