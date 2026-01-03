package dev.kerim.fettahoglu.financial_helper_cli;

import dev.kerim.fettahoglu.financial_helper_cli.entity.Person;
import dev.kerim.fettahoglu.financial_helper_cli.repo.PersonRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class FinancialHelperCliApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinancialHelperCliApplication.class, args);
	}

	private final PersonRepository personRepository;

	@PostConstruct
	void postConstruct() {
		Person p1 = new Person();
		p1.setName("Kerim");
		personRepository.save(p1);
	}

}
