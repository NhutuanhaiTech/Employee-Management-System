import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../lib/api";

export default function SalaryApproveModal({
  isOpen,
  onClose,
  data,
  onSuccess,
}) {
  
  const [leaderComment, setLeaderComment] = useState("");

  
  const today = new Date().toISOString().split("T")[0];
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [feedbackDate, setFeedbackDate] = useState(today);
  const [feedback, setFeedback] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  
  useEffect(() => {
    if (isOpen) {
      setLeaderComment(data?.decision?.leaderComment || "");
      setFeedback("");
      setFeedbackDate(today);
      setIsConfirmOpen(false);
    }
  }, [isOpen, data, today]);

  if (!isOpen || !data) return null;

  const decision = data.decision || {};

  const handleOpenConfirm = (status) => {
    if (!leaderComment || !leaderComment.trim()) {
      toast.warning(
        "Vui lòng nhập Ý kiến nhận xét đính kèm Quyết định trước khi xử lý!",
      );
      return;
    }
    setSelectedStatus(status);
    setIsConfirmOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!feedback.trim() && selectedStatus !== "APPROVED") {
      toast.warning(
        "Vui lòng nhập Nội dung phản hồi khi Từ chối hoặc Yêu cầu bổ sung!",
      );
      return;
    }
    console.log("=== SUBMIT THÔNG TIN PHÊ DUYỆT ===");
    console.log("1. Leader Comment (Từ form lớn):", leaderComment);
    console.log("2. Trạng thái (targetStatus):", selectedStatus);
    console.log("3. Ngày phản hồi (feedbackDate):", feedbackDate);
    console.log("4. Nội dung phản hồi (feedback):", feedback);

    setIsSubmitting(true);
    try {
      
      if (decision.id) {
        await apiClient.patch(
          `/api/salary-increase-decisions/${decision.id}/leader-comment`,
          { leaderComment: leaderComment },
        );
      }

      
      const respondPayload = {
        targetStatus: selectedStatus,
        feedback: feedback,
        feedbackDate: feedbackDate,
      };

      await apiClient.patch(
        `/api/salary-increase-requests/${data.requestId}/respond`,
        respondPayload,
      );

      toast.success("Xử lý đề xuất tăng lương thành công!");

      
      setIsConfirmOpen(false);
      onClose();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("❌ Lỗi khi xử lý đề xuất:", error);
      toast.error(
        error.response?.data?.message || "Có lỗi xảy ra khi gửi phê duyệt!",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  
  const getConfirmConfig = () => {
    switch (selectedStatus) {
      case "REJECTED":
        return { title: "XÁC NHẬN TỪ CHỐI", color: "#ef4444" };
      case "UPDATE_REQUIRED":
        return { title: "YÊU CẦU BỔ SUNG", color: "#eab308" };
      case "APPROVED":
        return { title: "XÁC NHẬN PHÊ DUYỆT", color: "#22c55e" };
      default:
        return { title: "XÁC NHẬN", color: "#3b82f6" };
    }
  };
  const confirmConfig = getConfirmConfig();

  return (
    <>
     
      <div style={styles.overlay}>
        <div style={styles.modalContainer}>
          <button style={styles.closeBtn} onClick={onClose}>
            ✕
          </button>

          <h2 style={styles.title}>PHÊ DUYỆT ĐỀ XUẤT TĂNG LƯƠNG</h2>

          <div style={styles.contentScroll}>
           
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>
                I. Thông tin Tờ trình & Quyết định
              </h3>
              <div style={styles.grid2}>
                <ReadOnlyField label="Mã nhân viên" value={data.employeeCode} />
                <ReadOnlyField label="Họ và tên" value={data.employeeName} />
                <ReadOnlyField label="Người trình" value={data.submitterName} />
                <ReadOnlyField label="Ngày trình" value={data.submitDate} />
                <ReadOnlyField
                  label="Số quyết định"
                  value={decision.decisionNumber}
                />
                <ReadOnlyField
                  label="Ngày hiệu lực (QĐ)"
                  value={decision.effectiveDate}
                />
              </div>
              <div
                style={{
                  marginTop: "12px",
                  display: "flex",
                  gap: "12px",
                  flexDirection: "column",
                }}
              >
                <ReadOnlyField
                  label="Lý do tăng lương (Tờ trình)"
                  value={data.submitContent}
                  isTextArea
                />
                <ReadOnlyField
                  label="Căn cứ & Nội dung (Quyết định)"
                  value={decision.decisionContent}
                  isTextArea
                />
              </div>
            </div>

           
            <div style={styles.section}>
              <h3 style={styles.sectionTitle}>II. Ý kiến của Lãnh đạo</h3>
              <div style={styles.fieldGroup}>
                <label style={styles.label}>
                  Nhận xét đính kèm Quyết định (Leader Comment)
                </label>
                <textarea
                  readOnly={data.status !== "PENDING"}
                  style={styles.inputActive}
                  rows={3}
                  placeholder="Nhập ý kiến đánh giá của Lãnh đạo..."
                  value={leaderComment}
                  onChange={(e) => setLeaderComment(e.target.value)}
                />
              </div>
            </div>
          </div>

         
          <div style={styles.footer}>
            <div style={{ flex: 1 }}>
              <button style={styles.btnCancel} onClick={onClose}>
                Đóng
              </button>
            </div>
            {data?.status === "PENDING" && (
              <div style={{ display: "flex", gap: "12px" }}>
                <button
                  style={{ ...styles.btn, backgroundColor: "#ef4444" }}
                  onClick={() => handleOpenConfirm("REJECTED")}
                >
                  Từ chối
                </button>
                <button
                  style={{
                    ...styles.btn,
                    backgroundColor: "#eab308",
                    color: "#000",
                  }}
                  onClick={() => handleOpenConfirm("UPDATE_REQUIRED")}
                >
                  Yêu cầu bổ sung
                </button>
                <button
                  style={{ ...styles.btn, backgroundColor: "#22c55e" }}
                  onClick={() => handleOpenConfirm("APPROVED")}
                >
                  Phê duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {isConfirmOpen && (
        <div style={styles.smallOverlay}>
          <div style={styles.smallModal}>
            <h3 style={{ ...styles.smallTitle, color: confirmConfig.color }}>
              {confirmConfig.title}
            </h3>

            <div style={styles.fieldGroup}>
              <label style={styles.label}>
                Ngày phản hồi <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="date"
                style={styles.inputActive}
                value={feedbackDate}
                onChange={(e) => setFeedbackDate(e.target.value)}
              />
            </div>

            <div style={{ ...styles.fieldGroup, marginTop: "16px" }}>
              <label style={styles.label}>
                Nội dung phản hồi (Feedback){" "}
                {selectedStatus !== "APPROVED" && (
                  <span style={{ color: "red" }}>*</span>
                )}
              </label>
              <textarea
                style={styles.inputActive}
                rows={4}
                placeholder="Nhập lý do gửi về cho nhân sự..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div style={styles.smallFooter}>
              <button
                style={styles.btnCancel}
                onClick={() => setIsConfirmOpen(false)}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                style={{ ...styles.btn, backgroundColor: confirmConfig.color }}
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


const ReadOnlyField = ({ label, value, isTextArea }) => (
  <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
    <label style={styles.label}>{label}</label>
    {isTextArea ? (
      <textarea
        style={styles.readOnlyInput}
        value={value || "---"}
        readOnly
        rows={2}
      />
    ) : (
      <input
        style={styles.readOnlyInput}
        type="text"
        value={value || "---"}
        readOnly
      />
    )}
  </div>
);


const styles = {
  
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    backdropFilter: "blur(2px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modalContainer: {
    backgroundColor: "#fff",
    width: "850px",
    maxWidth: "95%",
    maxHeight: "90vh",
    borderRadius: "12px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  closeBtn: {
    position: "absolute",
    top: "16px",
    right: "20px",
    background: "none",
    border: "none",
    fontSize: "22px",
    cursor: "pointer",
    color: "#6b7280",
  },
  title: {
    textAlign: "center",
    color: "#1e3a8a",
    margin: "20px 0",
    fontSize: "22px",
    fontWeight: "bold",
  },
  contentScroll: {
    flex: 1,
    overflowY: "auto",
    padding: "0 24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  section: {
    backgroundColor: "#f9fafb",
    padding: "16px 20px",
    borderRadius: "8px",
    border: "1px solid #e5e7eb",
  },
  sectionTitle: {
    margin: "0 0 16px 0",
    fontSize: "16px",
    color: "#111827",
    borderBottom: "2px solid #e5e7eb",
    paddingBottom: "8px",
    textTransform: "uppercase",
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" },
  fieldGroup: { display: "flex", flexDirection: "column", gap: "6px" },
  label: { fontSize: "13px", fontWeight: "700", color: "#4b5563" },
  readOnlyInput: {
    padding: "8px 12px", 
    borderRadius: "6px", 
    border: "1px solid #d1d5db", 
    backgroundColor: "#f3f4f6", 
    color: "#111827",           
    fontWeight: "500",          
    fontSize: "14px", 
    cursor: "not-allowed", 
    outline: "none", 
    resize: "none",
  },
  inputActive: {
    padding: "10px 12px",
    borderRadius: "6px",
    border: "1px solid #3b82f6",
    backgroundColor: "#fff",
    fontSize: "14px",
    outline: "none",
    resize: "vertical",
  },
  footer: {
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: "0 0 12px 12px",
    marginTop: "10px",
  },
  btnCancel: {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    borderRadius: "6px",
    backgroundColor: "#fff",
    color: "#374151",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },
  btn: {
    padding: "10px 16px",
    border: "none",
    borderRadius: "6px",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer",
    fontSize: "14px",
  },

  
  smallOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    backdropFilter: "blur(4px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2000,
  },
  smallModal: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "8px",
    width: "450px",
    maxWidth: "90%",
    boxShadow:
      "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  smallTitle: {
    marginTop: 0,
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "18px",
  },
  smallFooter: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    marginTop: "24px",
  },
};
