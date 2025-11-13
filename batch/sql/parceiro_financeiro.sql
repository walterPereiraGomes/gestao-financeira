CREATE TABLE transacoes.parceiro_financeiro (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL
);

INSERT INTO transacoes.parceiro_financeiro (nome) VALUES ('Nubank');
INSERT INTO transacoes.parceiro_financeiro (nome) VALUES ('Inter');
INSERT INTO transacoes.parceiro_financeiro (nome) VALUES ('Will Bank');

