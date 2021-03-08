const getInflation = require('./minting');

jest.mock('axios');

test('Check for minting inflation', async () => {
  const inflation = await getInflation();
  expect(inflation.result).toBe('0.15000000000000001');
});
