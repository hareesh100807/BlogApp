import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { useAuth } from "../store/authStore";
import { errorClass, loadingClass, successClass } from "../styles/common";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4060";

function AdminProfile() {
  const navigate = useNavigate();
  const logout = useAuth((state) => state.logout);
  const currentUser = useAuth((state) => state.currentUser);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState("");
  const [updatingId, setUpdatingId] = useState("");

  const isAdmin = (currentUser?.role || "").toUpperCase() === "ADMIN";

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`${API_BASE_URL}/admin-api/users`, {
        withCredentials: true,
      });

      if (res.status === 200) {
        setUsers(res.data?.payload || []);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate("/login");
      return;
    }

    fetchUsers();
  }, [isAdmin, navigate]);

  const onToggleUserStatus = async (userObj) => {
    const nextStatus = !Boolean(userObj?.isUserActive);
    setUpdatingId(userObj._id);
    setError(null);
    setMessage("");

    try {
      const res = await axios.patch(
        `${API_BASE_URL}/admin-api/users/status`,
        {
          userId: userObj._id,
          isUserActive: nextStatus,
        },
        { withCredentials: true }
      );

      if (res.status === 200) {
        setUsers((prevUsers) =>
          prevUsers.map((u) =>
            u._id === userObj._id ? { ...u, isUserActive: nextStatus } : u
          )
        );
        setMessage(`${userObj.firstName || "User"} is now ${nextStatus ? "Active" : "Blocked"}`);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user status");
    } finally {
      setUpdatingId("");
    }
  };

  const onLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {error && <p className={`${errorClass} mb-4`}>{error}</p>}
      {message && <p className={`${successClass} mb-4`}>{message}</p>}

      <div className="bg-white border border-[#e8e8ed] rounded-3xl p-6 mb-8 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              className="w-16 h-16 rounded-full object-cover border"
              alt="profile"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#0066cc]/10 text-[#0066cc] flex items-center justify-center text-xl font-semibold">
              {currentUser?.firstName?.charAt(0).toUpperCase() || "A"}
            </div>
          )}

          <div>
            <p className="text-sm text-[#6e6e73]">Welcome back</p>
            <h2 className="text-xl font-semibold text-[#1d1d1f]">{currentUser?.firstName || "Admin"}</h2>
          </div>
        </div>

        <button
          className="bg-[#ff3b30] text-white text-sm px-5 py-2 rounded-full hover:bg-[#d62c23] transition"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {loading ? (
        <p className={loadingClass}>Loading users...</p>
      ) : (
        <div className="space-y-4">
          {users.length === 0 ? (
            <p className="text-[#6e6e73] text-sm">No users found.</p>
          ) : (
            users.map((userObj) => {
              const isActive = Boolean(userObj?.isUserActive);

              return (
                <div
                  key={userObj._id}
                  className="border-2 border-[#1d1d1f] rounded-3xl px-4 py-4 flex items-center justify-between bg-[#f5f5f7]"
                >
                  <div>
                    <p className="text-2xl font-semibold text-[#1d1d1f]">
                      {userObj.firstName} {userObj.lastName}
                    </p>
                    <p className="text-sm text-[#6e6e73]">{userObj.email}</p>
                    <p className="text-sm mt-1">
                      Status:{" "}
                      <span className={isActive ? "text-[#248a3d] font-medium" : "text-[#cc2f26] font-medium"}>
                        {isActive ? "Active" : "Blocked"}
                      </span>
                    </p>
                  </div>

                  <button
                    className="bg-[#e8d277] text-[#1d1d1f] text-sm px-5 py-2 rounded-full border border-[#8f7e32] hover:bg-[#dcc55e] transition disabled:opacity-60"
                    disabled={updatingId === userObj._id}
                    onClick={() => onToggleUserStatus(userObj)}
                  >
                    {updatingId === userObj._id ? "Updating..." : isActive ? "Block" : "Unblock"}
                  </button>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default AdminProfile;