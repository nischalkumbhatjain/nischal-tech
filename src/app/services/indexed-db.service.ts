import Dexie, { Table } from 'dexie';
import { Injectable } from '@angular/core';
import { CableRate } from '../models/cable-rate.model';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService extends Dexie {

  cableRates!: Table<CableRate, number>;

  constructor() {
    super('NischalTechDB');

    this.version(1).stores({
      cableRates: '++id,sqmm,core,metal,type,colour,rate'
    });
  }

  async saveRates(data: CableRate[]): Promise<void> {
    await this.cableRates.clear();
    await this.cableRates.bulkAdd(data);
  }

  async getAllRates(): Promise<CableRate[]> {
    return await this.cableRates.toArray();
  }

  async hasData(): Promise<boolean> {
    const count = await this.cableRates.count();
    return count > 0;
  }

  async clearRates(): Promise<void> {
    await this.cableRates.clear();
  }
}