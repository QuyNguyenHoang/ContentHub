import type { UserDto } from "../../../api/system/user.api";


interface Props {
  users: UserDto[] | [];
  selectUserIds: string[];
  handleSelectUser: (id: string) => void;
  handleToggleSelectUser: () => void;
  setShowUserDetail: (id:string | null) => void;
}
export default function UserTable({
  users,
  selectUserIds,
  handleSelectUser,
  handleToggleSelectUser,
  setShowUserDetail,
}: Props) {
  return (
    <div className="card-body p-0 table-responsive">
      <table
        className="table table-sm table-hover small align-middle"
        style={{ minWidth: "1200px" }}
      >
        <thead className="table-light">
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  users.length > 0 && selectUserIds.length === users.length
                }
                onChange={handleToggleSelectUser}
              />
            </th>
            <th>User</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Dob</th>

            <th>Date Created</th>
            <th>Last Login Date</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => {
            const isChecked = selectUserIds.includes(u.id);
            return (
              <tr
                key={u.id}
                style={{ cursor: "pointer" }}
                className={u.isAdmin ? "table-success fw-semibold " : ""}
                onClick={()=> setShowUserDetail(u.id)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => handleSelectUser(u.id)}
                  />
                </td>

                <td>
                  <span>
                    <img
                      src={
                        u.avatar
                          ? u.avatar
                          : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                      }
                      width={24}
                      height={24}
                      className="rounded-circle me-1"
                      alt="avatar"
                    />
                    {`${u.firstName ?? ""} ${u.lastName ?? ""}`}
                  </span>
                </td>

                <td>{u.userName}</td>
                <td>{u.email}</td>

                <td>
                  {u.dob ? new Date(u.dob).toLocaleDateString("vi-VN") : "-"}
                </td>

                <td>
                  {u.dateCreated
                    ? new Date(u.dateCreated).toLocaleString("vi-VN")
                    : "-"}
                </td>

                <td>
                  {u.lastLoginDate
                    ? new Date(u.lastLoginDate).toLocaleString("vi-VN")
                    : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
