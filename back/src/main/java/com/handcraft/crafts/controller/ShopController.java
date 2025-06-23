package com.handcraft.crafts.controller;

import com.handcraft.crafts.entity.Shop;
import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.enums.Status;
import com.handcraft.crafts.service.ShopService;
import com.handcraft.crafts.service.UserInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/shop")
public class ShopController {

    private final ShopService shopService;
    private final UserInfoService userInfoService;

    public ShopController(ShopService shopService, UserInfoService userInfoService) {
        this.shopService = shopService;
        this.userInfoService = userInfoService;
    }

    @PostMapping("/add")
    public ResponseEntity<?> addShop(@RequestBody Shop shop, Authentication authentication) {
        UserInfo seller = userInfoService.loadUserByEmail(authentication.getName());
        if (!seller.getRoles().equals(Role.ROLE_SELLER) || seller.getStatus() != Status.APPROVED) {
            return ResponseEntity.status(403).body("Only APPROVED sellers can add shops.");
        }
        return ResponseEntity.ok(shopService.addShop(shop, seller));
    }

    @GetMapping("/my-shops")
    public ResponseEntity<?> getMyShops(Authentication authentication) {
        UserInfo seller = userInfoService.loadUserByEmail(authentication.getName());
        return ResponseEntity.ok(shopService.getShopsBySeller(seller));
    }

    @GetMapping("/pending")
    public ResponseEntity<?> getPendingShops() {
        return ResponseEntity.ok(shopService.getPendingShops());
    }

    @GetMapping("/approved")
    public ResponseEntity<?> getApprovedShops() {
        return ResponseEntity.ok(shopService.getApprovedShops());
    }

    @PutMapping("/approve/{shopId}")
    public ResponseEntity<?> approveShop(@PathVariable int shopId, Authentication authentication) {
        UserInfo user = userInfoService.loadUserByEmail(authentication.getName());
        if (user.getRoles() == Role.ROLE_ADMIN || user.getRoles() == Role.ROLE_SUPER_ADMIN) {
            boolean approved = shopService.approveShop(shopId);
            return approved ? ResponseEntity.ok("Shop approved.") : ResponseEntity.status(404).body("Shop not found.");
        }
        return ResponseEntity.status(403).body("Not authorized.");
    }
}
