import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import {
  ConfiguracionComponent, PerfilComponent, SidenavComponent,
  SigninComponent, SignupComponent, SuscripcionesComponent
} from './components';
import { CoreRoutingModule } from './core-routing.module';
import { AdministradorGuard, AdministradorModeradorGuard, AuthGuard, NoAuthGuard } from './guards';
import { SolicitudHttpInterceptor } from './interceptors';
import {
  AuthService, CaracterService, CuentaService, EntidadService, EventoService,
  LugarService, PersonaService, RolService, TemaService, TipoActoCultoService,
  TipoBandaService, TipoEntidadService, TitularService, TokenService,
  UsuarioService
} from './services';

@NgModule({
  declarations: [
    ConfiguracionComponent,
    PerfilComponent,
    SidenavComponent,
    SigninComponent,
    SignupComponent,
    SuscripcionesComponent,
  ],
  imports: [
    HttpClientModule,
    RouterModule,
    SharedModule,
    CoreRoutingModule,
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AdministradorGuard,
    AdministradorModeradorGuard,
    AuthGuard,
    NoAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: SolicitudHttpInterceptor, multi: true },
    AuthService,
    CaracterService,
    CuentaService,
    EntidadService,
    EventoService,
    LugarService,
    PersonaService,
    RolService,
    TemaService,
    TipoActoCultoService,
    TipoBandaService,
    TipoEntidadService,
    TitularService,
    TokenService,
    UsuarioService
  ],
})
export class CoreModule {
  constructor (@Optional() @SkipSelf() parentModule?: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule ya está cargado. Impórtalo únicamente en el AppModule.');
    }
  }
}
