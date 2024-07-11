// ClubAttendanceList.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCheckbox, IonFab, IonFabButton, IonIcon } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { MemberData, markAttendance, getMembersByClubId } from '../firebaseConfig';

const ClubAttendanceList: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>(); // Fetch clubId from route params
  const [members, setMembers] = useState<MemberData[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>('');

  useEffect(() => {
    fetchClubMembers(clubId); // Fetch members when clubId changes
    setCurrentDate();
  }, [clubId]);

  const fetchClubMembers = async (clubId: string) => {
    const membersData = await getMembersByClubId(clubId);
    setMembers(membersData);
  };

  const setCurrentDate = () => {
    const currentDate = format(new Date(), 'EEEE, do MMMM yyyy');
    setAttendanceDate(currentDate);
  };

  const handleAttendanceChange = (memberId: string, attended: boolean) => {
    markAttendance(memberId, attendanceDate, attended)
      .then(success => {
        if (success) {
          // Optional: Provide feedback or update UI if needed
          console.log(`Attendance marked for member ${memberId}`);
        } else {
          console.error(`Failed to mark attendance for member ${memberId}`);
        }
      })
      .catch(error => {
        console.error('Error marking attendance:', error);
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Club Attendance</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonList>
          {members.map(member => (
            <IonItem key={member.id}>
              <IonLabel>{member.name}</IonLabel>
              <IonCheckbox slot="end" checked={false} onIonChange={e => handleAttendanceChange(member.id, e.detail.checked)} />
            </IonItem>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={setCurrentDate}>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>
        <IonLabel>Date: {attendanceDate}</IonLabel>
      </IonContent>
    </IonPage>
  );
};

export default ClubAttendanceList;
