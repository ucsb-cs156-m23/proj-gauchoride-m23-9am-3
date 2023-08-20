import React from 'react';
import ShiftTable from 'main/components/Shift/ShiftTable';
import { shiftFixtures } from 'fixtures/shiftFixtures';
import { currentUserFixtures } from 'fixtures/currentUserFixtures';

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

export const ThreeShiftsAdminUser = Template.bind({});

ThreeShiftsAdminUser.args = {
    shift: shiftFixtures.threeShifts,
    currentUser: currentUserFixtures.adminUser,
}

export const ThreeShiftsDriverUser = Template.bind({});

ThreeShiftsDriverUser.args = {
    shift: shiftFixtures.threeShifts,
    currentUser: currentUserFixtures.driverOnly,
}
