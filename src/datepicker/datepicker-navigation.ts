import {Component, Input, Output, EventEmitter, ChangeDetectionStrategy} from '@angular/core';
import {NavigationEvent} from './datepicker-view-model';
import {NgbDate} from './ngb-date';
import {NgbDatepickerI18n} from './datepicker-i18n';
import {NgbCalendar} from './ngb-calendar';

@Component({
  selector: 'ngb-datepicker-navigation',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {'class': 'd-flex justify-content-between', '[class.collapsed]': '!showSelect'},
  template: `
    <button type=\"button\"
            class=\"btn btn-default pull-left\"
            (click)=\"!!doNavigate(navigation.PREV)\"
            [disabled]=\"prevDisabled()\"
            tabindex=\"-1\">
      <i class=\"fa fa-chevron-left\"></i>
    </button>
    <ngb-datepicker-navigation-select *ngIf=\"showSelect\"
                                      class=\"d-block\"
                                      [style.width.rem]=\"months * 9\"
                                      [date]=\"date\"
                                      [minDate]=\"minDate\"
                                      [maxDate]=\"maxDate\"
                                      [disabled] = \"disabled\"
                                      (select)=\"selectDate($event)\">
    </ngb-datepicker-navigation-select>
    <button type=\"button\"
            class=\"btn btn-default pull-right\"
            (click)=\"!!doNavigate(navigation.NEXT)\"
            [disabled]=\"nextDisabled()\"
            tabindex=\"-1\">
      <i class=\"fa fa-chevron-right\"></i>
    </button>
  `
})
export class NgbDatepickerNavigation {
  navigation = NavigationEvent;

  @Input() date: NgbDate;
  @Input() disabled: boolean;
  @Input() maxDate: NgbDate;
  @Input() minDate: NgbDate;
  @Input() months: number;
  @Input() showSelect: boolean;
  @Input() showWeekNumbers: boolean;

  @Output() navigate = new EventEmitter<NavigationEvent>();
  @Output() select = new EventEmitter<NgbDate>();

  constructor(public i18n: NgbDatepickerI18n, private _calendar: NgbCalendar) {}

  doNavigate(event: NavigationEvent) { this.navigate.emit(event); }

  nextDisabled() {
    return this.disabled || (this.maxDate && this._calendar.getNext(this.date, 'm').after(this.maxDate));
  }

  prevDisabled() {
    const prevDate = this._calendar.getPrev(this.date, 'm');
    return this.disabled || (this.minDate && prevDate.year <= this.minDate.year && prevDate.month < this.minDate.month);
  }

  selectDate(date: NgbDate) { this.select.emit(date); }
}
