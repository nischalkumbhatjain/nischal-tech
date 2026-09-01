import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UploadComponent } from './pages/upload/upload.component';
import { WizardComponent } from './pages/wizard/wizard.component';
import { ResultComponent } from './pages/result/result.component';

const routes: Routes = [
  {
    path: '',
    component: UploadComponent
  },
  {
    path: 'wizard',
    component: WizardComponent
  },
  {
    path: 'result',
    component: ResultComponent
  },
  {
    path: '**',
    redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }