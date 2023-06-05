import { Line } from "../types/Line";

let BACK_URL = "http://localhost:8080";

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
    return { err: "Nieudane zapytanie." };
}


export class Requests {
    static async lines(): Promise<GenericResponse<any>> {
        const response = await fetchGet("")
        return handleResponse(response);
    }
}
