import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { ApiConstants as APC, AppConstants as AC } from '../../shared/constants';
import { UtilsDate } from '../../shared/utils';
import { Evento, ResultadoEventos } from '../interfaces';

@Injectable()
export class EventoService {
  constructor(private http: HttpClient) {}

  /**
   * Método encargado de obtener el número de eventos hijos
   *
   * @param id Identificador del evento
   * @returns
   */
  countHijos(id: number): Observable<number> {
    return this.http.get<number>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_EVENTOS + '/' + `${id}` + '/hijos');
  }

  /**
   * Método encargado de obtener el listado completo de eventos con filtros
   *
   * @param priv Indica si hay que concatenarle a la url 'private/'
   * @param tipoBusqueda Tipo de búsqueda
   * @param fechaInicial Fecha mínima por la que buscar
   * @param fechaFinal Fecha máxima por la que buscar
   * @param idTipoActoCulto Identificador del tipo de acto o culto que debe ser el evento
   * @param idEntidadOrganizadora Identificador de la entidad organizadora a la que debe pertenecer el evento
   * @param idTitular Identificador del titular que debe participar en el evento
   * @param idPersona Identificador de la persona que debe participar en el evento
   * @param idLugar Identificador del lugar dónde se celebra el evento
   * @param tiposEntidadId Ids de los tipos de entidad que puede poseer el evento
   * @param caracteresId Ids de los carácteres que puede poseer el evento
   * @param sinCaracter Indica si el titular puede no poseer ningún carácter
   * @param noVisibles Indica si hay que mostrar únicamente los eventos no visibles
   * @param aplazados Indica si hay que mostrar únicamente los eventos aplazados
   * @param suspendidos Indica si hay que mostrar únicamente los eventos suspendidos
   * @param extraordinarios Indica si hay que mostrar únicamente los eventos extraordinarios
   * @param pendienteRevisar Indica si hay que mostrar únicamente los eventos pendientes de revisar
   * @param pendienteDuplicar Indica si hay que mostrar únicamente los eventos pendientes de duplicar
   * @param page Página de resultados a mostrar
   * @param size Número de eventos a mostrar por página
   * @param sort Ordenación
   * @returns
   */
  findAllByCriteria(
    priv: boolean,
    tipoBusqueda: string | null,
    fechaInicial: string | null,
    fechaFinal: string | null,
    idTipoActoCulto: number | undefined,
    idEntidadOrganizadora: number | undefined,
    idTitular: number | undefined,
    idPersona: number | undefined,
    idLugar: number | undefined,
    tiposEntidadId: number[],
    caracteresId: number[],
    sinCaracter: boolean,
    noVisibles: boolean,
    aplazados: boolean,
    suspendidos: boolean,
    extraordinarios: boolean,
    pendienteRevisar: boolean,
    pendienteDuplicar: boolean,
    page: number | undefined,
    size: number | undefined,
    sort?: string
  ): Observable<ResultadoEventos> {
    let params = new HttpParams();

    if (tipoBusqueda != null) params = params.append('tipoBusqueda', tipoBusqueda);
    if (fechaInicial != null) params = params.append('fechaInicial', moment(fechaInicial).format(UtilsDate.formatoFechaServidor));
    if (fechaFinal != null) params = params.append('fechaFinal', moment(fechaFinal).format(UtilsDate.formatoFechaServidor));
    if (idTipoActoCulto != null) params = params.append('idTipoActoCulto', idTipoActoCulto);
    if (idEntidadOrganizadora != null) params = params.append('idEntidadOrganizadora', idEntidadOrganizadora);
    if (idTitular != null) params = params.append('idTitular', idTitular);
    if (idPersona != null) params = params.append('idPersona', idPersona);
    if (idLugar != null) params = params.append('idLugar', idLugar);
    if (tiposEntidadId != null && tiposEntidadId.length > 0) params = params.append('tiposEntidadId', tiposEntidadId.toString());
    if (caracteresId != null && caracteresId.length > 0) params = params.append('caracteresId', caracteresId.toString());
    if (sinCaracter) params = params.append('sinCaracter', sinCaracter);
    if (noVisibles) params = params.append('noVisibles', noVisibles);
    if (aplazados) params = params.append('aplazados', aplazados);
    if (suspendidos) params = params.append('suspendidos', suspendidos);
    if (extraordinarios) params = params.append('extraordinarios', extraordinarios);
    if (pendienteRevisar) params = params.append('pendienteRevisar', pendienteRevisar);
    if (pendienteDuplicar) params = params.append('pendienteDuplicar', pendienteDuplicar);
    if (page) params = params.append('page', page);
    if (size) params = params.append('size', size);
    if (sort != null) params = params.append('sort', sort);

    return this.http.get<ResultadoEventos>(APC.API_URL_ENDPOINT + (priv ? APC.API_URI_PRIVATE : '') + APC.API_METHOD_EVENTOS + APC.API_METHOD_BY_CRITERIA, { params: params });
  }

  /**
   * Método encargado de obtener un evento por id
   *
   * @param id Identificador del evento
   * @param priv Indica si hay que concatenarle a la url 'private/'
   * @returns
   */
  findById(id: number, priv: boolean = false): Observable<Evento> {
    return this.http.get<Evento>(APC.API_URL_ENDPOINT + (priv ? APC.API_URI_PRIVATE : '') + APC.API_METHOD_EVENTOS + '/' + `${id}`);
  }

  /**
   * Método encargado de obtener el número total de eventos
   *
   * @returns
   */
  findTotal(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_TODOS, // tipoBusqueda
      null, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos finalizados
   *
   * @returns
   */
  findFinalizados(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ANTERIOR, // tipoBusqueda
      UtilsDate.fechaActualServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      'fecha, desc, horaIni1, desc' // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos planificados
   *
   * @returns
   */
  findPlanificados(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_POSTERIOR, // tipoBusqueda
      UtilsDate.fechaActualServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos que se celebran hoy
   *
   * @returns
   */
  findHoyTotal(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_IGUAL, // tipoBusqueda
      UtilsDate.fechaActualServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos en directo
   *
   * @returns
   */
  findHoyDirecto(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_DIRECTO, // tipoBusqueda
      null, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos no visibles que se celebran hoy
   *
   * @returns
   */
  findHoyNoVisibles(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_IGUAL, // tipoBusqueda
      UtilsDate.fechaActualServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      true, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos pendientes de revisar que se celebran hoy
   *
   * @returns
   */
  findHoyPendientesRevisar(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_IGUAL, // tipoBusqueda
      UtilsDate.fechaActualServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos que se celebran mañana
   *
   * @returns
   */
  findMananaTotal(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_IGUAL, // tipoBusqueda
      UtilsDate.fechaMananaServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos no visibles que se celebran mañana
   *
   * @returns
   */
  findMananaNoVisibles(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_IGUAL, // tipoBusqueda
      UtilsDate.fechaMananaServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      true, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos pendientes de revisar que se celebran mañana
   *
   * @returns
   */
  findMananaPendientesRevisar(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_IGUAL, // tipoBusqueda
      UtilsDate.fechaMananaServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos pendientes de revisar
   *
   * @returns
   */
  findPendientesRevisarTotal(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_TODOS, // tipoBusqueda
      null, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de revisar críticos
   *
   * @returns
   */
  findPendientesRevisarCriticos(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ANTERIOR, // tipoBusqueda
      UtilsDate.fechaPRGraveInicioServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de revisar graves
   *
   * @returns
   */
  findPendientesRevisarGraves(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ENTRE, // tipoBusqueda
      UtilsDate.fechaPRGraveInicioServidor, // fechaInicial
      UtilsDate.fechaPRGraveFinServidor, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de revisar moderados
   *
   * @returns
   */
  findPendientesRevisarModerados(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ENTRE, // tipoBusqueda
      UtilsDate.fechaPRModeradaInicioServidor, // fechaInicial
      UtilsDate.fechaPRModeradaFinServidor, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de revisar leve
   *
   * @returns
   */
  findPendientesRevisarLeves(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_POSTERIOR, // tipoBusqueda
      UtilsDate.fechaPRLeveInicioServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      true, // isCheckedPendientesRevisar
      false, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número total de eventos pendientes de duplicar
   *
   * @returns
   */
  findPendientesDuplicarTotal(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_TODOS, // tipoBusqueda
      null, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      true, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de duplicar críticos
   *
   * @returns
   */
  findPendientesDuplicarCriticos(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ANTERIOR, // tipoBusqueda
      UtilsDate.fechaPDGraveInicioServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      true, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de duplicar graves
   *
   * @returns
   */
  findPendientesDuplicarGraves(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ENTRE, // tipoBusqueda
      UtilsDate.fechaPDGraveInicioServidor, // fechaInicial
      UtilsDate.fechaPDGraveFinServidor, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      true, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de duplicar moderados
   *
   * @returns
   */
  findPendientesDuplicarModerados(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_ENTRE, // tipoBusqueda
      UtilsDate.fechaPDModeradaInicioServidor, // fechaInicial
      UtilsDate.fechaPDModeradaFinServidor, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      true, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el número de eventos pendientes de duplicar leve
   *
   * @returns
   */
  findPendientesDuplicarLeves(): Observable<ResultadoEventos> {
    return this.findAllByCriteria(
      true, // priv
      AC.L_TIPO_BUSQUEDA_POSTERIOR, // tipoBusqueda
      UtilsDate.fechaPDLeveInicioServidor, // fechaInicial
      null, // fechaFinal
      undefined, // idTipoActoCulto
      undefined, // idEntidadOrganizadora
      undefined, // idTitular
      undefined, // idPersona
      undefined, // idLugar
      [], // tiposEntidadId
      [], // caracteresIds
      false, // sinCaracter
      false, // isCheckedNoVisibles
      false, // isCheckedAplazados
      false, // isCheckedSuspendidos
      false, // isCheckedExtraordinarios
      false, // isCheckedPendientesRevisar
      true, // isCheckedPendientesDuplicar
      0, // currentPage
      1, // pageSize
      undefined // ordenacion
    );
  }

  /**
   * Método encargado de obtener el catálogo de tipos existentes
   *
   * @returns
   */
  findDistinctTipo(): Observable<string[]> {
    return this.http.get<string[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_EVENTOS + '/tipos');
  }

  /**
   * Método encargado de obtener el catálogo de marcos existentes
   *
   * @returns
   */
  findDistinctMarco(): Observable<string[]> {
    return this.http.get<string[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_EVENTOS + '/marcos');
  }

  /**
   * Método encargado de obtener el catálogo de hitos existentes
   *
   * @returns
   */
  findDistinctHito(): Observable<string[]> {
    return this.http.get<string[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_EVENTOS + '/hitos');
  }

  /**
   * Método encargado de obtener el catálogo de informaciones existentes
   *
   * @returns
   */
  findDistinctInformacion(): Observable<string[]> {
    return this.http.get<string[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_EVENTOS + '/informaciones');
  }

  /**
   * Método encargado de obtener el catálogo de reglas existentes
   *
   * @returns
   */
  findDistinctRegla(): Observable<string[]> {
    return this.http.get<string[]>(APC.API_URL_ENDPOINT + APC.API_URI_PRIVATE + APC.API_METHOD_EVENTOS + '/reglas');
  }

  /**
   * Método encargado de crear un evento
   *
   * @param evento Evento a crear
   * @returns
   */
  create(evento: Evento): Observable<Evento> {
    // Damos formato a la fecha para enviarla al servidor
    if (evento.fecha != null) evento.fecha = moment(evento.fecha).format(UtilsDate.formatoFechaServidor);

    let params = new HttpParams();
    if (evento.duracion != null) params = params.append('duracion', evento.duracion);
    return this.http.post<Evento>(APC.API_URL_ENDPOINT + APC.API_METHOD_EVENTOS, evento, { params: params });
  }

  /**
   * Método encargado de actualizar un evento
   *
   * @param id Identificador del evento
   * @param evento Evento a actualizar
   * @returns
   */
  update(id: number, evento: Evento): Observable<Evento> {
    // Damos formato a la fecha para enviarla al servidor
    if (evento.fecha != null) evento.fecha = moment(evento.fecha).format(UtilsDate.formatoFechaServidor);

    return this.http.put<Evento>(APC.API_URL_ENDPOINT + APC.API_METHOD_EVENTOS + '/' + `${id}`, evento);
  }

  /**
   * Método encargado de eliminar un evento
   *
   * @param id Identificador del evento
   * @returns
   */
  delete(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_EVENTOS + '/' + `${id}`);
  }

  /**
   * Método encargado de eliminar un evento y todos sus hijos
   *
   * @param id Identificador del evento padre
   * @returns
   */
  deleteAllByEventoPadreId(id: number): Observable<unknown> {
    return this.http.delete(APC.API_URL_ENDPOINT + APC.API_METHOD_EVENTOS + '/' + `${id}` + '/todos');
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el icono de revisar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarIconoVisible(evento: Evento): boolean {
    if (
      !evento.visible ||
      (
        evento.eventoPadre != null &&
        !evento.eventoPadre.visible
      )
    ) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el icono de revisar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarIconoRevisar(evento: Evento): boolean {
    if (
      evento.pendienteRevisar ||
      evento.revisarRegla ||
      (
        evento.eventoPadre != null &&
        (
          evento.eventoPadre.pendienteRevisar ||
          evento.eventoPadre.revisarRegla
        )
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de comprobar si se revisa un evento porque esté marcado
   * como pendiente de revisar, o porque falte la regla
   *
   * @param evento Evento a comprobar
   * @returns
   */
  obtenerTipoRevisar(evento: Evento): boolean {
    if (
      evento.pendienteRevisar ||
      (
        evento.eventoPadre != null &&
        evento.eventoPadre.pendienteRevisar
      )
    ) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de obtener la severidad de un evento pendiente de revisar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  obtenerSeveridadRevisar(evento: Evento): string {
    // Establecemos la fecha del evento
    const fechaEvento = moment(evento.fecha).startOf('day');

    if (fechaEvento.isBefore(UtilsDate.fechaPRGraveInicioAplicacion)) {
      // Si la fecha del evento es menor a la fecha de inicio grave
      return AC.L_CRITICO_ACRONIMO;
    } else if (fechaEvento.isSameOrAfter(UtilsDate.fechaPRGraveInicioAplicacion)
      && fechaEvento.isBefore(UtilsDate.fechaPRModeradaInicioAplicacion)) {
      // Si la fecha del evento es mayor o igual a la fecha de inicio grave y menor a la fecha de inicio moderada
      return AC.L_GRAVE_ACRONIMO;
    } else if (fechaEvento.isSameOrAfter(UtilsDate.fechaPRModeradaInicioAplicacion)
      && fechaEvento.isBefore(UtilsDate.fechaPRLeveInicioAplicacion)) {
      // Si la fecha del evento es mayor o igual a la fecha de inicio moderada y menor a la fecha de inicio leve
      return AC.L_MODERADO_ACRONIMO;
    } else {
      // Si la fecha del evento es mayor o igual a la fecha de inicio leve
      return AC.L_LEVE_ACRONIMO;
    }
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el botón de duplicar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarIconoDuplicar(evento: Evento): boolean {
    // Establecemos la fecha del evento
    const fechaEvento = moment(evento.fecha).startOf('day');

    if ((evento.duplicado != null && evento.duplicado == 'N')
      && evento.eventoPadre == null
      && evento.visible
      && !evento.extraordinario
      && !evento.pendienteRevisar
      && fechaEvento.isBefore(UtilsDate.fechaActualAplicacion)
    ) {
        return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el chip de la duplicidad
   *
   * @param evento Evento a comprobar
   * @returns
   */
  mostrarChipDuplicar(evento: Evento): boolean {
    // Establecemos la fecha del evento
    const fechaEvento = moment(evento.fecha).startOf('day');

    if (
      evento.visible &&
      !evento.extraordinario &&
      !evento.pendienteRevisar &&
      fechaEvento.isBefore(UtilsDate.fechaActualAplicacion)
    ) {
        return true;
    } else {
      return false;
    }
  }

  /**
   * Método encargado de comprobar si el evento está duplicado.
   * Si el evento es padre, comprobamos si éste está duplicado.
   * Si el evento es hijo, comprobamos si el padre está duplicado.
   *
   * @param evento Evento a comprobar
   * @returns
   */
  comprobarSiEventoDuplicado(evento: Evento): string {
    if (evento != null) {
      if (evento.eventoPadre == null) {
        // Si el evento es padre
        if (evento.duplicado == 'S') {
          // Si el evento está duplicado
          return 'Duplicado';
        } else {
          // Si el evento no está duplicado aún
          return 'Por duplicar';
        }
      } else {
        // Si el evento es hijo
        if (evento.eventoPadre.duplicado == 'S') {
          // Si el evento padre está duplicado
          return 'Padre duplicado';
        } else {
          // Si el evento padre no está duplicado aún
          return 'Padre por duplicar';
        }
      }
    } else {
      return '';
    }
  }

  /**
   * Método encargado de obtener la severidad de un evento pendiente de duplicar
   *
   * @param evento Evento a comprobar
   * @returns
   */
  obtenerSeveridadDuplicar(evento: Evento): string {
    // Establecemos la fecha del evento
    const fechaEvento = moment(evento.fecha).startOf('day');

    if (fechaEvento.isBefore(UtilsDate.fechaPDGraveFinAplicacion)) {
      // Si la fecha del evento es menor a la fecha de fin grave
      return AC.L_CRITICO_ACRONIMO;
    } else if (fechaEvento.isSameOrAfter(UtilsDate.fechaPDGraveFinAplicacion)
      && fechaEvento.isBefore(UtilsDate.fechaPDModeradaFinAplicacion)) {
      // Si la fecha del evento es mayor o igual a la fecha de fin grave y menor a la fecha de fin moderada
      return AC.L_GRAVE_ACRONIMO;
    } else if (fechaEvento.isSameOrAfter(UtilsDate.fechaPDModeradaFinAplicacion)
      && fechaEvento.isBefore(UtilsDate.fechaPDLeveFinAplicacion)) {
      // Si la fecha del evento es mayor o igual a la fecha de fin moderada y menor a la fecha de fin leve
      return AC.L_MODERADO_ACRONIMO;
    } else {
      // Si la fecha del evento es mayor o igual a la fecha de fin leve
      return AC.L_LEVE_ACRONIMO;
    }
  }
}
