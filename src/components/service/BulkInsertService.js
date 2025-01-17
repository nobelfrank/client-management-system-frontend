import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

export const bulkInsertClients = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/clients/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const bulkInsertAgents = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/agents/bulk-insert`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const bulkInsertPolicies = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/policies/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};

export const bulkInsertMappings = async (formData) => {
  try {
    const response = await axios.post(`${BASE_URL}/mappings/bulk`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    throw error.response ? error.response.data : new Error('Network error');
  }
};
