// ClubMemberList.tsx

import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonModal,
  IonButton,
  IonIcon,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonAlert,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonButtons,
} from "@ionic/react";
import MainHeader from "../components/MainHeader";
import MainFooter from "../components/MainFooter";
import SearchBar from "../components/SearchBar";
import {
  getMembersByClubId,
  MemberData,
  updateMember,
  deleteMember,
  Tribe,
  tribes,
  ClubData,
  getTribes,
  getAllClubs,
} from "../firebaseConfig";
import { useParams } from "react-router-dom";
import { pencilOutline, trashOutline } from "ionicons/icons";
import { toast } from "../toast";
import './ClubMembeList.css'
import { useHistory } from 'react-router-dom';

interface RouteParams {
  clubId: string;
}

const ClubMemberList: React.FC = () => {
  const [members, setMembers] = useState<MemberData[]>([]);
  const [selectedMember, setSelectedMember] = useState<MemberData | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const history = useHistory();
  const [searchText, setSearchText] = useState("");
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

  const { clubId } = useParams<RouteParams>();
  const [clubs, setClubs] = useState<ClubData[]>([]);
  const [tribesList, setTribesList] = useState<Tribe[]>([]);

  const filteredMembers = members.filter((member) =>
    member.name.toLowerCase().includes(searchText.toLowerCase())
  );

  useEffect(() => {
    fetchTribes();
    fetchClubs();
    fetchMembers(clubId);
  }, [clubId]);

  useEffect(() => {
    fetchMembers(clubId);
  }, [searchText]);

  const fetchMembers = async (clubId: string) => {
    const fetchedMembers = await getMembersByClubId(clubId);
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
        fetchMembers(clubId); // Refresh member list after update
        closeModal();
      }
    }
  };

  const handleDeleteMember = async () => {
    if (selectedMember) {
      const memberId = selectedMember.id;
      const deleted = await deleteMember(memberId);
      if (deleted) {
        fetchMembers(clubId); // Refresh member list after delete
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

    // Suffix for day (e.g., 1st, 2nd, 3rd, 4th)
    const suffixes = ["th", "st", "nd", "rd"];
    const suffix = suffixes[day % 10] || "th";

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

    return `${day}${suffix} ${month}, ${year}`;
  };

  // Find the selected club's name
  const selectedClubName = clubs.find((club) => club.id === clubId)?.name || "";

  const handleMemberClick = (memberId: string) => {
    history.push(`/member-details/${memberId}`);
  };

  return (
    <IonPage>
      <MainHeader />
      <IonContent
        fullscreen
        className="ion-padding item-background-color"
        color="background"
      >
        <SearchBar 
          searchText={searchText}
          setSearchText={setSearchText}
          placeholder="Search members by name"
          className="search-bar"
        />
        <IonButtons>
          <IonButton>
            <h2>Members of {selectedClubName}</h2>
          </IonButton>
        </IonButtons>
        <h4 className="total-members">Number of Members : {members.length}</h4>
        <IonList>
          {filteredMembers.map((member, index) => (
            <IonCard className="name-cards" key={member.id} button onClick={() => handleMemberClick(member.id)}>
              <IonCardHeader>
                <IonCardTitle>{member.name}</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <p>{`Birthdate: ${formatBirthdate(member.birthdate)}`}</p>
                <p>{`Age: ${calculateAge(member.birthdate)}`}</p>
                <p>{`tribe: ${tribes.find((tribe: Tribe) => tribe.id === member?.tribeId)?.name}`}</p>
              </IonCardContent>
            </IonCard>
          ))}
        </IonList>
        
        {/* Member Details Modal */}
        <IonModal
          isOpen={showModal}
          onDidDismiss={closeModal}
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
              <IonItem>
                <IonLabel position="stacked">Birthdate</IonLabel>
                <IonInput
                  type="date"
                  value={editMemberData.birthdate}
                  onIonInput={(e: any) =>
                    setEditMemberData({
                      ...editMemberData,
                      birthdate: e.target.value,
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
                  onIonChange={(e) =>
                    setEditMemberData({
                      ...editMemberData,
                      tribeId: e.detail.value,
                    })
                  }
                >
                  {tribesList.map((tribe) => (
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
              <IonButton expand="block" onClick={handleEditMember}>
                Save Changes
              </IonButton>
              <IonButton expand="block" color="light" onClick={closeModal}>
                Cancel
              </IonButton>
            </IonContent>
          ) : (
            <IonContent>
              <IonCard>
                <IonCardHeader>
                  <IonCardTitle>{selectedMember?.name}</IonCardTitle>
                </IonCardHeader>
                <IonCardContent>
                  <p>{`Birthdate: ${formatBirthdate(
                    selectedMember?.birthdate || ""
                  )}`}</p>
                  <p>{`Age: ${calculateAge(
                    selectedMember?.birthdate || ""
                  )}`}</p>
                  <p>{`Residential Address: ${selectedMember?.residentialAddress}`}</p>
                  <p>{`School Address: ${selectedMember?.schoolAddress}`}</p>
                  <p>{`Parent/Guardian Name: ${selectedMember?.parentGuardianName}`}</p>
                  <p>{`Parent/Guardian Relationship: ${selectedMember?.parentGuardianRelationship}`}</p>
                  <p>{`Parent/Guardian Contact: ${selectedMember?.parentGuardianContact}`}</p>
                  <p>{`Teacher Name: ${selectedMember?.teacherName}`}</p>
                  <p>{`Teacher Contact: ${selectedMember?.teacherContact}`}</p>
                  <p>{`Teacher Class: ${selectedMember?.teacherClass}`}</p>
                  <p>{`Tribe: ${
                    tribes.find(
                      (tribe: Tribe) => tribe.id === selectedMember?.tribeId
                    )?.name || ""
                  }`}</p>
                  <p>{`Club: ${
                    clubs.find(
                      (club: ClubData) => club.id === selectedMember?.clubId
                    )?.name || ""
                  }`}</p>
                </IonCardContent>
                <IonButton
                  expand="block"
                  onClick={() => setEditMode(true)}
                >
                  Edit
                </IonButton>
                <IonButton
                  expand="block"
                  color="danger"
                  onClick={() => setShowDeleteAlert(true)}
                >
                  Delete
                </IonButton>
                <IonButton expand="block" color="light" onClick={closeModal}>
                  Close
                </IonButton>
              </IonCard>
            </IonContent>
          )}
        </IonModal>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={"Confirm Delete"}
          message={"Are you sure you want to delete this member?"}
          buttons={[
            {
              text: "Cancel",
              role: "cancel",
              cssClass: "secondary",
            },
            {
              text: "Delete",
              handler: handleDeleteMember,
            },
          ]}
        />
      </IonContent>
      <MainFooter />
    </IonPage>
  );
};

export default ClubMemberList;
