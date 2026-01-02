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