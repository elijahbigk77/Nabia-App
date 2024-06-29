import { toastController } from '@ionic/core';

export async function toast(message: string, color: string = 'danger') {
    const toast = await toastController.create({
        message,
        duration: 2000,
        color,
    });
    await toast.present();
}
