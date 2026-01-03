package dev.kerim.fettahoglu.financial_helper_cli.repo;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StockRepository extends JpaRepository<Stock, Long> {

}
