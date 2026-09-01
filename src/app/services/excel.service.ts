import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';
import { CableRate } from '../models/cable-rate.model';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  async parseExcel(file: File): Promise<CableRate[]> {

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: 'array'
    });

    const sheetName = workbook.SheetNames[0];

    const worksheet = workbook.Sheets[sheetName];

    const rawData: any[] = XLSX.utils.sheet_to_json(
      worksheet,
      {
        defval: ''
      }
    );

    return rawData.map(row => ({
      sqmm: Number(row['sqmm']),
      core: Number(row['core']),
      metal: String(row['metal']).trim(),
      type: String(row['type']).trim(),
      colour: String(row['colour']).trim(),
      rate: Number(row['rate'])
    }));
  }
}