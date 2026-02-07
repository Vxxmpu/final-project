// pay-token.js

const FUND_ADDRESS = "0xB8e2bacA218aB1513DA789413B556D5B9df7Af87";

const fundABI = [
  "function redeemForService(uint256 tokenAmount, string serviceNote)",
  "function rewardToken() view returns(address)"
];

const tokenABI = [
  "function balanceOf(address) view returns(uint256)",
  "function decimals() view returns(uint8)"
];

let provider;
let signer;
let fund;
let token;

async function initContracts() {

  if (!window.ethereum) {
    alert("Please install MetaMask");
    return;
  }

  provider = new ethers.providers.Web3Provider(window.ethereum);
  await provider.send("eth_requestAccounts", []);
  signer = provider.getSigner();

  fund = new ethers.Contract(FUND_ADDRESS, fundABI, signer);

  const tokenAddress = await fund.rewardToken();
  token = new ethers.Contract(tokenAddress, tokenABI, signer);
}

function getParam(name) {
  return new URLSearchParams(location.search).get(name);
}

async function payWithCRT() {

  const crtStr = getParam("crt");
  const serviceName = getParam("name");

  if (!crtStr || !serviceName) {
    alert("Invalid payment data");
    return;
  }

  await initContracts();

  const user = await signer.getAddress();

  const balance = await token.balanceOf(user);
  const decimals = await token.decimals();

  const amount = ethers.utils.parseUnits(crtStr, decimals);

  if (balance.lt(amount)) {
    alert("Not enough CRT tokens");
    return;
  }

  const statusEl = document.getElementById("status");
  const errorEl = document.getElementById("error");

  if (statusEl) statusEl.innerText = "Transaction is being sent...";
  if (errorEl) errorEl.innerText = "";

  try {

    const tx = await fund.redeemForService(amount, serviceName);
    await tx.wait();

    if (statusEl)
      statusEl.innerText = "Service successfully paid with CRT tokens.";

  } catch (e) {

    console.error(e);

    if (errorEl)
      errorEl.innerText = e.reason || e.message;

    if (statusEl)
      statusEl.innerText = "";
  }
}

window.payWithCRT = payWithCRT;
