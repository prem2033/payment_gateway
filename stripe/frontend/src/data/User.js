export function getUser() {
    const users = [{
        "email": "prem@gmail.com",
        "name": "Prem",
    },
    {
        "email": "prakash@gmail.com",
        "name": "Prakash",

    },
    {
        "email": "texecom@gmail.com",
        "name": "Texecom",

    }];
    return users[Math.floor(Math.random() * users.length)];
}