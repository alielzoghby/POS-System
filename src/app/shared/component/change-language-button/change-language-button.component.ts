import { Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MenuItem } from 'primeng/api';
import { ConfigConstant } from '../../config/config.constant';
import { StorageConstant } from '../../config/storage.constant';
import { LanguageEnum } from '../../enums/language.enum';
import { TieredMenu } from 'primeng/tieredmenu';
import { Button } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { Menu } from 'primeng/menu';

@Component({
  selector: 'app-change-language-button',
  templateUrl: './change-language-button.component.html',
  styleUrls: ['./change-language-button.component.scss'],
  standalone: true,
  imports: [Menu, Button, TranslateModule, CommonModule],
})
export class ChangeLanguageButtonComponent implements OnInit {
  @ViewChild('menu') menu!: TieredMenu;

  items!: MenuItem[];
  savedLang = localStorage.getItem(StorageConstant.LANGUAGE) || ConfigConstant.DEFAULT_LANGUAGE;

  @HostListener('window:scroll')
  onScroll() {
    if (this.menu.visible) this.menu?.alignOverlay?.();
  }
  constructor(private translate: TranslateService) {
    this.translate.setDefaultLang(this.savedLang);
    this.translate.use(this.savedLang);
  }

  ngOnInit() {
    this.setupItems();
  }

  setupItems() {
    this.items = [
      {
        label: this.translate.instant('English'),
        icon: '/assets/icons/en.png',
        command: () => this.switchLanguage(LanguageEnum.English),
      },
      {
        label: this.translate.instant('French'),
        icon: '/assets/icons/fr.png',
        command: () => this.switchLanguage(LanguageEnum.French),
      },
    ];
  }

  switchLanguage(language: string) {
    this.translate.use(language);
    this.savedLang = language;
    localStorage.setItem(StorageConstant.LANGUAGE, language);
    window.location.reload();
  }
}
