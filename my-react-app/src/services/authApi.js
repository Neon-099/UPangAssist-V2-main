import { apiRequest } from './apiClient'

export function registerUser(payload) {
  return apiRequest('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function loginUser(payload) {
  return apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

export function getCurrentUser() {
  return apiRequest('/auth/me')
}

export function logoutUser() {
  return apiRequest('/auth/logout', {
    method: 'POST',
  })
}