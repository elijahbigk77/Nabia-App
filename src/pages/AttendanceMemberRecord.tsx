// AttendanceMemberRecord.tsx

import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle } from '@ionic/react';
import { useParams } from 'react-router-dom';
import { format } from 'date-fns';
import { MemberData, getMembersByClubId, getClubById } from '../firebaseConfig';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';

const AttendanceMemberRecord: React.FC = () => {
  const { clubId } = useParams<{ clubId: string }>(); 
  const [members, setMembers] = useState<MemberData[]>([]);
  const [attendanceDate, setAttendanceDate] = useState<string>('');
  const [clubName, setClubName] = useState<string>(''); 
  const [showPresent, setShowPresent] = useState(true); // Toggle to show present or absent members

  useEffect(() => {
    fetchClubMembers(clubId); 
    fetchClubName(clubId); 
    setCurrentDate();
  }, [clubId]);

  const fetchClubMembers = async (clubId: string) => {
    const membersData = await getMembersByClubId(clubId);
    const currentDate = format(new Date(), 'yyyy-MM-dd');
    const membersWithAttendance = membersData.map(member => ({
      ...member,
      attended: member.attendance && member.attendance[currentDate] === true,
    }));
    setMembers(membersWithAttendance);
  };

  const fetchClubName = async (clubId: string) => {
    const club = await getClubById(clubId);
    setClubName(club?.name || ''); 
  };

  const setCurrentDate = () => {
    const currentDate = format(new Date(), 'EEEE, do MMMM, yyyy');
    setAttendanceDate(currentDate);
  };

  const filteredMembers = members.filter(member => 
    showPresent ? member.attendance && member.attendance[attendanceDate] : !member.attendance || !member.attendance[attendanceDate]
  );

  return (
    <IonPage>
      <MainHeader />
      <IonHeader>
        <IonToolbar>
          <IonTitle>{`List of Members ${showPresent ? 'Present' : 'Absent'} at ${clubName} on ${attendanceDate}`}</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonItem>
          <IonLabel>{showPresent ? 'Show Absent Members' : 'Show Present Members'}</IonLabel>
          <IonToggle 
            checked={showPresent} 
            onIonChange={e => setShowPresent(e.detail.checked)} 
            slot="end" 
          />
        </IonItem>
        <IonList>
          {filteredMembers.map(member => (
            <IonItem key={member.id}>
              <IonLabel>{member.name}</IonLabel>
            </IonItem>
          ))}
        </IonList>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default AttendanceMemberRecord;
