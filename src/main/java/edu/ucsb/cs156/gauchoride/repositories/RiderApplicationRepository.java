package edu.ucsb.cs156.gauchoride.repositories;

import edu.ucsb.cs156.gauchoride.entities.RiderApplication;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface RiderApplicationRepository extends CrudRepository<RiderApplication, Long> {
  Iterable<RiderApplication> findAllById(Long id);
  Iterable<RiderApplication> findAllByStatus(String status);
  Iterable<RiderApplication> findAllByUserId(Long userId);
  Optional<RiderApplication> findById(Long id);
  Optional<RiderApplication> findByIdAndUserId(Long id, Long userId);
}
