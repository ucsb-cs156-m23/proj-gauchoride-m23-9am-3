package edu.ucsb.cs156.gauchoride.controllers;

import edu.ucsb.cs156.gauchoride.repositories.UserRepository;
import edu.ucsb.cs156.gauchoride.testconfig.TestConfig;
import edu.ucsb.cs156.gauchoride.ControllerTestCase;
import edu.ucsb.cs156.gauchoride.entities.RiderApplication;
import edu.ucsb.cs156.gauchoride.repositories.RiderApplicationRepository;

import java.sql.Date;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Map;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@WebMvcTest(controllers = RiderApplicationController.class)
@Import(TestConfig.class)

public class RiderApplicationControllerTests extends ControllerTestCase {
        @MockBean
        RiderApplicationRepository riderApplicationRepository;

        @MockBean
        UserRepository userRepository;

        // Authorization tests for get /api/rider
        @Test
        public void logged_out_users_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/rider"))
                                .andExpect(status().is(403)); // logged out users can't get all
        }

        @WithMockUser(roles = { "MEMBER" })
        @Test
        public void logged_in_members_can_get_all_of_theirs() throws Exception {
                mockMvc.perform(get("/api/rider"))
                                .andExpect(status().is(200)); // logged
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_cannot_get_all() throws Exception {
                mockMvc.perform(get("/api/rider"))
                                .andExpect(status().is(403)); // logged
        }

        // Authorization tests for get /api/riderApplication?id={}
        @Test
        public void logged_out_users_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/riderApplication?id=7"))
                                .andExpect(status().is(403)); // logged out users can't get by id
        }

        @WithMockUser(roles = { "MEMBER" })
        @Test
        public void logged_in_members_can_get_by_id_that_is_theirs() throws Exception {
                mockMvc.perform(get("/api/riderApplication?id=7"))
                                .andExpect(status().is(404)); // logged, but no id exists
        }

        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_cannot_get_by_id() throws Exception {
                mockMvc.perform(get("/api/riderApplication?id=7"))
                                .andExpect(status().is(403)); // logged, but no id exists
        }

        // Authorization tests for post /api/riderApplication/new
        @Test
        public void logged_out_users_cannot_post() throws Exception {
                mockMvc.perform(post("/api/riderApplicaion/new"))
                                .andExpect(status().is(403));
        }
        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_cannot_post() throws Exception {
                mockMvc.perform(post("/api/riderApplicaion/new"))
                                .andExpect(status().is(403));
        }

        // Authorization tests for put /api/riderApplication/
        @Test
         public void logged_out_users_cannot_edit() throws Exception {
                 mockMvc.perform(put("/api/riderApplication?id=9"))
                                 .andExpect(status().is(403));
         }
        @WithMockUser(roles = { "ADMIN" })
        @Test
        public void logged_in_admin_cannot_edit() throws Exception {
                mockMvc.perform(post("/api/riderApplicaion/new"))
                                .andExpect(status().is(403));
        }

        //
        //ADMIN SPECIFIC AUTHORIZATION TESTS TO BE ADDED
        //

        // // Tests with mocks for database actions for MEMBERS

        // POST
        @WithMockUser(roles = { "MEMBER" })
        @Test
        public void a_member_can_post_a_new_riderApplication() throws Exception {
            Long UserId = currentUserService.getCurrentUser().getUser().getId();
            String Email = currentUserService.getCurrentUser().getUser().getEmail();
            // Get the current date
            LocalDate localDate = LocalDate.now();
            Date currentDate = Date.valueOf(localDate);

            RiderApplication application1 = RiderApplication.builder()
                            .status("pending")
                            .userId(UserId)
                            .perm_number("7654321")
                            .email(Email)
                            .created_date(currentDate)
                            .updated_date(currentDate)
                            .cancelled_date(null)
                            .description("My leg is broken")
                            .notes("")
                            .build();

            when(riderApplicationRepository.save(eq(application1))).thenReturn(application1);

            String postRequesString = "perm_number=7654321&description=My leg is broken";

            // act
            MvcResult response = mockMvc.perform(
                            post("/api/riderApplication/new?" + postRequesString)
                                            .with(csrf()))
                            .andExpect(status().isOk()).andReturn();

            // assert
            verify(riderApplicationRepository, times(1)).save(application1);
            String expectedJson = mapper.writeValueAsString(application1);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
        }

        // GET ALL
        @WithMockUser(roles = { "MEMBER" })
        @Test
        public void logged_in_member_can_get_all_their_own_rides() throws Exception {

            Long UserId = currentUserService.getCurrentUser().getUser().getId();
            String Email = currentUserService.getCurrentUser().getUser().getEmail();
            // Get the current date
            LocalDate localDate = LocalDate.now();
            Date currentDate = Date.valueOf(localDate);
            Date testDate = Date.valueOf("2023-03-20");

            RiderApplication application1 = RiderApplication.builder()
                            .status("pending")
                            .userId(UserId)
                            .perm_number("7654321")
                            .email(Email)
                            .created_date(currentDate)
                            .updated_date(currentDate)
                            .cancelled_date(null)
                            .description("My leg is broken")
                            .notes("")
                            .build();

            RiderApplication application2 = RiderApplication.builder()
                            .status("declined")
                            .userId(UserId)
                            .perm_number("7654321")
                            .email(Email)
                            .created_date(currentDate)
                            .updated_date(testDate)
                            .cancelled_date(null)
                            .description("I often get a cramp in my leg")
                            .notes("Declined.")
                            .build();

            ArrayList<RiderApplication> expectedApplications = new ArrayList<>();
            expectedApplications.addAll(Arrays.asList(application1, application2));

            when(riderApplicationRepository.findAllByUserId(eq(UserId))).thenReturn(expectedApplications);

            // act
            MvcResult response = mockMvc.perform(get("/api/rider"))
                            .andExpect(status().isOk()).andReturn();

            // assert

            verify(riderApplicationRepository, times(1)).findAllByUserId(eq(UserId));
            String expectedJson = mapper.writeValueAsString(expectedApplications);
            String responseString = response.getResponse().getContentAsString();
            assertEquals(expectedJson, responseString);
    }

    // GET BY ID
    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void test_that_logged_in_member_can_get_by_id_when_the_id_exists_and_user_id_matches() throws Exception {
        
        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();
        
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");
        Date testDate3 = Date.valueOf("2023-04-16");

        RiderApplication application = RiderApplication.builder()
                        .status("cancelled")
                        .userId(UserId)
                        .perm_number("7654321")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(testDate3)
                        .description("")
                        .notes("Please provide your mobility limitations")
                        .build();

        when(riderApplicationRepository.findByIdAndUserId(eq(7L), eq(UserId))).thenReturn(Optional.of(application));

        // act
        MvcResult response = mockMvc.perform(get("/api/riderApplication?id=7"))
                        .andExpect(status().isOk()).andReturn();

        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(7L), eq(UserId));
        String expectedJson = mapper.writeValueAsString(application);
        String responseString = response.getResponse().getContentAsString();
        assertEquals(expectedJson, responseString);
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void test_that_logged_in_member_cannot_get_by_id_when_the_id_does_not_exist() throws Exception {
        
        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        
        when(riderApplicationRepository.findByIdAndUserId(eq(7L), eq(UserId))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(get("/api/riderApplication?id=7"))
                        .andExpect(status().isNotFound()).andReturn();

        // assert

        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(7L), eq(UserId));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("RiderApplication with id 7 not found", json.get("message"));
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void test_that_logged_in_member_cannot_get_by_id_when_the_id_exists_but_user_id_does_not_match() throws Exception {
        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        Long otherUserId = UserId + 1;
        String Email = "random@example.org";
        
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application = RiderApplication.builder()
                        .status("expired")
                        .userId(otherUserId)
                        .perm_number("0123456")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("Approved; will expire on 2023-07-31")
                        .build();

        when(riderApplicationRepository.findByIdAndUserId(eq(7L), eq(otherUserId))).thenReturn(Optional.of(application));

        // act
        MvcResult response = mockMvc.perform(get("/api/riderApplication?id=7"))
                .andExpect(status().isNotFound()).andReturn();
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(7L), eq(UserId));
        Map<String, Object> json = responseToJson(response);
        assertEquals("EntityNotFoundException", json.get("type"));
        assertEquals("RiderApplication with id 7 not found", json.get("message"));
    }

    // EDIT (UPDATE)

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_can_edit_their_own_application_whose_status_is_pending() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application_original = RiderApplication.builder()
                        .status("pending")
                        .userId(UserId)
                        .perm_number("0123456")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("")
                        .notes("")
                        .build();

        RiderApplication application_edited = RiderApplication.builder()
                        .status("pending")
                        .userId(UserId)
                        .perm_number("6543210")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("")
                        .build();

        String requestBody = mapper.writeValueAsString(application_edited);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(UserId))).thenReturn(Optional.of(application_original));

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication?id=67")
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding("utf-8")
                            .content(requestBody)
                            .with(csrf()))
            .andExpect(status().isOk()).andReturn();
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        verify(riderApplicationRepository, times(1)).save(application_edited); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_cannot_edit_other_members_application() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        Long otherUserId = UserId + 1;
        String Email = "random@example.org";

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application_original = RiderApplication.builder()
                        .status("pending")
                        .userId(otherUserId)
                        .perm_number("0123456")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("")
                        .notes("")
                        .build();

        RiderApplication application_edited = RiderApplication.builder()
                        .status("pending")
                        .userId(otherUserId)
                        .perm_number("6543210")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("")
                        .build();
                    
        String requestBody = mapper.writeValueAsString(application_edited);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(otherUserId))).thenReturn(Optional.of(application_original));

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
        .andExpect(status().isNotFound()).andReturn();
        
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        Map<String, Object> json = responseToJson(response);
        assertEquals("RiderApplication with id 67 not found", json.get("message"));
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_cannot_edit_application_that_does_not_exist() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");

        RiderApplication application_edited = RiderApplication.builder()
                        .status("pending")
                        .userId(UserId)
                        .perm_number("6543210")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("")
                        .build();
                    
        String requestBody = mapper.writeValueAsString(application_edited);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(UserId))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
        .andExpect(status().isNotFound()).andReturn();
        
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        Map<String, Object> json = responseToJson(response);
        assertEquals("RiderApplication with id 67 not found", json.get("message"));
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_canot_edit_application_whose_status_is_not_pending() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application_original = RiderApplication.builder()
                        .status("accepted")
                        .userId(UserId)
                        .perm_number("0123456")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("")
                        .build();

        RiderApplication application_edited = RiderApplication.builder()
                        .status("accepted")
                        .userId(UserId)
                        .perm_number("6543210")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(null)
                        .description("")
                        .notes("")
                        .build();
                    
        String requestBody = mapper.writeValueAsString(application_edited);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(UserId))).thenReturn(Optional.of(application_original));

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
        .andExpect(status().isBadRequest()).andReturn();
        
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        String responseString = response.getResponse().getContentAsString();
        assertEquals("RiderApplication with \"accepted\" status cannot be updated", responseString);
    }

    // EDIT (CANCEL)

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_can_cancel_their_own_application_whose_status_is_pending() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application_original = RiderApplication.builder()
                        .status("pending")
                        .userId(UserId)
                        .perm_number("0123456")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("")
                        .notes("")
                        .build();

        RiderApplication application_cancelled = RiderApplication.builder()
                        .status("cancelled")
                        .userId(UserId)
                        .perm_number("0123456")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(currentDate)
                        .description("")
                        .notes("")
                        .build();

        String requestBody = mapper.writeValueAsString(application_cancelled);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(UserId))).thenReturn(Optional.of(application_original));

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication/cancel?id=67")
                            .contentType(MediaType.APPLICATION_JSON)
                            .characterEncoding("utf-8")
                            .content(requestBody)
                            .with(csrf()))
            .andExpect(status().isOk()).andReturn();
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        verify(riderApplicationRepository, times(1)).save(application_cancelled); // should be saved with correct user
        String responseString = response.getResponse().getContentAsString();
        assertEquals(requestBody, responseString);
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_cannot_cancel_other_members_application() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        Long otherUserId = UserId + 1;
        String Email = "random@example.org";

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application_original = RiderApplication.builder()
                        .status("pending")
                        .userId(otherUserId)
                        .perm_number("9876543")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("")
                        .build();

        RiderApplication application_cancelled = RiderApplication.builder()
                        .status("cancelled")
                        .userId(otherUserId)
                        .perm_number("9876543")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(currentDate)
                        .description("My legs were broken")
                        .notes("")
                        .build();
                    
        String requestBody = mapper.writeValueAsString(application_cancelled);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(otherUserId))).thenReturn(Optional.of(application_original));

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication/cancel?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
        .andExpect(status().isNotFound()).andReturn();
        
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        Map<String, Object> json = responseToJson(response);
        assertEquals("RiderApplication with id 67 not found", json.get("message"));
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_cannot_cancel_application_that_does_not_exist() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");

        RiderApplication application_cancelled = RiderApplication.builder()
                        .status("pending")
                        .userId(UserId)
                        .perm_number("6543210")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(null)
                        .description("My legs were broken")
                        .notes("")
                        .build();
                    
        String requestBody = mapper.writeValueAsString(application_cancelled);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(UserId))).thenReturn(Optional.empty());

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication/cancel?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
        .andExpect(status().isNotFound()).andReturn();
        
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        Map<String, Object> json = responseToJson(response);
        assertEquals("RiderApplication with id 67 not found", json.get("message"));
    }

    @WithMockUser(roles = { "MEMBER" })
    @Test
    public void member_canot_cancel_application_whose_status_is_not_pending() throws Exception {

        Long UserId = currentUserService.getCurrentUser().getUser().getId();
        String Email = currentUserService.getCurrentUser().getUser().getEmail();

        // Get the current date
        LocalDate localDate = LocalDate.now();
        Date currentDate = Date.valueOf(localDate);
        Date testDate1 = Date.valueOf("2023-03-20");
        Date testDate2 = Date.valueOf("2023-03-29");

        RiderApplication application_original = RiderApplication.builder()
                        .status("declined")
                        .userId(UserId)
                        .perm_number("2345678")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(testDate2)
                        .cancelled_date(null)
                        .description("")
                        .notes("declined; no medical proof provided in time")
                        .build();

        RiderApplication application_cancelled = RiderApplication.builder()
                        .status("cancelled")
                        .userId(UserId)
                        .perm_number("2345678")
                        .email(Email)
                        .created_date(testDate1)
                        .updated_date(currentDate)
                        .cancelled_date(currentDate)
                        .description("")
                        .notes("declined; no medical proof provided in time")
                        .build();
                    
        String requestBody = mapper.writeValueAsString(application_cancelled);

        when(riderApplicationRepository.findByIdAndUserId(eq(67L), eq(UserId))).thenReturn(Optional.of(application_original));

        // act
        MvcResult response = mockMvc.perform(
        put("/api/riderApplication/cancel?id=67")
                        .contentType(MediaType.APPLICATION_JSON)
                        .characterEncoding("utf-8")
                        .content(requestBody)
                        .with(csrf()))
        .andExpect(status().isBadRequest()).andReturn();
        
        // assert
        verify(riderApplicationRepository, times(1)).findByIdAndUserId(eq(67L), eq(UserId));
        String responseString = response.getResponse().getContentAsString();
        assertEquals("RiderApplication with \"declined\" status cannot be cancelled", responseString);
    }
}
