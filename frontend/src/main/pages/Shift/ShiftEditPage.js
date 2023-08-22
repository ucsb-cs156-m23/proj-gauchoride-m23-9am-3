import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import ShiftForm from "main/components/Shift/ShiftForm";
import { Navigate, useParams } from 'react-router-dom';
import { useBackend, useBackendMutation } from "main/utils/useBackend";
import { toast } from "react-toastify";

export default function ShiftEditPage() {
    let { id } = useParams();

    const { data: shift, _error, _status } =
       useBackend(
        // Stryker disable next-line all: don't test internal caching of React Query
        [`/api/shift?id=${id}`],
        { // Stryker disable next-line all : GET is the default, so changing this to "" doesn't introduce a bug
            method: "GET",
            url: '/api/shift',
            params: {
                id
            }
        }
    );
    
    const objectToAxiosPutParams = (shift) => ({
        url: "/api/shift",
        method: "PUT",
        params: {
            id: shift.id
        },
        data: {
            day: shift.day,
            shiftStart: shift.shiftStart,
            shiftEnd: shift.shiftEnd,
            driverID: shift.driverID,
            driverBackupID: shift.driverBackupID
        }
    });

    const onSuccess = (shift) => {
        toast(`Shift Updated - id: ${shift.id}`);
    }

    const mutation = useBackendMutation(
        objectToAxiosPutParams,
        { onSuccess },
        // Stryker disable next-line all : hard to set up test for caching
        [`/api/shift?id=${id}`]
    );

    const { isSuccess } = mutation

    const onSubmit = async (data) => {
        mutation.mutate(data);
    }

    if (isSuccess) {
        return <Navigate to="/shift" />
    }

    return (
        <BasicLayout>
            <div className="pt-2">
                <h1>Edit Shift</h1>
                {
                    shift && <ShiftForm submitAction={onSubmit} buttonLabel={"Update"} initialContents={shift} />
                }
            </div>
        </BasicLayout>
    )
}