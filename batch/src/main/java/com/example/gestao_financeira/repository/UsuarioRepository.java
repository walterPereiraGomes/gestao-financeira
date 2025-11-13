package com.example.gestao_financeira.repository;

import com.example.gestao_financeira.model.Transacao;
import com.example.gestao_financeira.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {

    @Query(value = "SELECT * FROM informacoes_pessoais.usuario WHERE cpf = ?1", nativeQuery = true)
    Optional<Usuario> getByCpf(String cpf);
}

