package com.convocatoria.backend.model.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.EntityListeners;
import javax.persistence.MappedSuperclass;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.ColumnDefault;
import org.springframework.data.annotation.CreatedBy;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedBy;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@EntityListeners(AuditingEntityListener.class)
@NoArgsConstructor
@MappedSuperclass
public class Auditoria implements Serializable {

	@CreatedBy
    @NotNull
    @Column(name = "usuario_creacion", updatable = false)
    private String usuarioCreacion;

    @CreatedDate
    @NotNull
	@ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_creacion", updatable = false)
    private LocalDateTime fechaCreacion;

    @LastModifiedBy
    @NotNull
    @Column(name = "usuario_modificacion")
    private String usuarioModificacion;

    @LastModifiedDate
    @NotNull
	@ColumnDefault("CURRENT_TIMESTAMP")
    @Column(name = "fecha_modificacion")
    private LocalDateTime fechaModificacion;

}
