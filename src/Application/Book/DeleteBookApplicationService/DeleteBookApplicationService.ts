import { ITransactionManager } from "Application/shared/ITransactionManager";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { IBookRepository } from "Domain/models/Book/IBookRepository";

export type DeleteBookCommand = {
  bookId: string;
};

export class DeleteBookApplicationService {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly transactionManager: ITransactionManager
  ) {}

  async execute(command: DeleteBookCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const book = await this.bookRepository.find(new BookId(command.bookId));

      if (!book) {
        throw new Error('書籍が見つかりません');
      }

      book.delete();
      await this.bookRepository.delete(book.bookId);
    });
  }
}
