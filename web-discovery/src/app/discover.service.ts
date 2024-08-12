import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DiscoverService {

  private apiUrl = 'http://localhost:3021/api';
  private centralServer = 'http://localhost:7999';


  constructor(private http: HttpClient) { }

  getFederation(apiUrl = this.centralServer) {
    return this.http.get(`${apiUrl}/node`);
  }

  getPrediction(apiUrl = this.apiUrl, sentence: string, hopLimit: number = -1, timeLimit: number = -1, typeOfSearch: string = 'broadcast', treshold: number = 5) {
    var query = "";
    if(hopLimit >= 0) {
      query += `?hopLimit=${hopLimit}`;
    }

    if(timeLimit > 0) {
      query += `${query ? '&' : '?'}timeLimit=${timeLimit}`;
    }

    if(typeOfSearch) {
      query += `${query ? '&' : '?'}typeSearch=${typeOfSearch}`;
    }

    if(treshold > 0 && treshold < 10) {
      query += `${query ? '&' : '?'}treshold=0.${treshold}`;
    }

    return this.http.get(`${apiUrl}/predict/${sentence}${query}`);
  }

  getDevices(apiUrl = this.apiUrl, search: string, hopLimit: number = -1, timeLimit: number = -1, typeOfSearch: string = 'broadcast') {
    console.log(apiUrl)
    var query = "";
    if(hopLimit >= 0) {
      query += `&hopLimit=${hopLimit}`;
    }

    if(timeLimit > 0) {
      query += `${query ? '&' : '&'}timeLimit=${timeLimit}`;
    }

    if(typeOfSearch) {
      query += `${query ? '&' : '&'}typeSearch=${typeOfSearch}`;
    }

    return this.http.get(`${apiUrl}/search?title=${search}${query}`);
  }
}