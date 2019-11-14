import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from 'react-router-dom'

import Header from './Header'
import useAuth from '../components/Auth/useAuth'
// import FirebaseContext from '../firebase/context'
import firebase, { FirebaseContext } from '../firebase'

import Login from '../components/Auth/Login'
import ForgotPassword from '../components/Auth/ForgotPassword'
import CreateLink from '../components/Link/CreateLink'
import SearchLinks from '../components/Link/SearchLinks'
import LinkList from '../components/Link/LinkList'
import LinkDetail from '../components/Link/LinkDetail'

function App() {
  const user = useAuth()

  return (
    <BrowserRouter>
      <FirebaseContext.Provider value={{user, firebase}}>
        <div className="app-container">
          <Header />
          <div className="route-container">
            <Switch>
              <Route path="/" exact render={() => <Redirect to="/new/1" />} />
              <Route path="/create" component={CreateLink} />
              <Route path="/login" component={Login} />
              <Route path="/forgot" component={ForgotPassword} />
              <Route path="/search" component={SearchLinks} />
              <Route path="/top" component={LinkList} />
              <Route path="/new/:page" component={LinkList} />
              <Route path="/link/:linkId" component={LinkDetail} />
            </Switch>
          </div>
        </div>
      </FirebaseContext.Provider>
    </BrowserRouter>
  );
}

export default App;
