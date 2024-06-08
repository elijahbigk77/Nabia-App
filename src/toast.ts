import { toastController } from '@ionic/core';
export async function toast(message: string, duration = 2000) {
    const toast = await toastController.create({
        message,
        duration,
        position: 'bottom'
    });

    await toast.present();
}