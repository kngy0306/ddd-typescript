# TypeScriptでドメイン駆動設計を学ぶ

# ドメイン

DDDにおけるドメインとは

> **ソフトウェアが解決しようとしている特定の問題領域**を指します。
>

ドメイン駆動設計はビジネス要件、知識を基盤として設計・開発を行う。

ソフトウェア開発者が業務知識を深め、それを元にドメインモデルを構築することでビジネス要件を直接的にソフトウェアに反映させることができる。

# ドメインモデリング

特定の問題領域を表現するために構造化されたモデルや図を作成するプロセス。

特定ドメインに精通している専門家（ドメインエキスパート）の存在が欠かせない。

ドメインモデリングによって決めていくもの

- コアドメイン、サブドメイン
    - コアドメイン…最も重要な価値、競争優位性を生み出す部分
    - サブドメイン…ビジネスの主要な業務領域をサポートする部分
- 境界づけられたコンテキストの定義
    - 特定のドメインモデルが適応される境界をユビキタス言語によって示す。
- エンティティの特定
    - システム内の従業なオブジェクトで一意の識別子によって識別される。
    - ドメインモデルの一部としてロジックやルールを表現するもの。
    - オンライン書店の場合：「書籍」、「著者」エンティティがあるかも
    - 例）「書籍」エンティティには一意のISBNコードを持つ。また様々な属性（タイトル、価格、著者）などを保持する。
        - DBのエンティティは…「従業員」というエンティティがあり、「名前・メアド」などの属性があるといえる。
- ビジネスルールの把握
    - ビジネスに必要なルールや手続きを表現する規則、条件のこと。
    - 例）「一冊の書籍には一つのISBNコードのみが割り当てられる」というドメイン特有のルールがある。これらをドメインモデリングの段階で見つけることで一冊の書籍に複数のISBNコードが割り当てられてしまうといったような状態を防ぐことができる。

# イベントストーミング

ドメインモデリングの手法。スキップ

# ドメインモデル図

ドメインの主要な概念、エンティティ、その属性、およびこれら要素間の関係性を視覚的に表現した図。

# 戦略的設計

ドメインモデリングでの成果物を反映していく。

DDDには固有のアーキテクチャはない。参考書籍ではオニオンアーキテクチャを使用している。

オニオンアーキテクチャではアプリケーションを復数のレイヤーに分割する。

- ドメイン層
    - アプリケーションのコア。ビジネスルールやビジネスロジックを表現する。
    - 主にエンティティ、値オブジェクト、ドメインサービス、リポジトリのインターフェースが含まれる。
- アプリケーション層
    - ドメイン層のクライアント。ユースケースを組み立てるためにドメイン層を利用する。
    - 主にアプリケーションサービスが含まれる。
- インフラストラクチャ層
    - アプリケーションに必要な外部リソース（DB、ファイルシステム、外部サービス）の通信を担当する。
    - 主にリポジトリの実装が含まれる。
- プレゼンテーション層
    - リクエストを受け取り、応答を返す。
    - 主にWeb UI、REST API、CLI が含まれる。

オニオンアーキテクチャ（OA）には依存関係に方向性がある。

外側から内側への一方向の依存関係を強制する。その結果

- ドメイン層の独立
- テスト容易性向上
- 拡張性と保守性の向上
- 再利用性の向上

OAにおける依存関係の方向性はDIというソフトウェア設計の原則を反映している。

これは以下のポイント

- 上位モジュールは下位モジュールに依存してはならない。どちらのモジュールも抽象に依存するべきである
- 抽象は詳細に依存してはならない。詳細が抽象に依存するべきである
    - 抽象…インターフェースや抽象クラス
    - 詳細…具体的な実装

DIで、コンポーネント間の依存関係を外部から注入することによってコードの柔軟性と再利用性を高めるアプローチ。

具体的には、あるオブジェクトが必要とする依存オブジェクト（サービス、ツール、クライアントなど）を、そのオブジェクトの内部で生成するのではなく、外部から提供（注入）することを意味している。

```ts
const sayHello = (name: string): void => {
  logger(`Hello ${name}!`);
};

sayHello('World');
```

このコードは`sayHello`関数が、`logger`を呼び出しているため、`logger`の実装を変更すると`sayHello`関数に影響を与える。

```ts
const sayHello = (name: string, logger: (message: string) => void): void => {
  logger(`Hello ${name}!`);
};

sayHello('World', console.log);
```

`sayHello`関数の引数にloggerを注入することで`logger`の実装を変更しても`sayHello`関数に与える影響はない。これによりロギングツールが決まるまで`console.log`で代用できたりする。（引数の型に当てはまっていれば何でも良い）

# 値オブジェクト（Value Object）

値オブジェクトはエンティティと並びドメインモデル（ドメインオブジェクト）の中心的要素で、ドメイン内の様々な値の概念をモデル化する。

値は年齢、名前などあるがこれらの値を表現する。

```ts
const BookId: string = '9777487487389'
```

例えばISBNコードを表したいとき、上記の文字列は

- ISBNの規約である「978」から始まることを満たせていない
- ISBNの規約である12桁の数字ではなく13桁になっている
- そもそも知識がないとこれをISBNと認識できない

などの問題がある。

これらの問題を値オブジェクトは解決する。

値には3つの特徴がある

- 不変に保つことができる
    - `‘あ’ = ‘い’` のように値自体を変更できない
- 値同士が比較可能
- 副作用がない
    - 値に関連するメソッドを実行しても値自体には変更が起きないこと

プリミティブな値を値オブジェクトにする基準

値オブジェクトはメリットがたくさんあるが実装のコストも高い。

[https://zenn.dev/yamachan0625/books/ddd-hands-on/viewer/chapter8_value_object#プリミティブな値を値オブジェクトにする基準](https://zenn.dev/yamachan0625/books/ddd-hands-on/viewer/chapter8_value_object#%E3%83%97%E3%83%AA%E3%83%9F%E3%83%86%E3%82%A3%E3%83%96%E3%81%AA%E5%80%A4%E3%82%92%E5%80%A4%E3%82%AA%E3%83%96%E3%82%B8%E3%82%A7%E3%82%AF%E3%83%88%E3%81%AB%E3%81%99%E3%82%8B%E5%9F%BA%E6%BA%96)

# エンティティ

ビジネスの実体の概念をモデル化するのに用いられる

エンティティは**同一性**によってそれらを区別する。例えば「人」は年齢という数値が変化してもその人であることは変わらない。

それは「何であるか」や「誰であるか」という概念によって同一性が定義される。

エンティティには以下の特徴もある

- 一意な識別子によって区別される
- 可変である
    - 属性や関連するオブジェクトが変更されることがある。反映できる。
- ライフサイクルがある
    - 生成・変更・削除というプロセスで時間とともに変化する。

エンティティを利用することでライフサイクルの整合性を担保できる。

エンティティ自身がドキュメントになる。

# 集約

関連するオブジェクト群を1つのユニットとして管理するための手法。1つのルートエンティティと、それに関連するエンティティや値オブジェクトで構成される。

集約は、ビジネスルールとデータの整合性を維持するために設計される。

例えば、「書籍」と「在庫」には整合性が必要。書籍を削除したら、在庫も削除されなければいけない。在庫が残っていたらデータに矛盾が生じるから。そのため「書籍」と「在庫」は集約として定義する必要がある。

集約は[リポジトリ](#リポジトリ)の入出力の単位で、集約単位で入出力することで整合性が保たれたデータを確実に管理することができる。

本書では、集約をデメテルの法則（OPPの設計原則の一つ）に則って実装している。

デメテルの法則の基本原則

`オブジェクト: O`上の`メソッド: M`が呼び出しても良いメソッドは以下のオブジェクトに属するメソッドのみに限定される

1. `O` それ自身
2. `M` の引数に渡されたオブジェクト
3. `M` の内部でインスタンス化されたオブジェクト
4. `O` を直接的に構成するオブジェクト（Oのインスタンス変数）

**原則を満たしていない例**

```ts
class Stock {
  constructor(public _quantityAvailable: number) {}

  get quantityAvailable(): number {
    return this._quantityAvailable;
  }
}

class Book {
  constructor(public stock: Stock) {}
}

const quentityAvailable = new Book(new Stock(100)).stock.quantityAvailable;
```

> この例では、`Book` クラスは `Stock` クラスを通じて `quantityAvailable` にアクセスしています。これは`Book` クラスが `Stock` クラス の内部構造（Stock が quantityAvailable を持っていること）に依存しており、結合度が高いです。
>

この引用の説明が完璧に理解できていない。下の法則適応後コードでも、Stock が quantityAvailable を持っていることに依存してない？と思ったから。

でもBookクラス内のメソッドを通して呼び出すことで修正範囲が小さくなる？とは感じた。

**デメテルの法則適応後のコード**

```ts
class Stock {
  constructor(public _quantityAvailable: QuantityAvailable) {}

  get quantityAvailable(): QuantityAvailable {
    return this._quantityAvailable;
  }
}

class Book {
  constructor(private stock: Stock) {}

  getQuantityAvailable() {
    return this.stock.quantityAvailable;
  }
}

const quantityAvailable = new Book(new Stock(100)).getQuantityAvailable();
```

## 集約の設計ルール

- 集約は小さくする
- 集約間は識別子（ID）で参照する
- 集約の外部では結果整合性を用いる

### **集約は小さくする**

集約は、ビジネスルールとデータの整合性を維持するための設計。しかし整合性だけに焦点を当てていると、集約の範囲は肥大しがち。例えば以下のコードは書籍集約で、タイトル・著者・出版社・レビューなど、書籍に関わるすべての情報を含んでいる。

```ts
class Book {
  constructor(
    private readonly _bookId: BookId, // 値オブジェクト
    private  _title: Title, // 値オブジェクト
    private  _author: Author, // エンティティ
    private  _publisher: Publisher, // エンティティ
    private  _reviews: Review[], // エンティティ
  ) {}
  (省略)
}
```

ここで問題になるのは、`1集約 1トランザクション`でDBに反映することを考えると、書籍の一部データを更新するために集約ないすべての要素をDBから取得・更新する必要がある。それはオーバーヘッドを生じさせ、パフォーマンスの悪影響につながる。（トランザクションによるロック時間の増加も）

集約の範囲を決めるために以下の基準が参考になる。

- ルートエンティティ（↑の例だと書籍）に対して`1対N`の関係性にあるエンティティを保有する場合、保有数の上限が適切か？
- 強整合性（トランザクション整合性）が必要か

**保有数の上限が適切か？**

「書籍」と「レビュー」の関係性は1対Nだが、レビューに上限があるかどうかを確認する。レビュー数に上限がなく、無限に追加できるとしたら、DB更新時のトランザクションロック時間・パフォーマンスに影響があるかもしれない。

だがレビュー数の上限が100件だけとかなら、パフォーマンスとの天秤により、集約による整合性を担保するという選択はアリかもしれない。

**強整合性が必要か**

「書籍」と「レビュー」に関する関係は、整合性がそれほど必要ないかもしれない。例えば「書籍」と「著者」の関係においては整合性は大事だが、書籍のレビュー数は直接書籍に影響を及ぼすことは小さい。

レビュー数が一時的におかしな数字（上限を設定しているが一時的にそれを超える、など）は許容できるかもしれない。

上記から、「書籍」と「レビュー」は別集約として扱っても良いかも、という判断ができる。

### 集約間は識別子（ID）で参照する

```ts
class Book {
  constructor(
    private readonly _bookId: BookId, // 値オブジェクト
    private  _title: Title, // 値オブジェクト
    private  _author: Author, // エンティティ
    private  _publisher: Publisher, // エンティティ
  ) {}
  (省略)
}

class Review {
  constructor(
    private readonly _reviewId: ReviewId, // 値オブジェクト
    private  _comment: Comment, // 値オブジェクト
    private  _rating: Rating, // 値オブジェクト
		private _bookId: BookId, // ルートエンティティ(集約)のID
  ) {}
  (省略)
}
```

### 集約の外部では結果整合性を用いる

「書籍」と「レビュー」は集約を分けることで、「レビュー」に100件という上限を設けていたとしても、101件めのレビューが作成されてしまうという整合性の崩れを許容することになる。だたしずっと101件目のレビューが存在することは問題になる。

そこで結果整合性を用いることで整合師を担保する。

結果整合性を保つためにドメインイベントを活用することもある。

# ドメインサービス

エンティティや値オブジェクトだけでは自然に表現できないビジネスロジックをカプセル化する。

|  | ドメインサービス | アプリケーションサービス |
| --- | --- | --- |
| 主な役割 | ビジネスロジックの実装 | ユースケースの実装 |
| 操作するもの | ドメインオブジェクト (集約) | ドメインサービス、ドメインオブジェクト (集約) |
| ビジネスルール | ドメイン固有のルールを実装 | ユースケース固有の手順を調整 |
| データの永続化 | 永続化責務は持たない | 永続化の責務を持つ |

ドメインに特化したサービス。

ドメインサービスで表現する例

ISBNは重複しないというビジネスルールがあるが、書籍登録の際に「既に登録されているか？」をチェックする必要がある。これを書籍エンティティに実装するのは、

```ts
const bookId = new BookId('9784167158057');
const title ~

const book = Book.create(bookId, title, price);
// 書籍自身がISBNの重複チェックを行う
const isDuplicateISBN = book.isDuplicateISBN(bookId);
```

ドメインモデルの観点から不自然になる。（自身で一意性のチェックをするのが不自然）

こういう処理をドメインサービスで行う（著者は命名を`[処理名]DomainService.t`にすることを推奨）

```ts
import { BookId } from 'Domain/models/Book/BookId/BookId';

export class ISBNDuplicationCheckDomainService {
  async execute(isbn: BookId): Promise<boolean> {
    // 本来は、データベースに問い合わせて重複があるか確認する。この章では省略。
    const isDuplicateISBN = false;

    return isDuplicateISBN;
  }
}
```

## ドメインモデル貧血症

やろうと思えばエンティティに実装した属性を変更するメソッドも、すべてドメインサービスに記載できてしまうが、そのエンティティにどんなビジネスルールが存在するかを読み取れなくなるので、

**まずはエンティティ、値オブジェクトで実装できないかを検討するべき。**

## ドメインサービスを利用する基準

- 集約をまたいだ処理をするとき
- DBへの問い合わせを行うとき

### 集約をまたいだ処理をするとき

各集約はそれ自体で一貫性を持つが、復数の集約間で一貫性を保つ操作は集約の範囲を超えるため集約の外部で行うべき。

### DBへの問い合わせを行うとき

エンティティや値オブジェクトは自身の状態を保持し、状態を用いてビジネスロジックを実行する。

DBからのデータ取得や集計処理など、外部リソースに依存する操作はドメインサービスを通じて行うべき。

# リポジトリ

ドメインモデルとDB間の橋渡しを行う。

リポジトリはインフラストラクチャ層のオブジェクト（？？）で、集約の永続化を抽象化する役割がある。

ドメインモデルやビジネスロジックをデータ永続化の詳細（なんのDBを使う？ORMは？）から切り離す。

リポジトリの責務は集約の永続化（CREATE, UPDATE）と、集約の復元（READ）。

ドメインサービスはドメイン層のオブジェクト。インフラストラクチャのオブジェクトであるリポジトリを直接利用（依存）することはオニオンアーキテクチャに反する。依存性逆転の原則（DIP）に従い**リポジトリの抽象**（インターフェース）を定義し、インターフェースに具体的な実装を依存させるようにDIする。

**リポジトリの抽象**

```ts
import { Book } from './Book';
import { BookId } from './BookId/BookId';

export interface IBookRepository {
  save(book: Book): Promise<void>;
  update(book: Book): Promise<void>;
  delete(bookId: BookId): Promise<void>;
  find(bookId: BookId): Promise<Book | null>;
}
```

ドメインサービスはリポジトリの抽象に依存させる（なんのDBを使っていようが、findで取得できる）

```ts
import { BookId } from "Domain/models/Book/BookId/BookId";
import { IBookRepository } from "Domain/models/Book/IBookRepository";

export class ISBNDuplicationCheckDomainService {
  constructor(private readonly bookRepository: IBookRepository) {}

  async execute(isbn: BookId): Promise<boolean> {
    const duplicateISBNBook = await this.bookRepository.find(isbn);
    const isDuplicateISBN = !!duplicateISBNBook;

    return isDuplicateISBN;
  }
}
```

```ts
import { Book } from 'Domain/models/Book/Book';
import { BookId } from 'Domain/models/Book/BookId/BookId';
import { IBookRepository } from 'Domain/models/Book/IBookRepository';

export class InMemoryBookRepository implements IBookRepository {
  public DB: {
    [id: string]: Book;
  } = {};

  async save(book: Book) {
    this.DB[book.bookId.value] = book;
  }

  async update(book: Book) {
    this.DB[book.bookId.value] = book;
  }

  async delete(bookId: BookId) {
    delete this.DB[bookId.value];
  }

  async find(bookId: BookId): Promise<Book | null> {
    const book = Object.entries(this.DB).find(([id]) => {
      return bookId.value === id.toString();
    });

    return book ? book[1] : null;
  }
}
```

インフラストラクチャ層にPrismaでの実装を作成

インターフェースの実装を満たしているので、ORMなどの詳細をこの層で閉じ込めておける。

```ts
import { $Enums, PrismaClient } from '@prisma/client';
~

const prisma = new PrismaClient();

export class PrismaBookRepository implements IBookRepository {
  async save(book: Book) {
	~
}
```

リポジトリのテスト

- リポジトリを利用する側のコードが集約の入出力を正しく行えるか
- リポジトリ自体が正しく動くか

# アプリケーションサービス

ドメインサービスに次ぐ2つ目のサービス。ユースケースを実現するための操作を行う。

ドメイン層の**エンティティ、値オブジェクト、ドメインサービス**などのドメインオブジェクトを利用してユースケースを実現する。＝これらの外側に存在する。

ユースケースとは、ユーザがシステムを利用する際に実現したい機能や処理のこと。在庫管理コンテキストでは以下の処理（CRUD）が対応する。

- 書籍の登録
- 書籍の取得
- 在庫を追加する
- 書籍を削除する

書籍登録の処理

```ts
export type RegisterBookCommand = {
  isbn: string;
  title: string;
  priceAmount: number;
}

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
```

ISBNの重複チェックのビジネスロジック、エンティティ作成のビジネスロジックが隠蔽されていることでアプリケーションサービスはドメイン知識が必要ない。

bookRepository, trancsactionManagerをDIしている。

## DTO

書籍取得処理では以下のように記述すると、アプリケーション層にドメイン層のデータを返すことになってしまう。

```ts
export class GetBookApplicationService {
  constructor(private bookRepository: IBookRepository) {}

  async execute(isbn: string): Promise<Book | null> {
    const book = await this.bookRepository.find(new BookId(isbn));

    return book
  }
}
```

そこでDTO(Data Transfer Object)でドメインオブジェクトを決まったデータ構造で変換してアプリケーション層で使用するようにする。

DTOを通して返り値を返すと、以下の実装になる。

```ts
export class GetBookApplicationService {
  constructor(private bookRepository: IBookRepository) {}

  async execute(isbn: string): Promise<BookDTO | null> {
    const book = await this.bookRepository.find(new BookId(isbn));

    return book ? new BookDTO(book) : null;
  }
}
```

アプリケーションサービスの実装で重要なのは、ドメイン知識をドメインオブジェクトの中に閉じ込め、アプリケーションサービスの中にドメイン知識が漏れ出していないことが重要。

# プレゼンテーション

アプリケーションのユーザーインターフェース部分で、MVCでいうコントローラーにあたる。ユーザー（ブラウザ、APIなど）の入力を受け取り、処理結果をわかりやすい形（jsonなどの形式も含む）で返却する。

本書ではExpressを利用してAPIを実装。
