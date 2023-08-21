import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router-dom";

import ShiftForm from "main/components/Shift/ShiftForm";
import { shiftFixtures } from "fixtures/shiftFixtures";

import { QueryClient, QueryClientProvider } from "react-query";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ShiftForm tests", () => {
    const queryClient = new QueryClient();

    const expectedHeaders = ["Day of Week", "Start Time", "End Time", "Driver ID", "Driver Backup ID"];
    const testId = "ShiftForm";

    test("renders correctly with no initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });
    });

    test("renders correctly when passing in initialContents", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm initialContents={shiftFixtures.oneShift} />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
        expect(screen.getByText(`Id`)).toBeInTheDocument();
    });

    test("that navigate(-1) is called when Cancel is clicked", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
        expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
        const cancelButton = screen.getByTestId(`${testId}-cancel`);

        fireEvent.click(cancelButton);

        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
    });

    test("that the correct validations are performed", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );

        expect(await screen.findByText(/Create/)).toBeInTheDocument();
        const submitButton = screen.getByText(/Create/);
        fireEvent.click(submitButton);

        await screen.findByText(/Day is required/);
        expect(screen.getByText(/Start time is required/));
        expect(screen.getByText(/End time is required/));
        expect(screen.getByText(/Driver ID is required/));
        expect(screen.getByText(/Backup Driver's ID is required/));
    });

    test("Correct Error messages on missing input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );

        await screen.findByTestId(`${testId}-submit`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.click(submitButton);
        await screen.findByText(/Day is required/);
        expect(screen.getByText(/Start time is required/));
        expect(screen.getByText(/End time is required/));
        expect(screen.getByText(/Driver ID is required/));
        expect(screen.getByText(/Backup Driver's ID is required/));
    });

    test("Correct error messages on bad input", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId(`${testId}-shiftStart`);
        const shiftStartField = screen.getByTestId(`${testId}-shiftStart`);
        const shiftEndField = screen.getByTestId(`${testId}-shiftEnd`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(shiftStartField, { target: { value: 'bad-input' } });
        fireEvent.change(shiftEndField, { target: { value: 'bad-input' } });
        fireEvent.click(submitButton);

        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./);
        expect(screen.getByText(/End time needs to be in HH:MM AM or PM format./)).toBeInTheDocument();
    });

    test("renders data-testid attributes", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
        expect(screen.getByTestId(`${testId}-day`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-shiftStart`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-shiftEnd`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-driverID`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-driverBackupID`)).toBeInTheDocument();
        expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
    });

    test("valid time format", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );

        const shiftStartField = screen.getByTestId(`${testId}-shiftStart`);
        const shiftEndField = screen.getByTestId(`${testId}-shiftEnd`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(shiftStartField, { target: { value: "3408:23AM" } });
        fireEvent.click(submitButton);
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./);
        fireEvent.change(shiftStartField, { target: { value: "" } });

        fireEvent.change(shiftStartField, { target: { value: "4320972:X7AX" } });
        fireEvent.click(submitButton);
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./);
        fireEvent.change(shiftStartField, { target: { value: "" } });

        fireEvent.change(shiftEndField, { target: { value: "12567:Ah72PM" } });
        fireEvent.click(submitButton);
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./);
        fireEvent.change(shiftEndField, { target: { value: "" } });

        fireEvent.change(shiftEndField, { target: { value: "6543:30BM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./)
    });

    test("validates specific time format anomalies", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftStartField, { target: { value: "X12:59AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    
        fireEvent.change(shiftStartField, { target: { value: "10:59AMX" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    
        fireEvent.change(shiftStartField, { target: { value: "01X:59AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    
        // Repeat for shiftEndInput
        fireEvent.change(shiftEndField, { target: { value: "X11:59AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
        
        fireEvent.change(shiftEndField, { target: { value: "11:59AMX" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
        
        fireEvent.change(shiftEndField, { target: { value: "01X:59AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
    });

    test("validates time format with extra characters", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftStartField, { target: { value: "11:59AMX" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    
        fireEvent.change(shiftStartField, { target: { value: "" } });

        fireEvent.change(shiftEndField, { target: { value: "11:59PMX" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
    
        fireEvent.change(shiftEndField, { target: { value: "" } });
    });
    
    test("validates time format with character anomalies", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftStartField, { target: { value: "0X:00AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    
        fireEvent.change(shiftStartField, { target: { value: "" } });
    
        fireEvent.change(shiftEndField, { target: { value: "0X:00PM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
    
        fireEvent.change(shiftEndField, { target: { value: "" } });
    });
    
    test("invalidates incorrect time formats from mutations", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftStartField, { target: { value: "12:X5AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
        fireEvent.change(shiftStartField, { target: { value: "" } });
    
        fireEvent.change(shiftEndField, { target: { value: "1X:59AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
        fireEvent.change(shiftEndField, { target: { value: "" } });
    
        fireEvent.change(shiftStartField, { target: { value: "11:5XAM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    });

    test("invalidates evem more time formats from mutations", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftStartField, { target: { value: "1X:00AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
        fireEvent.change(shiftStartField, { target: { value: "" } });
    
        fireEvent.change(shiftEndField, { target: { value: "12:X0AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/nd time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
        fireEvent.change(shiftEndField, { target: { value: "" } });
    
        fireEvent.change(shiftStartField, { target: { value: "11:5XAM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/Start time needs to be in HH:MM AM or PM format./, { selector: '#shiftStart + .invalid-feedback' });
    });
    
    test("validates time format with more character anomalies for shift end", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftEndField, { target: { value: "0X:00AM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
        
        // Resetting input
        fireEvent.change(shiftEndField, { target: { value: "" } });
    });

    test("validates that the minutes part of the time format must have digits", async () => {
        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm />
                </Router>
            </QueryClientProvider>
        );
    
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
    
        fireEvent.change(shiftEndField, { target: { value: "12:5XAM" } });
        fireEvent.click(screen.getByText(/Create/));
        await screen.findByText(/End time needs to be in HH:MM AM or PM format./, { selector: '#shiftEnd + .invalid-feedback' });
    
        // Resetting input
        fireEvent.change(shiftEndField, { target: { value: "" } });
    });
    
});