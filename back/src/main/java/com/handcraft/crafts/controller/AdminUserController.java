package com.handcraft.crafts.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.service.UserInfoService;

import java.util.List;

@RestController
@RequestMapping("/admin")
@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('ADMIN')")
public class AdminUserController {

    private final UserInfoService userInfoService;

    public AdminUserController(UserInfoService userInfoService) {
        this.userInfoService = userInfoService;
    }

    // Create Admin or Seller
    @PostMapping("/create-user")
    public ResponseEntity<?> createUser(@RequestBody UserInfo userInfo, Authentication authentication) {
        try {
            UserInfo creator = userInfoService.loadUserByEmail(authentication.getName());
            Role creatorRole = creator.getRoles();

            String result = userInfoService.addUserAsAdmin(userInfo, creatorRole);
            return ResponseEntity.ok(result);

        } catch (SecurityException se) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(se.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Failed to create user: " + e.getMessage());
        }
    }

    // Get Sellers by Status
    @GetMapping("/sellers/{status}")
    public ResponseEntity<?> listSellersByStatus(@PathVariable String status) {
        try {
            List<UserInfo> sellers = userInfoService.getSellersByStatus(status);
            return ResponseEntity.ok(sellers);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Invalid status: " + status);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching sellers: " + e.getMessage());
        }
    }

    // ✅ Get Pending Admins
    @GetMapping("/admins/pending")
    public ResponseEntity<?> getPendingAdmins() {
        try {
            List<UserInfo> admins = userInfoService.getPendingAdmins();
            return ResponseEntity.ok(admins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error fetching admins: " + e.getMessage());
        }
    }

    // ✅ Approve Admin
    @PutMapping("/admins/approve/{adminId}")
    public ResponseEntity<?> approveAdmin(@PathVariable int adminId) {
        boolean result = userInfoService.approveUser(adminId);
        if (result) {
            return ResponseEntity.ok("Admin approved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found.");
        }
    }

    // ✅ Approve Seller (now uses generic approveUser)
    @PutMapping("/sellers/approve/{sellerId}")
    public ResponseEntity<?> approveSeller(@PathVariable int sellerId) {
        boolean result = userInfoService.approveUser(sellerId);
        if (result) {
            return ResponseEntity.ok("Seller approved successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found.");
        }
    }

    // Suspend User
    @PutMapping("/users/suspend/{userId}")
    public ResponseEntity<?> suspendUser(@PathVariable int userId) {
        boolean result = userInfoService.suspendUser(userId);
        if (result) {
            return ResponseEntity.ok("User suspended successfully.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
        }
    }
}
