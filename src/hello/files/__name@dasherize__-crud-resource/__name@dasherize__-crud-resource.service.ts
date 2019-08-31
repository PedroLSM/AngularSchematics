import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/commom/http';

const API_URL = '/api/<%= dasherize(name) %>';

@Injectable({
    providedIn: 'root'
})
export class <%= classify(name) %>CrudResourceService {
    constructor(private httpClient: HttpClient) {}

    findAll(): Observable<<%= classify(name) %>[]> {
    <% if (transform) { %>
        return this.httpClient.get<<%= classify(name) %>>(API_URL).pipe(map(this.transform));
    <% } else { %>
        return this.httpClient.get<<%= classify(name) %>>(API_URL);
    <% } %>
    }

    create(<%= camelize(name) %>: <%= classify(name) %>): Observable<number> {
        return this.httpClient.post<number>(API_URL, <%= camelize(name) %>);
    }

    <% if (transform) { %>
    private transform(response: <%= classify(name) %>Response): <%= classify(name) %> {
        return {
            someProperty: someResponseProperty
        }
    }
    <% } %>
}

export interface <%= classify(name) %> {
    someProperty: string;
}

<% if(transform) { %>
interface <%= classify(name) %>Response {
    someResponseProperty
}
<% } %>