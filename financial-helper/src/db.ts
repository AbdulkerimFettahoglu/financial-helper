import Dexie from 'dexie';
import type { Person } from './models';

export class MySimpleDB extends Dexie {
    Persons!: Dexie.Table<Person, number>;

    constructor() {
        super('MySimpleDB');
        this.version(1).stores({
            Persons: '++id, name'
        });
        this.open().catch((err) => {
            alert('DB open error\n' + err);
        });
    }

    async createPersonRecord(name: string) {
        const id = await this.Persons.add({ name: name });
        return { created: true, id, person: { id, name: name } as Person };
    }
}

export const db = new MySimpleDB();