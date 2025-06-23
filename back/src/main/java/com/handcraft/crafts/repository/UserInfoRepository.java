package com.handcraft.crafts.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.enums.Status;

@Repository
public interface UserInfoRepository extends JpaRepository<UserInfo, Integer> {

    // Used for login via email (username)
    Optional<UserInfo> findByEmail(String email);

    // Find users by role and status (e.g. pending sellers)
    List<UserInfo> findByRolesAndStatus(Role roles, Status status);

    // Find one user by role (e.g. to check if super admin exists)
    Optional<UserInfo> findFirstByRoles(Role roles);

    // Find all users by role (e.g. list all sellers)
    List<UserInfo> findAllByRoles(Role roles);
}
