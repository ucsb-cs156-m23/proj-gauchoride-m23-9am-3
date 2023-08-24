import React from "react";
import OurTable, { ButtonColumn } from "main/components/OurTable";
import { useBackendMutation } from "main/utils/useBackend";
import { cellToAxiosParamsDelete, onDeleteSuccess } from "main/utils/shiftUtils"
import { useNavigate } from "react-router-dom";
import { hasRole } from "main/utils/currentUser";


export default function ShiftTable({ shift, currentUser }) {

    const navigate = useNavigate();

    const editCallback = (cell) => {
        navigate(`/shift/edit/${cell.row.values.id}`)
    }

    // Stryker disable all : hard to test for query caching

    const deleteMutation = useBackendMutation(
        cellToAxiosParamsDelete,
        { onSuccess: onDeleteSuccess },
        ["/api/shift/all"]
    );

    // Stryker restore all

    // Stryker disable next-line all : TODO try to make a good test for this
    const deleteCallback = async (cell) => { deleteMutation.mutate(cell); }


    const columns = [
        {
            Header: 'id',
            accessor: 'id', // accessor is the "key" in the data
        },
        {
            Header: 'Day',
            accessor: 'day',
        },
        {
            Header: 'Shift start',
            accessor: 'shiftStart',
        },
        {
            Header: 'Shift end',
            accessor: 'shiftEnd',
        },
        {
            Header: 'Driver',
            accessor: 'driverID'
        },
        {
            Header: 'Backup driver',
            accessor: 'driverBackupID',
        }
    ];

    if (hasRole(currentUser, "ROLE_ADMIN")) {
        columns.push(ButtonColumn("Edit", "primary", editCallback, "ShiftTable"));
        columns.push(ButtonColumn("Delete", "danger", deleteCallback, "ShiftTable"));
    }

    return <OurTable
        data={shift}
        columns={columns}
        testid={"ShiftTable"}
    />;
};