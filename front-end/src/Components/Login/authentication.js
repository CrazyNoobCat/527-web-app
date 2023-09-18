import axios from 'axios';


export const loginFunction = async (username, password) => {

  const userData = {
    username,
    password,
  };

  const jsonUserData = JSON.stringify(userData);
  try {
    const response = await axios.post('https://api.cinemate.link/users/login', jsonUserData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return response.data;
    
  } catch (error) {
    console.error("Login failed:", error.response.data);
    throw new Error("Login failed");
  }
};