import { useEffect } from "react";
import api from "../api/apis";
import { useUserDispatch } from "../storage/UserContext";
import { useNavigate } from "react-router-dom";

const SignOutPage = () => {
    const userDispatch = useUserDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        api.authToken = undefined;
        userDispatch({ type: "Logout" });
        navigate('/');
    }, []);
    return <div>Signing out...</div>;
};

export default SignOutPage;