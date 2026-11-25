import React, { useEffect, useState } from "react";
import apiClient from "../../../lib/api";
import { toast } from "react-toastify";

export default function SalaryIncreaseManager({
  isOpen,
  onClose,
  employeeData,
}) {
  const [leadersList, setLeadersList] = useState([]);
  const empId = employeeData?.id || "NV004";
  const empCode = employeeData?.employeeCode || "NV004";
  console.log("id nhân viên: ", empId);
  const empName =
    employeeData?.fullName || employeeData?.name || "Phạm Minh Tuấn";

  
  const [salaryForm, setSalaryForm] = useState({
    increaseDate: "",
    increaseTimes: "",
    newSalaryLevel: "",
    reason: "",
    note: "",
  });

  
  const [historyList, setHistoryList] = useState([]);
  const [editingId, setEditingId] = useState(null);
  
  const [hasDecision, setHasDecision] = useState(false);
  
  const [showDecisionModal, setShowDecisionModal] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [decisionForm, setDecisionForm] = useState({
    decisionNumber: "",
    effectiveDate: "",
    content: "",
  });

  
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [submitForm, setSubmitForm] = useState({
    submitDate: "",
    leaderId: "",
    leaderPosition: "",
    content: "",
  });
  useEffect(() => {
    if (isOpen && empId) {
      const fetchLeaders = async () => {
        try {
          const response = await apiClient.get("/api/users", {
            params: { roleName: "LEADER" },
          });
          const fetchedLeaders = response.data.data;
          setLeadersList(fetchedLeaders);
          console.log("Danh sách user có role LEADER:", fetchedLeaders);
        } catch (error) {
          console.error("Lỗi tải danh sách lãnh đạo:", error);
        }
      };

      fetchLeaders();
      fetchSalaryHistory();
    }
  }, [isOpen, empId]);
  
  if (!isOpen) return null;

  
  
  

  const handleMainFormChange = (e) => {
    const { name, value } = e.target;
    setSalaryForm({ ...salaryForm, [name]: value });
  };

  const handleSaveToHistory = async () => {
    
    const baseData = {
      increaseTimes: parseInt(salaryForm.increaseTimes) || 1,
      increaseDate: salaryForm.increaseDate,
      newSalaryLevel: salaryForm.newSalaryLevel,
      reason: salaryForm.reason,
      note: salaryForm.note,
    };

    try {
      if (editingId) {
        const updatePayload = { ...baseData };
        console.log(
          `=== GỌI API [PUT] /api/salary-increase-requests/${editingId} ===`,
        );
        console.log("Payload gửi lên :", updatePayload);
        console.log(editingId);
        
        const response = await apiClient.put(
          `/api/salary-increase-requests/${editingId}`,
          updatePayload,
        );

        console.log("✅ Kết quả cập nhật từ Backend:", response.data);

        
        setHistoryList((prev) =>
          prev.map((item) =>
            item.id === editingId ? { ...item, ...baseData } : item,
          ),
        );
        setEditingId(null);
        toast.success("Cập nhật diễn biến tăng lương thành công!");
      } else {
        
        
        
        const createPayload = {
          employeeId: empId,
          ...baseData,
        };

        console.log("=== GỌI API [POST] /api/salary-increase-requests ===");
        console.log("Payload gửi lên:", createPayload);

        const response = await apiClient.post(
          "/api/salary-increase-requests",
          createPayload,
        );

        console.log("✅ Kết quả tạo mới từ Backend:", response.data);

        const newRequestId = response.data?.data;

        const newRecord = {
          id: newRequestId,
          employeeId: empId,
          status: "DRAFT",
          ...baseData,
        };

        setHistoryList((prev) => [...prev, newRecord]);
        toast.success("Tạo mới diễn biến tăng lương thành công!");
      }
      await fetchSalaryHistory(); 
      
      setSalaryForm({
        increaseDate: "",
        increaseTimes: "",
        newSalaryLevel: "",
        reason: "",
        note: "",
      });
    } catch (error) {
      console.error("❌ LỖI KHI LƯU DIỄN BIẾN TĂNG LƯƠNG:", error);

      if (error.response) {
        console.error("--> Status Code:", error.response.status);
        console.error("--> Chi tiết Body lỗi từ Backend:", error.response.data);
        const serverMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Dữ liệu gửi lên không hợp lệ!";
        toast.error(`Lỗi (${error.response.status}): ${serverMessage}`);
      } else {
        toast.error("Có lỗi xảy ra khi kết nối máy chủ!");
      }
    }
  };

  const handleEditRecord = (record) => {
    console.log(`=== BẮT ĐẦU SỬA BẢN GHI ID: ${record.id} ===`);
    setSalaryForm({
      increaseDate: record.increaseDate,
      increaseTimes: record.increaseTimes.toString(),
      newSalaryLevel: record.newSalaryLevel,
      reason: record.reason,
      note: record.note,
    });
    setEditingId(record.id);
  };

  const handleDeleteRecord = async (id) => {
    try {
      console.log(
        `=== GỌI API [DELETE] /api/salary-increase-requests/${id} ===`,
      );
      await apiClient.delete(`/api/salary-increase-requests/${id}`);
      toast.success("Xóa thành công!");

      await fetchSalaryHistory();
    } catch (error) {
      console.error("Lỗi khi xóa:", error);
      toast.error("Không thể xóa bản ghi này!");
    }
  };

  
  const handleOpenDecisionModal = async (record) => {
    setCurrentRecord(record);
    setShowDecisionModal(true);
    try {
      const response = await apiClient.get("/api/salary-increase-decisions", {
        params: {
          requestId: record.id,
        },
      });
      const existingDecision = response.data?.data;
      console.log("giá trị form biễu mẫu decison", existingDecision);
      if (existingDecision) {
        setDecisionForm({
          decisionNumber: existingDecision.decisionNumber || "",
          effectiveDate: existingDecision.effectiveDate || "",
          content: existingDecision.decisionContent || "",
          leaderComment: existingDecision.leaderComment || "", 
        });

        setHasDecision(true);
      } else {
        setDefaultDecisionForm(record);
      }
    } catch (error) {
      console.log(
        "Chưa có biểu mẫu quyết định trước đó, khởi tạo form mặc định.",
      );
      setDefaultDecisionForm(record);
    }
  };
  
  const setDefaultDecisionForm = (record) => {
    setDecisionForm({
      decisionNumber: "",
      effectiveDate: record.increaseDate,
      content: `Quyết định nâng bậc lương lần thứ ${record.increaseTimes} lên mức ${record.newSalaryLevel} đối với nhân viên ${empName}. Lý do: ${record.reason}`,
    });
    setHasDecision(false);
  };
  const handleSaveDecisionForm = async () => {
    try {
      if (hasDecision) {
        const updatePayload = {
          decisionNumber: decisionForm.decisionNumber,
          effectiveDate: decisionForm.effectiveDate,
          content: decisionForm.content,
        };

        console.log(
          `=== GỌI API [PUT] /api/salary-increase-decisions/by-request/${currentRecord.id} ===`,
        );
        console.log("Payload Update:", updatePayload);

        const response = await apiClient.put(
          `/api/salary-increase-decisions/by-request/${currentRecord.id}`,
          updatePayload,
        );

        console.log("✅ Cập nhật biểu mẫu thành công:", response.data);
        toast.success("Cập nhật biểu mẫu quyết định thành công!");
      } else {
        const insertPayload = {
          requestId: currentRecord.id,
          decisionNumber: decisionForm.decisionNumber,
          effectiveDate: decisionForm.effectiveDate,
          content: decisionForm.content,
        };

        console.log("=== GỌI API [POST] /api/salary-increase-decisions ===");
        console.log("Payload Create:", insertPayload);

        const response = await apiClient.post(
          "/api/salary-increase-decisions",
          insertPayload,
        );
        console.log("✅ Tạo mới biểu mẫu thành công:", response.data);
        setHasDecision(true);
        toast.success("Tạo mới biểu mẫu quyết định thành công!");
      }
    } catch (error) {
      console.error(" LỖI KHI LƯU BIỂU MẪU:", error);
      const serverMessage =
        error.response?.data?.message || "Có lỗi xảy ra khi lưu biểu mẫu!";
      toast.error(serverMessage);
    }
  };

  const handleOpenSubmitModal = () => {
    setShowDecisionModal(false);
    setSubmitForm({
      submitDate: new Date().toISOString().split("T")[0],
      leaderId: "",
      leaderPosition: "",
      content: `Trình lãnh đạo phê duyệt Quyết định tăng lương cho nhân viên ${empName}.`,
    });
    setShowSubmitModal(true);
  };

  const handleSelectLeader = (e) => {
    const lId = e.target.value;
    const leader = leadersList.find((l) => l.id === lId);

    setSubmitForm({
      ...submitForm,
      leaderId: lId,
      leaderPosition: leader ? leader.positionName : "",
    });
  };

  const handleFinalSubmitToLeader = async () => {
    const isDraft = currentRecord?.status === "DRAFT";

    
    if (isDraft && !submitForm.leaderId) {
      toast.warning("Vui lòng chọn lãnh đạo phê duyệt!");
      return;
    }

    if (!submitForm.submitDate) {
      toast.warning("Vui lòng chọn ngày trình!");
      return;
    }

    const endpoint = isDraft
      ? `/api/salary-increase-requests/${currentRecord.id}/submit`
      : `/api/salary-increase-requests/${currentRecord.id}/resubmit`;

    
    const finalPayload = isDraft
      ? {
          leaderId: submitForm.leaderId,
          submitDate: submitForm.submitDate,
        }
      : {
          submitDate: submitForm.submitDate,
        };

    try {
      console.log(`=== GỌI API [POST] ${endpoint} ===`);
      console.log("Dữ liệu Trình duyệt gửi lên:", finalPayload);
      const response = await apiClient.post(endpoint, finalPayload);

      console.log("✅ Kết quả trình lãnh đạo từ Backend:", response.data);
      toast.success(
        response.data?.message || "Đã trình lãnh đạo phê duyệt thành công!",
      );

      setShowSubmitModal(false);
      await fetchSalaryHistory();
    } catch (error) {
      console.error("❌ LỖI KHI TRÌNH LÃNH ĐẠO:", error);

      if (error.response) {
        console.error("--> Status Code:", error.response.status);
        console.error("--> Chi tiết lỗi từ Backend:", error.response.data);
        const serverMessage =
          error.response.data?.message ||
          error.response.data?.error ||
          "Không thể trình lãnh đạo phê duyệt!";

        toast.error(`Lỗi (${error.response.status}): ${serverMessage}`);
      } else if (error.request) {
        toast.error("Không thể kết nối tới máy chủ!");
      } else {
        toast.error(`Có lỗi xảy ra: ${error.message}`);
      }
    }
  };
  
  const fetchSalaryHistory = async () => {
    if (!empId) return;

    try {
      console.log(
        `=== GỌI API [GET] LẤY LỊCH SỬ TĂNG LƯƠNG CHO EMPLOYEE: ${empId} ===`,
      );
      const response = await apiClient.get("/api/salary-increase-requests", {
        params: {
          employeeId: empId,
          pageIndex: 1,
          pageSize: 10, 
        },
      });

      console.log("✅ Dữ liệu lịch sử từ Backend:", response.data);

     
      const dataList = response.data?.data || [];
      setHistoryList(dataList);
    } catch (error) {
      console.error("❌ Lỗi khi lấy danh sách lịch sử tăng lương:", error);
      if (error.response) {
        console.error("--> Status:", error.response.status);
        console.error("--> Chi tiết:", error.response.data);
      }
    }
  };
 
  return (
   
    <div style={overlayStyle}>
     
      <div
        style={{
          ...modalBoxStyle,
          width: "1000px",
          display: "flex",
          flexDirection: "column",
        }}
      >
      
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e5e7eb",
            paddingBottom: "15px",
            marginBottom: "15px",
          }}
        >
          <h2 style={{ margin: 0, fontSize: "18px", color: "#111827" }}>
            Cập nhật diễn biến: {empName} ({empCode})
          </h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            &times;
          </button>
        </div>

      
        <div style={{ flex: 1, overflowY: "auto", paddingRight: "5px" }}>
          
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
              marginBottom: "20px",
            }}
          >
            <h3
              style={{
                marginTop: 0,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "10px",
                fontSize: "15px",
              }}
            >
              Nhập thông tin Tăng lương mới
            </h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr 1fr 1fr",
                gap: "15px",
                marginTop: "15px",
              }}
            >
              <div>
                <label style={labelStyle}>
                  Ngày tăng lương <span style={reqStyle}>*</span>
                </label>
                <input
                  type="date"
                  name="increaseDate"
                  value={salaryForm.increaseDate}
                  onChange={handleMainFormChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Lần thứ <span style={reqStyle}>*</span>
                </label>
                <input
                  type="number"
                  name="increaseTimes"
                  value={salaryForm.increaseTimes}
                  onChange={handleMainFormChange}
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Bậc lương mới <span style={reqStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="newSalaryLevel"
                  value={salaryForm.newSalaryLevel}
                  onChange={handleMainFormChange}
                  placeholder="VD: Bậc 3 (18.000.000đ)"
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Lý do tăng lương <span style={reqStyle}>*</span>
                </label>
                <input
                  type="text"
                  name="reason"
                  value={salaryForm.reason}
                  onChange={handleMainFormChange}
                  placeholder="VD: Đạt KPI"
                  style={inputStyle}
                />
              </div>
              <div style={{ gridColumn: "span 4" }}>
                <label style={labelStyle}>Ghi chú</label>
                <input
                  type="text"
                  name="note"
                  value={salaryForm.note}
                  onChange={handleMainFormChange}
                  placeholder="Ghi chú thêm..."
                  style={inputStyle}
                />
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                marginTop: "15px",
              }}
            >
              <button onClick={handleSaveToHistory} style={btnPrimaryStyle}>
                {editingId ? "Cập nhật thay đổi" : "Lưu vào bảng diễn biến"}
              </button>
            </div>
          </div>
          <div
            style={{
              backgroundColor: "#f9fafb",
              padding: "20px",
              borderRadius: "8px",
              border: "1px solid #e5e7eb",
            }}
          >
            <h3 style={{ marginTop: 0, fontSize: "15px" }}>
              Danh sách lịch sử Tăng lương
            </h3>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "10px",
                textAlign: "left",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr
                  style={{
                    backgroundColor: "#f3f4f6",
                    borderBottom: "2px solid #e5e7eb",
                  }}
                >
                  <th style={thStyle}>LẦN THỨ</th>
                  <th style={thStyle}>NGÀY TĂNG LƯƠNG</th>
                  <th style={thStyle}>BẬC LƯƠNG</th>
                  <th style={thStyle}>LÝ DO</th>
                  <th style={thStyle}>TRẠNG THÁI</th>
                  <th style={thStyle}>BIỂU MẪU ĐI KÈM</th>
                  <th style={thStyle}>THAO TÁC</th>
                </tr>
              </thead>
              <tbody>
                {historyList.length === 0 ? (
                  <tr>
                    <td
                      colSpan="7"
                      style={{ textAlign: "center", padding: "20px" }}
                    >
                      Chưa có lịch sử tăng lương
                    </td>
                  </tr>
                ) : (
                  historyList.map((row) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: "1px solid #e5e7eb",
                        backgroundColor: "#fff",
                      }}
                    >
                      <td style={tdStyle}>Lần {row.increaseTimes}</td>
                      <td style={tdStyle}>{row.increaseDate}</td>
                      <td style={tdStyle}>{row.newSalaryLevel}</td>
                      <td style={tdStyle}>{row.reason}</td>
                      <td style={tdStyle}>
                        {(() => {
                          const statusMap = {
                            DRAFT: {
                              label: "Lưu mới",
                              bg: "#f1f5f9",
                              color: "#475569",
                              border: "#cbd5e1",
                              dot: "#64748b",
                              ring: "rgba(100, 116, 139, 0.16)",
                            },
                            PENDING: {
                              label: "Chờ duyệt",
                              bg: "#fefce8",
                              color: "#a16207",
                              border: "#fde047",
                              dot: "#eab308",
                              ring: "rgba(234, 179, 8, 0.22)",
                            },
                            UPDATE_REQUIRED: {
                              label: "Yêu cầu bổ sung",
                              bg: "#fff7ed",
                              color: "#c2410c",
                              border: "#fdba74",
                              dot: "#f97316",
                              ring: "rgba(249, 115, 22, 0.2)",
                            },
                            APPROVED: {
                              label: "Đã duyệt",
                              bg: "#f0fdf4",
                              color: "#15803d",
                              border: "#86efac",
                              dot: "#22c55e",
                              ring: "rgba(34, 197, 94, 0.2)",
                            },
                            REJECTED: {
                              label: "Từ chối",
                              bg: "#fef2f2",
                              color: "#b91c1c",
                              border: "#fca5a5",
                              dot: "#ef4444",
                              ring: "rgba(239, 68, 68, 0.2)",
                            },
                          };

                          const cfg = statusMap[row.status] || {
                            label: row.status,
                            bg: "#f3f4f6",
                            color: "#4b5563",
                            border: "#d1d5db",
                            dot: "#6b7280",
                            ring: "rgba(107, 114, 128, 0.16)",
                          };

                          return (
                            <span
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(-1px)";
                                e.currentTarget.style.boxShadow =
                                  "0 3px 6px rgba(0, 0, 0, 0.06)";
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform =
                                  "translateY(0)";
                                e.currentTarget.style.boxShadow =
                                  "0 1px 2px rgba(0, 0, 0, 0.03)";
                              }}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "7px",
                                backgroundColor: cfg.bg,
                                color: cfg.color,
                                border: `1px solid ${cfg.border}`,
                                padding: "4px 11px",
                                borderRadius: "999px",
                                fontSize: "12px",
                                fontWeight: 600,
                                whiteSpace: "nowrap",
                                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.03)",
                                transition:
                                  "transform 0.18s ease, box-shadow 0.18s ease",
                                userSelect: "none",
                              }}
                            >
                              <span
                                style={{
                                  width: "6px",
                                  height: "6px",
                                  borderRadius: "50%",
                                  backgroundColor: cfg.dot,
                                  boxShadow: `0 0 0 2.5px ${cfg.ring}`,
                                  flexShrink: 0,
                                }}
                              />
                              {cfg.label}
                            </span>
                          );
                        })()}
                      </td>
                      <td style={tdStyle}>
                        <button
                          onClick={() => handleOpenDecisionModal(row)}
                          style={btnOutlineStyle}
                        >
                          📄 QĐ Tăng lương
                        </button>
                      </td>
                      <td style={tdStyle}>
                        {row.status !== "APPROVED" &&
                          row.status !== "PENDING" &&
                          row.status !== "REJECTED" && (
                            <div style={{ display: "flex", gap: "8px" }}>
                              <button
                                onClick={() => handleEditRecord(row)}
                                style={btnSmallStyle}
                              >
                                Sửa
                              </button>

                              {row.status === "DRAFT" && (
                                <button
                                  onClick={() => handleDeleteRecord(row.id)}
                                  style={{
                                    ...btnSmallStyle,
                                    backgroundColor: "#ef4444",
                                    color: "white",
                                    border: "none",
                                  }}
                                >
                                  Xóa
                                </button>
                              )}
                            </div>
                          )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* --- FOOTER MODAL CHÍNH --- */}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "20px",
            borderTop: "1px solid #e5e7eb",
            paddingTop: "15px",
          }}
        >
          <button onClick={onClose} style={btnCancelStyle}>
            Đóng
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* CÁC SUB-MODAL HIỂN THỊ CHỒNG LÊN TRÊN MODAL CHÍNH NẾU ĐƯỢC KÍCH HOẠT */}
      {/* ========================================================= */}

      {/* 4. SUB-MODAL 1: BIỂU MẪU QUYẾT ĐỊNH */}
      {showDecisionModal && (
        <div style={subOverlayStyle}>
          <div style={{ ...modalBoxStyle, width: "800px" }}>
            <h3 style={{ textAlign: "center", color: "#1d4ed8", marginTop: 0 }}>
              CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              <br />
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "normal",
                  color: "#374151",
                }}
              >
                Độc lập - Tự do - Hạnh phúc
              </span>
              <br />
              <br />
              QUYẾT ĐỊNH VỀ VIỆC TĂNG LƯƠNG NHÂN VIÊN
            </h3>

            <div style={{ display: "flex", gap: "20px", marginTop: "20px" }}>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>
                  Số Quyết định <span style={reqStyle}>*</span>
                </label>
                <input
                  type="text"
                  value={decisionForm.decisionNumber}
                  onChange={(e) =>
                    setDecisionForm({
                      ...decisionForm,
                      decisionNumber: e.target.value,
                    })
                  }
                  disabled={currentRecord?.status === "PENDING"}
                  style={{
                    ...inputStyle,
                    ...(currentRecord?.status === "PENDING" && {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                    }),
                  }}
                  placeholder="Ví dụ: 10/2026/QĐ-TL"
                />
              </div>
              <div style={{ flex: 1 }}>
                <label style={labelStyle}>
                  Ngày hiệu lực <span style={reqStyle}>*</span>
                </label>
                <input
                  type="date"
                  value={decisionForm.effectiveDate}
                  onChange={(e) =>
                    setDecisionForm({
                      ...decisionForm,
                      effectiveDate: e.target.value,
                    })
                  }
                  disabled={currentRecord?.status === "PENDING"}
                  style={{
                    ...inputStyle,
                    ...(currentRecord?.status === "PENDING" && {
                      backgroundColor: "#f3f4f6",
                      cursor: "not-allowed",
                    }),
                  }}
                />
              </div>
            </div>
            <div style={{ marginTop: "15px" }}>
              <label style={labelStyle}>
                Căn cứ và Nội dung quyết định <span style={reqStyle}>*</span>
              </label>
              <textarea
                value={decisionForm.content}
                onChange={(e) =>
                  setDecisionForm({ ...decisionForm, content: e.target.value })
                }
                disabled={currentRecord?.status === "PENDING"}
                style={{
                  ...inputStyle,
                  height: "80px",
                  resize: "vertical",
                  ...(currentRecord?.status === "PENDING" && {
                    backgroundColor: "#f3f4f6",
                    cursor: "not-allowed",
                  }),
                }}
              />
            </div>
            <div style={{ marginTop: "15px" }}>
              <label style={labelStyle}>
                Ý kiến của Lãnh đạo (Role Lãnh đạo nhập)
              </label>
              <textarea
                value={decisionForm.leaderComment || ""}
                placeholder="Dành cho Lãnh đạo phê duyệt..."
                disabled
                style={{
                  ...inputStyle,
                  backgroundColor: "#f3f4f6",
                  cursor: "not-allowed",
                  height: "50px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setShowDecisionModal(false)}
                style={btnCancelStyle}
              >
                Đóng
              </button>
              {(currentRecord?.status === "DRAFT" ||
                currentRecord?.status === "UPDATE_REQUIRED") && (
                <>
                  <button
                    onClick={handleSaveDecisionForm}
                    style={{ ...btnPrimaryStyle, backgroundColor: "#2563eb" }}
                  >
                    Lưu biểu mẫu
                  </button>
                  <button
                    onClick={handleOpenSubmitModal}
                    style={{ ...btnPrimaryStyle, backgroundColor: "#15803d" }}
                  >
                    Trình lãnh đạo phê duyệt
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. SUB-MODAL 2: XÁC NHẬN TRÌNH LÃNH ĐẠO */}
      {showSubmitModal && (
        <div style={subOverlayStyle}>
          <div style={{ ...modalBoxStyle, width: "500px" }}>
            <h3
              style={{
                marginTop: 0,
                borderBottom: "1px solid #e5e7eb",
                paddingBottom: "10px",
              }}
            >
              Trình lãnh đạo phê duyệt
            </h3>
            <div style={{ marginTop: "15px" }}>
              <label style={labelStyle}>
                Ngày trình <span style={reqStyle}>*</span>
              </label>
              <input
                type="date"
                value={submitForm.submitDate}
                onChange={(e) =>
                  setSubmitForm({ ...submitForm, submitDate: e.target.value })
                }
                style={inputStyle}
              />
            </div>
            {currentRecord?.status !== "UPDATE_REQUIRED" && (
              <>
                <div style={{ marginTop: "15px" }}>
                  <label style={labelStyle}>
                    Tên lãnh đạo <span style={reqStyle}>*</span>
                  </label>
                  <select
                    value={submitForm.leaderId}
                    onChange={handleSelectLeader}
                    style={inputStyle}
                  >
                    <option value="">-- Chọn lãnh đạo phê duyệt --</option>
                    {leadersList.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.fullName}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ marginTop: "15px" }}>
                  <label style={labelStyle}>
                    Chức vụ lãnh đạo (Tự động điền)
                  </label>
                  <input
                    type="text"
                    value={submitForm.leaderPosition}
                    disabled
                    style={{ ...inputStyle, backgroundColor: "#f3f4f6" }}
                  />
                </div>
              </>
            )}
            <div style={{ marginTop: "15px" }}>
              <label style={labelStyle}>
                Nội dung trình lãnh đạo <span style={reqStyle}>*</span>
              </label>
              <textarea
                value={submitForm.content}
                onChange={(e) =>
                  setSubmitForm({ ...submitForm, content: e.target.value })
                }
                style={{ ...inputStyle, height: "70px" }}
              />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
                marginTop: "25px",
              }}
            >
              <button
                onClick={() => setShowSubmitModal(false)}
                style={btnCancelStyle}
              >
                Hủy
              </button>
              <button
                onClick={handleFinalSubmitToLeader}
                style={btnPrimaryStyle}
              >
                Xác nhận gửi lãnh đạo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}




const labelStyle = {
  display: "block",
  fontSize: "13px",
  fontWeight: "600",
  color: "#374151",
  marginBottom: "5px",
};
const reqStyle = { color: "#ef4444" };
const inputStyle = {
  width: "100%",
  padding: "8px 12px",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  fontSize: "14px",
  boxSizing: "border-box",
  fontFamily: "inherit",
};
const btnPrimaryStyle = {
  padding: "8px 16px",
  backgroundColor: "#2563eb",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600",
};
const btnCancelStyle = {
  padding: "8px 16px",
  backgroundColor: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  fontWeight: "600",
};
const btnOutlineStyle = {
  padding: "4px 10px",
  backgroundColor: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
  fontWeight: "600",
};
const btnSmallStyle = {
  padding: "4px 12px",
  backgroundColor: "#fff",
  color: "#374151",
  border: "1px solid #d1d5db",
  borderRadius: "4px",
  cursor: "pointer",
  fontSize: "12px",
};
const thStyle = {
  padding: "12px",
  color: "#4b5563",
  fontWeight: "600",
  fontSize: "12px",
};
const tdStyle = { padding: "12px", fontSize: "13px", color: "#111827" };


const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};


const subOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  backgroundColor: "rgba(0,0,0,0.6)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1100,
};


const modalBoxStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "8px",
  maxHeight: "90vh",
  overflowY: "auto",
  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
};
