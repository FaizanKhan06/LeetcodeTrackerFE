// token-manager.ts

// Save any value with expiry in localStorage
export function saveWithExpiry(key: string, value: any, daysValid = 7) {
  const now = new Date().getTime()
  const expiresAt = now + daysValid * 24 * 60 * 60 * 1000 // days to milliseconds
  const data = { value, expiresAt }
  localStorage.setItem(key, JSON.stringify(data))
}

// Get any value from localStorage and check expiry
export function getWithExpiry(key: string) {
  const dataStr = localStorage.getItem(key)
  if (!dataStr) return null

  try {
    const data = JSON.parse(dataStr)
    if (new Date().getTime() > data.expiresAt) {
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
export function saveToken(token: string, user: any, daysValid = 7) {
  saveWithExpiry("token", token, daysValid)
  saveWithExpiry("user", user, daysValid)
}

// Get token
export function getToken() {
  return getWithExpiry("token")
}

// Get user object
export function getUser() {
  return JSON.parse(getWithExpiry("user"))
}

// Clear token and user (on logout)
export function clearToken() {
  localStorage.removeItem("token")
  localStorage.removeItem("user")
}
