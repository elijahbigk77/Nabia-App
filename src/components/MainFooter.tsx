import React from 'react';
import { IonFooter, IonToolbar, IonTitle, IonTabBar, IonTabButton, IonIcon, IonLabel } from '@ionic/react';
import { personAddOutline, peopleOutline, schoolOutline, addCircleOutline, logOutOutline, homeOutline, checkboxOutline, footstepsOutline, documentTextOutline, folderOpenOutline } from 'ionicons/icons';
import './MainFooter.css';

const MainFooter: React.FC = () => {
  return (
    <>
      <IonFooter>
        <IonTabBar slot="bottom">
          <IonTabButton tab="manage-members" href="/manage-members">
            <IonIcon icon={peopleOutline} />
            <IonLabel>Members</IonLabel>
          </IonTabButton>
          <IonTabButton tab="posts" href="/posts">
            <IonIcon icon={documentTextOutline} />
            <IonLabel>Posts</IonLabel>
          </IonTabButton>
          <IonTabButton tab="dashboard" href="/dashboard">
            <IonIcon icon={homeOutline} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tribe-list" href="/tribe-list">
            <IonIcon icon={footstepsOutline} />
            <IonLabel>Tribes</IonLabel>
          </IonTabButton>
          <IonTabButton tab="club-management" href="/club-management">
            <IonIcon icon={folderOpenOutline} />
            <IonLabel>Clubs</IonLabel>
          </IonTabButton>
        </IonTabBar>
      </IonFooter>
    </>
  );
};

export default MainFooter;
