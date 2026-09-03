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
import { Router } from '@angular/router';

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

  copyLabel = 'Copy Result';
  showSettings = false;
  totalRecords = 0;
  lastUpdate = '-';

  constructor(
    private rateService: RateService,
    private excelService: ExcelService,
    private dbService: IndexedDbService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    const allData = await this.rateService.getAllRates();

    if (allData.length === 0) {
      await this.router.navigate(['/']);
      return;
    }

    this.sqmms = [...new Set(
      allData.map(x => x.sqmm)
    )].sort((a, b) => a - b);

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

  async copyResult(): Promise<void> {
    if (!this.result) {
      return;
    }

    const textToCopy = [
      'Cable Rate',
      `SQMM : ${this.result.sqmm}`,
      `Core : ${this.result.core}`,
      `Metal : ${this.result.metal}`,
      `Type : ${this.result.type}`,
      `Colour : ${this.result.colour}`,
      `Rate : ₹ ${this.result.rate}`
    ].join('\n');

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = textToCopy;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }

      this.copyLabel = 'Copied!';
    } catch (error) {
      this.copyLabel = 'Copy failed';
    }

    setTimeout(() => {
      this.copyLabel = 'Copy Result';
    }, 1500);
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