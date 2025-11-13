package com.gestaoFinanceira.api.entity;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "parceiro_financeiro", schema = "transacoes")
@Data
@NoArgsConstructor
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
