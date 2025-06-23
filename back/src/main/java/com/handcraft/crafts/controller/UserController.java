package com.handcraft.crafts.controller;

import com.handcraft.crafts.entity.AuthRequest;
import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.enums.Status;
import com.handcraft.crafts.service.JwtService;
import com.handcraft.crafts.service.TokenBlacklistService;
import com.handcraft.crafts.service.UserInfoService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = {"http://localhost:3000"})
@Tag(name = "User Authentication & Management", description = "Handles registration, login, profile, and role-specific operations")
public class UserController {

    @Autowired
    private UserInfoService userService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private TokenBlacklistService tokenBlacklistService;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserInfo userInfo) {
        try {
            if (userService.loadUserByEmail(userInfo.getEmail()) != null) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("User with this email already exists.");
            }
            String result = userService.addUser(userInfo);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Registration failed: " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody AuthRequest authRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(authRequest.getEmail(), authRequest.getPassword()));

            // Authenticated user details
            UserInfo user = userService.loadUserByEmail(authRequest.getEmail());
            if (user == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("User not found");
            }

            if (user.getStatus() == Status.SUSPENDED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Your account is suspended.");
            }

            List<String> rolesList = List.of(user.getRoles().name());
            String token = jwtService.generateToken(user.getEmail(), rolesList);

            // Return token and user info as JSON
            return ResponseEntity.ok().body(Map.of(
                    "token", token,
                    "roles", rolesList,
                    "status", user.getStatus().name()
            ));
        } catch (AuthenticationException e) {
            System.out.println("❌ Login failed: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid email or password!");
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            tokenBlacklistService.blacklistToken(token);
            return ResponseEntity.ok("Logout successful. Token blacklisted.");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("No token provided.");
        }
    }

    @GetMapping("/userinfo")
    public ResponseEntity<?> getUserInfo(Authentication authentication) {
        try {
            String email = authentication.getName();
            UserInfo user = userService.loadUserByEmail(email);

            if (user == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
            }
            user.setPassword(null);
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateUserProfile(Authentication authentication, @RequestBody UserInfo updatedUser) {
        try {
            String email = authentication.getName();
            UserInfo existingUser = userService.loadUserByEmail(email);

            if (existingUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found!");
            }

            existingUser.setName(updatedUser.getName());

            // Only update password if provided and not empty
            if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
                existingUser.setPassword(updatedUser.getPassword());
            }

            userService.saveUser(existingUser);

            return ResponseEntity.ok("Profile updated successfully!");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/users/pending-sellers")
    public ResponseEntity<?> getPendingSellers(Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());

            System.out.println("Requester email: " + requester.getEmail());
            System.out.println("Requester role: " + requester.getRoles());
            System.out.println("Requester status: " + requester.getStatus());

            Role role = requester.getRoles();

            if (role.equals(Role.ROLE_ADMIN) && requester.getStatus() != Status.APPROVED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin approval pending. Cannot view sellers.");
            }

            if (!role.equals(Role.ROLE_ADMIN) && !role.equals(Role.ROLE_SUPER_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            List<UserInfo> pendingSellers = userService.getPendingSellers();
            return ResponseEntity.ok(pendingSellers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/users/approved-sellers")
    public ResponseEntity<?> getApprovedSellers(Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());
            Role role = requester.getRoles();

            if (role.equals(Role.ROLE_ADMIN) && requester.getStatus() != Status.APPROVED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin approval pending. Cannot view sellers.");
            }

            if (!role.equals(Role.ROLE_ADMIN) && !role.equals(Role.ROLE_SELLER) && !role.equals(Role.ROLE_SUPER_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            List<UserInfo> approvedSellers = userService.getApprovedSellers();
            return ResponseEntity.ok(approvedSellers);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/approve/{sellerId}")
    public ResponseEntity<?> approveSeller(@PathVariable int sellerId, Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());
            Role role = requester.getRoles();

            if (role.equals(Role.ROLE_ADMIN) && requester.getStatus() != Status.APPROVED) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Admin approval pending. Cannot approve sellers.");
            }

            if (!role.equals(Role.ROLE_ADMIN) && !role.equals(Role.ROLE_SUPER_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admin or super admin can approve sellers");
            }

            boolean result = userService.approveUser(sellerId);
            if (result) {
                return ResponseEntity.ok("Seller approved successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Seller not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/users/pending-admins")
    public ResponseEntity<?> getPendingAdmins(Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());
            if (!requester.getRoles().equals(Role.ROLE_SUPER_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only super admin can view pending admins");
            }

            List<UserInfo> pendingAdmins = userService.getPendingAdmins();
            return ResponseEntity.ok(pendingAdmins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/users/approved-admins")
    public ResponseEntity<?> getApprovedAdmins(Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());
            Role role = requester.getRoles();
            if (!role.equals(Role.ROLE_SUPER_ADMIN) && !role.equals(Role.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Access denied");
            }

            List<UserInfo> approvedAdmins = userService.getApprovedAdmins();
            return ResponseEntity.ok(approvedAdmins);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/approve-admin/{adminId}")
    public ResponseEntity<?> approveAdmin(@PathVariable int adminId, Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());
            if (!requester.getRoles().equals(Role.ROLE_SUPER_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only super admin can approve admins");
            }

            boolean result = userService.approveUser(adminId);
            if (result) {
                return ResponseEntity.ok("Admin approved successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @PutMapping("/users/suspend/{userId}")
    public ResponseEntity<?> suspendUser(@PathVariable int userId, Authentication authentication) {
        try {
            UserInfo requester = userService.loadUserByEmail(authentication.getName());
            if (!requester.getRoles().equals(Role.ROLE_ADMIN)) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Only admin can suspend users");
            }

            boolean result = userService.suspendUser(userId);
            if (result) {
                return ResponseEntity.ok("User suspended successfully.");
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found.");
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error: " + e.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> getUserStatus(Authentication authentication) {
        try {
            UserInfo user = userService.loadUserByEmail(authentication.getName());
            return ResponseEntity.ok().body(Map.of("status", user.getStatus().toString()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to fetch status"));
        }
    }
}
