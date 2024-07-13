import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel } from '@ionic/react';
import { format } from 'date-fns';
import { useParams } from 'react-router-dom';
import { MemberData, getAttendanceByDate, getClubById, getAllAttendanceDates } from '../firebaseConfig';
import MainHeader from '../components/Header';
import MainFooter from '../components/MainFooter';
import { toDate, toZonedTime } from 'date-fns-tz';

const timeZone = 'UTC'; // Set the time zone you want to display (e.g., UTC)

const AttendanceMemberRecord: React.FC = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [attendanceRecords, setAttendanceRecords] = useState<Record<string, MemberData[]>>({});
    const [clubName, setClubName] = useState<string>('');

    useEffect(() => {
        fetchAttendanceRecords(clubId);
        fetchClubName(clubId);
    }, [clubId]);

    const fetchAttendanceRecords = async (clubId: string) => {
        const attendanceDates = await getAllAttendanceDates(clubId);
        const records: Record<string, MemberData[]> = {};
        for (const date of attendanceDates) {
            const members = await getAttendanceByDate(clubId, date);
            records[date] = members;
        }
        setAttendanceRecords(records);
    };

    const fetchClubName = async (clubId: string) => {
        const club = await getClubById(clubId);
        setClubName(club?.name || '');
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
                {Object.keys(attendanceRecords).map(date => (
                    <div key={date}>
                        <IonLabel>
                            <p className='ion-padding'>
                                <h6><i>Attendance for {format(toZonedTime(toDate(new Date(date)), timeZone), 'EEEE, do MMMM, yyyy')}</i></h6>
                            </p>
                        </IonLabel>
                        <IonList>
                            {attendanceRecords[date].map(member => (
                                <IonItem key={member.id}>
                                    <IonLabel>{member.name}</IonLabel>
                                    <IonLabel slot="end">{member.attended ? 'Present' : 'Absent'}</IonLabel>
                                </IonItem>
                            ))}
                        </IonList>
                    </div>
                ))}
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default AttendanceMemberRecord;
