console.log("JS carregou");
const form = document.getElementById('form');
const usersList = document.getElementById('users');
const loginForm = document.getElementById('loginForm');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  await fetch('http://localhost:3000/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ name, email, password })
  });

  loadUsers();
});

async function loadUsers() {
  const res = await fetch('http://localhost:3000/users');
  const users = await res.json();

  usersList.innerHTML = '';

  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = `${user.name} - ${user.email}`;
    usersList.appendChild(li);
  });
}

loadUsers();

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  const res = await fetch('http://localhost:3000/users/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  alert(data.message || data.error);
});