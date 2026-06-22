import { useMemo, useState } from "react";
import type { PermissionDto } from "../../../api/system/role.api";
import NotFound from "../../../components/common/NotFound";
import { useNavigate } from "react-router-dom";


interface Props {
  loading: boolean;
  permissions: PermissionDto | null;
  setPermissions: React.Dispatch<React.SetStateAction<PermissionDto | null>>;
  savePermissions: (data: PermissionDto) => Promise<void>;
}

export default function Permission({
  loading,
  permissions,
  setPermissions,
  savePermissions,
}: Props) {
  const [saving, setSaving] = useState(false);
  const navigate = useNavigate();
  const groups = useMemo(() => {
    if (!permissions) return {};

    return permissions.roleClaims.reduce<
      Record<string, typeof permissions.roleClaims>
    >((acc, claim) => {
      const module = claim.value.split(".")[1] ?? "Other";

      acc[module] ??= [];
      acc[module].push(claim);

      return acc;
    }, {});
  }, [permissions]);

  const togglePermission = (value: string) => {
    if (!permissions) return;

    setPermissions({
      ...permissions,
      roleClaims: permissions.roleClaims.map((p) =>
        p.value === value ? { ...p, selected: !p.selected } : p,
      ),
    });
  };

  const toggleModule = (module: string, checked: boolean) => {
    if (!permissions) return;

    setPermissions({
      ...permissions,
      roleClaims: permissions.roleClaims.map((p) =>
        (p.value.split(".")[1] ?? "Other") === module
          ? { ...p, selected: checked }
          : p,
      ),
    });
  };

  const handleSave = async () => {
    if (!permissions) return;

    try {
      setSaving(true);
      await savePermissions(permissions);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!permissions) {
    return <NotFound text="Permission not found" />;
  }

  return (
    <>
      <div className="row">
        {Object.entries(groups).map(([module, claims]) => {
          const total = claims.length;
          const selectedCount = claims.filter((x) => x.selected).length;

          const allChecked = total > 0 && selectedCount === total;

          return (
            <div
              key={module}
              className="col-12 col-md-6 col-lg-4 col-xl-3 mb-4"
            >
              <div className="card shadow-sm h-100">
                <div className="card-header bg-light">
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{module}</strong>

                    <div className="form-check m-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={allChecked}
                        onChange={(e) => toggleModule(module, e.target.checked)}
                      />
                    </div>
                  </div>

                  <small className="text-muted">
                    {selectedCount}/{total} permissions
                  </small>
                </div>

                <div className="card-body">
                  {claims.map((claim) => (
                    <div key={`${claim.value}-${claim.displayName}`} className="form-check mb-2">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        checked={claim.selected}
                        onChange={() => togglePermission(claim.value)}
                      />

                      <label className="form-check-label">
                        {claim.displayName}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="d-flex justify-content-start mt-3 gap-3 p-2">
        <button
          className="btn btn-sm btn-outline-primary"
          disabled={saving}
          onClick={handleSave}
        >
          {saving ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              Saving...
            </>
          ) : (
            "Save Permissions"
          )}
        </button>
        <button className="btn btn-sm btn-outline-danger"
        onClick={()=>navigate("/admin/roles")}
        >
              Cancle
        </button>
      </div>
    </>
  );
}
