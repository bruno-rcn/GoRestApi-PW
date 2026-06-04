import {test, expect} from '@playwright/test';

let authToken: string
let randomNumber = Math.random()

test.beforeAll('Extract the token', async ({request}) => {
    authToken = 'Bearer ' + '107d9e400321913317e71270c08cee81b197da28760f20fb504d47c970f9a348'
})

test('Get - all users', async ({request}) => {
    const userResponse = await request.get('https://gorest.co.in/public/v2/users')
    expect(userResponse.status()).toEqual(200)

    const userResponseBodyJSON = await userResponse.json()
    expect(userResponseBodyJSON.length).toBeLessThanOrEqual(10)
});

test('Get - a specific user by ID', async ({request}) => {
    // All users
    const userResponse = await request.get('https://gorest.co.in/public/v2/users')
    // Get the json
    const userResponseBodyJSON = await userResponse.json()
    // Get the first user ID
    const userID = userResponseBodyJSON[0].id

    const userSpecificResponse = await request.get(`https://gorest.co.in/public/v2/users/${userID}`)
    expect(userSpecificResponse.status()).toEqual(200)

    const userSpecificResponseBodyJSON = await userSpecificResponse.json()
    expect(userSpecificResponseBodyJSON.id).toEqual(userID)
})

test('POST - Create a new user', async ({request}) => {
    const createUserResponse = await request.post('https://gorest.co.in/public/v2/users', {
        data: {
            "name": `PostCreate:${randomNumber}`, 
            "email": `email-test${randomNumber}@newuser.com`, 
            "gender": "male", 
            "status": "active"
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createUserResponse.status()).toEqual(201)

    const createUserResponseBodyJSON = await createUserResponse.json()
    expect(createUserResponseBodyJSON.name).toContain('PostCreate')
    expect(createUserResponseBodyJSON.email).toContain('@newuser.com')
    expect(createUserResponseBodyJSON.gender).toEqual('male')
    expect(createUserResponseBodyJSON.status).toEqual('active')
})

test('PATH - Create and Update an user (partial)', async ({request}) => {
    // Create an user and extract the ID
    const createUserResponse = await request.post('https://gorest.co.in/public/v2/users', {
        data: {
            "name": `PostCreate:${randomNumber}`, 
            "email": `email-test${randomNumber}@newuser.com`, 
            "gender": "male", 
            "status": "active"
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createUserResponse.status()).toEqual(201)

    const createUserResponseBodyJSON = await createUserResponse.json()
    const userID = createUserResponseBodyJSON.id

    // Update
    const updatePartialUserResponse = await request.patch(`https://gorest.co.in/public/v2/users/${userID}`, {
        data: {
            "email": `partial${randomNumber}@update.com`
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(updatePartialUserResponse.status()).toEqual(200)

    const updatePartialUserResponseBodyJSON = await updatePartialUserResponse.json()
    expect(updatePartialUserResponseBodyJSON.email).toContain('@update.com')
})

test('PUT - Create and Update an user', async ({request}) => {
    const createUserResponse = await request.post('https://gorest.co.in/public/v2/users', {
        data: {
            "name": `PostCreate:${randomNumber}`, 
            "email": `email-test${randomNumber}@newuser.com`, 
            "gender": "male", 
            "status": "active"
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createUserResponse.status()).toEqual(201)

    const createUserResponseBodyJSON = await createUserResponse.json()
    const userID = createUserResponseBodyJSON.id

    // Update
    const updateUserResponse = await request.put(`https://gorest.co.in/public/v2/users/${userID}`, {
        data: {
            "name": "Name updated",
            "status": "inactive"
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(updateUserResponse.status()).toEqual(200)

    const updateUserResponseBodyJSON = await updateUserResponse.json()
    expect(updateUserResponseBodyJSON.name).toEqual('Name updated')
    expect(updateUserResponseBodyJSON.status).toEqual('inactive')
})

test('DELETE - Create and Delete an user', async ({request}) => {
    const createUserResponse = await request.post('https://gorest.co.in/public/v2/users', {
        data: {
            "name": `PostCreate:${randomNumber}`, 
            "email": `email-test${randomNumber}@newuser.com`, 
            "gender": "male", 
            "status": "active"
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createUserResponse.status()).toEqual(201)

    const createUserResponseBodyJSON = await createUserResponse.json()
    const userID = createUserResponseBodyJSON.id

    // Delete
    const deleteUserResponse = await request.delete(`https://gorest.co.in/public/v2/users/${userID}`, {
        headers: {
            Authorization: authToken
        }
    })
    expect(deleteUserResponse.status()).toEqual(204)
})