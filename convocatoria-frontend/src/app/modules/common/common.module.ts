import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { CommonRoutingModule } from './common-routing.module';
import { DashboardComunComponent } from './components/dashboards';

@NgModule({
  declarations: [
    // Dashboards
    DashboardComunComponent,
  ],
  imports: [
    SharedModule,
    CommonRoutingModule,
  ]
})
export class CommonModule {}
