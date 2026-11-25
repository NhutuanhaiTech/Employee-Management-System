import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Oval, ProgressBar } from "react-loader-spinner";
import "./Login.css";
import { useAuthStore } from "../../stores/authStore";
import { AlertCircle } from "lucide-react";
import { toast } from "react-toastify";

const loginSchema = z.object({
  username: z.string().min(1, "Vui lòng nhập username"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setServerError("");
    try {
      setIsLoading(true);
      const response = await axios.post(
        "http://localhost:8080/api/auth/log-in",
        data,
      );
      const token = response.data.token;
      console.log(token);
      if (!token) {
        throw new Error("Không nhận được token từ server");
      }
      const decoded = jwtDecode(token);
      console.log("Dữ liệu giải mã từ Token:", decoded);
      const userRoles = decoded.roles;
      setAuth(token, userRoles, decoded);
      await new Promise((resolve) => setTimeout(resolve, 1500));
      toast.success("Đăng nhập thành công!");
      if (userRoles.includes("ADMIN")) {
        navigate("/admin/users");
      } else if (userRoles.includes("MANAGER")) {
        navigate("/manager/dashboard");
      } else if (userRoles.includes("LEADER")) {
        navigate("/leader/dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        setServerError("Tài khoản hoặc mật khẩu không chính xác!");
      } else {
        setServerError("Không thể kết nối đến máy chủ. Vui lòng thử lại sau!");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card">
        <h2 className="login-title">Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          {serverError && (
            <div className="login-error-alert">
              <AlertCircle size={18} strokeWidth={2.5} />
              <span>{serverError}</span>
            </div>
          )}
          <div className="form-group">
            <label>Username:</label>
            <input
              type="text"
              placeholder="Enter your username"
              className={errors.username ? "input-error" : ""}
              {...register("username")}
            />
            {errors.username && (
              <span className="error-text">{errors.username.message}</span>
            )}
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter password"
              className={errors.password ? "input-error" : ""}
              {...register("password")}
            />
            {errors.password && (
              <span className="error-text">{errors.password.message}</span>
            )}
          </div>
          <div className="show-password-container">
            <input
              type="checkbox"
              id="show-pwd"
              onChange={() => setShowPassword(!showPassword)}
            />
            <label htmlFor="show-pwd">Show Password</label>
          </div>
          <button type="submit" className="btn-signin" disabled={isLoading}>
            {isLoading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                }}
              >
                <Oval
                  visible={true}
                  height="20"
                  width="20"
                  color="#ffffff"
                  secondaryColor="rgba(255,255,255,0.4)"
                  strokeWidth={4}
                  strokeWidthSecondary={4}
                />
                <span>SIGNING IN...</span>
              </div>
            ) : (
              "SIGN IN"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
