import { Price } from './Price';

describe('Price', () => {
  // 正常系
  it('正しい値と通貨コードJPYで有効なPriceを生成する', () => {
    const validAmount = 500;
    const price = new Price({ amount: validAmount, currency: 'JPY' });
    expect(price.amount).toBe(validAmount);
    expect(price.currency).toBe('JPY');
  });

  // 異常系
  it('通貨コードがJPY以外の場合、エラーになること', () => {
    const invalidCurrency = 'USD';
    // @ts-expect-error テストのために無効な値を渡す
    expect(() => new Price({ amount: 500, currency: invalidCurrency })).toThrow('現在は日本円のみを扱います。');
  });

  it('MIN未満の値でPriceを生成するとエラーを投げる', () => {
    const lessThanMin = Price.MIN - 1;
    expect(() => new Price({ amount: lessThanMin, currency: 'JPY' })).toThrow(`価格は${Price.MIN}から${Price.MAX}の間でなければなりません。`);
  });

  it('MAXより大きい値でPriceを生成するとエラーを投げる', () => {
    const moreThanMax = Price.MAX + 1;
    expect(() => new Price({ amount: moreThanMax, currency: 'JPY' })).toThrow(`価格は${Price.MIN}から${Price.MAX}の間でなければなりません。`);
  });
});
