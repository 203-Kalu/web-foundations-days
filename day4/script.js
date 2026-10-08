// Select DOM elements
const noteTextarea = document.getElementById('note-text');
const charCountPara = document.getElementById('char-count');
const wordCountPara = document.getElementById('word-count');
const clearBtn = document.getElementById('clear-btn');
const themeToggleBtn = document.getElementById('theme-toggle');

// Function to update word and character counts and set status styling
function updateCounts() {
  const text = noteTextarea.value;
  const charCount = text.length;

  // Calculate word count (splitting by whitespace and filtering out empty strings)
  const trimmedText = text.trim();
  const wordCount = trimmedText === '' ? 0 : trimmedText.split(/\s+/).length;

  // Update counter text contents
  charCountPara.textContent = `${charCount} / 200 characters`;
  wordCountPara.textContent = `${wordCount} word${wordCount === 1 ? '' : 's'}`;

  // Update styling classes based on character limit thresholds
  charCountPara.classList.remove('warning', 'over');
  if (charCount > 200) {
    charCountPara.classList.add('over');
  } else if (charCount > 180) {
    charCountPara.classList.add('warning');
  }
}

// Function to clear textarea, reset counters, and clean up localStorage draft
function clearAll() {
  noteTextarea.value = '';
  localStorage.removeItem('noteDraft');
  updateCounts();
}

// Handler for textarea input events
noteTextarea.addEventListener('input', () => {
  updateCounts();
  localStorage.setItem('noteDraft', noteTextarea.value);
});

// Listener for keydown inside textarea (Escape key clears contents)
noteTextarea.addEventListener('keydown', (event) => {
  if (event.key === 'Escape') {
    clearAll();
  }
});

// Clear button click listener
clearBtn.addEventListener('click', clearAll);

// Theme toggle click listener
themeToggleBtn.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggleBtn.textContent = isDark ? 'Light mode' : 'Dark mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// On page load: Restore draft and theme preferences
window.addEventListener('DOMContentLoaded', () => {
  // Restore saved note draft
  const savedDraft = localStorage.getItem('noteDraft');
  if (savedDraft !== null) {
    noteTextarea.value = savedDraft;
  }

  // Restore saved theme
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark');
    themeToggleBtn.textContent = 'Light mode';
  } else {
    document.body.classList.remove('dark');
    themeToggleBtn.textContent = 'Dark mode';
  }

  // Initial count update based on restored state
  updateCounts();
});