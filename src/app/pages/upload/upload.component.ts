import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ExcelService } from '../../services/excel.service';
import { IndexedDbService } from '../../services/indexed-db.service';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.scss']
})
export class UploadComponent implements OnInit {

  loading = true;

  constructor(
    private dbService: IndexedDbService,
    private excelService: ExcelService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {

    const hasData = await this.dbService.hasData();

    if (hasData) {
      this.router.navigate(['/wizard']);
      return;
    }

    this.loading = false;
  }

  async onFileSelected(event: any): Promise<void> {

    const file = event.target.files[0];

    if (!file) {
      return;
    }

    const rates =
      await this.excelService.parseExcel(file);

    await this.dbService.saveRates(rates);

    this.router.navigate(['/wizard']);
  }

}