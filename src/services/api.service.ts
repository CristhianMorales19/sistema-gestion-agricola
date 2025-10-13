import axios from 'axios';

export const apiService = axios.create({
  baseURL: 'http://localhost:3000/api', // URL de tu backend (mockeable en tests)
  headers: {
    'Content-Type': 'application/json',
  },
});
