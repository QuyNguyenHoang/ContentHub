import { BsCircleFill } from "react-icons/bs";
import type { UserDto } from "../../api/system/user.api";

interface Props {
    topUser: UserDto[] | [];
}
export default function TopUser({
    topUser,
}: Props) {
  return (
    <div className="card p-0">
      <h5 className="text-black text-center p-2">Top Users</h5>
      <div className="table-responsive">
        <table className="table  table-hover table-sm align-middle small">
          <thead className="align-items-center text-nowrap">
            <tr className="align-middle">
              <th className="ps-3">User</th>
              <th>Date Created</th>
              <th>Email</th>
              <th>Total posts</th>
              <th>Activity</th>
            </tr>
          </thead>
          <tbody>
            {topUser.map((u) => {
              return (
                <tr
                  className="text-black align-items-center align-middle"
                  key={u.id}
                >
                  <td className="ps-2">
                    <span>
                      <img
                        src={
                          u.avatar
                            ? u.avatar
                            : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                        }
                        width={32}
                        height={32}
                        className="me-1 rounded-circle"
                      />
                      {u.userName}
                    </span>
                  </td>
                  <td>{new Date(u.dateCreated).toLocaleString("vi-VN")}</td>
                  <td>{u.email ? u.email : "NO"}</td>
                  <td style={{ maxWidth: "100px" }}>{u.totalPost}</td>
                  <td>
                    Online{" "}
                    <BsCircleFill
                      color="#11c33b"
                      style={{ animation: "blink 1.2s infinite" }}
                      size={10}
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
