import { useEffect, useState } from "react";
import { roleApi, type PermissionDto } from "../../api/system/role.api";
import Permission from "../../pages/system/Role/Permissions";
import Toast from "../../components/common/Toast";
import { useParams } from "react-router-dom";

export default function PermissionManagement() {
  const { roleId } = useParams();
  // Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  const [loading, setLoading] = useState(false);
  //Permission
  const [permissions, setPermissions] = useState<PermissionDto | null>(null);
  const loadPermissions = async () => {
    try {
      setLoading(true);
      if (!roleId) return;
      const res = await roleApi.getPermissions(roleId);
      setPermissions(res.data);
    } catch (error: any) {
      console.log(error.response?.data);
      showAlert("Load permisson failed", "danger");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadPermissions();
  }, [roleId]);
  //Save change
  const savePermissions = async () => {
    if (!permissions) return;
    try {
      await roleApi.savePermissions(permissions);
      showAlert("Update permission success", "success");
    } 
    catch(error:any)
    {
      console.log(error.reponse?.data,"Save faild");
      showAlert(error.response?.data ?? "Save faild","danger")
    }
  };
  return (
    <>
      <div className="container d-flex flex-column min-vh-100">
        <h4 className="text-center fw-bold">Permission Management</h4>
        <h5 className="fw-bold mb-3">
          Role Permissions - {" "}
          <span className="text-primary">
            {permissions?.roleName ?? "Unknown Role"}
          </span>
        </h5>
        {/* Toast */}
        <Toast
          showToast={showToast}
          message={message}
          alertColor={alertColor}
          onClose={() => setShowToast(false)}
        />

        {/* Permission */}
        <Permission
          loading={loading}
          permissions={permissions}
          setPermissions={setPermissions}
          savePermissions={savePermissions}
        />
      </div>
    </>
  );
}
