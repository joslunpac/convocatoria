import { Evento } from "./evento";

export interface ResultadoEventos {
  totalItems: number;
  totalPaginas: number;
	paginaActual: number;
	esPrimera: boolean;
	esUltima: boolean;
	hayAnterior: boolean;
	hayPosterior: boolean;
	items: Evento[];
}
