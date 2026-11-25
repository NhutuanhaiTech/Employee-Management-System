import React, { useState } from "react";
import { useAuthStore } from "../../stores/authStore";
import { UserCircle2, ChevronDown, Check } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
const Header = ({ activeTab }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const userInfo = useAuthStore((state) => state.userInfo);
  const userRoles = userInfo?.roles || [];
  const hasMultipleRoles = userRoles.length > 1;
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentActiveRole = (() => {
    const currentPath = location.pathname.toLowerCase();
    if (currentPath.includes("/manager/")) return "MANAGER";
    if (currentPath.includes("/leader/")) return "LEADER";
    if (currentPath.includes("/admin/")) return "ADMIN";
    return userRoles[0] || "Người dùng";
  })();

  const getRoleDisplayName = (roleCode) => {
    if (roleCode === "MANAGER") return "Quản lý";
    if (roleCode === "LEADER") return "Lãnh đạo";
    if (roleCode === "ADMIN") return "Quản trị viên";
    return roleCode || userInfo?.positionName || "Người dùng";
  };

  const currentActiveRole = (() => {
    if (["tao-moi", "cho-duyet"].includes(activeTab)) {
      return "MANAGER";
    }
    if (["phe-duyet", "danh-sach-duyet"].includes(activeTab)) {
      return "LEADER";
    }
    const currentPath = location.pathname.toLowerCase();
    if (currentPath.includes("/manager")) return "MANAGER";
    if (currentPath.includes("/leader")) return "LEADER";
    if (currentPath.includes("/admin")) return "ADMIN";
    return userRoles[0] || "Người dùng";
  })();

  return (
    <header className="main-header">
      <div className="header-title-area">
        <h2>
          Quản Lý /{" "}
          {activeTab === "tao-moi" ? "Tạo Mới Nhân Viên" : "Chờ Duyệt Hồ Sơ"}
        </h2>
      </div>
      <div className="header-user-area" style={{ position: "relative" }}>
        <div className="user-role-text">
          <p>Tài khoản đăng nhập:</p>
          <p>
            {userInfo?.fullName || "Người dùng"} (
            {getRoleDisplayName(currentActiveRole)})
          </p>
        </div>

        <button
          className="user-profile-btn"
          onClick={() => hasMultipleRoles && setIsDropdownOpen(!isDropdownOpen)}
          style={{
            cursor: hasMultipleRoles ? "pointer" : "default",
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: "transparent",
            border: "none",
            padding: "4px 8px",
          }}
        >
          <UserCircle2 size={18} style={{ color: "#2563eb" }} />
          <span>
            {getRoleDisplayName(currentActiveRole)}:{" "}
            {userInfo?.fullName || "Người dùng"}
          </span>
          {hasMultipleRoles && <ChevronDown size={16} />}
        </button>

        {isDropdownOpen && hasMultipleRoles && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              right: 0,
              marginTop: "8px",
              backgroundColor: "white",
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              minWidth: "220px",
              zIndex: 50,
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "10px 12px",
                borderBottom: "1px solid #e5e7eb",
                fontSize: "12px",
                color: "#6b7280",
                fontWeight: "600",
                backgroundColor: "#f9fafb",
              }}
            >
              CHUYỂN ĐỔI GIAO DIỆN QUYỀN
            </div>

            {userRoles.map((role) => (
              <button
                key={role}
                onClick={() => handleSwitchRole(role)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                  padding: "12px 16px",
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  textAlign: "left",
                  fontSize: "14px",
                  color: currentActiveRole === role ? "#059669" : "#374151",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#f3f4f6")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "transparent")
                }
              >
                <span
                  style={{
                    fontWeight: currentActiveRole === role ? "600" : "normal",
                  }}
                >
                  Giao diện {getRoleDisplayName(role)}
                </span>
                {currentActiveRole === role && (
                  <Check size={16} style={{ color: "#059669" }} />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
