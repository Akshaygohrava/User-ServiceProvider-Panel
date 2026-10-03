package com.userservicespanel.controller;

import com.userservicespanel.dto.ApiResponse;
import com.userservicespanel.dto.ServiceRequest;
import com.userservicespanel.entites.ServiceItem;
import com.userservicespanel.services.ServiceCatalogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    @Autowired
    private ServiceCatalogService serviceCatalogService;

    // 1. User/Public: Get all active services (with search & category filtering)
    @GetMapping
    public ResponseEntity<List<ServiceItem>> getAllServices(
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String search) {
        List<ServiceItem> services = serviceCatalogService.getAllActiveServices(category, search);
        return ResponseEntity.ok(services);
    }

    // 2. Get single service details
    @GetMapping("/{id}")
    public ResponseEntity<ServiceItem> getServiceById(@PathVariable Long id) {
        return serviceCatalogService.getServiceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Provider: Get all services created by a specific provider
    @GetMapping("/provider/{providerId}")
    public ResponseEntity<List<ServiceItem>> getServicesByProvider(@PathVariable Long providerId) {
        List<ServiceItem> services = serviceCatalogService.getServicesByProvider(providerId);
        return ResponseEntity.ok(services);
    }

    // 4. Provider: Add a new service
    @PostMapping
    public ResponseEntity<?> createService(@RequestBody ServiceRequest request) {
        try {
            ServiceItem created = serviceCatalogService.createService(request);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // 5. Provider: Update an existing service
    @PutMapping("/{id}")
    public ResponseEntity<?> updateService(@PathVariable Long id, @RequestBody ServiceRequest request) {
        try {
            ServiceItem updated = serviceCatalogService.updateService(id, request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }

    // 6. Provider: Delete a service
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        try {
            serviceCatalogService.deleteService(id);
            return ResponseEntity.ok(ApiResponse.success("Service deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(e.getMessage()));
        }
    }
}
