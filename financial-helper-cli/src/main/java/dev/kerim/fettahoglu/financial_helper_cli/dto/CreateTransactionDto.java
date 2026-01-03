package dev.kerim.fettahoglu.financial_helper_cli.dto;

import dev.kerim.fettahoglu.financial_helper_cli.entity.TransactionType;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CreateTransactionDto {

    private Long personId;
    private Long productId;
    private BigDecimal amount;
    private BigDecimal priceTl;
    private BigDecimal priceDollar;
    private TransactionType type;

}
