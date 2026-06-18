import React, { useEffect, useState } from "react";
import { authApi, type LoginRequestDto } from "../../api/auth/auth.api";
import { decodeToken } from "../../api/extentions/decodeToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../components/layouts/store/slices/authSlice";
import LoginForm from "../../pages/auth/login/LoginForm";
import Toast from "../../components/common/Toast";
import { useAuth0 } from "@auth0/auth0-react";

export default function LoginComponent() {
  const [loading, setLoading] = useState(false);
  const [loginForm, setLoginForm] = useState<LoginRequestDto>({
    username: "",
    password: "",
  });
  //Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loginWithRedirect } = useAuth0();

const { isAuthenticated, getAccessTokenSilently } = useAuth0();

useEffect(() => {
  const syncUser = async () => {
    if (!isAuthenticated) return;

    try {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: "ContentHub.Api"
        }
      });
      console.log("TOKEN:", token);
      if (!token) return;

      await authApi.googleLogin(token);
    } catch (err) {
      console.log("Auth0 token error:", err);
    }
  };

  syncUser();
}, [isAuthenticated]);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      console.log("Form run");
      const res = await authApi.loginApi(loginForm);
      const token = res.data.token;
      const user = await decodeToken(token);
      if (!user) {
        throw new Error("Invalid Token");
      }
      dispatch(
        loginSuccess({
          token,
          user,
        }),
      );
      console.log("DECODED TOKEN:", user);
      if (user.roles === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    } catch (error: any) {
      showAlert(error.response?.data.message ?? "Login failed!!!", "danger");
      setLoading(false);
    }
  };
  return (
    <>
      <LoginForm
        loading={loading}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        handleLogin={handleLogin}
        loginWithRedirect = {loginWithRedirect}
      />
      {/* Toast */}
      <div>
        <Toast
          showToast={showToast}
          message={message}
          alertColor={alertColor}
          onClose={() => setShowToast(false)}
        />
      </div>
    </>
  );
}
