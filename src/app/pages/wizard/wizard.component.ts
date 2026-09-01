import { Component, OnInit } from '@angular/core';
import { RateService } from '../../services/rate.service';
import { CableRate } from '../../models/cable-rate.model';
import {
  trigger,
  transition,
  style,
  animate
} from '@angular/animations';
import { ExcelService } from 'src/app/services/excel.service';
import { IndexedDbService } from 'src/app/services/indexed-db.service';

@Component({
  selector: 'app-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  animations: [
    trigger('stepAnimation', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateX(40px)'
        }),
        animate(
          '250ms ease-out',
          style({
            opacity: 1,
            transform: 'translateX(0)'
          })
        )
      ])
    ])
  ]
})
export class WizardComponent implements OnInit {

  currentStep = 1;

  sqmms: number[] = [];
  cores: number[] = [];
  metals: string[] = [];
  types: string[] = [];
  colours: string[] = [];

  selectedSqmm!: number;
  selectedCore!: number;
  selectedMetal!: string;
  selectedType!: string;
  selectedColour!: string;

  result: CableRate | null = null;

  showSettings = false;
  totalRecords = 0;
  lastUpdate = '-';

  constructor(
    private rateService: RateService,
    private excelService: ExcelService,
    private dbService: IndexedDbService
  ) { }

  async ngOnInit(): Promise<void> {
    this.sqmms = await this.getAllSqmm();

    const allData = await this.rateService.getAllRates();

    this.totalRecords = allData.length;
    this.lastUpdate = localStorage.getItem('lastRateUpdate') || '-';
  }

  async getAllSqmm(): Promise<number[]> {
    const data = await this.rateService.getAllRates();

    return [...new Set(
      data.map(x => x.sqmm)
    )].sort((a, b) => a - b);
  }

  async selectSqmm(value: number) {

    this.selectedSqmm = value;

    const data = await this.rateService.getAllRates();

    this.cores = [
      ...new Set(
        data
          .filter(x => Number(x.sqmm) === Number(value))
          .map(x => x.core)
      )
    ];

    this.currentStep = 2;
  }

  async selectCore(value: number) {

    this.selectedCore = value;

    this.metals = await this.rateService.getMetals(
      this.selectedCore,
      this.selectedSqmm
    );

    this.currentStep = 3;
  }

  async selectMetal(value: string) {

    this.selectedMetal = value;

    this.types = await this.rateService.getTypes(
      this.selectedCore,
      this.selectedSqmm,
      this.selectedMetal
    );

    this.currentStep = 4;
  }

  async selectType(value: string) {

    this.selectedType = value;

    this.colours = await this.rateService.getColours(
      this.selectedCore,
      this.selectedSqmm,
      this.selectedMetal,
      this.selectedType
    );

    this.currentStep = 5;
  }

  async selectColour(value: string) {

    this.selectedColour = value;

    this.result = await this.rateService.getFinalRate(
      this.selectedCore,
      this.selectedSqmm,
      this.selectedMetal,
      this.selectedType,
      this.selectedColour
    );

    this.currentStep = 6;
  }

  startOver(): void {

    this.currentStep = 1;

    this.selectedSqmm = 0;
    this.selectedCore = 0;
    this.selectedMetal = '';
    this.selectedType = '';
    this.selectedColour = '';

    this.result = null;
  }

  openSettings(): void {
    this.showSettings = true;
  }

  closeSettings(): void {
    this.showSettings = false;
  }

  async updateRateSheet(event: any): Promise<void> {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const rates =
      await this.excelService.parseExcel(file);

    await this.dbService.saveRates(rates);

    this.totalRecords = rates.length;

    const updatedDate =
      new Date().toLocaleString();

    localStorage.setItem(
      'lastRateUpdate',
      updatedDate
    );

    this.lastUpdate = updatedDate;

    alert('Rate Sheet Updated');

    this.closeSettings();
  }
}