package com.gestaoFinanceira.api.entity;

import jakarta.persistence.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "transacao", schema = "transacoes")
@Data
public class Transacao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "parceiro_id", nullable = false)
    private ParceiroFinanceiro parceiro;

    @Column(precision = 15, scale = 2)
    private BigDecimal valor;

    @Column(length = 100)
    private String categoria;

    @Column(name = "data_transacao", nullable = false)
    private LocalDate dataTransacao;
}

