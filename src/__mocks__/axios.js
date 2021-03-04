const axios = {
  get: (url) => {
    if (url.endsWith("/minting/inflation")) {
      return Promise.resolve({
        data: {
          height: "2307140",
          result: "0.150000000000000001",
        },
      });
    }
  },
};

module.exports = axios;
