import React from 'react';
import './MainFooter.css';
import { IonContent, IonFooter, IonTitle, IonToolbar } from '@ionic/react';

function MainFooter() {
  return (
    <>
      <IonFooter>
        <IonToolbar color='background'>
          <IonTitle className='footer-title'>©Nabia Fellows 2024</IonTitle>
        </IonToolbar>
      </IonFooter>
    </>
  );
}
export default MainFooter;