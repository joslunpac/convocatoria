package com.convocatoria.backend.util;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.convocatoria.backend.model.entity.Caracter;
import com.convocatoria.backend.model.entity.TipoEntidad;
import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.convocatoria.backend.security.service.RolService;
import com.convocatoria.backend.security.service.UsuarioService;
import com.convocatoria.backend.service.CaracterService;
import com.convocatoria.backend.service.TipoEntidadService;

/**
 * Esta clase se ejecuta cada vez que se ejecute la aplicación, y se encargará
 * de insertar en BD los datos necesarios para el correcto funcionamiento de la
 * misma
 */
@Component
public class precargarDatos implements CommandLineRunner {

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    RolService rolService;

    @Autowired
    UsuarioService usuarioService;

    @Autowired
    TipoEntidadService tipoEntidadService;

    @Autowired
    CaracterService caracterService;

    @Override
    public void run(String... args) throws Exception {
        //// AUTENTICACIÓN
        // ROLES
        if (rolService.count() == 0) {
            // Si aún no existen roles en BD, los insertamos
            rolService.save(new Rol(null, RolEnum.ROLE_ADMINISTRADOR, null));
            rolService.save(new Rol(null, RolEnum.ROLE_MODERADOR, null));
            rolService.save(new Rol(null, RolEnum.ROLE_USUARIO, null));
        }

        // USUARIOS
        if (usuarioService.count() == 0) {
            // Si aún no existen usuarios en BD, insertamos al administrador
            List<Rol> roles = new ArrayList<>();

            roles.add(rolService.findByNombre(RolEnum.ROLE_ADMINISTRADOR).get());

            usuarioService.save(
                    new Usuario(
                            null,
                            null,
                            "joslunpac@gmail.com",
                            "José María",
                            "Luna Pacheco",
                            passwordEncoder.encode("1234"),
                            roles,
                            null,
                            null,
                            null));
        }

        // Tipos de entidad
        if (tipoEntidadService.count() == 0) {
            tipoEntidadService.save(new TipoEntidad(null, "ORG", "Organismo", "Organismos"));
            tipoEntidadService.save(new TipoEntidad(null, "SED", "Sede", "Sedes"));
            tipoEntidadService.save(new TipoEntidad(null, "HER", "Hermandad", "Hermandades"));
            tipoEntidadService.save(new TipoEntidad(null, "AGR", "Agrupación o Asociación", "Agrupaciones y Asociaciones"));
            tipoEntidadService.save(new TipoEntidad(null, "BAN", "Banda", "Bandas"));
        }

        // Carácteres
        if (caracterService.count() == 0) {
            caracterService.save(new Caracter(null, "SAC", "Sacramental", null));
            caracterService.save(new Caracter(null, "GLO", "Gloria", null));
            caracterService.save(new Caracter(null, "PEN", "Penitencia", null));
        }
    }
}