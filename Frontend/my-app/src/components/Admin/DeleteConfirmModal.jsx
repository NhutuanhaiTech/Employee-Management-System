// DeleteConfirmModal.jsx
import React from 'react';
import { TriangleAlert } from 'lucide-react';

export default function DeleteConfirmModal({ isOpen, user, onClose, onConfirm }) {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay">
      <div className="modal-content delete-modal">
        <div className="delete-modal-body">
          <div className="warning-icon-bg">
            <TriangleAlert size={24} color="#dc2626" />
          </div>
          <div className="delete-modal-text">
            <h3>Xác nhận xoá tài khoản</h3>
            <p>
              Bạn có chắc chắn muốn xoá người dùng <strong>{user?.username}</strong> không? 
              Dữ liệu của người dùng này sẽ bị xóa vĩnh viễn và không thể khôi phục.
            </p>
          </div>
        </div>
        
        <div className="delete-modal-actions">
          <button 
            className="btn-cancel" 
            onClick={onClose}
          >
            Hủy
          </button>
          <button 
            className="btn-confirm-delete" 
            onClick={onConfirm}
          >
            Xoá tài khoản
          </button>
        </div>
      </div>
    </div>
  );
}