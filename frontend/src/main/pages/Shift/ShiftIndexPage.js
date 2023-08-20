import React from 'react';
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import ShiftTable from 'main/components/Shift/ShiftTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser, hasRole } from 'main/utils/currentUser';

export default function ShiftIndexPage() {

    const currentUser = useCurrentUser();

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN") || hasRole(currentUser, "ROLE_DRIVER")) {
            return (
                <Button
                    variant="primary"
                    href="/shift/create"
                    style={{ float: "right" }}
                >
                    Create Shift
                </Button>
            )
        }
    }

    const { data: shift, error: _error, status: _status } =
        useBackend(
            // Stryker disable next line all : don't test internal caching of React Query
            ["/api/shift/all"],
            { method: "GET", url: "/api/shift/all" },
            []
        );
    
    return (
        <BasicLayout>
            <div className="pt-2">
                {createButton()}
                <h1>Shifts</h1>
                <ShiftTable shift={shift} currentUser={currentUser} />
            </div>
        </BasicLayout>
    )
}