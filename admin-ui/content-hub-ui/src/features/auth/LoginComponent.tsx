import React, { useState } from "react";
import { authApi, type LoginRequestDto } from "../../api/auth/auth.api";
import { decodeToken } from "../../api/extentions/decodeToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../components/layouts/store/slices/authSlice";
import LoginForm from "../../pages/auth/login/LoginForm";

export default function LoginComponent() {
    const [loading, setLoading] = useState(false);
    const [loginForm, setLoginForm] = useState<LoginRequestDto>({
        username:"",
        password:"",
    })
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const handleLogin = async (e:React.FormEvent) => {
        e.preventDefault();
        try{
            setLoading(true);
            console.log("Form run")
            const res = await authApi.loginApi(loginForm);
            const token = res.data.token;
            const user = await decodeToken(token);
            if(!user)
            {
                throw new Error("Invalid Token")
            }
            dispatch(
                loginSuccess({
                    token,
                    user
                })
            );
           console.log("DECODED TOKEN:", user);
            if(user.roles === "admin")
            {
                navigate("/admin", {replace:true});
            }
            else{
                navigate("/", {replace:true})
            }
            console.log(token);
            console.log(dispatch);
        }
        catch(error){
            console.log(error,"Login failed!!")
        }
        finally{
            setLoading(false);
        }
    }
    return(
        <>
        <LoginForm
        loading= {loading}
        loginForm = {loginForm}
        setLoginForm = {setLoginForm}
        handleLogin = {handleLogin}
        />
        </>
    )
}
