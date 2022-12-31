export interface ItemMenu {
  ruta?: string;
  nombre?: string;
  descripcion?: string;
  icono?: string;
  separador?: boolean;
  menus?: ItemMenu[];
  visible: boolean;
}
