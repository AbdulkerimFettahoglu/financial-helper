package dev.kerim.fettahoglu.financial_helper_cli.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Optional;

@Component
@ConditionalOnProperty(
        name = "cli.enabled",
        havingValue = "true"
)
@RequiredArgsConstructor
@Slf4j
class AppRunner implements CommandLineRunner {

    @Value("${names}")
    private String names;

    private final PersonService personService;

    @Override
    public void run(String... args) {
        if (args.length == 0) {
            printHelp();
            System.exit(0);
        }

        if (Optional.ofNullable(names).isPresent()) {
            Arrays.stream(names.split(",")).forEach(personService::savePerson);
        }
        log.info(personService.dumpPersonNames());

        String cmd = args[0];
        switch (cmd) {
            case "help":
            default:
                printHelp();
        }

        // CLI uygulaması olduğundan programı bitiriyoruz.
        System.exit(0);
    }

    private void printHelp() {
        log.info("Kullanım:");
        log.info("  --names=name1,name2        - Person isimlerini ayarlar");
    }
}