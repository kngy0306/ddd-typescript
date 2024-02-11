import { ITransactionManager } from "Application/shared/ITransactionManager";
import { Book } from "Domain/models/Book/Book";
import { Title } from "Domain/models/Book/Title/Title";
import { Price } from "Domain/models/Book/Price/Price";
import { BookId } from "Domain/models/Book/BookId/BookId";
import { IBookRepository } from "Domain/models/Book/IBookRepository";
import { ISBNDuplicationCheckDomainService } from "Domain/services/Book/ISBNDuplicationCheckDomainService/ISBNDuplicationCheckDomainService";

export type RegisterBookCommand = {
  isbn: string;
  title: string;
  priceAmount: number;
};

export class RegisterBookApplicationService {
  constructor(
    private readonly bookRepository: IBookRepository,
    private readonly transactionManager: ITransactionManager
  ) {}

  async execute(command: RegisterBookCommand): Promise<void> {
    await this.transactionManager.begin(async () => {
      const isDuplicateISBN = await new ISBNDuplicationCheckDomainService(this.bookRepository).execute(new BookId(command.isbn));

      if (isDuplicateISBN) {
        throw new Error('既に存在するISBNです');
      }

      const book = Book.create(
        new BookId(command.isbn),
        new Title(command.title),
        new Price({ amount: command.priceAmount, currency: 'JPY' })
      );

      await this.bookRepository.save(book);
    })
  }
}
