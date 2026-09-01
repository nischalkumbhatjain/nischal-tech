import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RateService } from '../../services/rate.service';
import { CableRate } from '../../models/cable-rate.model';

@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {

  result: CableRate | null = null;

  constructor(
    private rateService: RateService,
    private router: Router
  ) { }

  async ngOnInit(): Promise<void> {
    const state: any = history.state;

    this.result = await this.rateService.getFinalRate(
      state.core,
      state.sqmm,
      state.metal,
      state.type,
      state.colour
    );
  }

  copyRate(): void {

    if (!this.result) {
      return;
    }

    navigator.clipboard.writeText(
      this.result.rate.toString()
    );

    alert('Rate Copied');
  }

  newSearch(): void {
    this.router.navigate(['/wizard']);
  }
}