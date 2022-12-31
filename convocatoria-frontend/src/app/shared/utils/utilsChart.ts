export class UtilsChart {
  /**
   * Método encargado de aplicar formato a una cadena para usarla en el filtro de búsqueda de una tabla de resultados
   *
   * @param cadena Cadena a formatear
   */
  static formatearCadena(cadena: string): string {
    // Eliminamos los espacios en blanco
    cadena = cadena.trim();
    // Eliminamos los acentos
    cadena = cadena.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // Lo convertimos todo a minúsculas
    cadena = cadena.toLowerCase();

    return cadena;
  }

  /**
   * Método encargado de devolver undefined si la cadena es igual a cadena vacía
   *
   * @param cadena Cadena a comparar
   * @returns
   */
  static cadenaVaciaToUndenfined(cadena: any): string | undefined {
    return cadena == undefined || cadena == '' ? undefined : cadena;
  }

  /**
   * Método encargado de crear un objeto simple con un identificador
   *
   * @param id Identificador del nuevo objeto
   * @returns
   */
  static construirObjetoConId(id: any) {
    if (id == undefined) return undefined;

    return { id: id };
  }

  /**
   * Método encargado de construir el mensaje de confirmación
   *
   * @param objeto El objeto que se va a eliminar
   * @param masculino Si el objeto a eliminar es masculino o femenino
   * @param tipo Tipo de la confirmación. E: Eliminar
   * @returns
   */
  static construirConfirmacion(objeto: string, masculino: boolean = true, tipo: string = 'E'): string {
    let cadena = '';

    if (tipo == 'E') cadena += '¿Seguro que desea eliminar ' + (masculino ? 'el ': 'la ') + objeto.toLowerCase() + '?  Esta acción es irreversible.'

    return cadena;
  }
}
