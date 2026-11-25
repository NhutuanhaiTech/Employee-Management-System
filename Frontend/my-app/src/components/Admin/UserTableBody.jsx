import React from "react";
import { SquarePen, Trash2 } from "lucide-react";

export default function UserTableBody({
  users,
  renderRoleBadge,
  handleEditClick,
  handleDeleteClick,
}) {
  return (
    <table className="data-table">
      <thead>
        <tr>
          <th>Họ và tên</th>
          <th>Username</th>
          <th>Chức vụ (pos)</th>
          <th>Vai trò (Role)</th>
          <th>Trạng thái</th>
          <th>Thao tác</th>
        </tr>
      </thead>
      <tbody>
      
        {users?.map((user) => (
          <tr key={user.id}>
           
            <td className="td-bold">{user.fullName}</td>

           
            <td>{user.userName}</td>

           
            <td>{user.positionName}</td>

            <td>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "6px" }}
              >
                {user.roles?.map((role, index) => (
                  <span key={index}>{role}</span>
                ))}
              </div>
            </td>

            <td>
           
              <span
                className={`status-badge ${user.isActive ? "status-active" : "status-locked"}`}
              >
                <span className="status-dot"></span>
                {user.isActive ? "Hoạt động" : "Không hoạt động"}
              </span>
            </td>
            <td>
              <button
                className="btn-edit"
                onClick={() => handleEditClick(user)}
              >
                <SquarePen />
              </button>
              <button
                className="btn-delete"
                onClick={() => handleDeleteClick(user)}
              >
                <Trash2 />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
