const API_BASE_URL = 'https://task-manager-7g3d.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth endpoints
  async login(credentials) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Task endpoints
  async getTasks(filters = {}) {
    const queryParams = new URLSearchParams(filters).toString();
    const endpoint = queryParams ? `/tasks?${queryParams}` : '/tasks';
    return this.request(endpoint);
  }

  async createTask(taskData) {
    return this.request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  }

  async updateTask(taskId, taskData) {
    return this.request(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(taskData),
    });
  }

  async deleteTask(taskId) {
    return this.request(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  }

  async getAssignedTasks() {
    return this.request('/tasks/assigned');
  }

  async getFilteredTasks(filters) {
    const queryParams = new URLSearchParams(filters).toString();
    return this.request(`/tasks/filter?${queryParams}`);
  }

  async getDeletedTasks() {
    return this.request('/tasks/deleted');
  }

  async restoreTask(taskId) {
    return this.request(`/tasks/restore/${taskId}`, {
      method: 'PUT',
    });
  }

  async permanentlyDeleteTask(taskId) {
    return this.request(`/tasks/permanent/${taskId}`, {
      method: 'DELETE',
    });
  }

  // Restore all deleted tasks
  async restoreAllDeletedTasks() {
    return this.request('/tasks/restore-all', {
      method: 'PUT',
    });
  }

  // Permanently delete all deleted tasks
  async permanentlyDeleteAllDeletedTasks() {
    return this.request('/tasks/permanent-all', {
      method: 'DELETE',
    });
  }

  async updateTaskStatus(taskId, status) {
    return this.request(`/tasks/${taskId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/users/profile');
  }

  async updateUserProfile(userData) {
    // If avatar is a File, use FormData
    if (userData.avatar && userData.avatar instanceof File) {
      const formData = new FormData();
      if (userData.name) formData.append('name', userData.name);
      if (userData.bio) formData.append('bio', userData.bio);
      formData.append('avatar', userData.avatar);
      // Remove Content-Type so browser sets it
      const headers = { ...this.getAuthHeaders() };
      delete headers['Content-Type'];
      return this.request('/users/profile', {
        method: 'PUT',
        headers,
        body: formData,
      });
    } else {
      return this.request('/users/profile', {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
    }
  }

  // User settings endpoints
  async getUserSettings() {
    return this.request('/user-settings');
  }
  async updateUserSettings(settings) {
    return this.request('/user-settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  }

  // Notification endpoints
  async getNotifications() {
    return this.request('/notifications');
  }

  async markNotificationAsRead(notificationId) {
    return this.request(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  }

  async deleteNotification(notificationId) {
    return this.request(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  }

  // Clear all notifications for the user
  async clearAllNotifications() {
    return this.request('/notifications/clear-all', {
      method: 'DELETE',
    });
  }

  // Export user data as JSON (returns Blob)
  async exportUserData() {
    const url = `${this.baseURL}/users/export`;
    const config = {
      method: 'GET',
      headers: this.getAuthHeaders(),
    };
    const response = await fetch(url, config);
    if (!response.ok) {
      throw new Error('Failed to export user data');
    }
    return await response.blob();
  }
  // Delete user account
  async deleteUserAccount() {
    return this.request('/users/delete', { method: 'DELETE' });
  }

  // Import user data from JSON file
  async importUserData(file) {
    const formData = new FormData();
    formData.append('file', file);
    const url = `${this.baseURL}/users/import`;
    const token = localStorage.getItem('token');
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Failed to import user data');
    }
    return await response.json();
  }
}

export default new ApiService(); 