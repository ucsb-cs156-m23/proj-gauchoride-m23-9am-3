import { fireEvent, render, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import RideRequestEditPage from "main/pages/Ride/RideRequestEditPage";

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
            id: 17
        }),
        Navigate: (x) => { mockNavigate(x); return null; }
    };
});

describe("RideRequestEditPage tests", () => {

    describe("when the backend doesn't return a todo", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ride_request", { params: { id: 17 } }).timeout();
        });

        const queryClient = new QueryClient();
        test("renders header but table is not present", async () => {

            const restoreConsole = mockConsole();

            const {queryByTestId, findByText} = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RideRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
            await findByText("Edit Ride Request");
            expect(queryByTestId("RideForm-day")).not.toBeInTheDocument();
            restoreConsole();
        });
    });

    describe("tests where backend is working normally", () => {

        const axiosMock = new AxiosMockAdapter(axios);

        beforeEach(() => {
            axiosMock.reset();
            axiosMock.resetHistory();
            axiosMock.onGet("/api/currentUser").reply(200, apiCurrentUserFixtures.userOnly);
            axiosMock.onGet("/api/systemInfo").reply(200, systemInfoFixtures.showingNeither);
            axiosMock.onGet("/api/ride_request", { params: { id: 17 } }).reply(200, {
                id: 17,
                day: "Tuesday",
                startTime: "5:00PM",
                endTime: "7:30PM", 
                pickupLocation: "HSSB",
                pickupRoom: "1203",
                dropoffLocation: "SRB",
                dropoffRoom: "125",
                course: "CMPSC 156",
                notes: ""
            });
            axiosMock.onPut('/api/ride_request').reply(200, {
                id: "17",
                day: "Monday",
                startTime: "3:30PM",
                endTime: "4:30PM", 
                pickupLocation: "Phelps",
                pickupRoom: "2503",
                dropoffLocation: "HSSB",
                dropoffRoom: "1215",
                course: "WRIT 105CD",
                notes: "Please inform me prior to your arrival."
            });
        });

        const queryClient = new QueryClient();
        test("renders without crashing", () => {
            render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RideRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );
        });

        test("Is populated with the data provided", async () => {

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RideRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RideForm-day");

            const dayField = getByTestId("RideForm-day");
            const startTimeField = getByTestId("RideForm-start");
            const endTimeField = getByTestId("RideForm-end");
            const pickupLocationField = getByTestId("RideForm-pickup");
            const pickupRoomField = getByTestId("RideForm-pickupRoom");
            const dropoffLocationField = getByTestId("RideForm-dropoff");
            const dropoffRoomField = getByTestId("RideForm-dropoffRoom");
            const courseField = getByTestId("RideForm-course");
            const notesField = getByTestId("RideForm-notes");

            expect(dayField).toHaveValue("Tuesday");
            expect(startTimeField).toHaveValue("5:00PM");
            expect(endTimeField).toHaveValue("7:30PM");
            expect(pickupLocationField).toHaveValue("HSSB");
            expect(pickupRoomField).toHaveValue("1203");
            expect(dropoffLocationField).toHaveValue("SRB");
            expect(dropoffRoomField).toHaveValue("125");
            expect(courseField).toHaveValue("CMPSC 156");
            expect(notesField).toHaveValue("");
            
        });

        test("Changes when you click Update", async () => {

                

            const { getByTestId, findByTestId } = render(
                <QueryClientProvider client={queryClient}>
                    <MemoryRouter>
                        <RideRequestEditPage />
                    </MemoryRouter>
                </QueryClientProvider>
            );

            await findByTestId("RideForm-day");

            const dayField = getByTestId("RideForm-day");
            const startTimeField = getByTestId("RideForm-start");
            const endTimeField = getByTestId("RideForm-end");
            const pickupLocationField = getByTestId("RideForm-pickup");
            const pickupRoomField = getByTestId("RideForm-pickupRoom");
            const dropoffLocationField = getByTestId("RideForm-dropoff");
            const dropoffRoomField = getByTestId("RideForm-dropoffRoom");
            const courseField = getByTestId("RideForm-course");
            const notesField = getByTestId("RideForm-notes");
            const submitButton = getByTestId("RideForm-submit");


            expect(dayField).toHaveValue("Tuesday");
            expect(startTimeField).toHaveValue("5:00PM");
            expect(endTimeField).toHaveValue("7:30PM");
            expect(pickupLocationField).toHaveValue("HSSB");
            expect(pickupRoomField).toHaveValue("1203");
            expect(dropoffLocationField).toHaveValue("SRB");
            expect(dropoffRoomField).toHaveValue("125");
            expect(courseField).toHaveValue("CMPSC 156");
            expect(notesField).toHaveValue("");

            expect(submitButton).toBeInTheDocument();

            fireEvent.change(dayField, { target: { value: 'Monday' } })
            fireEvent.change(startTimeField, { target: { value: '3:30PM' } })
            fireEvent.change(endTimeField, { target: { value: "4:30PM" } })
            fireEvent.change(pickupLocationField, { target: { value: 'Phelps' } })
            fireEvent.change(pickupRoomField, { target: {value: '2503'}})
            fireEvent.change(dropoffLocationField, { target: { value: 'HSSB' } })
            fireEvent.change(dropoffRoomField, { target: { value: "1215" } })
            fireEvent.change(courseField, { target: { value: "WRIT 105CD" } })
            fireEvent.change(notesField, { target: { value: "Please inform me prior to your arrival." } })

            fireEvent.click(submitButton);

    
            await waitFor(() => expect(mockToast).toHaveBeenCalled());
            expect(mockToast).toBeCalledWith("Ride Updated - id: 17");
            expect(mockNavigate).toBeCalledWith({ "to": "/ride/" });

            expect(axiosMock.history.put.length).toBe(1); // times called
            expect(axiosMock.history.put[0].params).toEqual({ id: 17 });
            expect(axiosMock.history.put[0].data).toBe(JSON.stringify({
                day: "Monday",
                startTime: "3:30PM",
                endTime: "4:30PM", 
                pickupLocation: "Phelps",
                pickupRoom: "2503",
                dropoffLocation: "HSSB",
                dropoffRoom: "1215",
                course: "WRIT 105CD",
                notes: "Please inform me prior to your arrival."
            })); // posted object

        });

       
    });
});
