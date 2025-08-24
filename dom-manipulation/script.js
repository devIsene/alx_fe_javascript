// --- Initial Quotes ---
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can with what you have where you are.", category: "Inspiration" },
];

// --- DOM Elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");

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

// --- Create Add Quote Form Dynamically ---
function createAddQuoteForm() {
  const formContainer = document.createElement("div");

  const inputText = document.createElement("input");
  inputText.id = "newQuoteText";
  inputText.type = "text";
  inputText.placeholder = "Enter a new quote";

  const inputCategory = document.createElement("input");
  inputCategory.id = "newQuoteCategory";
  inputCategory.type = "text";
  inputCategory.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.id = "addQuoteBtn";
  addButton.innerText = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// --- Initialize Page ---
createAddQuoteForm();

// --- Event Listener for Show New Quote Button ---
newQuoteBtn.addEventListener("click", showRandomQuote);


