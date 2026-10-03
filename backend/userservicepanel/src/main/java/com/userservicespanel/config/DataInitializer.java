package com.userservicespanel.config;

import com.userservicespanel.entites.Booking;
import com.userservicespanel.entites.ServiceItem;
import com.userservicespanel.entites.User;
import com.userservicespanel.repository.BookingRepository;
import com.userservicespanel.repository.ServiceRepository;
import com.userservicespanel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private BookingRepository bookingRepository;

    @Override
    public void run(String... args) throws Exception {
        if (userRepository.count() > 0) {
            System.out.println("Data already initialized. Skipping seeding.");
            return;
        }

        System.out.println("Seeding initial Demo Users, Providers, and AC Services...");

        // 1. Seed Service Provider 1: AC Specialist
        User acProvider = User.builder()
                .fullName("Rajesh Sharma")
                .email("provider@example.com")
                .password("Qwerty@1234")
                .phone("+91 98765 43210")
                .role("SERVICE_PROVIDER")
                .businessName("Apex Cooling & AC Techs")
                .specialization("AC Repair & HVAC Systems")
                .address("Shop 14, Commercial Complex, Sector 18")
                .city("New Delhi")
                .rating(4.9)
                .reviewCount(48)
                .createdAt(LocalDateTime.now())
                .build();
        acProvider = userRepository.save(acProvider);

        // 2. Seed Service Provider 2: Electrical & Appliances
        User elecProvider = User.builder()
                .fullName("Amit Patel")
                .email("amit.elec@example.com")
                .password("Qwerty@1234")
                .phone("+91 98111 22334")
                .role("SERVICE_PROVIDER")
                .businessName("VoltMaster Electricals")
                .specialization("Electrical & Home Appliances")
                .address("Plot 22, Green Park Avenue")
                .city("New Delhi")
                .rating(4.8)
                .reviewCount(35)
                .createdAt(LocalDateTime.now())
                .build();
        elecProvider = userRepository.save(elecProvider);

        // 3. Seed Demo Regular User
        User demoUser = User.builder()
                .fullName("Akshay Verma")
                .email("user@example.com")
                .password("Qwerty@1234")
                .phone("+91 99887 76655")
                .role("USER")
                .address("Apartment 402, Sunshine Heights, Civil Lines")
                .city("New Delhi")
                .createdAt(LocalDateTime.now())
                .build();
        demoUser = userRepository.save(demoUser);

        // 4. Seed AC Services under acProvider
        ServiceItem s1 = ServiceItem.builder()
                .title("Split AC Deep Jet Cleaning & Coil Wash")
                .category("AC Repair")
                .description("Advanced high-pressure water jacket jet cleaning of indoor cooling coils, blower fan, deep drain-tray flush, and anti-bacterial foam treatment.")
                .price(599.0)
                .duration("60 Mins")
                .imageUrl("https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80")
                .status("ACTIVE")
                .provider(acProvider)
                .createdAt(LocalDateTime.now())
                .build();
        serviceRepository.save(s1);

        ServiceItem s2 = ServiceItem.builder()
                .title("AC Gas Leak Detection & Refrigerant Top-up")
                .category("AC Repair")
                .description("Complete electronic leak testing, brazing joints repair, vacuum pump moisture purge, and 100% genuine R32/R410A refrigerant gas recharge.")
                .price(1499.0)
                .duration("90 Mins")
                .imageUrl("https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80")
                .status("ACTIVE")
                .provider(acProvider)
                .createdAt(LocalDateTime.now())
                .build();
        serviceRepository.save(s2);

        ServiceItem s3 = ServiceItem.builder()
                .title("Complete AC Uninstallation & Re-Installation")
                .category("AC Repair")
                .description("Safely pump down refrigerant, dismantle wall brackets, install outdoor heavy-duty stand, drill core hole, and perform cooling calibration.")
                .price(1199.0)
                .duration("2 Hours")
                .imageUrl("https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80")
                .status("ACTIVE")
                .provider(acProvider)
                .createdAt(LocalDateTime.now())
                .build();
        serviceRepository.save(s3);

        ServiceItem s4 = ServiceItem.builder()
                .title("AC PCB Circuit Diagnostics & Inverter Repair")
                .category("AC Repair")
                .description("Microprocessor board error code decoding, IPM module soldering, thermistor replacement, and power surge capacitor testing.")
                .price(899.0)
                .duration("75 Mins")
                .imageUrl("https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80")
                .status("ACTIVE")
                .provider(acProvider)
                .createdAt(LocalDateTime.now())
                .build();
        serviceRepository.save(s4);

        // 5. Seed Electrical Service under elecProvider
        ServiceItem s5 = ServiceItem.builder()
                .title("Home Electrical Circuit & MCB Safety Audit")
                .category("Electrical")
                .description("Full electrical distribution board health check, earth resistance test, fuse replacement, and tripping circuit troubleshooting.")
                .price(499.0)
                .duration("45 Mins")
                .imageUrl("https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=80")
                .status("ACTIVE")
                .provider(elecProvider)
                .createdAt(LocalDateTime.now())
                .build();
        serviceRepository.save(s5);

        // 6. Seed a sample booking so both user and provider have immediate demo data to inspect
        Booking sampleBooking = Booking.builder()
                .customer(demoUser)
                .service(s1)
                .provider(acProvider)
                .bookingDate(LocalDate.now().plusDays(1))
                .timeSlot("11:00 AM - 01:00 PM")
                .customerAddress(demoUser.getAddress())
                .notes("Master bedroom AC is making a buzzing sound and not cooling properly.")
                .status("PENDING")
                .totalAmount(s1.getPrice())
                .createdAt(LocalDateTime.now())
                .updatedAt(LocalDateTime.now())
                .build();
        bookingRepository.save(sampleBooking);

        System.out.println("Demo data seeded successfully!");
    }
}
