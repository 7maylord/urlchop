const config = {
    AppEnv: import.meta.env.VITE_APP_ENV,
    Api: {
      baseUrl: import.meta.env.VITE_API_URL, //Backend server
    },
    App: {
      url: import.meta.env.VITE_APP_URL,
    },
  };
  
  export default config;
  