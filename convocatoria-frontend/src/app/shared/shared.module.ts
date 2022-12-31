import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AccesoDirectoComponent, DialogoConfirmacionComponent, MensajeErrorComponent } from './components';
import { MaterialModule } from './material.module';
import {
  AvatarSeleccionadoPipe, DuracionTipoActoCultoPipe, EliminarPrefijoPipe,
  HoraSinSegundosPipe, NombreEntidadCompletoPipe, NombreLugarCompletoPipe,
  NombrePersonaConProfesionPipe, NombreTitularConEntidadPipe,
  NombreUsuarioCompletoPipe, PersonasEventoPipe, RutaAvatarEntidadPipe,
  RutaAvatarTitularPipe, RutaAvatarUsuarioPipe, TitularesEventoPipe
} from './pipes';

@NgModule({
  declarations: [
    AccesoDirectoComponent,
    DialogoConfirmacionComponent,
    MensajeErrorComponent,
    AvatarSeleccionadoPipe,
    DuracionTipoActoCultoPipe,
    EliminarPrefijoPipe,
    HoraSinSegundosPipe,
    NombreEntidadCompletoPipe,
    NombreLugarCompletoPipe,
    NombrePersonaConProfesionPipe,
    NombreTitularConEntidadPipe,
    NombreUsuarioCompletoPipe,
    PersonasEventoPipe,
    RutaAvatarEntidadPipe,
    RutaAvatarTitularPipe,
    RutaAvatarUsuarioPipe,
    TitularesEventoPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AccesoDirectoComponent,
    DialogoConfirmacionComponent,
    MensajeErrorComponent,
    MaterialModule,
    AvatarSeleccionadoPipe,
    DuracionTipoActoCultoPipe,
    EliminarPrefijoPipe,
    HoraSinSegundosPipe,
    NombreEntidadCompletoPipe,
    NombreLugarCompletoPipe,
    NombrePersonaConProfesionPipe,
    NombreTitularConEntidadPipe,
    NombreUsuarioCompletoPipe,
    PersonasEventoPipe,
    RutaAvatarEntidadPipe,
    RutaAvatarTitularPipe,
    RutaAvatarUsuarioPipe,
    TitularesEventoPipe,
  ]
})
export class SharedModule {}
