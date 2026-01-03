package dev.kerim.fettahoglu.financial_helper_cli;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@RequiredArgsConstructor
public class FinancialHelperCliApplication {

	public static void main(String[] args) {
		SpringApplication.run(FinancialHelperCliApplication.class, args);
	}

}
