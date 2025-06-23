package com.handcraft.crafts.service;

import com.handcraft.crafts.entity.Shop;
import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Status;
import com.handcraft.crafts.repository.ShopRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ShopService {

    private final ShopRepository shopRepository;

    public ShopService(ShopRepository shopRepository) {
        this.shopRepository = shopRepository;
    }

    public Shop addShop(Shop shop, UserInfo seller) {
        shop.setSeller(seller);
        shop.setStatus(Status.PENDING);
        return shopRepository.save(shop);
    }

    public List<Shop> getShopsBySeller(UserInfo seller) {
        return shopRepository.findBySeller(seller);
    }

    public List<Shop> getPendingShops() {
        return shopRepository.findByStatus(Status.PENDING);
    }

    public List<Shop> getApprovedShops() {
        return shopRepository.findByStatus(Status.APPROVED);
    }

    public boolean approveShop(int shopId) {
        Optional<Shop> optionalShop = shopRepository.findById(shopId);
        if (optionalShop.isPresent()) {
            Shop shop = optionalShop.get();
            shop.setStatus(Status.APPROVED);
            shopRepository.save(shop);
            return true;
        }
        return false;
    }

    public Optional<Shop> getShopById(int id) {
        return shopRepository.findById(id);
    }
}
