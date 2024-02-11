import { QuantityAvailable } from "./QuantityAvailable/QuantityAvailable";
import { Status, StatusEnum } from "./Status/Status";
import { StockId } from "./StockId/StockId";

export class Stock {
  // create, reconstruct のみでエンティティを生成するため、コンストラクタはprivate
  constructor(
    private readonly _stockId: StockId, // 識別子は変更不可
    private _quantityAvailable: QuantityAvailable,
    private _status: Status
  ) {}

  // 新規エンティティの生成
  // デフォルト値を定義することでビジネスルールに従ったエンティティを生成できる
  static create() {
    const defaultStockId = new StockId(); // 自動採番
    const defaultQuantityAvailable = new QuantityAvailable(0);
    const defaultStatus = new Status(StatusEnum.OutOfStock);

    return new Stock(defaultStockId, defaultQuantityAvailable, defaultStatus);
  }

  public delete() {
    if (this.status.value !== StatusEnum.OutOfStock) {
      throw new Error('在庫がある場合削除できません。');
    }
  }

  public changeStatus(newStatus: Status) {
    this._status = newStatus;
  }

  // 在庫数を増やす
  public increaseQuantity(amount: number) {
    if (amount < 0) {
      throw new Error('増加量は0以上でなければなりません。');
    }

    const newQuantity = this.quantityAvailable.increment(amount).value;

    // 在庫数が10以下ならステータスを残りわずかにする
    if (newQuantity <= 10) {
      this.changeStatus(new Status(StatusEnum.LowStock));
    }
    this._quantityAvailable = new QuantityAvailable(newQuantity);
  }

  // 在庫数を減らす
  public decreaseQuantity(amount: number) {
    if (amount < 0) {
      throw new Error('減少量は0以上でなければなりません。');
    }

    const newQuantity = this.quantityAvailable.decrement(amount).value;

    // 在庫数が10以下ならステータスを残りわずかにする
    if (newQuantity <= 10) {
      this.changeStatus(new Status(StatusEnum.LowStock));
    }

    // 在庫数が0ならステータスを在庫切れにする
    if (newQuantity === 0) {
      this.changeStatus(new Status(StatusEnum.OutOfStock));
    }
    this._quantityAvailable = new QuantityAvailable(newQuantity);
  }

  // エンティティ再構成
  static reconstruct(stockId: StockId, quantityAvailable: QuantityAvailable, status: Status) {
    return new Stock(stockId, quantityAvailable, status);
  }

  get stockId(): StockId {
    return this._stockId;
  }

  get quantityAvailable(): QuantityAvailable {
    return this._quantityAvailable;
  }

  get status(): Status {
    return this._status;
  }
}
