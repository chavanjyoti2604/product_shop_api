package com.handcraft.crafts.repository;

import com.handcraft.crafts.entity.Product;
import com.handcraft.crafts.entity.Shop;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer> {

    // Get all products of a specific shop
    List<Product> findByShop(Shop shop);
    List<Product> findByShopIn(List<Shop> shops);


    // Optional: Search by product name (if needed in future)
    List<Product> findByNameContainingIgnoreCase(String name);
}
