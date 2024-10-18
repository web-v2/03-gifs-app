import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Gif, SearchResponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifsList: Gif[] = [];
  private _tagsHistory: string[] = [];
  private apiKey:       string = 'AbD9eqE3w2qhn64pZp6fhiOLh7003OO5';
  private servciesUrl:  string = 'https://api.giphy.com/v1/gifs';
  constructor(private http: HttpClient) {
    this.loadLocalStore();
   }

  public get tagsHistory() {
    return [...this._tagsHistory];
  }

  private organizeHistory(tags:string):void{
    tags = tags.toLowerCase();
    if(this._tagsHistory.includes( tags )){
      this._tagsHistory = this._tagsHistory.filter( (oldTag) => oldTag !== tags );
    }
    this._tagsHistory.unshift( tags ); //Lo agrega al inicio
    this._tagsHistory = this._tagsHistory.splice(0,10); //Corta el Array a solo 10 items
    this.saveLocalStore();
  }

  private saveLocalStore():void{
    localStorage.setItem('history', JSON.stringify(this._tagsHistory));
  }

  private loadLocalStore():void{
    if( !localStorage.getItem('history') ) return;
    this._tagsHistory = JSON.parse( localStorage.getItem('history')! );
    if( this._tagsHistory.length === 0 ) return;
    this.searchTag( this._tagsHistory[0] );
  }

  public searchTag(tag:string):void{
    if(tag.length === 0) return;
    this.organizeHistory(tag);

    const params = new HttpParams()
      .set('api_key',this.apiKey)
      .set('limit', '10')
      .set('q', tag);

    this.http.get<SearchResponse>(`${this.servciesUrl}/search`, {params})
      .subscribe(resp => {
        this.gifsList = resp.data;
      });
  }

}
