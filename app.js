const contractAddress = "0xF68AC1448ba859208b0622A87CF3f3A4d591Cfa3";

// --- ABI фонда
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
      { "internalType": "address", "name": "_rewardTokenAddress", "type": "address" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "contributor", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amountETH", "type": "uint256" },
      { "indexed": false, "internalType": "uint256", "name": "tokensMinted", "type": "uint256" }
    ],
    "name": "Contributed",
    "type": "event"
  },
  {
    "inputs": [
      { "internalType": "uint256", "name": "tokenAmount", "type": "uint256" },
      { "internalType": "string", "name": "serviceNote", "type": "string" }
    ],
    "name": "redeemForService",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "anonymous": false,
    "inputs": [
      { "indexed": true, "internalType": "address", "name": "user", "type": "address" },
      { "indexed": false, "internalType": "uint256", "name": "amount", "type": "uint256" }
    ],
    "name": "TokensBurned",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "CAMPAIGN_TITLE",
    "outputs": [{ "internalType": "string", "name": "", "type": "string" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
    "name": "contributions",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "FUNDING_GOAL",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getMyContribution",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalRaised",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "rewardToken",
    "outputs": [{ "internalType": "contract ClinicRewardToken", "name": "", "type": "address" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "totalRaised",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
];

// --- ABI токена
const tokenABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)"
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
      window.location.href = "index.html";
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
    return; // пользователь не подключал сайт
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  fundContract = new ethers.Contract(contractAddress, fundABI, signer);

  const tokenAddress = await fundContract.rewardToken();
  tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

  await updateCRTBadge();
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
    document.getElementById("address").innerText = addr;

    const network = await provider.getNetwork();
    document.getElementById("network").innerText =
      network.chainId === 11155111 ? "Sepolia ✅" : "Wrong network";

    fundContract = new ethers.Contract(contractAddress, fundABI, signer);

    const tokenAddress = await fundContract.rewardToken();
    console.log("Token from fund:", tokenAddress);

    tokenContract = new ethers.Contract(tokenAddress, tokenABI, signer);

    await updateBalances();
    await updateCRTBadge();

  } catch (err) {
    console.error(err);
    document.getElementById("error").innerText =
      "Connect failed: " + (err.message || err);
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
  if (!el) return; // если страницы без бейджа

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

