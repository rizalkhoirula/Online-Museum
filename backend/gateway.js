// gateway.js
module.exports = {
  apiEndpoints: [
    {
      name: "auth",
      path: "/api/v1/auth/**",
      target: "http://localhost:3001",
    },
    {
      name: "barang",
      path: "/api/v1/barang/**",
      target: "http://localhost:3002",
    },
  ],
  serviceEndpoints: {
    auth: "http://localhost:3001",
    barang: "http://localhost:3002",
  },
};
