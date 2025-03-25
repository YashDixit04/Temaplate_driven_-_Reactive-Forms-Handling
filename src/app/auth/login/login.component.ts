import { afterNextRender, Component, DestroyRef, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { debounce, debounceTime } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private form = viewChild.required<NgForm>('form')
  private destroyRef = inject(DestroyRef);

  constructor() {
    afterNextRender(() => {

      const savedForm = window.localStorage.getItem('saved-login-form')
      if (savedForm) {
        const loadedForm = JSON.parse(savedForm)
        const saveEmail = loadedForm.email;
        setTimeout(() => {

          // this.form().setValue({
          //   email : saveEmail,
          //   password: ''
          // }) OR
          this.form().controls['email'].setValue(saveEmail)
        }, 1)

      }

      const subs = this.form()?.valueChanges?.pipe(debounceTime(500)).subscribe({
        next: (value) => window.localStorage.setItem('saved-login-form', JSON.stringify({ email: value.email }))

      });
      this.destroyRef.onDestroy(() => subs?.unsubscribe())
    })
  }
  onSubmit(formData: NgForm) {
    if (formData.form.invalid) {
      return;
    }
    const enteredEmail = formData.form.value.email;
    const enteredPassword = formData.form.value.password;

    console.log(enteredEmail, enteredPassword);

    formData.form.reset();
  }
}
