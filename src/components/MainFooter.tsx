import React from 'react';
import { IonFooter, IonToolbar, IonTitle, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { personAddOutline, peopleOutline, schoolOutline, addCircleOutline, logOutOutline, homeOutline, checkboxOutline } from 'ionicons/icons';
import './MainFooter.css';

const MainFooter: React.FC = () => {
  return (
    <>
      <IonFooter>
        <IonTabBar slot="bottom">
          <IonTabButton tab="add-member" href="/add-member">
            <IonIcon icon={personAddOutline} />
            <IonLabel>Add</IonLabel>
          </IonTabButton>
          <IonTabButton tab="member-list" href="/member-list">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Members</IonLabel>
          </IonTabButton>
          <IonTabButton tab="dashboard" href="/dashboard">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tribe-list" href="/tribe-list">
            <IonIcon icon={schoolOutline} />
            <IonLabel>Tribes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="club-page" href="/club-page">
            <IonIcon icon={addCircleOutline} />
            <IonLabel>Clubs</IonLabel>
          </IonTabButton>
          <IonTabButton tab="club-members-attendance" href="/club-members-attendance">
            <IonIcon icon={checkboxOutline} />
            <IonLabel>Attend</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </>
  );
};

export default MainFooter;
