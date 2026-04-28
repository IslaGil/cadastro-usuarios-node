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

  li.innerHTML = `
    ${user.name} - ${user.email}
    <div>
      <button onclick="editUser(${user.id}, '${user.name}', '${user.email}')">Editar</button>
      <button onclick="deleteUser(${user.id})">Excluir</button>
    </div>
  `;

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

async function deleteUser(id) {
  await fetch(`http://localhost:3000/users/${id}`, {
    method: 'DELETE'
  });

  loadUsers();
}

function editUser(id, name, email) {
  document.getElementById('name').value = name;
  document.getElementById('email').value = email;

  form.onsubmit = async (e) => {
    e.preventDefault();

    const newName = document.getElementById('name').value;
    const newEmail = document.getElementById('email').value;
    const newPassword = document.getElementById('password').value;

    await fetch(`http://localhost:3000/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: newName,
        email: newEmail,
        password: newPassword
      })
    });

    form.reset();
    loadUsers();
  };
}