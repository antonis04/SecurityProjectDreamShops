package com.dailycodework.dreamshops.data;

import com.dailycodework.dreamshops.model.Category;
import com.dailycodework.dreamshops.model.Product;
import com.dailycodework.dreamshops.model.Role;
import com.dailycodework.dreamshops.model.User;
import com.dailycodework.dreamshops.repository.CategoryRepository;
import com.dailycodework.dreamshops.repository.ProductRepository;
import com.dailycodework.dreamshops.repository.RoleRepository;
import com.dailycodework.dreamshops.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;
import java.util.Set;

@Transactional
@Component
@RequiredArgsConstructor
public class DataInitializer implements ApplicationListener<ApplicationReadyEvent> {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;

    @Override
    public void onApplicationEvent(ApplicationReadyEvent event) {
        Set<String> defaultRoles = Set.of("ROLE_ADMIN", "ROLE_USER");
        createDefaultRoleIfNotExist(defaultRoles);
        createDefaultUserIfNotExist();
        createDefaultAdminIfNotExist();
        createDefaultProductsIfNotExist();
    }



    private void createDefaultUserIfNotExist() {
        Role userRole = roleRepository.findByRoleName("ROLE_USER").get();
        for (int i = 0; i < 5; i++) {
            String defaultEmail = "user" + i + "@email.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            User user = new User();
            user.setFirstName("The User");
            user.setLastName("User" + i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRoles(Set.of(userRole));
            userRepository.save(user);
            System.out.println("Default user: " + i + " created");
        }
    }


    private void createDefaultAdminIfNotExist() {
        Role adminRole = roleRepository.findByRoleName("ROLE_ADMIN").get();
        for (int i = 0; i < 2; i++) {
            String defaultEmail = "admin" + i + "@email.com";
            if (userRepository.existsByEmail(defaultEmail)) {
                continue;
            }
            User user = new User();
            user.setFirstName("Admin");
            user.setLastName("User" + i);
            user.setEmail(defaultEmail);
            user.setPassword(passwordEncoder.encode("123456"));
            user.setRoles(Set.of(adminRole));
            userRepository.save(user);
            System.out.println("Default admin user: " + i + " created");
        }
    }


    private void createDefaultRoleIfNotExist(Set<String> roles) {
        roles.stream()
                .filter(role -> roleRepository.findByRoleName(role).isEmpty())
                .map(Role::new).forEach(roleRepository::save);
    }


    private void createDefaultProductsIfNotExist() {
        if (productRepository.count() > 0) {
            return;
        }
        Category electronics = resolveCategory("Electronics");
        Category fashion = resolveCategory("Fashion");
        Category home = resolveCategory("Home");
        Category books = resolveCategory("Books");

        List<Product> seed = List.of(
                product("Aurora Wireless Headphones", "SoundWave", "129.99", 25,
                        "Over-ear headphones with active noise cancelling and 30h battery life.", electronics),
                product("Pulse Smartwatch", "TechNova", "199.00", 18,
                        "Fitness tracking, heart-rate monitor and always-on display.", electronics),
                product("Lumen 4K Monitor", "ViewMax", "329.50", 12,
                        "27-inch 4K UHD monitor with slim bezels and USB-C.", electronics),
                product("Everyday Denim Jacket", "Northbound", "79.90", 40,
                        "Classic-fit denim jacket made from organic cotton.", fashion),
                product("Runner Pro Sneakers", "Stride", "94.99", 30,
                        "Lightweight cushioned sneakers for daily training.", fashion),
                product("Merino Wool Beanie", "Northbound", "24.99", 60,
                        "Soft, warm beanie in breathable merino wool.", fashion),
                product("Ceramic Pour-Over Set", "BrewHaus", "44.00", 22,
                        "Hand-glazed ceramic dripper with matching carafe.", home),
                product("Linen Throw Blanket", "Cozynest", "59.00", 15,
                        "Stonewashed pure-linen throw, 130 x 170 cm.", home),
                product("Clean Code", "Prentice Hall", "38.50", 50,
                        "A handbook of agile software craftsmanship by Robert C. Martin.", books),
                product("The Pragmatic Programmer", "Addison-Wesley", "42.00", 35,
                        "Your journey to mastery, 20th anniversary edition.", books)
        );
        productRepository.saveAll(seed);
        System.out.println(seed.size() + " demo products created");
    }

    private Category resolveCategory(String name) {
        Category existing = categoryRepository.findByName(name);
        return existing != null ? existing : categoryRepository.save(new Category(name));
    }

    private Product product(String name, String brand, String price, int inventory,
                            String description, Category category) {
        return new Product(name, brand, new BigDecimal(price), inventory, description, category);
    }
}
