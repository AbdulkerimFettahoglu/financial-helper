package dev.kerim.fettahoglu.financial_helper_cli.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Transaction {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERSON_ID", nullable = false)
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @Column(nullable = false, precision = 19, scale = 6)
    private BigDecimal amount;

    @Column(precision = 19, scale = 6)
    private BigDecimal priceTl;

    @Column(precision = 19, scale = 6)
    private BigDecimal totalCostTl;

    @Column(precision = 19, scale = 6)
    private BigDecimal priceDollar;

    @Column(precision = 19, scale = 6)
    private BigDecimal totalCostDollar;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type;

    @Column(nullable = false)
    private LocalDateTime createDate;
}