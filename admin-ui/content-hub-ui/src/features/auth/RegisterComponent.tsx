import React, { useState } from "react";
import RegisterForm from "../../pages/auth/register/RegisterForm";
import { authApi, type RegisterRequestDto } from "../../api/auth/auth.api";
import Toast from "../../components/common/Toast";

export interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  userName?: string;
  password?: string;
  confirmPassword?: string;
  dob?: string;
}

export default function RegisterComponent() {
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<ValidationErrors>({});

  const [registerForm, setRegisterForm] = useState<RegisterRequestDto>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    confirmPassword: "",
    dob: null,
  });

  // Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showAlert = (
    message: string,
    color: "success" | "danger"
  ) => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // clear validation cũ
    setErrors({});

    try {
      setLoading(true);

      const res = await authApi.registerApi(registerForm);

      showAlert(
        res.data?.message ?? "Register successful",
        "success"
      );

      // reset form nếu muốn
      setRegisterForm({
        firstName: "",
        lastName: "",
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
        dob: "",
      });
    } catch (error: any) {
      const apiErrors = error?.response?.data?.errors;

      // Validation Error 400
      if (apiErrors) {
        const formattedErrors: ValidationErrors = {};

        Object.entries(apiErrors).forEach(([key, value]) => {
          const camelKey =
            key.charAt(0).toLowerCase() + key.slice(1);

          formattedErrors[
            camelKey as keyof ValidationErrors
          ] = (value as string[])[0];
        });

        setErrors(formattedErrors);
        return;
      }

      // Server Error / Business Error
      showAlert(
        error?.response?.data?.message ??
          "Register failed",
        "danger"
      );
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
        errors={errors}
        setErrors={setErrors}
      />

      <Toast
        showToast={showToast}
        message={message}
        alertColor={alertColor}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}