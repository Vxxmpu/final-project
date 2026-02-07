# Private Clinic — Project Documentation

## 1. Overview of the application architecture
The project is a small full‑stack web app with a static frontend and a Node.js/Express backend.

- **Frontend:** Static HTML/CSS/JS pages served from the project root. The UI uses Ethers.js to connect to MetaMask and interact with the smart contract.
- **Backend:** Node.js (Express) API in the backend folder.
- **Blockchain:** A Clinic Loyalty Fund smart contract that mints/burns CRT tokens and records contributions/payments.

Main flow:
1. User opens the web UI.
2. MetaMask connects and the CRT balance badge is updated(where also you can buy token(1 token - 100$))
3. User selects a service and pays with CRT tokens or card (card flow is a UI stub).
4. The backend stores orders and appointments for analytics and tracking.

## 2. Design and implementation decisions
- **Static frontend** was chosen for simplicity and ease of deployment.
- **Ethers.js + MetaMask** provides secure wallet connection without handling private keys.
- **Lightweight UI** (no framework) minimizes dependencies and startup time.

## 3. Description of smart contract logic
The Clinic Loyalty Fund contract supports:
- **contribute()**: Accepts ETH and mints CRT tokens to the contributor.
- **rewardToken()**: Returns the CRT token contract address.
- **redeemForService(tokenAmount, serviceNote)**: Burns CRT tokens to pay for a service and records a note.
- **getMyContribution() / getTotalRaised()**: Reads contributions statistics.

CRT token balance is read from the token contract using ERC‑20 functions such as balanceOf() and decimals().

## 4. Frontend-to-blockchain interaction
- The frontend initializes Ethers.js with MetaMask’s provider.
- A signer is obtained from MetaMask to authorize transactions.
- The app calls:
  - **balanceOf()** and **decimals()** to display the CRT badge.
  - **approve()** and **redeemForService()** for token payments.
  - **contribute()** to mint tokens from test ETH.
- Transaction status and errors are shown in the UI.

## 5. Deployment and execution instructions
### Prerequisites
- Node.js 18+
- MetaMask extension
- Sepolia testnet configured in MetaMask

### Backend setup
1. Install dependencies in the backend folder:
   - npm install
2. Start the backend server:
   - npm run dev

### Frontend usage
- Open index.html directly in a browser, or
- Serve the project root with any static server.
- If you start the backend, it also serves the frontend on http://127.0.0.1:5500/index.html

## 6. Process for obtaining test ETH
Use a Sepolia faucet:
1. Open a faucet (e.g., https://sepoliafaucet.com or https://www.alchemy.com/faucets/ethereum-sepolia).
2. Connect or paste your MetaMask wallet address.
3. Request test ETH and wait for the transaction confirmation.
4. Switch MetaMask to Sepolia and verify the balance.

