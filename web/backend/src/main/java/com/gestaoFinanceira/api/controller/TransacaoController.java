package com.gestaoFinanceira.api.controller;

import com.gestaoFinanceira.api.dto.TransacaoPaginadaDTO;
import com.gestaoFinanceira.api.service.TransacaoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/transacoes")
@RequiredArgsConstructor
public class TransacaoController {

    private final TransacaoService transacaoService;

    @GetMapping("/paginadas")
    public ResponseEntity<TransacaoPaginadaDTO> transacoesPaginadas(
            @AuthenticationPrincipal Jwt jwt,
            @RequestParam("page") Integer page,
            @RequestParam("pageSize") Integer pageSize) {
                UUID idKeycloak = UUID.fromString(jwt.getSubject());
        return ResponseEntity.ok(transacaoService.getTransacoesPaginadas(idKeycloak, page, pageSize));
    }

}
