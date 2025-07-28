import { Injectable } from '@angular/core';
import { BehaviorSubject, fromEvent, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { ScreenType } from '../../enums/screen-type.enum';
import { ScreenSizes } from '../../enums/screen-sizes.enum';


export type ScreenSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private resizeStreams$ = fromEvent(window, 'resize').pipe(debounceTime(500));
  private destroy$ = new Subject();
  private currentScreen:any;

  currentScreenWidth = 0;
  currentMedia$: Subject<ScreenType> = new Subject<ScreenType>();
  currentScreenSize$ = new Subject<ScreenSize>();
  currentScreenWidth$ = new Subject<number>();

  get currentMedia(): ScreenType {
    return this.currentScreen;
  }

  websiteDirection$: BehaviorSubject<string> = new BehaviorSubject('ltr');

  constructor() {
    this.onResize(window.innerWidth);
    this.resizeStreams$.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event?.currentTarget) {
        this.onResize((event.currentTarget as any).innerWidth);
      }
    });
  }

  dispose(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  private onResize(width: number): void {
    this.currentScreen = this.getScreenType(width);
    this.currentScreenWidth = width;
    this.currentMedia$.next(this.currentScreen);
    this.currentScreenSize$.next(this.getScreenSize(width));
    this.currentScreenWidth$.next(width);
  }

  private getScreenType(width: number): ScreenType {
    let currentScreen = ScreenType.desktop;

    if (width <= ScreenSizes.sm) {
      currentScreen = ScreenType.phone;
    } else if (width > ScreenSizes.sm && width <= ScreenSizes.lg) {
      currentScreen = ScreenType.tablet;
    }

    return currentScreen;
  }

  private getScreenSize(width: number): ScreenSize {
    let size: ScreenSize = 'xxxl';

    if (width <= ScreenSizes.sm) {
      size = 'xs';
    } else if (width <= ScreenSizes.md) {
      size = 'sm';
    } else if (width <= ScreenSizes.lg) {
      size = 'md';
    } else if (width <= ScreenSizes.xl) {
      size = 'lg';
    } else if (width <= ScreenSizes.xxl) {
      size = 'xl';
    } else if (width <= ScreenSizes.xxxl) {
      size = 'xxl';
    }

    return size;
  }
}
