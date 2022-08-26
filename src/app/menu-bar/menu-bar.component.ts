import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';

interface Locale {
  titleKey: string;
  languageCode: string;
};

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.scss']
})
export class MenuBarComponent implements OnInit {
  private locales: Locale[] = [ 
    { titleKey: "LANGUAGES.ENGLISH",  languageCode: 'en-US'},
    { titleKey: "LANGUAGES.FRENCH",   languageCode: 'fr-CA'},
    { titleKey: "LANGUAGES.CHINESE",  languageCode: 'zh-CN'},
    { titleKey: "LANGUAGES.KOREAN",   languageCode: 'ko-KR'},
    { titleKey: "LANGUAGES.GERMAN",   languageCode: 'de-DE'}
  ];

  private localesSubject: BehaviorSubject<Locale[]>;

  public get locales$(): Observable<Locale[]> {
    return this.localesSubject.asObservable();
  }

  constructor(private translateService: TranslateService) { 
    

    this.localesSubject = new BehaviorSubject<Locale[]>(this.locales);
  }

  ngOnInit(): void {
    
  }

  onLanguageChange(languageCode:string): void {
    this.translateService.use(languageCode);
  }

}
