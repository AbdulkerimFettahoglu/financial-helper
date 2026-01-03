package dev.kerim.fettahoglu.financial_helper_cli.repo;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Person;
import dev.kerim.fettahoglu.financial_helper_cli.entity.Product;
import dev.kerim.fettahoglu.financial_helper_cli.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StockRepository extends JpaRepository<Stock, Long> {

    Optional<Stock> findByPersonAndProduct(Person person, Product product);

}
