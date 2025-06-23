package com.handcraft.crafts.service;

import java.util.Collection;
import java.util.List;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import com.handcraft.crafts.entity.UserInfo;
import com.handcraft.crafts.enums.Status;
import com.handcraft.crafts.enums.Role;

public class UserInfoDetails implements UserDetails {

    private final String username; // email as username
    private final String password;
    private final List<GrantedAuthority> authorities;
    private final Status status; // use enum, not String

    public UserInfoDetails(UserInfo userInfo) {
        this.username = userInfo.getEmail();
        this.password = userInfo.getPassword();
        this.status = userInfo.getStatus();

        Role role = userInfo.getRoles(); // since it's an Enum
        this.authorities = List.of(new SimpleGrantedAuthority(role.name())); // ROLE_ADMIN / ROLE_USER etc.
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /**
     * ✅ Enable only APPROVED or PENDING accounts, block SUSPENDED.
     */
    @Override
    public boolean isEnabled() {
        return status != Status.SUSPENDED;
    }
}
