package dev.kerim.fettahoglu.financial_helper_cli.web;

import dev.kerim.fettahoglu.financial_helper_cli.dto.CreateTransactionDto;
import dev.kerim.fettahoglu.financial_helper_cli.entity.Person;
import dev.kerim.fettahoglu.financial_helper_cli.entity.Product;
import dev.kerim.fettahoglu.financial_helper_cli.entity.Transaction;
import dev.kerim.fettahoglu.financial_helper_cli.entity.TransactionType;
import dev.kerim.fettahoglu.financial_helper_cli.repo.PersonRepository;
import dev.kerim.fettahoglu.financial_helper_cli.repo.ProductRepository;
import dev.kerim.fettahoglu.financial_helper_cli.repo.TransactionRepository;
import dev.kerim.fettahoglu.financial_helper_cli.service.PersonService;
import dev.kerim.fettahoglu.financial_helper_cli.service.TransactionManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class TestController {

    private final PersonService personService;
    private final PersonRepository personRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final TransactionManagementService transactionManagementService;

    @GetMapping("/fdsa")
    public void fdsa() {
        Person nur = personRepository.findByName("Kerim").get();
        Product tmg = productRepository.findByShortname("TMG").get();
        List<Transaction> ls = transactionRepository.findAll();
        transactionRepository.deleteAll(ls);
        CreateTransactionDto tx1 = new CreateTransactionDto(nur.getId(), tmg.getId(), new BigDecimal(40853), new BigDecimal(0.73476), BigDecimal.ONE, TransactionType.BUY);
        CreateTransactionDto tx2 = new CreateTransactionDto(nur.getId(), tmg.getId(), new BigDecimal(25953), new BigDecimal(0.77035), BigDecimal.ONE, TransactionType.BUY);
        CreateTransactionDto tx3 = new CreateTransactionDto(nur.getId(), tmg.getId(), new BigDecimal(17325), new BigDecimal(0.86600), BigDecimal.ONE, TransactionType.BUY);
        CreateTransactionDto tx4 = new CreateTransactionDto(nur.getId(), tmg.getId(), new BigDecimal(35760), new BigDecimal(0.95968), BigDecimal.ONE, TransactionType.SELL);
        transactionManagementService.addTransaction(tx1);
        transactionManagementService.addTransaction(tx2);
        transactionManagementService.addTransaction(tx3);
        transactionManagementService.addTransaction(tx4);
    }

}
