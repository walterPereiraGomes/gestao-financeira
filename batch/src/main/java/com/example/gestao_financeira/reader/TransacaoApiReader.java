package com.example.gestao_financeira.reader;

import com.example.gestao_financeira.dto.TransacaoApiDTO;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import jakarta.annotation.PostConstruct;
import org.springframework.batch.item.ItemReader;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;

@Component
public class TransacaoApiReader implements ItemReader<TransacaoApiDTO> {

    @Value("${api.transacoes.url.nubank}")
    private String apiNubankUrl;

    @Value("${api.transacoes.url.inter}")
    private String apiInterUrl;

    @Value("${api.transacoes.url.willbank}")
    private String apiWillbankUrl;

    private List<TransacaoApiDTO> transacoes;
    private int currentIndex = 0;

    private List<String> apis;
    private Integer indexApi = 0;
    private boolean buscarNovaApi = true;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public TransacaoApiReader() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @PostConstruct
    public void initApis() {
        this.apis = List.of(apiNubankUrl, apiInterUrl, apiWillbankUrl);
    }

    @Override
    public TransacaoApiDTO read() throws Exception {

        if (buscarNovaApi) {
            loadTransacoesFromApi(apis.get(indexApi));
            buscarNovaApi = false;
        }

        if (currentIndex < transacoes.size()) {
            return transacoes.get(currentIndex++);
        } else if (indexApi < apis.size() -1){
            buscarNovaApi = true;
            indexApi++;
            currentIndex = 0;
            return new TransacaoApiDTO();
        }

        return null;
    }

    private void loadTransacoesFromApi(String urlApi) {
        try {
            System.out.println("============= Lendo da api: " + urlApi + "==============");
            String jsonResponse = restTemplate.getForObject(urlApi, String.class);
            transacoes = objectMapper.readValue(jsonResponse, new TypeReference<List<TransacaoApiDTO>>() {});
            transacoes = transacoes.stream().map(transacaoApiDTO -> {
                transacaoApiDTO.setParceiroId(getParceiroByUrl(urlApi));
                return transacaoApiDTO;
            }).toList();
        } catch (Exception e) {
            transacoes = new ArrayList<>();
            throw new RuntimeException("Erro ao buscar transações da API", e);
        }
    }

    private Long getParceiroByUrl(String url) {
        if (url.contains("nubank")) {
            return 1L;
        } else if (url.contains("inter")) {
            return 2L;
        } else {
            return 3L;
        }
    }
}


