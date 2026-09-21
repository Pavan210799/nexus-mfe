import {
  getUsers,
  setUsers,
  setSession,
  clearSession,
  getNotifications,
  setNotifications
} from "./storage";

function wait(ms) {
  return new Promise(function (resolve) {
    setTimeout(resolve, ms);
  });
}

async function fakeApi(method, body) {
  await wait(300);

  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json"
    }
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const res = await fetch("https://dummyjson.com/test", options);

  if (!res.ok) {
    throw new Error("API request failed");
  }

  return res.json();
}

export async function loginRequest(email, password) {
  await fakeApi("POST", {
    email: email,
    password: password
  });

  const users = getUsers();
  let found = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      found = users[i];
    }
  }

  if (!found) {
    throw new Error("Invalid email or password");
  }

  setSession(found);
  return found;
}

export async function signupRequest(name, email, password) {
  await fakeApi("POST", {
    name: name,
    email: email,
    password: password
  });

  const users = getUsers();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      throw new Error("Email is already registered");
    }
  }

  const user = {
    id: "u-" + Date.now(),
    name: name,
    email: email,
    password: password,
    role: "user",
    department: "Support",
    phone: "",
    createdAt: new Date().toISOString().slice(0, 10)
  };

  users.unshift(user);
  setUsers(users);
  setSession(user);
  return user;
}

export async function logoutRequest() {
  await fakeApi("POST", {
    action: "logout"
  });

  clearSession();
}

export async function getUsersRequest() {
  await fakeApi("GET");
  return getUsers();
}

export async function addUserRequest(payload) {
  await fakeApi("POST", payload);

  const users = getUsers();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === payload.email) {
      throw new Error("Email is already registered");
    }
  }

  const user = {
    id: "u-" + Date.now(),
    name: payload.name,
    email: payload.email,
    password: payload.password || "123456",
    role: payload.role || "user",
    department: payload.department || "Support",
    phone: payload.phone || "",
    createdAt: new Date().toISOString().slice(0, 10)
  };

  users.unshift(user);
  setUsers(users);
  return user;
}

export async function updateUserRequest(id, payload) {
  await fakeApi("PUT", payload);

  const users = getUsers();
  let updated = null;

  for (let i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      users[i] = {
        ...users[i],
        name: payload.name,
        email: payload.email,
        role: payload.role,
        department: payload.department,
        phone: payload.phone
      };
      updated = users[i];
    }
  }

  if (!updated) {
    throw new Error("User not found");
  }

  setUsers(users);
  return updated;
}

export async function deleteUserRequest(id) {
  await fakeApi("DELETE", { id: id });

  const users = getUsers();
  const next = [];

  for (let i = 0; i < users.length; i++) {
    if (users[i].id !== id) {
      next.push(users[i]);
    }
  }

  setUsers(next);
}

export async function getNotificationsRequest() {
  await fakeApi("GET");
  return getNotifications();
}

export async function updateNotificationRequest(id, payload) {
  await fakeApi("PUT", payload);

  const items = getNotifications();

  for (let i = 0; i < items.length; i++) {
    if (items[i].id === id) {
      items[i] = {
        ...items[i],
        ...payload
      };
    }
  }

  setNotifications(items);
  return items;
}

export async function deleteNotificationRequest(id) {
  await fakeApi("DELETE", { id: id });

  const items = getNotifications();
  const next = [];

  for (let i = 0; i < items.length; i++) {
    if (items[i].id !== id) {
      next.push(items[i]);
    }
  }

  setNotifications(next);
  return next;
}
