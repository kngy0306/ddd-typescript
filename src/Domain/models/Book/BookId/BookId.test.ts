import { BookId } from "./BookId";

describe("BookId", () => {
  // 正常系
  test('有効なフォーマとの場合、正しい変換結果になること', () => {
    expect(new BookId('9784167158057').value).toBe('9784167158057');
    expect(new BookId('4167158051').value).toBe('4167158051');
  });

  test('equals', () => {
    const bookId1 = new BookId('9784167158057');
    const bookId2 = new BookId('9784167158057');
    const bookId3 = new BookId('9781234567890');
    expect(bookId1.equals(bookId2)).toBeTruthy();
    expect(bookId1.equals(bookId3)).toBeFalsy();
  });

  test('toISBN() 13桁', () => {
    const bookId = new BookId('9784167158057');
    expect(bookId.toISBN()).toBe('ISBN978-4-16-715805-7');
  });

  test('toISBN() 10桁', () => {
    const bookId = new BookId('4167158051');
    expect(bookId.toISBN()).toBe('ISBN4-16-715805-1');
  });

  // 異常系
  test('不正な文字数の場合、エラーになること', () => {
    expect(() => new BookId('1'.repeat(30))).toThrowError('ISBNの文字数が不正です');
    expect(() => new BookId('1'.repeat(14))).toThrowError('ISBNの文字数が不正です');
    expect(() => new BookId('1'.repeat(9))).toThrowError('ISBNの文字数が不正です');
    expect(() => new BookId('1'.repeat(1))).toThrowError('ISBNの文字数が不正です');
  });

  test('不正なフォーマットの場合にエラーを投げる', () => {
    expect(() => new BookId('9994167158057')).toThrow('ISBNの形式が不正です');
  });
});
