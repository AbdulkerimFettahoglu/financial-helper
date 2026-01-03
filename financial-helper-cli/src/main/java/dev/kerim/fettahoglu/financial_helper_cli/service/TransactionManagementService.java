package dev.kerim.fettahoglu.financial_helper_cli.service;

import dev.kerim.fettahoglu.financial_helper_cli.dto.CreateTransactionDto;
import dev.kerim.fettahoglu.financial_helper_cli.entity.*;
import dev.kerim.fettahoglu.financial_helper_cli.repo.PersonRepository;
import dev.kerim.fettahoglu.financial_helper_cli.repo.ProductRepository;
import dev.kerim.fettahoglu.financial_helper_cli.repo.StockRepository;
import dev.kerim.fettahoglu.financial_helper_cli.repo.TransactionRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class TransactionManagementService {

    private final PersonRepository personRepository;
    private final ProductRepository productRepository;
    private final TransactionRepository transactionRepository;
    private final StockRepository stockRepository;

    /**
     * TRANSACTION tablosuna yeni bir kayıt ekler.
     *
     * İşleyiş:
     * - Gönderilen {@code CreateTransactionDto tx} içindeki verilerle yeni bir {@code Transaction} oluşturulur.
     * - İlgili {@code Person} ve {@code Product} varlıkları veritabanından alınır ve Transaction ile ilişkilendirilir.
     * - Transaction veritabanına kaydedilir.
     * - Transaction kaydı oluşturulduktan sonra, aynı kişi ve ürün için {@code Stock} kaydı güncellenir; ilgili kayıt yoksa yeni bir {@code Stock} oluşturulur.
     * - {@code Stock} içindeki {@code totalCostTl}, {@code totalCostDollar}, {@code medianCostTl}, {@code medianCostDollar}
     *   alanları işlem türüne (alım / satım) göre yeniden hesaplanır:
     *   - Alım (buy) işlemlerinde stok miktarı artırılır, toplam maliyet ve medyan maliyet güncellenir.
     *   - Satım (sell) işlemlerinde stok miktarı düşürülür ve maliyetler gereken şekilde düzeltilir.
     *
     * Tutarlılık ve hata yönetimi:
     * - Metodun atomik olması beklenir (ör. çağıran servis {@code @Transactional} ile işaretlenmelidir) böylece Transaction ve Stock güncellemeleri birlikte ya başarılı olur ya da geri alınır.
     * - Eş zamanlı güncellemeler için uygun kilitleme veya optimistic locking mekanizmaları uygulanmalıdır.
     *
     * @param tx oluşturulacak transaction için gerekli alanları içeren DTO; {@code null} olamaz ve miktar/fiyat gibi zorunlu alanların doğruluğu kontrol edilmelidir
     */
    @Transactional
    public void addTransaction(CreateTransactionDto tx) {
        final BigDecimal ZERO = new BigDecimal(0);
        // 1. Person ve Product çekilir
        Person person = personRepository.findById(tx.getPersonId())
                .orElseThrow(() -> new RuntimeException("Person not found"));

        Product product = productRepository.findById(tx.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // 2. Transaction oluşturulur
        Transaction transaction = new Transaction();
        transaction.setPerson(person);
        transaction.setProduct(product);
        transaction.setAmount(tx.getAmount());
        transaction.setPriceTl(tx.getPriceTl());
        transaction.setTotalCostTl(new BigDecimal(tx.getPriceTl().doubleValue() * tx.getAmount().doubleValue()));
        transaction.setPriceDollar(tx.getPriceDollar());
        transaction.setTotalCostDollar(new BigDecimal(tx.getPriceDollar().doubleValue() * tx.getAmount().doubleValue()));
        transaction.setType(tx.getType()); // BUY / SELL
        transaction.setCreateDate(LocalDateTime.now());

        transactionRepository.save(transaction);

        // 3. Stock bulunur veya oluşturulur
        Stock stock = stockRepository
                .findByPersonAndProduct(person, product)
                .orElseGet(() -> {
                    Stock s = new Stock();
                    s.setPerson(person);
                    s.setProduct(product);
                    s.setCurrentAmount(ZERO);
                    s.setTotalCostTl(ZERO);
                    //s.setTotalCostDollar(ZERO);
                    s.setMedianCostTl(ZERO);
                    //s.setMedianCostDollar(ZERO);
                    s.setSoldAmount(ZERO);
                    s.setTotalSoldTl(ZERO);
                    //s.setTotalSoldDollar(ZERO);
                    s.setMedianSoldTl(ZERO);
                    //s.setMedianSellDollar(ZERO);
                    s.setActive(true);
                    s.setCreateDate(LocalDateTime.now());
                    return s;
                });
        stock.setUpdateDate(LocalDateTime.now());
        double quantity = tx.getAmount().doubleValue();

        // 4. BUY / SELL mantığı
        if (tx.getType() == TransactionType.BUY) {
            double addedCostTl = quantity * tx.getPriceTl().doubleValue();
            double addedCostDollar = quantity * tx.getPriceDollar().doubleValue();

            stock.setCurrentAmount(new BigDecimal(stock.getCurrentAmount().doubleValue() + quantity));
            stock.setTotalCostTl(new BigDecimal(stock.getTotalCostTl().doubleValue() + addedCostTl));
            //stock.setTotalCostDollar(new BigDecimal(stock.getTotalCostDollar().doubleValue() + addedCostDollar));
            stock.setMedianCostTl(new BigDecimal(stock.getTotalCostTl().doubleValue() / stock.getCurrentAmount().doubleValue()));

        } else if (tx.getType() == TransactionType.SELL) {

            if (stock.getCurrentAmount().doubleValue() < quantity) {
                throw new RuntimeException("Insufficient stock for sell transaction");
            }
            stock.setCurrentAmount(new BigDecimal(stock.getCurrentAmount().doubleValue() - quantity));

            double soldPriceTl = tx.getPriceTl().doubleValue();
            double totalSoldPriceTl = quantity * soldPriceTl;
            stock.setSoldAmount(new BigDecimal(stock.getSoldAmount().doubleValue() + quantity));
            stock.setTotalSoldTl(new BigDecimal(stock.getTotalSoldTl().doubleValue() + totalSoldPriceTl));
            stock.setMedianSoldTl(new BigDecimal(stock.getTotalSoldTl().doubleValue() / stock.getSoldAmount().doubleValue()));

        }

        stockRepository.save(stock);
    }
}
