import React from 'react';
import { IonFooter, IonToolbar, IonTitle, IonTabBar, IonTabButton, IonIcon, IonLabel, IonText } from '@ionic/react';
import { personAddOutline, peopleOutline, schoolOutline, addCircleOutline, logOutOutline, homeOutline, checkboxOutline } from 'ionicons/icons';
import './MainFooter.css';

const Footer: React.FC = () => {
  return (
    <>
      
      
        <IonTabBar slot="bottom">
            <IonTabButton>Nabia Fellows 2024</IonTabButton>
        </IonTabBar>
        
      
    </>
  );
};

export default Footer;
