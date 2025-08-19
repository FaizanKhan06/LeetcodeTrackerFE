"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Code, Eye, EyeOff } from "lucide-react"

export default function ProfilePage() {
  const [name, setName] = useState("John Doe")
  const [email, setEmail] = useState("john@example.com")
  const [password, setPassword] = useState("********")

  const [editMode, setEditMode] = useState(false)
  const [newEmail, setNewEmail] = useState("")
  const [oldPassword, setOldPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!name.trim()) newErrors.name = "Name is required"
    if (!email.trim()) newErrors.email = "Email is required"
    else if (!email.includes("@")) newErrors.email = "Invalid email format"

    // Only check password section if user is trying to change email or password
    if ((newEmail && newEmail !== email) || newPassword) {
      if (!oldPassword) newErrors.oldPassword = "Old password is required"
      if (newPassword && newPassword.length < 6)
        newErrors.newPassword = "New password must be at least 6 characters"
      if (newPassword !== confirmNewPassword)
        newErrors.confirmNewPassword = "Passwords do not match"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    console.log({
      name,
      email: newEmail || email,
      oldPassword: oldPassword || "(unchanged)",
      newPassword: newPassword || "(unchanged)",
    })

    // Mock save
    if (newEmail) setEmail(newEmail)
    if (newPassword) setPassword("********")
    setNewEmail("")
    setOldPassword("")
    setNewPassword("")
    setConfirmNewPassword("")
    setEditMode(false)
    setIsLoading(false)
  }

  return (
    <div className="flex justify-center bg-background px-4">
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

        <form onSubmit={handleSubmit} noValidate>
          <CardContent className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!editMode || isLoading}
                className={errors.name ? "border-destructive" : ""}
              />
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={editMode ? newEmail || email : email}
                onChange={(e) => setNewEmail(e.target.value)}
                disabled={!editMode || isLoading}
                className={errors.email ? "border-destructive" : ""}
              />
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
            </div>

            {/* Password */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  disabled
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {/* Extra fields if updating password/email */}
            {editMode && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="oldPassword">Old Password</Label>
                  <Input
                    id="oldPassword"
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    disabled={isLoading}
                    className={errors.oldPassword ? "border-destructive" : ""}
                  />
                  {errors.oldPassword && (
                    <p className="text-sm text-destructive">{errors.oldPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <div className="relative">
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      disabled={isLoading}
                      className={errors.newPassword ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-sm text-destructive">{errors.newPassword}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmNewPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      disabled={isLoading}
                      className={errors.confirmNewPassword ? "border-destructive" : ""}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                  {errors.confirmNewPassword && (
                    <p className="text-sm text-destructive">{errors.confirmNewPassword}</p>
                  )}
                </div>
              </>
            )}
          </CardContent>

          <CardFooter className="flex flex-col space-y-4 mt-4">
            {!editMode ? (
              <Button type="button" className="w-full" onClick={() => setEditMode(true)}>
                Edit Profile
              </Button>
            ) : (
              <>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => setEditMode(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
