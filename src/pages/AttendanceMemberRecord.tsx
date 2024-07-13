import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { MemberData, getAttendanceByDate, getClubById } from '../firebaseConfig';
import MainHeader from '../components/Header';
import MainFooter from '../components/MainFooter';

const AttendanceMemberRecord: React.FC = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [members, setMembers] = useState<MemberData[]>([]);
    const [attendanceDate, setAttendanceDate] = useState<string>('');
    const [clubName, setClubName] = useState<string>('');

    useEffect(() => {
        fetchAttendanceRecords(clubId);
        fetchClubName(clubId);
        setCurrentDate();
    }, [clubId]);

    const fetchAttendanceRecords = async (clubId: string) => {
        const currentDate = format(new Date(), 'yyyy-MM-dd');
        const attendanceRecords = await getAttendanceByDate(clubId, currentDate);
        setMembers(attendanceRecords);
    };

    const fetchClubName = async (clubId: string) => {
        const club = await getClubById(clubId);
        setClubName(club?.name || '');
    };

    const setCurrentDate = () => {
        const currentDate = format(new Date(), 'EEEE, do MMMM, yyyy');
        setAttendanceDate(currentDate);
    };

    return (
        <IonPage>
            <MainHeader />
            <IonHeader>
                <IonToolbar>
                    <IonTitle>Attendance Records for {clubName} Club</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent>
                <IonLabel>
                    <p className='ion-padding'>
                        <h6><i>Attendance for {attendanceDate}</i></h6>
                    </p>
                </IonLabel>
                <IonList>
                    {members.map(member => (
                        <IonItem key={member.id}>
                            <IonLabel>{member.name}</IonLabel>
                            <IonLabel slot="end">{member.attended ? 'Present' : 'Absent'}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default AttendanceMemberRecord;
