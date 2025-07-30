import { ChangeDetectorRef, Component, Injector, OnDestroy, inject } from '@angular/core';
import { Observable, Subject, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { catchError, take, takeUntil, tap } from 'rxjs/operators';
import { ConfigConstant } from '../../config/config.constant';
import { SectionStateStatus } from '../../enums/section-state-status.enum';
import { AsyncFeedbackService } from '../../services/general/async-feedback.service';
import { getValueByPath } from '../../utils/get-value-by-path.util';
import { FiltersBase } from '../../services/general/filters-base.service';
import { StorageConstant } from '../../config/storage.constant';

type HandlerOptions = {
  startWith?: (...args: any) => any;
  fetchOnce?: boolean;
  isLoadingTransparent?: boolean;
  contentPath?: string;
  emptyContentCheck?: (value: any) => boolean;
  errorMessagePath?: string;
  successMessagePath?: string;
  existingEntityURL?: (id: number, type?: string) => string;
};

@Component({
  selector: 'app-base-component',
  template: ``,
})
export class BaseComponent<Filters = any> implements OnDestroy {
  protected injector: Injector;
  protected destroy$ = new Subject();
  protected translationService: TranslateService;
  protected asyncFeedbackService: AsyncFeedbackService;
  public sectionState: SectionStateStatus = SectionStateStatus.Ready;

  public pageSize: number = ConfigConstant.PAGE_SIZE;
  public pageIndex: number = ConfigConstant.INIT_PAGE_INDEX;
  public offset: number = ConfigConstant.INIT_PAGE_OFFSET;
  public searchTerm: string = '';
  public totalRowsCount = 0;
  public rowsPerPageOptions = ConfigConstant.ROWS_PER_PAGE_OPTIONS;

  public filters: FiltersBase<Filters, any>;

  constructor() {
    this.injector = inject(Injector);

    const savedLang =
      localStorage.getItem(StorageConstant.LANGUAGE) || ConfigConstant.DEFAULT_LANGUAGE;

    this.translationService = this.injector.get<TranslateService>(TranslateService);
    this.translationService.use(savedLang);

    this.asyncFeedbackService = this.injector.get<AsyncFeedbackService>(AsyncFeedbackService);

    this.filters = this.injector.get<FiltersBase<Filters, any>>(FiltersBase);

    this.translationService.onLangChange.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.onLanguageChange();
    });
  }

  protected onLanguageChange(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  protected translate(key: string, projection = {}): string {
    if (this.translationService) {
      return this.translationService.instant(key, projection);
    }
    return key;
  }

  showErrorMessage(
    error: { errors: string[] },
    errorMessagePath = 'ErrorMessages',
    projection = {}
  ): void {
    this.asyncFeedbackService.showErrorMessage(
      error?.errors ? error.errors[0] : this.translate(errorMessagePath, projection)
    );
  }

  showSuccessMessage(messagePath = 'DataUpdatedSuccessfully', projection = {}): void {
    this.asyncFeedbackService.showSuccessMessage(this.translate(messagePath, projection));
  }

  load<T>(
    observable: Observable<T> | ((...args: any) => Observable<T>),
    extra?: HandlerOptions
  ): Observable<T> {
    const observable$: Observable<T> = typeof observable === 'function' ? observable() : observable;
    const fetchOnce = extra && typeof extra.fetchOnce !== 'undefined' ? extra.fetchOnce : true;
    const contentPath =
      extra && typeof extra.contentPath !== 'undefined' ? extra.contentPath : null;
    const changeDetector = this.injector?.get(ChangeDetectorRef);

    this.sectionState =
      extra && extra.isLoadingTransparent
        ? SectionStateStatus.LoadingTransparent
        : SectionStateStatus.Loading;

    if (typeof extra?.startWith === 'function') {
      extra.startWith();
    }

    changeDetector?.markForCheck();

    return observable$.pipe(
      fetchOnce ? take(1) : takeUntil(this.destroy$),
      tap((data) => {
        Promise.resolve().then(() => {
          let isEmpty = false;
          if (contentPath) {
            const value = getValueByPath<any>(data, contentPath);
            if (extra && extra.emptyContentCheck) {
              isEmpty = extra.emptyContentCheck(value);
            } else {
              isEmpty =
                (Array.isArray(value) && !value.length) ||
                (typeof value === 'object' && !Object.keys(value).length) ||
                !value;
            }
          } else if (extra && extra.emptyContentCheck) {
            isEmpty = extra.emptyContentCheck(data);
          }
          this.sectionState = isEmpty ? SectionStateStatus.Empty : SectionStateStatus.Ready;
          if (extra?.successMessagePath) {
            this.showSuccessMessage(extra?.successMessagePath);
          }
          changeDetector?.markForCheck();
        });
      }),
      catchError((err) => {
        this.sectionState = SectionStateStatus.Ready;
        changeDetector?.markForCheck();
        return throwError(err);
      })
    );
  }
}
