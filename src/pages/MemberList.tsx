import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonModal,
  IonButton,
  IonLabel,
  IonIcon,
  IonAlert,
  IonInput,
  IonItem,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonFab,
  IonFabButton,
  IonText,
} from "@ionic/react";
import { useLocation } from "react-router-dom";
import { pencilOutline, trashOutline, closeOutline, addOutline, refreshOutline } from "ionicons/icons";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import {
  MemberData,
  getAllMembers,
  deleteMember,
  updateMember,
  getTribes,
} from "../firebaseConfig";
import "./MemberList.css";
import { toast } from "../toast";
import { tribes, Tribe, ClubData, getAllClubs } from "../firebaseConfig";
import SearchBar from "../components/SearchBar";
import AddMember from "./AddMember";
import { useHistory } from 'react-router-dom';

const MemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editMemberData, setEditMemberData] = useState<MemberData>({
    id: "",
    name: "",
    birthdate: "",
    residentialAddress: "",
    schoolAddress: "",
    parentGuardianName: "",
    parentGuardianRelationship: "",
    parentGuardianContact: "",
    teacherName: "",
    teacherContact: "",
    teacherClass: "",
    tribeId: "",
    clubId: "",
  });
  const [tribesList, setTribesList] = useState<Tribe[]>([]);
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [searchText, setSearchText] = useState("");
  const location = useLocation();
  const history = useHistory();


  useEffect(() => {
    if (location.state && (location.state as any).refresh) {
      fetchMembers();
    }
  }, [location.state]);

  useEffect(() => {
    fetchMembers();
    fetchTribes();
    fetchClubs();
  }, []);

  const navigateToAddMember = () => {
    history.push(`/add-member/`);
  };

  const fetchMembers = async () => {
    const fetchedMembers = await getAllMembers();
    const validMembers = fetchedMembers.filter(
      (member) => member.name && member.name.trim() !== ""
    );
    const invalidMembers = fetchedMembers.filter(
      (member) => !member.name || member.name.trim() === ""
    );
  
    // Delete invalid members from Firestore
    for (const member of invalidMembers) {
      await deleteMember(member.id);
    }
  
    setMembers(validMembers);
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
    setEditMode(false);
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
  
    const memberId = editMemberData.id;
    const updated = await updateMember(memberId, editMemberData);
    if (updated) {
      // Update the members state directly
      setMembers((prevMembers) =>
        prevMembers.map((member) =>
          member.id === memberId ? { ...member, ...editMemberData } : member
        )
      );
      closeModal();
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

  const formatBirthdate = (birthdate: string): string => {
    const date = new Date(birthdate);
    const day = date.getDate();
    const monthIndex = date.getMonth();
    const year = date.getFullYear();

    // Array of month names
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[monthIndex];

    // Determine the suffix for the day
    let suffix = "th";
    if (day % 10 === 1 && day !== 11) {
      suffix = "st";
    } else if (day % 10 === 2 && day !== 12) {
      suffix = "nd";
    } else if (day % 10 === 3 && day !== 13) {
      suffix = "rd";
    }

    return `${day}${suffix} ${month}, ${year}`;
  };

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleMemberClick = (memberId: string) => {
    history.push(`/member-details/${memberId}`);
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent
        className="ion-padding item-background-color"
        color="background"
      >
        
        <SearchBar 
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search members by name"
          className="search-bar"
        />
        <h5 className="total-members">Total Number of Members: {members.length}</h5>
        <IonList>
          {filteredMembers.map((member, index) => (
            /**<IonCard className="name-cards" key={index} onClick={() => openModal(member)}> **/
            <IonCard className="name-cards" key={member.id} button onClick={() => handleMemberClick(member.id)}>
              <IonCardHeader>
                <IonCardTitle>{member.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel>
                  <p>
                    <b>Birthdate:</b>
                    {` ${formatBirthdate(member.birthdate)}`}
                  </p>
                  <p>
                    <b>Age:</b>
                    {` ${calculateAge(member.birthdate)}`}
                  </p>
                  <p>
                    <b>Club:</b>
                    {` ${
                      clubs.find((club: ClubData) => club.id === member?.clubId)
                        ?.name || ""
                    }`}
                  </p>
                  <p>{`tribe: ${tribes.find((tribe: Tribe) => tribe.id === member?.tribeId)?.name}`}</p>
                </IonLabel>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>

        { /*
        <IonFab vertical="bottom" horizontal="start" slot="fixed">
          <IonFabButton onClick={navigateToAddMember}>
            <IonIcon icon={addOutline} />
          </IonFabButton>
        </IonFab> 
        */}

        <IonFab vertical="bottom" horizontal="end" slot="fixed"  >
          <IonFabButton onClick={fetchMembers} className="fab">
            <IonIcon icon={refreshOutline} color="primary"/>
          </IonFabButton>
        </IonFab>

        {/* Modal to display member details */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={closeModal}
          className="full-screen-modal item-background-color"
        >
          {editMode ? (
            <IonContent fullscreen>
              <MainHeader />
              <IonItem>
                <IonLabel position="stacked">Name</IonLabel>
                <IonInput
                  value={editMemberData.name}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      name: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem className="item-background-color">
                <IonLabel position="stacked">Birthdate</IonLabel>
                <IonDatetime
                  color="success"
                  value={editMemberData.birthdate}
                  onIonChange={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      birthdate: e.detail.value!,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Residential Address</IonLabel>
                <IonInput
                  value={editMemberData.residentialAddress}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      residentialAddress: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">School Address</IonLabel>
                <IonInput
                  value={editMemberData.schoolAddress}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      schoolAddress: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Parent/Guardian Name</IonLabel>
                <IonInput
                  value={editMemberData.parentGuardianName}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      parentGuardianName: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">
                  Parent/Guardian Relationship
                </IonLabel>
                <IonInput
                  value={editMemberData.parentGuardianRelationship}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      parentGuardianRelationship: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Parent/Guardian Contact</IonLabel>
                <IonInput
                  value={editMemberData.parentGuardianContact}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      parentGuardianContact: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teacher Name</IonLabel>
                <IonInput
                  value={editMemberData.teacherName}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      teacherName: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teacher Contact</IonLabel>
                <IonInput
                  value={editMemberData.teacherContact}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      teacherContact: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Teacher Class</IonLabel>
                <IonInput
                  value={editMemberData.teacherClass}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      teacherClass: e.target.value,
                    })
                  }
                />
              </IonItem>
              <IonItem>
                <IonLabel position="stacked">Tribe</IonLabel>
                <IonSelect
                  value={editMemberData.tribeId}
                  onIonChange={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      tribeId: e.target.value,
                    })
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
                  onIonChange={(e) =>
                    setEditMemberData({
                      ...editMemberData,
                      clubId: e.detail.value,
                    })
                  }
                >
                  {clubs.map((club) => (
                    <IonSelectOption key={club.id} value={club.id}>
                      {club.name}
                    </IonSelectOption>
                  ))}
                </IonSelect>
              </IonItem>
              <IonButton
                expand="full"
                color="success"
                onClick={handleEditMember}
              >
                Save
              </IonButton>
              <IonButton
                expand="full"
                color="danger"
                onClick={() => setShowDeleteAlert(true)}
              >
                Delete
              </IonButton>
              <IonButton expand="full" onClick={() => setEditMode(false)}>
                Cancel
              </IonButton>
              <IonButton
                fill="clear"
                color="dark"
                className="close-button"
                onClick={closeModal}
              >
                <IonIcon slot="icon-only" icon={closeOutline} />
              </IonButton>
              <IonAlert
                isOpen={showDeleteAlert}
                onDidDismiss={() => setShowDeleteAlert(false)}
                header={"Delete Member"}
                message={"Are you sure you want to delete this member?"}
                buttons={[
                  {
                    text: "Cancel",
                    role: "cancel",
                  },
                  {
                    text: "Delete",
                    handler: handleDeleteMember,
                  },
                ]}
              />
            </IonContent>
          ) : (
            <IonContent fullscreen>
              <MainHeader />
              {selectedMember && (
                <div>
                  <IonItem>
                    <IonLabel>
                      <h2>Name</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.name}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Birthdate</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{formatBirthdate(selectedMember.birthdate)}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Residential Address</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.residentialAddress}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>School Address</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.schoolAddress}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Parent/Guardian Name</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.parentGuardianName}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Parent/Guardian Relationship</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.parentGuardianRelationship}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Parent/Guardian Contact</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.parentGuardianContact}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Teacher Name</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.teacherName}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Teacher Contact</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.teacherContact}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Teacher Class</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>{selectedMember.teacherClass}</p>
                    </IonLabel>
                  </IonItem>
                  <IonItem>
                  <IonLabel>
                    <h2>Tribe</h2>
                  </IonLabel>
                  <IonLabel>
                    <p>
                      {tribes.find(
                        (tribe: Tribe) => tribe.id === selectedMember?.tribeId
                      )?.name}
                    </p>
                  </IonLabel>
                  </IonItem>
                  <IonItem>
                    <IonLabel>
                      <h2>Club</h2>
                    </IonLabel>
                    <IonLabel>
                      <p>
                        {
                          clubs.find(
                            (club: ClubData) => club.id === selectedMember?.clubId
                          )?.name
                        }
                      </p>
                    </IonLabel>
                  </IonItem>
                  <IonButton
                    expand="full"
                    color="success"
                    onClick={() => setEditMode(true)}
                  >
                    Edit
                    <IonIcon slot="start" icon={pencilOutline} />
                  </IonButton>
                  <IonButton
                    expand="full"
                    color="danger"
                    onClick={() => setShowDeleteAlert(true)}
                  >
                    Delete
                    <IonIcon slot="start" icon={trashOutline} />
                  </IonButton>
                  <IonButton expand="full" onClick={closeModal}>
                    Close
                    <IonIcon slot="start" icon={closeOutline} />
                  </IonButton>
                  <IonAlert
                    isOpen={showDeleteAlert}
                    onDidDismiss={() => setShowDeleteAlert(false)}
                    header={"Delete Member"}
                    message={"Are you sure you want to delete this member?"}
                    buttons={[
                      {
                        text: "Cancel",
                        role: "cancel",
                      },
                      {
                        text: "Delete",
                        handler: handleDeleteMember,
                      },
                    ]}
                  />
                </div>
              )}
            </IonContent>
          )}
        </IonModal>
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default MemberList;
