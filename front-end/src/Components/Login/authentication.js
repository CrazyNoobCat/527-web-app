
export const loginFunction = (username, password) => {
  return fetch("https://api.cinemate.link/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Login failed");
    }
    return response.json();
  })
  .then(data => {
    return data; // Return the whole data object
  });
};
