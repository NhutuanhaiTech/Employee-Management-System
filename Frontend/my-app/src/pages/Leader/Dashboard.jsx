import React, { useEffect, useState } from "react";
import {
  Users,
  UserPlus,
  FileCheck,
  Search,
  Plus,
  Info,
  Edit2,
  Trash2,
  Eye,
  FileUp,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Building2,
  UserCircle2,
  User,
  Send,
  MailOpen,
  SquarePen,
} from "lucide-react";
import "./Dashboard.css";
import apiClient from "../../lib/api";
import Sidebar from "../../components/Leader/Sidebar";
import Header from "../../components/Manager/Header";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import EmployeeModal from "../../components/Leader/EmployeeModal/EmployeeModal";
import ConfirmDeleteModal from "../../components/Leader/ConfirmDeleteModal/ConfirmDeleteModal";
import RegistrationFormsModal from "../../components/Leader/RegistrationFormsModal/RegistrationFormsModal";
import SalaryApproveModal from "../../components/Leader/SalaryApproveModal/SalaryApproveModal";
import TerminationApproveModal from "../../components/Leader/TerminationApproveModal/TerminationApproveModal";

export default function LeaderDashboard() {
  const [isSalaryApproveModalOpen, setIsSalaryApproveModalOpen] =
    useState(false);
  const [selectedSalaryRequest, setSelectedSalaryRequest] = useState(null);

  const [selectedEmployeeForApproval, setSelectedEmployeeForApproval] =
    useState(null);
  const currentActiveRole = location.pathname.toLowerCase().includes("/leader")
    ? "LEADER"
    : "MANAGER";
  
  const [viewingContent, setViewingContent] = useState(null);
 
  const [formModalMode, setFormModalMode] = useState("");
  const switchToFormsModal = () => {
    setIsModalOpen(false); 
    setIsFormModalOpen(true); 
  };

  const switchToEmployeeModal = () => {
    setIsFormModalOpen(false);
    setIsModalOpen(true);
  };
  const [pendingEmployees, setPendingEmployees] = useState([]);
  const [processedEmployees, setProcessedEmployees] = useState([]);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [activeTab, setActiveTab] = useState("duyet-ho-so");
  const userInfo = useAuthStore((state) => state.userInfo);
  const myUsername = userInfo?.id;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [salaryRequests, setSalaryRequests] = useState([]);
  const [layoffEmp, setLayoffEmp] = useState([]);
  const [selectedTermination, setSelectedTermination] = useState(null);
  const [isTerminationModalOpen, setIsTerminationModalOpen] = useState(false);
  // 2. HÀM GỌI API LẤY DANH SÁCH
  const fetchEmployees = async (page, size, tabStatus) => {
    setIsLoading(true);
    try {
      if (tabStatus === "duyet-ho-so") {
        const response = await apiClient.get("/api/approval-requests", {
          params: { status: "PENDING", page: page, size: size },
        });
        setPendingEmployees(response.data.data || []);
      } else if (tabStatus === "tang-luong") {
        const response = await apiClient.get(
          "/api/salary-increase-requests/leader",
        );
        const salaryList = response.data?.data || [];
        console.log("danh sách nhân viên tăng lương:", salaryList);
        setSalaryRequests(salaryList);
      } else if (tabStatus === "nghi-viec") {
        const response = await apiClient.get(
          "/api/termination-requests/for-leader",
        );
        const layoffdEmp = response.data?.data || [];
        console.log("danh sách nhân viên nghỉ việc:", layoffdEmp);
        setLayoffEmp(layoffdEmp);
      } else if (tabStatus === "da-duyet") {
        const [resApproved, resRejected, resUpdate] = await Promise.all([
          apiClient.get("/api/approval-requests", {
            params: { status: "APPROVED", page: page, size: size },
          }),
          apiClient.get("/api/approval-requests", {
            params: { status: "REJECTED", page: page, size: size },
          }),
          apiClient.get("/api/approval-requests", {
            params: { status: "REQUIRE", page: page, size: size },
          }),
        ]);

        const combined = [
          ...(resApproved.data.data || []),
          ...(resRejected.data.data || []),
          ...(resUpdate.data.data || []),
        ];

        setProcessedEmployees(combined);
      }
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải danh sách!");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees(currentPage, pageSize, activeTab);
  }, [currentPage, pageSize, activeTab]);

  const displayData =
    activeTab === "duyet-ho-so"
      ? pendingEmployees
      : activeTab === "tang-luong"
        ? salaryRequests
        : activeTab === "nghi-viec"
          ? layoffEmp
          : processedEmployees;
  const getStatusClass = (status) => {
    switch (status) {
      case "DRAFT":
        return "status-luu-moi";
      case "PENDING":
        return "status-cho-xu-ly";
      case "UPDATE_REQUIRED":
        return "status-yeu-cau";
      case "REJECTED":
        return "status-tu-choi";
      case "APPROVED":
        return "status-da-duyet";
      default:
        return "";
    }
  };
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    employeeId: null,
  });
  const handleDeleteClick = (empId) => {
    setDeleteModal({ isOpen: true, employeeId: empId });
  };
  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, employeeId: null });
  };
  const executeDelete = async () => {
    try {
      const idXoa = deleteModal.employeeId;
      console.log("Đang xóa nhân viên ID:", idXoa);
      await apiClient.delete(`/api/employees/${idXoa}`);
      toast.success("Đã xóa nhân viên thành công!");
      fetchEmployees(currentPage, pageSize);
    } catch (error) {
      console.error("Lỗi khi xóa nhân viên:", error);
      if (error.response && error.response.status === 403) {
        toast.error("Lỗi 403: Bạn không có quyền xóa nhân viên này.");
      } else {
        toast.error("Xóa thất bại, vui lòng thử lại!");
      }
    } finally {
      closeDeleteModal();
    }
  };
  const [findEmpById, setFindEmpById] = useState([]);
  const renderActions = (status, own, employee) => {
    const handleTermination = (employee) => {
      console.log("Chi tiết yêu cầu nghỉ việc được chọn:", employee);
      setSelectedTermination(employee);
      setIsTerminationModalOpen(true);
    };
    const handleSalary = async (requestItem) => {
      try {
        console.log("ID đơn đề xuất tăng lương (requestId):", requestItem.id);
        console.log("Dữ liệu hàng hiện tại:", requestItem);
        const resDecision = await apiClient.get(
          "/api/salary-increase-decisions",
          {
            params: { requestId: requestItem.id },
          },
        );
        const decisionDetail = resDecision.data?.data;
        console.log("✅ Chi tiết Quyết định tăng lương:", decisionDetail);
        const fullSalaryData = {
          ...requestItem,
          requestId: requestItem.id,
          decision: decisionDetail,
        };

        console.log("Dữ liệu đầy đủ nạp vào Modal:", fullSalaryData);
        setSelectedSalaryRequest(fullSalaryData);
        setIsSalaryApproveModalOpen(true);
      } catch (error) {
        console.error("❌ Lỗi khi lấy chi tiết đề xuất tăng lương:", error);
        if (error.response) {
          console.error(
            "--> Status:",
            error.response.status,
            error.response.data,
          );
          toast.error(
            error.response.data?.message || "Không thể tải chi tiết đề xuất!",
          );
        }
      }
    };
    if (activeTab === "tang-luong" && status === "PENDING") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Xem chi tiết"
            onClick={() => handleSalary(employee)}
          >
            <SquarePen size={16} />
          </button>
        </div>
      );
    }
    if (activeTab === "tang-luong" && status !== "PENDING") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Xem chi tiết"
            onClick={() => handleSalary(employee)}
          >
            <Eye size={16} />
          </button>
        </div>
      );
    }
    if (activeTab === "nghi-viec") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Xem chi tiết & Phê duyệt nghỉ việc"
            onClick={() => handleTermination(employee)}
          >
            <SquarePen size={16} />
          </button>
        </div>
      );
    }
    const handleOpenSubmitForm = (employee) => {
      console.log("id nhân viên: ", employee.employeeId);
      setSelectedEmployee(employee);
      setIsFormModalOpen(true);
    };
    const handleCheck = async (employee) => {
      try {
        console.log("id nhân viên :", employee.employeeId);
        const responseTemplate = await apiClient.get(
          `/api/templates?employeeId=${employee.employeeId}`,
        );
        const response = await apiClient.get(
          `/api/employees/${employee.employeeId}`,
        );
        const employeeMoreDetail = response.data;
        const employeeDetail = responseTemplate.data;
        setFindEmpById(employeeDetail);
        const finalEmployeeData = {
          ...employeeMoreDetail,
          requestId: employee.id,
        };
        console.log("Dữ liệu đầy đủ sẽ nạp vào Modal:", finalEmployeeData);
        setSelectedEmployee(finalEmployeeData);
        setModalMode("check");
        setIsModalOpen(true);
      } catch (error) {
        console.error("Lỗi khi gọi API lấy chi tiết nhân viên:", error);

        if (error.response && error.response.status === 403) {
          console.warn(
            "Lỗi 403: Tài khoản của bạn không có quyền xem chi tiết nhân viên.",
          );
        }
      }
    };
    const handleView = async (employee) => {
      try {
        console.log("id nhân viên :", employee.employeeId);
        const responseTemplate = await apiClient.get(
          `/api/templates?employeeId=${employee.employeeId}`,
        );
        const response = await apiClient.get(
          `/api/employees/${employee.employeeId}`,
        );
        const employeeMoreDetail = response.data;
        const employeeDetail = responseTemplate.data;
        setFindEmpById(employeeDetail);
        const finalEmployeeData = {
          ...employeeMoreDetail,
          requestId: employee.id,
        };
        console.log("Dữ liệu đầy đủ sẽ nạp vào Modal:", finalEmployeeData);
        setSelectedEmployee(finalEmployeeData);
        setModalMode("view");
        setIsModalOpen(true);
      } catch (error) {
        console.error("Lỗi khi gọi API lấy chi tiết nhân viên:", error);

        if (error.response && error.response.status === 403) {
          console.warn(
            "Lỗi 403: Tài khoản của bạn không có quyền xem chi tiết nhân viên.",
          );
        }
      }
    };
    const handleUpdate = async () => {
      try {
        const response = await apiClient.get(
          `/api/employees/${employee.employeeId}`,
        );
        const employeeDetail = response.data;
        console.log(employeeDetail);
        setSelectedEmployee(employeeDetail);
        setModalMode("edit");
        setIsModalOpen(true);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin nhân viên để sửa:", error);
        if (error.response && error.response.status === 403) {
          console.warn("Lỗi 403: Tài khoản không có quyền.");
        }
      }
    };
    if (!own) {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-gray force-center-icon"
            title="Xem chi tiết"
            onClick={() => handleView(employee)}
          >
            <Eye size={16} />
          </button>
        </div>
      );
    }
    if (status === "DRAFT") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Chỉnh sửa"
            onClick={() => handleUpdate(employee)}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="btn-icon btn-icon-red"
            title="Xóa"
            onClick={() => handleDeleteClick(employee)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      );
    }
    if (status === "PENDING") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Xem chi tiết"
            onClick={() => handleCheck(employee)}
          >
            <SquarePen size={16} />
          </button>
        </div>
      );
    }
    if (status === "UPDATE_REQUIRED") {
      return (
        <div className="actions-group">
          <div className="actions-group">
            <button
              className="btn-icon btn-icon-gray"
              title="Xem chi tiết"
              onClick={() => handleView(employee)}
            >
              <Eye size={16} />
            </button>
          </div>
        </div>
      );
    }
    if (status === "REJECTED") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-gray"
            title="Xem chi tiết"
            onClick={() => handleView(employee)}
          >
            <Eye size={16} />
          </button>
        </div>
      );
    }
    if (status === "APPROVED") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-gray"
            title="Xem chi tiết"
            onClick={() => handleView(employee)}
          >
            <Eye size={16} />
          </button>
        </div>
      );
    }
    return (
      <div className="actions-group">
        <button className="btn-icon btn-icon-gray" title="Xem chi tiết">
          <Eye size={16} />
        </button>
      </div>
    );
  };

  const STATUS_LABELS = {
    DRAFT: "Lưu mới",
    PENDING: "Chờ duyệt",
    APPROVED: "Đã duyệt",
    REJECTED: "Bị từ chối",
  };
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };
  const handleNextPage = () => {
    if (employees.length === pageSize) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="hrm-app">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="hrm-main">
        <Header activeTab={activeTab} />
        <div className="content-wrapper">
          <div className="toolbar">
            <div className="toolbar-title">
              {activeTab === "duyet-ho-so"
                ? "DUYỆT HỒ SƠ NHÂN VIÊN"
                : "DANH SÁCH NHÂN VIÊN ĐÃ DUYỆT"}
            </div>
            <div className="toolbar-actions">
              <div className="search-box">
                <Search size={16} className="search-icon" />
                <input
                  type="text"
                  placeholder="Tìm tên, mã NV, SĐT..."
                  className="search-input"
                />
              </div>
              {currentActiveRole === "MANAGER" && activeTab === "tao-moi" && (
                <button
                  className="btn-add"
                  onClick={() => {
                    setSelectedEmployee(null);
                    setModalMode("create");
                    setIsModalOpen(true);
                  }}
                >
                  <Plus size={18} /> Thêm mới
                </button>
              )}
              {isModalOpen && (
                <EmployeeModal
                  isOpen={isModalOpen}
                  onClose={() => {
                    setIsModalOpen(false);
                    setSelectedEmployee(null);
                  }}
                  initialData={selectedEmployee}
                  mode={modalMode}
                  onSuccess={() => fetchEmployees(currentPage, pageSize)}
                  onSwitchToForms={switchToFormsModal}
                />
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="col-center" style={{ width: "60px" }}>
                    STT
                  </th>
                  <th>MÃ NV</th>
                  <th>HỌ VÀ TÊN</th>
                  <th>PHÒNG BAN</th>
                  <th>NGÀY TRÌNH</th>
                  <th>LÃNH ĐẠO NHẬN</th>
                  <th>NỘI DUNG TRÌNH</th>
                  <th>LOẠI YÊU CẦU</th>
                  <th className="col-center" style={{ textAlign: "center" }}>
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData && displayData.length > 0 ? (
                  displayData.map((emp, index) => {
                    const rowId = emp.id || emp.requestId || index;
                    const contentToView =
                      emp.submitContent ||
                      emp.submitNote ||
                      emp.reason ||
                      "Không có nội dung";

                    const isMyRecord =
                      activeTab === "tang-luong" || activeTab === "nghi-viec"
                        ? true
                        : emp.leaderId === myUsername ||
                          emp.leaderUsername === myUsername;

                    
                    const rowStatus =
                      emp.status ||
                      (activeTab === "nghi-viec" ? "PENDING" : "");

                    return (
                      <tr key={rowId}>
                        <td className="col-center" style={{ color: "#6b7280" }}>
                          {index + 1}
                        </td>
                        <td>
                          <div>{emp.employeeCode || emp.code || "---"}</div>
                        </td>
                        <td>
                          <div className="employee-info">
                            <div>
                              <p className="emp-name">
                                {emp.employeeName || emp.fullName || "---"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td>
                          <span className="team-badge">
                            {emp.teamName ||
                              emp.departmentName ||
                              emp.team ||
                              "---"}
                          </span>
                        </td>
                        <td>{emp.submitDate || "---"}</td>

                        <td>
                          {isMyRecord ? (
                            <span className="badge-my-record">
                              {emp.leaderName} (Bạn)
                            </span>
                          ) : (
                            <span>{emp.leaderName || "---"}</span>
                          )}
                        </td>

                        <td>
                          <button
                            className="btn-view-content"
                            onClick={() => {
                              if (isMyRecord) {
                                setViewingContent(contentToView);
                              }
                            }}
                            disabled={!isMyRecord}
                            style={{
                              opacity: isMyRecord ? 1 : 0.5,
                              cursor: isMyRecord ? "pointer" : "not-allowed",
                              backgroundColor: isMyRecord
                                ? "#eff6ff"
                                : "#f3f4f6",
                              color: isMyRecord ? "#2563eb" : "#9ca3af",
                              borderColor: isMyRecord ? "#bfdbfe" : "#e5e7eb",
                            }}
                          >
                            {isMyRecord ? " Xem nội dung" : " Không thể xem"}
                          </button>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(rowStatus)}`}
                          >
                            <span className="status-dot"></span>
                            {STATUS_LABELS[rowStatus] || rowStatus}
                          </span>
                        </td>

                        <td className="col-center">
                          {renderActions(rowStatus, isMyRecord, emp)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="9"
                      style={{
                        textAlign: "center",
                        padding: "32px 0",
                        color: "#6b7280",
                        fontStyle: "italic",
                      }}
                    >
                      Chưa có nhân viên nào
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            <div className="pagination-container">
              <div className="pagination-info">
                Đang xem trang
                <span className="page-badge">{currentPage}</span>
              </div>
              <div className="pagination-actions">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1 || isLoading}
                  className="btn-page"
                >
                  <ChevronLeft size={18} strokeWidth={2.5} />
                  <span>Trang trước</span>
                </button>

                <button
                  onClick={handleNextPage}
                  disabled={displayData.length < pageSize || isLoading}
                  className="btn-page"
                >
                  <span>Trang sau</span>
                  <ChevronRight size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ConfirmDeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={executeDelete}
        onSuccess={() => fetchEmployees(currentPage, pageSize)}
      />
      <RegistrationFormsModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        employeeData={selectedEmployee}
        userInfo={userInfo}
        onRefresh={() => fetchEmployees(currentPage, pageSize, activeTab)}
        mode={modalMode}
        onSwitchToEmployee={switchToEmployeeModal}
        requestId={selectedEmployee?.requestId}
      />
      <SalaryApproveModal
        isOpen={isSalaryApproveModalOpen}
        onClose={() => setIsSalaryApproveModalOpen(false)}
        data={selectedSalaryRequest}
        onSuccess={() => fetchEmployees(currentPage, pageSize, activeTab)}
      />
      <TerminationApproveModal
        isOpen={isTerminationModalOpen}
        onClose={() => {
          setIsTerminationModalOpen(false);
          setSelectedTermination(null);
        }}
        data={selectedTermination}
        onSuccess={() => {
          fetchEmployees(currentPage, pageSize, activeTab);
        }}
      />
      {viewingContent && (
        <div
          className="content-modal-overlay"
          onClick={() => setViewingContent(null)}
        >
          <div
            className="content-modal-box"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="content-modal-header">
              <h3>Nội dung trình</h3>
              <button
                className="content-modal-close"
                onClick={() => setViewingContent(null)}
              >
                &times;
              </button>
            </div>
            <div className="content-modal-body">
              <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>
                {viewingContent}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
