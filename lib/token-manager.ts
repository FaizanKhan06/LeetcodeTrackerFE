// Example User type – adjust fields as per your app
export interface User {
  id: string
  name: string
  email: string
  [key: string]: any // optional extra fields
}

// Save any value with expiry in localStorage
export function saveWithExpiry<T>(key: string, value: T, daysValid = 7) {
  const now = Date.now()
  const expiresAt = now + daysValid * 24 * 60 * 60 * 1000 // days to milliseconds
  const data = { value, expiresAt }
  localStorage.setItem(key, JSON.stringify(data))
}

// Get any value from localStorage and check expiry
export function getWithExpiry<T>(key: string): T | null {
  const dataStr = localStorage.getItem(key)
  if (!dataStr) return null

  try {
    const data = JSON.parse(dataStr) as { value: T; expiresAt: number }
    if (Date.now() > data.expiresAt) {
      localStorage.removeItem(key) // remove expired
      return null
    }
    return data.value
  } catch {
    localStorage.removeItem(key)
    return null
  }
}

// Save token and user object with expiry
export function saveToken(token: string, user: User, daysValid = 7) {
  saveWithExpiry("token", token, daysValid)
  saveWithExpiry("user", user, daysValid)
}

// Get token
export function getToken(): string | null {
  return getWithExpiry<string>("token")
}

// Get user object
export function getUser(): User | null {
  return getWithExpiry<User>("user")
}

// Clear token and user (on logout)
export function clearToken() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
