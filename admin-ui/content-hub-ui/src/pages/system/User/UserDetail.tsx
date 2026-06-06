import { BsCamera } from "react-icons/bs";
import type { UpdateUserDto, UserDto } from "../../../api/system/user.api";
import NotFound from "../../../components/common/NotFound";

interface Props {
  loading: boolean;
  userDetail: UserDto | null;
  updateUser: UpdateUserDto;
  setUpdateUser: (user: UpdateUserDto) => void;
  showUserDetail: string | null;
  setShowUserDetail: (id: string | null) => void;
  putUser:()=> void;
}
export default function UserDetail({
  loading,
  updateUser,
  setUpdateUser,
  userDetail,
  showUserDetail,
  setShowUserDetail,
  putUser,
}: Props) {
  if (!showUserDetail) return null;
  return (
    <>
      <div
        className="modal d-block fade show"
        tabIndex={-1}
        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      >
        <div
          className="modal-dialog modal-dialog-centered modal-xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title m-0">User Detail</h5>
              <button
                className="btn btn-close"
                aria-label="Close"
                title="Close"
                onClick={() => setShowUserDetail(null)}
              ></button>
            </div>
            <div className="modal-body">
              <div className="modal-content">
                {loading ? (
                  <div className="flex-grow-1">
                    <div className="text-center">
                      <div className="spinner-border text-primary"></div>
                    </div>
                  </div>
                ) : userDetail == null ? (
                  <NotFound text="User not found" />
                ) : (
                  <div className="card shadow-lg p-4">
                    <div className="row small align-items-center">
                      {/* Avatar */}
                      <div className="col-md-3 text-center border-end">
                        <div className="position-relative d-inline-block">
                          <img
                            src={
                              userDetail.avatar
                                ? userDetail.avatar
                                : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
                            }
                            alt="Avatar"
                            className="rounded-circle"
                            style={{
                              width: "180px",
                              height: "180px",
                              objectFit: "cover",
                            }}
                          />

                          <label
                            htmlFor="avatarUpload"
                            className="btn btn-outline-primary rounded-circle position-absolute"
                            style={{
                              right: 0,
                              bottom: 10,
                              width: 42,
                              height: 42,
                            }}
                          >
                            <BsCamera />
                          </label>

                          <input
                            id="avatarUpload"
                            type="file"
                            accept="image/*"
                            className="d-none"
                          />
                        </div>
                      </div>

                      {/* Form */}
                      <div className="col-md-9">
                        <div className="row g-3">
                          {/* User Name */}
                          <div className="col-md-6">
                            <label className="form-label">User Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userDetail.userName}
                              readOnly
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                              type="text"
                              className="form-control"
                              value={userDetail.email}
                              readOnly
                              disabled
                            />
                          </div>
                          {/* Email */}
                          <div className="col-md-6">
                            <label className="form-label">First Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={updateUser.firstName}
                              onChange={(e) =>
                                setUpdateUser({
                                  ...updateUser,
                                  firstName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Last Name</label>
                            <input
                              type="text"
                              className="form-control"
                              value={updateUser.lastName}
                              onChange={(e) =>
                                setUpdateUser({
                                  ...updateUser,
                                  lastName: e.target.value,
                                })
                              }
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">Date Of Birth</label>
                            <input
                              type="date"
                              className="form-control"
                              value={updateUser.dob ?? ""}
                              onChange={(e) =>
                                setUpdateUser({
                                  ...updateUser,
                                  dob: e.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Date Created</label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                userDetail.dateCreated
                                  ? new Date(
                                      userDetail.dateCreated,
                                    ).toLocaleString("vi-VN")
                                  : "-"
                              }
                              readOnly
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">
                              Last Login Date
                            </label>
                            <input
                              type="text"
                              className="form-control"
                              value={
                                userDetail.lastLoginDate
                                  ? new Date(
                                      userDetail.lastLoginDate,
                                    ).toLocaleString("vi-VN")
                                  : "-"
                              }
                              readOnly
                              disabled
                            />
                          </div>
                          <div className="col-md-6">
                            <label className="form-label">Status</label>

                            <div className="form-check form-switch mt-2">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={updateUser.isActive}
                                onChange={(e) => {
                                  const checked = e.target.checked;

                                  if (!checked) {
                                    const confirmed = window.confirm(
                                      "Are you sure you want to block this user?",
                                    );

                                    if (!confirmed) return;
                                  }

                                  setUpdateUser({
                                    ...updateUser,
                                    isActive: checked,
                                  });
                                }}
                              />

                              <label className="form-check-label ms-2">
                                {updateUser.isActive ? "Active" : "Inactive"}
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex justify-content-end mt-4">
                      <button
                        className="btn btn-sm btn-outline-danger me-2"
                        onClick={() => setShowUserDetail(null)}
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        className="btn btn-sm btn-outline-success"
                        onClick={() => putUser()}
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
}
