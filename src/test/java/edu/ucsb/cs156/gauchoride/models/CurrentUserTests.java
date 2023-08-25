package edu.ucsb.cs156.gauchoride.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import org.junit.jupiter.api.Test;
import org.springframework.security.core.GrantedAuthority;

import java.util.ArrayList;
import java.util.Collection;

import edu.ucsb.cs156.gauchoride.entities.User;

public class CurrentUserTests {

    @Test
    public void testGetIdReturnsCorrectId() {
        User testUser = User.builder().id(42L).build();

        Collection<GrantedAuthority> roles = new ArrayList<>();
        CurrentUser currentUser = new CurrentUser(testUser, roles);

        assertEquals(42L, currentUser.getId());
    }

    @Test
    public void testGetIdWhenUserIsNull() {
        assertThrows(NullPointerException.class, () -> {
            CurrentUser currentUser = new CurrentUser(null, null);
            currentUser.getId();
        });
    }
}
