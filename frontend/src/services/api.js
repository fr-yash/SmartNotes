// Determine API URL based on environment
const getAPIBaseURL = () => {
  // If VITE_API_URL is explicitly set, use it
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // In production, use relative path (same domain)
  if (import.meta.env.PROD) {
    return '/api';
  }

  // In development, use localhost
  return 'http://localhost:5000/api';
};

const API_BASE_URL = getAPIBaseURL();

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Network error' }));
    throw new Error(error.message || 'Something went wrong');
  }
  return response.json();
};

// Authentication API
export const authAPI = {
  signup: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return handleResponse(response);
  },

  login: async (credentials) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    // For 403 suspension errors, return the data (which includes token for appeal)
    if (response.status === 403 && data.message && data.message.includes('suspended')) {
      return data;
    }

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    return data;
  }
};

// Notes API
export const notesAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  create: async (noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return handleResponse(response);
  },

  update: async (id, noteData) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(noteData)
    });
    return handleResponse(response);
  },

  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/notes/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};

// AI API
export const aiAPI = {
  summarize: async (content) => {
    const response = await fetch(`${API_BASE_URL}/ai/summarize`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(response);
  },

  getNoteSummary: async (noteId) => {
    const response = await fetch(`${API_BASE_URL}/ai/note-summary/${noteId}`, {
      method: 'GET',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  extractKeywords: async (content) => {
    const response = await fetch(`${API_BASE_URL}/ai/keywords`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(response);
  },

  rewrite: async (content) => {
    const response = await fetch(`${API_BASE_URL}/ai/rewrite`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content })
    });
    return handleResponse(response);
  },

  generateQuiz: async (content, numQuestions = 5) => {
    const response = await fetch(`${API_BASE_URL}/ai/quiz`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, numQuestions })
    });
    return handleResponse(response);
  },

  askAI: async (content, question) => {
    const response = await fetch(`${API_BASE_URL}/ai/ask`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ content, question })
    });
    return handleResponse(response);
  }
};

// PDF API
export const pdfAPI = {
  upload: async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);
    
    const token = localStorage.getItem('token');
    const response = await fetch(`${API_BASE_URL}/pdf/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` })
      },
      body: formData
    });
    return handleResponse(response);
  }
};

// Admin API
export const adminAPI = {
  getAllUsers: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/users`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getUserById: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  toggleUserStatus: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/toggle-status`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  deleteUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  updateAILimit: async (userId, limit) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/ai-limit`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ aiRequestsLimit: limit })
    });
    return handleResponse(response);
  },

  getAnalytics: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/analytics`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getFeaturedTemplates: async () => {
    const response = await fetch(`${API_BASE_URL}/admin/templates`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  promoteToAdmin: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/promote`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  demoteToUser: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/admin/users/${userId}/demote`, {
      method: 'PATCH',
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  getSuspensionRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/suspension-requests`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  },

  approveSuspensionRequest: async (requestId, response) => {
    const res = await fetch(`${API_BASE_URL}/suspension-requests/${requestId}/approve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ response })
    });
    return handleResponse(res);
  },

  rejectSuspensionRequest: async (requestId, response) => {
    const res = await fetch(`${API_BASE_URL}/suspension-requests/${requestId}/reject`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify({ response })
    });
    return handleResponse(res);
  }
};

// Suspension Request API (for suspended users)
export const suspensionAPI = {
  submitRequest: async (reason) => {
    const response = await fetch(`${API_BASE_URL}/suspension-requests/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ reason })
    });
    return handleResponse(response);
  },

  getUserRequests: async () => {
    const response = await fetch(`${API_BASE_URL}/suspension-requests/my-requests`, {
      headers: getAuthHeaders()
    });
    return handleResponse(response);
  }
};
