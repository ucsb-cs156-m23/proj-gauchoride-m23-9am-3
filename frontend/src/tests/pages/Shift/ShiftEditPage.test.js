import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ShiftEditPage from "main/pages/Shift/ShiftEditPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

import mockConsole from "jest-mock-console";

const mockToast = jest.fn();
jest.mock('react-toastify', () => {
    const originalModule = jest.requireActual('react-toastify');
    return {
        __esModule: true,
        ...originalModule,
        toast: (x) => mockToast(x)
    };
});

const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => {
    const originalModule = jest.requireActual('react-router-dom');
    return {
        __esModule: true,
        ...originalModule,
        useParams: () => ({
            id: 5
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ShiftEditPage tests", () => {

    describe("when the backend doesn't return data", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/shift", { params: { id: 5 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ShiftEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await screen.findByText("Edit Shift");
            expect(screen.queryByTestId("ShiftForm-id")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally" , () => {

        const axiosMock = new AxiosMockAdapter(axios);
        const queryClient = new QueryClient();

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/shift", { params: { id: 5 } }).reply(200, {
                id: 5,
                day: "Wednesday",
                shiftStart: "9:00AM",
                shiftEnd: "12:00PM",
                driverID: 6,
                driverBackupID: 12
            });
            axiosMock.onPut('/api/shift').reply(200, {
                id: 5,
                day: "Thursday",
                shiftStart: "11:45AM",
                shiftEnd: "4:15PM",
                driverID: 10,
                driverBackupID: 13
            });
        });

        test("Is populated with the data provided", async () => {

            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ShiftEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await screen.findByTestId("ShiftForm-id");

            const idField = screen.getByTestId("ShiftForm-id");
            const dayField = screen.getByTestId("ShiftForm-day");
            const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
            const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
            const driverIDField = screen.getByTestId("ShiftForm-driverID");
            const driverBackupIDField = screen.getByTestId("ShiftForm-driverBackupID");
            const submitButton = screen.getByTestId("ShiftForm-submit");

            expect(idField).toBeInTheDocument();
            expect(idField).toHaveValue("5");
            expect(dayField).toBeInTheDocument();
            expect(dayField).toHaveValue("Wednesday");
            expect(shiftStartField).toBeInTheDocument();
            expect(shiftStartField).toHaveValue("9:00AM");
            expect(shiftEndField).toBeInTheDocument();
            expect(shiftEndField).toHaveValue("12:00PM");
            expect(driverIDField).toBeInTheDocument();
            expect(driverIDField).toHaveValue("6");
            expect(driverBackupIDField).toBeInTheDocument();
            expect(driverBackupIDField).toHaveValue("12");
            expect(submitButton).toBeInTheDocument();
            expect(submitButton).toHaveTextContent("Update");

            fireEvent.change(dayField, { target: { value: "Thursday" } });
            fireEvent.change(shiftStartField, { target: { value: "11:45AM" } });
            fireEvent.change(shiftEndField, { target: { value: "4:15PM" } });
            fireEvent.change(driverIDField, { target: { value: 10 } });
            fireEvent.change(driverBackupIDField, { target: { value: 13 } });

            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Shift Updated - id: 5");
            expect(mockNavigate).toBeCalledWith({ "to": "/shift" });

            expect(axiosMock.history.put.length).toBe(1);
            expect(axiosMock.history.put[0].params).toEqual({ id: 5 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                day: "Thursday",
                shiftStart: "11:45AM",
                shiftEnd: "4:15PM",
                driverID: "10",
                driverBackupID: "13"
            }));
        });

        test("Changes when you click Update", async () => {
            
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <ShiftEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            
            await screen.findByTestId("ShiftForm-id");

            const idField = screen.getByTestId("ShiftForm-id");
            const dayField = screen.getByTestId("ShiftForm-day");
            const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
            const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
            const driverIDField = screen.getByTestId("ShiftForm-driverID");
            const driverBackupIDField = screen.getByTestId("ShiftForm-driverBackupID");
            const submitButton = screen.getByTestId("ShiftForm-submit");

            expect(idField).toHaveValue("5");
            expect(dayField).toHaveValue("Wednesday");
            expect(shiftStartField).toHaveValue("9:00AM");
            expect(shiftEndField).toHaveValue("12:00PM");
            expect(driverIDField).toHaveValue("6");
            expect(driverBackupIDField).toHaveValue("12");
            expect(submitButton).toBeInTheDocument();

            fireEvent.change(dayField, { target: { value: "Thursday" } });
            fireEvent.change(shiftStartField, { target: { value: "11:45AM" } });
            fireEvent.change(shiftEndField, { target: { value: "4:15PM" } });
            fireEvent.change(driverIDField, { target: { value: 10 } });
            fireEvent.change(driverBackupIDField, { target: { value: 13 } });

            expect(submitButton).toHaveTextContent("Update");
            fireEvent.click(submitButton);

            await waitFor(() => expect(mockToast).toBeCalled());
            expect(mockToast).toBeCalledWith("Shift Updated - id: 5");
            expect(mockNavigate).toBeCalledWith({ "to": "/shift" });
        });

    });
})