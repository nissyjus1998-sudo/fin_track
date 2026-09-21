import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {

  profileForm: FormGroup;

  saved = false;

  constructor(private fb: FormBuilder,
    private apiService: ApiService
  ) {

    this.profileForm = this.fb.group({

      name: [
        'Nissy Shery',
        Validators.required
      ],

      email: [
        'demo@fintrack.com',
        [
          Validators.required,
          Validators.email
        ]
      ],

      phone: [
        '',
        Validators.pattern(/^[0-9+\-\s()]*$/)
      ],

      country: [
        'Cyprus',
        Validators.required
      ]

    });

  }
ngOnInit(): void {
  this.userApi();
}
  saveProfile(): void {

    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    console.log(
      'Profile updated:',
      this.profileForm.value
    );

    this.saved = true;

    setTimeout(() => {
      this.saved = false;
    }, 3000);
  }
userApi(): void {

  this.apiService.getUsers().subscribe({
    next: (users) => {
      console.log('API response:', users);
    },
    error: (error) => {
      console.error('API request failed:', error);
    }
  });

}
}
