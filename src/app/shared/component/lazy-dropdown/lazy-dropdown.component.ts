import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  output,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { TranslateService } from '@ngx-translate/core';
import { LazyDropdownService } from '../../services/lazy-dropdown.service';

@Component({
  selector: 'app-lazy-dropdown',
  templateUrl: './lazy-dropdown.component.html',
  styleUrls: ['./lazy-dropdown.component.scss'],
  standalone: true,
  imports: [MultiSelectModule, SelectModule, FormsModule, CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LazyDropdownComponent),
      multi: true,
    },
  ],
})
export class LazyDropdownComponent implements OnInit, OnChanges {
  @Input() lookup!: any;
  @Input() lookUpExtraParams!: any;
  @Input() placeholder: string = '';
  @Input() multiply: boolean = false;
  @Input() disable: boolean = false;
  @Output() onSelect = new EventEmitter<any>();

  dropdownOptions: any[] = [];
  selectedOption: any;
  private initialValue: any;

  /** Cache storage: key = lookup + params JSON */
  private lookupCache: { [key: string]: any[] } = {};

  constructor(
    private lazyDropdownService: LazyDropdownService,
    private translationService: TranslateService
  ) {}

  ngOnInit(): void {
    if (!this.placeholder) {
      this.translationService.get('SelectAnOption').subscribe((translated) => {
        this.placeholder = translated;
      });
    }
    this.loadOptions(); // initial load
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lookUpExtraParams']) {
      this.loadOptions(true); // force reload when params change
    }
  }

  writeValue(value: any): void {
    this.initialValue = value; // always store incoming value
    this.applyValueToSelection();
    this.updateDropdownSelection();
  }

  private applyValueToSelection(): void {
    if (!this.initialValue || !this.dropdownOptions.length) {
      return; // wait until we have options
    }

    if (this.multiply) {
      const values = Array.isArray(this.initialValue)
        ? this.initialValue.map((v) => (typeof v === 'object' && 'value' in v ? v.value : v))
        : [
            typeof this.initialValue === 'object' && 'value' in this.initialValue
              ? this.initialValue.value
              : this.initialValue,
          ];

      this.selectedOption = values
        .map((v) => this.dropdownOptions.find((opt) => opt.value == v))
        .filter(Boolean);
    } else {
      const val =
        typeof this.initialValue === 'object' && 'value' in this.initialValue
          ? this.initialValue.value
          : this.initialValue;

      this.selectedOption = this.dropdownOptions.find((opt) => opt.value == val) || null;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};

  /** Called when dropdown panel opens */
  onDropdownOpen(): void {
    this.loadOptions(); // will use cache if available
  }

  /** Called when dropdown closes */
  onDropdownClose(): void {
    this.onTouched();
  }

  /** When user selects an option */
  onOptionSelect(event: any): void {
    this.selectedOption = event?.value;

    if (this.multiply) {
      this.onChange(this.selectedOption.map((opt: any) => opt.value));
      this.onSelect.emit(this.selectedOption.map((opt: any) => opt.value));
    } else {
      this.onChange(this.selectedOption?.value);
      this.onSelect.emit(this.selectedOption?.value);
    }

    this.onTouched();
  }

  /** Loads options from cache or API */
  private loadOptions(forceReload: boolean = false): void {
    if (typeof this.lookup === 'string') {
      const cacheKey = this.lookup + JSON.stringify(this.lookUpExtraParams || {});

      if (this.lookupCache[cacheKey] && !forceReload) {
        this.dropdownOptions = this.lookupCache[cacheKey];
        this.updateDropdownSelection();
        return;
      }

      this.lazyDropdownService
        .getDropdownData({
          type: this.lookup,
          params: { limit: 1000, ...this.lookUpExtraParams },
        })
        .subscribe((res) => {
          this.dropdownOptions = res.data || [];

          // Keep any pre-selected values
          if (this.selectedOption) {
            const selectedArray = Array.isArray(this.selectedOption)
              ? this.selectedOption
              : [this.selectedOption];
            selectedArray.forEach((option) => {
              if (!this.dropdownOptions.some((item) => item.value == option.value)) {
                this.dropdownOptions.push(option);
              }
            });
          }

          this.lookupCache[cacheKey] = this.dropdownOptions;
          this.applyValueToSelection();
          this.updateDropdownSelection();
        });
    } else {
      this.dropdownOptions = this.lookup;
      this.applyValueToSelection();
      this.updateDropdownSelection();
    }
  }

  /** Sync selectedOption with dropdownOptions */
  private updateDropdownSelection(): void {
    if (!this.selectedOption || !this.dropdownOptions?.length) return;

    if (this.multiply) {
      this.selectedOption = this.selectedOption
        .map((sel: any) => this.dropdownOptions.find((opt) => opt.value == (sel.value ?? sel)))
        .filter(Boolean);
    } else {
      const found = this.dropdownOptions.find(
        (opt) => opt.value === (this.selectedOption.value ?? this.selectedOption)
      );
      if (found) this.selectedOption = found;
    }
  }
}
