import { test as base } from '@playwright/test'
import { RequestHandler } from '../utils/request-handler';

// This code works to show the methods are availeble in request handler when we add . in the code
export type TestOptions = {
    api: RequestHandler
}

// Now, in the test file we will import this test not the { test } from '@playwright/test'
export const test = base.extend<TestOptions>({
    // inside the base.extend we can create the fixture

    // Key: value
    // inside the () we add the dependencies and the use function (its a special function from pw to wraps test execution)
    api: async({}, use) => {
        const reqHandler = new RequestHandler()
        await use(reqHandler) // all code before this line execute as a pre-condition when the fixture is call on the test and after the line execute in the end of the test
    }

})
