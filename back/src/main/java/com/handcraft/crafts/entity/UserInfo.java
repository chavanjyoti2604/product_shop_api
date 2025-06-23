package com.handcraft.crafts.entity;

import jakarta.persistence.*;
import com.handcraft.crafts.enums.Role;
import com.handcraft.crafts.enums.Status;

@Entity
@Table(name = "user_info")
public class UserInfo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false, unique = true)
    private String email; // Used as username

    @Column(nullable = false)
    private String password; // Stored encrypted (e.g., BCrypt)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role roles; // Enum for user roles

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status = Status.PENDING; // Default initial status

    public UserInfo() {
        // Default constructor for JPA
    }

    public UserInfo(int id, String name, String email, String password, Role roles, Status status) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.roles = roles;
        this.status = status;
    }

    // Getters and setters

    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }
    public void setName(String name) {
        this.name = name;
    }

    public String getEmail() {
        return email;
    }
    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }
    public void setPassword(String password) {
        this.password = password;
    }

    public Role getRoles() {
        return roles;
    }
    public void setRoles(Role roles) {
        this.roles = roles;
    }

    public Status getStatus() {
        return status;
    }
    public void setStatus(Status status) {
        this.status = status;
    }

    // Convenience method for Spring Security to get username (email here)
    public String getUsername() {
        return this.email;
    }
}
