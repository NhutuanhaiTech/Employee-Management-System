import React from "react";
import { AlertTriangle } from "lucide-react";
import "./ConfirmDeleteModal.css";
export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm ,onSuccess}) {
  
  if (!isOpen) return null;

  return (
    <div className="confirm-modal-overlay">
      <div className="confirm-modal-box">
        <div className="confirm-modal-header">
          <div className="icon-warning-wrapper">
            <AlertTriangle size={24} className="icon-warning" />
          </div>
          <h3 className="confirm-modal-title">Xác nhận xóa dữ liệu</h3>
        </div>
        
        <div className="confirm-modal-body">
          <p>Bạn có chắc chắn muốn xóa nhân viên này không?</p>
          <p className="text-danger-hint">
            Hành động này không thể hoàn tác và mọi dữ liệu liên quan sẽ bị mất vĩnh viễn.
          </p>
        </div>

        <div className="confirm-modal-footer">
         
          <button type="button" className="btn-confirm-cancel" onClick={onClose}>
            Hủy bỏ
          </button>
          
       
          <button type="button" className="btn-confirm-delete" onClick={onConfirm}>
            Vâng, Xóa ngay!
          </button>
        </div>
      </div>
    </div>
  );
}