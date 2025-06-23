package com.handcraft.crafts.config;

import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.enums.Status;
import com.handcraft.crafts.repository.UserInfoRepository;
import com.handcraft.crafts.service.UserInfoService;

import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements ApplicationRunner {

    private final UserInfoRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserInfoService userInfoService;

    public DataInitializer(UserInfoRepository userRepository,
                           PasswordEncoder passwordEncoder,
                           UserInfoService userInfoService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.userInfoService = userInfoService;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        String superAdminEmail = "superadmin@example.com";
        String newPassword = "Super123";

        UserInfo superAdmin = userRepository.findByEmail(superAdminEmail).orElse(null);

        if (superAdmin == null) {
            superAdmin = new UserInfo();
            superAdmin.setName("Super Admin");
            superAdmin.setEmail(superAdminEmail);
            superAdmin.setRoles(Role.ROLE_SUPER_ADMIN);
            superAdmin.setStatus(Status.APPROVED);
            System.out.println("Creating Super Admin user: " + superAdminEmail);
        } else {
            System.out.println("Super Admin user already exists, updating password.");
        }

        // Update (or set) password every time app starts
        superAdmin.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(superAdmin);

        // Optional: debug password check in console
        userInfoService.debugPasswordCheck(superAdminEmail, newPassword);
    }
}
