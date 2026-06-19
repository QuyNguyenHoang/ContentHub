import { useCallback, useEffect, useState } from "react";
import {
  type UpdateUserDto,
  userApi,
  type UserDto,
} from "../../api/system/user.api";
import UserTable from "../../pages/system/User/UserTable";
import SearchBox from "../../components/common/SearchBox";
import Paging from "../../components/common/PagingComponent";
import { useNavigate } from "react-router-dom";
import CIcon from "@coreui/icons-react";
import { cilFilter, cilTrash } from "@coreui/icons";
import NotFound from "../../components/common/NotFound";
import UserDetail from "../../pages/system/User/UserDetail";
import Toast from "../../components/common/Toast";

interface Props {}
export const USER_FILTER = {
  ADMIN: "admin",
  OLD_USER: "old_user",
  NEW_USER: "new_user",
  NOT_ACTIVE: "not_active",
} as const;
export const USER_FILTER_OPTIONS = Object.values(USER_FILTER);
export default function UserManagement({}: Props) {
  const [users, setUsers] = useState<UserDto[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 2;
  const [pageCount, setPageCount] = useState(1);
  const navigate = useNavigate();
  const [filter, setFilter] = useState("");
  const [keyword, setKeyWord] = useState("");
  const [totalUsers, setTotalUsers] = useState(0);
  //User Detail + Update
  const [showUserDetail, setShowUserDetail] = useState<string | null>(null);
  const [userDetail, setUserDetail] = useState<UserDto | null>(null);
  const [updateUser, setUpdateUser] = useState<UpdateUserDto>({
    firstName: "",
    lastName: "",
    dob: "",
    avatar: "",
    isActive: true,
  });
  //Alert
  const [alertColor, setAlertColor] = useState<"success" | "danger">("success");
  const [message, setMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const showAlert = (message: string, color: "success" | "danger") => {
    setMessage(message);
    setAlertColor(color);
    setShowToast(true);
  };
  const putUser = async () => {
    try {
      setLoading(true);
      if (showUserDetail) {
        const res = await userApi.updateUser(showUserDetail, updateUser);
        showAlert(res.data.message, "success");
        await loadUser();
      }
    } catch (error) {
      console.log(error, "Can not update user");
    } finally {
      setLoading(false);
    }
  };
  const loadUserDetail = async () => {
    try {
      setLoading(true);
      if (showUserDetail) {
        const res = await userApi.getById(showUserDetail);
        const data = res.data;
        setUserDetail(data);
        setUpdateUser({
          firstName: data.firstName,
          lastName: data.lastName,
          dob: data.dob,
          avatar: data.avatar,
          isActive: data.isActive,
        });
      }
    } catch (error) {
      console.log(error, "Load user detail faild");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadUserDetail();
  }, [showUserDetail]);
  //selected User
  const [selectUserIds, setSelectUserIds] = useState<string[]>([]);
  const countUser = selectUserIds.length;
  //select user
  const handleSelectUser = (id: string) => {
    setSelectUserIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };
  //select all
  const handleToggleSelectUser = () => {
    if (selectUserIds.length === users.length) {
      setSelectUserIds([]);
    } else {
      setSelectUserIds(users.map((u) => u.id));
    }
  };
  //Load user
  const loadUser = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userApi.getUserPaging({
        filter,
        keyword,
        pageNumber,
        pageSize,
      });
      const data = res.data.results;
      setUsers(data);
      setTotalUsers(res.data.totalCount);
      setPageCount(res.data.pageCount);
    } catch (error) {
      console.log(error, "load user failed!!!");
    } finally {
      setLoading(false);
    }
  }, [filter, keyword, pageNumber, pageSize]);
  useEffect(() => {
    loadUser();
  }, [loadUser]);
  //hadle filter change
  const handleFilterChange = (value: string) => {
    setFilter(value === "All" ? "" : value);
    setPageNumber(1);
  };
  return (
    <div className="container d-flex flex-column min-vh-100">
      <h4 className="text-center fw-bold">Users Management</h4>
      <h6>{filter}</h6>
      <div>
        <SearchBox
          placeholder="Search User..."
          keyword={keyword}
          onChangeKeyword={(value) => {
            setKeyWord(value);
            setPageNumber(1);
          }}
          loadData={loadUser}
        />
      </div>
      {/* filter areas */}
      <div className="d-flex flex-column flex-lg-row justify-content-between align-items-start align-items-lg-center gap-3 pt-3 mb-2">
        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          <div>
            <h4 className="fw-bold m-0">Total Users ({totalUsers})</h4>
          </div>
          {/* delete button */}
          {countUser > 0 && (
            <div className="">
              <button className="btn btn-sm btn-outline-danger">
                <CIcon icon={cilTrash} size="sm" />
                Delete ({countUser}) User{countUser === 1 ? "" : "s"}
              </button>
            </div>
          )}
        </div>

        <div className="d-flex justify-content-between align-items-center gap-2 w-100">
          <div className="input-group input-group-sm">
            <span className="input-group-text">
              <CIcon icon={cilFilter} />
            </span>

            <select
              value={filter || "All"}
              className="form-select auto"
              onChange={(e) => {
                handleFilterChange(e.target.value);
              }}
            >
              <option value="All">All</option>

              {USER_FILTER_OPTIONS.map((filter) => (
                <option key={filter} value={filter}>
                  {filter}
                </option>
              ))}
            </select>
          </div>
          {/* New button */}
          <div>
            <button
              className="btn btn-sm btn-outline-success rounded-2 fw-bold text-nowrap"
              onClick={() => navigate("/new")}
            >
              + New User
            </button>
          </div>
        </div>
      </div>
      {/* Content */}
      <div className="flex-grow-1">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary text-center"></div>
          </div>
        ) : (
          <div>
            {users.length === 0 ? (
              <NotFound text="User not found" />
            ) : (
              <UserTable
                users={users}
                selectUserIds={selectUserIds}
                handleSelectUser={handleSelectUser}
                handleToggleSelectUser={handleToggleSelectUser}
                setShowUserDetail={setShowUserDetail}
              />
            )}
          </div>
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
      {/* User Detail */}
      <UserDetail
        loading={loading}
        updateUser={updateUser}
        setUpdateUser={setUpdateUser}
        userDetail={userDetail}
        showUserDetail={showUserDetail}
        setShowUserDetail={setShowUserDetail}
        putUser={putUser}
      />
      {/* Toast */}
      <Toast
        showToast={showToast}
        message={message}
        alertColor={alertColor}
        onClose={() => setShowToast(false)}
      />
    </div>
  );
}
