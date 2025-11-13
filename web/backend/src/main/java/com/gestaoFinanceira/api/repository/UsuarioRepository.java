package com.gestaoFinanceira.api.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.gestaoFinanceira.api.entity.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, String> {

}
