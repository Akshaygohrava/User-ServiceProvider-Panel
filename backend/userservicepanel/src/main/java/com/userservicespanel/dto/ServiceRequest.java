package com.userservicespanel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ServiceRequest {
    private Long providerId;
    private String title;
    private String category;
    private String description;
    private Double price;
    private String duration;
    private String imageUrl;
    private String status;
}
