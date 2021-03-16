const getInflation = require('./minting');

jest.mock('axios');

test('Check for minting inflation', async () => {
  const inflation = await getInflation();
  expect(inflation.value).toBe('0.150000000000000001');
});
