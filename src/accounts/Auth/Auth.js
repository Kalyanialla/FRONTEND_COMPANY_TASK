// import axios from 'axios';

// const API_URL = 'http://127.0.0.1:8000/auth/';

// export const registerUser = async (userData) => {
//   try {
//     const res = await axios.post(`${API_URL}singup/`, userData);
//     return res.data;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };

// export const loginUser = async (userData) => {
//   try {
//     const res = await axios.post(`${API_URL}login/`, userData);
//     return res.data;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };

// export const logoutUser = async (refreshToken, accessToken) => {
//   try {
//     const res = await axios.post(
//       `${API_URL}logout/`,
//       { refresh: refreshToken },
//       {
//         headers: {
//           Authorization: `Bearer ${accessToken}`,
//           'Content-Type': 'application/json',
//         },
//       }
//     );
//     return res.data;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };



import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/auth/';

export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}signup/`, userData);  // FIXED: singup -> signup
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_URL}login/`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const logoutUser = async (refreshToken, accessToken) => {
  try {
    const res = await axios.post(
      `${API_URL}logout/`,
      { refresh_token: refreshToken },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};