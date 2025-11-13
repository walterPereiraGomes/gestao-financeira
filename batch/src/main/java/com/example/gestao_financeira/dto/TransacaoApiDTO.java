package com.example.gestao_financeira.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoApiDTO {

    private String id;

    private UsuarioApiDTO usuario;

    @JsonProperty("cnpj_empresa")
    private String cnpjEmpresa;

    private BigDecimal valor;

    private LocalDate data;

    private Long parceiroId;
}

