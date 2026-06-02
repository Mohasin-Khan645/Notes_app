// Centralized Environment Configurations for Neural Vault
// Dynamically checks for VITE_API_BASE_URL or falls back to standard localhost during local testing.

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
export const API_NOTES_URL = `${API_BASE_URL}/api/notes`;
export const API_AUTH_URL = `${API_BASE_URL}/api/auth`;
