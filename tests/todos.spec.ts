import { test } from '../utils/fixtures'
import { expect } from '@playwright/test'

// instead call the request feature from playwright as a parameter. We call the api fixture
test('GET - All todos data', async({api}) => {
    
    const todosResponse = await api.pathParams('/todos').getRequest(200)
    
    expect(todosResponse.length).toBeGreaterThanOrEqual(10)
    expect(todosResponse[0]).toHaveProperty('id')
})