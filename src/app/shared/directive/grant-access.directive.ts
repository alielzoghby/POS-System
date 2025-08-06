import { Directive, Input, OnDestroy, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserRole } from '../enums/user-role.enum';
import { UserRoleService } from '../services/auth/user-role.service';

@Directive({
  // Note: app prefix is removed for shorter syntax
  // since roles is used all over the template.
  // tslint:disable-next-line:directive-selector
  selector: '[grantAccess]',
})
export class GrantAccessDirective implements OnInit, OnDestroy {
  destroy$ = new Subject();
  onlyIf$ = new BehaviorSubject(true);
  display$ = new BehaviorSubject(false);
  private isInitialized$: Subject<boolean> = new Subject();
  private displayed = false;

  @Input()
  set grantAccessOnlyIf(value: boolean) {
    this.onlyIf$.next(value);
  }

  @Input()
  set grantAccess(checkingRoles: (UserRole | UserRole[])[]) {
    const roles: UserRole[] = checkingRoles.reduce<UserRole[]>(
      (list: UserRole[], role: UserRole | UserRole[]) => {
        if (Array.isArray(role)) {
          return [...list, ...role];
        }
        return [...list, role];
      },
      []
    );

    this.display$.next(this.userRoleService.isUserHasRoles(roles));
  }

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private userRoleService: UserRoleService
  ) {}

  ngOnInit(): void {
    combineLatest([this.display$, this.onlyIf$, this.isInitialized$])
      .pipe(
        takeUntil(this.destroy$),
        filter(([_, __, isInitialized]) => isInitialized)
      )
      .subscribe(([hasAccess, onlyIf]) => {
        if (hasAccess && onlyIf && !this.displayed) {
          this.viewContainer.createEmbeddedView(this.templateRef);
          this.displayed = true;
        } else if (this.displayed && (!hasAccess || !onlyIf)) {
          this.viewContainer.clear();
          this.displayed = false;
        }
      });
    this.isInitialized$.next(true);
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
