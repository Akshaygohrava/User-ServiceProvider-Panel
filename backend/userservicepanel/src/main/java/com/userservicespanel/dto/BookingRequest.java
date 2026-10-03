package com.userservicespanel.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingRequest {
    private Long customerId;
    private Long serviceId;
    private LocalDate bookingDate;
    private String timeSlot;
    private String customerAddress;
    private String notes;
}
