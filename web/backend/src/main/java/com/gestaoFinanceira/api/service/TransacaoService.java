package com.gestaoFinanceira.api.service;

import com.gestaoFinanceira.api.dto.TransacaoPaginadaDTO;
import com.gestaoFinanceira.api.repository.TransacaoRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@AllArgsConstructor
public class TransacaoService {

    private final TransacaoRepository transacaoRepository;

    public TransacaoPaginadaDTO getTransacoesPaginadas(UUID idKeycloak, Integer pagina, Integer itensPorPagina) {
        var count = transacaoRepository.countTransacoesPaginadas(idKeycloak, pagina, itensPorPagina);
        var itens = transacaoRepository.getTransacoesPaginadas(idKeycloak, pagina, itensPorPagina);
        var transacaoPaginada = new TransacaoPaginadaDTO();
        transacaoPaginada.setItens(itens);
        transacaoPaginada.setTotalPaginas((int) Math.ceil((double) count / itensPorPagina));
        transacaoPaginada.setQuantidadeTotal(count);
        return transacaoPaginada;
    }
}
