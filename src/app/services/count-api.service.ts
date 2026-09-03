import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { timeout } from 'rxjs/operators';

interface CountApiResponse {
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class CountApiService {
  private readonly hitUrl = 'https://countapi.mileshilliard.com/api/v1/hit/khwaab-solution';
  private readonly getUrl = 'https://countapi.mileshilliard.com/api/v1/get/khwaab-solution';
  private readonly pendingHitsKey = 'khwaab-solution-pending-visits';
  private flushPromise: Promise<void> | null = null;

  constructor(private readonly http: HttpClient) {
    window.addEventListener('online', () => {
      void this.flushPendingHits();
    });
  }

  async trackVisit(): Promise<void> {
    this.setPendingHits(this.getPendingHits() + 1);
    await this.flushPendingHits();
  }

  async getVisitCount(): Promise<number> {
    const response = await firstValueFrom(
      this.http.get<CountApiResponse>(this.getUrl).pipe(timeout(10000))
    );
    return response.value;
  }

  private async flushPendingHits(): Promise<void> {
    if (this.flushPromise) {
      return this.flushPromise;
    }

    this.flushPromise = this.sendPendingHits().finally(() => {
      this.flushPromise = null;
    });

    return this.flushPromise;
  }

  private async sendPendingHits(): Promise<void> {
    if (!navigator.onLine) {
      return;
    }

    while (this.getPendingHits() > 0) {
      try {
        await firstValueFrom(this.http.get(this.hitUrl).pipe(timeout(10000)));
        this.setPendingHits(this.getPendingHits() - 1);
      } catch (error: unknown) {
        console.warn('Unable to synchronize visit count; it will be retried when online.', error);
        return;
      }
    }
  }

  private getPendingHits(): number {
    const storedValue = localStorage.getItem(this.pendingHitsKey);
    const pendingHits = storedValue === null ? 0 : Number.parseInt(storedValue, 10);
    return Number.isFinite(pendingHits) && pendingHits > 0 ? pendingHits : 0;
  }

  private setPendingHits(pendingHits: number): void {
    if (pendingHits === 0) {
      localStorage.removeItem(this.pendingHitsKey);
      return;
    }

    localStorage.setItem(this.pendingHitsKey, String(pendingHits));
  }
}
