// Starting data
let notes = [
  { id: 1, text: "Buy milk and bread", category: "personal" },
  { id: 2, text: "Finish the Day 3 assignment", category: "study" },
  { id: 3, text: "Email the project report to Grace", category: "work" },
  { id: 4, text: "Revise JavaScript arrays", category: "study" },
  { id: 5, text: "Call mum", category: "personal" },
];

/**
 * 1. searchNotes(word)
 * Returns an array of notes whose text contains word, ignoring case.
 * @param {string} word
 */
function searchNotes(word) {
  if (!word) return [];
  const searchTerm = word.toLowerCase();
  return notes.filter((note) => note.text.toLowerCase().includes(searchTerm));
}

/**
 * 2. longestNote()
 * Returns the note object with the most characters, or null if empty.
 */
function longestNote() {
  if (notes.length === 0) return null;
  return notes.reduce((longest, current) =>
    current.text.length > longest.text.length ? current : longest
  );
}

/**
 * 3. countByCategory()
 * Returns an object counting notes per category.
 */
function countByCategory() {
  const counts = {};
  for (const note of notes) {
    counts[note.category] = (counts[note.category] || 0) + 1;
  }
  return counts;
}

/**
 * 4. getSummary()
 * Returns a summary string, correctly handling singular ("note") vs plural ("notes").
 */
function getSummary() {
  const total = notes.length;
  if (total === 0) return "0 notes.";

  const counts = countByCategory();
  const categoryParts = Object.entries(counts).map(
    ([category, count]) => `${count} ${category}`
  );

  const noteNoun = total === 1 ? "note" : "notes";
  return `${total} ${noteNoun}: ${categoryParts.join(", ")}.`;
}

/**
 * 5. isDuplicate(text)
 * Returns true if a note with the same text exists (ignoring case & extra spaces).
 * @param {string} text
 */
function isDuplicate(text) {
  if (!text) return false;
  const cleanedInput = text.trim().toLowerCase();
  return notes.some(
    (note) => note.text.trim().toLowerCase() === cleanedInput
  );
}

/**
 * 6. addNote(text, category)
 * Validates length (1-200), duplicate status, and allowed categories before adding.
 * @param {string} text
 * @param {string} category
 */
function addNote(text, category) {
  const allowedCategories = ["personal", "work", "study"];

  if (typeof text !== "string") {
    console.log("Failed to add note: Text must be a string.");
    return false;
  }

  const trimmedText = text.trim();

  if (trimmedText.length < 1 || trimmedText.length > 200) {
    console.log("Failed to add note: Text length must be between 1 and 200 characters.");
    return false;
  }

  if (!allowedCategories.includes(category)) {
    console.log(`Failed to add note: Invalid category '${category}'. Allowed: personal, work, study.`);
    return false;
  }

  if (isDuplicate(trimmedText)) {
    console.log("Failed to add note: Duplicate note text found.");
    return false;
  }

  const newNote = {
    id: notes.length > 0 ? Math.max(...notes.map((n) => n.id)) + 1 : 1,
    text: trimmedText,
    category: category,
  };

  notes.push(newNote);
  return true;
}

// ============================================================================
// CONSOLE TESTS & VERIFICATION
// ============================================================================

console.log("--- Testing searchNotes ---");
console.log(searchNotes("javascript")); 
// Expected output: [{ id: 4, text: "Revise JavaScript arrays", category: "study" }]

console.log(searchNotes("python")); 
// Expected output: []


console.log("\n--- Testing longestNote ---");
console.log(longestNote()); 
// Expected output: { id: 3, text: "Email the project report to Grace", category: "work" }

const tempNotes = notes;
notes = [];
console.log(longestNote()); 
// Expected output: null
notes = tempNotes; // Restore original array


console.log("\n--- Testing countByCategory ---");
console.log(countByCategory()); 
// Expected output: { personal: 2, study: 2, work: 1 }

const tempNotesForCount = notes;
notes = [{ id: 1, text: "Work item", category: "work" }];
console.log(countByCategory()); 
// Expected output: { work: 1 }
notes = tempNotesForCount; // Restore original array


console.log("\n--- Testing getSummary ---");
console.log(getSummary()); 
// Expected output: "5 notes: 2 personal, 2 study, 1 work."

const tempNotesForSummary = notes;
notes = [{ id: 1, text: "Solo note", category: "personal" }];
console.log(getSummary()); 
// Expected output: "1 note: 1 personal."
notes = tempNotesForSummary; // Restore original array


console.log("\n--- Testing isDuplicate ---");
console.log(isDuplicate("  Call mum  ")); 
// Expected output: true

console.log(isDuplicate("Call dad")); 
// Expected output: false


console.log("\n--- Testing addNote ---");
console.log(addNote("Buy groceries", "personal")); 
// Expected output: true

console.log(addNote("Buy milk and bread", "personal")); 
// Expected output: Logs duplicate error, returns false

console.log(addNote("Test invalid category", "hobbies")); 
// Expected output: Logs category error, returns false

console.log(addNote("", "study")); 
// Expected output: Logs length error, returns false