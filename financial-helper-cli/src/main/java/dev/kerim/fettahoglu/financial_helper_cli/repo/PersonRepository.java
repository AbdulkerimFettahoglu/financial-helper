package dev.kerim.fettahoglu.financial_helper_cli.repo;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonRepository extends JpaRepository<Person, Long> {

}
