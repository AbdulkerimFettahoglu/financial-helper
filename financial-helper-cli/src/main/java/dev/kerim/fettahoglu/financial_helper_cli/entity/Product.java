package dev.kerim.fettahoglu.financial_helper_cli.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Entity
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy= GenerationType.AUTO)
    private Long id;
    private String name;
    private String shortname;
    private AmountType amountType;
    @Column(precision = 19, scale = 6)
    private BigDecimal priceTl;
    @Column(precision = 19, scale = 6)
    private BigDecimal priceDollar;
}
