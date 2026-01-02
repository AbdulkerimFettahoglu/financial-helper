// Örnek: personService.ts
import Dexie from "dexie";
import type { Person } from "./models";

export class PersonService {
    private Persons: Dexie.Table<Person, number>;

    constructor(db: Dexie) {
        // db.table adı senin DB schema'na göre değişebilir
        this.Persons = db.table("Persons");
    }

    // Mevcut create fonksiyonun (senin verdiğinle eşdeğer)
    async createPersonRecord(name: string) {
        const id = await this.Persons.add({ name });
        return { created: true, id, person: { id, name } as Person };
    }

    // 1) Tüm Person kayıtlarını dönen metot
    async getAllPersons(): Promise<Person[]> {
        return await this.Persons.toArray();
    }

    // 2) Verilen id'ye karşılık gelen Person kaydını dönen metot
    async getPersonById(id: number): Promise<Person | undefined> {
        if (id == null) throw new Error("id gerekli");
        return await this.Persons.get(id);
    }

    // 3a) Kısmi güncelleme (sadece verilen alanları günceller)
    // returns { updated: boolean, person?: Person, message?: string }
    async updatePersonPartial(id: number, updates: Partial<Person>) {
        if (id == null) throw new Error("id gerekli");
        const updatedCount = await this.Persons.update(id, updates);
        if (updatedCount === 0) {
            return { updated: false, message: "Kayıt bulunamadı" };
        }
        const person = await this.Persons.get(id);
        return { updated: true, person };
    }

    // 3b) Tüm nesneyi koyma/replace (put) — id varsa günceller, yoksa ekler
    // returns { replaced: boolean, id: number, person: Person }
    async replacePersonRecord(person: Person) {
        if (!person.id) throw new Error("Güncelleme için person.id gerekli");
        const id = await this.Persons.put(person); // put: add veya replace
        const saved = await this.Persons.get(id);
        return { replaced: true, id, person: saved as Person };
    }
}