package dev.kerim.fettahoglu.financial_helper_cli.repo;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByShortname(String shortname);

}
