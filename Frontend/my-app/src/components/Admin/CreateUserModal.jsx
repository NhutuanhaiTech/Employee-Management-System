// CreateUserModal.jsx
import React, { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { userSchema } from "../../schemas/userSchema"; // Đường dẫn import của bạn
import apiClient from "../../lib/api";
import { Controller } from "react-hook-form";
import Select from "react-select";
import { Eye, EyeOff } from "lucide-react";
export default function CreateUserModal({ isOpen, onClose, onSubmit }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [roles, setRoles] = useState([]);
  const [positions, setPositions] = useState([]);
  const {
    register,
    getValues,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      roles: [],
      pos: "",
    },
  });
  const currentRoles = useWatch({
    control,
    name: "roles",
    defaultValue: [],
  });
  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const responseRoles = await apiClient.get("/api/roles");
        console.log("Danh sách Roles lấy từ server:", responseRoles.data);
        setRoles(responseRoles.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách Role:", error);
      }

      try {
        const responsePosition = await apiClient.get("/api/positions");
        console.log("Danh sách Postion lấy từ server:", responsePosition.data);
        setPositions(responsePosition.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách Position:", error);
      }
    };

    fetchRoles();
  }, []);
  const positionOptions = Array.isArray(positions)
    ? positions.map((pos) => ({
        value: pos.id,
        label: pos.positionName,
      }))
    : [];
  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <div className="modal-header">
          <h3>Cấp tài khoản mới</h3>
          <button onClick={onClose} className="btn-close">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-grid">
            <div className="form-group-full">
              <label className="form-label">Tên đăng nhập (username) *</label>
              <input
                type="text"
                {...register("username")}
                className={`form-control ${errors.username ? "input-error" : ""}`}
              />
              {errors.username && (
                <span className="error-message">{errors.username.message}</span>
              )}
            </div>

            <div className="form-group-full">
              <label className="form-label">Mật khẩu *</label>
              <div className="password-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  className={`form-control ${errors.password ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="toggle-password-btn"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {errors.password && (
                <span className="error-message">{errors.password.message}</span>
              )}
            </div>

            <div className="form-group-full">
              <label className="form-label">Nhập lại mật khẩu *</label>
              <div className="password-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  {...register("confirmPassword")}
                  className={`form-control ${errors.confirmPassword ? "input-error" : ""}`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="toggle-password-btn"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-message">
                  {errors.confirmPassword.message}
                </span>
              )}
            </div>

            <div className="form-group form-group-full">
              <label className="form-label">Họ và tên (full_name) *</label>
              <input
                type="text"
                {...register("fullName")}
                className={`form-control ${errors.fullName ? "input-error" : ""}`}
              />
              {errors.fullName && (
                <span className="error-message">{errors.fullName.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                {...register("email")}
                className={`form-control ${errors.email ? "input-error" : ""}`}
              />
              {errors.email && (
                <span className="error-message">{errors.email.message}</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Số điện thoại</label>
              <input
                type="text"
                {...register("phone")}
                className={`form-control ${errors.phone ? "input-error" : ""}`}
              />
              {errors.phone && (
                <span className="error-message">{errors.phone.message}</span>
              )}
            </div>

            <div className="form-group">
              <label
                className="form-label"
                style={{
                  fontWeight: "bold",
                  marginBottom: "8px",
                  display: "block",
                }}
              >
                Vai trò hệ thống (Role) *
              </label>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => {
                  const currentSelectedRoles = field.value || [];

                  return (
                    <div className="checkbox-group">
                      {roles
                        .filter((roleItem) => roleItem.role !== "ADMIN")
                        .map((roleItem) => {
                          let displayLabel = roleItem.role;
                          if (roleItem.role === "LEADER")
                            displayLabel = "Lãnh đạo (Duyệt phiếu)";
                          if (roleItem.role === "MANAGER")
                            displayLabel = "Quản lý (Trình phiếu)";
                          return (
                            <label key={roleItem.id} className="checkbox-item">
                              <input
                                type="checkbox"
                                checked={currentSelectedRoles.includes(
                                  roleItem.id,
                                )}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    field.onChange([
                                      ...currentSelectedRoles,
                                      roleItem.id,
                                    ]);
                                  } else {
                                    field.onChange(
                                      currentSelectedRoles.filter(
                                        (id) => id !== roleItem.id,
                                      ),
                                    );
                                  }
                                }}
                              />
                              <span>{displayLabel}</span>
                            </label>
                          );
                        })}
                    </div>
                  );
                }}
              />
              {errors.roles && (
                <span
                  className="error-message"
                  style={{ color: "red", display: "block", marginTop: "4px" }}
                >
                  {errors.roles.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Chức vụ (pos) *</label>
              <Controller
                name="pos"
                control={control}
                render={({ field: { onChange, value, ref } }) => (
                  <Select
                    inputRef={ref}
                    options={positionOptions}
                    placeholder="-- Chọn chức vụ --"
                    value={positionOptions.find((c) => c.value === value)}
                    onChange={(val) => onChange(val?.value)}
                    menuPortalTarget={document.body}
                    styles={{
                      menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                      control: (base, state) => ({
                        ...base,
                        minHeight: "46px",
                        borderRadius: "8px",
                        boxShadow: "none",
                        border: errors.pos
                          ? "1.5px solid #ef4444"
                          : state.isFocused
                            ? "1.5px solid #2563eb"
                            : "1.5px solid #e5e7eb",
                        "&:hover": {
                          borderColor: state.isFocused ? "#2563eb" : "#d1d5db",
                        },
                      }),
                      menu: (base) => ({
                        ...base,
                        borderRadius: "8px",
                        overflow: "hidden",
                        boxShadow:
                          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                      }),
                      option: (base, state) => ({
                        ...base,
                        padding: "10px 16px",
                        cursor: "pointer",
                        backgroundColor: state.isSelected
                          ? "#3b82f6"
                          : state.isFocused
                            ? "#eff6ff"
                            : "white",
                        color: state.isSelected ? "white" : "#1f2937",
                        "&:active": {
                          backgroundColor: "#2563eb",
                        },
                      }),
                    }}
                  />
                )}
              />
              {errors.pos && (
                <span className="error-message">{errors.pos.message}</span>
              )}
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-cancel">
              Hủy
            </button>
            <button type="submit" className="btn-save">
              Lưu tài khoản
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
