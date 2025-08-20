const API_BASE_URL = 'http://localhost:5000/api';

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
    return handleResponse(response);
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
