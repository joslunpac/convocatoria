package com.convocatoria.backend.util;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.convocatoria.backend.model.dto.CaracterDto;
import com.convocatoria.backend.model.dto.EntidadDto;
import com.convocatoria.backend.model.dto.EventoDto;
import com.convocatoria.backend.model.dto.LugarDto;
import com.convocatoria.backend.model.dto.PersonaDto;
import com.convocatoria.backend.model.dto.TipoActoCultoDto;
import com.convocatoria.backend.model.dto.TipoBandaDto;
import com.convocatoria.backend.model.dto.TipoEntidadDto;
import com.convocatoria.backend.model.dto.TitularDto;
import com.convocatoria.backend.model.entity.Caracter;
import com.convocatoria.backend.model.entity.Entidad;
import com.convocatoria.backend.model.entity.Evento;
import com.convocatoria.backend.model.entity.Lugar;
import com.convocatoria.backend.model.entity.Persona;
import com.convocatoria.backend.model.entity.TipoActoCulto;
import com.convocatoria.backend.model.entity.TipoBanda;
import com.convocatoria.backend.model.entity.TipoEntidad;
import com.convocatoria.backend.model.entity.Titular;
import com.convocatoria.backend.security.model.dto.RolDto;
import com.convocatoria.backend.security.model.dto.UsuarioDto;
import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.model.entity.Usuario;

@Component
public class Mappers {

    @Autowired
    Utilidades utilidades;

    @Autowired
    ModelMapper modelMapper;

    public CaracterDto convertToDto(Caracter caracter) {
        return modelMapper.map(caracter, CaracterDto.class);
    }

    public Caracter convertToEntity(CaracterDto caracter) {
        return modelMapper.map(caracter, Caracter.class);
    }

    public EntidadDto convertToDto(Entidad entidad) {
        return modelMapper.map(entidad, EntidadDto.class);
    }

    public Entidad convertToEntity(EntidadDto entidad) {
        return modelMapper.map(entidad, Entidad.class);
    }

    public EventoDto convertToDto(Evento evento) {
        EventoDto eventoDto = modelMapper.map(evento, EventoDto.class);
        utilidades.calcularEstado(eventoDto);
        return eventoDto;
    }

    public Evento convertToEntity(EventoDto evento) {
        return modelMapper.map(evento, Evento.class);
    }

    public LugarDto convertToDto(Lugar lugar) {
        return modelMapper.map(lugar, LugarDto.class);
    }

    public Lugar convertToEntity(LugarDto lugar) {
        return modelMapper.map(lugar, Lugar.class);
    }

    public PersonaDto convertToDto(Persona persona) {
        return modelMapper.map(persona, PersonaDto.class);
    }

    public Persona convertToEntity(PersonaDto persona) {
        return modelMapper.map(persona, Persona.class);
    }

    public RolDto convertToDto(Rol rol) {
        return modelMapper.map(rol, RolDto.class);
    }

    public Rol convertToEntity(RolDto rol) {
        return modelMapper.map(rol, Rol.class);
    }

    public TipoActoCultoDto convertToDto(TipoActoCulto tipoActoCulto) {
        return modelMapper.map(tipoActoCulto, TipoActoCultoDto.class);
    }

    public TipoActoCulto convertToEntity(TipoActoCultoDto tipoActoCulto) {
        return modelMapper.map(tipoActoCulto, TipoActoCulto.class);
    }

    public TipoBandaDto convertToDto(TipoBanda tipoBanda) {
        return modelMapper.map(tipoBanda, TipoBandaDto.class);
    }

    public TipoBanda convertToEntity(TipoBandaDto tipoBanda) {
        return modelMapper.map(tipoBanda, TipoBanda.class);
    }

    public TipoEntidadDto convertToDto(TipoEntidad tipoEntidad) {
        return modelMapper.map(tipoEntidad, TipoEntidadDto.class);
    }

    public TipoEntidad convertToEntity(TipoEntidadDto tipoEntidad) {
        return modelMapper.map(tipoEntidad, TipoEntidad.class);
    }

    public TitularDto convertToDto(Titular titular) {
        return modelMapper.map(titular, TitularDto.class);
    }

    public Titular convertToEntity(TitularDto titular) {
        return modelMapper.map(titular, Titular.class);
    }

    public UsuarioDto convertToDto(Usuario usuario) {
        return modelMapper.map(usuario, UsuarioDto.class);
    }

    public Usuario convertToEntity(UsuarioDto usuario) {
        return modelMapper.map(usuario, Usuario.class);
    }

}
