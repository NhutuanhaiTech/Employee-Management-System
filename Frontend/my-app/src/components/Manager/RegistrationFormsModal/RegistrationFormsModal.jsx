import React, { useState, useEffect } from "react";
import {
  X,
  FileText,
  User,
  FileBadge,
  Save,
  Printer,
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Lock,
  Send,
  Loader2,
} from "lucide-react";
import "./RegistrationFormsModal.css";
import { toast } from "react-toastify";
import apiClient from "../../../lib/api";
export default function RegistrationFormsModal({
  isOpen,
  onClose,
  employeeData,
  userInfo,
  onRefresh,
  onSwitchToEmployee,
  mode,
}) {
  const currentStatus = employeeData?.employeeInfo?.status || "";
  console.log("Trạng thái hiện tại", currentStatus);
  console.log("thông tin nhân biểu mẫu viên hiện tại là: ", employeeData);
  console.log(
    "feedback của lãnh đạo là :",
    employeeData?.employeeInfo?.feedBack,
  );
  const leaderFeedback = employeeData?.employeeInfo?.feedback || "";
  const [leadersList, setLeadersList] = useState([]);
  
  const isLeader = userInfo?.roles?.some((role) =>
    role.toUpperCase().includes("LEADER"),
  );
  const leaderId = employeeData?.employeeInfo?.leaderId;
  const [leaderComments, setLeaderComments] = useState({
    1: "",
    2: "",
    3: "",
  });

  const handleLeaderCommentChange = (e) => {
    const value = e.target.value;
    setLeaderComments((prev) => ({
      ...prev,
      [activeTab]: value, 
    }));
  };

  
  const handleSaveLeaderComment = () => {
    const payload = {
      leaderComment: leaderComments[activeTab],
    };

    console.log(`[API MOCK] Đang gọi cập nhật ý kiến cho TAB ${activeTab}`);
    console.log("Dữ liệu chuẩn bị gửi đi:", payload);

    
    toast.success(`Đã lưu ý kiến tạm thời cho Biểu mẫu ${activeTab}`);
  };
  useEffect(() => {
    if (!isOpen) return;

    const fetchLeaders = async () => {
      try {
        const response = await apiClient.get("/api/users", {
          params: { roleName: "LEADER" },
        });
        const fetchedLeaders = response.data.data || [];
        setLeadersList(fetchedLeaders);

        
        if (leaderId) {
          const matchedLeader = fetchedLeaders.find(
            (leader) => String(leader.id) === String(leaderId),
          );

          if (matchedLeader) {
            setApprovalData((prev) => ({
              ...prev,
              selectedLeaderId: String(matchedLeader.id),
            }));
          }
        }
      } catch (error) {
        console.error("Lỗi tải danh sách lãnh đạo:", error);
      }
    };

    fetchLeaders();
  }, [isOpen, leaderId]);
  
  const [formIds, setFormIds] = useState({
    1: null,
    2: null,
    3: null,
  });

  const [isSavingTab, setIsSavingTab] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [showFinalConfirmAlert, setShowFinalConfirmAlert] = useState(false);
  
  const [activeTab, setActiveTab] = useState(1);
  const [savedTabs, setSavedTabs] = useState({ 1: false, 2: false, 3: false });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const savedCount = Object.values(savedTabs).filter(Boolean).length;

  
  const [resumeData, setResumeData] = useState({
    trainingSummary: "",
    workExperienceSummary: "",
    rewardsAndDiscipline: "",
  });

  const [cvData, setCvData] = useState({
    coreSkills: "",
    projectExperience: "",
    careerGoals: "",
    commitments: "",
  });

  const [proposalData, setProposalData] = useState({
    proposedPosition: employeeData?.department || "",
    proposedSalary: "",
    proposalReason: "",
  });
  
  const STATUS_CONFIG = {
    APPROVED: {
      label: "Đã phê duyệt",
      className: "rf-status--approved",
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      ),
    },
    UPDATE_REQUIRED: {
      label: "Yêu cầu cập nhật",
      className: "rf-status--update",
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      ),
    },
    REJECTED: {
      label: "Từ chối hồ sơ",
      className: "rf-status--rejected",
      icon: (
        <svg
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      ),
    },
  };
  const statusMeta = STATUS_CONFIG[currentStatus];
  
  const [approvalData, setApprovalData] = useState({
    submissionDate: new Date().toISOString().split("T")[0],
    senderName: userInfo?.fullName || "leader",
    selectedLeaderId: "",
    approvalContent: `Kính trình Lãnh đạo xem xét và phê duyệt hồ sơ đăng ký nhân viên ${employeeData?.fullName || "NV001"} - Bộ phận ${employeeData?.department || "N/A"}.`,
  });
  
  const selectedLeader = leadersList.find(
    (l) => String(l.id) === String(approvalData.selectedLeaderId),
  );
  const actualData = employeeData?.employeeInfo
    ? employeeData.employeeInfo
    : employeeData;
  const info = actualData || {
    id: "a1b2c3d4-e5f6-7a8b-9c0d-1e2f3a4b5c6d",
    fullName: "HẢI NHỮ TUẤN",
    employeeCode: "NV2026085",
    department: "Frontend Development",
    gender: "MALE",
    dob: "2026-08-06",
    idNumber: "017204001802",
    phone: "0339540969",
    email: "tuanhai218204@gmail.com",
    address: "",
    creator: "nhutuanhaimanager",
  };
  useEffect(() => {
    if (isOpen) {
      console.log("id nhân viên lấy ra được từ regis:", info.id);
      setActiveTab(1);
      setShowConfirmModal(false);
      setShowFinalConfirmAlert(false);
      const fetchEmployeeForms = async () => {
        try {
          const response = await apiClient.get(
            `/api/templates?employeeId=${info.id}`,
          );

          
          const templates = response.data.data; 
          console.log("data user template: ", templates);
          if (templates && templates.length > 0) {
            
            let newFormIds = { 1: null, 2: null, 3: null };
            let newSavedTabs = { 1: false, 2: false, 3: false };
            let newLeaderComments = { 1: "", 2: "", 3: "" };
            templates.forEach((template) => {
              const { id, formType, formData, leaderComment } = template;

              if (formType === "SO_YEU_LY_LICH") {
                
                setResumeData({
                  trainingSummary: formData?.trainingSummary || "",
                  workExperienceSummary: formData?.workExperienceSummary || "",
                  rewardsAndDiscipline: formData?.rewardsAndDiscipline || "",
                });
                console.log(resumeData);
                newFormIds[1] = id;
                newSavedTabs[1] = true;
                newLeaderComments[1] = leaderComment || "";
              } else if (formType === "DON_DANG_KI" || formType === "CV") {
                
                setCvData({
                  coreSkills: formData?.coreSkills || "",
                  projectExperience: formData?.projectExperience || "",
                  careerGoals: formData?.careerGoals || "",
                  commitments: formData?.commitments || "",
                });
                console.log(cvData);
                newFormIds[2] = id;
                newSavedTabs[2] = true;
                newLeaderComments[2] = leaderComment || "";
              } else if (formType === "BAO_CAO_DE_XUAT") {
                
                setProposalData({
                  proposedPosition: formData?.proposedPosition || "",
                  proposedSalary: formData?.proposedSalary || "",
                  proposalReason: formData?.proposalReason || "",
                });
                console.log(proposalData);
                newFormIds[3] = id;
                newSavedTabs[3] = true;
                newLeaderComments[3] = leaderComment || "";
              }
            });

            
            setFormIds(newFormIds);
            setSavedTabs(newSavedTabs);
            setLeaderComments(newLeaderComments);
          } else {
            resetAllFormsToEmpty();
            setActiveDecisionModal(null);
          }
        } catch (error) {
          console.error("Lỗi khi tải dữ liệu form:", error);
          resetAllFormsToEmpty();
        }
      };
      
      fetchEmployeeForms();
    }
  }, [isOpen, info.id]); 

  
  const resetAllFormsToEmpty = () => {
    setResumeData({
      trainingSummary: "",
      workExperienceSummary: "",
      rewardsAndDiscipline: "",
    });
    setCvData({
      coreSkills: "",
      projectExperience: "",
      careerGoals: "",
      commitments: "",
    });
    setProposalData({
      proposedPosition: info?.department || "",
      proposedSalary: "",
      proposalReason: "",
    });
    setLeaderComments({ 1: "", 2: "", 3: "" });
    setFormIds({ 1: null, 2: null, 3: null });
    setSavedTabs({ 1: false, 2: false, 3: false });
  };
  if (!isOpen) return null;

  
  const generatePayloadForTab = (tabIndex) => {
    const basePayload = { employeeId: info.id };

    if (tabIndex === 1)
      return {
        ...basePayload,
        formType: "SO_YEU_LY_LICH",
        formData: {
          fullName: info?.fullName,
          dateOfBirth: info.dob,
          phoneNumber: info.phone,
          address: info.address,
          trainingSummary: resumeData.trainingSummary,
          workExperienceSummary: resumeData.workExperienceSummary,
          rewardsAndDiscipline: resumeData.rewardsAndDiscipline,
        },
      };
    if (tabIndex === 2)
      return {
        ...basePayload,
        formType: "DON_DANG_KI",
        formData: {
          coreSkills: cvData.coreSkills,
          projectExperience: cvData.projectExperience,
          careerGoals: cvData.careerGoals,
          commitments: cvData.commitments,
        },
      };
    if (tabIndex === 3)
      return {
        ...basePayload,
        formType: "BAO_CAO_DE_XUAT",
        formData: {
          proposedPosition: proposalData.proposedPosition,
          proposedSalary: proposalData.proposedSalary,
          proposalReason: proposalData.proposalReason,
        },
      };
  };

  const handleSaveCurrentTab = async () => {
    setIsSavingTab(true);
    try {
      const currentPayload = generatePayloadForTab(activeTab);
      const currentFormId = formIds[activeTab];

      if (currentFormId) {
        console.log(
          `[PATCH] Đang gọi API cập nhật biểu mẫu ${activeTab} với ID: ${currentFormId}`,
        );
        const response = await apiClient.patch(
          `/api/templates/${currentFormId}`,
          currentPayload,
        );

        console.log("Kết quả Update từ server:", response.data);
        toast.success(`Đã cập nhật dữ liệu Biểu mẫu ${activeTab} thành công!`);
      } else {
        console.log(`[POST] Đang gọi API tạo mới biểu mẫu ${activeTab}...`);
        const response = await apiClient.post("/api/templates", currentPayload);
        const newlyCreatedId = response.data.data;
        setFormIds((prev) => ({ ...prev, [activeTab]: newlyCreatedId }));
        toast.success(`Đã tạo mới Biểu mẫu ${activeTab} thành công!`);
      }
      setSavedTabs((prev) => ({ ...prev, [activeTab]: true }));
      if (activeTab < 3) setActiveTab(activeTab + 1);
    } catch (error) {
      console.error(`Lỗi khi lưu biểu mẫu ${activeTab}:`, error);
      const errorMsg =
        error.response?.data?.message || "Vui lòng kiểm tra lại!";
      toast.error(`Lỗi cập nhật: ${errorMsg}`);
    } finally {
      setIsSavingTab(false);
    }
  };

  const handleQuickSaveAll = () => {
    setSavedTabs({ 1: true, 2: true, 3: true });
  };

  const handleFinalSubmitToLeader = () => {
    if (!approvalData.selectedLeaderId) {
      toast.error("Vui lòng chọn tên lãnh đạo nhận hồ sơ!");
      return;
    }
    setShowFinalConfirmAlert(true);
  };

  const executeFinalSubmit = async () => {
    setIsSubmitting(true);

    try {
      const finalPayload = {
        employeeId: info.id,
        leaderId: approvalData.selectedLeaderId,
        submitContent: approvalData.approvalContent,
        submitDate: approvalData.submissionDate,
      };

      console.log("Payload chuẩn bị gửi lên API Trình Lãnh Đạo:", finalPayload);
      const currentStatus = employeeData?.employeeInfo?.status;
      let response;
      if (currentStatus === "UPDATE_REQUIRED" || currentStatus === "REJECTED") {
        console.log("Đang gọi API PUT để Trình lại (Resubmit)...");
        response = await apiClient.put("/api/approval-requests", finalPayload);
      } else {
        console.log("Đang gọi API POST để Trình mới...");
        response = await apiClient.post("/api/approval-requests", finalPayload);
      }
      console.log("Kết quả từ server:", response.data);
      setIsSubmitting(false);
      const successMessage =
        currentStatus === "UPDATE_REQUIRED" || currentStatus === "REJECTED"
          ? "Đã cập nhật và trình lại lãnh đạo thành công!"
          : "Đã nộp form và trình lãnh đạo thành công!";
      toast.success(successMessage);

      if (onRefresh) {
        onRefresh();
      }
      setShowFinalConfirmAlert(false);
      setShowConfirmModal(false);
      onClose();
    } catch (error) {
      console.error("Lỗi khi trình lãnh đạo:", error);
      setIsSubmitting(false);
      const errorMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi trình lãnh đạo!";
      toast.error(errorMessage);
    }
  };

  
  const renderTab1 = () => (
    <div>
      <div className="rf-doc-header">
        <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
        <p className="underline">Độc lập - Tự do - Hạnh phúc</p>
        <p className="doc-number">Số hiệu biểu mẫu: BM-01/SYLL</p>
      </div>
      <div className="rf-profile-card">
        <div className="rf-avatar-box">
          {info?.fullName ? info?.fullName.substring(0, 2).toUpperCase() : "NV"}
        </div>
        <div className="rf-profile-info">
          <h2>SƠ YẾU LÝ LỊCH TỰ THUẬT</h2>
          <p>
            Mã hồ sơ: <strong>{info.employeeCode}</strong> • Bộ phận:{" "}
            <strong>{info.department}</strong>
          </p>
        </div>
      </div>
      <div>
        <h4 className="rf-section-title">I. THÔNG TIN BẢN THÂN</h4>
        <div
          className="rf-info-grid"
          style={{
            backgroundColor: "#eff6ff",
            padding: "16px",
            borderRadius: "4px",
          }}
        >
          <p>
            Họ và tên: <strong>{info?.fullName}</strong>
          </p>
          <p>
            Giới tính: <strong>{info.gender}</strong>
          </p>
          <p>
            Ngày sinh: <strong>{info.dob}</strong>
          </p>
          <p>
            Số CCCD: <strong>{info.idNumber}</strong>
          </p>
          <p>
            Điện thoại: <strong>{info.phone}</strong>
          </p>
          <p>
            Email: <strong>{info.email}</strong>
          </p>
        </div>
      </div>
      <div>
        <h4 className="rf-section-title">II. QUÁ TRÌNH ĐÀO TẠO & CÔNG TÁC</h4>
        <div className="rf-form-group">
          <label className="rf-label">1. Tóm tắt đào tạo:</label>
          <textarea
            className="rf-textarea"
            rows="3"
            readOnly={mode === "view"}
            value={resumeData.trainingSummary}
            onChange={(e) =>
              setResumeData({ ...resumeData, trainingSummary: e.target.value })
            }
          ></textarea>
        </div>
        <div className="rf-form-group">
          <label className="rf-label">2. Tóm tắt công tác:</label>
          <textarea
            readOnly={mode === "view"}
            className="rf-textarea"
            rows="3"
            value={resumeData.workExperienceSummary}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                workExperienceSummary: e.target.value,
              })
            }
          ></textarea>
        </div>
        <div className="rf-form-group">
          <label className="rf-label">3. Khen thưởng / Kỷ luật:</label>
          <input
            readOnly={mode === "view"}
            type="text"
            className="rf-input"
            value={resumeData.rewardsAndDiscipline}
            onChange={(e) =>
              setResumeData({
                ...resumeData,
                rewardsAndDiscipline: e.target.value,
              })
            }
          />
        </div>
      </div>
    </div>
  );

  const renderTab2 = () => (
    <div>
      <div className="rf-doc-header">
        <h2>HỒ SƠ NĂNG LỰC (CV) & ĐƠN ĐĂNG KÝ</h2>
        <p className="doc-number" style={{ marginTop: "8px" }}>
          Ứng viên: <strong>{info?.fullName}</strong> • Vị trí:{" "}
          <strong>{info.department}</strong>
        </p>
      </div>
      <div>
        <div className="rf-form-group">
          <label className="rf-label">1. KỸ NĂNG CHUYÊN MÔN:</label>
          <textarea
            readOnly={mode === "view"}
            className="rf-textarea"
            rows="4"
            value={cvData.coreSkills}
            onChange={(e) =>
              setCvData({ ...cvData, coreSkills: e.target.value })
            }
          ></textarea>
        </div>
        <div className="rf-form-group">
          <label className="rf-label">2. KINH NGHIỆM LÀM VIỆC:</label>
          <textarea
            readOnly={mode === "view"}
            className="rf-textarea"
            rows="4"
            value={cvData.projectExperience}
            onChange={(e) =>
              setCvData({ ...cvData, projectExperience: e.target.value })
            }
          ></textarea>
        </div>
        <div className="rf-form-group">
          <label className="rf-label">3. MỤC TIÊU NGHỀ NGHIỆP:</label>
          <textarea
            readOnly={mode === "view"}
            className="rf-textarea"
            rows="3"
            value={cvData.careerGoals}
            onChange={(e) =>
              setCvData({ ...cvData, careerGoals: e.target.value })
            }
          ></textarea>
        </div>
        <div className="rf-form-group">
          <label className="rf-label">4. CAM KẾT:</label>
          <textarea
            readOnly={mode === "view"}
            className="rf-textarea"
            rows="3"
            value={cvData.commitments}
            onChange={(e) =>
              setCvData({ ...cvData, commitments: e.target.value })
            }
          ></textarea>
        </div>
      </div>
    </div>
  );

  const renderTab3 = () => (
    <div>
      <div className="rf-doc-header">
        <h3>CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM</h3>
        <p className="underline">Độc lập - Tự do - Hạnh phúc</p>
        <h2 style={{ marginTop: "24px", fontSize: "20px" }}>
          BÁO CÁO ĐỀ XUẤT TIẾP NHẬN NHÂN SỰ
        </h2>
        <p className="doc-number">
          Kính gửi: Ban Giám đốc • Người đề xuất:{" "}
          <strong>{info.creator}</strong>
        </p>
      </div>
      <div className="rf-info-grid" style={{ marginTop: "24px" }}>
        <div className="rf-form-group">
          <label className="rf-label">VỊ TRÍ CÔNG VIỆC ĐỀ XUẤT *</label>
          <input
            type="text"
            readOnly={mode === "view"}
            className="rf-input"
            value={proposalData.proposedPosition}
            onChange={(e) =>
              setProposalData({
                ...proposalData,
                proposedPosition: e.target.value,
              })
            }
          />
        </div>
        <div className="rf-form-group">
          <label className="rf-label">MỨC LƯƠNG & ĐÃI NGỘ *</label>
          <input
            readOnly={mode === "view"}
            type="text"
            className="rf-input"
            value={proposalData.proposedSalary}
            onChange={(e) =>
              setProposalData({
                ...proposalData,
                proposedSalary: e.target.value,
              })
            }
          />
        </div>
        <div className="rf-form-group rf-col-span-2">
          <label className="rf-label">LÝ DO ĐỀ XUẤT *</label>
          <textarea
            readOnly={mode === "view"}
            className="rf-textarea"
            rows="5"
            value={proposalData.proposalReason}
            onChange={(e) =>
              setProposalData({
                ...proposalData,
                proposalReason: e.target.value,
              })
            }
          ></textarea>
        </div>
      </div>
    </div>
  );

  return (
    <div className="rf-modal-overlay">
      <div className="rf-modal-container">
        {/* HEADER MODAL */}
        <div className="rf-header">
          <div className="rf-header-left">
            <div className="rf-header-icon">
              <FileText size={24} />
            </div>
            <div>
              <h2 className="rf-header-title">
                Hồ Sơ Đăng Ký Nhân Viên & Biểu Mẫu{" "}
                <span className="rf-badge">Lưu mới</span>
              </h2>
              <p className="rf-header-desc">
                Nhân viên: {info?.fullName} ({info.employeeCode})
              </p>
              {statusMeta && (
                <div className={`rf-status-line ${statusMeta.className}`}>
                  <span className="rf-status-pill">
                    {statusMeta.icon}
                    <span>{statusMeta.label}</span>
                  </span>

                  
                  
                      <span className="rf-status-divider"></span>
                      <span
                        className="rf-status-feedback"
                        title={leaderFeedback}
                      >
                        <strong></strong> {employeeData?.employeeInfo?.feedBack}
                      </span>
                    
                  
                </div>
              )}
            </div>
          </div>
          <div className="rf-header-right">
            <button className="rf-btn-icon-only" onClick={onClose}>
              <X size={24} />
            </button>
          </div>
        </div>

        {/* BODY MODAL */}
        <div className="rf-body">
          {/* SIDEBAR TABS */}
          <div className="rf-sidebar">
            <div className="rf-sidebar-title">
              <span>DANH MỤC BIỂU MẪU (3)</span>
              <span style={{ color: savedCount === 3 ? "#059669" : "#d97706" }}>
                {savedCount}/3 đã lưu
              </span>
            </div>
            <div className="rf-sidebar-list">
              <div
                onClick={() => setActiveTab(1)}
                className={`rf-tab-item ${activeTab === 1 ? "active" : ""}`}
              >
                <div className="rf-tab-icon">
                  <User size={18} />
                </div>
                <div className="rf-tab-text">
                  <h4>1. Sơ yếu lý lịch</h4>
                  <p>BM-01/SYLL</p>
                </div>
                <span
                  className={`rf-tab-status ${savedTabs[1] ? "saved" : ""}`}
                >
                  {savedTabs[1] ? "Đã lưu" : "Chưa lưu"}
                </span>
              </div>
              <div
                onClick={() => setActiveTab(2)}
                className={`rf-tab-item ${activeTab === 2 ? "active" : ""}`}
              >
                <div className="rf-tab-icon">
                  <FileText size={18} />
                </div>
                <div className="rf-tab-text">
                  <h4>2. CV / Đơn đăng ký</h4>
                  <p>BM-02/CV</p>
                </div>
                <span
                  className={`rf-tab-status ${savedTabs[2] ? "saved" : ""}`}
                >
                  {savedTabs[2] ? "Đã lưu" : "Chưa lưu"}
                </span>
              </div>
              <div
                onClick={() => setActiveTab(3)}
                className={`rf-tab-item ${activeTab === 3 ? "active" : ""}`}
              >
                <div className="rf-tab-icon">
                  <FileBadge size={18} />
                </div>
                <div className="rf-tab-text">
                  <h4>3. Báo cáo đề xuất</h4>
                  <p>BM-04/BCĐX</p>
                </div>
                <span
                  className={`rf-tab-status ${savedTabs[3] ? "saved" : ""}`}
                >
                  {savedTabs[3] ? "Đã lưu" : "Chưa lưu"}
                </span>
              </div>
            </div>
          </div>

          {/* MAIN PAPER AREA */}
          <div className="rf-main-area">
            <div className="rf-paper">
              <div className="rf-paper-bookmark"></div>
              {activeTab === 1 && renderTab1()}
              {activeTab === 2 && renderTab2()}
              {activeTab === 3 && renderTab3()}

              {/* KHU VỰC Ý KIẾN LÃNH ĐẠO */}
              <div className="rf-leader-comment">
                <div
                  className="rf-leader-header"
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px",
                  }}
                >
                  <span
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      fontWeight: "bold",
                    }}
                  >
                    <User size={18} /> Ý KIẾN PHÊ DUYỆT CỦA LÃNH ĐẠO:
                  </span>

                  {/* Hiển thị huy hiệu tùy theo quyền */}
                  {isLeader ? (
                    <span
                      className="rf-leader-badge"
                      style={{
                        backgroundColor: "#dcfce3",
                        color: "#166534",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: "600",
                      }}
                    >
                      <Check size={14} /> Role Lãnh đạo: Được phép chỉnh sửa
                    </span>
                  ) : (
                    <span
                      className="rf-leader-badge"
                      style={{
                        backgroundColor: "#fef3c7",
                        color: "#b45309",
                        padding: "4px 10px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        fontWeight: "600",
                      }}
                    >
                      <Lock size={14} /> Role Quản lý: Chỉ xem
                    </span>
                  )}
                </div>

                <textarea
                  className="rf-textarea"
                  rows="4"
                  value={leaderComments[activeTab] || ""}
                  placeholder={
                    isLeader
                      ? "Lãnh đạo nhập ý kiến chỉ đạo tại đây..."
                      : "Chưa có ý kiến của lãnh đạo..."
                  }
                  value={leaderComments[activeTab] || ""} 
                  onChange={handleLeaderCommentChange}
                  disabled={!isLeader} 
                  style={{
                    width: "100%",
                    padding: "12px",
                    borderRadius: "6px",
                    border: "1px solid #d1d5db",
                    backgroundColor: isLeader ? "#ffffff" : "#f9fafb",
                    cursor: isLeader ? "text" : "not-allowed",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                ></textarea>

                {/* Nút lưu CHỈ XUẤT HIỆN khi có quyền LEADER */}
                {isLeader && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "flex-end",
                      marginTop: "12px",
                    }}
                  >
                    <button
                      type="button"
                      onClick={handleSaveLeaderComment}
                      style={{
                        backgroundColor: "#2563eb",
                        color: "white",
                        padding: "8px 20px",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer",
                        fontWeight: "600",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        boxShadow: "0 2px 4px rgba(37, 99, 235, 0.2)",
                      }}
                    >
                      Lưu ý kiến Tab {activeTab}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER MODAL */}
        <div className="rf-footer">
          <button
            className="rf-btn rf-btn-text"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              if (onSwitchToEmployee) onSwitchToEmployee(mode);
            }}
          >
            <FileText size={18} /> Xem lại thông tin cơ bản
          </button>

          <div className="rf-footer-right">
            <div className="rf-pagination">
              <button
                onClick={() => setActiveTab((prev) => Math.max(1, prev - 1))}
                disabled={activeTab === 1}
                className="rf-btn rf-btn-outline"
              >
                <ArrowLeft size={16} /> Trước
              </button>
              <span style={{ fontSize: "14px", fontWeight: "500" }}>
                Biểu mẫu {activeTab} / 3
              </span>
              <button
                onClick={() => setActiveTab((prev) => Math.min(3, prev + 1))}
                disabled={activeTab === 3}
                className="rf-btn rf-btn-outline"
              >
                Tiếp <ArrowRight size={16} />
              </button>
            </div>

            {/* NÚT LƯU LUÔN HIỆN ĐỂ SỬA NHÁP TRÊN BẤT KỲ TAB NÀO */}
            {mode === "edit" && (
              <button
                onClick={handleSaveCurrentTab}
                disabled={isSavingTab}
                className="rf-btn rf-btn-primary"
                style={{
                  opacity: isSavingTab ? 0.7 : 1,
                  cursor: isSavingTab ? "not-allowed" : "pointer",
                }}
              >
                {isSavingTab ? (
                  <>
                    <Loader2 size={18} className="rf-animate-spin" /> Đang
                    lưu...
                  </>
                ) : (
                  <>
                    <Save size={18} /> Lưu biểu mẫu {activeTab}
                  </>
                )}
              </button>
            )}
            {mode === "edit" &&
              savedCount === 3 &&
              currentStatus !== "PENDING" &&
              currentStatus !== "APPROVED" && (
                <button
                  onClick={() => setShowConfirmModal(true)}
                  className="rf-btn rf-btn-finish"
                  style={{
                    backgroundColor: "#059669",
                    color: "white",
                    fontWeight: "600",
                  }}
                >
                  <Send size={18} /> Trình Lãnh Đạo
                </button>
              )}

            <button onClick={onClose} className="rf-btn rf-btn-outline">
              Hủy
            </button>
          </div>
        </div>
      </div>

      {showConfirmModal && (
        <div className="rf-confirm-overlay">
          <div className="rf-confirm-modal">
            <div className="rf-confirm-header">
              <h3 className="rf-confirm-title">
                <Send size={20} /> Trình Lãnh Đạo Phê Duyệt
              </h3>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rf-btn-icon-only"
              >
                <X size={20} />
              </button>
            </div>

            <div className="rf-confirm-body">
              <div className="rf-confirm-grid">
                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label">
                    Ngày trình <span className="rf-require-label">*</span>
                  </label>
                  <input
                    type="date"
                    className="rf-input"
                    value={approvalData.submissionDate}
                    onChange={(e) =>
                      setApprovalData({
                        ...approvalData,
                        submissionDate: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="rf-form-group" style={{ margin: 0 }}>
                  <label className="rf-label">Người trình (Người gửi)</label>
                  <input
                    type="text"
                    className="rf-input"
                    value={approvalData.senderName}
                    disabled
                  />
                </div>
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">
                  Tên lãnh đạo nhận hồ sơ{" "}
                  <span className="rf-require-label">*</span>
                </label>
                <select
                  className="rf-select"
                  value={String(approvalData.selectedLeaderId || "")}
                  onChange={(e) =>
                    setApprovalData((prev) => ({
                      ...prev,
                      selectedLeaderId: e.target.value,
                    }))
                  }
                >
                  <option value="">-- Chọn lãnh đạo --</option>
                  {leadersList.map((leader) => (
                    <option key={leader.id} value={String(leader.id)}>
                      {leader?.fullName}
                    </option>
                  ))}
                </select>
              </div>
              {leaderId &&
                String(approvalData.selectedLeaderId) === String(leaderId) && (
                  <small
                    style={{
                      color: "#059669",
                      marginTop: "4px",
                      display: "block",
                      fontSize: "12px",
                    }}
                  >
                    ✓ Đã tự động chọn lãnh đạo phụ trách hồ sơ trước đó
                  </small>
                )}
              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">
                  Chức vụ lãnh đạo (Tự động điền)
                </label>
                <input
                  type="text"
                  className="rf-input"
                  value={selectedLeader ? selectedLeader.positionName : ""}
                  disabled
                />
              </div>

              <div className="rf-form-group" style={{ margin: 0 }}>
                <label className="rf-label">
                  Nội dung trình lãnh đạo{" "}
                  <span className="rf-require-label">*</span>
                </label>
                <textarea
                  className="rf-textarea"
                  rows="4"
                  value={approvalData.approvalContent}
                  onChange={(e) =>
                    setApprovalData({
                      ...approvalData,
                      approvalContent: e.target.value,
                    })
                  }
                ></textarea>
              </div>
            </div>

            <div className="rf-confirm-footer">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="rf-btn rf-btn-outline"
              >
                Hủy
              </button>
              <button
                onClick={handleFinalSubmitToLeader}
                className="rf-btn rf-btn-finish"
              >
                Gửi lãnh đạo
              </button>
              {showFinalConfirmAlert && (
                <div className="rf-confirm-overlay" style={{ zIndex: 1060 }}>
                  <div className="rf-confirm-modal" style={{ width: "420px" }}>
                    <div
                      className="rf-confirm-header"
                      style={{ borderBottom: "none", paddingBottom: "0" }}
                    >
                      <h3
                        className="rf-confirm-title"
                        style={{ color: "#b91c1c" }}
                      >
                        Xác nhận trình lãnh đạo
                      </h3>
                      {/* Khóa nút tắt chữ X nếu đang loading */}
                      <button
                        onClick={() =>
                          !isSubmitting && setShowFinalConfirmAlert(false)
                        }
                        className="rf-btn-icon-only"
                        disabled={isSubmitting}
                      >
                        <X size={20} />
                      </button>
                    </div>

                    <div
                      className="rf-confirm-body"
                      style={{
                        fontSize: "15px",
                        color: "#374151",
                        lineHeight: "1.5",
                        paddingTop: "12px",
                      }}
                    >
                      Bạn có chắc chắn muốn trình lãnh đạo phê duyệt hồ sơ này
                      không?
                      <br />
                      <br />
                      <div
                        style={{
                          backgroundColor: "#fef2f2",
                          padding: "12px",
                          borderRadius: "6px",
                          border: "1px solid #fecaca",
                        }}
                      >
                        <span
                          style={{
                            color: "#991b1b",
                            fontWeight: "500",
                            fontSize: "13px",
                          }}
                        >
                          * Lưu ý: Sau khi gửi, bạn sẽ không thể chỉnh sửa nội
                          dung 3 biểu mẫu này cho đến khi có phản hồi từ lãnh
                          đạo.
                        </span>
                      </div>
                    </div>

                    <div className="rf-confirm-footer">
                      <button
                        onClick={() => setShowFinalConfirmAlert(false)}
                        className="rf-btn rf-btn-outline"
                        disabled={isSubmitting}
                      >
                        Quay lại
                      </button>

                      <button
                        onClick={executeFinalSubmit}
                        disabled={isSubmitting}
                        className="rf-btn rf-btn-finish"
                        style={{
                          backgroundColor: "#059669",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          opacity: isSubmitting ? 0.7 : 1,
                          cursor: isSubmitting ? "not-allowed" : "pointer",
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 size={18} className="rf-animate-spin" />{" "}
                            Đang xử lý...
                          </>
                        ) : (
                          <>Vâng, Trình hồ sơ</>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
