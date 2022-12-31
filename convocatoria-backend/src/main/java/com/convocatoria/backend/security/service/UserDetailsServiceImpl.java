package com.convocatoria.backend.security.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.convocatoria.backend.exception.MyNotFoundException;
import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.model.entity.UsuarioPrincipal;
import com.convocatoria.backend.util.Constantes;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UsuarioService usuarioService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario usuario = usuarioService.findByEmail(email).orElseThrow(
                () -> new MyNotFoundException(Constantes.USUARIO + ' ' + email + Constantes.NO_ENCONTRADO));
        return UsuarioPrincipal.construir(usuario);
    }

}
