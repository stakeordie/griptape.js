import Inflation from "./domain/inflation"

const axios = require('axios');


async function getInflation() {
  const response = await axios.get('http://127.0.0.1:1317/minting/inflation');
  return new Inflation(response.data.height, response.data.result);
}

module.exports = getInflation;