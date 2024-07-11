// ClubMembersAttendance.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonIcon } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getAllClubs, ClubData } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { checkboxOutline, chevronForwardOutline } from 'ionicons/icons';

const ClubMembersAttendance: React.FC = () => {
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const history = useHistory();

  useEffect(() => {
    fetchClubs();
  }, []);

  const fetchClubs = async () => {
    const clubsData = await getAllClubs();
    setClubs(clubsData);
  };

  const handleClubSelection = (clubId: string) => {
    history.push(`/club-attendance-list/${clubId}`); 
  };

  return (
    <IonPage>
        <MainHeader />
      
        <IonToolbar>
          <IonTitle>Select a Club to Take Club Meeting Attendance</IonTitle>
        </IonToolbar>
      
      <IonContent>
        <IonList>
          {clubs.map(club => (
            <IonItem key={club.id} onClick={() => club.id && handleClubSelection(club.id)}>
                <IonIcon icon={chevronForwardOutline} slot='end' />
              <IonLabel>{club.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default ClubMembersAttendance;
