// ClubMembersAttendance.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { useHistory } from 'react-router-dom';
import { getAllClubs, ClubData } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';

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
          <IonTitle>Club Attendance</IonTitle>
        </IonToolbar>
      
      <IonContent>
        <IonList>
          {clubs.map(club => (
            <IonItem key={club.id} onClick={() => club.id && handleClubSelection(club.id)}>
              <IonLabel>{club.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default ClubMembersAttendance;
