# How to Save Data to Database When Users Click Buttons

Your website already loads `db-functions.js`, so all database functions are available. Here's how to integrate them:

## 1️⃣ Save User When They Login

**In your login.html** - After MetaMask login:

```javascript
loginBtn.onclick = async () => {
  if (!window.ethereum) {
    alert("MetaMask не найден");
    return;
  }

  const accounts = await ethereum.request({
    method: "eth_requestAccounts"
  });

  const address = accounts[0];
  localStorage.setItem("walletAddress", address);

  // ✨ NEW: Save user to database
  try {
    const existingUser = await dbFunctions.getUser(address);
    if (!existingUser) {
      // Create new user if doesn't exist
      await dbFunctions.createUser(address);
      console.log("✓ New user created in database!");
    } else {
      // Update last login
      await dbFunctions.updateUser(address, { 
        last_login: new Date().toISOString() 
      });
      console.log("✓ User login updated!");
    }
  } catch (error) {
    console.error("Database error:", error);
  }

  // Redirect to home
  window.location.href = "index.html";
};
```

---

## 2️⃣ Save Service Purchase/Redemption

**In your services-detail.html or app.js** - When user redeems tokens:

```javascript
async function redeem(priceCRT, serviceName) {
  try {
    await init();
    const addr = await signer.getAddress();
    const rawBal = await token.balanceOf(addr);
    const decimals = await token.decimals();

    const price = ethers.utils.parseUnits(priceCRT.toString(), decimals);

    if (rawBal.lt(price)) {
      alert("Недостаточно CRT");
      return;
    }

    document.getElementById("status").innerText = "Отправка транзакции...";

    const tx = await fund.redeemForService(price, serviceName);
    const receipt = await tx.wait();

    // ✨ NEW: Save order to database
    try {
      const walletAddr = await signer.getAddress();
      await dbFunctions.createOrder(
        walletAddr,
        serviceName,
        receipt.transactionHash,
        'completed',
        {
          amount_tokens: priceCRT,
          service_id: null // Add service ID if you have it
        }
      );
      console.log("✓ Order saved to database!");
    } catch (dbError) {
      console.error("Error saving order:", dbError);
    }

    document.getElementById("status").innerText = 
      `Услуга "${serviceName}" успешно оплачена`;

  } catch (err) {
    console.error(err);
    document.getElementById("error").innerText = err.reason || err.message;
    document.getElementById("status").innerText = "";
  }
}
```

---

## 3️⃣ Track Token Balance

**In your index.html or buyToken.html** - Show CRT balance:

```javascript
async function updateUserBalance() {
  try {
    const walletAddr = localStorage.getItem("walletAddress");
    if (!walletAddr) return;

    // Get user from database
    const user = await dbFunctions.getUser(walletAddr);
    
    if (user) {
      // Update the CRT badge with balance
      document.getElementById("crtAmount").innerText = 
        `${user.crt_balance || 0} CRT`;
      
      // Or show balance from smart contract
      const balance = await token.balanceOf(walletAddr);
      const decimals = await token.decimals();
      const formattedBalance = ethers.utils.formatUnits(balance, decimals);
      
      // Save to database if changed
      await dbFunctions.updateUser(walletAddr, { 
        crt_balance: formattedBalance 
      });
    }
  } catch (error) {
    console.error("Error updating balance:", error);
  }
}

// Call on page load
updateUserBalance();
```

---

## 4️⃣ Display Services from Database

**In your services.html** - Show services from Supabase:

```javascript
async function loadServices() {
  try {
    // Get all active services from database
    const services = await dbFunctions.getServices();
    
    console.log("Services loaded:", services);
    
    // Display them in your HTML
    const container = document.getElementById("services-container");
    container.innerHTML = services.map(service => `
      <div class="service-card">
        <h3>${service.name}</h3>
        <p>${service.description}</p>
        <p><strong>Price: ${service.price_tokens} CRT</strong></p>
        <button onclick="selectService('${service.id}')">Select</button>
      </div>
    `).join('');
    
  } catch (error) {
    console.error("Error loading services:", error);
  }
}

// Call on page load
loadServices();
```

---

## 5️⃣ Full Integration Example - Buy Service Flow

```javascript
// Step 1: User selects service
async function selectService(serviceId) {
  try {
    const service = await dbFunctions.getServiceById(serviceId);
    console.log("Selected service:", service);
    // Show service details...
  } catch (error) {
    console.error("Error:", error);
  }
}

// Step 2: User completes purchase
async function completePurchase(serviceId) {
  try {
    const walletAddr = localStorage.getItem("walletAddress");
    const service = await dbFunctions.getServiceById(serviceId);
    
    // Make payment via smart contract
    const tx = await fund.redeemForService(
      service.price_tokens,
      service.name
    );
    const receipt = await tx.wait();
    
    // Step 3: Save order to database
    const order = await dbFunctions.createOrder(
      walletAddr,
      service.name,
      receipt.transactionHash,
      'completed',
      {
        amount_tokens: service.price_tokens,
        amount_kzt: service.price_kzt,
        service_id: serviceId
      }
    );
    
    console.log("✓ Order completed and saved:", order);
    
    // Step 4: Create appointment if needed
    const appointmentDate = prompt("Enter appointment date (YYYY-MM-DD HH:MM):");
    if (appointmentDate) {
      const user = await dbFunctions.getUser(walletAddr);
      const appointment = await dbFunctions.createAppointment(
        user.id,
        serviceId,
        appointmentDate,
        service.duration_minutes
      );
      console.log("✓ Appointment created:", appointment);
    }
    
  } catch (error) {
    console.error("Error completing purchase:", error);
  }
}

// Step 5: Show user's orders/appointments
async function showMyOrders() {
  try {
    const walletAddr = localStorage.getItem("walletAddress");
    const orders = await dbFunctions.getUserOrders(walletAddr);
    
    console.log("Your orders:", orders);
    // Display orders in UI...
  } catch (error) {
    console.error("Error:", error);
  }
}
```

---

## 🚀 Quick Reference - Where to Add Calls

| Page | Function | When |
|------|----------|------|
| login.html | `createUser()` | After MetaMask connects |
| services.html | `getServices()` | Page loads |
| services-detail.html | `getServiceById()` | Open service details |
| app.js | `createOrder()` | After payment confirmed |
| index.html | `getUserOrders()` | Show purchase history |
| Any page | `updateUser()` | Update user info (balance, email, etc) |

---

## 💡 Testing the Integration

1. **Open your website** in browser (not the test page)
2. **Click Login** → User is created in database
3. **Navigate to Services** → Services load from database
4. **Purchase a service** → Order is saved to database
5. **Check Supabase** → Open https://supabase.com → Your project → View data in tables

---

## ✅ Checklist

- [x] All HTML files now load `db-functions.js` ✓
- [ ] Add `createUser()` to login flow
- [ ] Add `getServices()` to services page
- [ ] Add `createOrder()` to purchase flow
- [ ] Test by clicking buttons on your site
- [ ] Verify data appears in Supabase tables
