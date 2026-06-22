import { BsPersonBadge } from "react-icons/bs";
import type { RoleResponse } from "../../../api/system/role.api";
import { useNavigate } from "react-router-dom";

interface Props {
  roles: RoleResponse[];
  selectedRoleId: string[];
  handleSelectRole: (id: string) => void;
  handleToggleSelectRole: () => void;
}

export default function RoleTable({
  roles,
  selectedRoleId,
  handleSelectRole,
  handleToggleSelectRole,
}: Props) {
  const navigate = useNavigate();
  return (
    <div className="card-body p-0 table-responsive">
      <table
        className="table table-sm table-hover small align-middle"
        style={{ minWidth: "1200px" }}
      >
        <thead className="table-light">
          <tr>
            <th>
              <div className="d-flex align-items-center gap-2">
                <input
                  type="checkbox"
                  checked={
                    roles.length > 0 && selectedRoleId.length === roles.length
                  }
                  onChange={handleToggleSelectRole}
                />
                <span>Select all</span>
              </div>
            </th>

            <th>Name</th>
            <th>Display Name</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {roles.map((role) => {
            const isChecked = selectedRoleId.includes(role.id);

            return (
              <tr key={role.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSelectRole(role.id)}
                    onClick={(e) => e.stopPropagation()}
                  />
                </td>

                <td>{role.name}</td>
                <td>{role.displayName}</td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-primary d-flex justify-content-end align-items-center gap-1"
                    onClick={() => {
                      (navigate(`/admin/roles/${role.id}/permissions`));
                    }}
                  >
                    <BsPersonBadge />
                    Phân quyền
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
