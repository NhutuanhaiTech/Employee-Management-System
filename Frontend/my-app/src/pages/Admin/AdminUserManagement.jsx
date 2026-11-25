import React, { useState, useEffect } from "react";
import { LogOut, SquarePen, Trash2, TriangleAlert } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import "./AccountManagement.css";
import { userSchema } from "../../schemas/userSchema";
import { toast } from "react-toastify";
import UserTableBody from "../../components/Admin/UserTableBody";
import EditUserModal from "../../components/Admin/EditUserModal";
import CreateUserModal from "../../components/Admin/CreateUserModal";
import DeleteConfirmModal from "../../components/Admin/DeleteConfirmModal";
import apiClient from "../../lib/api";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../stores/authStore";
export default function AdminUserManagement() {

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await apiClient.get("/api/users?page=1&size=10");
        setUsers(response.data.data);
        console.log(response.data);
      } catch (error) {
        console.error("Lỗi khi tải danh sách người dùng:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  //delete open
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  //cập nhật
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const handleEditClick = (user) => {
    setSelectedUser(user);
    setIsEditModalOpen(true);
  };
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    setSelectedUser(null);
  };
  const updateUser = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const updatedData = {
      id: selectedUser.id,
      full_name: formData.get("full_name"),
      username: formData.get("username"),
      pos: formData.get("pos"),
    };

    const newPassword = formData.get("password");
    if (newPassword && newPassword.trim() !== "") {
      updatedData.password = newPassword;
    }
    console.log("Thông tin sau khi update:", updatedData);
    toast.success("Cập nhật thông tin thành công!", {
      theme: "colored",
      autoClose: 2000,
    });
    handleCloseModal();
  };
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };
  const confirmDelete = () => {
    if (!userToDelete) return;
    console.log("Thực hiện xoá user ID:", userToDelete.id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
    toast.error("Đã xóa tài khoản " + userToDelete.username + " thành công!");
  };
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "hello",
      password: "",
      fullName: "",
      email: "",
      phone: "",
      roles: [],
      pos: "",
    },
  });
  const closeModal = () => {
    setIsModalOpen(false);
    // reset();
  };
  const onSubmit = async (data) => {
    const payload = {
      username: data.username,
      password: data.password,
      confirmPassword: data.confirmPassword || data.password,
      email: data.email,
      phone: data.phone,
      fullName: data.fullName,
      positionId: data.pos,
      listRoles: data.roles,
    };

    console.log("Payload chuẩn bị gửi lên Server:", payload);

    try {
      const response = await apiClient.post("/api/auth/sign-up", payload);
      console.log("Kết quả từ server:", response.data);
      toast.success("Tạo tài khoản mới thành công!");
      reset();
      closeModal();
      const fetchUsers = async () => {
        try {
          const response = await apiClient.get("/api/users?page=1&size=10");
          setUsers(response.data.data);
        } catch (error) {
          console.error("Lỗi khi tải danh sách người dùng:", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Có lỗi xảy ra khi tạo tài khoản, vui lòng thử lại!";
      toast.error(errorMessage);
    }
  };

  //side bar
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  //handle logout
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const handleLogout = () => {
    toast.success("Đăng xuất thành công!");
    logout();
    navigate("/login");
  };
  return (
    <div className="app-container">
      <div className="sidebar">
        <h2>QLNV System</h2>
        <div className="menu-item-active">Quản lý Tài khoản</div>
        <div className="sidebar-bottom">
          <button
            className="menu-item-logout"
            onClick={() => setShowLogoutModal(true)}
          >
            <LogOut size={20} />
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>

      <div className="main-content">
        <div className="page-header">
          <h2 className="page-title">Danh sách Quản trị & Lãnh đạo</h2>
          <button onClick={() => setIsModalOpen(true)} className="btn-create">
            + Tạo tài khoản mới
          </button>
        </div>

        <div className="table-wrapper">
          <UserTableBody
            users={users}
            handleEditClick={handleEditClick}
            handleDeleteClick={handleDeleteClick}
          />
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            user={userToDelete}
            onClose={closeDeleteModal}
            onConfirm={confirmDelete}
          />
          <EditUserModal
            isOpen={isEditModalOpen}
            user={selectedUser}
            onClose={handleCloseModal}
            onSubmit={updateUser}
          />
          {showLogoutModal && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h3 className="modal-title">Xác nhận đăng xuất</h3>
                <p className="modal-desc">
                  Bạn có chắc chắn muốn đăng xuất khỏi hệ thống không?
                </p>

                <div className="modal-actions">
                  <button
                    className="btn-cancel"
                    onClick={() => setShowLogoutModal(false)}
                  >
                    Hủy bỏ
                  </button>
                  <button className="btn-confirm-logout" onClick={handleLogout}>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal Cấp tài khoản mới */}
      <CreateUserModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSubmit={onSubmit}
      />
    </div>
  );
}
