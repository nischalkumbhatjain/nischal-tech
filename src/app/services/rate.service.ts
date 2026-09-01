import { Injectable } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';
import { CableRate } from '../models/cable-rate.model';

@Injectable({
  providedIn: 'root'
})
export class RateService {

  constructor(
    private dbService: IndexedDbService
  ) { }

  async getAllRates(): Promise<CableRate[]> {
    return await this.dbService.getAllRates();
  }

  async getCores(): Promise<number[]> {

    const data = await this.dbService.getAllRates();

    return [...new Set(data.map(x => x.core))]
      .sort((a, b) => a - b);
  }

  async getSqmm(core: number): Promise<number[]> {
    const data = await this.dbService.getAllRates();

    const filtered = data.filter(
      x => Number(x.core) === Number(core)
    );

    return [...new Set(filtered.map(x => x.sqmm))]
      .sort((a, b) => a - b);
  }

  async getMetals(
    core: number,
    sqmm: number
  ): Promise<string[]> {
    const data = await this.dbService.getAllRates();

    const filtered = data.filter(x =>
      Number(x.core) === Number(core) &&
      Number(x.sqmm) === Number(sqmm)
    );

    return [
      ...new Set(filtered.map(x => x.metal))
    ];
  }

  async getTypes(
    core: number,
    sqmm: number,
    metal: string
  ): Promise<string[]> {
    const data = await this.dbService.getAllRates();

    const filtered = data.filter(x =>
      Number(x.core) === Number(core) &&
      Number(x.sqmm) === Number(sqmm) &&
      String(x.metal).trim() === String(metal).trim()
    );

    return [
      ...new Set(filtered.map(x => x.type))
    ];
  }

  async getColours(
    core: number,
    sqmm: number,
    metal: string,
    type: string
  ): Promise<string[]> {
    const data = await this.dbService.getAllRates();

    const filtered = data.filter(x =>
      Number(x.core) === Number(core) &&
      Number(x.sqmm) === Number(sqmm) &&
      String(x.metal).trim().toLowerCase() ===
      String(metal).trim().toLowerCase() &&
      String(x.type).trim().toLowerCase() ===
      String(type).trim().toLowerCase()
    );

    return [
      ...new Set(filtered.map(x => x.colour))
    ];
  }

  async getFinalRate(
    core: number,
    sqmm: number,
    metal: string,
    type: string,
    colour: string
  ): Promise<CableRate | null> {

    const data = await this.dbService.getAllRates();

    return data.find(x =>
      Number(x.core) === Number(core) &&
      Number(x.sqmm) === Number(sqmm) &&
      String(x.metal).trim().toLowerCase() === String(metal).trim().toLowerCase() &&
      String(x.type).trim().toLowerCase() === String(type).trim().toLowerCase() &&
      String(x.colour).trim().toLowerCase() === String(colour).trim().toLowerCase()
    ) || null;
  }
}