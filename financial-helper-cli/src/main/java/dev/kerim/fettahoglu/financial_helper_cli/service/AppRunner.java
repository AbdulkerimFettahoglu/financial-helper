package dev.kerim.fettahoglu.financial_helper_cli.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Component;

@Component
@ConditionalOnProperty(
        name = "cli.enabled",
        havingValue = "true",
        matchIfMissing = false
)
class AppRunner implements CommandLineRunner {

    @Autowired
    private PersonService personService;

    @Override
    public void run(String... args) throws Exception {
        if (args.length == 0) {
            printHelp();
            System.exit(0);
        }

        String cmd = args[0];

        switch (cmd) {
            case "greet":
                String name = args.length > 1 ? args[1] : "Dünya";
                System.out.println(name);
                break;

            case "sum":
                if (args.length < 2) {
                    System.out.println("sum için sayılar girin. Örnek: sum 1 2 3");
                    break;
                }
                double total = 0;
                try {
                    for (int i = 1; i < args.length; i++) {
                        total += Double.parseDouble(args[i]);
                    }
                    System.out.println("Toplam: " + total);
                } catch (NumberFormatException e) {
                    System.out.println("Sayı format hatası: " + e.getMessage());
                }
                break;

            case "help":
            default:
                printHelp();
        }

        // CLI uygulaması olduğundan programı bitiriyoruz.
        System.exit(0);
    }

    private void printHelp() {
        System.out.println("Kullanım:");
        System.out.println("  greet [isim]        - Selam verir (varsayılan: Dünya)");
        System.out.println("  sum n1 n2 ...       - Verilen sayıların toplamını hesaplar");
        System.out.println("  help                - Yardım gösterir");
    }
}