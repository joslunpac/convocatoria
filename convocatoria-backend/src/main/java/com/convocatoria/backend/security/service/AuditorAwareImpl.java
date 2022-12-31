package com.convocatoria.backend.security.service;

import java.util.Optional;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.context.SecurityContextHolder;

import com.convocatoria.backend.util.Constantes;

public class AuditorAwareImpl implements AuditorAware<String> {

    @Override
    public Optional<String> getCurrentAuditor() {
        // Auditoria del usuario autenticado

        // En caso de no existir autenticación (posibles llamadas externas que no requieran autenticación),
        // se establece un usuario por defecto
		String auditor = Constantes.USUARIO_EXTERNO;

		if(SecurityContextHolder.getContext().getAuthentication() != null) {
            // Se establece el email del usuario autenticado
			auditor = SecurityContextHolder.getContext().getAuthentication().getName();
		}

		return Optional.of(auditor);
    }

}