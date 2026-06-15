export class RequestHandler {

    private attrBaseUrl: string = ''
    private attrPath: string = ''
    private attrQueryParams: Object = {}
    private attrHeaders: Object = {}
    private attrBody: Object = {}

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

}
