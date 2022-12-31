package com.convocatoria.backend.security.jwt;

import java.text.ParseException;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.convocatoria.backend.security.model.dto.JwtDto;
import com.convocatoria.backend.security.model.entity.Rol;
import com.convocatoria.backend.security.model.entity.Usuario;
import com.convocatoria.backend.security.model.enumerate.RolEnum;
import com.nimbusds.jwt.JWT;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.JWTParser;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;

@Component
public class JwtProvider {

    private final static Logger logger = LoggerFactory.getLogger(JwtProvider.class);

    @Value("${jwt.secret}")
    String secret;

    @Value("${jwt.expiration}")
    int expiration;

    public String generarToken(Usuario usuarioAutenticado){
        List<RolEnum> roles = usuarioAutenticado.getRoles().stream().map(Rol::getNombre).collect(Collectors.toList());

        return Jwts.builder()
            .setSubject(usuarioAutenticado.getEmail())
            .claim("avatar", usuarioAutenticado.getAvatar())
            .claim("nombreUsuario", usuarioAutenticado.getNombre())
            .claim("roles", roles)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(SignatureAlgorithm.HS512, secret.getBytes())
            .compact();
    }

    public boolean validarToken(String token){
        try {
            Jwts.parser().setSigningKey(secret.getBytes()).parseClaimsJws(token);
            return true;
        } catch (MalformedJwtException e) {
            logger.error("Error validando el token. Token mal formado: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            logger.error("Error validando el token. Token no soportado: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            logger.error("Error validando el token. Token expirado: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            logger.error("Error validando el token. Token vacío: " + e.getMessage());
        } catch (SignatureException e) {
            logger.error("Error validando el token. Fallo en la firma: " + e.getMessage());
        }

        return false;
    }

    @SuppressWarnings("unchecked")
    public String refrescarToken(JwtDto jwtDto) throws ParseException {
        try {
            Jwts.parser().setSigningKey(secret.getBytes()).parseClaimsJws(jwtDto.getToken());
        } catch(ExpiredJwtException e) {
            JWT jwt = JWTParser.parse(jwtDto.getToken());
            JWTClaimsSet claims = jwt.getJWTClaimsSet();
            String email = claims.getSubject();
            String avatar = (String) claims.getClaim("avatar");
            String nombreUsuario = (String) claims.getClaim("nombreUsuario");
            List<String> roles = (List<String>) claims.getClaim("roles");
    
            return Jwts.builder()
                .setSubject(email)
                .claim("avatar", avatar)
                .claim("nombreUsuario", nombreUsuario)
                .claim("roles", roles)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(SignatureAlgorithm.HS512, secret.getBytes())
                .compact();
        }

        return null;
    }

    public String obtenerEmailDeToken(String token){
        return Jwts.parser().setSigningKey(secret.getBytes()).parseClaimsJws(token).getBody().getSubject();
    }

}
