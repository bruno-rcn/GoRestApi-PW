import { APIRequestContext } from '@playwright/test'

export class RequestHandler {

    private attrBaseUrl?: string
    private attrDefaultBaseUrl: string
    private attrPath: string = ''
    private attrQueryParams: Object = {}
    private attrHeaders: Object = {}
    private attrBody: Object = {}
    private attrRequest: APIRequestContext

    // Nox, every time we make a new instance for this class we will have to pass and access to the:
    // request methods (post, put, get, delete) and the base url
    constructor(request: APIRequestContext, apiBaseUrl: string){
        this.attrRequest = request
        this.attrDefaultBaseUrl = apiBaseUrl
    }

    url(apiUrl: string){
        this.attrBaseUrl = apiUrl
        return this
    }

    pathParams(apiPath: string){
        this.attrPath = apiPath
        return this
    }

    queryParams(apiQueryParams: Object){
        this.attrQueryParams = apiQueryParams
        return this
    }

    headers(apiHeaders: Object){
        this.attrHeaders = apiHeaders
        return this
    }

    body(apiBody: Object){
        this.attrBody = apiBody
        return this
    }

    // method to build a complete API url - changing the object attr to string
    private getUrl(){
        // its means that when the this.attrBaseUrl is null or undefined the test will use the value from this.attrDefaultBaseUrl
        const completeUrl = new URL(`${this.attrBaseUrl ?? this.attrDefaultBaseUrl}${this.attrPath}`)
        
        // this will convert our Object query params into a Array with key and value pairs
        for(const [key, value] of Object.entries(this.queryParams)){
            completeUrl.searchParams.append(key, value) // will add to the url
        } 

        return completeUrl.toString()
    }

}
