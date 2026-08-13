import { User, Lock, Save, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../store/userSlice";
import api from "../api/axios";

const SettingsPage = () => {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    lastName: user?.lastName || "",
    mobile: user?.mobile || "",
    address: user?.address || "",
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm((prev) => ({ ...prev, [name]: value }));
    setProfileSuccess(false);
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
    setPasswordSuccess(false);
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess(false);
    try {
      setProfileSaving(true);
      const res = await api.put("/update-user", {
        id: user._id,
        email: user.email,
        role: user.role,
        ...profileForm,
      });
      dispatch(setUser({ user: { ...user, ...res.data.user } }));
      setProfileSuccess(true);
    } catch (error) {
      setProfileError(
        error.response?.data?.error || "Failed to update profile",
      );
    } finally {
      setProfileSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess(false);

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError("New password and confirmation don't match");
      return;
    }

    try {
      setPasswordSaving(true);
      await api.put("/change-password", {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
      });
      setPasswordSuccess(true);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      setPasswordError(
        error.response?.data?.error || "Failed to change password",
      );
    } finally {
      setPasswordSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">Settings</h2>
        <p className="text-gray-500 mt-1">Manage your admin profile and security</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Settings */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Profile Information</h3>
            </div>
          </div>
          <form onSubmit={handleProfileSubmit} className="p-6 space-y-4">
            {profileError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {profileError}
              </div>
            )}
            {profileSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4" />
                Profile updated
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                <input
                  type="text"
                  name="name"
                  value={profileForm.name}
                  onChange={handleProfileChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={profileForm.lastName}
                  onChange={handleProfileChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-2 border border-gray-200 bg-gray-50 text-gray-500 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
              <input
                type="tel"
                name="mobile"
                value={profileForm.mobile}
                onChange={handleProfileChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
              <textarea
                name="address"
                value={profileForm.address}
                onChange={handleProfileChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              />
            </div>
            <button
              type="submit"
              disabled={profileSaving}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {profileSaving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        </div>

        {/* Security */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center">
                <Lock className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-800">Change Password</h3>
            </div>
          </div>
          <form onSubmit={handlePasswordSubmit} className="p-6 space-y-4">
            {passwordError && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
                {passwordError}
              </div>
            )}
            {passwordSuccess && (
              <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg px-4 py-3">
                <CheckCircle2 className="w-4 h-4" />
                Password changed successfully
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
              <input
                type="password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be strong: mix of upper/lowercase, numbers & symbols.
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={passwordSaving}
              className="px-6 py-2.5 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium flex items-center gap-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              {passwordSaving ? "Updating..." : "Update Password"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SettingsPage;
