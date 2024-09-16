import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  email: string = '';
  password: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private alertController: AlertController,
    private loadingController: LoadingController
  ) {}

  ngOnInit() {}

  async login() {
    if (this.email === '' || this.password === '') {
      this.presentAlert('Error', 'Por favor, complete todos los campos.');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Iniciando sesión...',
    });
    await loading.present();

    this.authService
      .login(this.email, this.password)
      .then(async (userCredential) => {
        await loading.dismiss();
        if (userCredential) {
          // Obtener el rol del usuario desde el servicio de autenticación
          const userRole = await this.authService.getUserRole(userCredential.user?.uid);
          this.navigateBasedOnRole(userRole);
        } else {
          this.presentAlert('Error', 'Credenciales incorrectas.');
        }
      })
      .catch(async (error) => {
        await loading.dismiss();
        this.presentAlert('Error', 'Credenciales incorrectas.');
        console.error(error);
      });
  }

  // Navegar a la página correspondiente según el rol del usuario
  navigateBasedOnRole(role: string) {
    switch (role) {
      case 'admin':
        this.router.navigate(['/home']);
        break;
      case 'logística':
        this.router.navigate(['/inventory']);
        break;
      case 'consulta':
        this.router.navigate(['/reports']);
        break;
      default:
        this.presentAlert('Error', 'Rol no reconocido.');
        break;
    }
  }

  // Método para mostrar alertas
  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
