package com.userservicespanel.entites;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String fullName;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    private String phone;

    @Column(nullable = false)
    private String role; // "USER" or "SERVICE_PROVIDER"

    // Provider specific fields
    private String businessName;
    private String specialization; // e.g. "AC Repair & HVAC", "Plumbing", "Electrical"
    private String address;
    private String city;

    private Double rating;
    private Integer reviewCount;

    private LocalDateTime createdAt;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) {
            createdAt = LocalDateTime.now();
        }
        if (rating == null && "SERVICE_PROVIDER".equalsIgnoreCase(role)) {
            rating = 4.8;
            reviewCount = 12;
        }
    }
}
