import { test } from '../utils/fixtures'

// instead call the request feature from playwright as a parameter. We call the api fixture
test('GET - All todos data', async({api}) => {
    api.url('https://gorest.co.in/public/v2').pathParams('/todos')
})