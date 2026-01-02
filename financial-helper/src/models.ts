export interface Person {
  id?: number;
  name: string;
}

/** Ürün bilgisi */
export interface Product {
  /** Benzersiz ürün kimliği (UUID veya string id) */
  id: string;
  /** Ürün tam adı */
  name: string;
  /** Kısa isim veya kod */
  shortName: string;
  /** Miktar birimi (ör. "kg", "adet") */
  amountUnit: string;
  /** Fiyat (TL cinsinden) */
  priceTl: number;
  /** Fiyat (USD/Dolar cinsinden) */
  priceDollar: number;
}

/** İşlem kaydı (alım/satım vb.) */
export interface Transaction {
  /** Benzersiz işlem kimliği */
  id: string;
  /** İşleme ait kişi/hesap kimliği */
  personId: string;
  /** İşleme konu ürünün kimliği */
  productId: string;
  /** İşlem miktarı */
  amount: number;
  /** İşlem miktarının birimi */
  amountUnit: string;
  /** İşlem maliyeti (TL) */
  costTl: number;
  /** İşlem maliyeti (USD/Dolar) */
  costDollar: number;
  /** Oluşturulma tarihi (ISO string) */
  createDate: string;
}

/** Stok bilgisi */
export interface Stock {
  /** Benzersiz stok kaydı kimliği */
  id: string;
  /** Stok ile ilişkili kişi/hesap kimliği */
  personId: string;
  /** Stoktaki ürünün kimliği */
  productId: string;
  /** Mevcut miktar */
  currentAmount: number;
  /** Medyan maliyet (TL) */
  medianCostTl: number;
  /** Medyan maliyet (USD/Dolar) */
  medianCostDollar: number;
  /** Stok kaydının aktifliği */
  isActive: boolean;
}