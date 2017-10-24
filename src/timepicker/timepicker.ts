import {Component, Input, forwardRef, OnChanges, SimpleChanges} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

import {isNumber, padNumber, toInteger, isDefined} from '../util/util';
import {NgbTime} from './ngb-time';
import {NgbTimepickerConfig} from './timepicker-config';

const NGB_TIMEPICKER_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => NgbTimepicker),
  multi: true
};

/**
 * A lightweight & configurable timepicker directive.
 */
@Component({
  selector: 'ngb-timepicker',
  styles: ["\n    .ngb-tp {\n      display: flex;\n      align-items: center;\n    }\n\n    .ngb-tp-hour, .ngb-tp-minute, .ngb-tp-second, .ngb-tp-meridian {\n      display: block;\n      flex-direction: column;\n      align-items: center;\n      justify-content: space-around;\n    }\n\n    .ngb-tp-spacer {\n      width: 1em;\n      text-align: center;\n    }\n\n    .chevron::before {\n      border-style: solid;\n      border-width: 0.29em 0.29em 0 0;\n      content: '';\n      display: inline-block;\n      height: 0.69em;\n      left: 0.05em;\n      position: relative;\n      top: 0.15em;\n      transform: rotate(-45deg);\n      -webkit-transform: rotate(-45deg);\n      -ms-transform: rotate(-45deg);\n      vertical-align: middle;\n      width: 0.71em;\n    }\n\n    .chevron.bottom:before {\n      top: -.3em;\n      -webkit-transform: rotate(135deg);\n      -ms-transform: rotate(135deg);\n      transform: rotate(135deg);\n    }\n\n    .btn-link {\n      outline: 0;\n    }\n\n    .btn-link.disabled {\n      cursor: not-allowed;\n      opacity: .65;\n    }\n\n    input {\n      text-align: center;\n      display: inline-block;\n      width: auto;\n    }\n  "],
  template: "<fieldset [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <div class=\"ngb-tp\">\n    <div class=\"ngb-tp-hour\">\n    <input type=\"text\" class=\"form-control\" [ngClass]=\"setFormControlSize()\" maxlength=\"2\" size=\"2\" placeholder=\"HH\" [value]=\"formatHour(model?.hour)\" (change)=\"updateHour($event.target.value)\" [readonly]=\"readonlyInputs\" [disabled]=\"disabled\" aria-label=\"Hours\">\n    <div>\n    <button tabIndex=\"-1\" *ngIf=\"spinners\" type=\"button\" class=\"btn-link btn-inc\" [ngClass]=\"setButtonSize()\" (click)=\"changeHour(hourStep)\" [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <span class=\"chevron\"></span>\n    </button>\n    <button tabIndex=\"-1\" *ngIf=\"spinners\" type=\"button\" class=\"btn-link btn-dec\" [ngClass]=\"setButtonSize()\" (click)=\"changeHour(-hourStep)\" [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <span class=\"chevron bottom\"></span>\n    </button>\n    </div>\n    </div>\n    <div class=\"ngb-tp-spacer\">:</div>\n    <div class=\"ngb-tp-minute\">\n    <input type=\"text\" class=\"form-control\" [ngClass]=\"setFormControlSize()\" maxlength=\"2\" size=\"2\" placeholder=\"MM\" [value]=\"formatMinSec(model?.minute)\" (change)=\"updateMinute($event.target.value)\" [readonly]=\"readonlyInputs\" [disabled]=\"disabled\" aria-label=\"Minutes\">\n    <div>\n    <button tabIndex=\"-1\" *ngIf=\"spinners\" type=\"button\" class=\"btn-link btn-inc\" [ngClass]=\"setButtonSize()\" (click)=\"changeMinute(minuteStep)\" [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <span class=\"chevron\"></span>\n    </button>\n    <button tabIndex=\"-1\" *ngIf=\"spinners\" type=\"button\" class=\"btn-link btn-dec\" [ngClass]=\"setButtonSize()\" (click)=\"changeMinute(-minuteStep)\" [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <span class=\"chevron bottom\"></span>\n    </button>\n    </div>\n    </div>\n    <div *ngIf=\"seconds\" class=\"ngb-tp-spacer\">:</div>\n    <div *ngIf=\"seconds\" class=\"ngb-tp-second\">\n    <input type=\"text\" class=\"form-control\" [ngClass]=\"setFormControlSize()\" maxlength=\"2\" size=\"2\" placeholder=\"SS\" [value]=\"formatMinSec(model?.second)\" (change)=\"updateSecond($event.target.value)\" [readonly]=\"readonlyInputs\" [disabled]=\"disabled\" aria-label=\"Seconds\">\n    <button tabIndex=\"-1\" *ngIf=\"spinners\" type=\"button\" class=\"btn-link btn-inc\" [ngClass]=\"setButtonSize()\" (click)=\"changeSecond(secondStep)\" [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <span class=\"chevron\"></span>\n    </button>\n    <button tabIndex=\"-1\" *ngIf=\"spinners\" type=\"button\" class=\"btn-link btn-dec\" [ngClass]=\"setButtonSize()\" (click)=\"changeSecond(-secondStep)\" [disabled]=\"disabled\" [class.disabled]=\"disabled\">\n    <span class=\"chevron bottom\"></span>\n    </button>\n    </div>\n    <div *ngIf=\"meridian\" class=\"ngb-tp-spacer\"></div>\n    <div *ngIf=\"meridian\" class=\"ngb-tp-meridian\">\n    <button type=\"button\" class=\"btn btn-default\" [ngClass]=\"setButtonSize()\" [disabled]=\"disabled\" [class.disabled]=\"disabled\" (click)=\"toggleMeridian()\">{{model?.hour >= 12 ? 'PM' : 'AM'}}</button>\n    </div>\n    </div>\n    </fieldset>\n  ",
  providers: [NGB_TIMEPICKER_VALUE_ACCESSOR]
})
export class NgbTimepicker implements ControlValueAccessor,
    OnChanges {
  disabled: boolean;
  model: NgbTime;

  /**
   * Whether to display 12H or 24H mode.
   */
  @Input() meridian: boolean;

  /**
   * Whether to display the spinners above and below the inputs.
   */
  @Input() spinners: boolean;

  /**
   * Whether to display seconds input.
   */
  @Input() seconds: boolean;

  /**
   * Number of hours to increase or decrease when using a button.
   */
  @Input() hourStep: number;

  /**
   * Number of minutes to increase or decrease when using a button.
   */
  @Input() minuteStep: number;

  /**
   * Number of seconds to increase or decrease when using a button.
   */
  @Input() secondStep: number;

  /**
   * To make timepicker readonly
   */
  @Input() readonlyInputs: boolean;

  /**
   * To set the size of the inputs and button
   */
  @Input() size: 'small' | 'medium' | 'large';

  constructor(config: NgbTimepickerConfig) {
    this.meridian = config.meridian;
    this.spinners = config.spinners;
    this.seconds = config.seconds;
    this.hourStep = config.hourStep;
    this.minuteStep = config.minuteStep;
    this.secondStep = config.secondStep;
    this.disabled = config.disabled;
    this.readonlyInputs = config.readonlyInputs;
    this.size = config.size;
  }

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value) {
    this.model = value ? new NgbTime(value.hour, value.minute, value.second) : new NgbTime();
    if (!this.seconds && (!value || !isNumber(value.second))) {
      this.model.second = 0;
    }
  }

  registerOnChange(fn: (value: any) => any): void { this.onChange = fn; }

  registerOnTouched(fn: () => any): void { this.onTouched = fn; }

  setDisabledState(isDisabled: boolean) { this.disabled = isDisabled; }

  changeHour(step: number) {
    this.model.changeHour(step);
    this.propagateModelChange();
  }

  changeMinute(step: number) {
    this.model.changeMinute(step);
    this.propagateModelChange();
  }

  changeSecond(step: number) {
    this.model.changeSecond(step);
    this.propagateModelChange();
  }

  updateHour(newVal: string) {
    const isPM = this.model.hour >= 12;
    const enteredHour = toInteger(newVal);
    if (this.meridian && (isPM && enteredHour < 12 || !isPM && enteredHour === 12)) {
      this.model.updateHour(enteredHour + 12);
    } else {
      this.model.updateHour(enteredHour);
    }
    this.propagateModelChange();
  }

  updateMinute(newVal: string) {
    this.model.updateMinute(toInteger(newVal));
    this.propagateModelChange();
  }

  updateSecond(newVal: string) {
    this.model.updateSecond(toInteger(newVal));
    this.propagateModelChange();
  }

  toggleMeridian() {
    if (this.meridian) {
      this.changeHour(12);
    }
  }

  formatHour(value: number) {
    if (isNumber(value)) {
      if (this.meridian) {
        return padNumber(value % 12 === 0 ? 12 : value % 12);
      } else {
        return padNumber(value % 24);
      }
    } else {
      return padNumber(NaN);
    }
  }

  formatMinSec(value: number) { return padNumber(value); }

  setFormControlSize() { return {'form-control-sm': this.size === 'small', 'form-control-lg': this.size === 'large'}; }

  setButtonSize() { return {'btn-sm': this.size === 'small', 'btn-lg': this.size === 'large'}; }


  ngOnChanges(changes: SimpleChanges): void {
    if (changes['seconds'] && !this.seconds && this.model && !isNumber(this.model.second)) {
      this.model.second = 0;
      this.propagateModelChange(false);
    }
  }

  private propagateModelChange(touched = true) {
    if (touched) {
      this.onTouched();
    }
    if (this.model.isValid(this.seconds)) {
      this.onChange({hour: this.model.hour, minute: this.model.minute, second: this.model.second});
    } else {
      this.onChange(null);
    }
  }
}
