const supabaseUrl = 'https://mlaomsvfvfylxistogis.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sYW9tc3ZmdmZ5bHhpc3RvZ2lzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzAyOTQ0MzksImV4cCI6MjA4NTg3MDQzOX0.jJUeIlgvLnHclG_MJvDSBBA_m44Y2qFl9xFfhdBh1l4';
const db = window.supabase.createClient(supabaseUrl, supabaseKey);

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

async function getServices() {
  try {
    const { data, error } = await db
      .from("services")
      .select("*");
    
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

async function createOrder(walletAddress, serviceName, txHash, status = "completed") {
  try {
    const { data, error } = await db
      .from("orders")
      .insert([
        {
          user_wallet: walletAddress,
          service_name: serviceName,
          tx_hash: txHash,
          status: status
        }
      ])
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

window.dbFunctions = {
  createUser,
  getUser,
  updateUser,
  getServices,
  getServiceById,
  createOrder,
  getUserOrders,
  updateOrder
};
