import React, { useState } from "react";
import { authApi, type LoginRequestDto } from "../../api/auth/auth.api";
import { decodeToken } from "../../api/extentions/decodeToken";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../../components/layouts/store/slices/authSlice";
import LoginForm from "../../pages/auth/login/LoginForm";
import Toast from "../../components/common/Toast";

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
      console.log(token);
      console.log(dispatch);
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
