package com.bulkplaintshirt.core;

import com.bulkplaintshirt.core.model.Product;
import com.bulkplaintshirt.core.repository.ProductRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

import java.math.BigDecimal;

@SpringBootApplication
public class CoreApplication {
    public static void main(String[] args) {
        SpringApplication.run(CoreApplication.class, args);
    }

    @Bean
    public CommandLineRunner initData(ProductRepository productRepository) {
        return args -> {
            if (productRepository.count() == 0) {
                Product product1 = new Product();
                product1.setName("Classic White Tee");
                product1.setDescription("Premium 180 GSM 100% Cotton Plain White T-Shirt");
                product1.setPriceMoreThan9(new BigDecimal("150.00"));
                product1.setPriceLessThan9(new BigDecimal("180.00"));
                product1.setSize("L");
                product1.setColor("White");
                product1.setMaterial("Cotton");
                product1.setImageUrl("https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800");
                product1.setStockQuantity(500);
                productRepository.save(product1);

                Product product2 = new Product();
                product2.setName("Classic Black Tee");
                product2.setDescription("Premium 180 GSM 100% Cotton Plain Black T-Shirt");
                product2.setPriceMoreThan9(new BigDecimal("150.00"));
                product2.setPriceLessThan9(new BigDecimal("180.00"));
                product2.setSize("M");
                product2.setColor("Black");
                product2.setMaterial("Cotton");
                product2.setImageUrl("https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800");
                product2.setStockQuantity(450);
                productRepository.save(product2);

                System.out.println("Dummy products created successfully!");
            }
        };
    }
}
