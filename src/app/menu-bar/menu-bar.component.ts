import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ElectronService } from '../core/services';
import { AppState } from '../store/state';
import * as appActions from '../store/actions'

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

  constructor(
      private store: Store<AppState>
    ) { 
    this.localesSubject = new BehaviorSubject<Locale[]>(this.locales);
  }

  ngOnInit(): void {
    
  }

  onLanguageChange(languageCode:string): void {
    this.store.dispatch(appActions.changeLocale({ newLocale : languageCode}));
  }
}
