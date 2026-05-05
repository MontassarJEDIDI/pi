import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Le nom ne peut pas être uniquement un nombre (entier) */
export function userFullNameNotIntegerValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || String(v).trim() === '') return null;
    const s = String(v).trim();
    if (/^\d+$/.test(s)) return { userFullNameInteger: { message: 'Le nom ne peut pas être un nombre.' } };
    return null;
  };
}

/** ID utilisateur : entier strictement positif */
export function userIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const v = control.value;
    if (v == null || v === '') return null;
    const n = Number(v);
    if (Number.isNaN(n)) return { userId: { message: 'Doit être un nombre.' } };
    if (!Number.isInteger(n)) return { userId: { message: 'Doit être un entier.' } };
    if (n < 1) return { userId: { message: 'Doit être au moins 1.' } };
    if (n > 999_999_999) return { userId: { message: 'Valeur trop grande.' } };
    return null;
  };
}

/** Date de fin >= date de début (quand les deux sont renseignées) */
export function endDateAfterStartValidator(
  startDateControlName: string,
  endDateControlName: string
): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const start = group.get(startDateControlName)?.value;
    const end = group.get(endDateControlName)?.value;
    const endControl = group.get(endDateControlName);
    if (!start || !end) {
      if (endControl?.errors?.['endBeforeStart']) {
        const { endBeforeStart: _, ...rest } = endControl.errors;
        endControl.setErrors(Object.keys(rest).length ? rest : null);
      }
      return null;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) {
      endControl?.setErrors({ ...(endControl?.errors ?? {}), endBeforeStart: true });
      return null;
    }
    if (endControl?.errors?.['endBeforeStart']) {
      const { endBeforeStart: _, ...rest } = endControl.errors;
      endControl.setErrors(Object.keys(rest).length ? rest : null);
    }
    return null;
  };
}
