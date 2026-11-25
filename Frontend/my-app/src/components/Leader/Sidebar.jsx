import React from "react";
import {
  Building2,
  UserCircle2,
  UserPlus,
  Users,
  FileCheck,
  LogOut,
  CheckSquare, 
} from "lucide-react";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate, useLocation } from "react-router-dom"; 
import apiClient from "../../lib/api";
import { toast } from "react-toastify"; 

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const location = useLocation(); 

  const logout = useAuthStore((state) => state.logout);
  const userInfo = useAuthStore((state) => state.userInfo);

  
  const currentActiveRole = (() => {
    const path = location.pathname.toLowerCase();
    if (path.includes("/leader")) return "LEADER";
    if (path.includes("/manager")) return "MANAGER";
    return userInfo?.roles?.[0] || "Người dùng";
  })();

  const handleLogout = () => {
    logout();
    delete apiClient.defaults.headers.common["Authorization"];
    navigate("/login");
    toast.success("Đăng xuất thành công!");
  };

  return (
    <aside className="hrm-sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Building2 size={24} />
        </div>
        <div className="logo-text">
          <h1>Employees Manager</h1>
          <p>Hệ thống Quản lý Nhân sự</p>
        </div>
      </div>

      <div className="sidebar-content">
        <div className="section-title">ĐANG ĐĂNG NHẬP VỚI QUYỀN:</div>
        <div className="current-user-box">
          <UserCircle2 size={18} />
         
          <span>{currentActiveRole === "LEADER" ? "Lãnh đạo" : "Quản lý"}</span>
        </div>

       

        {currentActiveRole === "MANAGER" ? (
         
          <>
            <div className="section-title">
              <Building2 size={14} /> QUẢN LÝ
            </div>
            <button
              onClick={() => setActiveTab("tao-moi")}
              className={`nav-btn ${activeTab === "tao-moi" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <UserPlus size={18} />
                <span>Tạo Mới Nhân Viên</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("cho-duyet")}
              className={`nav-btn ${activeTab === "cho-duyet" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <FileCheck size={18} />
                <span>Chờ Duyệt Hồ Sơ</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("da-duyet")}
              className={`nav-btn ${activeTab === "da-duyet" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <FileCheck size={18} />
                <span>Nhân viên đã được duyệt</span>
              </div>
            </button>
          </>
        ) : (
         
          <>
            <div className="section-title">
              <Users size={14} /> LÃNH ĐẠO
            </div>

            <button
              onClick={() => setActiveTab("duyet-ho-so")}
              className={`nav-btn ${activeTab === "duyet-ho-so" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <FileCheck size={18} />
                <span>Duyệt Hồ Sơ</span>
              </div>
              <span className="badge-count orange">5</span>
            </button>

            <button
              onClick={() => setActiveTab("da-duyet")}
              className={`nav-btn ${activeTab === "da-duyet" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <CheckSquare size={18} />
                <span>Hồ Sơ Đã Duyệt</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("tang-luong")}
              className={`nav-btn ${activeTab === "tang-luong" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <CheckSquare size={18} />
                <span>Duyệt tăng lương nhân viên</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("nghi-viec")}
              className={`nav-btn ${activeTab === "nghi-viec" ? "active" : ""}`}
            >
              <div className="nav-btn-left">
                <CheckSquare size={18} />
                <span>Duyệt nghỉ việc nhân viên</span>
              </div>
            </button>
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <button
          type="button"
          className="sidebar-logout-btn"
          onClick={handleLogout}
        >
          <LogOut size={20} />
          <span>Đăng xuất</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
