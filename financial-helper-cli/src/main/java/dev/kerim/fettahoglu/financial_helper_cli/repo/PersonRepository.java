package dev.kerim.fettahoglu.financial_helper_cli.repo;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Person;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PersonRepository extends JpaRepository<Person, Long> {

    Optional<Person> findByName(String name);

}
