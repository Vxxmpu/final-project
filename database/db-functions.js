const supabaseUrl = 'https://mlaomsvfvfylxistogis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYW9tc3ZmdmZ5bHhpc3RvZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTQ0MzksImV4cCI6MjA4NTg3MDQzOX0.jJUeIlgvLnHclG_MJvDSBBA_m44Y2qFl9xFfhdBh1l4';
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

// ==================== USER FUNCTIONS ====================

async function createUser(walletAddress, email = null) {
  try {
    const { data, error } = await db
      .from("users")
      .insert([{ wallet_address: walletAddress, email: email }])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
}

async function getUser(walletAddress) {
  try {
    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();
    
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
}

async function getUserById(userId) {
  try {
    const { data, error } = await db
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();
    
    if (error && error.code !== "PGRST116") throw error;
    return data || null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    throw error;
  }
}

async function updateUser(walletAddress, updates) {
  try {
    const { data, error } = await db
      .from("users")
      .update(updates)
      .eq("wallet_address", walletAddress)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

async function updateUserById(userId, updates) {
  try {
    const { data, error } = await db
      .from("users")
      .update(updates)
      .eq("id", userId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
}

// ==================== SERVICE FUNCTIONS ====================

async function getServices() {
  try {
    const { data, error } = await db
      .from("services")
      .select("*")
      .eq("is_active", true);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
}

async function getServiceById(serviceId) {
  try {
    const { data, error } = await db
      .from("services")
      .select("*")
      .eq("id", serviceId)
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching service:", error);
    throw error;
  }
}

async function getServicesByCategory(category) {
  try {
    const { data, error } = await db
      .from("services")
      .select("*")
      .eq("category", category)
      .eq("is_active", true);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching services by category:", error);
    throw error;
  }
}

async function createService(serviceData) {
  try {
    const { data, error } = await db
      .from("services")
      .insert([serviceData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating service:", error);
    throw error;
  }
}

async function updateService(serviceId, updates) {
  try {
    const { data, error } = await db
      .from("services")
      .update(updates)
      .eq("id", serviceId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating service:", error);
    throw error;
  }
}

// ==================== SERVICE CATEGORIES ====================

async function getServiceCategories() {
  try {
    const { data, error } = await db
      .from("service_categories")
      .select("*");
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

async function createServiceCategory(categoryData) {
  try {
    const { data, error } = await db
      .from("service_categories")
      .insert([categoryData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

// ==================== ORDER FUNCTIONS ====================

async function createOrder(walletAddress, serviceName, txHash, status = "completed", additionalData = {}) {
  try {
    const user = await getUser(walletAddress);
    if (!user) {
      throw new Error("User not found");
    }

    const orderData = {
      user_id: user.id,
      user_wallet: walletAddress,
      service_name: serviceName,
      tx_hash: txHash,
      status: status,
      ...additionalData
    };

    const { data, error } = await db
      .from("orders")
      .insert([orderData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
}

async function getUserOrders(walletAddress) {
  try {
    const { data, error } = await db
      .from("orders")
      .select("*")
      .eq("user_wallet", walletAddress)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching orders:", error);
    throw error;
  }
}

async function getUserOrdersById(userId) {
  try {
    const { data, error } = await db
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user orders:", error);
    throw error;
  }
}

async function updateOrder(orderId, updates) {
  try {
    const { data, error } = await db
      .from("orders")
      .update(updates)
      .eq("id", orderId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating order:", error);
    throw error;
  }
}

// ==================== APPOINTMENT FUNCTIONS ====================

async function createAppointment(userId, serviceId, appointmentDate, duration = null, notes = null) {
  try {
    const appointmentData = {
      user_id: userId,
      service_id: serviceId,
      appointment_date: appointmentDate,
      duration_minutes: duration,
      notes: notes
    };

    const { data, error } = await db
      .from("appointments")
      .insert([appointmentData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
}

async function getUserAppointments(userId) {
  try {
    const { data, error } = await db
      .from("appointments")
      .select("*, services(*)")
      .eq("user_id", userId)
      .order("appointment_date", { ascending: true });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
}

async function updateAppointment(appointmentId, updates) {
  try {
    const { data, error } = await db
      .from("appointments")
      .update(updates)
      .eq("id", appointmentId)
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
}

async function cancelAppointment(appointmentId) {
  return updateAppointment(appointmentId, { status: 'cancelled' });
}

// ==================== PAYMENT FUNCTIONS ====================

async function createPayment(userId, amountTokens, amountKzt, paymentType = "service", additionalData = {}) {
  try {
    const paymentData = {
      user_id: userId,
      amount_tokens: amountTokens,
      amount_kzt: amountKzt,
      payment_type: paymentType,
      ...additionalData
    };

    const { data, error } = await db
      .from("payments")
      .insert([paymentData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

async function getUserPayments(userId) {
  try {
    const { data, error } = await db
      .from("payments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
}

// ==================== REVIEW FUNCTIONS ====================

async function createReview(userId, serviceId, rating, comment = null, orderId = null) {
  try {
    const reviewData = {
      user_id: userId,
      service_id: serviceId,
      rating: rating,
      comment: comment,
      order_id: orderId
    };

    const { data, error } = await db
      .from("reviews")
      .insert([reviewData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating review:", error);
    throw error;
  }
}

async function getServiceReviews(serviceId) {
  try {
    const { data, error } = await db
      .from("reviews")
      .select("*, users(first_name, last_name)")
      .eq("service_id", serviceId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
}

async function getUserReviews(userId) {
  try {
    const { data, error } = await db
      .from("reviews")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    throw error;
  }
}

// ==================== WALLET TRANSACTION FUNCTIONS ====================

async function createWalletTransaction(userId, walletAddress, txHash, transactionType, amountTokens) {
  try {
    const txData = {
      user_id: userId,
      wallet_address: walletAddress,
      tx_hash: txHash,
      transaction_type: transactionType,
      amount_tokens: amountTokens
    };

    const { data, error } = await db
      .from("wallet_transactions")
      .insert([txData])
      .select();
    
    if (error) throw error;
    return data[0];
  } catch (error) {
    console.error("Error creating wallet transaction:", error);
    throw error;
  }
}

async function getUserWalletTransactions(userId) {
  try {
    const { data, error } = await db
      .from("wallet_transactions")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error("Error fetching wallet transactions:", error);
    throw error;
  }
}

// ==================== EXPORT ====================

window.dbFunctions = {
  // Users
  createUser,
  getUser,
  getUserById,
  updateUser,
  updateUserById,
  
  // Services
  getServices,
  getServiceById,
  getServicesByCategory,
  createService,
  updateService,
  
  // Categories
  getServiceCategories,
  createServiceCategory,
  
  // Orders
  createOrder,
  getUserOrders,
  getUserOrdersById,
  updateOrder,
  
  // Appointments
  createAppointment,
  getUserAppointments,
  updateAppointment,
  cancelAppointment,
  
  // Payments
  createPayment,
  getUserPayments,
  
  // Reviews
  createReview,
  getServiceReviews,
  getUserReviews,
  
  // Wallet Transactions
  createWalletTransaction,
  getUserWalletTransactions
};
