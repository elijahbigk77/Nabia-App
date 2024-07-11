import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import AddMember from './pages/AddMember';
import MemberList from './pages/MemberList';
import TribeList from './pages/TribeList';
import TribeMemberList from './pages/TribeMemberList';
import ClubPage from './pages/ClubPage';
import ClubMemberList from './pages/ClubMemberList';
import ClubMembersAttendance from './pages/ClubMembersAttendance'; // Import the new page

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import ClubAttendanceList from './pages/ClubAttendanceList';

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/home">
          <Home />
        </Route>
        <Route exact path="/">
          <Redirect to="/home" />
        </Route>
        <Route exact path="/login">
          <Login />
        </Route>
        <Route exact path="/register">
          <Register />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
        <Route exact path="/add-member">
          <AddMember />
        </Route>
        <Route exact path="/member-list">
          <MemberList />
        </Route>
        <Route exact path="/tribe-list">
          <TribeList />
        </Route>
        <Route exact path="/tribe-member-list/:tribeId">
          <TribeMemberList />
        </Route>
        <Route exact path="/club-page">
          <ClubPage />
        </Route>
        <Route exact path="/club-member-list/:clubId">
          <ClubMemberList />
        </Route>
        <Route exact path="/club-members-attendance">
          <ClubMembersAttendance />
        </Route>
        <Route exact path="/club-attendance-list/:clubId">
          <ClubAttendanceList />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
