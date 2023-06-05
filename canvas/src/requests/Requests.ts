import { Line } from "../types/Line";

let BACK_URL = "http://localhost:8181";

function fetchGet(url: string) {
    return fetch(BACK_URL + url, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
}

class GenericResponse<T>{
    res?: T = undefined
    err?: any
}

async function handleResponse(response: Response) {
    const json = await response.json()

    if (response.status === 200)
        return { res: json };
    return { err: json };
}


export class Requests {
    static async lines(): Promise<GenericResponse<Line[]>> {
        const response = await fetchGet("")
        return handleResponse(response);
    }
}
