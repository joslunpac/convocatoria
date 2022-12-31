import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppConstants as AC } from '../shared/constants';
import {
  ConfiguracionComponent, PerfilComponent, SidenavComponent,
  SigninComponent, SignupComponent, SuscripcionesComponent
} from './components';
import { AuthGuard, NoAuthGuard } from './guards';

const commonModule = () => import('../modules/common/common.module').then(m => m.CommonModule);
const adminModule = () => import('../modules/admin/admin.module').then(m => m.AdminModule);

const routes: Routes = [
  {
    path: '', component: SidenavComponent,
    children: [
      { path: '', loadChildren: commonModule },
      { path: AC.PERFIL_ROUTE, canActivate: [AuthGuard], component: PerfilComponent },
      { path: AC.SUSCRIPCIONES_ROUTE, canActivate: [AuthGuard], component: SuscripcionesComponent },
      { path: AC.CONFIGURACION_ROUTE, canActivate: [AuthGuard], component: ConfiguracionComponent },
      { path: AC.ADMINISTRACION_ROUTE, canActivate: [AuthGuard], loadChildren: adminModule },
    ]
  },
  { path: AC.SIGNIN_ROUTE, canActivate: [NoAuthGuard], component: SigninComponent },
  { path: AC.SIGNUP_ROUTE, canActivate: [NoAuthGuard], component: SignupComponent },
  { path: AC.NO_ENCONTRADO_ROUTE, redirectTo: AC.HOME_ROUTE, pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class CoreRoutingModule {}
