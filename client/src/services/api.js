import { auth } from '../firebase';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async getAuthHeaders() {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('User not authenticated');
    }

    const idToken = await user.getIdToken();
    return {
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    };
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    const config = {
      headers: {
        ...headers,
        ...options.headers
      },
      ...options
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // CV operations
  async saveCV(cvData, cvId = null) {
    return this.request('/api/cv/save', {
      method: 'POST',
      body: JSON.stringify({ cvData, cvId })
    });
  }

  async getCV(cvId) {
    return this.request(`/api/cv/${cvId}`);
  }

  // Payment operations
  async initiatePayment(cvId, amount = 500) {
    return this.request('/api/payment/initiate', {
      method: 'POST',
      body: JSON.stringify({ cvId, amount })
    });
  }

  async processPayment(paymentId, success = true) {
    return this.request(`/api/payment/process/${paymentId}`, {
      method: 'POST',
      body: JSON.stringify({ success })
    });
  }

  // Download code operations
  async validateDownloadCode(code) {
    return this.request('/api/download/validate-code', {
      method: 'POST',
      body: JSON.stringify({ code })
    });
  }

  async getUserDownloadCodes() {
    return this.request('/api/user/download-codes');
  }

  // Download CV
  async downloadCV(cvId, template = 'modern', code = null) {
    const headers = await this.getAuthHeaders();
    let url = `${this.baseURL}/api/cv/${cvId}/download?template=${template}`;
    if (code) {
      url += `&code=${code}`;
    }

    const response = await fetch(url, {
      headers,
      method: 'GET'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    // Return the blob for download
    return await response.blob();
  }
}

export default new ApiService();