import { OverlayContainer } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';

const STORAGE_LOCAL_TEMA_OSCURO = 'tema';
const NOMBRE_TEMA_OSCURO = 'tema-oscuro';

@Injectable()
export class TemaService {
  constructor(private overlay: OverlayContainer) {}

  // Aplicamos el tema oscuro, guardandolo en el almacenamiento local
  aplicarTemaOscuro(): void {
    window.localStorage.removeItem(STORAGE_LOCAL_TEMA_OSCURO);
    window.localStorage.setItem(STORAGE_LOCAL_TEMA_OSCURO, NOMBRE_TEMA_OSCURO);
    this.aplicarTemaOscuroAOtrosComponentes();
  }

  // Aplicamos el tema claro, eliminando el tema oscuro del almacenamiento local
  aplicarTemaClaro(): void {
    window.localStorage.removeItem(STORAGE_LOCAL_TEMA_OSCURO);
    this.aplicarTemaOscuroAOtrosComponentes();
  }

  // Comprobamos si existe el tema oscuro en el almacenamiento local
  comprobarSiTemaOscuro(): string | null {
    return window.localStorage.getItem(STORAGE_LOCAL_TEMA_OSCURO);
  }

  // Agregamos el modo oscuro al contenedor de superposición de forma dinámica a través del código,
  // ya que algunos componentes de Angular Material, como el cuadro de diálogo y el menú flotante,
  // se representan en un contenedor de superposición, en lugar de la jerarquía del componente raíz.
  // Entonces, cuándo aplica el modo oscuro, no se aplicará a ellos
  aplicarTemaOscuroAOtrosComponentes(): void {
    if (this.comprobarSiTemaOscuro() != null) {
      this.overlay.getContainerElement().classList.add(NOMBRE_TEMA_OSCURO);
    } else {
      this.overlay.getContainerElement().classList.remove(NOMBRE_TEMA_OSCURO);
    }
  }
}
