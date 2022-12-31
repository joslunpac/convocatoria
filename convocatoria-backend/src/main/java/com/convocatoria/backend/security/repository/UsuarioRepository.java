package com.convocatoria.backend.security.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.convocatoria.backend.security.model.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

	Optional<Usuario> findByEmail(String email);

	boolean existsByEmail(String email);

	/**
	 * Actualiza la contraseña del usuario.
	 * 
	 * @param id            Identificador del usuario.
	 * @param nuevoPassword Contraseña cifrada del usuario.
	 */
	@Modifying
	@Query("update Usuario usu set usu.password = :nuevoPassword where usu.id = :id")
	void updatePassword(@Param("id") Long id, @Param("nuevoPassword") String nuevoPassword);

}
