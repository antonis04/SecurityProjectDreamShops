package com.dailycodework.dreamshops.service.product;

import com.dailycodework.dreamshops.model.Product;

import java.util.List;

public interface IProductService {

    Product addProduct(Product product);
    Product getProductById(Long id);
    Product updateProduct(Product product, Long ProductId);
    void deleteProduct(Long id);
    List<Product> getAllProducts();
    List<Product> getProductsByCategory(String category);
    List<Product> getProductsByBrand(String brand);
    List<Product> getProductsByCategoryAndBrand(String category, String brand);
    List<Product> getProductByName(String name);
    List<Product> getProductsByBrandAndName(String category, String name);
    Long countProductsByBrandAndName(String brand, String name);


}
