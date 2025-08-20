"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Code } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export default function ProfilePage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [editName, setEditName] = useState(false);
  const [editEmail, setEditEmail] = useState(false);
  const [editPassword, setEditPassword] = useState(false);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // error state
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState("");

  const { deleteAccount, updateProfile, getCurrentUserDetails } = useAuth();
  const [deletePassword, setDeletePassword] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await getCurrentUserDetails();
        setName(userData?.name || "");
        setEmail(userData?.email || "");

      } catch (err: unknown) {
        console.error(err);
      }
    };

    fetchUser();
  }, [getCurrentUserDetails]);

  const validate = (section: "name" | "email" | "password") => {
    const newErrors: Record<string, string> = {};

    if (section === "name") {
      if (!newName.trim()) newErrors.name = "Name is required";
    }

    if (section === "email") {
      if (!newEmail.trim()) newErrors.email = "Email is required";
      else if (!newEmail.includes("@"))
        newErrors.email = "Invalid email format";
      if (!currentPassword) newErrors.currentPassword = "Password is required";
    }

    if (section === "password") {
      if (!currentPassword)
        newErrors.currentPassword = "Current password required";
      if (!newPassword) newErrors.newPassword = "New password required";
      if (newPassword !== confirmPassword)
        newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const saveName = async () => {
    if (!validate("name")) return;
    setGeneralError("");

    try {
      const data = await updateProfile({ name: newName });
      setName(data.name);
      setNewName("");
      setEditName(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred");
      }
    }
  };

  const saveEmail = async () => {
    if (!validate("email")) return;
    setGeneralError("");

    try {
      const data = await updateProfile({
        email: newEmail,
        currentPassword,
      });
      setEmail(data.email);
      setNewEmail("");
      setCurrentPassword("");
      setEditEmail(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred");
      }
    }
  };

  const savePassword = async () => {
    if (!validate("password")) return;
    setGeneralError("");

    try {
      await updateProfile({
        currentPassword,
        newPassword,
        confirmPassword,
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEditPassword(false);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setGeneralError(err.message);
      } else {
        setGeneralError("An unexpected error occurred");
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!deletePassword) {
      alert("Enter your password");
      return;
    }

    try {
      await deleteAccount(deletePassword);
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert("An unexpected error occurred");
      }
    }
  };


  return (
    <div className="flex flex-col justify-center items-center bg-background px-4 ">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center justify-center mb-4">
            <Code className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl text-center">Profile</CardTitle>
          <CardDescription className="text-center">
            Manage your account details
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {generalError && (
            <p className="text-sm text-destructive text-center">
              {generalError}
            </p>
          )}

          {/* Name */}
          <div className="space-y-2">
            <Label>Name</Label>
            {!editName ? (
              <div className="flex justify-between items-center">
                <p>{name}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditName(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={name}
                  className={errors.name ? "border-destructive" : ""}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
                <div className="flex space-x-2">
                  <Button onClick={saveName}>Save</Button>
                  <Button variant="outline" onClick={() => setEditName(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label>Email</Label>
            {!editEmail ? (
              <div className="flex justify-between items-center">
                <p>{email}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditEmail(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                <Input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder={email}
                  className={errors.email ? "border-destructive" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
                <Input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Current Password"
                  className={errors.currentPassword ? "border-destructive" : ""}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword}
                  </p>
                )}
                <div className="flex space-x-2">
                  <Button onClick={saveEmail}>Save</Button>
                  <Button variant="outline" onClick={() => setEditEmail(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label>Password</Label>
            {!editPassword ? (
              <div className="flex justify-between items-center">
                <p>********</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setEditPassword(true)}
                >
                  Edit
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {/* current password */}
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Current Password"
                    className={
                      errors.currentPassword ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.currentPassword && (
                  <p className="text-sm text-destructive">
                    {errors.currentPassword}
                  </p>
                )}

                {/* new password */}
                <div className="relative">
                  <Input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className={errors.newPassword ? "border-destructive" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                  >
                    {showNewPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.newPassword && (
                  <p className="text-sm text-destructive">
                    {errors.newPassword}
                  </p>
                )}

                {/* confirm new password */}
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm New Password"
                    className={
                      errors.confirmPassword ? "border-destructive" : ""
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-destructive">
                    {errors.confirmPassword}
                  </p>
                )}

                <div className="flex space-x-2">
                  <Button onClick={savePassword}>Save</Button>
                  <Button
                    variant="outline"
                    onClick={() => setEditPassword(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Delete Account */}
      <div className="space-y-2 pt-4">
        {!confirmDelete ? (
          <Button
            variant="outline"
            className="text-destructive hover:text-destructive"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Account
          </Button>
        ) : (
          <div className="space-y-2">
            <Input
              type="password"
              value={deletePassword}
              onChange={(e) => setDeletePassword(e.target.value)}
              placeholder="Enter your password to confirm"
            />
            <div className="flex space-x-2">
              <Button
                variant="outline"
                className="text-destructive hover:text-destructive"
                onClick={handleConfirmDelete}
              >
                Confirm Delete
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setConfirmDelete(false);
                  setDeletePassword("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
