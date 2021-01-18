export const environment = {
  production: true,
  apiUrl: window[`env`][`apiUrl`] || "http://localhost:5000/api",
  baseUrl: window[`env`][`baseUrl`] || "http://localhost:5000",
  debug: window[`env`][`debug`] || false,
};
