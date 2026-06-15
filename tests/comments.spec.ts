import {test, expect} from '@playwright/test';
import { RequestHandler } from '../utils/request-handler';

test('GET - Return all comments', async ({}) => {

    // Create the new instance to get the interact with the methods
    const api = new RequestHandler()

    // in this case we doesnt have the queryParams
    api.url('https://gorest.co.in/public/v2').pathParams('/posts')
    console.log('Get test')
})

test('GET - Comments', async ({}) => {

    // Create the new instance to get the interact with the methods
    const api = new RequestHandler()

    // with queryParams
    api.url('https://gorest.co.in/public/v2').pathParams('/posts').queryParams({body: 'Quia rem molestias'})
    console.log('Get test')
})

test('POST - Create a new comment into a Posts', async ({}) => {
    const api = new RequestHandler()

    let postID: string = '12345'

    api
        .url('https://gorest.co.in/public/v2')
        .pathParams(`/posts/${postID}/comments`)
        .headers({Authorization: 'authToken'})
        .body({name: 'Comments', email: 'test@test.com', body: 'description'})
})