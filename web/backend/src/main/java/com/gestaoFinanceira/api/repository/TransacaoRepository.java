package com.gestaoFinanceira.api.repository;

import com.gestaoFinanceira.api.entity.Transacao;
import com.gestaoFinanceira.api.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TransacaoRepository extends JpaRepository<Transacao, Long> {

    @Query(value = """
        select t.* from transacoes.transacao t
        join informacoes_pessoais.usuario u on u.id = t.usuario_id
        where u.id_keycloak = ?1
        limit ?3 offset ((?2 -1) * ?3);
    """, nativeQuery = true)
    public List<Transacao> getTransacoesPaginadas(UUID idUsuario, Integer pagina, Integer totalPaginas);

    @Query(value = """
        select count(*) from transacoes.transacao t
        join informacoes_pessoais.usuario u on u.id = t.usuario_id
        where u.id_keycloak = ?1
    """, nativeQuery = true)
    public Integer countTransacoesPaginadas(UUID idUsuario, Integer pagina, Integer totalPaginas);

}
