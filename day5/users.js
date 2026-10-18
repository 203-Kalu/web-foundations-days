// State to hold fetched user data
let usersArray = [];

// DOM Elements
const loadUsersBtn = document.getElementById('load-users');
const filterInput = document.getElementById('filter-input');
const statusPara = document.getElementById('status');
const usersList = document.getElementById('users-list');

/**
 * Renders an array of user objects to the DOM using createElement and textContent.
 * @param {Array} list - Array of user objects to display
 */
function renderUsers(list) {
  usersList.textContent = ''; // Clear previous contents safely

  if (list.length === 0) {
    const noResultsLi = document.createElement('li');
    noResultsLi.textContent = 'No users match your filter.';
    usersList.appendChild(noResultsLi);
    return;
  }

  list.forEach(user => {
    const li = document.createElement('li');

    const nameHeading = document.createElement('strong');
    nameHeading.textContent = user.name;

    const emailPara = document.createElement('p');
    emailPara.textContent = `Email: ${user.email}`;

    const cityPara = document.createElement('p');
    cityPara.textContent = `City: ${user.address ? user.address.city : user.city}`;

    const companyPara = document.createElement('p');
    companyPara.textContent = `Company: ${user.company ? user.company.name : user.companyName}`;

    li.appendChild(nameHeading);
    li.appendChild(emailPara);
    li.appendChild(cityPara);
    li.appendChild(companyPara);

    usersList.appendChild(li);
  });
}

/**
 * Async function to fetch users from the JSONPlaceholder API.
 */
async function loadUsers() {
  // Update UI for loading state
  loadUsersBtn.disabled = true;
  statusPara.textContent = 'Loading users...';
  usersList.textContent = '';

  try {
    const response = await fetch('https://jsonplaceholder.typicode.com/users');

    // Check if response HTTP status is in the 200–299 range
    if (!response.ok) {
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // Store fetched users and display them
    usersArray = data;
    statusPara.textContent = `Successfully loaded ${usersArray.length} users.`;
    renderUsers(usersArray);

  } catch (error) {
    // Display human-readable error status
    statusPara.textContent = `Failed to load users: ${error.message}`;
    usersList.textContent = '';
  } finally {
    // Re-enable button after request completes or fails
    loadUsersBtn.disabled = false;
  }
}

// Event Listeners
loadUsersBtn.addEventListener('click', loadUsers);

// Filter functionality without issuing new network requests
filterInput.addEventListener('input', () => {
  const query = filterInput.value.trim().toLowerCase();

  const filteredUsers = usersArray.filter(user =>
    user.name.toLowerCase().includes(query)
  );

  renderUsers(filteredUsers);
});