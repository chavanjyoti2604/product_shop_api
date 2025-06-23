package com.handcraft.crafts.repository;

import com.handcraft.crafts.entity.Shop;
import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Status;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ShopRepository extends JpaRepository<Shop, Integer> {

    // Find all shops by seller
    List<Shop> findBySeller(UserInfo seller);

    // Find all shops with a specific status
    List<Shop> findByStatus(Status status);

    // Find seller's shops with specific status (e.g. APPROVED only)
    List<Shop> findBySellerAndStatus(UserInfo seller, Status status);
}
