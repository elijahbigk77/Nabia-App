import React, { useState, useEffect } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonCheckbox, IonFab, IonFabButton, IonIcon, IonButton } from '@ionic/react';
import { refreshOutline } from 'ionicons/icons';
import { format, isSameDay } from 'date-fns';
import { useParams, useHistory } from 'react-router-dom';
import { MemberData, markAttendance, getMembersByClubId, getClubById, getAttendanceByDate } from '../firebaseConfig';
import MainHeader from '../components/Header';
import MainFooter from '../components/MainFooter';
import { toast } from '../toast';

const ClubAttendanceMemberList: React.FC = () => {
    const { clubId } = useParams<{ clubId: string }>();
    const [members, setMembers] = useState<MemberData[]>([]);
    const [attendanceDate, setAttendanceDate] = useState<Date>(new Date());
    const [clubName, setClubName] = useState<string>('');
    const [attendanceTakenToday, setAttendanceTakenToday] = useState<boolean>(false);
    const history = useHistory();

    useEffect(() => {
        fetchClubMembers(clubId);
        fetchClubName(clubId);
        checkAttendanceForToday(clubId);
    }, [clubId]);

    const fetchClubMembers = async (clubId: string) => {
        const membersData = await getMembersByClubId(clubId);
        const currentDate = new Date();
        const membersWithAttendance = membersData.map(member => ({
            ...member,
            attended: member.attendance && member.attendance[currentDate.toISOString().substr(0, 10)] === true,
        }));
        setMembers(membersWithAttendance);
    };

    const fetchClubName = async (clubId: string) => {
        const club = await getClubById(clubId);
        setClubName(club?.name || '');
    };

    const checkAttendanceForToday = async (clubId: string) => {
        const currentDate = new Date();
        const attendanceExists = await getAttendanceByDate(clubId, currentDate.toISOString().substr(0, 10));
        setAttendanceTakenToday(attendanceExists.length > 0);
    };

    const handleAttendanceChange = (memberId: string, attended: boolean) => {
        const updatedMembers = members.map(member => {
            if (member.id === memberId) {
                return { ...member, attended };
            }
            return member;
        });
        setMembers(updatedMembers);
    };

    const saveAttendance = async () => {
        const currentDate = new Date();
        const currentDateStr = currentDate.toISOString().substr(0, 10);

        if (attendanceTakenToday) {
            toast(`Attendance has already been taken for ${clubName} club. Please wait until tomorrow to take attendance for another day.`);
            return;
        }

        try {
            const promises = members.map(member => {
                const attended = member.attended || false;  // Ensure attended is a boolean
                return markAttendance(member.id, currentDateStr, attended);
            });
            await Promise.all(promises);
            toast(`Attendance marked for ${clubName}`);
            setAttendanceTakenToday(true);
        } catch (error) {
            console.error('Error marking attendance:', error);
            toast('Failed to mark attendance. Please try again.');
        }
    };

    const resetPage = () => {
        setAttendanceDate(new Date());
        setAttendanceTakenToday(false);
        fetchClubMembers(clubId);
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
                                checked={member.attended || false}  // Ensure checkbox state is boolean
                                onIonChange={e => handleAttendanceChange(member.id, e.detail.checked)}
                            />
                        </IonItem>
                    ))}
                </IonList>
                <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton onClick={resetPage}>
                        <IonIcon icon={refreshOutline} />
                    </IonFabButton>
                </IonFab>
                <IonButton expand="full" onClick={saveAttendance}>Save Attendance</IonButton>
                <IonFab vertical="bottom" horizontal="start" slot="fixed" color='black'>
                    <strong><i><IonLabel color='dark'>Date: {format(attendanceDate, 'EEEE, do MMMM, yyyy')}</IonLabel></i></strong>
                </IonFab>
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default ClubAttendanceMemberList;
