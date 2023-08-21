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

    const expectedHeaders = ["Day of Week", "Start Time", "End Time", "Driver ID", "Backup Driver ID"];
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
        await screen.findByTestId(`${testId}-cancel`);
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
        const dayField = screen.getByTestId(`${testId}-day`);
        const shiftStartField = screen.getByTestId(`${testId}-shiftStart`);
        const shiftEndField = screen.getByTestId(`${testId}-shiftEnd`);
        const driverIDField = screen.getByTestId(`${testId}-driverID`);
        const driverBackupIDField = screen.getByTestId(`${testId}-driverBackupID`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(dayField, { target: { value: "Wednesday" } });
        fireEvent.change(shiftStartField, { target: { value: 'bad-input' } });
        fireEvent.change(shiftEndField, { target: { value: 'bad-input' } });
        fireEvent.change(driverIDField, { target: { value: 6 } });
        fireEvent.change(driverBackupIDField, { target: { value: 10 } });
        fireEvent.click(submitButton);

        await screen.findByText(/Start time must be in the format HH:MM AM or PM, e.g. 3:30PM/);
        expect(screen.getByText(/End time must be in the format HH:MM AM or PM, e.g. 1:30PM/)).toBeInTheDocument();
    });

    test("No error messages on good input", async () => {
        const mockSubmitAction = jest.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <Router>
                    <ShiftForm  submitAction={mockSubmitAction}/>
                </Router>
            </QueryClientProvider>
        );
        await screen.findByTestId(`${testId}-day`);
        
        const dayField = screen.getByTestId(`${testId}-day`);
        const shiftStartField = screen.getByTestId(`${testId}-shiftStart`);
        const shiftEndField = screen.getByTestId(`${testId}-shiftEnd`);
        const driverIDField = screen.getByTestId(`${testId}-driverID`);
        const driverBackupIDField = screen.getByTestId(`${testId}-driverBackupID`);
        const submitButton = screen.getByTestId(`${testId}-submit`);

        fireEvent.change(dayField, { target: { value: 'Tuesday' } });
        fireEvent.change(shiftStartField, { target: { value: '10:30AM' } });
        fireEvent.change(shiftEndField, { target: { value: '2:00PM' } });
        fireEvent.change(driverIDField, { target: { value: '123' } });
        fireEvent.change(driverBackupIDField, { target: { value: '456' } });
        fireEvent.click(submitButton);

        expect(screen.getByTestId(`${testId}-day`)).toHaveValue("Tuesday");

        await waitFor(() => expect(mockSubmitAction).toHaveBeenCalled());

        expect(screen.queryByText(/Start time must be in the format HH:MM AM or PM, e.g. 3:30PM/)).not.toBeInTheDocument();
        expect(screen.queryByText(/End time must be in the format HH:MM AM or PM, e.g. 1:30PM/)).not.toBeInTheDocument();
    })
})
