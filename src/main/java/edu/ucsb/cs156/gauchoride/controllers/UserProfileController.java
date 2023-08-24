package edu.ucsb.cs156.gauchoride.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import edu.ucsb.cs156.gauchoride.entities.User;
import edu.ucsb.cs156.gauchoride.errors.EntityNotFoundException;
import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(name = "User Profile")
@RequestMapping("/api/userprofile")
@RestController

public class UserProfileController extends ApiController {

    @Autowired
    UserRepository userRepository;

    @Operation(summary = "Update a cellphone number")
    @PreAuthorize("hasRole('ROLE_USER')")
    @PutMapping("/updatecellphone")
    public Object updateCellphone( @Parameter (name = "cellphone", description = "a cellphone number", example = "805-000-0000", required = true) @RequestParam String cellphone) {
        Long id = super.getCurrentUser().getId();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException(User.class, id));
        user.setCellphone(cellphone);
        userRepository.save(user);
        return genericMessage("User with id %s is updated with cellphone %S".formatted(id, cellphone));
    }
}