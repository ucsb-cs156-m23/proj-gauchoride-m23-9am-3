import React from 'react';
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { shiftFixtures } from 'fixtures/shiftFixtures';
import { rest } from "msw";

import ShiftIndexPage from 'main/pages/Shift/ShiftIndexPage';

export default {
    title: 'pages/Shift/ShiftIndexPage',
    component: ShiftIndexPage
};

const Template = () => <ShiftIndexPage storybook={true}/>;

export const Empty = Template.bind({});
Empty.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/shift/all', (_req, res, ctx) => {
            return res(ctx.json([]));
        }),
    ]
}

export const ThreeShiftsOrdinaryUser = Template.bind({});

ThreeShiftsOrdinaryUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.userOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/shift/all', (_req, res, ctx) => {
            return res(ctx.json(shiftFixtures.threeShifts));
        }),
    ],
}

export const ThreeShiftsAdminUser = Template.bind({});

ThreeShiftsAdminUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.adminUser));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/shift/all', (_req, res, ctx) => {
            return res(ctx.json(shiftFixtures.threeShifts));
        }),
        rest.delete('/api/shift', (req, res, ctx) => {
            window.alert("DELETE: " + JSON.stringify(req.url));
            return res(ctx.status(200),ctx.json({}));
        }),
    ],
}

export const ThreeShiftsDriverUser = Template.bind({});

ThreeShiftsDriverUser.parameters = {
    msw: [
        rest.get('/api/currentUser', (_req, res, ctx) => {
            return res(ctx.json(apiCurrentUserFixtures.driverOnly));
        }),
        rest.get('/api/systemInfo', (_req, res, ctx) => {
            return res(ctx.json(systemInfoFixtures.showingNeither));
        }),
        rest.get('/api/shift/all', (_req, res, ctx) => {
            return res(ctx.json(shiftFixtures.threeShifts));
        }),
    ],
}