// --- Initial Quotes ---
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can with what you have where you are.", category: "Inspiration" },
];

// --- DOM Elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const addQuoteBtn = document.getElementById("addQuoteBtn");

// --- Show Random Quote ---
function showRandomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];
  quoteDisplay.innerHTML = `"${randomQuote.text}" — ${randomQuote.category}`;
}

// --- Add Quote ---
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    // Add new quote to the array
    quotes.push({ text, category });

    // Immediately update the DOM to show the new quote
    quoteDisplay.innerHTML = `"${text}" — ${category}`;

    // Clear input fields
    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";
  }
}

// --- Event Listeners ---
newQuoteBtn.addEventListener("click", showRandomQuote);
addQuoteBtn.addEventListener("click", addQuote);

