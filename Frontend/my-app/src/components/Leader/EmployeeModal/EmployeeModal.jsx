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
} from "lucide-react";
import "./EmployeeModal.css";
import apiClient from "../../../lib/api";
import { toast } from "react-toastify";

const employeeSchema = z.object({
  employeeCode: z.string().min(1, "Mã nhân viên là bắt buộc"),
  fullName: z.string().min(1, "Tên nhân viên là bắt buộc"),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
  dob: z.string().min(1, "Ngày sinh là bắt buộc"),
  idNumber: z.string().min(1, "CCCD là bắt buộc"),
  teamId: z.string().min(1, "Phòng ban là bắt buộc"),
  phone: z.string().min(10, "SĐT không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(1, "Địa chỉ là bắt buộc"),
});
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
export default function EmployeeModal({
  isOpen,
  onClose,
  initialData,
  mode,
  onSuccess,
  onSwitchToForms,
}) {
  
  const safeData = initialData?.employeeInfo
    ? initialData.employeeInfo
    : initialData;
  
  const [activeTab, setActiveTab] = useState(1);
  
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
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialData || { gender: "MALE" },
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
    relationshipType: "Bố",
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
          fullName: safeData.fullName,
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
    const finalPayload = {
      ...data,
      avatarUrl:
        initialData?.avatarUrl || "https:",
      createBy: initialData?.createBy || "admin",
      certificates: certificates,
      familyRelationships: family,
    };

    console.log("=== JSON SUBMIT LÊN SPRING BOOT ===");
    console.log(JSON.stringify(finalPayload, null, 2));
    try {
      if (mode === "create") {
        await apiClient.post("/api/employees", finalPayload);
        toast.success("Thêm nhân viên thành công!");
      } else if (mode === "edit") {
        const updateId = initialData?.employeeInfo?.id;
        await apiClient.put(`/api/employees/${updateId}`, finalPayload);
        toast.success("Cập nhật thông tin thành công!");
      }
      reset();
      
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
    if (!certForm.name || !certForm.startDate) return;
    setCertificates([...certificates, certForm]);
    setCertForm({ name: "", startDate: "", field: "", content: "" });
  };
  const handleDeleteCert = (index) =>
    setCertificates(certificates.filter((_, i) => i !== index));

  
  const handleAddFamily = () => {
    if (!familyForm.fullName || !familyForm.dob) {
      alert(
        "Vui lòng nhập ít nhất 'Họ tên' và 'Ngày sinh' để thêm thành viên!",
      );
      return;
    }
    setFamily([...family, familyForm]);
    setFamilyForm({
      fullName: "",
      relationshipType: "FATHER",
      gender: "MALE",
      dob: "",
      idNumber: "",
      address: "",
      phone: "",
    });
  };
  const handleDeleteFamily = (index) =>
    setFamily(family.filter((_, i) => i !== index));

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
            onClick={() => setActiveTab(1)}
          >
            <Contact size={18} /> 1. Thông tin nhân viên
          </button>
          <button
            className={`tab-btn ${activeTab === 2 ? "active" : ""}`}
            onClick={() => setActiveTab(2)}
          >
            <GraduationCap size={18} /> 2. Thông tin văn bằng{" "}
            <span className="tab-badge">{certificates.length}</span>
          </button>
          <button
            className={`tab-btn ${activeTab === 3 ? "active" : ""}`}
            onClick={() => setActiveTab(3)}
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
                    readOnly
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
                    readOnly
                    {...register("fullName")}
                    className={`form-input ${errors.fullName ? "input-error" : ""}`}
                  />
                  {errors.fullName && (
                    <span className="error-text">
                      {errors.fullName.message}
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
                    disabled
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
                    disabled
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
                    readOnly
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
                    disabled
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
                    readOnly
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
                    readOnly
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
                    readOnly
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
                  <PlusCircle size={16} /> THÊM VĂN BẰNG / CHỨNG CHỈ
                </div>
                <div className="dynamic-grid">
                  <div className="form-group">
                    <label className="form-label">Tên văn bằng *</label>
                    <input
                      value={certForm.name}
                      readOnly
                      onChange={(e) =>
                        setCertForm({ ...certForm, name: e.target.value })
                      }
                      className="form-input"
                      placeholder="VD: Bằng Kỹ sư CNTT"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày cấp *</label>
                    <input
                      type="date"
                      readOnly
                      value={certForm.startDate}
                      onChange={(e) =>
                        setCertForm({ ...certForm, startDate: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Lĩnh vực *</label>
                    <input
                    readOnly
                      value={certForm.field}
                      onChange={(e) =>
                        setCertForm({ ...certForm, field: e.target.value })
                      }
                      className="form-input"
                      placeholder="VD: Công nghệ phần mềm"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nội dung / Xếp loại *</label>
                    <input
                    readOnly
                      value={certForm.content}
                      onChange={(e) =>
                        setCertForm({ ...certForm, content: e.target.value })
                      }
                      className="form-input"
                      placeholder="VD: Loại Giỏi"
                    />
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
                    {mode === "create" ||
                      (mode === "edit" && (
                        <th style={{ textAlign: "center" }}>Xóa</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {certificates.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
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
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <b>{cert.name}</b>
                        </td>
                        <td>{cert.startDate}</td>
                        <td>{cert.field}</td>
                        <td>{cert.content}</td>
                        <td style={{ textAlign: "center" }}>
                          {mode !== "view" && (
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteCert(idx)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
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
                  <PlusCircle size={16} /> THÊM THÀNH VIÊN GIA ĐÌNH
                </div>
                <div className="dynamic-grid">
                  <div className="form-group">
                    <label className="form-label">Họ tên *</label>
                    <input
                    readOnly
                      value={familyForm.fullName}
                      onChange={(e) =>
                        setFamilyForm({
                          ...familyForm,
                          fullName: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Mối quan hệ *</label>
                    <select
                      value={familyForm.relationshipType}
                      disable
                      onChange={(e) =>
                        setFamilyForm({
                          ...familyForm,
                          relationshipType: e.target.value,
                        })
                      }
                      className="form-select"
                    >
                      <option>Bố</option>
                      <option>Mẹ</option>
                      <option>Vợ/Chồng</option>
                      <option>Con</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Giới tính</label>
                    <select
                      value={familyForm.gender}
                      disable
                      onChange={(e) =>
                        setFamilyForm({ ...familyForm, gender: e.target.value })
                      }
                      className="form-select"
                    >
                      <option value="MALE">Nam</option>
                      <option value="FEMALE">Nữ</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Ngày sinh *</label>
                    <input
                      type="date"
                      value={familyForm.dob}
                      readOnly
                      onChange={(e) =>
                        setFamilyForm({ ...familyForm, dob: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Số CCCD *</label>
                    <input
                    readOnly
                      value={familyForm.idNumber}
                      onChange={(e) =>
                        setFamilyForm({
                          ...familyForm,
                          idNumber: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">SĐT</label>
                    <input
                      value={familyForm.phone}
                      readOnly
                      onChange={(e) =>
                        setFamilyForm({ ...familyForm, phone: e.target.value })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group address-group">
                    <label className="form-label">Địa chỉ</label>
                    <input
                      value={familyForm.address}
                      readOnly
                      onChange={(e) =>
                        setFamilyForm({
                          ...familyForm,
                          address: e.target.value,
                        })
                      }
                      className="form-input"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">&nbsp;</label>{" "}
                    
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
                    {mode === "create" ||
                      (mode === "edit" && (
                        <th style={{ textAlign: "center" }}>Xóa</th>
                      ))}
                  </tr>
                </thead>
                <tbody>
                  {family.length === 0 ? (
                    <tr>
                      <td
                        colSpan="8"
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
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <b>{fam.fullName}</b>
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
                        <td style={{ textAlign: "center" }}>
                          {mode !== "view" && (
                            <button
                              className="btn-delete"
                              onClick={() => handleDeleteFamily(idx)}
                            >
                              <Trash2 size={18} />
                            </button>
                          )}
                        </td>
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
                onClick={handleSubmit(onSubmitFinal)}
              >
                <Save size={16} /> Lưu
              </button>
            )}
            {mode === "edit" && (
              <button
                className="btn-submit"
                type="button"
                onClick={handleSubmit(onSubmitFinal)}
              >
                <FileSignature size={16} /> Cập nhật
              </button>
            )}
            {(mode === "edit" || mode === "view" ||mode ==="check") && (
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
