import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { SectionStateStatus } from '../../enums/section-state-status.enum';
import { CommonModule } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-state-section',
  templateUrl: './state-section.component.html',
  styleUrls: ['./state-section.component.scss'],
  standalone: true,
  imports: [CommonModule, LoaderComponent, TranslateModule],
})
export class StateSectionComponent implements OnInit {
  @Input() state!: SectionStateStatus;
  @Input() loadingLabel!: string;
  @Input() errorStateLabel!: string;
  @Input() emptyStateMainLabel!: string;
  @Input() emptyStateSubLabel!: string;
  @Input() emptyStateImagePath!: string;

  @Output() reload = new EventEmitter();
  @Output() clear = new EventEmitter();

  SectionStateStatus = SectionStateStatus; // For template usage

  constructor(
    private comRef: ChangeDetectorRef,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.loadingLabel) {
      this.translateService.get('LoadingLabel').subscribe((translated) => {
        this.loadingLabel = translated;
      });
    }

    if (!this.emptyStateMainLabel) {
      this.translateService.get('EmptyStateMainLabel').subscribe((translated) => {
        this.emptyStateMainLabel = translated;
      });
    }
  }

  ngOnChanges({ state }: SimpleChanges): void {
    if (state && state.currentValue !== state.previousValue) {
      this.comRef.detectChanges();
    }
  }

  onReload(): void {
    this.reload.emit(null);
  }

  onClearButtonClicked(): void {
    this.clear.emit(null);
  }
}
