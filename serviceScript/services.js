const FUND_ADDRESS = "0xF68AC1448ba859208b0622A87CF3f3A4d591Cfa3";

const fundABI = [
  "function redeemForService(uint256 tokenAmount, string serviceNote)",
  "function rewardToken() view returns(address)"
];

const tokenABI = [
  "function balanceOf(address) view returns(uint256)",
  "function decimals() view returns(uint8)"
];

let provider, signer, fund, token;

async function init() {
  if (!window.ethereum) return alert("Install MetaMask");

  provider = new ethers.providers.Web3Provider(window.ethereum);
  signer = provider.getSigner();

  fund = new ethers.Contract(FUND_ADDRESS, fundABI, signer);

  const tokenAddress = await fund.rewardToken();
  token = new ethers.Contract(tokenAddress, tokenABI, signer);
}

async function redeem(priceCRT, serviceName) {
  try {
    await init();

    const addr = await signer.getAddress();
    const rawBal = await token.balanceOf(addr);
    const decimals = await token.decimals();

    const price = ethers.utils.parseUnits(
      priceCRT.toString(),
      decimals
    );

    if (rawBal.lt(price)) {
      alert("Недостаточно CRT");
      return;
    }

    document.getElementById("status").innerText = "Отправка транзакции...";
    document.getElementById("error").innerText = "";

    const tx = await fund.redeemForService(price, serviceName);
    await tx.wait();

    document.getElementById("status").innerText =
      `Услуга "${serviceName}" успешно оплачена`;

  } catch (err) {
    console.error(err);
    document.getElementById("error").innerText =
      err.reason || err.message;
    document.getElementById("status").innerText = "";
  }
}
