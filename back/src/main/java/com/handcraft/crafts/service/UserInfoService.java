package com.handcraft.crafts.service;

import java.util.List;
import java.util.Optional;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.enums.Status;
import com.handcraft.crafts.repository.UserInfoRepository;

@Service
public class UserInfoService implements UserDetailsService {

    private final UserInfoRepository repository;
    private final PasswordEncoder passwordEncoder;

    public UserInfoService(UserInfoRepository repository, PasswordEncoder passwordEncoder) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return repository.findByEmail(email)
                .map(UserInfoDetails::new)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }

    public UserInfo loadUserByEmail(String email) {
        return repository.findByEmail(email).orElse(null);
    }

    public String addUser(UserInfo userInfo) {
        userInfo.setPassword(passwordEncoder.encode(userInfo.getPassword()));

        Role role = userInfo.getRoles();
        if (role == null) {
            role = Role.ROLE_USER;
        }
        userInfo.setRoles(role);

        if (role == Role.ROLE_ADMIN || role == Role.ROLE_SELLER) {
            userInfo.setStatus(Status.PENDING);
        } else {
            userInfo.setStatus(Status.APPROVED);
        }

        repository.save(userInfo);
        return "User registered successfully.";
    }

    public String addUserAsAdmin(UserInfo newUser, Role creatorRole) {
        Role newUserRole = newUser.getRoles();

        if (newUserRole == null) {
            throw new IllegalArgumentException("Role must be specified");
        }

        if (creatorRole == Role.ROLE_SUPER_ADMIN) {
            // Super admin can create any role
        } else if (creatorRole == Role.ROLE_ADMIN) {
            if (newUserRole != Role.ROLE_SELLER) {
                throw new SecurityException("Admin can only create SELLER users");
            }
        } else {
            throw new SecurityException("You do not have permission to create users");
        }

        if (newUserRole == Role.ROLE_SELLER || newUserRole == Role.ROLE_ADMIN) {
            newUser.setStatus(Status.PENDING);
        } else {
            newUser.setStatus(Status.APPROVED);
        }

        newUser.setPassword(passwordEncoder.encode(newUser.getPassword()));
        repository.save(newUser);

        return "User created successfully.";
    }

    public void saveUser(UserInfo userInfo) {
        Optional<UserInfo> existingOpt = repository.findById(userInfo.getId());
        if (existingOpt.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        UserInfo existingUser = existingOpt.get();

        String newPassword = userInfo.getPassword();

        if (newPassword != null && !newPassword.isEmpty()) {
            userInfo.setPassword(passwordEncoder.encode(newPassword));
        } else {
            userInfo.setPassword(existingUser.getPassword());
        }

        repository.save(userInfo);
    }

    public boolean approveUser(int userId) {
        Optional<UserInfo> userOpt = repository.findById(userId);
        if (userOpt.isPresent()) {
            UserInfo user = userOpt.get();
            Role role = user.getRoles();

            if (role == Role.ROLE_SELLER || role == Role.ROLE_ADMIN) {
                user.setStatus(Status.APPROVED);
                repository.save(user);
                return true;
            }
        }
        return false;
    }

    public boolean suspendUser(int userId) {
        return updateUserStatus(userId, Status.SUSPENDED);
    }

    private boolean updateUserStatus(int userId, Status newStatus) {
        Optional<UserInfo> userOpt = repository.findById(userId);
        if (userOpt.isPresent()) {
            UserInfo user = userOpt.get();
            user.setStatus(newStatus);
            repository.save(user);
            return true;
        }
        return false;
    }

    public List<UserInfo> getSellersByStatus(String statusStr) {
        Status status;
        try {
            status = Status.valueOf(statusStr.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + statusStr);
        }
        return repository.findByRolesAndStatus(Role.ROLE_SELLER, status);
    }

    public List<UserInfo> getPendingSellers() {
        return repository.findByRolesAndStatus(Role.ROLE_SELLER, Status.PENDING);
    }

    public List<UserInfo> getApprovedSellers() {
        return repository.findByRolesAndStatus(Role.ROLE_SELLER, Status.APPROVED);
    }

    public List<UserInfo> getPendingAdmins() {
        return repository.findByRolesAndStatus(Role.ROLE_ADMIN, Status.PENDING);
    }

    public List<UserInfo> getApprovedAdmins() {
        return repository.findByRolesAndStatus(Role.ROLE_ADMIN, Status.APPROVED);
    }

    // ----------- DEBUG METHOD -----------
    public void debugPasswordCheck(String email, String rawPassword) {
        UserInfo user = repository.findByEmail(email).orElse(null);
        if (user != null) {
            System.out.println("Stored password hash for " + email + ": " + user.getPassword());
            boolean matches = passwordEncoder.matches(rawPassword, user.getPassword());
            System.out.println("Password matches? " + matches);
        } else {
            System.out.println("User with email " + email + " not found.");
        }
    }
}
