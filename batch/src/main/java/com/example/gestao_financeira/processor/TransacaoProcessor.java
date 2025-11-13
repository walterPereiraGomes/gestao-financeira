package com.example.gestao_financeira.processor;

import com.example.gestao_financeira.model.Transacao;
import com.example.gestao_financeira.dto.TransacaoApiDTO;
import com.example.gestao_financeira.model.Usuario;
import com.example.gestao_financeira.model.ParceiroFinanceiro;
import com.example.gestao_financeira.repository.UsuarioRepository;
import com.example.gestao_financeira.repository.ParceiroFinanceiroRepository;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TransacaoProcessor implements ItemProcessor<TransacaoApiDTO, Transacao> {

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ParceiroFinanceiroRepository parceiroFinanceiroRepository;

    @Override
    public Transacao process(TransacaoApiDTO item) throws Exception {
        if (item.getValor() == null) {
            // se o reader retornar um objeto vazio aqui, eu ignoro esse item,
            // e isso serve pro reader alterar entre os parceiros
            return null;
        }

        String categoria = categorizarPorCnpj(item.getCnpjEmpresa());

        var usuario = usuarioRepository.getByCpf(item.getUsuario().getCpf())
            .orElseGet(() -> {
                Usuario novoUsuario = new Usuario();
                novoUsuario.setCpf(item.getUsuario().getCpf());
                novoUsuario.setNome(item.getUsuario().getNome());
                novoUsuario.setEmail(item.getUsuario().getEmail());
                novoUsuario.setTelefone(item.getUsuario().getTelefone());
                return usuarioRepository.save(novoUsuario);
            });

        Transacao transacao = new Transacao();
        transacao.setUsuario(usuario);
        transacao.setParceiro(new ParceiroFinanceiro(item.getParceiroId()));
        transacao.setValor(item.getValor());
        transacao.setCategoria(categoria);
        transacao.setDataTransacao(item.getData());

        return transacao;
    }

    private String categorizarPorCnpj(String cnpj) {
        char ultimoChar = cnpj.charAt(cnpj.length() - 1);
        int ultimoDigito = Character.getNumericValue(ultimoChar);
        
        return switch (ultimoDigito) {
            case 0 -> "ALIMENTACAO";
            case 1 -> "SAUDE";
            case 2 -> "LAZER";
            case 3 -> "COMBUSTIVEL";
            case 4 -> "TRANSPORTE";
            case 5 -> "EDUCACAO";
            case 6 -> "MORADIA";
            case 7 -> "PENSAO";
            case 8 -> "MULTA";
            case 9 -> "OUTROS";
            default -> "OUTROS";
        };
    }
}


