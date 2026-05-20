import type { PostActivityLogResponse } from "../../../api/content/postActivityLog.api";

interface Props {
  postActivityLog: PostActivityLogResponse[];
}
export default function PostActivityLogTable({ postActivityLog }: Props) {
  return (
    <div>
      <table className="table table-responsive table-hover table-sm align-middle text-center small">
        <thead>
          <tr>
            <th>User Approve</th>
            <th>From Status</th>
            <th>To Status</th>
            <th>Date Approve</th>
            <th>Note</th>
          </tr>
        </thead>
        <tbody>
          {postActivityLog.map((p) => {
            return (
              <tr key={p.id}>
                <td>{p.adminName}</td>
                <td
                  className={`fw-bold ${p.fromStatus === "Pending" ? "text-danger" : "text-success"}`}
                >
                  {p.fromStatus}
                </td>
                <td
                  className={`fw-bold ${p.fromStatus === "Published" ? "text-danger" : "text-success"}`}
                >
                  {p.toStatus}
                </td>
                <td>{new Date(p.dateCreated).toLocaleString("vi-VN")}</td>
                <td>{p.note}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
