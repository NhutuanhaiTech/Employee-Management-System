import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";

import "./TerminationApproveModal.css";
import apiClient from "../../../lib/api";

const ACTION_CONFIG = {
  REJECTED: {
    title: "Xác nhận Từ chối yêu cầu",
    confirmBtnText: "Xác nhận Từ chối",
    btnClass: "tam-btn-reject",
    endpointSuffix: "reject",
    requiresFeedback: true,
    description:
      "Bạn đang thực hiện TỪ CHỐI hồ sơ kết thúc lao động này. Vui lòng chọn ngày và nhập lý do từ chối.",
  },
  UPDATE_REQUIRED: {
    title: "Yêu cầu bổ sung hồ sơ",
    confirmBtnText: "Gửi yêu cầu bổ sung",
    btnClass: "tam-btn-update",
    endpointSuffix: "require-update",
    requiresFeedback: true
  },
  APPROVED: {
    title: "Xác nhận Phê duyệt yêu cầu",
    confirmBtnText: "Xác nhận Phê duyệt",
    btnClass: "tam-btn-approve",
    endpointSuffix: "approve",
    requiresFeedback: false,
    description:
      "Bạn đang thực hiện PHÊ DUYỆT quyết định kết thúc hồ sơ lao động cho nhân viên này. Vui lòng chọn ngày quyết định.",
  },
};

export default function TerminationApproveModal({
  isOpen,
  onClose,
  data, 
  onSuccess, 
}) {
  
  
  
  const [leaderComment, setLeaderComment] = useState("");
  const [confirmAction, setConfirmAction] = useState(null); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decisionForm, setDecisionForm] = useState({
    decisionDate: new Date().toISOString().split("T")[0],
    leaderFeedback: "",
  });

  
  
  
  const handleApiError = (error, defaultMessage) => {
    console.error("❌ Chi tiết lỗi API:", error);

    if (error.response) {
      const { status, data: resData } = error.response;
      console.error(`--> Status: ${status}`, resData);

      
      if (resData?.errors) {
        if (Array.isArray(resData.errors)) {
          resData.errors.forEach((err) =>
            toast.error(err.defaultMessage || err.message || String(err))
          );
          return;
        }
        if (typeof resData.errors === "object") {
          Object.values(resData.errors).forEach((msg) =>
            toast.error(String(msg))
          );
          return;
        }
      }

      if (status === 403) {
        toast.error(
          "Lỗi 403: Bạn không có quyền thực hiện thao tác này (Yêu cầu quyền LEADER)!"
        );
        return;
      }

      const serverMsg = resData?.message || resData?.error || defaultMessage;
      toast.error(`Lỗi (${status}): ${serverMsg}`);
    } else if (error.request) {
      toast.error(
        "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng hoặc Backend!"
      );
    } else {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    }
  };

  
  
  
  useEffect(() => {
    if (isOpen && data) {
      setLeaderComment(data.leaderComment || "");
      setConfirmAction(null);
      setIsSubmitting(false);
      setDecisionForm({
        decisionDate: new Date().toISOString().split("T")[0],
        leaderFeedback: "",
      });
    }
  }, [isOpen, data]);

  if (!isOpen || !data) return null;

  const targetRequestId = data.requestId || data.id;
  const isPending = !data.status || data.status === "PENDING";

  
  const saveLeaderComment = async (requestId, commentValue) => {
    const commentPayload = {
      leaderComment: commentValue.trim(),
    };

    console.log(
      `=== [PATCH] /api/termination-forms/${requestId}/leader-comment ===`,
      commentPayload
    );

    const response = await apiClient.patch(
      `/api/termination-forms/${requestId}/leader-comment`,
      commentPayload
    );
    console.log("✅ Kết quả lưu leaderComment:", response.data);
    return response.data;
  };

 
  const submitLeaderDecision = async (actionType, requestId, formValues) => {
    const config = ACTION_CONFIG[actionType];

    
    const decisionPayload = config.requiresFeedback
      ? {
          decisionDate: formValues.decisionDate,
          leaderFeedback: formValues.leaderFeedback.trim(),
        }
      : {
          decisionDate: formValues.decisionDate,
        };

    console.log(
      `=== [PATCH] /api/termination-requests/${requestId}/${config.endpointSuffix} ===`,
      decisionPayload
    );

    const response = await apiClient.patch(
      `/api/termination-requests/${requestId}/${config.endpointSuffix}`,
      decisionPayload
    );
    console.log(`✅ Kết quả ${config.endpointSuffix}:`, response.data);
    return response.data;
  };

  
  
  

  const handleOpenConfirmModal = (actionType) => {
    if (!leaderComment.trim()) {
      toast.warning(
        "Vui lòng nhập nhận xét của Lãnh đạo (Leader Comment) trước khi xử lý!"
      );
      return;
    }

    setDecisionForm({
      decisionDate: new Date().toISOString().split("T")[0],
      leaderFeedback: "",
    });
    setConfirmAction(actionType);
  };

  const handleFinalConfirmSubmit = async (e) => {
    e.preventDefault();

    const config = ACTION_CONFIG[confirmAction];
    if (!decisionForm.decisionDate) {
      toast.warning("Vui lòng chọn ngày quyết định!");
      return;
    }
    if (config.requiresFeedback && !decisionForm.leaderFeedback.trim()) {
      toast.warning("Vui lòng nhập ý kiến phản hồi!");
      return;
    }

    setIsSubmitting(true);
    try {
      
      await saveLeaderComment(targetRequestId, leaderComment);

      
      const resDecision = await submitLeaderDecision(
        confirmAction,
        targetRequestId,
        decisionForm
      );

      toast.success(
        resDecision?.message || `${config.confirmBtnText} thành công!`
      );

      setConfirmAction(null);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      handleApiError(error, `Lỗi khi thực hiện ${config.confirmBtnText}!`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const activeConfig = confirmAction ? ACTION_CONFIG[confirmAction] : null;

  
  const isConfirmFormValid =
    Boolean(decisionForm.decisionDate) &&
    (!activeConfig?.requiresFeedback ||
      Boolean(decisionForm.leaderFeedback.trim()));

  
  
  
  return (
    <>
     
      <div className="tam-overlay">
        <div className="tam-modal">
          <div className="tam-header">
            <div className="tam-header-title-group">
              <h3 className="tam-title">PHÊ DUYỆT YÊU CẦU KẾT THÚC HỒ SƠ</h3>
              {data.status && (
                <span className="tam-status-pill">{data.status}</span>
              )}
            </div>
            <button
              className="tam-close-btn"
              onClick={onClose}
              disabled={isSubmitting}
              title="Đóng"
            >
              ×
            </button>
          </div>

          <div className="tam-body">
            {/* PHẦN I: THÔNG TIN CHỈ ĐỌC */}
            <div className="tam-section">
              <h4 className="tam-section-title">
                I. Thông tin tờ trình kết thúc hồ sơ
              </h4>

              <div className="tam-grid-2">
                <div className="tam-field">
                  <label className="tam-label">Mã nhân viên</label>
                  <input
                    type="text"
                    className="tam-readonly-input"
                    value={data.employeeCode || "---"}
                    readOnly
                  />
                </div>

                <div className="tam-field">
                  <label className="tam-label">Họ và tên nhân viên</label>
                  <input
                    type="text"
                    className="tam-readonly-input"
                    value={data.employeeName || "---"}
                    readOnly
                  />
                </div>

                <div className="tam-field">
                  <label className="tam-label">Phòng ban</label>
                  <input
                    type="text"
                    className="tam-readonly-input"
                    value={data.departmentName || "---"}
                    readOnly
                  />
                </div>

                <div className="tam-field">
                  <label className="tam-label">Người trình (Manager)</label>
                  <input
                    type="text"
                    className="tam-readonly-input"
                    value={data.submitterName || "---"}
                    readOnly
                  />
                </div>

                <div className="tam-field">
                  <label className="tam-label">Ngày trình</label>
                  <input
                    type="text"
                    className="tam-readonly-input"
                    value={data.submitDate || "---"}
                    readOnly
                  />
                </div>

                <div className="tam-field">
                  <label className="tam-label">Lãnh đạo phê duyệt</label>
                  <input
                    type="text"
                    className="tam-readonly-input"
                    value={
                      data.leaderName
                        ? `${data.leaderName}${
                            data.leaderPosition ? ` (${data.leaderPosition})` : ""
                          }`
                        : "---"
                    }
                    readOnly
                  />
                </div>
              </div>

              <div className="tam-field tam-field-full">
                <label className="tam-label">
                  Nội dung trình lãnh đạo (Submit Note)
                </label>
                <textarea
                  className="tam-readonly-input tam-readonly-textarea"
                  rows={3}
                  value={data.submitNote || "Không có nội dung ghi chú"}
                  readOnly
                />
              </div>
            </div>

            {/* PHẦN II: NHẬP Ý KIẾN LÃNH ĐẠO */}
            <div className="tam-section">
              <h4 className="tam-section-title">
                II. Nhận xét của Lãnh đạo (Leader Comment)
              </h4>

              <div className="tam-field">
                <label className="tam-label">
                  Nội dung nhận xét đính kèm biểu mẫu{" "}
                  <span className="tam-req">*</span>
                </label>
                <textarea
                  className={
                    isPending
                      ? "tam-active-input"
                      : "tam-readonly-input tam-readonly-textarea"
                  }
                  rows={3}
                  placeholder="Nhập nhận xét của lãnh đạo về hồ sơ kết thúc này..."
                  value={leaderComment}
                  onChange={(e) => setLeaderComment(e.target.value)}
                  readOnly={!isPending || isSubmitting}
                />
                {isPending && (
                  <span className="tam-hint">
                    * Nhận xét này sẽ được lưu tự động khi bạn xác nhận một trong
                    các quyết định bên dưới.
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="tam-footer">
            <button
              className="tam-btn tam-btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Đóng
            </button>

            {isPending && (
              <div className="tam-action-group">
                <button
                  className="tam-btn tam-btn-reject"
                  onClick={() => handleOpenConfirmModal("REJECTED")}
                  disabled={isSubmitting}
                >
                  Từ chối
                </button>
                <button
                  className="tam-btn tam-btn-update"
                  onClick={() => handleOpenConfirmModal("UPDATE_REQUIRED")}
                  disabled={isSubmitting}
                >
                  Yêu cầu bổ sung
                </button>
                <button
                  className="tam-btn tam-btn-approve"
                  onClick={() => handleOpenConfirmModal("APPROVED")}
                  disabled={isSubmitting}
                >
                  Phê duyệt
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

     
      {confirmAction && activeConfig && (
        <div className="tam-overlay tam-overlay-confirm">
          <form
            className="tam-confirm-modal"
            onSubmit={handleFinalConfirmSubmit}
          >
            <div className="tam-header">
              <h3 className="tam-title">{activeConfig.title}</h3>
              <button
                type="button"
                className="tam-close-btn"
                onClick={() => setConfirmAction(null)}
                disabled={isSubmitting}
              >
                ×
              </button>
            </div>

            <div className="tam-body">
              

              <div className="tam-field">
                <label className="tam-label">
                  Ngày quyết định (decisionDate){" "}
                  <span className="tam-req">*</span>
                </label>
                <input
                  type="date"
                  className="tam-active-input"
                  value={decisionForm.decisionDate}
                  min={new Date().toISOString().split("T")[0]}
                  onChange={(e) =>
                    setDecisionForm({
                      ...decisionForm,
                      decisionDate: e.target.value,
                    })
                  }
                  disabled={isSubmitting}
                  required
                />
              </div>

           
              {activeConfig.requiresFeedback && (
                <div className="tam-field">
                  <label className="tam-label">
                    Ý kiến phản hồi (leaderFeedback){" "}
                    <span className="tam-req">*</span>
                  </label>
                  <textarea
                    className="tam-active-input"
                    rows={3}
                    placeholder="Nhập lý do/ý kiến phản hồi của lãnh đạo..."
                    value={decisionForm.leaderFeedback}
                    onChange={(e) =>
                      setDecisionForm({
                        ...decisionForm,
                        leaderFeedback: e.target.value,
                      })
                    }
                    disabled={isSubmitting}
                    required
                  />
                </div>
              )}
            </div>

            <div className="tam-footer tam-footer-end">
              <button
                type="button"
                className="tam-btn tam-btn-cancel"
                onClick={() => setConfirmAction(null)}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                type="submit"
                className={`tam-btn ${activeConfig.btnClass}`}
                disabled={!isConfirmFormValid || isSubmitting}
              >
                {isSubmitting ? "Đang xử lý..." : activeConfig.confirmBtnText}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}