import { FormGroup } from '@angular/forms';

export function isFieldInvalid(form: FormGroup, field: string): boolean | undefined {
  return form.get(field)?.invalid && (form.get(field)?.touched || form.get(field)?.dirty);
}

export function passwordsMatchValidator(group: FormGroup) {
  const password = group.get('password')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return password === confirmPassword ? null : { passwordMismatch: true };
}
