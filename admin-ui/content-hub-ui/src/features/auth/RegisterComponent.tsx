import React, { useState } from "react";
import RegisterForm from "./../../pages/auth/register/RegisterForm";
import { authApi, type RegisterRequestDto } from "../../api/auth/auth.api";
import { Toast, ToastContainer } from "react-bootstrap";

export default function RegisterComponent() {
  const [loading, setLoading] = useState(false);

  const [registerForm, setRegisterForm] = useState<RegisterRequestDto>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: "",
  });

  const [toast, setToast] = useState({
    show: false,
    message: "",
    variant: "success" as "success" | "danger",
  });

  const showToast = (message: string, variant: "success" | "danger") => {
    setToast({
      show: true,
      message,
      variant,
    });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await authApi.registerApi(registerForm);

      showToast(res.data.message ?? "Register success", "success");
    } catch (error: any) {
      showToast(error?.response?.data?.message ?? "Register failed", "danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <RegisterForm
        registerForm={registerForm}
        setRegisterForm={setRegisterForm}
        handleRegister={handleRegister}
        loading={loading}
      />

      <ToastContainer position="top-end" className="p-3">
        <Toast
          bg={toast.variant}
          show={toast.show}
          onClose={() => setToast((p) => ({ ...p, show: false }))}
          delay={3000}
          autohide
        >
          <Toast.Body className="text-white">{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
}
