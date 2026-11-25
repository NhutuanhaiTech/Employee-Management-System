import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import apiClient from "../../../lib/api";
import { CalendarDays } from "lucide-react";

const MOCK_LEADERS = [
  {
    id: "11111111-1111-1111-1111-111111111111",
    fullName: "Nguyễn Quốc Trường",
    position: "Giám đốc Điều hành (CEO)",
  },
  {
    id: "22222222-2222-2222-2222-222222222222",
    fullName: "Trần Minh Hoàng",
    position: "Trưởng phòng Nhân sự",
  },
];

export default function TerminationFormModal({
  isOpen,
  onClose,
  employee, 
  existingData, 
  onSuccess,
}) {

  const [currentStep, setCurrentStep] = useState(1);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formId, setFormId] = useState(null);
  const [leadersList, setLeadersList] = useState([]);
  const [formStatus, setFormStatus] = useState(null);
  useEffect(() => {
    if (!isOpen) return;

    const fetchLeaders = async () => {
      try {
        const response = await apiClient.get("/api/users", {
          params: { roleName: "LEADER" },
        });
        const fetchedLeaders = response.data?.data || [];
        setLeadersList(fetchedLeaders);
        console.log("Danh sách user có role LEADER:", fetchedLeaders);
        if (fetchedLeaders.length > 0) {
          const firstLeader = fetchedLeaders[0];
          setSubmitForm((prev) => ({
            ...prev,
            leaderId: firstLeader.id,
            leaderName: firstLeader.fullName || firstLeader.username || "",
            leaderPosition: firstLeader.position || "Quản lý / Lãnh đạo",
          }));
        }
      } catch (error) {
        console.error("Lỗi tải danh sách lãnh đạo:", error);
        toast.error("Không thể tải danh sách lãnh đạo phê duyệt!");
      }
    };

    fetchLeaders();
  }, [isOpen]);
  const isReadOnly =
    formStatus === "PENDING" ||
    formStatus === "APPROVED" ||
    ["TERMINATION_PENDING", "TERMINATED", "ARCHIVED"].includes(
      employee?.status,
    );
  console.log("status của nhân viên ", isReadOnly);
  const [initForm, setInitForm] = useState({
    endDate: "",
    reason: "",
  });

  const [mainForm, setMainForm] = useState({
    toDepartment: "",
    subject: "",
    endDate: "",
    reason: "",
    handoverContent: "",
    leaderComment: "",
  });

  const [submitForm, setSubmitForm] = useState({
    leaderId: MOCK_LEADERS[0].id,
    leaderName: MOCK_LEADERS[0].fullName,
    leaderPosition: MOCK_LEADERS[0].position,
    submitDate: new Date().toISOString().split("T")[0],
    submitNote: "",
  });
  const currentStatus = (
    formStatus ||
    existingData?.status ||
    employee?.status ||
    ""
  ).toUpperCase();

  const isResubmit = ["TERMINATION_UPDATE_REQUIRED", "REJECTED"].includes(
    currentStatus,
  );
  useEffect(() => {
    if (isOpen) {
      setShowConfirmSubmit(false);
      setIsSubmitting(false);

      setSubmitForm({
        leaderId: MOCK_LEADERS[0].id,
        leaderName: MOCK_LEADERS[0].fullName,
        leaderPosition: MOCK_LEADERS[0].position,
        submitDate: new Date().toISOString().split("T")[0],
        submitNote: "",
      });

      if (existingData) {
        setFormId(existingData.id);
        setMainForm({
          toDepartment: existingData.toDepartment || "",
          subject: existingData.subject || "",
          endDate: existingData.endDate || "",
          reason: existingData.reason || "",
          handoverContent: existingData.handoverContent || "",
          leaderComment: existingData.leaderComment || "",
        });
        setCurrentStep(2);
      } else {
        setFormId(null);
        setInitForm({ endDate: "", reason: "" });
        setMainForm({
          toDepartment: "",
          subject: "",
          endDate: "",
          reason: "",
          handoverContent: "",
          leaderComment: "",
        });
        setCurrentStep(1);
      }
    }
  }, [isOpen, existingData]);

  useEffect(() => {
    if (!isOpen || !employee) return;

    const empId = employee.employeeId || employee.id;
    setShowConfirmSubmit(false);

    const resetToCreateNew = () => {
      setFormId(null);
      setFormStatus(null);
      setInitForm({ endDate: "", reason: "" });
      setMainForm({
        toDepartment: "",
        subject: "",
        endDate: "",
        reason: "",
        handoverContent: "",
        leaderComment: "",
      });
      setCurrentStep(1);
    };

    const checkExistingTerminationForm = async () => {
      if (existingData?.id) {
        setFormId(existingData.id);
        setFormStatus(existingData.status || employee?.status || null);
        setInitForm({
          endDate: existingData.endDate || "",
          reason: existingData.reason || "",
        });
        setMainForm({
          toDepartment: existingData.toDepartment || "",
          subject: existingData.subject || "",
          endDate: existingData.endDate || "",
          reason: existingData.reason || "",
          handoverContent: existingData.handoverContent || "",
          leaderComment: existingData.leaderComment || "",
        });
        if (existingData.leaderId) {
          setSubmitForm((prev) => ({
            ...prev,
            leaderId: existingData.leaderId,
            leaderName: existingData.leaderName || prev.leaderName,
            leaderPosition: existingData.leaderPosition || prev.leaderPosition,
          }));
        }
        setCurrentStep(2);
        return;
      }

      
      setIsSubmitting(true);
      try {
        console.log(
          `=== [GET] /api/termination-forms/by-employee/${empId} ===`,
        );
        const response = await apiClient.get(
          `/api/termination-forms/by-employee/${empId}`,
        );
        console.log("✅ Raw response GET by-employee:", response.data);

        
        const rawData =
          response.data?.data !== undefined
            ? response.data.data
            : response.data;
        const existingForm =
          rawData && typeof rawData === "object" && !rawData.message
            ? rawData
            : null;

        
        const resolvedFormId =
          existingForm?.id ||
          existingForm?.formId ||
          employee?.terminationFormId ||
          employee?.formId;

        if (resolvedFormId) {
          setFormId(resolvedFormId);
          setFormStatus(existingForm?.status || employee?.status || null);
          setInitForm({
            endDate: existingForm?.endDate || employee?.endDate || "",
            reason: existingForm?.reason || employee?.reason || "",
          });
          setMainForm({
            toDepartment: existingForm?.toDepartment || "",
            subject: existingForm?.subject || "",
            endDate: existingForm?.endDate || employee?.endDate || "",
            reason: existingForm?.reason || employee?.reason || "",
            handoverContent: existingForm?.handoverContent || "",
            leaderComment: existingForm?.leaderComment || "",
          });
          if (
            existingForm?.leaderId ||
            existingForm?.leaderName ||
            existingForm?.leader
          ) {
            setSubmitForm((prev) => ({
              ...prev,
              leaderId:
                existingForm.leaderId ||
                existingForm.leader?.id ||
                prev.leaderId,
              leaderName:
                existingForm.leaderName ||
                existingForm.leader?.fullName ||
                existingForm.leader?.name ||
                prev.leaderName,
              leaderPosition:
                existingForm.leaderPosition ||
                existingForm.leader?.positionName ||
                existingForm.leader?.position ||
                prev.leaderPosition,
            }));
          }
          setCurrentStep(2);
        } else {
          resetToCreateNew();
        }
      } catch (error) {
        
        if (error.response?.status === 404) {
          console.log(
            "ℹ️ Nhân viên chưa có bản nháp kết thúc hồ sơ -> Chuyển sang tạo mới.",
          );
          resetToCreateNew();
        } else {
          handleApiError(
            error,
            "Lỗi khi kiểm tra thông tin biểu mẫu kết thúc!",
          );
          resetToCreateNew();
        }
      } finally {
        setIsSubmitting(false);
      }
    };

    checkExistingTerminationForm();
  }, [isOpen, employee, existingData]);
  if (!isOpen || !employee) return null;
  const targetEmployeeId = employee?.employeeId || employee?.id;
  const handleApiError = (error, defaultMessage) => {
    console.error("❌ Chi tiết lỗi API:", error);

    if (error.response) {
      const { status, data } = error.response;
      console.error(`--> Status: ${status}`, data);

     
      if (data?.errors) {
        if (Array.isArray(data.errors)) {
          data.errors.forEach((err) =>
            toast.error(err.defaultMessage || err.message || String(err)),
          );
          return;
        }
        if (typeof data.errors === "object") {
          Object.values(data.errors).forEach((msg) => toast.error(String(msg)));
          return;
        }
      }

     
      if (status === 403) {
        toast.error(
          "Lỗi 403: Bạn không có quyền thực hiện thao tác này (Yêu cầu quyền MANAGER)!",
        );
        return;
      }

   
      const serverMsg = data?.message || data?.error || defaultMessage;
      toast.error(`Lỗi (${status}): ${serverMsg}`);
    } else if (error.request) {
      toast.error(
        "Không thể kết nối tới máy chủ. Vui lòng kiểm tra mạng hoặc Backend!",
      );
    } else {
      toast.error(`Có lỗi xảy ra: ${error.message}`);
    }
  };
  
  const handleInitSubmit = async () => {
    if (!initForm.endDate) {
      toast.warning("Vui lòng chọn ngày kết thúc!");
      return;
    }
    if (!initForm.reason.trim()) {
      toast.warning("Vui lòng nhập lý do kết thúc!");
      return;
    }

    const trimmedReason = initForm.reason.trim();

    
    if (formId) {
      console.log(
        "ℹ️ Bản nháp đã tồn tại (formId:",
        formId,
        ") -> Chỉ cập nhật state form, không gọi lại init-draft.",
      );
      setMainForm((prev) => ({
        ...prev,
        endDate: initForm.endDate,
        reason: trimmedReason,
      }));
      toast.info("Đã cập nhật ngày và lý do vào biểu mẫu!");
      setCurrentStep(2);
      return;
    }

   
    const initPayload = {
      employeeId: targetEmployeeId,
      endDate: initForm.endDate,
      reason: trimmedReason,
    };

    setIsSubmitting(true);
    try {
      console.log(
        "=== [POST] /api/termination-requests/init-draft ===",
        initPayload,
      );
      const resInit = await apiClient.post(
        "/api/termination-requests/init-draft",
        initPayload,
      );
      console.log("✅ Kết quả init-draft:", resInit.data);

     
      const resForm = await apiClient.get(
        `/api/termination-forms/by-employee/${targetEmployeeId}`,
      );
      const createdForm = resForm.data?.data;
      console.log("✅ Chi tiết TerminationForm vừa tạo:", createdForm);

      if (createdForm?.id) {
        setFormId(createdForm.id);
      }

      toast.success(
        resInit.data?.message || "Khởi tạo bản nháp hồ sơ kết thúc thành công!",
      );

      setMainForm((prev) => ({
        ...prev,
        toDepartment: createdForm?.toDepartment || prev.toDepartment,
        subject: createdForm?.subject || prev.subject,
        handoverContent: createdForm?.handoverContent || prev.handoverContent,
        endDate: initForm.endDate,
        reason: trimmedReason,
      }));

      if (onSuccess) onSuccess();
      setCurrentStep(2);
    } catch (error) {
      const serverMsg = error.response?.data?.message || "";
      if (
        error.response?.status === 400 &&
        serverMsg.includes("chưa hoàn tất")
      ) {
        try {
         
          const retryRes = await apiClient.get(
            `/api/termination-forms/by-employee/${targetEmployeeId}`,
          );
          const retryForm = retryRes.data?.data;
          const retryId = retryForm?.id || retryForm?.formId;

          if (retryId) {
            setFormId(retryId);
            setFormStatus(retryForm?.status || null);
            setMainForm((prev) => ({
              ...prev,
              toDepartment: retryForm?.toDepartment || prev.toDepartment,
              subject: retryForm?.subject || prev.subject,
              handoverContent:
                retryForm?.handoverContent || prev.handoverContent,
              endDate: retryForm?.endDate || initForm.endDate,
              reason: retryForm?.reason || trimmedReason,
            }));
            setCurrentStep(2);
            return;
          }
        } catch (_) {
        }

        toast.error(
          "Nhân viên đã có hồ sơ kết thúc đang xử lý, nhưng API chưa trả về được formId để chỉnh sửa!",
        );
        return;
      }

      handleApiError(error, "Không thể khởi tạo hồ sơ kết thúc!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveMainForm = async () => {
    if (
      !mainForm.toDepartment.trim() ||
      !mainForm.subject.trim() ||
      !mainForm.handoverContent.trim()
    ) {
      toast.warning("Vui lòng điền đầy đủ các trường bắt buộc có dấu * !");
      return;
    }

    if (!formId) {
      toast.error("Không tìm thấy ID biểu mẫu (formId) để cập nhật!");
      return;
    }

    const updatePayload = {
      endDate: mainForm.endDate,
      reason: mainForm.reason,
      toDepartment: mainForm.toDepartment.trim(),
      subject: mainForm.subject.trim(),
      handoverContent: mainForm.handoverContent.trim(),
    };

    setIsSubmitting(true);
    try {
      console.log(
        `=== [PUT] /api/termination-forms/${formId} ===`,
        updatePayload,
      );
      const response = await apiClient.put(
        `/api/termination-forms/${formId}`,
        updatePayload,
      );

      console.log("✅ Kết quả cập nhật biểu mẫu:", response.data);
      toast.success(
        response.data?.message || "Lưu thông tin biểu mẫu thành công!",
      );

      if (onSuccess) onSuccess();
    } catch (error) {
      handleApiError(error, "Lỗi khi lưu thông tin biểu mẫu!");
    } finally {
      setIsSubmitting(false);
    }
  };


  const handleOpenSubmit = () => {
    if (!formId) {
      toast.warning(
        "Vui lòng lưu thông tin biểu mẫu trước khi trình lãnh đạo!",
      );
      return;
    }
    setSubmitForm((prev) => ({
      ...prev,
      submitNote: `Trình lãnh đạo phê duyệt Quyết định kết thúc hồ sơ nhân viên ${
        employee.fullName || employee.employeeName
      }`,
    }));
    setCurrentStep(3);
  };


  const handleOpenConfirmSubmit = () => {
    if (!submitForm.submitDate) {
      toast.warning("Vui lòng chọn ngày trình!");
      return;
    }
    
    if (!isResubmit && !submitForm.leaderId) {
      toast.warning("Vui lòng chọn lãnh đạo phê duyệt!");
      return;
    }
    if (!submitForm.submitNote.trim()) {
      toast.warning("Vui lòng nhập nội dung trình lãnh đạo!");
      return;
    }
    setShowConfirmSubmit(true);
  };

 
  const handleExecuteFinalSubmit = async () => {
    setIsSubmitting(true);
    try {
      let response;

      if (isResubmit) {
       
        const resubmitPayload = {
          formId: formId,
          submitDate: submitForm.submitDate,
          submitNote: submitForm.submitNote.trim(),
        };

        console.log(
          "=== [PATCH] /api/termination-requests/resubmit ===",
          resubmitPayload,
        );
        response = await apiClient.patch(
          "/api/termination-requests/resubmit",
          resubmitPayload,
        );
      } else {
    
        const submitPayload = {
          formId: formId,
          leaderId: submitForm.leaderId,
          submitDate: submitForm.submitDate,
          submitNote: submitForm.submitNote.trim(),
        };

        console.log(
          "=== [POST] /api/termination-requests/submit ===",
          submitPayload,
        );
        response = await apiClient.post(
          "/api/termination-requests/submit",
          submitPayload,
        );
      }

      console.log("✅ Kết quả trình lãnh đạo:", response.data);
      toast.success(
        response.data?.message ||
          (isResubmit
            ? "Trình lại lãnh đạo phê duyệt thành công!"
            : "Trình lãnh đạo phê duyệt thành công!"),
      );

      setShowConfirmSubmit(false);
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      setShowConfirmSubmit(false);
      handleApiError(error, "Lỗi khi trình lãnh đạo phê duyệt!");
    } finally {
      setIsSubmitting(false);
    }
  };
  if (currentStep === 1) {
    return (
      <div style={styles.overlay}>
        <div style={styles.modalSmall}>
          <div style={styles.header}>
            <h3 style={styles.title}>Kết thúc hồ sơ nhân viên</h3>
            <button
              style={styles.closeBtn}
              onClick={onClose}
              disabled={isSubmitting}
            >
              ✕
            </button>
          </div>

          <div style={styles.body}>
            <p style={styles.descText}>
              Nhập thông tin kết thúc hồ sơ cho nhân viên{" "}
              <b>
                {employee.fullName || employee.employeeName} (
                {employee.employeeCode || employee.code})
              </b>
              :
            </p>

            <div style={styles.field}>
              <label style={styles.label}>
                Ngày kết thúc <span style={styles.req}>*</span>
              </label>
              <input
                type="date"
                style={styles.inputActive}
                value={initForm.endDate}
                onChange={(e) =>
                  setInitForm({ ...initForm, endDate: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>
                Lý do kết thúc <span style={styles.req}>*</span>
              </label>
              <textarea
                style={styles.inputActive}
                rows={3}
                placeholder="Nhập lý do kết thúc hồ sơ..."
                value={initForm.reason}
                onChange={(e) =>
                  setInitForm({ ...initForm, reason: e.target.value })
                }
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div style={styles.footerEnd}>
            <button
              style={styles.btnCancel}
              onClick={onClose}
              disabled={isSubmitting}
            >
              Hủy
            </button>

            <button
              style={styles.btnPrimary}
              onClick={handleInitSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang khởi tạo..." : "Xác nhận & Mở biểu mẫu →"}
            </button>
          </div>
        </div>
      </div>
    );
  }


  if (currentStep === 3) {
    return (
      <>
        <div style={styles.overlay}>
          <div style={styles.modalSmall}>
            <div style={styles.header}>
              <h3 style={styles.title}>Trình lãnh đạo phê duyệt</h3>
              <button
                style={styles.closeBtn}
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
              >
                ✕
              </button>
            </div>

            <div style={styles.body}>
              <div style={styles.field}>
                <label style={styles.label}>
                  Ngày trình <span style={styles.req}>*</span>
                </label>
                <input
                  type="date"
                  style={styles.inputActive}
                  value={submitForm.submitDate}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, submitDate: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Tên lãnh đạo <span style={styles.req}>*</span>
                </label>
                <select
                  style={styles.inputActive}
                  value={submitForm.leaderId}
                  onChange={(e) => {
                    const selected = leadersList.find(
                      (l) => String(l.id) === String(e.target.value),
                    );
                    setSubmitForm({
                      ...submitForm,
                      leaderId: e.target.value,
                      leaderName:
                        selected?.fullName ||
                        selected?.name ||
                        selected?.username ||
                        "",
                      leaderPosition:
                        selected?.position ||
                        selected?.jobTitle ||
                        "Quản lý / Lãnh đạo",
                    });
                  }}
                  disabled={isSubmitting}
                >
                  <option value="">-- Chọn lãnh đạo phê duyệt --</option>
                  {leadersList.map((leader) => (
                    <option key={leader.id} value={leader.id}>
                      {leader.fullName || leader.name || leader.username}
                    </option>
                  ))}
                </select>
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Chức vụ lãnh đạo (Tự động điền)
                </label>
                <input
                  type="text"
                  style={styles.readOnlyInput}
                  value={submitForm.leaderPosition || "---"}
                  readOnly
                />
              </div>

              <div style={styles.field}>
                <label style={styles.label}>
                  Nội dung trình lãnh đạo <span style={styles.req}>*</span>
                </label>
                <textarea
                  style={styles.inputActive}
                  rows={3}
                  value={submitForm.submitNote}
                  onChange={(e) =>
                    setSubmitForm({ ...submitForm, submitNote: e.target.value })
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div style={styles.footerEnd}>
              <button
                style={styles.btnCancel}
                onClick={() => setCurrentStep(2)}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button
                style={styles.btnPrimary}
                onClick={handleOpenConfirmSubmit}
                disabled={isSubmitting}
              >
                Xác nhận gửi lãnh đạo
              </button>
            </div>
          </div>
        </div>

   
        {showConfirmSubmit && (
          <div style={{ ...styles.overlay, zIndex: 2000 }}>
            <div style={{ ...styles.modalSmall, width: "380px" }}>
              <div style={styles.body}>
                <h4
                  style={{
                    textAlign: "center",
                    color: "#1f2937",
                    margin: "10px 0",
                    fontSize: "18px",
                  }}
                >
                  Xác nhận gửi?
                </h4>
                <p
                  style={{
                    textAlign: "center",
                    color: "#4b5563",
                    fontSize: "14px",
                    margin: 0,
                    lineHeight: "1.5",
                  }}
                >
                  Bạn có chắc chắn muốn trình biểu mẫu này lên lãnh đạo{" "}
                  <b>{submitForm.leaderName}</b> không?
                </p>
              </div>
              <div
                style={{
                  ...styles.footerEnd,
                  justifyContent: "center",
                  gap: "16px",
                }}
              >
                <button
                  style={styles.btnCancel}
                  onClick={() => setShowConfirmSubmit(false)}
                  disabled={isSubmitting}
                >
                  Không, xem lại
                </button>
                <button
                  style={styles.btnSuccess}
                  onClick={handleExecuteFinalSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Đang gửi..." : "Chắc chắn gửi"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // --- BƯỚC 2: BIỂU MẪU CHÍNH ---
  return (
    <div style={styles.overlay}>
      <div style={styles.modalLarge}>
        <div style={styles.header}>
          <h3 style={styles.title}>
            Biểu mẫu: Quyết định kết thúc hồ sơ / Đơn xin nghỉ việc
          </h3>
          <button
            style={styles.closeBtn}
            onClick={onClose}
            disabled={isSubmitting}
          >
            ✕
          </button>
        </div>

        <div style={styles.scrollBody}>
          <div style={styles.docHeader}>
            <h4 style={{ margin: "4px 0", color: "#1e3a8a", fontSize: "16px" }}>
              CÔNG TY CỔ PHẦN OCEAN TECH
            </h4>
            <p
              style={{ margin: "4px 0", fontWeight: "bold", fontSize: "14px" }}
            >
              Cộng hòa Xã hội Chủ nghĩa Việt Nam - Độc lập Tự do Hạnh phúc
            </p>
            <h2
              style={{
                color: "#dc2626",
                marginTop: "16px",
                textTransform: "uppercase",
                fontSize: "20px",
              }}
            >
              QUYẾT ĐỊNH KẾT THÚC HỒ SƠ LAO ĐỘNG
            </h2>
          </div>

          <div style={styles.grid3}>
            <div style={styles.field}>
              <label style={styles.label}>
                Kính gửi {!isReadOnly && <span style={styles.req}>*</span>}
              </label>
              <input
                type="text"
                style={isReadOnly ? styles.readOnlyInput : styles.inputActive}
                value={mainForm.toDepartment}
                onChange={(e) =>
                  setMainForm({ ...mainForm, toDepartment: e.target.value })
                }
                readOnly={isReadOnly}
                disabled={isSubmitting}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>
                Về việc {!isReadOnly && <span style={styles.req}>*</span>}
              </label>
              <input
                type="text"
                style={isReadOnly ? styles.readOnlyInput : styles.inputActive}
                value={mainForm.subject}
                onChange={(e) =>
                  setMainForm({ ...mainForm, subject: e.target.value })
                }
                readOnly={isReadOnly}
                disabled={isSubmitting}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Ngày kết thúc chính thức</label>
              <input
                type="date"
                style={styles.readOnlyInput}
                value={mainForm.endDate}
                readOnly
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Lý do kết thúc</label>
            <input
              type="text"
              style={styles.readOnlyInput}
              value={mainForm.reason}
              readOnly
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Nội dung bàn giao & cam kết{" "}
              {!isReadOnly && <span style={styles.req}>*</span>}
            </label>
            <textarea
              style={isReadOnly ? styles.readOnlyInput : styles.inputActive}
              rows={3}
              value={mainForm.handoverContent}
              onChange={(e) =>
                setMainForm({ ...mainForm, handoverContent: e.target.value })
              }
              readOnly={isReadOnly}
              disabled={isSubmitting}
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>
              Ý kiến của Lãnh đạo (Role Lãnh đạo nhập)
            </label>
            <input
              type="text"
              style={styles.readOnlyInput}
              value={mainForm.leaderComment || "Chỉ dành cho Role Lãnh đạo"}
              readOnly
            />
          </div>
        </div>

        <div style={styles.footerBetween}>
          <button
            style={styles.btnCancel}
            onClick={onClose}
            disabled={isSubmitting}
          >
            Đóng
          </button>

          {isReadOnly && (
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 14px",
                borderRadius: "6px",
                backgroundColor: "#f8fafc",
                border: "1px solid #cbd5e1",
                color: "#334155",
                fontSize: "13px",
                cursor: "default",
                userSelect: "none",
              }}
            >
              <span
                style={{
                  width: "7px",
                  height: "7px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  flexShrink: 0,
                }}
              />
              <span>Lãnh đạo tiếp nhận:</span>
              <strong style={{ color: "#0f172a" }}>
                {submitForm?.leaderName || "Chưa có thông tin"}
              </strong>
              {submitForm?.leaderPosition && (
                <span style={{ color: "#64748b" }}>
                  ({submitForm.leaderPosition})
                </span>
              )}
            </div>
          )}

          {!isReadOnly && (
            <div style={{ display: "flex", gap: "12px" }}>
              <button
                style={{
                  ...styles.btnCancel,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                }}
                onClick={() => setCurrentStep(1)}
                disabled={isSubmitting}
              >
                <CalendarDays size={16} />
                <span>Sửa ngày/lý do</span>
              </button>
              <button
                style={styles.btnPrimary}
                onClick={handleSaveMainForm}
                disabled={isSubmitting}
              >
                {isSubmitting ? "Đang lưu..." : "Lưu thông tin biểu mẫu"}
              </button>
              {formId && (
                <button
                  style={styles.btnSuccess}
                  onClick={handleOpenSubmit}
                  disabled={isSubmitting}
                >
                  Trình lãnh đạo
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 7. CSS STYLES
// ==========================================
const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
    backdropFilter: "blur(2px)",
  },
  modalSmall: {
    backgroundColor: "#fff",
    width: "450px",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  modalLarge: {
    backgroundColor: "#fff",
    width: "850px",
    maxHeight: "90vh",
    borderRadius: "8px",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 10px 25px rgba(0,0,0,0.2)",
  },
  header: {
    padding: "16px 24px",
    borderBottom: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: { margin: 0, fontSize: "18px", color: "#1f2937", fontWeight: "bold" },
  closeBtn: {
    background: "none",
    border: "none",
    fontSize: "20px",
    cursor: "pointer",
    color: "#6b7280",
  },
  body: {
    padding: "24px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  scrollBody: {
    padding: "24px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  docHeader: { textAlign: "center", marginBottom: "16px" },
  descText: { margin: "0 0 8px 0", fontSize: "14px", color: "#4b5563" },
  field: { display: "flex", flexDirection: "column", gap: "6px" },
  grid3: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" },
  label: { fontSize: "13px", fontWeight: "600", color: "#374151" },
  req: { color: "#ef4444" },
  inputActive: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #3b82f6",
    outline: "none",
    fontSize: "14px",
    resize: "vertical",
  },
  readOnlyInput: {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f3f4f6",
    color: "#111827",
    fontWeight: "500",
    fontSize: "14px",
    outline: "none",
    cursor: "not-allowed",
  },
  footerEnd: {
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "flex-end",
    gap: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "0 0 8px 8px",
  },
  footerBetween: {
    padding: "16px 24px",
    borderTop: "1px solid #e5e7eb",
    display: "flex",
    justifyContent: "space-between",
    backgroundColor: "#f9fafb",
    borderRadius: "0 0 8px 8px",
  },
  btnCancel: {
    padding: "10px 16px",
    border: "1px solid #d1d5db",
    backgroundColor: "#fff",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#374151",
    fontSize: "14px",
  },
  btnPrimary: {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "#2563eb",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#fff",
    fontSize: "14px",
  },
  btnSuccess: {
    padding: "10px 16px",
    border: "none",
    backgroundColor: "#16a34a",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "600",
    color: "#fff",
    fontSize: "14px",
  },
};
