import { fireEvent, render, waitFor, screen, queries } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import ShiftIndexPage from "main/pages/Shift/ShiftIndexPage";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { shiftFixtures } from "fixtures/shiftFixtures";
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

describe("ShiftIndexPage tests", () => {

    const axiosMock = new AxiosMockAdapter(axios);

    const testId = "ShiftTable";

    const setupUserOnly = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupAdminUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.adminUser);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const setupDriverUser = () => {
        axiosMock.reset();
        axiosMock.resetHistory();
        axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.driverOnly);
        axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
    };

    const queryClient = new QueryClient();

    test("renders with create button for admin user", async () => {
        setupAdminUser();
        axiosMock.onGet("/api/shift/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Shift/)).toBeInTheDocument();
        });

        const button = screen.getByText(/Create Shift/);
        expect(button).toHaveAttribute("href", "/shift/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders with create button for driver user", async () => {
        setupDriverUser();
        axiosMock.onGet("/api/shift/all").reply(200, []);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => {
            expect(screen.getByText(/Create Shift/)).toBeInTheDocument();
        });

        const button = screen.getByText(/Create Shift/);
        expect(button).toHaveAttribute("href", "/shift/create");
        expect(button).toHaveAttribute("style", "float: right;");
    });

    test("renders three shifts correctly for regular user", async () => {
        setupUserOnly();
        axiosMock.onGet("/api/shift/all").reply(200, shiftFixtures.threeShifts);

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1"); });
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-2-col-id`)).toHaveTextContent("3");

        expect(screen.queryByText(/Create Shift/)).not.toBeInTheDocument();
    });

    test("what happens when you click delete, admin" , async () => {
        setupAdminUser();
        axiosMock.onGet("/api/shift/all").reply(200, shiftFixtures.threeShifts);
        axiosMock.onDelete("/api/shift").reply(200, "Shift with id 1 was deleted");

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toBeInTheDocument(); });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);

        await waitFor(() => { expect(mockToast).toBeCalledWith("Shift with id 1 was deleted") });
    });

    test("renders empty table when backend unavailable, user only", async () => {
        setupUserOnly();

        axiosMock.onGet("/api/shift/all").timeout();

        const restoreConsole = mockConsole();

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftIndexPage />
                </MemoryRouter>
            </QueryClientProvider>
        );

        await waitFor(() => { expect(axiosMock.history.get.length).toBeGreaterThanOrEqual(1); });

        const errorMessage = console.error.mock.calls[0][0]; // TypeError, not sure why this is the case, maybe a problem with console.error
        expect(errorMessage).toMatch("Error communicating with backend via GET on /api/shift/all");
        restoreConsole();
    });

});