import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  X,
  UserCircle,
  Contact,
  GraduationCap,
  Users,
  PlusCircle,
  Trash2,
  Save,
  FileSignature,
  CheckCircle2,
  Upload,
  Files,
  Pencil,
} from "lucide-react";
import "./EmployeeModal.css";
import apiClient from "../../../lib/api";
import { toast } from "react-toastify";

export default function EmployeeModal({
  isOpen,
  onClose,
  initialData,
  mode,
  onSuccess,
  onSwitchToForms,
}) {
  const DEFAULT_AVATAR_URL =
    "https://cdn-icons-png.flaticon.com/512/149/149071.png";
  const [activeTab, setActiveTab] = useState(1);
  const [certErrors, setCertErrors] = useState({});
  const [familyErrors, setFamilyErrors] = useState({});
  console.log("data nhân viên hdfgdhfjk:", initialData);

  const [editingCertIndex, setEditingCertIndex] = useState(null);

  const [editingFamilyIndex, setEditingFamilyIndex] = useState(null);

  const RELATIONSHIP_LABEL_MAP = {
    FATHER: "Bố",
    MOTHER: "Mẹ",
    SPOUSE: "Vợ/Chồng",
    CHILD: "Con",
    SIBLING: "Anh/Chị/Em",
  };
  const REVERSE_RELATIONSHIP_MAP = {
    Bố: "FATHER",
    Mẹ: "MOTHER",
    "Vợ/Chồng": "SPOUSE",
    Con: "CHILD",
    "Anh/Chị/Em": "SIBLING",
  };
  const employeeSchema = z.object({
    employeeCode: z.string().min(1, "Mã nhân viên là bắt buộc"),
    fullName: z.string().min(1, "Tên nhân viên là bắt buộc"),
    gender: z.string().min(1, "Vui lòng chọn giới tính"),
    dob: z.string().min(1, "Ngày sinh là bắt buộc"),
    idNumber: z
      .string()
      .min(1, "CCCD là bắt buộc")
      .regex(/^(\d{9}|\d{12})$/, "CCCD phải gồm 9 hoặc 12 chữ số"),
    teamId: z.string().min(1, "Phòng ban là bắt buộc"),
    phone: z
      .string()
      .min(1, "Số điện thoại là bắt buộc")
      .regex(/^(0|\+84)(3|5|7|8|9)\d{8}$/, "SĐT Việt Nam không hợp lệ"),
    email: z.string().min(1, "Email là bắt buộc").email("Email không hợp lệ"),
    address: z.string().min(1, "Địa chỉ là bắt buộc"),
  });
  const onError = (formErrors) => {
    if (Object.keys(formErrors).length > 0) {
      if (activeTab !== 1) {
        toast.error("Vui lòng nhập đầy đủ thông tin bắt buộc ở Tab 1!");
      }
      setActiveTab(1);
    }
  };
  const fetchTeams = async () => {
    try {
      const response = await apiClient.get("/api/teams");
      const teamList = response.data;
      return teamList;
    } catch (error) {
      console.error("Lỗi khi gọi API lấy danh sách team:", error);
      if (error.response && error.response.status === 403) {
        console.warn(
          "Lỗi 403: Tài khoản của bạn không có quyền MANAGER để xem danh sách Team.",
        );
      }
    }
  };
  const handleSwitchTab = async (targetTab) => {
    if (targetTab === 1 || mode === "view") {
      setActiveTab(targetTab);
      return;
    }
    const isTab1Valid = await trigger();
    if (!isTab1Valid) {
      toast.warning("Vui lòng nhập đầy đủ thông tin ở Tab 1 trước!");
      setActiveTab(1);
      return;
    }

    setActiveTab(targetTab);
  };
  const handleEditFamily = (idx) => {
    const item = family[idx];
    setEditingFamilyIndex(idx);
    const normalizedRelationship =
      REVERSE_RELATIONSHIP_MAP[item.relationshipType] ||
      item.relationshipType ||
      "FATHER";
    setFamilyForm({
      ...item,
      fullName: item.fullName || "",
      relationshipType: normalizedRelationship,
      gender: item.gender || "MALE",
      dob: item.dob || "",
      idNumber: item.idNumber || "",
      phone: item.phone || "",
      address: item.address || "",
    });
  };
  const resetFamilyForm = () => {
    setFamilyForm({
      fullName: "",
      relationshipType: "FATHER",
      gender: "MALE",
      dob: "",
      idNumber: "",
      phone: "",
      address: "",
    });
    setFamilyErrors({});
    setEditingFamilyIndex(null);
  };

  const resetCertForm = () => {
    setCertForm({
      name: "",
      startDate: "",
      field: "",
      content: "",
    });
    setCertErrors({});
    setEditingCertIndex(null);
  };

  const handleEditCert = (idx) => {
    const item = certificates[idx];
    setEditingCertIndex(idx);
    setCertForm({
      name: item.name || "",
      startDate: item.startDate || "",
      field: item.field || "",
      content: item.content || "",
    });
  };

  const safeData = initialData?.employeeInfo
    ? initialData.employeeInfo
    : initialData;

  const [teams, setTeams] = useState([]);
  useEffect(() => {
    const getTeams = async () => {
      const data = await fetchTeams();
      if (data) {
        setTeams(data);
      }
    };

    getTeams();
  }, []);
  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    mode: "onTouched",
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      employeeCode: "",
      fullName: "",
      gender: "MALE",
      dob: "",
      idNumber: "",
      teamId: "",
      phone: "",
      email: "",
      address: "",
      avatarUrl: DEFAULT_AVATAR_URL,
    },
  });
  useEffect(() => {
    if (initialData?.teamId && teams?.length > 0) {
      console.log("Tiến hành ép thẻ Select nhận teamId:", initialData.teamId);
      setValue("teamId", initialData.teamId, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [initialData, teams, setValue]);

  const getModalTitle = () => {
    <h2>
      {mode === "create" && "Thêm Mới Nhân Viên"}
      {mode === "edit" &&
        `Chỉnh Sửa Nhân Viên: ${initialData?.employeeInfo?.fullName} (${initialData?.employeeInfo?.employeeCode})`}
      {mode === "view" &&
        `Chi Tiết Nhân Viên: ${initialData?.employeeInfo?.fullName} (${initialData?.employeeInfo?.employeeCode})`}
    </h2>;
  };

  const [certificates, setCertificates] = useState([]);
  const [certForm, setCertForm] = useState({
    name: "",
    startDate: "",
    field: "",
    content: "",
  });

  const [family, setFamily] = useState([]);
  const [familyForm, setFamilyForm] = useState({
    fullName: "",
    relationshipType: "FATHER",
    gender: "MALE",
    dob: "",
    idNumber: "",
    address: "",
    phone: "",
  });

  useEffect(() => {
    if (isOpen) {
      console.log("thông tin nhân viên", initialData);
      setActiveTab(1);
      if (mode === "create") {
        reset({
          employeeCode: "",
          fullName: "",
          gender: "MALE",
          dob: "",
          idNumber: "",
          teamId: "",
          phone: "",
          email: "",
          address: "",
        });
        setCertificates([]);
        setFamily([]);
      } else if (initialData) {
        const info = initialData.employeeInfo || initialData;
        reset({
          employeeCode: safeData.employeeCode,
          fullName: safeData?.fullName,
          gender: safeData.gender,
          dob: safeData.dob,
          idNumber: safeData.idNumber,
          teamId: safeData.teamId,
          phone: safeData.phone,
          email: safeData.email,
          address: safeData.address || "",
        });
        setCertificates(initialData.certificates || []);
        setFamily(initialData.familyRelationships || []);
      }
    }
  }, [isOpen, initialData, reset, mode]);
  if (!isOpen) return null;
  useEffect(() => {
    if (teams && teams.length > 0 && safeData) {
      let finalTeamId = "";
      if (safeData.teamId) {
        finalTeamId = safeData.teamId;
      } else if (safeData.teamName) {
        const matchedTeam = teams.find(
          (t) =>
            t.teamName === safeData.teamName || t.name === safeData.teamName,
        );
        if (matchedTeam) {
          finalTeamId = matchedTeam.id;
        }
      }
      if (finalTeamId) {
        setValue("teamId", finalTeamId, {
          shouldValidate: true,
          shouldDirty: true,
        });
      }
    }
  }, [teams, safeData, setValue]);
  const onSubmitFinal = async (data) => {
    const existingAvatar =
      data.avatarUrl ||
      initialData?.employeeInfo?.avatarUrl ||
      initialData?.avatarUrl;

    const validAvatarUrl =
      existingAvatar && /^https?:\/\/.+/.test(existingAvatar)
        ? existingAvatar
        : DEFAULT_AVATAR_URL;
    const normalizedFamily = (family || []).map((item) => ({
      ...item,
      relationshipType:
        REVERSE_RELATIONSHIP_MAP[item.relationshipType] ||
        item.relationshipType ||
        "FATHER",
    }));

    const finalPayload = {
      ...data,
      avatarUrl: validAvatarUrl || "https:fsdfsfsdfsdfsfsdfsdfsdf",
      createBy: initialData?.createBy || "admin",
      certificates: certificates,
      familyRelationships: normalizedFamily,
    };

    console.log("=== JSON SUBMIT LÊN SPRING BOOT ===");
    console.log(JSON.stringify(finalPayload, null, 2));

    try {
      if (mode === "create") {
        await apiClient.post("/api/employees", finalPayload);
        toast.success("Thêm nhân viên thành công!");
        reset();
        onClose();
      } else if (mode === "edit") {
        const updateId = initialData?.employeeInfo?.id;
        const response = await apiClient.put(
          `/api/employees/${updateId}`,
          finalPayload,
        );
        toast.success("Cập nhật thông tin thành công!");

        reset(data);

        if (response.data?.certificates) {
          setCertificates(response.data.certificates);
        }
        if (response.data?.familyRelationships) {
          setFamily(response.data.familyRelationships);
        }
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Lỗi khi tạo tài khoản:", error);
      let errorMessage = "Có lỗi xảy ra khi tạo tài khoản, vui lòng thử lại!";
      if (error.response && error.response.data) {
        const errData = error.response.data;
        if (typeof errData === "object" && !errData.message) {
          const errorMessages = Object.values(errData);
          if (errorMessages.length > 0) {
            errorMessage = errorMessages[0];
          }
        } else if (errData.message) {
          errorMessage = errData.message;
        } else if (typeof errData === "string") {
          errorMessage = errData;
        }
      }
      toast.error(errorMessage);
    }
  };

  const handleAddCert = () => {
    const errors = {};

    if (!certForm.name?.trim()) {
      errors.name = "Vui lòng nhập tên văn bằng";
    }
    if (!certForm.startDate) {
      errors.startDate = "Vui lòng chọn ngày cấp";
    }
    if (!certForm.field?.trim()) {
      errors.field = "Vui lòng nhập lĩnh vực";
    }
    if (!certForm.content?.trim()) {
      errors.content = "Vui lòng nhập nội dung";
    }

    if (Object.keys(errors).length > 0) {
      setCertErrors(errors);
      return;
    }

    const cleanCert = {
      ...certForm,
      name: certForm.name.trim(),
      field: certForm.field.trim(),
      content: certForm.content.trim(),
    };

    if (editingCertIndex !== null) {
      const updated = [...certificates];
      updated[editingCertIndex] = cleanCert;
      setCertificates(updated);
    } else {
      setCertificates([...certificates, cleanCert]);
    }

    resetCertForm();
  };
  const handleDeleteCert = (idx) => {
    setCertificates(certificates.filter((_, index) => index !== idx));

    if (editingCertIndex === idx) {
      resetCertForm();
    } else if (editingCertIndex !== null && idx < editingCertIndex) {
      setEditingCertIndex(editingCertIndex - 1);
    }
  };

  const handleAddFamily = () => {
    const errors = {};

    const idNumberValue = familyForm?.idNumber?.trim() || "";
    const phoneValue = familyForm?.phone?.trim() || "";
    const cccdRegex = /^(\d{9}|\d{12})$/;
    const vnPhoneRegex = /^(0|\+84)(3|5|7|8|9)\d{8}$/;

    if (!familyForm?.fullName?.trim()) {
      errors.fullName = "Vui lòng nhập họ tên";
    }
    if (!familyForm?.relationshipType) {
      errors.relationshipType = "Vui lòng chọn mối quan hệ";
    }
    if (!familyForm?.gender) {
      errors.gender = "Vui lòng chọn giới tính";
    }
    if (!familyForm?.dob) {
      errors.dob = "Vui lòng chọn ngày sinh";
    }

    // Kiểm tra Số CCCD
    if (!idNumberValue) {
      errors.idNumber = "Vui lòng nhập số CCCD";
    } else if (!cccdRegex.test(idNumberValue)) {
      errors.idNumber = "CCCD phải gồm 9 hoặc 12 chữ số";
    }

    // Kiểm tra SĐT
    if (!phoneValue) {
      errors.phone = "Vui lòng nhập số điện thoại";
    } else if (!vnPhoneRegex.test(phoneValue)) {
      errors.phone = "SĐT Việt Nam không hợp lệ";
    }

    if (!familyForm?.address?.trim()) {
      errors.address = "Vui lòng nhập địa chỉ";
    }

    if (Object.keys(errors).length > 0) {
      setFamilyErrors(errors);
      return;
    }

    const cleanFamilyMember = {
      ...familyForm,
      fullName: familyForm.fullName.trim(),
      relationshipType:
        REVERSE_RELATIONSHIP_MAP[familyForm.relationshipType] ||
        familyForm.relationshipType ||
        "FATHER",
      gender: familyForm.gender || "MALE",
      idNumber: idNumberValue,
      phone: phoneValue,
      address: familyForm.address.trim(),
    };

    if (editingFamilyIndex !== null) {
      const updated = [...family];
      updated[editingFamilyIndex] = cleanFamilyMember;
      setFamily(updated);
    } else {
      setFamily([...family, cleanFamilyMember]);
    }

    resetFamilyForm();
  };
  const handleDeleteFamily = (idx) => {
    setFamily(family.filter((_, index) => index !== idx));

    if (editingFamilyIndex === idx) {
      resetFamilyForm();
    } else if (editingFamilyIndex !== null && idx < editingFamilyIndex) {
      setEditingFamilyIndex(editingFamilyIndex - 1);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="modal-icon-bg">
              <UserCircle size={24} />
            </div>
            <div className="modal-title">
              <h2>
                {mode === "create"
                  ? "Thêm Mới Nhân Viên"
                  : `Chỉnh Sửa Nhân Viên: ${safeData?.fullName || ""} (${safeData?.employeeCode || ""})`}
              </h2>
              <p>Trạng thái hiện tại: {mode}</p>
            </div>
          </div>
          <button className="btn-close" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-tabs">
          <button
            className={`tab-btn ${activeTab === 1 ? "active" : ""}`}
            onClick={() => handleSwitchTab(1)}
          >
            <Contact size={18} /> 1. Thông tin nhân viên
          </button>
          <button
            className={`tab-btn ${activeTab === 2 ? "active" : ""}`}
            onClick={() => handleSwitchTab(2)}
          >
            <GraduationCap size={18} /> 2. Thông tin văn bằng{" "}
            <span className="tab-badge">{certificates.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 3 ? "active" : ""}`}
            onClick={() => handleSwitchTab(3)}
          >
            <Users size={18} /> 3. Quan hệ gia đình{" "}
            <span className="tab-badge">{family.length}</span>
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 1 && (
            <div className="tab-1-layout">
              <div className="avatar-section">
                <div className="avatar-circle">NV</div>
                <p
                  style={{
                    fontSize: "13px",
                    color: "#6b7280",
                    marginBottom: "12px",
                  }}
                >
                  Ảnh chân dung
                </p>
                <button
                  type="button"
                  style={{
                    width: "100%",
                    padding: "6px",
                    border: "1px solid #d1d5db",
                    borderRadius: "6px",
                    background: "white",
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                    gap: "8px",
                  }}
                >
                  <Upload size={16} /> Tải ảnh lên
                </button>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    Mã nhân viên <span className="required">*</span>
                  </label>
                  <input
                    placeholder="VD:NV00134567"
                    readOnly={mode === "view"}
                    {...register("employeeCode")}
                    className={`form-input ${errors.employeeCode ? "input-error" : ""}`}
                  />
                  {errors.employeeCode && (
                    <span className="error-text">
                      {errors.employeeCode.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Tên nhân viên <span className="required">*</span>
                  </label>
                  <input
                    placeholder="VD:Nguyen Van A"
                    readOnly={mode === "view"}
                    {...register("fullName")}
                    className={`form-input ${errors?.fullName ? "input-error" : ""}`}
                  />
                  {errors?.fullName && (
                    <span className="error-text">
                      {errors?.fullName.message}
                    </span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Giới tính <span className="required">*</span>
                  </label>
                  <select
                    {...register("gender")}
                    className="form-select"
                    disabled={mode === "view"}
                  >
                    <option value="MALE">Nam</option>
                    <option value="FEMALE">Nữ</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Ngày sinh <span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    disabled={mode === "view"}
                    {...register("dob")}
                    className={`form-input ${errors.dob ? "input-error" : ""}`}
                  />
                  {errors.dob && (
                    <span className="error-text">{errors.dob.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Số căn cước công dân (CCCD){" "}
                    <span className="required">*</span>
                  </label>
                  <input
                    placeholder="017204001807"
                    readOnly={mode === "view"}
                    {...register("idNumber")}
                    className={`form-input ${errors.idNumber ? "input-error" : ""}`}
                  />
                  {errors.idNumber && (
                    <span className="error-text">
                      {errors.idNumber.message}
                    </span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Team / Phòng ban <span className="required">*</span>
                  </label>
                  <select
                    key={teams?.length || 0}
                    disabled={mode === "view"}
                    {...register("teamId")}
                    className={`form-select ${errors.teamId ? "input-error" : ""}`}
                  >
                    <option value="">Chọn phòng ban</option>

                    {teams?.map((team) => (
                      <option key={team.id} value={team.id}>
                        {team.teamName}
                      </option>
                    ))}
                  </select>
                  {errors.teamId && (
                    <span className="error-text">{errors.teamId.message}</span>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Số điện thoại <span className="required">*</span>
                  </label>
                  <input
                    placeholder="VD:0339650969"
                    readOnly={mode === "view"}
                    {...register("phone")}
                    className={`form-input ${errors.phone ? "input-error" : ""}`}
                  />
                  {errors.phone && (
                    <span className="error-text">{errors.phone.message}</span>
                  )}
                </div>
                <div className="form-group">
                  <label className="form-label">
                    Email <span className="required">*</span>
                  </label>
                  <input
                    placeholder="VD:nguyenvana@gmail.com"
                    readOnly={mode === "view"}
                    {...register("email")}
                    className={`form-input ${errors.email ? "input-error" : ""}`}
                  />
                  {errors.email && (
                    <span className="error-text">{errors.email.message}</span>
                  )}
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    Địa chỉ thường trú <span className="required">*</span>
                  </label>
                  <input
                    {...register("address")}
                    placeholder="VD:Ha Noi"
                    readOnly={mode === "view"}
                    className={`form-input ${errors.address ? "input-error" : ""}`}
                  />
                  {errors.address && (
                    <span className="error-text">{errors.address.message}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 2 && (
            <div>
              <div className="dynamic-add-section">
                <div className="dynamic-add-title">
                  <PlusCircle size={16} />{" "}
                  {editingCertIndex !== null
                    ? `CẬP NHẬT VĂN BẰNG / CHỨNG CHỈ (#${editingCertIndex + 1})`
                    : "THÊM VĂN BẰNG / CHỨNG CHỈ"}
                </div>
                <div className="dynamic-grid">
                  <div className="form-group">
                    <label className="form-label">Tên văn bằng *</label>
                    <input
                      value={certForm.name}
                      onChange={(e) => {
                        setCertForm({ ...certForm, name: e.target.value });
                        if (certErrors.name) {
                          setCertErrors({ ...certErrors, name: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: certErrors.name ? "#ef4444" : undefined,
                      }}
                      placeholder="VD: Bằng Kỹ sư CNTT"
                    />
                    {certErrors.name && (
                      <span className="field-error">{certErrors.name}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ngày cấp *</label>
                    <input
                      type="date"
                      value={certForm.startDate}
                      onChange={(e) => {
                        setCertForm({ ...certForm, startDate: e.target.value });
                        if (certErrors.startDate) {
                          setCertErrors({ ...certErrors, startDate: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: certErrors.startDate
                          ? "#ef4444"
                          : undefined,
                      }}
                    />
                    {certErrors.startDate && (
                      <span className="field-error">
                        {certErrors.startDate}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Lĩnh vực *</label>
                    <input
                      value={certForm.field}
                      onChange={(e) => {
                        setCertForm({ ...certForm, field: e.target.value });
                        if (certErrors.field) {
                          setCertErrors({ ...certErrors, field: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: certErrors.field ? "#ef4444" : undefined,
                      }}
                      placeholder="VD: Công nghệ phần mềm"
                    />
                    {certErrors.field && (
                      <span className="field-error">{certErrors.field}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Nội dung / Xếp loại *</label>
                    <input
                      value={certForm.content}
                      onChange={(e) => {
                        setCertForm({ ...certForm, content: e.target.value });
                        if (certErrors.content) {
                          setCertErrors({ ...certErrors, content: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: certErrors.content ? "#ef4444" : undefined,
                      }}
                      placeholder="VD: Loại Giỏi"
                    />
                    {certErrors.content && (
                      <span className="field-error">{certErrors.content}</span>
                    )}
                  </div>

                  <div className="form-group add-btn-wrapper">
                    <label className="form-label">&nbsp;</label>
                    {mode !== "view" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="btn-add"
                          onClick={handleAddCert}
                        >
                          {editingCertIndex !== null ? "Cập nhật" : "Thêm"}
                        </button>

                        {editingCertIndex !== null && (
                          <button
                            type="button"
                            className="btn-cancel"
                            onClick={resetCertForm}
                          >
                            Hủy
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Tên văn bằng</th>
                    <th>Ngày cấp</th>
                    <th>Lĩnh vực</th>
                    <th>Nội dung</th>
                    {mode !== "view" && (
                      <th style={{ textAlign: "center" }}>Thao tác</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {certificates.length === 0 ? (
                    <tr>
                      <td
                        colSpan={mode !== "view" ? 6 : 5}
                        style={{
                          textAlign: "center",
                          color: "#9ca3af",
                          padding: "24px",
                        }}
                      >
                        Chưa có thông tin văn bằng.
                      </td>
                    </tr>
                  ) : (
                    certificates.map((cert, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor:
                            editingCertIndex === idx ? "#fefce8" : undefined,
                        }}
                      >
                        <td>{idx + 1}</td>
                        <td>
                          <b>{cert.name}</b>
                        </td>
                        <td>{cert.startDate}</td>
                        <td>{cert.field}</td>
                        <td>{cert.content}</td>
                        {mode !== "view" && (
                          <td style={{ textAlign: "center" }}>
                            <div
                              style={{
                                display: "inline-flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <button
                                type="button"
                                title="Sửa văn bằng"
                                onClick={() => handleEditCert(idx)}
                                style={{
                                  color: "#2563eb",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                type="button"
                                className="btn-delete"
                                title="Xóa"
                                onClick={() => handleDeleteCert(idx)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
          {activeTab === 3 && (
            <div>
              <div className="dynamic-add-section">
                <div className="dynamic-add-title">
                  <PlusCircle size={16} />{" "}
                  {editingFamilyIndex !== null
                    ? `CẬP NHẬT THÀNH VIÊN GIA ĐÌNH (#${editingFamilyIndex + 1})`
                    : "THÊM THÀNH VIÊN GIA ĐÌNH"}
                </div>
                <div className="dynamic-grid">
                  <div className="form-group">
                    <label className="form-label">Họ tên *</label>
                    <input
                      value={familyForm?.fullName || ""}
                      onChange={(e) => {
                        setFamilyForm({
                          ...familyForm,
                          fullName: e.target.value,
                        });
                        if (familyErrors.fullName) {
                          setFamilyErrors({ ...familyErrors, fullName: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: familyErrors.fullName
                          ? "#ef4444"
                          : undefined,
                      }}
                      placeholder="VD: Nguyễn Văn A"
                    />
                    {familyErrors.fullName && (
                      <span className="field-error">
                        {familyErrors.fullName}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Mối quan hệ *</label>
                    <select
                      value={familyForm?.relationshipType || "FATHER"}
                      onChange={(e) => {
                        setFamilyForm({
                          ...familyForm,
                          relationshipType: e.target.value,
                        });
                        if (familyErrors.relationshipType) {
                          setFamilyErrors({
                            ...familyErrors,
                            relationshipType: "",
                          });
                        }
                      }}
                      className="form-select"
                      style={{
                        borderColor: familyErrors.relationshipType
                          ? "#ef4444"
                          : undefined,
                      }}
                    >
                      <option value="FATHER">Bố</option>
                      <option value="MOTHER">Mẹ</option>
                      <option value="SPOUSE">Vợ/Chồng</option>
                      <option value="CHILD">Con</option>
                      <option value="SIBLING">Anh/Chị/Em</option>
                    </select>
                    {familyErrors.relationshipType && (
                      <span className="field-error">
                        {familyErrors.relationshipType}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Giới tính *</label>
                    <select
                      value={familyForm?.gender || "MALE"}
                      onChange={(e) => {
                        setFamilyForm({
                          ...familyForm,
                          gender: e.target.value,
                        });
                        if (familyErrors.gender) {
                          setFamilyErrors({ ...familyErrors, gender: "" });
                        }
                      }}
                      className="form-select"
                      style={{
                        borderColor: familyErrors.gender
                          ? "#ef4444"
                          : undefined,
                      }}
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                    {familyErrors.gender && (
                      <span className="field-error">{familyErrors.gender}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Ngày sinh *</label>
                    <input
                      type="date"
                      value={familyForm?.dob || ""}
                      onChange={(e) => {
                        setFamilyForm({ ...familyForm, dob: e.target.value });
                        if (familyErrors.dob) {
                          setFamilyErrors({ ...familyErrors, dob: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: familyErrors.dob ? "#ef4444" : undefined,
                      }}
                    />
                    {familyErrors.dob && (
                      <span className="field-error">{familyErrors.dob}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Số CCCD *</label>
                    <input
                      value={familyForm?.idNumber || ""}
                      maxLength={12}
                      onChange={(e) => {
                        setFamilyForm({
                          ...familyForm,
                          idNumber: e.target.value,
                        });
                        if (familyErrors.idNumber) {
                          setFamilyErrors({ ...familyErrors, idNumber: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: familyErrors.idNumber
                          ? "#ef4444"
                          : undefined,
                      }}
                      placeholder="VD: 001200012345"
                    />
                    {familyErrors.idNumber && (
                      <span className="field-error">
                        {familyErrors.idNumber}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">SĐT *</label>
                    <input
                      value={familyForm?.phone || ""}
                      maxLength={12}
                      onChange={(e) => {
                        setFamilyForm({
                          ...familyForm,
                          phone: e.target.value,
                        });
                        if (familyErrors.phone) {
                          setFamilyErrors({ ...familyErrors, phone: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: familyErrors.phone ? "#ef4444" : undefined,
                      }}
                      placeholder="VD: 0912345678"
                    />
                    {familyErrors.phone && (
                      <span className="field-error">{familyErrors.phone}</span>
                    )}
                  </div>

                  <div className="form-group address-group">
                    <label className="form-label">Địa chỉ *</label>
                    <input
                      value={familyForm?.address || ""}
                      onChange={(e) => {
                        setFamilyForm({
                          ...familyForm,
                          address: e.target.value,
                        });
                        if (familyErrors.address) {
                          setFamilyErrors({ ...familyErrors, address: "" });
                        }
                      }}
                      className="form-input"
                      style={{
                        borderColor: familyErrors.address
                          ? "#ef4444"
                          : undefined,
                      }}
                      placeholder="VD: Cầu Giấy, Hà Nội"
                    />
                    {familyErrors.address && (
                      <span className="field-error">
                        {familyErrors.address}
                      </span>
                    )}
                  </div>

                  <div className="form-group">
                    <label className="form-label">&nbsp;</label>
                    {mode !== "view" && (
                      <div style={{ display: "flex", gap: "8px" }}>
                        <button
                          type="button"
                          className="btn-add add-btn-wrapper"
                          onClick={handleAddFamily}
                        >
                          {editingFamilyIndex !== null ? "Cập nhật" : "Thêm"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <table className="data-table">
                <thead>
                  <tr>
                    <th>STT</th>
                    <th>Họ tên</th>
                    <th>Quan hệ</th>
                    <th>Giới tính</th>
                    <th>Số điện thoại</th>
                    <th>Ngày sinh</th>
                    <th>Số CCCD</th>
                    <th>Địa chỉ</th>
                    {mode !== "view" && (
                      <th style={{ textAlign: "center" }}>Thao tác</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {family.length === 0 ? (
                    <tr>
                      <td
                        colSpan={mode !== "view" ? 9 : 8}
                        style={{
                          textAlign: "center",
                          color: "#9ca3af",
                          padding: "24px",
                        }}
                      >
                        Chưa có thông tin gia đình.
                      </td>
                    </tr>
                  ) : (
                    family.map((fam, idx) => (
                      <tr
                        key={idx}
                        style={{
                          backgroundColor:
                            editingFamilyIndex === idx ? "#fefce8" : undefined,
                        }}
                      >
                        <td>{idx + 1}</td>
                        <td>
                          <b>{fam?.fullName}</b>
                        </td>
                        <td>
                          {fam.relationshipType === "FATHER"
                            ? "Bố"
                            : fam.relationshipType === "MOTHER"
                              ? "Mẹ"
                              : fam.relationshipType === "SPOUSE"
                                ? "Vợ/Chồng"
                                : fam.relationshipType === "CHILD"
                                  ? "Con"
                                  : fam.relationshipType === "SIBLING"
                                    ? "Anh/Chị/Em"
                                    : fam.relationshipType}
                        </td>
                        <td>{fam.gender === "MALE" ? "Nam" : "Nữ"}</td>
                        <td>{fam.phone}</td>
                        <td>{fam.dob}</td>
                        <td>{fam.idNumber}</td>
                        <td>{fam.address}</td>
                        {mode !== "view" && (
                          <td style={{ textAlign: "center" }}>
                            <div
                              style={{
                                display: "inline-flex",
                                gap: "8px",
                                alignItems: "center",
                              }}
                            >
                              <button
                                type="button"
                                title="Sửa"
                                onClick={() => handleEditFamily(idx)}
                                style={{
                                  color: "#2563eb",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                }}
                              >
                                <Pencil size={17} />
                              </button>
                              <button
                                type="button"
                                className="btn-delete"
                                title="Xóa"
                                onClick={() => handleDeleteFamily(idx)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <div className="footer-info">
            <CheckCircle2 size={16} color="#10b981" />
          </div>
          <div className="footer-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              {mode === "view" ? "Đóng" : "Hủy"}
            </button>
            {mode === "create" && (
              <button
                className="btn-save"
                type="button"
                onClick={handleSubmit(onSubmitFinal, onError)}
              >
                <Save size={16} /> Lưu
              </button>
            )}
            {mode === "edit" && (
              <button
                className="btn-submit"
                type="button"
                onClick={handleSubmit(onSubmitFinal, onError)}
              >
                <FileSignature size={16} /> Cập nhật
              </button>
            )}
            {(mode === "edit" || mode === "view") && (
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  if (onSwitchToForms) onSwitchToForms(mode);
                }}
                className="btn-outline"
                style={{ marginRight: "auto" }}
              >
                <span style={{ fontSize: "16px" }}>
                  <Files />
                </span>{" "}
                Mở Giấy tờ / Biểu mẫu
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
