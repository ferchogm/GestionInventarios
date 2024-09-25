import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class RegisterPage {
  user = {
    email: '',
    password: '',
    role: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async register() {
    if (this.user.email === '' || this.user.password === '' || this.user.role === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Registrando usuario...',
    });
    await loading.present();

    this.authService.registerUser(this.user.email, this.user.password, this.user.role)
      .then(() => {
        loading.dismiss();
        this.presentAlert('Éxito', 'Usuario registrado correctamente.');
        this.router.navigate(['/login']);
      })
      .catch(async (error) => {
        await loading.dismiss();
        this.presentAlert('Error', 'No se pudo registrar el usuario.');
        console.error(error);
      });
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}