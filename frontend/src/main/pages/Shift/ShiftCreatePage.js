import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ShiftForm from "main/components/Shift/ShiftForm";
import { Navigate } from "react-router-dom";
import { useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ShiftCreatePage({storybook=false}) {

    const objectToAxiosParams = (shift) => ({
        url: "/api/shift/post",
        method: "POST",
        params: {
            day: shift.day,
            shiftStart: shift.shiftStart,
            shiftEnd: shift.shiftEnd,
            driverID: shift.driverID,
            driverBackupID: shift.driverBackupID
        }
    });

    const onSuccess = (shift) => {
        toast(`New Shift Created - id: ${shift.id} driverID: ${shift.driverID}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        ["/api/shift/all"]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess && !storybook) {
        return <Navigate to="/shift" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Create New Shift</h1>

                <ShiftForm submitAction={onSubmit} />
                
            </div>
        </BasicLayout>
    )
}