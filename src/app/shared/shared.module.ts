import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { OrderByPipe } from './orderby.pipe';

import { LoadingSpinnerComponent } from '../ui/loading-spinner/loading-spinner.component';

@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    LoadingSpinnerComponent,
    // OrderByPipe,
  ],
  exports: [
    LoadingSpinnerComponent,
  ],
})
export class SharedModule { }
