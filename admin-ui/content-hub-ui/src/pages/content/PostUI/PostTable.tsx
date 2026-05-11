import type { PostResponse } from "../../../api/content/post.api";

interface Props {
  post: PostResponse[];
}
export default function PostTable({ post = [] }: Props) {
  if (post.length === 0) {
    return <div className="text-center text-black">No post found</div>;
  }
  return (
    <div className="card-body p-0">
      <div className="table-responsive">
        <table className="table table-sm table-hover align-middle mb-0 small">
          <thead className="table-light text-center">
            <tr className="text-sm">
                <th>
                    <input type ="checkbox"/>
                </th>
              <th className="text-small">Id</th>
              <th>Name</th>

              <th>Status</th>

              <th>Tags</th>

              <th>Date Created</th>
              <th>Date Modified</th>
              <th>Is Paid</th>
              <th>Is Deleted</th>
              <th>Author User Id</th>
            </tr>
          </thead>
          <tbody className="text-center">
            {post.map((p) => {
              return <tr key={p.id}>
                <td>
                    <input type ="checkbox"/>
                </td>
                <td>
                    {p.id}
                </td>
              </tr>;
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
