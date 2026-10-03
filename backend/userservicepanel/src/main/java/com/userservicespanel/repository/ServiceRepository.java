package com.userservicespanel.repository;

import com.userservicespanel.entites.ServiceItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ServiceRepository extends JpaRepository<ServiceItem, Long> {
    List<ServiceItem> findByProviderId(Long providerId);
    List<ServiceItem> findByStatus(String status);
    List<ServiceItem> findByCategoryIgnoreCaseAndStatus(String category, String status);

    @Query("SELECT s FROM ServiceItem s WHERE s.status = :status AND " +
           "(LOWER(s.title) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.category) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "LOWER(s.description) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<ServiceItem> searchServices(@Param("query") String query, @Param("status") String status);
}
