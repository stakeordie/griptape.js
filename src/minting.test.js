import griptape from './index';

jest.mock('axios');

test('Check for minting inflation', async () => {
  console.log(griptape.mint.getInflation);
  const inflation = await griptape.mint.getInflation();
  expect(inflation.value).toBe('0.150000000000000001');
});
