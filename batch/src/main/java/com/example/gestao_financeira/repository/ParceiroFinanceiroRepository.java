package com.example.gestao_financeira.repository;

import com.example.gestao_financeira.model.ParceiroFinanceiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ParceiroFinanceiroRepository extends JpaRepository<ParceiroFinanceiro, Long> {
}

