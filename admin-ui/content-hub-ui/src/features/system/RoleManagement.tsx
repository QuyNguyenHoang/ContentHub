import { useCallback, useEffect, useState } from "react";
import {
  roleApi,
  type RoleRequest,
  type RoleResponse,
} from "../../api/system/role.api";

import SearchBox from "../../components/common/SearchBox";
import Paging from "../../components/common/PagingComponent";
import Toast from "../../components/common/Toast";
import NotFound from "../../components/common/NotFound";

import RoleTable from "../../pages/system/Role/RoleTable";

import CIcon from "@coreui/icons-react";
import { cilTrash } from "@coreui/icons";
import NewRole from "../../pages/system/Role/NewRole";

export default function RoleManagement() {
  const [roles, setRoles] = useState<RoleResponse[]>([]);
  const [loading, setLoading] = useState(false);

  const [keyword, setKeyword] = useState("");

  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 10;

  const [pageCount, setPageCount] = useState(1);

  // Selected Roles
  const [selectedRoleId, setSelectedRoleId] = useState<string[]>([]);

  // Toast
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };

  //Load role
  const loadRoles = useCallback(async () => {
    try {
      setLoading(true);

      const res = await roleApi.getRolePaging({
        keyword,
        pageNumber,
        pageSize,
      });

      setRoles(res.data.results);
      setPageCount(res.data.pageCount);
    } catch (error: any) {
      console.log(error.response?.data);
      showAlert("Load role failed", "danger");
    } finally {
      setLoading(false);
    }
  }, [keyword, pageNumber]);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const countRole = selectedRoleId.length;

  const handleSelectRole = (id: string) => {
    setSelectedRoleId((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const handleToggleSelectRole = () => {
    if (selectedRoleId.length === roles.length) {
      setSelectedRoleId([]);
    } else {
      setSelectedRoleId(roles.map((r) => r.id));
    }
  };

  //New Role
  const [openNewRole, setOpenNewRole] = useState(false);
  const [roleForm, setRoleForm] = useState<RoleRequest>({
    name: "",
    displayName: "",
  });
  const [saving,setSaving] = useState(false);
  const handleSave = async () => {
    try {
      setSaving(true);
      await roleApi.create(roleForm);
      await loadRoles();
      setRoleForm({
        name: "",
        displayName: "",
      });
      showAlert("Create successful", "success");
      setOpenNewRole(false);
    } catch (error: any) {
      console.log(error.response?.data, "Create new role Failed");
      showAlert(error.response?.data ?? "Create new role failed", "danger");
    }
    finally{
      setSaving(false);
    }
  };
  //Delete
  const handleDeleteRoles = async () => {
    try {
      const res = await roleApi.deleteRoles(selectedRoleId);
      await loadRoles();
      setSelectedRoleId([]);
      showAlert(`Delete ${res.data.deletedCount ?? ""} role success`, "success");
    } catch (error: any) {
      console.log(error.response?.data, "Delete failed");
      showAlert(error.response?.data ?? "Delete failed", "danger");
    }
  };
  return (
    <div className="container d-flex flex-column min-vh-100">
      <h4 className="text-center fw-bold">Role Management</h4>

      {/* Search */}
      <SearchBox
        placeholder="Search Role..."
        keyword={keyword}
        onChangeKeyword={(value) => {
          setKeyword(value);
          setPageNumber(1);
        }}
        loadData={loadRoles}
      />

      {/* Header */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 pt-3 mb-2">
        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          {countRole > 0 && (
            <button
              className="btn btn-sm btn-outline-danger"
              onClick={() => handleDeleteRoles()}
            >
              <CIcon icon={cilTrash} size="sm" />
              Delete ({countRole}) Role
              {countRole > 1 ? "s" : ""}
            </button>
          )}
        </div>

        <div>
          <button
            className="btn btn-sm btn-outline-success fw-bold text-nowrap"
            onClick={() => setOpenNewRole(true)}
          >
            + New Role
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-grow-1">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary"></div>
          </div>
        ) : roles.length === 0 ? (
          <NotFound text="Roles not found" />
        ) : (
          <RoleTable
            roles={roles}
            selectedRoleId={selectedRoleId}
            handleSelectRole={handleSelectRole}
            handleToggleSelectRole={handleToggleSelectRole}
          />
        )}
      </div>

      {/* Paging */}
      <div className="mb-4">
        <Paging
          currentPage={pageNumber}
          totalPages={pageCount}
          onPageChange={setPageNumber}
        />
      </div>

      {/* Toast */}
      <Toast
        showToast={showToast}
        message={message}
        alertColor={alertColor}
        onClose={() => setShowToast(false)}
      />
      {/* New Role */}
      <NewRole
      saving ={saving}
        roleForm={roleForm}
        setRoleForm={setRoleForm}
        openNewRole={openNewRole}
        setOpenNewRole={setOpenNewRole}
        handleSave={handleSave}
      />
    </div>
  );
}
