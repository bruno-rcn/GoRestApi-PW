import {test, expect} from '@playwright/test';

let authToken: string
let randomNumber = Math.random()
let userID: string

test.beforeAll('Extract the token and the userID', async ({request}) => {
    authToken = 'Bearer ' + '107d9e400321913317e71270c08cee81b197da28760f20fb504d47c970f9a348'

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
    userID = createUserResponseBodyJSON.id
})

test('POST - Create a new post authored by a user', async ({request}) => {
    const createPostsResponse = await request.post(`https://gorest.co.in/public/v2/users/${userID}/posts`, {
        data: {
            "title": `Automation test with PW ${randomNumber}`,
            "body": `Project to automated a collection from Postman ${randomNumber}`
        },
        headers: {
            Authorization: authToken
        }
    })

    expect(createPostsResponse.status()).toEqual(201)

    const createPostsResponseBodyJSON = await createPostsResponse.json()
    expect(createPostsResponseBodyJSON).toHaveProperty('id')
    expect(createPostsResponseBodyJSON.user_id).toEqual(userID)
    expect(createPostsResponseBodyJSON.title).toContain('Automation test with PW')
    expect(createPostsResponseBodyJSON.body).toContain('Project to automated a collection from Postman')
})

test('PUT - Update a posts', async ({request}) => {
    // Create a new post and extract the postID
    const createPostsResponse = await request.post(`https://gorest.co.in/public/v2/users/${userID}/posts`, {
        data: {
            "title": `Automation test with PW ${randomNumber}`,
            "body": `Project to automated a collection from Postman ${randomNumber}`
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createPostsResponse.status()).toEqual(201)
    const createPostsResponseBodyJSON = await createPostsResponse.json()
    const postID = createPostsResponseBodyJSON.id

    // Update this Post
    const updatePostResponse = await request.put(`https://gorest.co.in/public/v2/posts/${postID}`, {
        data: {
            "title": `Title updated`,
            "body": `Body updated`
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(updatePostResponse.status()).toEqual(200)

    const updatePostResponseBodyJSON = await updatePostResponse.json()

    expect(updatePostResponseBodyJSON).toHaveProperty('id')
    expect(updatePostResponseBodyJSON.user_id).toEqual(userID)
    expect(updatePostResponseBodyJSON.title).toEqual('Title updated')
    expect(updatePostResponseBodyJSON.body).toContain('updated')
})

test('DELETE - Delete a post', async ({request}) => {
    // Create a new post and extract the postID
    const createPostsResponse = await request.post(`https://gorest.co.in/public/v2/users/${userID}/posts`, {
        data: {
            "title": `Automation test with PW ${randomNumber}`,
            "body": `Project to automated a collection from Postman ${randomNumber}`
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createPostsResponse.status()).toEqual(201)
    const createPostsResponseBodyJSON = await createPostsResponse.json()
    const postID = createPostsResponseBodyJSON.id

    // Delete this post
    const deletePostResponse = await request.delete(`https://gorest.co.in/public/v2/posts/${postID}`, {
        headers:{
            Authorization: authToken
        }
    })
    expect(deletePostResponse.status()).toEqual(204)
})

test('GET - All posts', async ({request}) => {
    const getPostResponse = await request.get('https://gorest.co.in/public/v2/posts')
    expect(getPostResponse.status()).toEqual(200)

    const getPostResponseBodyJSON = await getPostResponse.json()
    expect(getPostResponseBodyJSON.length).toBeGreaterThanOrEqual(10)
    expect(getPostResponseBodyJSON[0]).toHaveProperty('id')
    expect(getPostResponseBodyJSON[0]).toHaveProperty('user_id')
    expect(getPostResponseBodyJSON[0]).toHaveProperty('title')
    expect(getPostResponseBodyJSON[0]).toHaveProperty('body')
})

test('GET - Return Post with postID created/authorized by a user', async ({request}) => {
    // Create a new post and Extract the postID
    const createPostsResponse = await request.post(`https://gorest.co.in/public/v2/users/${userID}/posts`, {
        data: {
            "title": `Get request Title ${randomNumber}`,
            "body": `Get request Body ${randomNumber}`
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createPostsResponse.status()).toEqual(201)

    const createPostsResponseBodyJSON = await createPostsResponse.json()
    const postID = createPostsResponseBodyJSON.id

    // Return this post
    const getPostResponseByID = await request.get(`https://gorest.co.in/public/v2/posts/${postID}`, {
        headers: {
            Authorization: authToken
        }
    })
    expect(getPostResponseByID.status()).toEqual(200)

    const getPostResponseByIDBodyJSON = await getPostResponseByID.json()
    expect(getPostResponseByIDBodyJSON).toHaveProperty('id')
    expect(getPostResponseByIDBodyJSON.user_id).toEqual(userID)
    expect(getPostResponseByIDBodyJSON.title).toContain('Get request Title')
    expect(getPostResponseByIDBodyJSON.body).toContain('Get request Body')
})

test('GET - Return Post with userID created/authorized by a user', async ({request}) => {
    // Create a new post and Extract the postID
    const createPostsResponse = await request.post(`https://gorest.co.in/public/v2/users/${userID}/posts`, {
        data: {
            "title": `Get request Title ${randomNumber}`,
            "body": `Get request Body ${randomNumber}`
        },
        headers: {
            Authorization: authToken
        }
    })
    expect(createPostsResponse.status()).toEqual(201)

    const getPostResponseByUserID = await request.get(`https://gorest.co.in/public/v2/users/${userID}/posts`, {
        headers: {
            Authorization: authToken
        }
    })
    expect(getPostResponseByUserID.status()).toEqual(200)

    const getPostResponseByUserIDBodyJSON = await getPostResponseByUserID.json()

    const post = Array.isArray(getPostResponseByUserIDBodyJSON) ? getPostResponseByUserIDBodyJSON[0] : getPostResponseByUserIDBodyJSON
    expect(post).toHaveProperty('id')
    expect(post.user_id).toEqual(userID)
    expect(post).toHaveProperty('title')
    expect(post).toHaveProperty('body')
})