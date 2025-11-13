package com.example.gestao_financeira.writer;

import com.example.gestao_financeira.model.Transacao;
import com.example.gestao_financeira.repository.TransacaoRepository;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.stereotype.Component;

@Component
public class TransacaoWriter implements ItemWriter<Transacao> {

    private final TransacaoRepository transacaoRepository;

    public TransacaoWriter(TransacaoRepository transacaoRepository) {

        this.transacaoRepository = transacaoRepository;
    }

    @Override
    public void write(Chunk<? extends Transacao> chunk) throws Exception {
        transacaoRepository.saveAll(chunk.getItems());
    }
}


