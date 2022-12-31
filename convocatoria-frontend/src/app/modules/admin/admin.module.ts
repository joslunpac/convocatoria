import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared';
import { AdminRoutingModule } from './admin-routing.module';
import { SeguimientoComponent } from './components/dashboards';
import {
  CaracterDetalleComponent, EntidadDetalleComponent, EventoDetalleComponent,
  LugarDetalleComponent, PersonaDetalleComponent, TipoActoCultoDetalleComponent,
  TipoBandaDetalleComponent, TipoEntidadDetalleComponent, TitularDetalleComponent,
  UsuarioDetalleComponent
} from './components/detalles';
import {
  DialogoActualizarPasswordComponent, DialogoConfirmacionEventosComponent
} from './components/dialogos';
import {
  CaracterListadoComponent, EntidadListadoComponent, EventoListadoComponent,
  LugarListadoComponent, PersonaListadoComponent, TipoActoCultoListadoComponent,
  TipoBandaListadoComponent, TipoEntidadListadoComponent, TitularListadoComponent,
  UsuarioListadoComponent
} from './components/listados';

@NgModule({
  declarations: [
    // Dashboards
    SeguimientoComponent,
    // Detalles
    CaracterDetalleComponent,
    EntidadDetalleComponent,
    EventoDetalleComponent,
    LugarDetalleComponent,
    PersonaDetalleComponent,
    TipoActoCultoDetalleComponent,
    TipoBandaDetalleComponent,
    TipoEntidadDetalleComponent,
    TitularDetalleComponent,
    UsuarioDetalleComponent,
    // Diálogos
    DialogoActualizarPasswordComponent,
    DialogoConfirmacionEventosComponent,
    // Listados
    CaracterListadoComponent,
    EntidadListadoComponent,
    EventoListadoComponent,
    LugarListadoComponent,
    PersonaListadoComponent,
    TipoActoCultoListadoComponent,
    TipoBandaListadoComponent,
    TipoEntidadListadoComponent,
    TitularListadoComponent,
    UsuarioListadoComponent
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
  ]
})
export class AdminModule {}
