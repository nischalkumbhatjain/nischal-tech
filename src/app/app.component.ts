import { Component } from '@angular/core';
import { CountApiService } from './services/count-api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Nischal Tech';

  constructor(private readonly countApiService: CountApiService) { }

  ngOnInit(): void {
    void this.countApiService.trackVisit();
  }
}