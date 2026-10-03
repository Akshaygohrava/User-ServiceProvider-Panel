package com.userservicespanel.services;

import com.userservicespanel.dto.BookingRequest;
import com.userservicespanel.dto.BookingStatusRequest;
import com.userservicespanel.entites.Booking;
import com.userservicespanel.entites.ServiceItem;
import com.userservicespanel.entites.User;
import com.userservicespanel.repository.BookingRepository;
import com.userservicespanel.repository.ServiceRepository;
import com.userservicespanel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class BookingService {

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    public Booking createBooking(BookingRequest request) {
        User customer = userRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new RuntimeException("Customer not found with id: " + request.getCustomerId()));

        ServiceItem service = serviceRepository.findById(request.getServiceId())
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + request.getServiceId()));

        User provider = service.getProvider();
        if (provider == null) {
            throw new RuntimeException("Service does not have an assigned provider.");
        }

        String address = (request.getCustomerAddress() != null && !request.getCustomerAddress().trim().isEmpty())
                ? request.getCustomerAddress()
                : customer.getAddress();

        Booking booking = Booking.builder()
                .customer(customer)
                .service(service)
                .provider(provider)
                .bookingDate(request.getBookingDate())
                .timeSlot(request.getTimeSlot() != null ? request.getTimeSlot() : "10:00 AM - 12:00 PM")
                .customerAddress(address)
                .notes(request.getNotes())
                .status("PENDING")
                .totalAmount(service.getPrice())
                .build();

        return bookingRepository.save(booking);
    }

    public List<Booking> getCustomerBookings(Long customerId) {
        return bookingRepository.findByCustomerIdOrderByCreatedAtDesc(customerId);
    }

    public List<Booking> getProviderBookings(Long providerId) {
        return bookingRepository.findByProviderIdOrderByCreatedAtDesc(providerId);
    }

    public Optional<Booking> getBookingById(Long id) {
        return bookingRepository.findById(id);
    }

    public Booking updateBookingStatus(Long id, BookingStatusRequest statusRequest) {
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Booking not found with id: " + id));

        if (statusRequest.getStatus() != null && !statusRequest.getStatus().trim().isEmpty()) {
            booking.setStatus(statusRequest.getStatus().trim().toUpperCase());
        }

        if (statusRequest.getNotes() != null && !statusRequest.getNotes().trim().isEmpty()) {
            booking.setNotes(booking.getNotes() != null 
                    ? booking.getNotes() + " | Update: " + statusRequest.getNotes() 
                    : statusRequest.getNotes());
        }

        return bookingRepository.save(booking);
    }
}
