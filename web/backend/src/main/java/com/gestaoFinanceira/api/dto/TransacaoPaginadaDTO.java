package com.gestaoFinanceira.api.dto;

import com.gestaoFinanceira.api.entity.Transacao;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TransacaoPaginadaDTO {
    private Integer totalPaginas;
    private List<Transacao> itens;
    private Integer quantidadeTotal;
}
