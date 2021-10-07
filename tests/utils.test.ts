import { coinConvert } from '../src/utils';

describe('coinConvert', () => {
  test('Should convert from human to machine', () => {
    const result = coinConvert(120, 6, 'machine');
    expect(result).toBe('120000000');
  });

  test('Should convert from machine to human', () => {
    const result = coinConvert(120000000, 6, 'human');
    expect(result).toBe('120');
  });

  test('Should fixed the number to an specific number of decimals', () => {
    const result = coinConvert(120345233, 6, 'human', 2);
    expect(result).toBe('120.35');
  });
});
