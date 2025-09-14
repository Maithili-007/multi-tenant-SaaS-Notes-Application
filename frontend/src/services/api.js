const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Network error" }));
    throw new Error(error.message || `HTTP ${response.status}`);
  }
  return response.json();
};

export async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse(response);
}

export async function validateToken() {
  try {
    const response = await fetch(`${API_BASE_URL}/notes`, { headers: getAuthHeaders() });
    return response.ok;
  } catch {
    return false;
  }
}

export async function getNotes() {
  const response = await fetch(`${API_BASE_URL}/notes`, { headers: getAuthHeaders() });
  return handleResponse(response);
}

export async function createNote(noteData) {
  const response = await fetch(`${API_BASE_URL}/notes`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });
  return handleResponse(response);
}

export async function updateNote(id, noteData) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(noteData),
  });
  return handleResponse(response);
}

export async function deleteNote(id) {
  const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function upgradeTenant(tenantSlug) {
  const response = await fetch(`${API_BASE_URL}/tenants/${tenantSlug}/upgrade`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  return handleResponse(response);
}

export async function inviteUser(email, role) {
  const response = await fetch(`${API_BASE_URL}/auth/invite`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ email, role }),
  });
  return handleResponse(response);
}
