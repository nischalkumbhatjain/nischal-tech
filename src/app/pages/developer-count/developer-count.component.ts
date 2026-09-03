import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CountApiService } from '../../services/count-api.service';

@Component({
  selector: 'app-developer-count',
  templateUrl: './developer-count.component.html',
  styleUrls: ['./developer-count.component.scss']
})
export class DeveloperCountComponent {
  readonly accessToken = 'khwaab-admin';
  count: number | null = null;
  loading = false;
  error = '';
  authorized = false;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly countApiService: CountApiService
  ) { }

  ngOnInit(): void {
    this.authorized = this.route.snapshot.queryParamMap.get('token') === this.accessToken;
    if (this.authorized) {
      void this.loadCount();
    }
  }

  async loadCount(): Promise<void> {
    this.loading = true;
    this.error = '';

    try {
      this.count = await this.countApiService.getVisitCount();
    } catch (error: unknown) {
      this.error = 'Unable to load the visit count. Please try again when online.';
      console.error('Unable to load developer visit count.', error);
    } finally {
      this.loading = false;
    }
  }
}
