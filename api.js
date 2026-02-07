// Frontend API client - connects to Node.js backend instead of Supabase directly

const API_BASE_URL = 'http://localhost:3000/api';

window.api = {
  // ==================== USER FUNCTIONS ====================
  
  async createOrUpdateUser(walletAddress, email = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/user`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ wallet_address: walletAddress, email })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating/updating user:', error);
      throw error;
    }
  },

  async getUser(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${walletAddress}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  },

  async updateUser(walletAddress, updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/user/${walletAddress}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  },

  // ==================== SERVICES FUNCTIONS ====================
  
  async getServices() {
    try {
      const response = await fetch(`${API_BASE_URL}/services`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting services:', error);
      throw error;
    }
  },

  async getServiceById(serviceId) {
    try {
      const response = await fetch(`${API_BASE_URL}/services/${serviceId}`);
      
      if (response.status === 404) {
        return null;
      }
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting service:', error);
      throw error;
    }
  },

  // ==================== ORDERS FUNCTIONS ====================
  
  async createOrder(walletAddress, serviceName, txHash = null, status = 'pending', metadata = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddress,
          service_name: serviceName,
          tx_hash: txHash,
          status: status,
          metadata: metadata
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  },

  async getUserOrders(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/orders/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting orders:', error);
      throw error;
    }
  },

  // ==================== APPOINTMENTS FUNCTIONS ====================
  
  async createAppointment(walletAddress, serviceId, appointmentDate, notes = null) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          wallet_address: walletAddress,
          service_id: serviceId,
          appointment_date: appointmentDate,
          notes: notes
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating appointment:', error);
      throw error;
    }
  },

  async getUserAppointments(walletAddress) {
    try {
      const response = await fetch(`${API_BASE_URL}/appointments/${walletAddress}`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting appointments:', error);
      throw error;
    }
  }
};

// For backwards compatibility, expose as dbFunctions too
window.dbFunctions = window.api;
