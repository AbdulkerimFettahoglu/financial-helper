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
public class Stock {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PERSON_ID", nullable = false)
    private Person person;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "PRODUCT_ID", nullable = false)
    private Product product;

    @Column(precision = 19, scale = 6)
    private BigDecimal currentAmount;

    @Column(precision = 19, scale = 6)
    private BigDecimal medianCostTl;

    @Column(precision = 19, scale = 6)
    private BigDecimal medianCostDollar;

    @Column(precision = 19, scale = 6)
    private BigDecimal medianSellTl;

    @Column(precision = 19, scale = 6)
    private BigDecimal medianSellDollar;

    @Column
    private boolean isActive;

    @Column
    private LocalDateTime createDate;

    @Column
    private LocalDateTime updateDate;

}