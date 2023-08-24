import { render, waitFor, fireEvent } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { apiCurrentUserFixtures }  from "fixtures/currentUserFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";
import ProfilePage from "main/pages/ProfilePage";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

describe("ProfilePage tests", () => {

    const queryClient = new QueryClient();
    const axiosMock =new AxiosMockAdapter(axios);

    beforeEach( () => {
        axiosMock.reset();
        axiosMock.resetHistory();
    });

    test("the modal closes when handleClose is triggered", async () => {
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    
        const { getByText, queryByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        await waitFor(() => expect(getByText("Cellphone No.:")).toBeInTheDocument());
    
        const editButton = getByText('Edit');
        fireEvent.click(editButton);
    
        expect(getByText('Update Cell Phone Number')).toBeInTheDocument();
    
        const closeButton = getByText('Close');
        fireEvent.click(closeButton);
    
        await waitFor(() => {
            expect(queryByText('Update Cell Phone Number')).not.toBeInTheDocument();
        });    
    }); 

    test("renders correctly for regular logged in user", async () => {

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor( () => expect(getByText("Phillip Conrad")).toBeInTheDocument() );
        expect(getByText("pconrad.cis@gmail.com")).toBeInTheDocument();
    });

    test("renders correctly for admin user", async () => {

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        const { getByText, getByTestId, queryByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor( () => expect(getByText("Phill Conrad")).toBeInTheDocument() );
        expect(getByText("phtcon@ucsb.edu")).toBeInTheDocument();
        expect(getByTestId("role-badge-user")).toBeInTheDocument();
        expect(getByTestId("role-badge-admin")).toBeInTheDocument();
        expect(getByTestId("role-badge-member")).toBeInTheDocument();

        expect(getByTestId("role-missing-driver")).toBeInTheDocument();
        expect(getByTestId("role-missing-rider")).toBeInTheDocument();

        expect(queryByTestId("role-badge-driver")).not.toBeInTheDocument();
        expect(queryByTestId("role-badge-rider")).not.toBeInTheDocument();
    });


    test("renders correctly for driver", async () => {

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.driverOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor( () =>  expect(getByTestId("role-badge-driver")).toBeInTheDocument() );
        expect(getByTestId("role-missing-admin")).toBeInTheDocument();
        expect(getByTestId("role-missing-member")).toBeInTheDocument();
        expect(getByTestId("role-missing-rider")).toBeInTheDocument();
    });

    test("renders correctly for rider", async () => {

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.riderOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        const { getByTestId } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor( () => expect(getByTestId("role-badge-rider")).toBeInTheDocument() );        
        expect(getByTestId("role-missing-driver")).toBeInTheDocument();
        expect(getByTestId("role-missing-admin")).toBeInTheDocument();
        expect(getByTestId("role-missing-member")).toBeInTheDocument();
    });

    test("cellphone number is displayed", async () => {

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);

        const { getByText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor( () => expect(getByText("Cellphone No.:")).toBeInTheDocument() );
    });

    test("cellphone number can be updated through the modal", async () => {

        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
        axiosMock.onPut("/api/userprofile/updatecellphone").reply(200, { success: true });
    
        const { getByText, getByLabelText } = render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ProfilePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        await waitFor(() => expect(getByText("Cellphone No.:")).toBeInTheDocument());
    
        const editButton = getByText('Edit');
        fireEvent.click(editButton);
    
        await waitFor(() => getByText('Update Cell Phone Number'));
    
        const phoneNumberInput = getByLabelText('Phone Number');
        fireEvent.change(phoneNumberInput, { target: { value: '1234567890' } });
    
        const saveButton = getByText('Save Changes');
        fireEvent.click(saveButton);

        await waitFor(() => expect(getByText('Cellphone No.: 1234567890')).toBeInTheDocument());
    });

       
});


