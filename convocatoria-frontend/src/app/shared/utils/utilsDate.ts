import * as moment from 'moment';
import { AppConstants as AC } from '../constants';

export class UtilsDate {
  // Atributo para definir el formato de las fechas
  static formatoFechaServidor: string = 'YYYY-MM-DD';
  static formatoFechaAplicacion: string = 'DD-MM-YYYY';

  // Atributos para el calculo de la severidad
  // Fechas para enviarlas al servidor
  static fechaActualServidor = moment().format(this.formatoFechaServidor);
  static fechaMananaServidor = moment().add(1, 'days').format(this.formatoFechaServidor);

  static fechaPRGraveInicioServidor = moment().format(this.formatoFechaServidor);
  static fechaPRGraveFinServidor = moment().add(AC.N_REVISAR_GRAVE, 'days').format(this.formatoFechaServidor);
  static fechaPRModeradaInicioServidor = moment().add(AC.N_REVISAR_GRAVE + 1, 'days').format(this.formatoFechaServidor);
  static fechaPRModeradaFinServidor = moment().add(AC.N_REVISAR_MODERADA, 'days').format(this.formatoFechaServidor);
  static fechaPRLeveInicioServidor = moment().add(AC.N_REVISAR_MODERADA + 1, 'days').format(this.formatoFechaServidor);

  static fechaPDLeveInicioServidor = moment().add(AC.N_DUPLICAR_LEVE, 'days').format(this.formatoFechaServidor);
  static fechaPDModeradaFinServidor = moment().add(AC.N_DUPLICAR_LEVE + -1, 'days').format(this.formatoFechaServidor);
  static fechaPDModeradaInicioServidor = moment().add(AC.N_DUPLICAR_MODERADA, 'days').format(this.formatoFechaServidor);
  static fechaPDGraveFinServidor = moment().add(AC.N_DUPLICAR_MODERADA + -1, 'days').format(this.formatoFechaServidor);
  static fechaPDGraveInicioServidor = moment().add(AC.N_DUPLICAR_GRAVE, 'days').format(this.formatoFechaServidor);

  // Fechas para compararlas con la fecha del evento
  static fechaActualAplicacion = moment().startOf('day');

  static fechaPRGraveInicioAplicacion = moment().startOf('day');
  static fechaPRModeradaInicioAplicacion = moment().add(AC.N_REVISAR_GRAVE + 1, 'days').startOf('day');
  static fechaPRLeveInicioAplicacion = moment().add(AC.N_REVISAR_MODERADA + 1, 'days').startOf('day');

  static fechaPDGraveFinAplicacion = moment().add(AC.N_DUPLICAR_GRAVE, 'days').startOf('day');
  static fechaPDModeradaFinAplicacion = moment().add(AC.N_DUPLICAR_MODERADA, 'days').startOf('day');
  static fechaPDLeveFinAplicacion = moment().add(AC.N_DUPLICAR_LEVE, 'days').startOf('day');

  /**
   * Método encargado de comprobar si la fecha es hoy
   *
   * @param fecha Fecha a comprobar
   * @returns
   */
  static esHoy(fecha: string): boolean {
    // Establecemos la fecha del evento
    const fechaFormateada = moment(fecha).startOf('day');

    if (fechaFormateada.isSame(this.fechaActualAplicacion)) {
        return true;
    } else {
      return false;
    }
  }
}
