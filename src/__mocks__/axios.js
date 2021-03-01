const axios = {
  get: (url) => {
    if (url.endsWith("/minting/inflation")) {
      return Promise.resolve({
        data: {
          height: "2307140",
          result: "0.120000000000000000",
        },
      });
    }
  },
};

module.exports = axios;
