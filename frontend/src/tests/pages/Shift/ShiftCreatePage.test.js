import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ShiftCreatePage from "main/pages/Shift/ShiftCreatePage";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

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
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("ShiftCreatePage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    beforeEach(() => {
        jest.clearAllMocks();
        axiosMock.resetHistory();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    });

    const queryClient = new QueryClient();

    test("renders without crashing", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("on submit, makes request to backend and redirects to /shift", async () => {

        const shiftItem = {
            id: 4,
            day: "Wednesday",
            shiftStart: "10:00AM",
            shiftEnd: "1:00PM",
            driverID: 6,
            driverBackupID: 11
        };

        axiosMock.onPost("/api/shift/post").reply(202, shiftItem);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftCreatePage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByTestId("ShiftForm-day")).toBeInTheDocument();
        });

        const dayField = screen.getByTestId("ShiftForm-day");
        const shiftStartField = screen.getByTestId("ShiftForm-shiftStart");
        const shiftEndField = screen.getByTestId("ShiftForm-shiftEnd");
        const driverIDField = screen.getByTestId("ShiftForm-driverID");
        const driverBackupIDField = screen.getByTestId("ShiftForm-driverBackupID");
        const submitButton = screen.getByTestId("ShiftForm-submit");

        fireEvent.change(dayField, { target: { value: "Wednesday" } });
        fireEvent.change(shiftStartField, { target: { value: "10:00AM" } });
        fireEvent.change(shiftEndField, { target: { value: "1:00PM" } });
        fireEvent.change(driverIDField, { target: { value: 6 } });
        fireEvent.change(driverBackupIDField, { target: { value: 11 } });

        expect(submitButton).toBeInTheDocument();

        fireEvent.click(submitButton);

        await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

        expect(axiosMock.history.post[0].params).toEqual(
            {
                "day": "Wednesday",
                "shiftStart": "10:00AM",
                "shiftEnd": "1:00PM",
                "driverID": "6",
                "driverBackupID": "11"
            });
        
        expect(mockToast).toBeCalledWith("New Shift Created - id: 4 driverID: 6");
        expect(mockNavigate).toBeCalledWith({ "to": "/shift" });
    });

});