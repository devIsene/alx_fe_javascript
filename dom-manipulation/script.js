// --- Initial Quotes ---
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can with what you have where you are.", category: "Inspiration" },
];

// --- Server URL (JSONPlaceholder) ---
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts";

// --- Load quotes from localStorage ---
const storedQuotes = localStorage.getItem("quotes");
if (storedQuotes) quotes = JSON.parse(storedQuotes);

// --- DOM Elements ---
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteBtn = document.getElementById("newQuote");
const exportBtn = document.getElementById("exportBtn");
const importFile = document.getElementById("importFile");
const syncBtn = document.getElementById("syncBtn");

// --- Show Random Quote ---
function showRandomQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    quoteDisplay.textContent = "No quotes in this category.";
  }
}

// --- Load last viewed quote from sessionStorage ---
const lastQuote = sessionStorage.getItem("lastQuote");
if (lastQuote) {
  const parsedQuote = JSON.parse(lastQuote);
  quoteDisplay.textContent = `"${parsedQuote.text}" — ${parsedQuote.category}`;
}

// --- Save quotes to localStorage ---
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// --- Fetch quotes from server ---
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    return serverData.map(item => ({
      text: item.title,
      category: item.body
    }));
  } catch (error) {
    console.error("Fetch failed:", error);
    return [];
  }
}

// --- Post new quote to server ---
async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: quote.text, body: quote.category })
    });
    const data = await response.json();
    console.log("Quote posted to server:", data);
  } catch (error) {
    console.error("Failed to post quote:", error);
  }
}

// --- Add Quote ---
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const category = document.getElementById("newQuoteCategory").value.trim();

  if (text && category) {
    const newQuote = { text, category };
    quotes.push(newQuote);
    saveQuotes();
    quoteDisplay.textContent = `"${text}" — ${category}`;
    populateCategories();

    document.getElementById("newQuoteText").value = "";
    document.getElementById("newQuoteCategory").value = "";

    postQuoteToServer(newQuote);
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
  addButton.textContent = "Add Quote";
  addButton.addEventListener("click", addQuote);

  formContainer.appendChild(inputText);
  formContainer.appendChild(inputCategory);
  formContainer.appendChild(addButton);

  document.body.appendChild(formContainer);
}

// --- Populate categories in dropdown ---
function populateCategories() {
  const categoryFilter = document.getElementById("categoryFilter");
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  const categories = [...new Set(quotes.map(q => q.category))];
  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  const lastFilter = localStorage.getItem("lastCategoryFilter");
  if (lastFilter) {
    categoryFilter.value = lastFilter;
    filterQuote();
  }
}

// --- Filter quotes by category ---
function filterQuote() {
  const categoryFilter = document.getElementById("categoryFilter");
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("lastCategoryFilter", selectedCategory);

  let filteredQuotes = quotes;
  if (selectedCategory !== "all") filteredQuotes = quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length > 0) {
    const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
    const randomQuote = filteredQuotes[randomIndex];
    quoteDisplay.textContent = `"${randomQuote.text}" — ${randomQuote.category}`;
    sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
  } else {
    quoteDisplay.textContent = "No quotes in this category.";
  }
}

// --- JSON Export ---
exportBtn.addEventListener("click", () => {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
});

// --- JSON Import ---
importFile.addEventListener("change", event => {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
    } catch {
      alert("Invalid JSON file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
});

// --- Periodic Sync every 30 seconds ---
setInterval(async () => {
  const serverQuotes = await fetchQuotesFromServer();
  let conflicts = 0;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
    if (!exists) {
      quotes.push(sq);
      conflicts++;
    }
  });

  saveQuotes();
  populateCategories();

  // UI notification for data updates or conflicts
  alert("Quotes synced with server!");
}, 30000);

// --- Manual Sync Button ---
syncBtn.addEventListener("click", async () => {
  const serverQuotes = await fetchQuotesFromServer();
  let conflicts = 0;

  serverQuotes.forEach(sq => {
    const exists = quotes.some(lq => lq.text === sq.text && lq.category === sq.category);
    if (!exists) {
      quotes.push(sq);
      conflicts++;
    }
  });

  saveQuotes();
  populateCategories();
  alert("Quotes synced with server!");
});

// --- Initialize Page ---
createAddQuoteForm();
populateCategories();
newQuoteBtn.addEventListener("click", showRandomQuote);




