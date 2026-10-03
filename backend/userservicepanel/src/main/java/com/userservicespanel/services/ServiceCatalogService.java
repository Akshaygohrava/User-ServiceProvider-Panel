package com.userservicespanel.services;

import com.userservicespanel.dto.ServiceRequest;
import com.userservicespanel.entites.ServiceItem;
import com.userservicespanel.entites.User;
import com.userservicespanel.repository.ServiceRepository;
import com.userservicespanel.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ServiceCatalogService {

    @Autowired
    private ServiceRepository serviceRepository;

    @Autowired
    private UserRepository userRepository;

    public ServiceItem createService(ServiceRequest request) {
        User provider = userRepository.findById(request.getProviderId())
                .orElseThrow(() -> new RuntimeException("Service Provider not found with id: " + request.getProviderId()));

        if (!"SERVICE_PROVIDER".equalsIgnoreCase(provider.getRole())) {
            throw new RuntimeException("User is not authorized to create services (Role is not SERVICE_PROVIDER)");
        }

        String defaultImg = request.getImageUrl();
        if (defaultImg == null || defaultImg.trim().isEmpty()) {
            if ("AC Repair".equalsIgnoreCase(request.getCategory()) || request.getTitle().toLowerCase().contains("ac")) {
                defaultImg = "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=60";
            } else if ("Electrical".equalsIgnoreCase(request.getCategory())) {
                defaultImg = "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&auto=format&fit=crop&q=60";
            } else if ("Plumbing".equalsIgnoreCase(request.getCategory())) {
                defaultImg = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&auto=format&fit=crop&q=60";
            } else {
                defaultImg = "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=800&auto=format&fit=crop&q=60";
            }
        }

        ServiceItem item = ServiceItem.builder()
                .title(request.getTitle())
                .category(request.getCategory() != null ? request.getCategory() : "General")
                .description(request.getDescription())
                .price(request.getPrice())
                .duration(request.getDuration() != null ? request.getDuration() : "1-2 Hours")
                .imageUrl(defaultImg)
                .status(request.getStatus() != null ? request.getStatus() : "ACTIVE")
                .provider(provider)
                .build();

        return serviceRepository.save(item);
    }

    public List<ServiceItem> getAllActiveServices(String category, String search) {
        if (search != null && !search.trim().isEmpty()) {
            return serviceRepository.searchServices(search.trim(), "ACTIVE");
        }
        if (category != null && !category.trim().isEmpty() && !"ALL".equalsIgnoreCase(category.trim())) {
            return serviceRepository.findByCategoryIgnoreCaseAndStatus(category.trim(), "ACTIVE");
        }
        return serviceRepository.findByStatus("ACTIVE");
    }

    public List<ServiceItem> getServicesByProvider(Long providerId) {
        return serviceRepository.findByProviderId(providerId);
    }

    public Optional<ServiceItem> getServiceById(Long id) {
        return serviceRepository.findById(id);
    }

    public ServiceItem updateService(Long id, ServiceRequest request) {
        ServiceItem existing = serviceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Service not found with id: " + id));

        if (request.getTitle() != null) existing.setTitle(request.getTitle());
        if (request.getCategory() != null) existing.setCategory(request.getCategory());
        if (request.getDescription() != null) existing.setDescription(request.getDescription());
        if (request.getPrice() != null) existing.setPrice(request.getPrice());
        if (request.getDuration() != null) existing.setDuration(request.getDuration());
        if (request.getImageUrl() != null && !request.getImageUrl().trim().isEmpty()) existing.setImageUrl(request.getImageUrl());
        if (request.getStatus() != null) existing.setStatus(request.getStatus());

        return serviceRepository.save(existing);
    }

    public void deleteService(Long id) {
        serviceRepository.deleteById(id);
    }
}
