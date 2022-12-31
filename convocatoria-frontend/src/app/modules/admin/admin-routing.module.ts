import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdministradorGuard, AdministradorModeradorGuard } from '../../core/guards';
import { AppConstants as AC } from '../../shared/constants';
import { SeguimientoComponent } from './components/dashboards';
import {
    CaracterListadoComponent, EntidadListadoComponent, EventoListadoComponent,
    LugarListadoComponent, PersonaListadoComponent, TipoActoCultoListadoComponent,
    TipoBandaListadoComponent, TipoEntidadListadoComponent, TitularListadoComponent,
    UsuarioListadoComponent
} from './components/listados';

const routes: Routes = [
  {
    path: '',
    children: [
      { path: AC.CARACTERES_ROUTE, canActivate: [AdministradorModeradorGuard], component: CaracterListadoComponent },
      { path: AC.ENTIDADES_ROUTE, canActivate: [AdministradorModeradorGuard], component: EntidadListadoComponent },
      { path: AC.EVENTOS_ROUTE, canActivate: [AdministradorModeradorGuard], component: EventoListadoComponent },
      { path: AC.LUGARES_ROUTE, canActivate: [AdministradorModeradorGuard], component: LugarListadoComponent },
      { path: AC.PERSONAS_ROUTE, canActivate: [AdministradorModeradorGuard], component: PersonaListadoComponent },
      { path: AC.SEGUIMIENTO_ROUTE, canActivate: [AdministradorModeradorGuard], component: SeguimientoComponent },
      { path: AC.TIPOS_ACTO_CULTO_ROUTE, canActivate: [AdministradorModeradorGuard], component: TipoActoCultoListadoComponent },
      { path: AC.TIPOS_BANDA_ROUTE, canActivate: [AdministradorModeradorGuard], component: TipoBandaListadoComponent },
      { path: AC.TIPOS_ENTIDAD_ROUTE, canActivate: [AdministradorModeradorGuard], component: TipoEntidadListadoComponent },
      { path: AC.TITULARES_ROUTE, canActivate: [AdministradorModeradorGuard], component: TitularListadoComponent },
      { path: AC.USUARIOS_ROUTE, canActivate: [AdministradorGuard], component: UsuarioListadoComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
