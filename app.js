const BASE_URL = "https://latest.currency-api.pages.dev/v1/currencies";

const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const amountInput = document.querySelector(".amount input");
const msg = document.querySelector(".msg");

// Populate dropdowns with currencies
for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    select.append(newOption);
  }

  // Set default values
  if (select.name === "from") select.value = "USD";
  if (select.name === "to") select.value = "INR";

  // Update flag when currency changes
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });

  // Show initial flags
  updateFlag(select);
}

// Update the exchange rate
async function updateExchangeRate() {
  let amtVal = parseFloat(amountInput.value);
  if (Number.isNaN(amtVal) || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const from = fromCurr.value.toLowerCase();
  const to = toCurr.value.toLowerCase();

  const URL = `${BASE_URL}/${from}.json`;

  try {
    const response = await fetch(URL);
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();

    // Example: data = { usd: { inr: 83.12, eur: 0.92 } }
    const rate = data[from][to];
    if (!rate) throw new Error("Rate not found");

    const finalAmount = (amtVal * rate).toFixed(4);
    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (err) {
    console.error("Failed to fetch exchange rate:", err);
    msg.innerText = "Unable to fetch exchange rate. Try again later.";
  }
}

// Update flag image for a dropdown
function updateFlag(element) {
  const currCode = element.value;
  const countryCode = countryList[currCode]; // comes from codes.js
  const img = element.parentElement.querySelector("img");
  if (countryCode && img) {
    img.src = `https://flagsapi.com/${countryCode}/flat/64.png`;
  }
}

// Button click → fetch exchange rate
btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

// On page load → show default exchange rate
window.addEventListener("load", () => {
  updateExchangeRate();
});
