import React from 'react';
import ShiftTable from 'main/components/Shift/ShiftTable';
import { shiftFixtures } from 'fixtures/shiftFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';
import { rest } from "msw";

export default {
    title: 'components/Shift/ShiftTable',
    component: ShiftTable
};

const Template = (args) => {
    return (
        <ShiftTable {...args} />
    )
};

export const Empty = Template.bind({});

Empty.args = {
    shift: []
};

export const ThreeShiftsOrdinaryUser = Template.bind({});

ThreeShiftsOrdinaryUser.args = {
    shift: shiftFixtures.threeShifts,
    currentUser: currentUserFixtures.userOnly,
}

export const ThreeShiftsDriverUser = Template.bind({});

ThreeShiftsDriverUser.args = {
    shift: shiftFixtures.threeShifts,
    currentUser: currentUserFixtures.driverOnly,
}

export const ThreeShiftsAdminUser = Template.bind({});

ThreeShiftsAdminUser.args = {
    shift: shiftFixtures.threeShifts,
    currentUser: currentUserFixtures.adminUser,
}

ThreeShiftsAdminUser.parameters = {
    msw: [
        rest.delete('/api/shift', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ]
};
