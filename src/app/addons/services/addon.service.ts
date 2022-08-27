import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, switchMap, forkJoin, mergeMap } from 'rxjs';
import { load as yamlLoad} from 'js-yaml';

@Injectable({
  providedIn: 'root'
})
export class AddonService {

  constructor(private http: HttpClient) { }

  public refreshAddons(): void {

    /**
     * Quick description of how we are getting the data:
     * 
     * We start from https://api.github.com/repos/gw2-addon-loader/Approved-Addons/contents/ and this will give us everything in the
     * repo. This is 1 web request 
     * 
     * We loop over all the contents and take the directories only.
     * 
     * From the directories we extract the names.
     * 
     * For each name we make 1 request to get the info of the addon's update-placeholder.yaml. This is 1 request per name.
     * 
     * From the info we extract the download_url
     * 
     * For each name we download the yaml, this is again 1 request per name.
     * 
     * So in total this update will require 1 + 2N request, where N is the number of addons available.
     */

    this.http.get<any>('https://api.github.com/repos/gw2-addon-loader/Approved-Addons/contents/')
    .pipe(
      tap(console.log),
      map(list => list.filter(e => e.type == 'dir')),
      map(list => list.map(e => e.name)),
      map(names => names.map(name => `https://api.github.com/repos/gw2-addon-loader/Approved-Addons/contents/${name}/update-placeholder.yaml`)),
      switchMap(links => {
        const httpRequests = links.map(link => 
            this.http.get(link).pipe(
              map(json => json['download_url'])
            )
          );
          return forkJoin(httpRequests);
      }),
      switchMap((links: any) => {
        const httpRequests = links.map(link => 
          this.http.get(link, { observe: 'body', responseType: 'text'}).pipe(
            map(yamltxt => yamlLoad(yamltxt))
          )        
        );
        return forkJoin(httpRequests);
      })
    )
    // .subscribe(thing => {
    //   console.log(thing);
    // })
  }
}
