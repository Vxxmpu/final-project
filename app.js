const contractAddress = "0xB8e2bacA218aB1513DA789413B556D5B9df7Af87";

// --- Fund ABI
const fundABI = [
	{
		"inputs": [],
		"name": "contribute",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "_rewardTokenAddress",
				"type": "address"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "contributor",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amountETH",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "tokensMinted",
				"type": "uint256"
			}
		],
		"name": "Contributed",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "tokenAmount",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "serviceNote",
				"type": "string"
			}
		],
		"name": "redeemForService",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "uint256",
				"name": "amount",
				"type": "uint256"
			}
		],
		"name": "TokensBurned",
		"type": "event"
	},
	{
		"inputs": [],
		"name": "CAMPAIGN_TITLE",
		"outputs": [
			{
				"internalType": "string",
				"name": "",
				"type": "string"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"name": "contributions",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "CRT_PRICE_USD",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "FUNDING_GOAL",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getETHPrice",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getMyContribution",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "getTotalRaised",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "rewardToken",
		"outputs": [
			{
				"internalType": "contract ClinicRewardToken",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "totalRaised",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]
// --- Token ABI
const tokenABI = [
  "function balanceOf(address) view returns(uint256)",
  "function decimals() view returns(uint8)",
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)"
];


let provider;
let signer;
let fundContract;
let tokenContract;

// ----------------------------

window.addEventListener("load", () => {

  const c = document.getElementById("connect");
  if (c) c.onclick = connect;

  const b = document.getElementById("contributeBtn");
  if (b) b.onclick = contribute;

  const r = document.getElementById("refreshBtn");
  if (r) r.onclick = updateBalances;

  const badge = document.getElementById("crtBadge");
  if (badge) {
    badge.onclick = () => {
      // Dynamically determine path based on current location
      const path = location.pathname.includes('/service-HTML/') ? '../index.html' : 'index.html';
      window.location.href = path;
    };
  }

  if (window.ethereum) {
    window.ethereum.on("accountsChanged", () => location.reload());
    window.ethereum.on("chainChanged", () => location.reload());
  }

  tryAutoConnect();
});



// ----------------------------
async function tryAutoConnect() {

  if (!window.ethereum) return;

  const accounts = await window.ethereum.request({
    method: "eth_accounts"
  });

  if (!accounts || accounts.length === 0) {
	return; // user has not connected the site
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  fundContract = new ethers.Contract(contractAddress, fundABI, signer);

  const tokenAddress = await fundContract.rewardToken();
  tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  await updateBalances();
  await updateCRTBadge();

}

// Function to initialize contracts and update badge (used by other pages)
async function initializeAndUpdateBadge() {
  if (!window.ethereum) return;
  
  try {
    const accounts = await window.ethereum.request({
      method: "eth_accounts"
    });
    
    if (!accounts || accounts.length === 0) {
      return;
    }
    
    // Only initialize if not already done
    if (!provider) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner();
      fundContract = new ethers.Contract(contractAddress, fundABI, signer);
      const tokenAddress = await fundContract.rewardToken();
      tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    }
    
    await updateCRTBadge();
  } catch (err) {
    console.error('Error initializing contracts:', err);
  }
}

async function connect() {
  if (!window.ethereum) {
    alert("Install MetaMask");
    return;
  }

  try {
    await window.ethereum.request({ method: "eth_requestAccounts" });

    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();

    const addr = await signer.getAddress();

	// safely update elements if they exist
    const addressEl = document.getElementById("address");
    if (addressEl) addressEl.innerText = addr;

    const network = await provider.getNetwork();
    const networkEl = document.getElementById("network");
    if (networkEl) {
      networkEl.innerText = network.chainId === 11155111 ? "Sepolia ✅" : "Wrong network";
    }

    fundContract = new ethers.Contract(contractAddress, fundABI, signer);

    const tokenAddress = await fundContract.rewardToken();
    tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
    await updateBalances();
    await updateCRTBadge();


  } catch (err) {
    console.error(err);
    const errEl = document.getElementById("error");
    if (errEl) errEl.innerText = "Connect failed: " + (err.reason || err.message || err);
  }
}

// ----------------------------

async function updateBalances() {

  if (!signer || !tokenContract) return;

  try {

    const addr = await signer.getAddress();

    const ethBal = await provider.getBalance(addr);
    document.getElementById("ethBalance").innerText =
      ethers.utils.formatEther(ethBal) + " ETH";

    const raw = await tokenContract.balanceOf(addr);
    const decimals = await tokenContract.decimals();

    const formatted = ethers.utils.formatUnits(raw, decimals);

    document.getElementById("tokenBalance").innerText =
      formatted + " CRT";
    
    await updateCRTBadge();


  } catch (err) {
    console.error(err);
    document.getElementById("tokenBalance").innerText =
      "Error reading balance";
  }
}

// ----------------------------

async function contribute() {

  const amountStr = document.getElementById("amount").value;

  if (!amountStr || Number(amountStr) <= 0) {
    alert("Enter amount > 0");
    return;
  }

  try {

    const value = ethers.utils.parseEther(amountStr);

    document.getElementById("status").innerText = "Sending...";
    document.getElementById("error").innerText = "";

    const tx = await fundContract.contribute({ value });

    document.getElementById("status").innerText =
      "Tx sent. Waiting...";

    await tx.wait();

    document.getElementById("status").innerText =
      "Success!";

    await updateBalances();
    await updateCRTBadge();


  } catch (err) {
    console.error(err);

    document.getElementById("status").innerText = "";
    document.getElementById("error").innerText =
      "Error: " + (err.reason || err.message || err);
  }
  
  
// badge update
}
async function updateCRTBadge() {

  const el = document.getElementById("crtAmount");
	if (!el) return; // pages without badge

  if (!signer || !tokenContract) {
    el.innerText = "— CRT";
    return;
  }

  try {

    const addr = await signer.getAddress();

    const raw = await tokenContract.balanceOf(addr);
    const decimals = await tokenContract.decimals();

    const formatted = ethers.utils.formatUnits(raw, decimals);

    el.innerText = formatted + " CRT";

  } catch (e) {
    console.error("badge error", e);
  }
}

///burning for paying with token for testburn.html
async function ensureConnected() {
  if (!window.ethereum) throw new Error("No wallet");

  if (!provider) {
    provider = new ethers.providers.Web3Provider(window.ethereum);
    signer = provider.getSigner();
  }

  if (!fundContract) {
    fundContract = new ethers.Contract(contractAddress, fundABI, signer);

    const tokenAddress = await fundContract.rewardToken();
    tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);
  }
}

async function payForService(tokenAmountHuman, note) {

  await ensureConnected();

  const decimals = await tokenContract.decimals();
  const amount = ethers.utils.parseUnits(tokenAmountHuman, decimals);

  const tx1 = await tokenContract.approve(contractAddress, amount);
  await tx1.wait();
  
const allowance = await tokenContract.allowance(
  await signer.getAddress(),
  contractAddress
);

console.log("allowance:", allowance.toString());
	const tx2 = await fundContract.redeemForService(amount, note);
	const receipt = await tx2.wait();

	// Save order/payment to database (best-effort)
	try {
		const walletAddr = await signer.getAddress();
		await dbFunctions.createOrder(walletAddr, note, receipt.transactionHash, 'completed', {
			amount_tokens: tokenAmountHuman,
			service_name: note
		});
		console.log('Order saved to DB');
	} catch (dbErr) {
		console.error('Failed to save order to DB:', dbErr);
	}

	await updateBalances();
	await updateCRTBadge();
}

//testburn pay button handler
const payBtn = document.getElementById("payServiceBtn");

if (payBtn) {
  payBtn.onclick = async () => {

    const amountStr = document.getElementById("burnAmount").value.trim();
    const note = document.getElementById("note").value.trim();

    if (!amountStr || isNaN(amountStr)) {
      alert("Enter valid CRT amount");
      return;
    }

    if (!note) {
      alert("Enter service note");
      return;
    }

    await payForService(amountStr, note);
  };
}
