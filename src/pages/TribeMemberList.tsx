import React, { useEffect, useState } from 'react';
import { IonPage, IonContent, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, IonDatetime, IonIcon, IonInput, IonItem, IonLabel, IonModal, IonSelect, IonSelectOption, IonAlert } from '@ionic/react';
import { useParams } from 'react-router-dom';
import MainHeader from '../components/MainHeader';
import MainFooter from '../components/MainFooter';
import { MemberData, Tribe, getMembersByTribeId, tribes, updateMember, getAllClubs, deleteMember, ClubData, getTribes } from '../firebaseConfig';
import './MemberList.css';
import { pencilOutline, trashOutline } from 'ionicons/icons';
import { toast } from '../toast';

const TribeMemberList: React.FC = () => {
    const { tribeId } = useParams<{ tribeId: string }>();
    const [members, setMembers] = useState<MemberData[]>([]);
    const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteAlert, setShowDeleteAlert] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editMemberData, setEditMemberData] = useState<MemberData>({
        id: '',
        name: '',
        birthdate: '',
        residentialAddress: '',
        schoolAddress: '',
        parentGuardianName: '',
        parentGuardianRelationship: '',
        parentGuardianContact: '',
        teacherName: '',
        teacherContact: '',
        teacherClass: '',
        tribeId: '',
        clubId: ''
    });

    const [clubs, setClubs] = useState<ClubData[]>([]);
    const [tribesList, setTribesList] = useState<Tribe[]>([]);

    useEffect(() => {
        fetchMembers();
        fetchTribes();
        fetchClubs();
    }, [tribeId]); // Fetch members when tribeId changes

    const fetchMembers = async () => {
        const fetchedMembers = await getMembersByTribeId(tribeId); // Fetch members by tribeId
        setMembers(fetchedMembers);
    };

    const fetchTribes = async () => {
        const fetchedTribes = await getTribes();
        setTribesList(fetchedTribes);
    };

    const fetchClubs = async () => {
        const fetchedClubs = await getAllClubs();
        setClubs(fetchedClubs);
    };

    const openModal = (member: MemberData) => {
        setSelectedMember(member);
        setEditMode(false);
        setEditMemberData(member);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const calculateAge = (birthdate: string): string => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        let age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        if (month < 0 || (month === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age.toString();
    };

    const handleEditMember = async () => {
        // Validate required fields
        if (!editMemberData.name) {
            toast("Please fill in all required fields.");
            return;
        }

        if (editMemberData.id) {
            const memberId = editMemberData.id;
            const updated = await updateMember(memberId, editMemberData);
            if (updated) {
                fetchMembers(); // Refresh member list after update
                closeModal();
            }
        }
    };

    const handleDeleteMember = async () => {
        if (selectedMember) {
            const memberId = selectedMember.id;
            const deleted = await deleteMember(memberId);
            if (deleted) {
                fetchMembers(); // Refresh member list after delete
                setShowDeleteAlert(false);
                closeModal();
            }
        }
    };

    // Find the name of the selected tribe
    const selectedTribeName = tribes.find(tribe => tribe.id === tribeId)?.name;

    const formatBirthdate = (birthdate: string): string => {
        const date = new Date(birthdate);
        const day = date.getDate();
        const monthIndex = date.getMonth();
        const year = date.getFullYear();
    
        // Suffix for day (e.g., 1st, 2nd, 3rd, 4th)
        const suffixes = ['th', 'st', 'nd', 'rd'];
        const suffix = suffixes[day % 10] || 'th';
    
        // Array of month names
        const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        const month = months[monthIndex];
    
        return `${day}${suffix} ${month}, ${year}`;
      };
    

    return (
        <IonPage>
            <MainHeader />
            <IonContent fullscreen className="ion-padding item-background-color" color="background">
                <p>Members of {selectedTribeName} Tribe</p>
                <IonList>
                    {members.map((member, index) => (
                        <IonCard key={index} onClick={() => openModal(member)}>
                            <IonCardHeader>
                                <IonCardTitle>{member.name}</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <p>{`Birthdate: ${formatBirthdate(member.birthdate)}`}</p>
                                <p>{`Age: ${calculateAge(member.birthdate)}`}</p>
                            </IonCardContent>
                        </IonCard>
                    ))}
                </IonList>
                {/* Modal to display member details */}
                <IonModal isOpen={showModal} onDidDismiss={closeModal} className='full-screen-modal'>
                    {editMode ? (
                        <IonContent fullscreen>
                            <MainHeader />
                            <IonItem>
                                <IonLabel position="stacked">Name</IonLabel>
                                <IonInput
                                    value={editMemberData.name}
                                    onIonInput={(e: any) => setEditMemberData({ ...editMemberData, name: e.target.value })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Birthdate</IonLabel>
                                <IonDatetime
                                    value={editMemberData.birthdate}
                                    onIonChange={(e: any) => setEditMemberData({ ...editMemberData, birthdate: e.detail.value! })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Residential Address</IonLabel>
                                <IonInput
                                    value={editMemberData.residentialAddress}
                                    onIonInput={(e: any) =>
                                        setEditMemberData({ ...editMemberData, residentialAddress: e.target.value })
                                    }
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">School Address</IonLabel>
                                <IonInput
                                    value={editMemberData.schoolAddress}
                                    onIonInput={(e: any) => setEditMemberData({ ...editMemberData, schoolAddress: e.target.value })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Parent/Guardian Name</IonLabel>
                                <IonInput
                                    value={editMemberData.parentGuardianName}
                                    onIonInput={(e: any) =>
                                        setEditMemberData({ ...editMemberData, parentGuardianName: e.target.value })
                                    }
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Parent/Guardian Relationship</IonLabel>
                                <IonInput
                                    value={editMemberData.parentGuardianRelationship}
                                    onIonInput={(e: any) =>
                                        setEditMemberData({ ...editMemberData, parentGuardianRelationship: e.target.value })
                                    }
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Parent/Guardian Contact</IonLabel>
                                <IonInput
                                    value={editMemberData.parentGuardianContact}
                                    onIonInput={(e: any) =>
                                        setEditMemberData({ ...editMemberData, parentGuardianContact: e.target.value })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Teacher Name</IonLabel>
                                <IonInput
                                    value={editMemberData.teacherName}
                                    onIonInput={(e: any) => setEditMemberData({ ...editMemberData, teacherName: e.target.value })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Teacher Contact</IonLabel>
                                <IonInput
                                    value={editMemberData.teacherContact}
                                    onIonInput={(e: any) =>
                                        setEditMemberData({ ...editMemberData, teacherContact: e.target.value })
                                    }
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Teacher Class</IonLabel>
                                <IonInput
                                    value={editMemberData.teacherClass}
                                    onIonInput={(e: any) => setEditMemberData({ ...editMemberData, teacherClass: e.target.value })}
                                />
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Tribe</IonLabel>
                                <IonSelect
                                    value={editMemberData.tribeId}
                                    onIonChange={(e: any) =>
                                        setEditMemberData({ ...editMemberData, tribeId: e.target.value })
                                    }
                                >
                                    {tribes.map((tribe: Tribe) => (
                                        <IonSelectOption key={tribe.id} value={tribe.id}>
                                            {tribe.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            <IonItem>
                                <IonLabel position="stacked">Club</IonLabel>
                                <IonSelect
                                    value={editMemberData.clubId}
                                    onIonChange={(e: any) =>
                                        setEditMemberData({ ...editMemberData, clubId: e.target.value })
                                    }
                                >
                                    {clubs.map((club: ClubData) => (
                                        <IonSelectOption key={club.id} value={club.id}>
                                            {club.name}
                                        </IonSelectOption>
                                    ))}
                                </IonSelect>
                            </IonItem>
                            <IonButton expand="block" onClick={handleEditMember}>
                                Save Changes
                            </IonButton>
                            <IonButton expand="block" color="medium" onClick={closeModal}>
                                Cancel
                            </IonButton>
                        </IonContent>
                    ) : (
                        <IonContent className='profile-modal'>
                            <MainHeader />
                            <IonCard className='profile-card'>
                                <IonCardHeader>
                                    <IonCardTitle>{selectedMember?.name}</IonCardTitle>
                                </IonCardHeader>
                                <IonCardContent className='ion-padding member-info'>
                                    <IonLabel>
                                        <p>{`Birthdate: ${formatBirthdate(selectedMember?.birthdate || '')}`}</p>
                                        <p>{`Age: ${calculateAge(selectedMember?.birthdate || '')}`}</p>
                                        <p>{`Residential Address: ${selectedMember?.residentialAddress}`}</p>
                                        <p>{`School Address: ${selectedMember?.schoolAddress}`}</p>
                                        <p>{`Parent/Guardian: ${selectedMember?.parentGuardianName}`}</p>
                                        <p>{`Relationship: ${selectedMember?.parentGuardianRelationship}`}</p>
                                        <p>{`Parent/Guardian Contact: ${selectedMember?.parentGuardianContact}`}</p>
                                        <p>{`Teacher: ${selectedMember?.teacherName}`}</p>
                                        <p>{`Teacher Contact: ${selectedMember?.teacherContact}`}</p>
                                        <p>{`Teacher Class: ${selectedMember?.teacherClass}`}</p>
                                        <p>{`Tribe: ${tribes.find((tribe: Tribe) => tribe.id === selectedMember?.tribeId)?.name}`}</p>
                                        <p>{`Club: ${clubs.find((club: ClubData) => club.id === selectedMember?.clubId)?.name}`}</p>
                                    </IonLabel>
                                    <IonButton onClick={closeModal}>Close</IonButton>
                                    <IonButton color="dark" onClick={() => setEditMode(true)}>
                                        <IonIcon icon={pencilOutline} />
                                    </IonButton>
                                    <IonButton color="dark" onClick={() => setShowDeleteAlert(true)}>
                                        <IonIcon icon={trashOutline} />
                                    </IonButton>
                                </IonCardContent>
                            </IonCard>
                        </IonContent>
                    )}
                    <MainFooter />
                </IonModal>
                {/* Alert for delete confirmation */}
                <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header={'Confirm Delete'}
                    message={`Are you sure you want to delete ${selectedMember?.name}?`}
                    buttons={[
                        {
                            text: 'Cancel',
                            role: 'cancel',
                            cssClass: 'secondary'
                        },
                        {
                            text: 'Delete',
                            handler: handleDeleteMember
                        }
                    ]}
                />
            </IonContent>
            <MainFooter />
        </IonPage>
    );
};

export default TribeMemberList;
