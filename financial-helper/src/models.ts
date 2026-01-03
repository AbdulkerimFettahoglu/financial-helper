export interface Person {
  id?: number;
  name: string;
}

/** Ürün bilgisi */
export interface Product {
  /** Benzersiz ürün kimliği (UUID veya string id) */
  id?: number;
  /** Ürün tam adı */
  name: string;
  /** Kısa isim veya kod */
  shortName: string;
  /** Miktar birimi (ör. "kg", "adet") */
  amountUnit: string;
  /** Fiyat (TL cinsinden) */
  priceTlMicro: number; // örn: 12.345678 TL -> 12_345_678
  /** Fiyat (USD/Dolar cinsinden) */
  priceDollarMicro: number; // örn: 1.990000 USD -> 1_990_000
}

/** İşlem kaydı (alım/satım vb.) */
export interface Transaction {
  /** Benzersiz işlem kimliği */
  id: number;
  /** İşleme ait kişi/hesap kimliği */
  personId: number;
  /** İşleme konu ürünün kimliği */
  productId: number;
  /** İşlem miktarı */
  amount: number;
  /** İşlem miktarının birimi */
  amountUnit: string;
  /** İşlem maliyeti (TL) */
  costTl: number;
  /** İşlem maliyeti (USD/Dolar) */
  costDollar: number;
  /** İşlem türü */
  type: 'buy' | 'sell';
  /** Oluşturulma tarihi (ISO string) */
  createDate: string;
}

/** Stok bilgisi */
export interface Stock {
  /** Benzersiz stok kaydı kimliği */
  id: number;
  /** Stok ile ilişkili kişi/hesap kimliği */
  personId: number;
  /** Stoktaki ürünün kimliği */
  productId: number;
  /** Mevcut miktar */
  currentAmount: number;
  /** Medyan maliyet (TL) */
  medianCostTl: number;
  /** Medyan maliyet (USD/Dolar) */
  medianCostDollar: number;
  /** Medyan satış fiyatı (TL) */
  medianSellTl: number;
  /** Medyan satış fiyatı (USD/Dolar) */
  medianSellDollar: number;
  /** Stok kaydının aktifliği */
  isActive: boolean;
}