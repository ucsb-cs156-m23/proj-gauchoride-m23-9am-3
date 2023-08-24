package edu.ucsb.cs156.gauchoride.entities;

import java.sql.Date;

import javax.persistence.Entity;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import io.swagger.v3.oas.annotations.media.Schema;

import javax.persistence.GeneratedValue;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Entity(name = "riderApplication")

public class RiderApplication {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private long id;

  @Schema(allowableValues = "pending, accepted, declined, expired, cancelled")
  private String status;

  private Long userId;
  private String perm_number;
  private String email;

  private Date created_date;
  private Date updated_date;
  private Date cancelled_date;
  
  private String description;
  private String notes;          

}
