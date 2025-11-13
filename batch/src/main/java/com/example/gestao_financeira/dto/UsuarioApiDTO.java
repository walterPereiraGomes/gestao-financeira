package com.example.gestao_financeira.dto;

import lombok.Data;

@Data
public class UsuarioApiDTO {
    private String cpf;
    private String nome;
    private String email;
    private String telefone;
}
