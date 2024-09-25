import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule]
})
export class LoginPage {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  async login() {
    if (this.email === '' || this.password === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    this.authService.loginUser(this.email, this.password)
      .then(() => {
        loading.dismiss();
        this.router.navigate(['/home']);
      })
      .catch(async (error) => {
        await loading.dismiss();
        this.presentAlert('Error', 'Credenciales incorrectas.');
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