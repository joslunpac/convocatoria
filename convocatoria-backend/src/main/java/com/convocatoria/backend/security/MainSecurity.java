package com.convocatoria.backend.security;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.convocatoria.backend.security.jwt.JwtEntryPoint;
import com.convocatoria.backend.security.jwt.JwtTokenFilter;
import com.convocatoria.backend.security.service.UserDetailsServiceImpl;
import com.convocatoria.backend.util.Constantes;

@Configuration
@EnableWebSecurity
public class MainSecurity extends WebSecurityConfigurerAdapter {
    
    @Autowired
    UserDetailsServiceImpl userDetailsServiceImpl;
    
    @Autowired
    JwtEntryPoint jwtEntryPoint;

    @Bean
    JwtTokenFilter jwtTokenFilter() {
        return new JwtTokenFilter();
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }

    @Override
    protected AuthenticationManager authenticationManager() throws Exception {
        return super.authenticationManager();
    }

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsServiceImpl).passwordEncoder(passwordEncoder());
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        // Habilitamos cors
        http.cors();

        // Deshabilitamos CSRF (falsificación de solicitud entre sitios)
        http.csrf().disable();

        // Puntos de entrada
        http.authorizeRequests()//
                .antMatchers(Constantes.URI_AUTH + "/**").permitAll()//
                .antMatchers(Constantes.URI_CUENTA).authenticated()//
                .antMatchers(Constantes.URI_PRIVATE + "/**").hasAnyRole("ADMINISTRADOR", "MODERADOR")//
                .antMatchers(HttpMethod.POST, "/**").hasRole("ADMINISTRADOR")//
                .antMatchers(HttpMethod.PUT, "/**").hasRole("ADMINISTRADOR")//
                .antMatchers(HttpMethod.DELETE, "/**").hasRole("ADMINISTRADOR")//
                .anyRequest().permitAll();

        // Si un usuario intenta acceder a un recurso sin tener suficientes permisos
        http.exceptionHandling().accessDeniedPage(Constantes.URI_AUTH + "/signin");

        // Establecemos el punto de entrada de autenticación
        http.exceptionHandling().authenticationEntryPoint(jwtEntryPoint);

        // Spring Security no creará ni utilizará ninguna sesión
        http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);

        // Agregamos el JWTFilter antes del filtro UsernamePassword para asegurarse de que el token JWT se autentique primero.
        http.addFilterBefore(jwtTokenFilter(), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        final CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("*")); // Permitimos todos los orígenes
        configuration.setAllowedMethods(Arrays.asList("HEAD", "GET", "POST", "PUT", "DELETE", "PATCH")); // Permitimos todos los métodos
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Cache-Control", "Content-Type"));
        final UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

}
