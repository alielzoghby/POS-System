import { HttpClient } from '@angular/common/http';
import {
  Component,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LazyDropdownService } from '../../services/lazy-dropdown.service';
import { FormsModule, NG_VALUE_ACCESSOR, NgModel } from '@angular/forms';
import { MultiSelectModule } from 'primeng/multiselect';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';

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
  @Input()
  lookup!: any;
  @Input() lookUpExtraParams!: any;
  @Input() placeholder: string = '';
  @Input() multiply: boolean = false;
  @Input() disable: boolean = false;
  dropdownOptions: any[] = [];
  selectedOption: any;
  isDataLoaded: boolean = false;

  private lookupCache: { [key: string]: any[] } = {};
  skipCash: boolean = false;

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
    this.loadOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['lookUpExtraParams']) {
      this.skipCash = true;
      this.loadOptions();
    }
  }

  writeValue(value: any): void {
    if (value && value.status) {
      this.selectedOption = value.status[0];
    } else {
      this.selectedOption = value;
    }
    this.updateDropdownSelection();
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  private onChange: any = () => {};
  private onTouched: any = () => {};

  onDropdownOpen() {
    if (!this.isDataLoaded) {
      this.loadOptions();
    }
  }

  onDropdownClose() {
    this.isDataLoaded = false;
    this.skipCash = false;
    this.onTouched();
  }

  onOptionSelect(event: any): void {
    this.selectedOption = event.value;

    this.onChange(this.selectedOption);
    this.onTouched();
  }

  loadOptions(event: any = { first: 0, rows: 10 }) {
    if (typeof this.lookup === 'string') {
      if (this.lookupCache[this.lookup] && !this.skipCash) {
        this.dropdownOptions = this.lookupCache[this.lookup];
        this.isDataLoaded = true;
      } else {
        const { first, rows } = event;
        this.lazyDropdownService
          .getDropdownData({
            type: this.lookup,
            params: { start: first, limit: rows, ...this.lookUpExtraParams },
          })
          .subscribe((data) => {
            this.dropdownOptions = data.map((item) => ({
              label: item.value,
              value: item._id,
            }));

            if (this.selectedOption && Array.isArray(this.selectedOption)) {
              this.selectedOption.forEach((option) => {
                if (!this.dropdownOptions.some((item) => item.value === option.value)) {
                  this.dropdownOptions.push(option);
                }
              });
            } else if (
              this.selectedOption.value &&
              !this.dropdownOptions.some((item) => item.value === this.selectedOption.value)
            ) {
              this.dropdownOptions.push(this.selectedOption);
            }

            this.lookupCache[this.lookup] = this.dropdownOptions;
            this.isDataLoaded = true;
            this.updateDropdownSelection();
          });
      }
    } else {
      this.dropdownOptions = this.lookup;
      this.isDataLoaded = true;
      this.updateDropdownSelection();
    }
  }

  private updateDropdownSelection() {
    if (this.selectedOption) {
      const selected = this.dropdownOptions.find((option) => option.value === this.selectedOption);
      if (selected) {
        this.selectedOption = selected.value;
      }
    }
  }
}
