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
  CircleDollarSign,
  CircleX,
} from "lucide-react";
import "./Dashboard.css";
import apiClient from "../../lib/api";
import Sidebar from "../../components/Manager/Sidebar";
import Header from "../../components/Manager/Header";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import EmployeeModal from "../../components/Manager/EmployeeModal/EmployeeModal";
import ConfirmDeleteModal from "../../components/Manager/ConfirmDeleteModal/ConfirmDeleteModal";
import RegistrationFormsModal from "../../components/Manager/RegistrationFormsModal/RegistrationFormsModal";
import SalaryIncreaseManager from "../../components/Manager/SalaryIncreaseManager/SalaryIncreaseManager";
import TerminationFormModal from "../../components/Manager/TerminationFormModal/TerminationFormModal";
export default function ManagerDashboard() {
 
  const TAB1_FILTER_OPTIONS = [
    { key: "ALL", label: "Tất cả" },
    { key: "DRAFT", label: "Lưu mới" },
    { key: "PENDING", label: "Chờ xử lý" },
    { key: "UPDATE_REQUIRED", label: "Yêu cầu bổ sung" },
    { key: "REJECTED", label: "Từ chối" },
  ];

 
  const TAB3_FILTER_OPTIONS = [
    { key: "ALL", label: "Tất cả" },
    { key: "APPROVED", label: "Đã duyệt" },
    { key: "TERMINATION_DRAFT", label: "Lưu mới kết thúc" },
    { key: "TERMINATION_PENDING", label: "Chờ duyệt kết thúc" },
    { key: "TERMINATION_UPDATE_REQUIRED", label: "Yêu cầu bổ sung kết thúc" },
    { key: "TERMINATED", label: "Đã kết thúc" },
    { key: "ARCHIVED", label: "Nộp lưu" },
  ];

  const TAB3_ALLOWED_STATUSES = [
    "APPROVED",
    "TERMINATION_DRAFT",
    "TERMINATION_PENDING",
    "TERMINATION_UPDATE_REQUIRED",
    "TERMINATED",
    "ARCHIVED",
  ];
  //status
  const STATUS_LABELS = {
    DRAFT: "Lưu mới",
    NEW: "Lưu mới",
    PENDING: "Chờ xử lý",
    UPDATE_REQUIRED: "Yêu cầu bổ sung",
    REJECTED: "Từ chối",
    APPROVED: "Đã duyệt",
    TERMINATION_DRAFT: "Lưu mới kết thúc",
    TERMINATION_PENDING: "Chờ duyệt kết thúc",
    TERMINATION_UPDATE_REQUIRED: "Yêu cầu bổ sung kết thúc",
    TERMINATED: "Đã kết thúc",
    ARCHIVED: "Nộp lưu",
  };
  
  const [statusFilter, setStatusFilter] = useState("ALL");
 
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);
  const [existingTermData, setExistingTermData] = useState(null);
  
  const [isSalaryModalOpen, setIsSalaryModalOpen] = useState(false);
  
  const [selectedEmp, setSelectedEmp] = useState(null);

  const currentActiveRole = location.pathname.toLowerCase().includes("/leader")
    ? "LEADER"
    : "MANAGER";
 
  const [formModalMode, setFormModalMode] = useState("");
  const switchToFormsModal = () => {
    setIsModalOpen(false);
    setIsFormModalOpen(true);
  };
  
  const switchToEmployeeModal = () => {
    setIsFormModalOpen(false);
    setIsModalOpen(true);
  };
 
  const [isWorkFilter, setIsWorkFilter] = useState(false);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);

  const [modalMode, setModalMode] = useState("create");
  
  const [activeTab, setActiveTab] = useState("tao-moi");
  
  const userInfo = useAuthStore((state) => state.userInfo);
  const myUsername = userInfo?.sub;
 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const [employees, setEmployees] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isLoading, setIsLoading] = useState(false);

  const fetchEmployees = async (page, size) => {
    setIsLoading(true);
    try {
      const response = await apiClient.get("/api/employees", {
        params: {
          isWork: isWorkFilter,
          page: page,
          size: size,
        },
      });
      const responseData = response.data.data;

      const fetchedEmployees = responseData.employees || [];
      const totalRecords = responseData.totalRecords || 0;
      setEmployees(fetchedEmployees);
      console.log(`Dữ liệu mảng employees trang ${page}:`, fetchedEmployees);
      console.log("dữ liệu nhân viên");
      console.log("thông tin quản lý: ", userInfo);
    } catch (error) {
      console.error("Lỗi khi tải danh sách:", error);
      toast.error(
        "Không thể tải danh sách nhân viên. Vui lòng kiểm tra quyền truy cập!",
      );
    } finally {
      setIsLoading(false);
    }
  };

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
      case "TERMINATION_DRAFT":
        return "status-draft";
      case "TERMINATION_PENDING":
        return "status-pending";
      case "UPDATE_REQUIRED":
      case "REQUIRE_UPDATE":
      case "TERMINATION_UPDATE_REQUIRED":
        return "status-warning";
      case "APPROVED":
        return "status-approved";
      case "REJECTED":
      case "TERMINATED":
        return "status-rejected";
      case "ARCHIVED":
        return "status-archived";
      default:
        return "";
    }
  };
  const handleStatusFilterChange = (statusKey) => {
    setStatusFilter(statusKey);
    setCurrentPage(1);

    if (activeTab === "tao-moi") {
      
      setIsWorkFilter(statusKey === "APPROVED");
    } else {
      const isTerminatedOrArchived = ["TERMINATED", "ARCHIVED"].includes(
        statusKey,
      );
      setIsWorkFilter(!isTerminatedOrArchived);
    }
  };

  useEffect(() => {
    if (activeTab === "tao-moi") {
      setIsWorkFilter(false);
    } else {
      setIsWorkFilter(true);
    }
    setStatusFilter("ALL");
    setCurrentPage(1);
  }, [activeTab]);
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
      const idXoa = deleteModal.employeeId.id;
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
    const handleOpenSubmitForm = (employee) => {
      console.log("id nhân viên: ", employee.id);
      setSelectedEmployee(employee);
      setIsFormModalOpen(true);
    };
    const handleView = async () => {
      try {
        setFindEmpById(employee);
        console.log("id nhân viên :", employee.id);
        const response = await apiClient.get(`/api/employees/${employee.id}`);
        const employeeDetail = response.data;
        setFindEmpById(employeeDetail);
        console.log("Nhân viên lấy ra:", employeeDetail);
        setSelectedEmployee(employeeDetail);
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
    const handleOpenNewTermination = (employee) => {
      setSelectedEmp(employee);
      setExistingTermData(null);
      setIsTermModalOpen(true);
    };
    const handleOpenSalaryManager = () => {
      setSelectedEmployee(employee);
      setIsSalaryModalOpen(true);
    };
    const handleUpdate = async () => {
      try {
        const response = await apiClient.get(`/api/employees/${employee.id}`);
        const employeeDetail = response.data;
        setSelectedEmployee(employeeDetail);
        console.error("chi tiết nhân viên sdjkhskfhfg:", employeeDetail);
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
          {/* <button
            className="btn-icon btn-icon-green"
            title="Trình lãnh đạo"
            onClick={() => handleOpenSubmitForm(employee)}
          >
            <Send size={16} />
          </button> */}
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
            className="btn-icon btn-icon-gray"
            title="Xem chi tiết"
            onClick={() => handleView(employee)}
          >
            <Eye size={16} />
          </button>
        </div>
      );
    }
    if (status === "UPDATE_REQUIRED") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Chỉnh sửa"
            onClick={() => handleUpdate(employee)}
          >
            <FileUp size={16} />
          </button>
        </div>
      );
    }
    if (status === "REJECTED") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Chỉnh sửa"
            onClick={() => handleUpdate(employee)}
          >
            <FileUp size={16} />
          </button>
          {/* <button
            className="btn-icon btn-icon-red"
            title="Xóa"
            onClick={() => handleDeleteClick(employee)}
          >
            <Trash2 size={16} />
          </button> */}
        </div>
      );
    }
    if (status === "APPROVED") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Chỉnh sửa"
            onClick={() => handleView(employee)}
          >
            <Eye size={16} />
          </button>
          <button
            className="btn-icon btn-icon-green"
            title="Tăng lương"
            onClick={() => handleOpenSalaryManager()}
          >
            <CircleDollarSign size={16} />
          </button>
          <button
            className="btn-icon btn-icon-red"
            title="Nghỉ việc"
            onClick={() => handleOpenNewTermination(employee)}
          >
            <CircleX size={16} />
          </button>
        </div>
      );
    }
    if (
      status === "TERMINATION_DRAFT" ||
      status === "TERMINATION_UPDATE_REQUIRED"
    ) {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Chỉnh sửa"
            onClick={() => handleView(employee)}
          >
            <Eye size={16} />
          </button>
          <button
            className="btn-icon btn-icon-green"
            title="Tăng lương"
            onClick={() => handleOpenSalaryManager()}
          >
            <CircleDollarSign size={16} />
          </button>
          <button
            className="btn-icon btn-icon-red"
            title="Nghỉ việc"
            onClick={() => handleOpenNewTermination(employee)}
          >
            <CircleX size={16} />
          </button>
        </div>
      );
    }
    if (status === "TERMINATION_PENDING") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Xem đơn nghỉ việc đang chờ duyệt"
            onClick={() => handleOpenNewTermination(employee)}
          >
            <Eye size={16} />
          </button>
        </div>
      );
    }
    if (status === "TERMINATED") {
      return (
        <div className="actions-group">
          <button
            className="btn-icon btn-icon-blue"
            title="Xem đơn nghỉ việc đang chờ duyệt"
            // onClick={() => handleOpenNewTermination(employee)}
          >
            
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

  useEffect(() => {
    fetchEmployees(currentPage, pageSize);
  }, [currentPage, pageSize, isWorkFilter]);
  useEffect(() => {
    if (activeTab === "da-duyet") {
      setIsWorkFilter(true);
    } else {
      setIsWorkFilter(false);
    }
    setCurrentPage(1);
  }, [activeTab]);
  const filteredTab1Employees = (employees || []).filter((emp) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "DRAFT") return ["DRAFT", "NEW"].includes(emp.status);
    if (statusFilter === "UPDATE_REQUIRED") {
      return ["UPDATE_REQUIRED", "REQUIRE_UPDATE"].includes(emp.status);
    }
    return emp.status === statusFilter;
  });
  const approvedEmployees =
    employees?.filter((emp) =>
      ["TERMINATION_DRAFT", "TERMINATION_UPDATE_REQUIRED"].includes(emp.status),
    ) || [];
  const filteredTab3Employees = (employees || []).filter((emp) => {
    if (statusFilter === "ALL") {
      return TAB3_ALLOWED_STATUSES.includes(emp.status);
    }
    return emp.status === statusFilter;
  });
  // Lọc danh sách cho tab "tao-moi" dựa trên pill đang chọn
  const filteredNewEmployees = (employees || []).filter((emp) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "DRAFT") {
      return ["DRAFT", "NEW"].includes(emp.status);
    }
    if (statusFilter === "UPDATE_REQUIRED") {
      return ["UPDATE_REQUIRED", "REQUIRE_UPDATE"].includes(emp.status);
    }
    return emp.status === statusFilter;
  });

  const displayData =
    activeTab === "tao-moi" ? filteredTab1Employees : filteredTab3Employees;
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
            <div className="status-filter-bar">
              <span className="status-filter-label">LỌC TRẠNG THÁI:</span>
              <div className="status-filter-pills">
                {(activeTab === "tao-moi"
                  ? TAB1_FILTER_OPTIONS
                  : TAB3_FILTER_OPTIONS
                ).map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    className={`status-pill-btn pill-${item.key} ${
                      statusFilter === item.key ? "active" : ""
                    }`}
                    onClick={() => handleStatusFilterChange(item.key)}
                  >
                    <span className="pill-dot"></span>
                    {item.label}
                  </button>
                ))}
              </div>
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
                  <th>NGÀY SINH</th>
                  <th>VỊ TRÍ</th>
                  <th>TEAM</th>
                  <th>LIÊN HỆ</th>
                  <th>NGƯỜI TẠO</th>
                  <th>TRẠNG THÁI</th>
                  <th className="col-center" style={{ textAlign: "center" }}>
                    THAO TÁC
                  </th>
                </tr>
              </thead>
              <tbody>
                {displayData && displayData.length > 0 ? (
                  displayData.map((emp, index) => {
                    const isMyRecord = emp.usernameCreated === myUsername;
                    return (
                      <tr key={emp.id}>
                        <td className="col-center" style={{ color: "#6b7280" }}>
                          {index + 1}
                        </td>
                        <td>
                          <div>{emp.employeeCode}</div>
                        </td>
                        <td>
                          <div className="employee-info">
                            <div>
                              <p className="emp-name">{emp.fullName}</p>
                              <p className="emp-sub">CCCD: {emp.idNumber}</p>
                            </div>
                          </div>
                        </td>

                        <td>{emp.dob}</td>
                        <td>{emp.positionName}</td>

                        <td>
                          <span className="team-badge">{emp.teamName}</span>
                        </td>

                        <td>
                          <p className="contact-phone">{emp.phone}</p>
                          <p className="contact-email">{emp.email}</p>
                        </td>

                        <td>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "row",
                              gap: "4px",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: isMyRecord ? "600" : "normal",
                                color: isMyRecord ? "#059669" : "inherit",
                                backgroundColor: isMyRecord
                                  ? "#ecfdf5"
                                  : "transparent",
                                padding: isMyRecord ? "4px 10px" : "0",
                                borderRadius: isMyRecord ? "16px" : "0",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                fontSize: "14px",
                                border: isMyRecord
                                  ? "1px solid #a7f3d0"
                                  : "none",
                              }}
                            >
                              {emp.usernameCreated}
                              {isMyRecord && (
                                <span
                                  style={{ fontSize: "12px", opacity: 0.8 }}
                                >
                                  (bạn)
                                </span>
                              )}
                            </span>
                          </div>
                        </td>

                        <td>
                          <span
                            className={`status-badge ${getStatusClass(emp.status)}`}
                          >
                            <span className="status-dot"></span>
                            {STATUS_LABELS[emp.status] || emp.status}
                          </span>
                        </td>

                        <td className="col-center">
                          {renderActions(emp.status, isMyRecord, emp)}
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="10"
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
                  disabled={employees.length < pageSize || isLoading}
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
        onRefresh={fetchEmployees}
        mode={modalMode}
        onSwitchToEmployee={switchToEmployeeModal}
      />
      <SalaryIncreaseManager
        isOpen={isSalaryModalOpen}
        onClose={() => setIsSalaryModalOpen(false)}
        employeeData={selectedEmployee}
      />
      <TerminationFormModal
        isOpen={isTermModalOpen}
        onClose={() => setIsTermModalOpen(false)}
        employee={selectedEmp}
        existingData={existingTermData}
        onSuccess={() => fetchEmployees(currentPage, pageSize)}
      />
      ;
    </div>
  );
}
