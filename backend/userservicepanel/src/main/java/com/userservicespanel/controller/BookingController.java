package com.userservicespanel.controller;

import com.userservicespanel.dto.ApiResponse;
import com.userservicespanel.dto.BookingRequest;
import com.userservicespanel.dto.BookingStatusRequest;
import com.userservicespanel.entites.Booking;
import com.userservicespanel.services.BookingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    @Autowired
    private BookingService bookingService;

    // 1. User accepts / books a service
    @PostMapping
    public ResponseEntity<?> createBooking(@RequestBody BookingRequest request) {
        try {
            Booking booking = bookingService.createBooking(request);
            return ResponseEntity.ok(booking);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // 2. User: Get all their bookings
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Booking>> getUserBookings(@PathVariable Long userId) {
        List<Booking> list = bookingService.getCustomerBookings(userId);
        return ResponseEntity.ok(list);
    }

    // 3. Provider: Get all booking requests for their services
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<Booking>> getProviderBookings(@PathVariable Long providerId) {
        List<Booking> list = bookingService.getProviderBookings(providerId);
        return ResponseEntity.ok(list);
    }

    // 4. Update booking status (e.g. Provider accepts booking or changes status)
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable Long id, @RequestBody BookingStatusRequest request) {
        try {
            Booking updated = bookingService.updateBookingStatus(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
