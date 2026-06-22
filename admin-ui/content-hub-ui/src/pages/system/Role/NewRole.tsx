import type { RoleRequest } from "../../../api/system/role.api";

interface Props {
  roleForm: RoleRequest;
  setRoleForm: React.Dispatch<React.SetStateAction<RoleRequest>>;
  openNewRole: boolean;
  setOpenNewRole: React.Dispatch<React.SetStateAction<boolean>>;
  handleSave: () => Promise<void>;
  saving?: boolean;
}

export default function NewRole({
  roleForm,
  setRoleForm,
  openNewRole,
  setOpenNewRole,
  handleSave,
  saving = false,
}: Props) {
  const closeForm = () => {
    setRoleForm({
      name: "",
      displayName: "",
    });

    setOpenNewRole(false);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ) => {
    e.preventDefault();

    if (
      !roleForm.name.trim() ||
      !roleForm.displayName.trim()
    ) {
      return;
    }

    await handleSave();
  };

  return (
    <>
      {openNewRole && (
        <div
          className="offcanvas-backdrop fade show"
          onClick={closeForm}
        />
      )}

      <div
        className={`offcanvas offcanvas-end ${
          openNewRole ? "show" : ""
        }`}
        tabIndex={-1}
        style={{
          visibility: openNewRole ? "visible" : "hidden",
          width: "450px",
        }}
      >
        <div className="offcanvas-header border-bottom">
          <h5 className="offcanvas-title fw-bold">
            Create New Role
          </h5>

          <button
            type="button"
            className="btn-close"
            onClick={closeForm}
          />
        </div>

        <div className="offcanvas-body">
          <form onSubmit={handleSubmit}>
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <h6 className="fw-bold mb-3">
                  Role Information
                </h6>

                <div className="mb-3">
                  <label
                    htmlFor="roleName"
                    className="form-label fw-semibold"
                  >
                    Role Name{" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    id="roleName"
                    type="text"
                    className="form-control"
                    placeholder="Admin"
                    required
                    value={roleForm.name}
                    onChange={(e) =>
                      setRoleForm((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                  />

                  <div className="form-text">
                    Unique system name.
                  </div>
                </div>

                <div className="mb-3">
                  <label
                    htmlFor="displayName"
                    className="form-label fw-semibold"
                  >
                    Display Name{" "}
                    <span className="text-danger">
                      *
                    </span>
                  </label>

                  <input
                    id="displayName"
                    type="text"
                    className="form-control"
                    placeholder="Administrator"
                    required
                    value={roleForm.displayName}
                    onChange={(e) =>
                      setRoleForm((prev) => ({
                        ...prev,
                        displayName: e.target.value,
                      }))
                    }
                  />

                  <div className="form-text">
                    Displayed to users in the UI.
                  </div>
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                type="submit"
                className="btn btn-sm btn-success w-100"
                disabled={
                  saving ||
                  !roleForm.name.trim() ||
                  !roleForm.displayName.trim()
                }
              >
                {saving ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </button>

              <button
                type="button"
                className="btn btn-sm btn-outline-danger w-100"
                onClick={closeForm}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}