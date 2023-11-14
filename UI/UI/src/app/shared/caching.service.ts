import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { shareReplay, map } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/internal/observable/of';
const CACHE_SIZE = 1;

@Injectable({
  providedIn: 'root'
})
export class CachingService {
  private cache$: Observable<any>;
  public responseCache = new Map();

  constructor(private http: HttpClient) {}

  public getPages(url): Observable<any> {
    
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    const pagesFromCache = this.responseCache.get(url);
    if (pagesFromCache) {
      return of(pagesFromCache);
    }
    const response = this.http.get<any>(url, httpOptions);
    // response.subscribe(pages => this.responseCache.set(url, pages));
    return response;
  }

  get_page(material_id, chapter_id, page_id: number, need_all_pages_data: boolean = false) {
    if (!this.cache$) {
      this.cache$ = this.requestPage(material_id, chapter_id, page_id, need_all_pages_data).pipe(
        shareReplay(CACHE_SIZE)
      );
    }
    return this.cache$;
  }

  requestPage(material_id, chapter_id, page_id: number, need_all_pages_data: boolean = false) {
    var access_token_cookie = localStorage.getItem("access_token_cookie");
    const httpOptions = {
      headers: new HttpHeaders({
        'content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'authorization': 'Bearer ' + access_token_cookie
      })
    }
    var url = environment.server_url + 'get/page_by_chapter_and_page_id/' + material_id + "/" + chapter_id + "/" + page_id;
    if(need_all_pages_data) {
      url = url + "/" + true;
    }
    return this.http.get(url, httpOptions).pipe(
      map(response => response)
    );
  }
}
