import { fireEvent, render, waitFor, screen } from "@testing-library/react";
import { shiftFixtures } from "fixtures/shiftFixtures";
import ShiftTable from "main/components/Shift/ShiftTable"
import { QueryClient, QueryClientProvider } from "react-query";
import { MemoryRouter } from "react-router-dom";
import { currentUserFixtures } from "fixtures/currentUserFixtures";

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockedNavigate
}));

describe("ShiftTable tests", () => {
    const queryClient = new QueryClient();

    test("renders without crashing for empty table", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftTable shift={[]} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("renders without crashing for three shifts", () => {
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftTable shift={shiftFixtures.threeShifts} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    });

    test("Has the expected column headers and content for ordinary user", () => {

        const currentUser = currentUserFixtures.userOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftTable shift={shiftFixtures.threeShifts} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );
    
        const expectedHeaders = ["id", "Day", "Shift start", "Shift end", "Driver", "Backup driver"];
        const expectedFields = ["id", "day", "shiftStart", "shiftEnd", "driverID", "driverBackupID"];
        const testId = "ShiftTable";

        expectedHeaders.forEach( (headerText)=> {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach( (field)=> {
          const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
          expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Monday");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-shiftStart`)).toHaveTextContent("08:00AM");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-shiftEnd`)).toHaveTextContent("11:00AM");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-driverID`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-day`)).toHaveTextContent("Tuesday");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-shiftStart`)).toHaveTextContent("11:00AM");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-shiftEnd`)).toHaveTextContent("02:00PM");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-driverID`)).toHaveTextContent("2");

        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).not.toBeInTheDocument();

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).not.toBeInTheDocument();
    });

    test("Has expected column headers and content for adminUser", () => {

        const currentUser = currentUserFixtures.adminOnly;

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftTable shift={shiftFixtures.threeShifts} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const expectedHeaders = ["id", "Day", "Shift start", "Shift end", "Driver", "Backup driver"];
        const expectedFields = ["id", "day", "shiftStart", "shiftEnd", "driverID", "driverBackupID"];
        const testId = "ShiftTable";

        expectedHeaders.forEach((headerText) => {
            const header = screen.getByText(headerText);
            expect(header).toBeInTheDocument();
        });

        expectedFields.forEach((field) => {
            const header = screen.getByTestId(`${testId}-cell-row-0-col-${field}`);
            expect(header).toBeInTheDocument();
        });

        expect(screen.getByTestId(`${testId}-cell-row-0-col-id`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-day`)).toHaveTextContent("Monday");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-shiftStart`)).toHaveTextContent("08:00AM");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-shiftEnd`)).toHaveTextContent("11:00AM");
        expect(screen.getByTestId(`${testId}-cell-row-0-col-driverID`)).toHaveTextContent("1");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-id`)).toHaveTextContent("2");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-day`)).toHaveTextContent("Tuesday");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-shiftStart`)).toHaveTextContent("11:00AM");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-shiftEnd`)).toHaveTextContent("02:00PM");
        expect(screen.getByTestId(`${testId}-cell-row-1-col-driverID`)).toHaveTextContent("2");

        const editButton = screen.queryByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();
        expect(editButton).toHaveClass("btn-primary");

        const deleteButton = screen.queryByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();
        expect(deleteButton).toHaveClass("btn-danger");
    });

    test("Edit button navigates to the edit page as adminUser", async () => {
        // arrange
        const currentUser = currentUserFixtures.adminOnly;

        const testId = "ShiftTable";
        // act - render the component
        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftTable shift={shiftFixtures.threeShifts} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const editButton = screen.getByTestId(`${testId}-cell-row-0-col-Edit-button`);
        expect(editButton).toBeInTheDocument();

        // act - click the edit button
        fireEvent.click(editButton);

        // assert - check that the navigate function was called with the expected path
        await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith('/shift/edit/1'));
    });

    test("Delete button calls delete callback for adminUser", async () => {

        const currentUser = currentUserFixtures.adminOnly;

        const testId = "ShiftTable";

        render(
            <QueryClientProvider client={queryClient}>
                <MemoryRouter>
                    <ShiftTable shift={shiftFixtures.threeShifts} currentUser={currentUser} />
                </MemoryRouter>
            </QueryClientProvider>
        );

        const deleteButton = screen.getByTestId(`${testId}-cell-row-0-col-Delete-button`);
        expect(deleteButton).toBeInTheDocument();

        fireEvent.click(deleteButton);
    });

});
