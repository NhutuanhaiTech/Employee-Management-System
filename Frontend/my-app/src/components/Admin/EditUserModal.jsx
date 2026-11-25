
import React from 'react';

export default function EditUserModal({ isOpen, user, onClose, onSubmit }) {
  if (!isOpen || !user) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Sửa thông tin nhân viên</h3>
        
        <form onSubmit={onSubmit}>
          <div>
            <label>Họ và tên:</label>
            <input 
              type="text" 
              name="full_name"
              defaultValue={user.full_name} 
            />
          </div>
          
          <div>
            <label>Tên đăng nhập:</label>
            <input 
              type="text" 
              name="username" 
              defaultValue={user.username} 
            />
          </div>
          <div>
            <label>Mật khẩu mới:</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Bỏ trống nếu không muốn đổi mật khẩu" 
            />
          </div>

          <div>
            <label>Chức vụ:</label>
            <select 
              name="pos" 
              defaultValue={user.pos}
            >
              <option value="">-- Chọn chức vụ --</option>
              <option value="Giám đốc">Giám đốc</option>
              <option value="Phó Giám đốc">Phó Giám đốc</option>
              <option value="Trưởng phòng">Trưởng phòng</option>
              <option value="Quản trị viên IT">Quản trị viên IT</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose}>Hủy</button>
            <button type="submit">Lưu thay đổi</button>
          </div>
        </form>
      </div>
    </div>
  );
}