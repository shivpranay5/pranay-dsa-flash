const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://dsa-flash-backend.onrender.com';

// Debug logging
console.log('API_BASE_URL:', API_BASE_URL);
console.log('REACT_APP_API_URL:', process.env.REACT_APP_API_URL);

// Helper function to handle API responses
const handleResponse = async (response: Response) => {
  console.log('API Response Status:', response.status);
  console.log('API Response URL:', response.url);
  
  if (!response.ok) {
    const error = await response.text();
    console.error('API Error Response:', error);
    throw new Error(`API Error: ${response.status} - ${error}`);
  }
  return response.json();
};

// Topics API
export const topicsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/topics`);
    return handleResponse(response);
  },

  create: async (topic: any) => {
    console.log('Creating topic with data:', topic);
    console.log('API URL:', `${API_BASE_URL}/api/topics`);
    
    const response = await fetch(`${API_BASE_URL}/api/topics`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(topic),
    });
    return handleResponse(response);
  },

  update: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/api/topics/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/topics/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },
};

// Problems API
export const problemsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/problems`);
    return handleResponse(response);
  },

  create: async (problem: any) => {
    const response = await fetch(`${API_BASE_URL}/api/problems`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(problem),
    });
    return handleResponse(response);
  },

  update: async (id: string, updates: any) => {
    const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });
    return handleResponse(response);
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/problems/${id}`, {
      method: 'DELETE',
    });
    return handleResponse(response);
  },

  getByTopic: async (topicId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/problems?topicId=${topicId}`);
    return handleResponse(response);
  },
};

// Topic Notes API
export const topicNotesAPI = {
  get: async (topicId: string) => {
    const response = await fetch(`${API_BASE_URL}/api/topic-notes/${topicId}`);
    return handleResponse(response);
  },

  save: async (topicId: string, notes: string) => {
    const response = await fetch(`${API_BASE_URL}/api/topic-notes/${topicId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ notes }),
    });
    return handleResponse(response);
  },
};

// Image Upload API
export const uploadAPI = {
  uploadImage: async (file: File) => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`${API_BASE_URL}/api/upload`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}; 