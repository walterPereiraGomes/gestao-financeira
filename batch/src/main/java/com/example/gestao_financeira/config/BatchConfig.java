package com.example.gestao_financeira.config;

import com.example.gestao_financeira.model.Transacao;
import com.example.gestao_financeira.dto.TransacaoApiDTO;
import com.example.gestao_financeira.processor.TransacaoProcessor;
import com.example.gestao_financeira.reader.TransacaoApiReader;
import com.example.gestao_financeira.writer.TransacaoWriter;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.PlatformTransactionManager;

@Configuration
public class BatchConfig {

    private final JobRepository jobRepository;
    private final PlatformTransactionManager transactionManager;
    private final TransacaoApiReader transacaoApiReader;
    private final TransacaoProcessor transacaoProcessor;
    private final TransacaoWriter transacaoWriter;

    public BatchConfig(JobRepository jobRepository,
                       PlatformTransactionManager transactionManager,
                       TransacaoApiReader transacaoApiReader,
                       TransacaoProcessor transacaoProcessor,
                       TransacaoWriter transacaoWriter) {
        this.jobRepository = jobRepository;
        this.transactionManager = transactionManager;
        this.transacaoApiReader = transacaoApiReader;
        this.transacaoProcessor = transacaoProcessor;
        this.transacaoWriter = transacaoWriter;
    }

    @Bean
    public Job processarTransacoesJob() {
        return new JobBuilder("processarTransacoesJob", jobRepository)
                .incrementer(new RunIdIncrementer())
                .start(processarTransacoesStep())
                .build();
    }

    @Bean
    public Step processarTransacoesStep() {
        return new StepBuilder("processarTransacoesStep", jobRepository)
                .<TransacaoApiDTO, Transacao>chunk(10, transactionManager)
                .reader(transacaoApiReader)
                .processor(transacaoProcessor)
                .writer(transacaoWriter)
                .allowStartIfComplete(true)
                .build();
    }
}


