import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCheckbox, IonFab, IonFabButton, IonIcon, IonButton } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { MemberData, markAttendance, getMembersByClubId, getClubById } from '../firebaseConfig';
import MainHeader from '../components/Header';
import MainFooter from '../components/MainFooter';

const ClubAttendanceMemberList: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>(); 
  const [members, setMembers] = useState<MemberData[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>('');
  const [clubName, setClubName] = useState<string>(''); 

  useEffect(() => {
    fetchClubMembers(clubId); 
    fetchClubName(clubId); 
    setCurrentDate();
  }, [clubId]);

  const fetchClubMembers = async (clubId: string) => {
    const membersData = await getMembersByClubId(clubId);
    // Initialize attendance status for each member based on today's date
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const membersWithAttendance = membersData.map(member => ({
      ...member,
      attended: member.attendance && member.attendance[currentDate] === true,
    }));
    setMembers(membersWithAttendance);
  };

  const fetchClubName = async (clubId: string) => {
    const club = await getClubById(clubId);
    setClubName(club?.name || ''); // Set club name if found
  };

  const setCurrentDate = () => {
    const currentDate = format(new Date(), 'EEEE, do MMMM, yyyy');
    setAttendanceDate(currentDate);
  };

  const handleAttendanceChange = (memberId: string, attended: boolean) => {
    // Update local state to reflect attendance change
    const updatedMembers = members.map(member => {
      if (member.id === memberId) {
        return { ...member, attended };
      }
      return member;
    });
    setMembers(updatedMembers);

    // Save attendance in Firebase immediately
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    markAttendance(memberId, currentDate, attended)
      .then(success => {
        if (success) {
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
      <MainHeader />
      <IonHeader>
        <IonToolbar>
          <IonTitle>Members of {clubName} Club</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonLabel>
          <p className='ion-padding'>
            <h6><i>Select a checkbox to mark a member present and uncheck to mark them absent</i></h6>
          </p>
        </IonLabel>
        <IonList>
          {members.map(member => (
            <IonItem key={member.id}>
              <IonLabel>{member.name}</IonLabel>
              <IonLabel slot="end">{member.attended ? 'Present' : 'Absent'}</IonLabel>
              <IonCheckbox 
                slot="end" 
                checked={member.attended || false} 
                onIonChange={e => handleAttendanceChange(member.id, e.detail.checked)} 
              />
            </IonItem>
          ))}
        </IonList>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={setCurrentDate}>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>
        <IonButton expand="full" routerLink="/club-attendance-list">Save Attendance</IonButton>
        <IonFab vertical="bottom" horizontal="start" slot="fixed" color='black'>
          <strong><i><IonLabel color='dark'>Date: {attendanceDate}</IonLabel></i></strong>
        </IonFab>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default ClubAttendanceMemberList;
