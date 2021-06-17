import { Decimal } from 'decimal.js'

// Convert to/from human and machine.
export function coinConvert(
  number: number | string,
  decimals: number,
  type?: 'human' | 'machine'): string {

  if (!number) return ''

  let theNumber = number
  if(typeof number === 'number') {
    theNumber = number.toString()
  }

  if ((theNumber as string).indexOf('.') === -1) {
    // In case `number` is an integer

    if (type && type === 'machine') {
      return new Decimal(number).toString()
    }

    return new Decimal(number)
      .dividedBy(new Decimal(10).toPower(decimals))
      .toString()

  } else {
    // In case is not an integer, we just handle it as float

    if (type && type === 'human') {
      return new Decimal(number).toString()
    }

    return new Decimal(10).toPower(decimals).times(number).toString()
  }
}
