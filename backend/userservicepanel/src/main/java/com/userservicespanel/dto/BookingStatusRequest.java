package com.userservicespanel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingStatusRequest {
    private String status; // ACCEPTED, IN_PROGRESS, COMPLETED, REJECTED, CANCELLED
    private String notes;
}
