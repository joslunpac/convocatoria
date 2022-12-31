export class AppConstants {
  public static APP_NOMBRE: string = 'Convocatoria';

  public static HOME: string = 'Inicio';
  public static HOME_ROUTE: string = '/';

  public static NO_ENCONTRADO_ROUTE: string = '**';

  public static SIGNIN: string = 'Iniciar sesión';
  public static SIGNIN_ICONO: string = 'login';
  public static SIGNIN_ROUTE: string = 'signin';

  public static SIGNUP: string = 'Cerrar sesión';
  public static SIGNUP_ICONO: string = 'logout';
  public static SIGNUP_ROUTE: string = 'signup';

  public static PERFIL: string = 'Mi perfil';
  public static PERFIL_ICONO: string = 'account_circle';
  public static PERFIL_ROUTE: string = 'perfil';

  public static SUSCRIPCIONES: string = 'Mis suscripciones';
  public static SUSCRIPCIONES_ICONO: string = 'notifications';
  public static SUSCRIPCIONES_ROUTE: string = 'suscripciones';

  public static CONFIGURACION: string = 'Configuración';
  public static CONFIGURACION_ICONO: string = 'tune';
  public static CONFIGURACION_ROUTE: string = 'configuracion';

  public static ADMINISTRACION: string = 'Administración';
  public static ADMINISTRACION_ROUTE: string = 'admin';

  public static SEGUIMIENTO: string = 'Seguimiento';
  public static SEGUIMIENTO_ICONO: string = 'dashboard';
  public static SEGUIMIENTO_ROUTE: string = 'seguimiento';

  public static CARACTER: string = 'Carácter';
  public static CARACTER_ICONO: string = 'star';
  public static CARACTERES: string = 'Carácteres';
  public static CARACTERES_ROUTE: string = 'caracteres';
  public static SIN_CARACTER: string = 'Sin carácter';
  public static SIN_CARACTER_ACRONIMO: string = 'SIN';

  public static ENTIDAD: string = 'Entidad';
  public static ENTIDAD_ICONO: string = 'featured_play_list';
  public static ENTIDADES: string = 'Entidades';
  public static ENTIDADES_ROUTE: string = 'entidades';

  public static EVENTO: string = 'Evento';
  public static EVENTO_ICONO: string = 'calendar_month';
  public static EVENTOS: string = 'Eventos';
  public static EVENTOS_ROUTE: string = 'eventos';
  public static EVENTO_VARIAS_PERSONAS: string = 'Varias';
  public static EVENTO_VARIOS_TITULARES: string = 'Sagrados titulares';

  public static LUGAR: string = 'Lugar';
  public static LUGAR_ICONO: string = 'church';
  public static LUGARES: string = 'Lugares';
  public static LUGARES_ROUTE: string = 'lugares';

  public static PERSONA: string = 'Persona';
  public static PERSONA_ICONO: string = 'people';
  public static PERSONAS: string = 'Personas';
  public static PERSONAS_ROUTE: string = 'personas';
  public static GENERO_MASCULINO: string = 'Masculino';
  public static GENERO_MASCULINO_ACRONIMO: string = 'M';
  public static GENERO_MASCULINO_ICONO: string = 'male';
  public static GENERO_MASCULINOS: string = 'Masculinos';
  public static GENERO_FEMENINO: string = 'Femenino';
  public static GENERO_FEMENINO_ACRONIMO: string = 'F';
  public static GENERO_FEMENINO_ICONO: string = 'female';
  public static GENERO_FEMENINOS: string = 'Femeninos';
  public static SIN_GENERO: string = 'Sin género';
  public static SIN_GENERO_ACRONIMO: string = 'S';
  public static SIN_GENERO_ICONO: string = 'radio_button_unchecked';

  public static TIPO_ACTO_CULTO: string = 'Tipo de acto o culto';
  public static TIPO_ACTO_CULTO_ICONO: string = 'bookmarks';
  public static TIPOS_ACTO_CULTO: string = 'Tipos de acto o culto';
  public static TIPOS_ACTO_CULTO_ROUTE: string = 'tiposActoCulto';

  public static TIPO_BANDA: string = 'Tipo de banda';
  public static TIPO_BANDA_ICONO: string = 'queue_music';
  public static TIPOS_BANDA: string = 'Tipos de banda';
  public static TIPOS_BANDA_ROUTE: string = 'tiposBanda';

  public static TIPO_ENTIDAD: string = 'Tipo de entidad';
  public static TIPO_ENTIDAD_ICONO: string = 'star';
  public static TIPOS_ENTIDAD: string = 'Tipos de entidad';
  public static TIPOS_ENTIDAD_ROUTE: string = 'tiposEntidad';

  public static TITULAR: string = 'Titular';
  public static TITULAR_ICONO: string = 'accessibility';
  public static TITULARES: string = 'Titulares';
  public static TITULARES_ROUTE: string = 'titulares';
  public static TITULAR_PRINCIPAL: string = 'Principal';
  public static TITULAR_PRINCIPAL_ACRONIMO: string = 'P';
  public static TITULAR_SECUNDARIO: string = 'Secundario';
  public static TITULAR_SECUNDARIO_ACRONIMO: string = 'S';

  public static USUARIO: string = 'Usuario';
  public static USUARIO_ICONO: string = 'people';
  public static USUARIOS: string = 'Usuarios';
  public static USUARIOS_ROUTE: string = 'usuarios';

  public static ROL: string = 'Rol';
  public static ROLES: string = 'Roles';

  // Rutas recursos
  public static RUTA_IMAGENES = 'assets/img/';
  public static RUTA_AVATARES = this.RUTA_IMAGENES + 'avatares/';
  public static RUTA_ENTIDADES = this.RUTA_IMAGENES + 'entidades/';
  public static RUTA_TITULARES = this.RUTA_IMAGENES + 'titulares/';
  // Acciones
  public static ACC_INICIAR_SESION: string = 'Iniciar sesión';
  public static ACC_RECUPERAR_PASSWORD: string = 'Recuperar';
  public static G_ACC_REGISTRAR_USUARIO: string = 'Crear cuenta';
  public static L_BUSCAR: string = 'Buscar';
  public static L_ACTUALIZAR: string = 'Actualizar';
  public static L_LIMPIAR: string = 'Limpiar';
  public static L_LIMPIAR_TODO: string = 'Limpiar todo';
  public static L_CREAR: string = 'Crear';
  public static L_VER: string = 'Ver';
  public static L_EDITAR: string = 'Editar';
  public static L_DUPLICAR: string = 'Duplicar';
  public static L_ELIMINAR: string = 'Eliminar';
  public static L_CANCELAR: string = 'Cancelar';
  public static L_GUARDAR: string = 'Guardar';
  public static I_BUSCAR: string = 'search';
  public static I_ACTUALIZAR: string = 'refresh';
  public static I_LIMPIAR: string = 'backspace';
  public static I_CREAR: string = 'add';
  public static I_VER: string = 'open_in_new';
  public static I_EDITAR: string = 'edit';
  public static I_DUPLICAR: string = 'content_copy';
  public static I_ELIMINAR: string = 'delete';
  // Tiempo
  public static TIEMPO_HOY: string = 'Hoy';
  public static TIEMPO_MANIANA: string = 'Mañana';
  // Estados (EST)
  public static G_EST_FINALIZADOS: string = 'Finalizados';
  public static G_EST_DIRECTO: string = 'Directo';
  public static G_EST_PLANIFICADOS: string = 'Planificados';
  public static L_SUSPENDIDO: string = 'Suspendido';
  public static L_APLAZADO: string = 'Aplazado';
  public static L_FINALIZADO: string = 'Finalizado';
  public static I_SUSPENDIDO: string = 'event_busy';
  public static I_APLAZADO: string = 'help_outline';
  public static I_DIRECTO: string = 'flash_on';
  // Criterios (CRI)
  public static CRIT_REVISAR: string = 'Revisar';
  public static CRIT_NO_VISIBLES: string = 'No visibles';
  public static L_TIPO_BUSQUEDA_TODOS: string = 'TODOS';
  public static L_TIPO_BUSQUEDA_DIRECTO: string = 'DIRECTO';
  public static L_TIPO_BUSQUEDA_IGUAL: string = 'IGUAL';
  public static L_TIPO_BUSQUEDA_ANTERIOR: string = 'ANTERIOR';
  public static L_TIPO_BUSQUEDA_POSTERIOR: string = 'POSTERIOR';
  public static L_TIPO_BUSQUEDA_ENTRE: string = 'ENTRE';
  public static L_EN_HONOR_A: string = 'En honor a';
  public static L_VISIBLE: string = 'Visible';
  public static L_VISIBLES: string = 'Visibles';
  public static L_NO_VISIBLE: string = 'No visible';
  public static L_APLAZADOS: string = 'Aplazados';
  public static L_SUSPENDIDOS: string = 'Suspendidos';
  public static L_EXTRAORDINARIO: string = 'Extraordinario';
  public static L_EXTRAORDINARIOS: string = 'Extraordinarios';
  public static L_PENDIENTE_REVISAR: string = 'Pendiente de revisar';
  public static L_PENDIENTES_REVISAR: string = 'Pendientes de revisar';
  public static L_REVISAR_NOTA: string = 'Revisar nota';
  public static L_PENDIENTE_DUPLICAR: string = 'Pendiente de duplicar';
  public static L_PENDIENTES_DUPLICAR: string = 'Pendientes de duplicar';
  public static L_PERIODICO: string = 'Periódico';
  public static L_REVISAR_TIPO_ACTO_CULTO: string = 'Rev. tipo de acto o culto';
  public static L_REVISAR_DIAS: string = 'Rev. días duración';
  public static L_REVISAR_LUGAR: string = 'Rev. lugar';
  public static L_REVISAR_TITULARES: string = 'Rev. titulares';
  public static L_REVISAR_PERSONAS: string = 'Rev. personas';
  public static L_REVISAR_BANDAS: string = 'Rev. bandas';
  public static L_REVISAR_INFORMACION: string = 'Rev. información';
  public static L_REVISAR_ITINERARIO: string = 'Rev. itinerario';
  public static L_REVISAR_REGLA: string = 'Rev. regla';
  public static L_TIENE_AVATAR: string = 'Tiene avatar';
  public static I_NO_VISIBLE: string = 'visibility_off';
  public static I_EXTRAORDINARIO: string = 'star';
  public static I_PENDIENTE_REVISAR: string = 'warning';
  // Ordenación
  public static L_ASCENDENTE: string = 'Ascendente';
  public static L_DESCENDENTE: string = 'Descendente';
  // Paginación
  public static L_POR_PAGINA: string = ' por página';
  public static L_PRIMERA_PAGINA: string = 'Primera';
  public static L_PAGINA_ANTERIOR: string = 'Anterior';
  public static L_PAGINA_SIGUIENTE: string = 'Siguiente';
  public static L_ULTIMA_PAGINA: string = 'Última';
  // Severidad (SEV)
  public static N_REVISAR_GRAVE: number = 3;
  public static N_REVISAR_MODERADA: number = this.N_REVISAR_GRAVE + 4;
  public static N_DUPLICAR_LEVE: number = -30; // Aprox. 1 mes
  public static N_DUPLICAR_MODERADA: number = this.N_DUPLICAR_LEVE - 153; // Aprox. 6 meses
  public static N_DUPLICAR_GRAVE: number = -365; // 1 año
  public static G_SEV_CRITICOS: string = 'Críticos';
  public static G_SEV_GRAVES: string = 'Graves';
  public static G_SEV_MODERADOS: string = 'Moderados';
  public static G_SEV_LEVES: string = 'Leves';
  public static L_CRITICO_ACRONIMO: string = 'C';
  public static L_GRAVE_ACRONIMO: string = 'G';
  public static L_MODERADO_ACRONIMO: string = 'M';
  public static L_LEVE_ACRONIMO: string = 'L';
  // Validaciones (VAL)
  public static G_VAL_CAMPO_OBLIGATORIO: string = 'Campo obligatorio';
  public static G_VAL_EMAIL_INVALIDO: string = 'Por favor, introduzca una dirección de email válida';
  public static G_VAL_PASSWORD_DIFERENTE: string = 'Las contraseñas no coinciden';
  public static G_VAL_SIN_REGLA: string = 'Falta la regla';
  public static G_VAL_SIN_RESULTADOS_TABLA: string = 'No hay datos que coincidan con los criterios de búsqueda.';
  // Otros (OTR)
  public static G_OTR_TOTAL: string = 'Total';
  public static G_OTR_TOTALES: string = 'Totales';
  public static I_SIEMPRE: string = 'calendar_month';
  public static I_HOY: string = 'today';
  public static L_MUSICA: string = 'Música';
  public static L_FILTRO_BUSQUEDA: string = 'Filtro de búsqueda';
  public static L_FILTRO_BUSQUEDA_PLACEHOLDER: string = 'Escriba para filtrar';
  public static L_FILTRO_SELECT_PLACEHOLDER: string = 'Filtrar...';
  public static I_CHECK: string = 'check';
  public static I_FECHA: string = 'event';
  public static I_PASSWORD: string = 'vpn_key';
  public static I_REGLA: string = 'menu_book';
  public static I_HREF: string = 'open_in_new';
  public static I_ERROR: string = 'error';
  public static I_VOLVER: string = 'arrow_back';

  // Listados (LIST)
  public static P_LIST_TITULO: string = 'Gestión de ';
  public static P_LIST_DESCRIPCION: string = 'Búsqueda y listado de ';
}
