import React, { useState,useEffect } from 'react';
// import { useEffect } from 'react';
import './styles.css'
import axios from 'axios';
import '../models/activity'
import { Container, Header, List } from 'semantic-ui-react';
import { Activity } from '../models/activity';
import NavBar from './Navbar';
import ActivityDashboard from '../../features/activities/dashboard/ActivityDashboard';
import {v4 as uuid} from 'uuid';
import agent from '../api/agent';
import LoadingComponent from './LoadingComponent';
import { Store } from '../store/store';
import { observer } from 'mobx-react-lite';
import { Route, Switch, useLocation } from 'react-router-dom';
import HomePage from '../../features/home/HomePage';
import ActivityDetails from '../../features/activities/details/ActivityDetails';
import ActivityForm from '../../features/activities/form/ActivityForm';
import TestErrors from '../../features/errors/TestError';
import { ToastContainer } from 'react-toastify';
import NotFound from '../../features/errors/NotFound';
import ServerError from '../../features/errors/ServerError';
import LoginForm from '../../features/users/LoginForm';
import ModalContainer from '../common/modals/ModalContainer';
function App() {
  const {commonStore,userStore}=Store();
  const location=useLocation();
  // const [activities,SetActivities]=useState<Activity[]>([]);
  // const [selectedActivity,setSelectedActivity]=useState<Activity|undefined>(undefined);
  // const [loading,setLoading]=useState(true);
  // const [editMode,setEditMode]=useState(false);
  // const [submitting,setSubmitting]=useState(false);
  // const handleFormOpen=(id?:string)=>{
  //   id?selectActivity(id):cancelSelection();
  //   setEditMode(true);
  // }

  // const handleFormClose=()=>{
  //   setEditMode(false);
  // }

  // const selectActivity=(id?:string)=>{
  //   setSelectedActivity(activities.find(x=>x.id===id));
  // }
  // const cancelSelection=()=>{
  //   setSelectedActivity(undefined);
  // }
  // const createorEditActivity=(activity:Activity)=>{
  //     setSubmitting(true);
  //     if(!activity.id){
  //       activity.id=uuid()
  //       agent.Activities.create(activity).then(()=>{
  //         SetActivities([...activities,activity]);
  //         setEditMode(false);
  //       setSelectedActivity(activity);
  //       setSubmitting(false);
  //       })
  //     }
  //     else{
  //       agent.Activities.update(activity).then(()=>{
  //         SetActivities([...activities.filter(x=>x.id!==activity.id),activity]);
  //         setEditMode(false);
  //       setSelectedActivity(activity);
  //       setSubmitting(false);
  //       })
  //     }
  // }
  // const deleteActivity=(id:string)=>{
  //   setSubmitting(true);
  //   agent.Activities.delete(id).then(()=>{
  //     SetActivities([...activities.filter(x=>x.id!==id)]);
  //     setSubmitting(false);
  //   })
  // }
  useEffect(() => {
    var token=commonStore.token;
    if(token){
      userStore.getLoggedInUser().finally(()=>{
        commonStore.setAppLoaded();
      })
    }
    else{
      commonStore.setAppLoaded();
    }
  }, [commonStore,userStore])
  
  if(!commonStore.apploaded) return <LoadingComponent/>
  return (
    <>
      <ToastContainer position='bottom-right' hideProgressBar/>
      <ModalContainer/>
      <Route exact path='/' component={HomePage}/>
      <Route path='/(.+)' render={()=>(
        <>
        <NavBar/>
        <Container style={{marginTop:'7em'}}>
          <Switch>
            <Route exact path='/' component={HomePage}/> 
            <Route exact path='/activities' component={ActivityDashboard}/>
            <Route exact path='/activities/:id' component={ActivityDetails}/>
            <Route key={location.key} exact path={['/create','/manage/:id']} component={ActivityForm}/>
            <Route exact path='/errors' component={TestErrors}/>
            <Route exact path='/server-error' component={ServerError}/>
            <Route exact path='/login' component={LoginForm}/>
            <Route component={NotFound}/>
          </Switch>
        </Container> 
        </>
      )}/>
    </>
  );
}

export default observer(App);
