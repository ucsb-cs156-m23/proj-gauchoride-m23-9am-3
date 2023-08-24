const shiftFixtures = {
    oneShift:
    [
        {
            "id": 4,
            "day": "Wednesday",
            "shiftStart": "12:00PM",
            "shiftEnd": "3:00PM",
            "driverID": 4,
            "driverBackupID": 5
        }
    ],

    threeShifts: [
        {
            "id": 1,
            "day": "Monday",
            "shiftStart": "08:00AM",
            "shiftEnd": "11:00AM",
            "driverID": 1,
            "driverBackupID": 3
        },
        {
            "id": 2,
            "day": "Tuesday",
            "shiftStart": "11:00AM",
            "shiftEnd": "02:00PM",
            "driverID": 2,
            "driverBackupID": 1
        },
        {
            "id": 3,
            "day": "Thursday",
            "shiftStart": "03:00PM",
            "shiftEnd": "06:00PM",
            "driverID": 3,
            "driverBackupID": 2
        },
    ]
}

export { shiftFixtures };