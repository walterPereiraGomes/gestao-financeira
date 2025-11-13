package com.example.gestao_financeira.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "parceiro_financeiro", schema = "transacoes")
@Data
public class ParceiroFinanceiro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    public ParceiroFinanceiro(Long id) {
        this.id = id;
    }
}

