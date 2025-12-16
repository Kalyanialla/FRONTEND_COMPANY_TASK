// import axios from 'axios';

// const API_BASE_URL = 'http://127.0.0.1:8000/auth/';

// export const registerUser = async (userData) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}singup/`, userData);
//     return res.data;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };

// export const loginUser = async (userData) => {
//   try {
//     const res = await axios.post(`${API_BASE_URL}login/`, userData);
//     return res.data;
//   } catch (err) {
//     throw err.response?.data || err;
//   }
// };

// export const logoutUser = async (refreshToken, accessToken) => {
//   try {
//     const res = await axios.post(
//       `${API_BASE_URL}logout/`,
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
import { API_BASE_URL } from '../../chat/utils/Constants';

// const API_BASE_URL = 'http://127.0.0.1:8000/api/auth/';
// const API_BASE_URL = 'https://chatapp-01yt.onrender.com/api/auth/';


export const registerUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/signup/`, userData);  // FIXED: singup -> signup
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const loginUser = async (userData) => {
  try {
    const res = await axios.post(`${API_BASE_URL}/api/auth/login/`, userData);
    return res.data;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const logoutUser = async (refreshToken, accessToken) => {
  try {
    const res = await axios.post(
      `${API_BASE_URL}logout/`,
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