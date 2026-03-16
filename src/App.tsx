import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet, IonTabBar, IonTabButton, IonLabel, setupIonicReact, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

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

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import '@ionic/react/css/palettes/dark.system.css';

/* Theme variables */
import './theme/variables.css';
import Routines from './pages/Routines';
import Workouts from './pages/Workouts';
import Exercises from './pages/Exercises';
import { useEffect } from 'react';
import { initDatabase } from './db';

setupIonicReact();

const App: React.FC = () => {
  useEffect(() => {
    const init = async () => {
      try {
        await initDatabase();
      } catch (err) {
        console.error("Database init error:", err);
      }
    };

    init();
  }, []);

  return <IonApp>
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/workouts">
            <Workouts />
          </Route>

          <Route exact path="/routines">
            <Routines />
          </Route>

          <Route exact path="/exercises">
            <Exercises />
          </Route>

          <Route exact path="/">
            <Redirect to="/workouts" />
          </Route>

        </IonRouterOutlet>

        <IonTabBar slot="bottom">
          <IonTabButton tab="workouts" href="/workouts">
            <IonLabel>Workouts</IonLabel>
          </IonTabButton>

          <IonTabButton tab="routines" href="/routines">
            <IonLabel>Routines</IonLabel>
          </IonTabButton>

          <IonTabButton tab="exercises" href="/exercises">
            <IonLabel>Exercises</IonLabel>
          </IonTabButton>
        </IonTabBar>

      </IonTabs>
    </IonReactRouter>
  </IonApp>
};

export default App;
