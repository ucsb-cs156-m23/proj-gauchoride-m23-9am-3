import React from 'react';
import { useBackend } from 'main/utils/useBackend';
import BasicLayout from 'main/layouts/BasicLayout/BasicLayout';
import ShiftTable from 'main/components/Shift/ShiftTable';
import { Button } from 'react-bootstrap';
import { useCurrentUser, hasRole } from 'main/utils/currentUser';

export default function ShiftIndexPage() {

    const currentUser = useCurrentUser();

    const { data: shift, error: _error, status: _status } =
    useBackend(
        // Stryker disable all : don't test internal caching of React Query
        ["/api/shift/all"],
        { method: "GET", url: "/api/shift/all" },
        []
        // Stryker restore all
    );

    const createButton = () => {
        if (hasRole(currentUser, "ROLE_ADMIN")) {
            return (
                <Button
                    variant="primary"
                    href="/shift/create"
                    style={{ float: "right" }}
                >
                    Create Shift
                </Button>
            );
        }
    };
    
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