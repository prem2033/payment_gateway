export function getUser(email) {
    const users = [
    {
        "email": "prem@gmail.com",
        "name": "Prem",
        "customerId": "cus_TnBBFmWlHmOzeS",
    },
    {
        "email": "prakash@gmail.com",
        "name": "Prakash",
        "customerId": "cus_TnB26SA3YVhaLo",
    },
    {
        "email": "texecom@gmail.com",
        "name": "Texecom",
        "customerId": "cus_TnBAz2qki1shaD",
        
    }
];
    return users.find(
        (user) => user.email.toLowerCase() === email.toLowerCase()
    );
}