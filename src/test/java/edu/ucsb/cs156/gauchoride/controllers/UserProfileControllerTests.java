package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.User;
import edu.ucsb.cs156.gauchoride.errors.EntityNotFoundException;
import edu.ucsb.cs156.gauchoride.models.CurrentUser;
import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;

import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Map;
import java.util.Optional;


@WebMvcTest(controllers = UserProfileController.class)
@Import(TestConfig.class)
public class UserProfileControllerTests extends ControllerTestCase{
  @MockBean
  UserRepository userRepository;

    @Test
        public void logged_out_users_cannot_edit_profile() throws Exception {
                mockMvc.perform(put("/api/userprofile/updatecellphone?cellphone=1234"))
                                .andExpect(status().is(403));
    }


  @WithMockUser(roles = { "USER" })
  @Test
  public void User_can_change_their_phone_Number() throws Exception {
    // arrange
    User user = currentUserService.getCurrentUser().getUser();

    User user1 = User.builder()
        .id(1)
        .email("test@ucsb.edu")
        .googleSub("None")
        .pictureUrl("None")
        .fullName("Test User 1")
        .givenName("Test")
        .familyName("User 1")
        .emailVerified(true)
        .locale("UCSB")
        .hostedDomain("None")
        .admin(false)
        .driver(false)
        .rider(true)
        .cellphone("8050000000")
        .build();
    User user2 = User.builder()
        .id(1)
        .email("test@ucsb.edu")
        .googleSub("None")
        .pictureUrl("None")
        .fullName("Test User 1")
        .givenName("Test")
        .familyName("User 1")
        .emailVerified(true)
        .locale("UCSB")
        .hostedDomain("None")
        .admin(false)
        .driver(false)
        .rider(true)
        .cellphone("8051111111")
        .build();

        String expectedJson = mapper.writeValueAsString(user2);

        when(userRepository.findById(eq(1L))).thenReturn(Optional.of(user1));
    
        // act
    
        MvcResult response = mockMvc.perform(
                        put("/api/userprofile/updatecellphone?cellphone=8051111111").with(csrf())).andExpect(status().isOk()).andReturn();
    
        // assert
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
      }

  @WithMockUser(roles = { "USER" })
    @Test
    public void testUpdateCellphone_UserNotFound_ThrowsEntityNotFoundException() throws Exception {
        // arrange
        when(userRepository.findById(anyLong())).thenReturn(Optional.empty());

        // act & assert
        mockMvc.perform(put("/api/userprofile/updatecellphone?cellphone=8051111111").with(csrf()))
            .andExpect(status().is(404))
            .andExpect(result -> assertTrue(result.getResolvedException() instanceof EntityNotFoundException))
            .andExpect(result -> assertEquals(
                "User with id 1 not found", 
                result.getResolvedException().getMessage()
            ));
    }
}