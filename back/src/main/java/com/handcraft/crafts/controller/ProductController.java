package com.handcraft.crafts.controller;

import com.handcraft.crafts.entity.Product;
import com.handcraft.crafts.service.ProductService;
import com.handcraft.crafts.service.UserInfoService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/product")
public class ProductController {

    private final ProductService productService;
    private final UserInfoService userInfoService;

    public ProductController(ProductService productService, UserInfoService userInfoService) {
        this.productService = productService;
        this.userInfoService = userInfoService;
    }

    // ✅ Add product - allowed only if shop status is APPROVED
    @PostMapping("/add/{shopId}")
    public ResponseEntity<?> addProduct(@PathVariable int shopId,
                                        @RequestBody Product product,
                                        Authentication authentication) {
        try {
            return ResponseEntity.ok(productService.addProduct(shopId, product));
        } catch (IllegalArgumentException | IllegalStateException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // ✅ Get all products for a specific shop
    @GetMapping("/shop/{shopId}")
    public ResponseEntity<?> getProductsByShop(@PathVariable int shopId) {
        return ResponseEntity.ok(productService.getProductsByShop(shopId));
    }

    // ✅ NEW: Get all products for the logged-in SELLER
    @GetMapping("/my-products")
    public ResponseEntity<?> getMyProducts(Authentication authentication) {
        String email = authentication.getName(); // Email from JWT
        return ResponseEntity.ok(productService.getProductsBySeller(email));
    }
}
