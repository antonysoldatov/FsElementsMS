import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

export interface LoginViewProps {
    onLoginClick: (username: string, password: string) => void;
}

function LoginView({ onLoginClick }: LoginViewProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isEmailError, setIsEmailError] = useState(false);
    const [isPasswrodError, setIsPasswrodError] = useState(false);
    const isLoginClicked = useRef(false);

    useEffect(() => {
        if (!isLoginClicked.current) {
            return;
        }
        setIsEmailError(!email);
        setIsPasswrodError(!password);
    }, [email, password]);

    const onTryLogin = () => {
        isLoginClicked.current = true;
        if (!email || !password) {
            setIsEmailError(!email);
            setIsPasswrodError(!password);
            return;
        }
        onLoginClick(email, password);
    };

    return (
        <>
            <Typography variant="h4">Login as Seller</Typography>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { mb: 2 },                    
                    mt: 2,
                }}
                noValidate
                autoComplete="off"
            >
                <Stack direction="column">
                    <TextField
                        required
                        label="Email"
                        type="email"
                        error={isEmailError}
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        required
                        label="Password"
                        type="password"
                        error={isPasswrodError}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <Button variant="contained" onClick={onTryLogin}>Login</Button>
                </Stack>
            </Box>
        </>
    );
}

export default LoginView;