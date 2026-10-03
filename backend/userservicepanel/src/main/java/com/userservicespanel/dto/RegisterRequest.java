package com.userservicespanel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RegisterRequest {
    private String fullName;
    private String email;
    private String password;
    private String phone;
    private String role; // "USER" or "SERVICE_PROVIDER"

    // Provider fields
    private String businessName;
    private String specialization;
    private String address;
    private String city;
}
