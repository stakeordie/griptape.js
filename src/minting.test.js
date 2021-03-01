const getInflation = require('./minting');

jest.mock('axios');

test('checks for minting inflation', async () => {
  const inflation = await getInflation();
  expect(inflation.result).toBe('0.120000000000000000');
});
