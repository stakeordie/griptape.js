import griptape from './index.js';

jest.mock('axios');

test('Check for minting inflation', async () => {
  const inflation = await griptape.mint.getInflation();
  expect(inflation.value).toBe('0.150000000000000001');
});
