import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as moment from 'moment';
import { ModoEnum } from '../../../../core/enumerates';
import {
    Caracter, Entidad, Evento, Lugar, Persona,
    TipoActoCulto, TipoEntidad, Titular
} from '../../../../core/interfaces';
import {
    EntidadService, EventoService, LugarService, PersonaService,
    TipoActoCultoService, TipoEntidadService, TitularService
} from '../../../../core/services';
import { AppConstants as AC } from '../../../../shared/constants';
import { UtilsChart, UtilsDate } from '../../../../shared/utils';

/**
 * Detalle de evento
 *
 * Solo podrán acceder los usuarios logados y que posean el rol [ADMINISTRADOR] o [MODERADOR]
 * El rol [ADMINISTRADOR] podrá entrar en modo lectura y escritura
 * El rol [MODERADOR] solo podrá entrar en modo lectura
 */
@Component({
  selector: 'app-evento-detalle',
  templateUrl: './evento-detalle.component.html'
})
export class EventoDetalleComponent implements OnInit {
  // Atributo para usar las constantes en la vista
  ac = AC;

  // Parámetros recibidos
  modo: string;
  evento: Evento;

  // Atributos del modo
  modoCrear: boolean = false;
  modoVer: boolean = false;
  modoEditar: boolean = false;
  modoDuplicar: boolean = false;

  // Atributos de la pantalla
  tituloPagina: string = '';

  // Atributo para el formulario de detalle
  form: FormGroup;

  // Atributos de los selects
  tiposActoCulto: TipoActoCulto[] = [];
  tiposActoCultoFiltro: TipoActoCulto[] = [];
  tipos: string[] = [];
  entidades: Entidad[] = [];
  entidadesFiltro: Entidad[] = [];
  lugares: Lugar[] = [];
  lugaresFiltro: Lugar[] = [];
  personas: Persona[] = [];
  personasFiltro: Persona[] = [];
  bandas: Entidad[] = [];
  bandasFiltro: Entidad[] = [];
  marcos: string[] = [];
  hitos: string[] = [];
  informaciones: string[] = [];
  reglas: string[] = [];
  titularesId: number[] = [];
  personasId: number[] = [];
  bandasId: number[] = [];

  // Atributos de los selects que dependen de la entidad organizadora seleccionada
  caracteres: Caracter[] = [];
  titulares: Titular[] = [];
  titularesFiltro: Titular[] = [];
  titularesEntidad: Titular[] = [];
  mostrarNombreTitularConEntidad: boolean = false;

  constructor(
    public dialogo: MatDialogRef<EventoDetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private formBuilder: FormBuilder,
    private entService: EntidadService,
    private eveService: EventoService,
    private lugService: LugarService,
    private perService: PersonaService,
    private tacService: TipoActoCultoService,
    private tenService: TipoEntidadService,
    private titService: TitularService
  ) {
    // Inicializamos los parámetros
    this.modo = data.modo;
    this.evento = data.objeto;

    // Inicializamos los atributos del título
    this.tituloPagina = this.modo + ' ' + AC.EVENTO.toLowerCase();

    // Inicializamos los atributos del modo
    if (this.modo == ModoEnum.VER) {
      this.modoVer = true;
    } else if(this.modo == ModoEnum.CREAR){
      this.modoCrear = true;
    } else if(this.modo == ModoEnum.EDITAR) {
      this.modoEditar = true;
    } else {
      this.modoDuplicar = true;
    }

    // Si estamos en modo ver, editar o duplicar
    if (!this.modoCrear) {
      // Obtenemos, si existen, todos los carácteres disponibles para la entidad asociada al evento
      if (this.evento.entidadOrganizadora.caracteres != null && this.evento.entidadOrganizadora.caracteres.length > 0) {
        this.caracteres = this.evento.entidadOrganizadora.caracteres;
      }

      // Obtenemos, si existen, todos los identificacores de los titulares asociados al evento
      if (this.evento.titulares != null && this.evento.titulares.length > 0) {
        for (const titular of this.evento.titulares) {
          this.titularesId.push(titular.id);
        }
      }

      // Obtenemos, si existen, todos los identificacores de las personas asociadas al evento
      if (this.evento.personas != null && this.evento.personas.length > 0) {
        for (const persona of this.evento.personas) {
          this.personasId.push(persona.id);
        }
      }

      // Obtenemos, si existen, todos los identificacores de las entidades de tipo banda asociadas al evento
      if (this.evento.bandas != null && this.evento.bandas.length > 0) {
        for (const banda of this.evento.bandas) {
          this.bandasId.push(banda.id);
        }
      }
    }

    // Inicializamos los atributos del formulario de detalle
    this.form = this.formBuilder.group({
      tipoActoCulto: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.tipoActoCulto.id,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarTipoActoCulto)
        }, [Validators.required]
      ),
      tipo: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.tipo,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarTipoActoCulto)
        }, [Validators.maxLength(500)]
      ),
      edicion: new FormControl(
        {
          value: this.modoCrear ? null : (this.modoDuplicar && this.evento.edicion != null ? this.evento.edicion + 1 : this.evento.edicion),
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.minLength(1)]
      ),
      aniversario: new FormControl(
        {
          value: this.modoCrear ? null : (this.modoDuplicar && this.evento.aniversario != null ? this.evento.aniversario + 1 : this.evento.aniversario),
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.minLength(1)]
      ),
      dia: new FormControl(
        {
          value: this.modoCrear ? null : (this.modoDuplicar ? null : this.evento.dia),
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.minLength(0)]
      ),
      duracion: new FormControl(
        {
          value: null,
          disabled: this.modoVer
        }, [Validators.minLength(1)]
      ),
      entidadOrganizadora: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.entidadOrganizadora.id,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.required]
      ),
      caracter: new FormControl(
        {
          value: this.modoCrear ? null : (this.evento.caracter != null ? this.evento.caracter.id : null),
          disabled: this.modoVer || this.modoDuplicar
        }
      ),
      fecha: new FormControl(
        {
          value:
            this.modoCrear ? null
            : (
              this.modoDuplicar
              ? moment(this.evento.fecha).add(1, 'years').format(UtilsDate.formatoFechaServidor)
              : this.evento.fecha
            ),
          disabled: this.modoVer || (this.modoDuplicar && this.evento.periodico)
        }, [Validators.required]
      ),
      horaIni1: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.horaIni1,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      horaFin1: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.horaFin1,
          disabled: this.modoVer
        }
      ),
      horaIni2: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.horaIni2,
          disabled: this.modoVer
        }
      ),
      horaFin2: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.horaFin2,
          disabled: this.modoVer
        }
      ),
      lugar: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.lugar.id,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarLugar)
        }, [Validators.required]
      ),
      titulares : new FormControl(
        {
          value: this.modoCrear ? null : this.titularesId,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarTitulares)
        }
      ),
      personas : new FormControl(
        {
          value: this.modoCrear ? null : this.personasId,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarPersonas)
        }
      ),
      bandas : new FormControl(
        {
          value: this.modoCrear ? null : this.bandasId,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarBandas)
        }
      ),
      marco: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.marco,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.maxLength(500)]
      ),
      titulo: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.titulo,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.maxLength(500)]
      ),
      tituloEdicion: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.tituloEdicion,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.minLength(1)]
      ),
      hito: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.hito,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.maxLength(500)]
      ),
      hitoAniversario: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.hitoAniversario,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.minLength(1)]
      ),
      informacion: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.informacion,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarInformacion)
        }, [Validators.maxLength(5000)]
      ),
      itinerario: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.itinerario,
          disabled: this.modoVer || (this.modoDuplicar && !this.evento.revisarItinerario)
        }, [Validators.maxLength(5000)]
      ),
      nota: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.nota,
          disabled: this.modoVer
        }, [Validators.maxLength(1000)]
      ),
      visible: new FormControl(
        {
          value: this.modoCrear ? true : this.evento.visible,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      aplazado: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.aplazado,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      suspendido: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.suspendido,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      extraordinario: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.extraordinario,
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.required]
      ),
      pendienteRevisar: new FormControl(
        {
          value: this.modoCrear ? false : (this.modoDuplicar ? true : this.evento.pendienteRevisar),
          disabled: this.modoVer || this.modoDuplicar
        }, [Validators.required]
      ),
      revisarNota: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.revisarNota,
          disabled: this.modoVer
        }, [Validators.maxLength(1000)]
      ),
      duplicado: new FormControl(
        {
          value: this.modoCrear ? null : this.evento.duplicado,
          disabled: true
        }, [Validators.minLength(1), Validators.maxLength(1)]
      ),
      regla: new FormControl(
        {
          value: this.modoCrear ? null : (this.evento.eventoPadre != null ? this.evento.eventoPadre.regla : this.evento.regla),
          disabled: this.modoVer
            || (this.modoEditar && this.evento.eventoPadre != null)
            || (this.modoDuplicar && this.evento.periodico)
        }, [Validators.maxLength(1000)]
      ),
      periodico: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.periodico,
          disabled: this.modoVer
        }, [Validators.required]),
      revisarTipoActoCulto: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarTipoActoCulto,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarDias: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarDias,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarLugar: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarLugar,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarTitulares: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarTitulares,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarPersonas: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarPersonas,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarBandas: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarBandas,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarInformacion: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarInformacion,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarItinerario: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarItinerario,
          disabled: this.modoVer
        }, [Validators.required]
      ),
      revisarRegla: new FormControl(
        {
          value: this.modoCrear ? false : this.evento.revisarRegla,
          disabled: this.modoVer
        }, [Validators.required]
      ),
    });
  }

  ngOnInit(): void {
    // Obtenemos las listas de los selects
    this.cargarSelects();
  }

  /**
   * Método encargado de cargar las listas de los selects
   */
  cargarSelects(): void {
    // Obtenemos la lista completa de tipos de acto o culto
    this.tacService.findAll().subscribe((data: TipoActoCulto[]) => {
      this.tiposActoCulto = data;
      this.tiposActoCultoFiltro = this.tiposActoCulto != null ? this.tiposActoCulto.slice() : [];

      if (!this.modoCrear) {
        // Si estamos en modo ver, editar o duplicar, cargamos los elementos que dependen del tipo de acto o culto
        this.seleccionarTipoActoCulto(this.evento.tipoActoCulto.id);
      } else {
        // Si estamos en modo crear, deshabilitamos los elementos que dependen del tipo de acto o culto
        this.form.get("duracion")?.disable();
      }
    });

    // Obtenemos la lista completa de entidades
    this.entService.findAll(true).subscribe((data: Entidad[]) => {
      this.entidades = data;
      this.entidadesFiltro = this.entidades != null ? this.entidades.slice() : [];
    });

    // Obtenemos la lista completa de lugares
    this.lugService.findAll().subscribe((data: Lugar[]) => {
      this.lugares = data;
      this.lugaresFiltro = this.lugares != null ? this.lugares.slice() : [];
    });

    // Obtenemos la lista completa de titulares
    this.titService.findAll().subscribe((data: Titular[]) => {
      this.titulares = data;

      if (!this.modoCrear) {
        // Si estamos en modo ver, editar o duplicar, cargamos los titulares disponibles de la entidad organizadora
        // una vez se hayan obtenido todos los titulares
        this.cargarTitularesByEntidad(this.evento.entidadOrganizadora);
      }
    });

    // Obtenemos la lista completa de personas
    this.perService.findAll().subscribe((data: Persona[]) => {
      this.personas = data;
      this.personasFiltro = this.personas != null ? this.personas.slice() : [];
    });

    // Obtenemos la lista completa de entidades de tipo banda
    this.tenService.findByAcronimo('BAN').subscribe((data: TipoEntidad) => {
      if (data != null) {
        const tiposEntidadId: number[] = [];
        tiposEntidadId.push(data.id);

        this.entService.findAllByCriteria(
          false,
          tiposEntidadId,
          [],
          false,
          false,
          'codigo, asc'
        ).subscribe((data: Entidad[]) => {
          this.bandas = data;
          this.bandasFiltro = this.bandas != null ? this.bandas.slice() : [];
        });
      }
    });

    // Si estamos en modo crear, editar o duplicar
    if (this.modoCrear || this.modoEditar || this.modoDuplicar) {
      // Obtener el catálogo de tipos existentes
      this.eveService.findDistinctTipo().subscribe((data: string[]) => {
        this.tipos = data;
      });

      // Obtener el catálogo de marcos existentes
      this.eveService.findDistinctMarco().subscribe((data: string[]) => {
        this.marcos = data;
      });

      // Obtener el catálogo de hitos existentes
      this.eveService.findDistinctHito().subscribe((data: string[]) => {
        this.hitos = data;
      });

      // Obtener el catálogo de informaciones existentes
      this.eveService.findDistinctInformacion().subscribe((data: string[]) => {
        this.informaciones = data;
      });
    }

    // Si estamos en modo crear o editar y el evento es padre
    if (this.modoCrear || (this.modoEditar && this.evento.eventoPadre == null)) {
      // Obtenemos el catálogo de reglas, ya que un evento hijo no puede tener informada la regla
      this.eveService.findDistinctRegla().subscribe((data: string[]) => {
        this.reglas = data;
      });
    }
  }

  /**
   * Método encargado de comprobar si hay que mostrar o no el chip de la duplicidad
   *
   * @returns
   */
  mostrarChipDuplicar(): boolean {
    return this.eveService.mostrarChipDuplicar(this.evento);
  }

  /**
   * Método encargado de comprobar si el evento está duplicado.
   * Si el evento es padre, comprobamos si éste está duplicado.
   * Si el evento es hijo, comprobamos si el padre está duplicado.
   *
   * @returns
   */
  comprobarSiEventoDuplicado(): string {
    return this.eveService.comprobarSiEventoDuplicado(this.evento);
  }

  /**
   * Método encargado de comprobar si se cumple una validación
   * Solo se comprueba la validación si es modo Crear o Editar
   *
   * @param campo Campo sobre el que se realiza la validación
   * @param tipoValidacion Tipo de validación que se comprueba
   * @returns
   */
  mostrarValidacion(campo: string, tipoValidacion: string) {
    if (!this.modoVer) {
      return this.form.controls[campo].hasError(tipoValidacion);
    } else {
      return false;
    }
  }

  /**
   * Método encargado de cargar los elementos que dependen de un tipo de acto o culto
   *
   * @param idTipoActoCulto Id del tipo de acto o culto seleccionado
   */
  seleccionarTipoActoCulto(idTipoActoCulto: number) {
    if (idTipoActoCulto != undefined) {
      // Recorremos la lista de tipos de acto o culto en busca del tipo de acto o culto seleccionado
      this.tiposActoCulto.forEach(tipoActoCulto => {
        if ((this.modoCrear || this.modoDuplicar) && tipoActoCulto.id == idTipoActoCulto) {
          if (tipoActoCulto.dias == 0) {
            // Si el tipo de acto o culto tiene una duración variable,
            // Permitimos la modificación de la mismas y la hacemos obligatoria
            if (this.modoCrear) {
              // Si estamos en modo crear la precargamos nula
              this.form.get("duracion")?.setValue(null);
              this.form.get("duracion")?.enable();
            } else {
              // Si estamos en modo duplicar, la precargamos con el numero total de eventos hijos
              // mas el evento referencia
              this.eveService.countHijos(this.evento.id).subscribe((numHijos: number) => {
                this.form.get("duracion")?.setValue(numHijos + 1);

                // Si está marcada la revisión de los dias, habilitamos la duración
                if (this.evento.revisarDias) this.form.get("duracion")?.enable()
                // Si no está marcada, impedimos que se pueda modificar
                else this.form.get("duracion")?.disable();
              });
            }
            this.form.get("duracion")?.clearValidators();
            this.form.get("duracion")?.addValidators([Validators.required, Validators.minLength(1)]);
          } else {
            // Si el tipo de acto o culto tiene una duración fija
            // No permitimos la modificación de la misma
            this.form.get("duracion")?.setValue(tipoActoCulto.dias);
            this.form.get("duracion")?.clearValidators();
            this.form.get("duracion")?.addValidators([Validators.minLength(1)]);
            this.form.get("duracion")?.disable();
          }
        }
      });
    } else {
      // Si no se selecciona ningun tipo de acto o culto, inicializamos los elementos que dependen de el
      this.form.get("dia")?.disable();
      this.form.get("duracion")?.disable();
    }
  }

  /**
   * Método encargado de cargar los elementos que dependen de una entidad
   *
   * @param idEntidadOrganizadora Id de la entidad organizadora seleccionada
   */
  seleccionarEntidadOrganizadora(idEntidadOrganizadora: number) {
    // Inicializamos los elementos que dependen de una entidad
    this.form.get("caracter")?.setValue(null);
    this.caracteres = [];
    this.form.get("titulares")?.setValue(null);
    this.titularesEntidad = [];
    this.titularesFiltro = [];
    this.form.get("lugar")?.setValue(null);

    if (idEntidadOrganizadora != undefined) {
      // Recorremos la lista de entidades en busca de la entidad organizadora seleccionada
      this.entidades.forEach(entidad => {
        if (entidad.id == idEntidadOrganizadora) {
          if (entidad.caracteres != null && entidad.caracteres.length > 0) {
            // Cargamos los carácteres disponibles para la entidad organizadora seleccionada
            this.caracteres = entidad.caracteres;
          }

          // Cargamos los titulares disponibles para la entidad organizadora seleccionada
          this.cargarTitularesByEntidad(entidad);

          // Seleccionamos por defecto el lugar asociado a la entidad organizadora seleccionada en caso de existir
          if (entidad.lugar != null) {
            this.lugares.forEach(lugar => {
              if (lugar.id == entidad.lugar?.id) {
                this.form.get("lugar")?.setValue(lugar.id);
              }
            });
          }
        }
      });
    }
  }

  /**
   * Método encargado de cargar los titulares disponibles de una entidad
   *
   * @param entidad Entidad por la que buscar
   */
  cargarTitularesByEntidad(entidad: Entidad) {
    if (entidad != null) {
      if (entidad.tipoEntidad.acronimo == 'ORG' || entidad.tipoEntidad.acronimo == 'BAN') {
        // Si la entidad seleccionada es de tipo ORG o BAN, mostramos todos los titulares
        this.titularesEntidad = this.titulares;
        this.mostrarNombreTitularConEntidad = true;
      } else {
        // Si la entidad seleccionada no es de tipo ORG o BAN, recorremos la lista de titulares
        // en busca de los que pertenezcan a la entidad seleccionada
        this.titulares.forEach(titular => {
          if (titular.entidad.id == entidad.id) {
            this.titularesEntidad.push(titular);
          }
        });

        this.mostrarNombreTitularConEntidad = false;
      }

      this.titularesFiltro = this.titularesEntidad != null ? this.titularesEntidad.slice() : [];
    }
  }

  /**
   * Método encargado de persistir un objeto
   */
  guardar(): void {
    const objeto = this.construirObjetoServidor();

    if (this.modoCrear) {
      // Creamos el objeto
      this.eveService.create(objeto).subscribe((data: Evento) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    } else if (this.modoDuplicar) {
      // Duplicamos el objeto
      this.eveService.create(objeto).subscribe((dataDuplicado: Evento) => {
        // Si se ha duplicado correctamente
        if (dataDuplicado != null) {
          // Marcamos el objeto referencia como duplicado
          this.evento.duplicado = 'S';

          // Actualizamos el objeto referencia
          this.eveService.update(this.evento.id, this.evento).subscribe((data: Evento) => {
            // Cerramos el diálogo y devolvemos el objeto duplicado
            if (data != null) this.dialogo.close(dataDuplicado);
          });
        }
      });
    } else {
      // Actualizamos el objeto
      this.eveService.update(this.evento.id, objeto).subscribe((data: Evento) => {
        // Cerramos el diálogo y devolvemos el objeto persistido
        this.dialogo.close(data);
      });
    }
  }

  /**
   * Método encargado de construir el objeto a enviar al servidor
   */
  construirObjetoServidor(): any {
    let objeto: any = {};

    objeto.eventoPadre = this.modoEditar ? this.evento.eventoPadre : null;
    objeto.tipoActoCulto = UtilsChart.construirObjetoConId(this.form.get('tipoActoCulto')?.value);
    objeto.edicion = UtilsChart.cadenaVaciaToUndenfined(this.form.get('edicion')?.value);
    objeto.aniversario = UtilsChart.cadenaVaciaToUndenfined(this.form.get('aniversario')?.value);
    objeto.tipo = UtilsChart.cadenaVaciaToUndenfined(this.form.get('tipo')?.value);
    objeto.dia = UtilsChart.cadenaVaciaToUndenfined(this.form.get('dia')?.value);
    objeto.duracion = UtilsChart.cadenaVaciaToUndenfined(this.form.get('duracion')?.value);
    objeto.entidadOrganizadora = UtilsChart.construirObjetoConId(this.form.get('entidadOrganizadora')?.value);
    objeto.caracter = UtilsChart.construirObjetoConId(this.form.get('caracter')?.value);
    objeto.fecha = this.form.get('fecha')?.value;
    objeto.horaIni1 = this.form.get('horaIni1')?.value;
    objeto.horaFin1 = UtilsChart.cadenaVaciaToUndenfined(this.form.get('horaFin1')?.value);
    objeto.horaIni2 = UtilsChart.cadenaVaciaToUndenfined(this.form.get('horaIni2')?.value);
    objeto.horaFin2 = UtilsChart.cadenaVaciaToUndenfined(this.form.get('horaFin2')?.value);
    objeto.lugar = UtilsChart.construirObjetoConId(this.form.get('lugar')?.value);

    if (this.form.get('titulares')?.value != undefined) {
      let titularesId: any[] = [];

      for(let idTitular of this.form.get('titulares')?.value) {
        titularesId.push(UtilsChart.construirObjetoConId(idTitular));
      }

      objeto.titulares = titularesId;
    }

    if (this.form.get('personas')?.value != undefined) {
      let personasId: any[] = [];

      for(let idPersona of this.form.get('personas')?.value) {
        personasId.push(UtilsChart.construirObjetoConId(idPersona));
      }

      objeto.personas = personasId;
    }

    if (this.form.get('bandas')?.value != undefined) {
      let bandasId: any[] = [];

      for(let idBanda of this.form.get('bandas')?.value) {
        bandasId.push(UtilsChart.construirObjetoConId(idBanda));
      }

      objeto.bandas = bandasId;
    }

    objeto.marco = UtilsChart.cadenaVaciaToUndenfined(this.form.get('marco')?.value);
    objeto.titulo = UtilsChart.cadenaVaciaToUndenfined(this.form.get('titulo')?.value);
    objeto.tituloEdicion = UtilsChart.cadenaVaciaToUndenfined(this.form.get('tituloEdicion')?.value);
    objeto.hito = UtilsChart.cadenaVaciaToUndenfined(this.form.get('hito')?.value);
    objeto.hitoAniversario = UtilsChart.cadenaVaciaToUndenfined(this.form.get('hitoAniversario')?.value);
    objeto.informacion = UtilsChart.cadenaVaciaToUndenfined(this.form.get('informacion')?.value);
    objeto.itinerario = UtilsChart.cadenaVaciaToUndenfined(this.form.get('itinerario')?.value);
    objeto.nota = UtilsChart.cadenaVaciaToUndenfined(this.form.get('nota')?.value);
    objeto.visible = this.form.get('visible')?.value;
    objeto.aplazado = this.form.get('aplazado')?.value;
    objeto.suspendido = this.form.get('suspendido')?.value;
    objeto.extraordinario = this.form.get('extraordinario')?.value;
    objeto.pendienteRevisar = this.form.get('pendienteRevisar')?.value;
    objeto.revisarNota = UtilsChart.cadenaVaciaToUndenfined(this.form.get('revisarNota')?.value);
    objeto.duplicado = this.form.get('duplicado')?.value;
    objeto.regla = UtilsChart.cadenaVaciaToUndenfined(this.form.get('regla')?.value);
    objeto.periodico = this.form.get('periodico')?.value;
    objeto.revisarTipoActoCulto = this.form.get('revisarTipoActoCulto')?.value;
    objeto.revisarDias = this.form.get('revisarDias')?.value;
    objeto.revisarLugar = this.form.get('revisarLugar')?.value;
    objeto.revisarTitulares = this.form.get('revisarTitulares')?.value;
    objeto.revisarPersonas = this.form.get('revisarPersonas')?.value;
    objeto.revisarBandas = this.form.get('revisarBandas')?.value;
    objeto.revisarInformacion = this.form.get('revisarInformacion')?.value;
    objeto.revisarItinerario = this.form.get('revisarItinerario')?.value;
    objeto.revisarRegla = this.form.get('revisarRegla')?.value;

    return objeto;
  }
}
