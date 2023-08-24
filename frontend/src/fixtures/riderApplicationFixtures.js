const riderApplicationFixtures = 
{
    oneApplication:
    [
        {
            "id": 1,
            "status": "pending",
            "perm_number": "1234567",
            "email": "phtcon@ucsb.edu",
            "created_date": "2022-07-22",
            "updated_date": "2022-07-23",
            "cancelled_date": "2022-08-01",
            "description": "My legs were broken",
            "notes": "Medical proof required"
        }
    ],

    threeApplications:
    [
        {
            "id": 2,
            "status": "accepted",
            "perm_number": "0123456",
            "email": "cgaucho@ucsb.edu",
            "created_date": "2022-06-23",
            "updated_date": "2022-07-14",
            "cancelled_date": "2022-07-23",
            "description": "My leg was broken in a car accident",
            "notes": ""
        },
        {
            "id": 3,
            "status": "declined",
            "perm_number": "1598741",
            "email": "dgaucho@ucsb.edu",
            "created_date": "2020-01-25",
            "updated_date": "2020-03-14",
            "cancelled_date": "2020-06-23",
            "description": "I'm on a wheelchair",
            "notes": "Medical proof required."
        },
        {
            "id": 4,
            "status": "pending",
            "perm_number": "6547532",
            "email": "fgaucho@ucsb.edu",
            "created_date": "2023-02-25",
            "updated_date": "2023-02-26",
            "cancelled_date": "",
            "description": "I get a cramp in my leg often.",
            "notes": ""
        }
    ]
};

export { riderApplicationFixtures };