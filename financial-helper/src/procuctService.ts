/**
 * productService.ts
 *
 * ProductService sınıfı PersonService ile aynı senaryoları karşılayacak şekilde hazırlandı.
 * Kullanım:
 *  - Dexie DB örneğini konstruköre verin (db.table adı 'products' olmalı veya constructor içinde uygun tabloyu seçin).
 *  - Metodlar: createProductRecord, getAllProducts, getProductById, updateProductPartial, replaceProductRecord
 *
 * Örnek DB schema: db.version(1).stores({ products: "++id,name,price" });
 */

import Dexie from "dexie";
import type { Product } from "./models";

export class ProductService {
  private Products: Dexie.Table<Product, number>;
  // mikro birim için sabit
  static MICRO = 1_000_000;

  constructor(db: Dexie) {
    this.Products = db.table("Products");
  }

  //
  // Helper / parsing / formatting fonksiyonları (6 ondalık hassasiyet)
  //

  // Safely parse a decimal (string or number) into micro-units (integer).
  // Accepts values like "12.345678", 12.345678, "12", "-0.000001", "1e-3" etc.
  // Rounds/truncates by using string-based padding/truncation so we avoid most float artifacts.
  static parseDecimalToMicro(value: string | number): number {
    if (value == null || value === "") throw new Error("Geçersiz değer");
    // Normalize number input (to avoid exponential forms): convert number -> string via toFixed(6)
    let s = typeof value === "number" ? Number(value).toString() : String(value);
    // If the string is in exponential notation or Number(value) gives more reliable repr, use toFixed
    if (/[eE]/.test(s)) {
      // use Number and toFixed to expand exponent to decimal with 6 digits (rounding)
      s = Number(value).toFixed(6);
    }
    s = s.trim();
    const negative = s.startsWith("-");
    if (negative) s = s.slice(1);

    const parts = s.split(".");
    const wholePart = parts[0] === "" ? "0" : parts[0];
    const fracPartRaw = parts[1] || "";

    // pad or cut fractional part to exactly 6 digits (rounding is prefered but here we truncate then consider next digit)
    // To do rounding-to-nearest at 6 decimals reliably, inspect the 7th digit if present.
    let frac = fracPartRaw.padEnd(ProductService.MICRO.toString().length - 1, "0"); // pad to at least 6
    // ensure at least 7 digits to check rounding digit
    const desired = 6;
    frac = (frac + "0".repeat(Math.max(0, desired + 1 - frac.length))).slice(0, desired + 1); // at least desired+1
    const mainFrac = frac.slice(0, desired);
    const roundDigit = Number(frac.charAt(desired)) || 0;

    // Build micro as integers using safe integer operations on string parts
    const wholeNum = Number(wholePart || "0");
    if (!Number.isFinite(wholeNum)) throw new Error("Geçersiz sayı");

    let micro = wholeNum * ProductService.MICRO + Number(mainFrac || "0");

    // Round half up based on the (desired+1)th digit
    if (roundDigit >= 5) {
      micro += 1;
    }

    return negative ? -micro : micro;
  }

  // Convert major+fraction parts to micro. fractionDigits indicates how many digits the fraction parameter represents.
  // Example: tlToMicro(12, 345678, 6) => 12.345678 -> 12_345_678
  // If fractionDigits < 6, it will be scaled (e.g. tlToMicro(12, 34, 2) => 12.34 -> 12_340_000)
  static tlToMicro(tlWhole: number, tlFraction = 0, fractionDigits = 6): number {
    if (!Number.isFinite(tlWhole) || !Number.isFinite(tlFraction)) throw new Error("Geçersiz sayı");
    const sign = tlWhole < 0 || tlFraction < 0 ? -1 : 1;
    const whole = Math.trunc(Math.abs(tlWhole));
    const frac = Math.trunc(Math.abs(tlFraction));
    if (fractionDigits < 0) throw new Error("fractionDigits negatif olamaz");
    // scale fractional part to 6 digits
    let scaledFrac: number;
    if (fractionDigits === 6) {
      scaledFrac = frac;
    } else if (fractionDigits < 6) {
      scaledFrac = frac * Math.pow(10, 6 - fractionDigits);
    } else {
      // fractionDigits > 6 -> need to round according to extra digits
      const str = String(frac).padStart(fractionDigits, "0");
      const main = Number(str.slice(0, 6));
      const nextDigit = Number(str.charAt(6)) || 0;
      scaledFrac = main + (nextDigit >= 5 ? 1 : 0);
    }
    return sign * (whole * ProductService.MICRO + scaledFrac);
  }

  static dollarToMicro(dWhole: number, dFraction = 0, fractionDigits = 6): number {
    // Same semantics as tlToMicro
    return ProductService.tlToMicro(dWhole, dFraction, fractionDigits);
  }

  // Convert micro back to { whole, fraction } where fraction has exactly 6 digits (0..999999)
  static microToParts(micro: number) {
    const negative = micro < 0;
    const abs = Math.abs(Math.trunc(micro));
    const whole = Math.trunc(abs / ProductService.MICRO);
    const fraction = abs % ProductService.MICRO;
    return { negative, whole, fraction }; // fraction is 0..999999
  }

  // Format micro to a string with 6 decimals: "12.345678 TL"
  static formatTlFromMicro(micro: number) {
    const { negative, whole, fraction } = ProductService.microToParts(micro);
    const sign = negative ? "-" : "";
    return `${sign}${whole}.${fraction.toString().padStart(6, "0")} TL`;
  }

  static formatDollarFromMicro(micro: number) {
    const { negative, whole, fraction } = ProductService.microToParts(micro);
    const sign = negative ? "-" : "";
    return `${sign}$${whole}.${fraction.toString().padStart(6, "0")}`;
  }

  //
  // CRUD methods (validasyon micro birimine göre)
  //

  /**
   * Yeni ürün oluşturur.
   * Parametre: product (id dışındaki alanlar)
   * Döner: { created: true, id, product }
   */
  async createProductRecord(product: Omit<Product, "id">) {
    // validation
    if (!product?.name) throw new Error("product.name gerekli");
    if (!product?.shortName) throw new Error("product.shortName gerekli");
    if (!product?.amountUnit) throw new Error("product.amountUnit gerekli");

    if (!Number.isInteger(product.priceTlMicro)) throw new Error("priceTlMicro tam sayı olmalı");
    if (!Number.isInteger(product.priceDollarMicro)) throw new Error("priceDollarMicro tam sayı olmalı");

    const id = await this.Products.add(product as Product);
    return { created: true, id, product: { ...product, id } as Product };
  }

  /**
   * Tüm ürünleri döner.
   */
  async getAllProducts(): Promise<Product[]> {
    return await this.Products.toArray();
  }

  /**
   * Verilen id'ye karşılık gelen ürünü döner (veya undefined).
   */
  async getProductById(id: number): Promise<Product | undefined> {
    if (id == null) throw new Error("id gerekli");
    return await this.Products.get(id);
  }

  /**
   * Kısmi güncelleme: sadece verilen alanları günceller.
   * updates içinde price alanları micro (tam sayı) olmalı
   * Döner: { updated: boolean, product?: Product, message?: string }
   */
  async updateProductPartial(id: number, updates: Partial<Product>) {
    if (id == null) throw new Error("id gerekli");
    const { id: _maybeId, ...rest } = updates as any;

    if ("priceTlMicro" in rest) {
      if (!Number.isInteger(rest.priceTlMicro)) throw new Error("priceTlMicro tam sayı olmalı");
    }
    if ("priceDollarMicro" in rest) {
      if (!Number.isInteger(rest.priceDollarMicro)) throw new Error("priceDollarMicro tam sayı olmalı");
    }

    const updatedCount = await this.Products.update(id, rest);
    if (updatedCount === 0) {
      return { updated: false, message: "Ürün bulunamadı" };
    }
    const product = await this.Products.get(id);
    return { updated: true, product };
  }

  /**
   * Tüm nesneyi koyma/replace (put) — id varsa günceller, yoksa ekler.
   * Güncelleme amacıyla çağrıldığında product.id zorunludur.
   * Döner: { replaced: true, id, product }
   */
  async replaceProductRecord(product: Product) {
    if (!product?.id) throw new Error("Güncelleme için product.id gerekli");
    // validation
    if (!product.name) throw new Error("product.name gerekli");
    if (!Number.isInteger(product.priceTlMicro)) throw new Error("priceTlMicro tam sayı olmalı");
    if (!Number.isInteger(product.priceDollarMicro)) throw new Error("priceDollarMicro tam sayı olmalı");

    const id = await this.Products.put(product);
    const saved = await this.Products.get(id);
    return { replaced: true, id, product: saved as Product };
  }
}