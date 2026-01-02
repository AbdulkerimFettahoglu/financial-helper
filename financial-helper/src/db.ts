import Dexie from 'dexie';
import type { Person } from './models';

export class MySimpleDB extends Dexie {
    Persons!: Dexie.Table<Person, number>;

    constructor() {
        super('MySimpleDB');
        this.version(1).stores({
            Persons: '++id, name',
            Products: '++id, name, shortName, amountUnit, priceTl, priceDollar',
        });
        this.open().catch((err) => {
            alert('DB open error\n' + err);
        });
    }

}

export const db = new MySimpleDB();