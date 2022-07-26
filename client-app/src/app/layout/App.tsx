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
function App() {
  const [activities,SetActivities]=useState<Activity[]>([]);
  const [selectedActivity,setSelectedActivity]=useState<Activity|undefined>(undefined);
  const [loading,setLoading]=useState(true);
  const [editMode,setEditMode]=useState(false);
  const [submitting,setSubmitting]=useState(false);
  const handleFormOpen=(id?:string)=>{
    id?selectActivity(id):cancelSelection();
    setEditMode(true);
  }

  const handleFormClose=()=>{
    setEditMode(false);
  }

  const selectActivity=(id?:string)=>{
    setSelectedActivity(activities.find(x=>x.id===id));
  }
  const cancelSelection=()=>{
    setSelectedActivity(undefined);
  }
  const createorEditActivity=(activity:Activity)=>{
      setSubmitting(true);
      if(!activity.id){
        activity.id=uuid()
        agent.Activities.create(activity).then(()=>{
          SetActivities([...activities,activity]);
          setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
        })
      }
      else{
        agent.Activities.update(activity).then(()=>{
          SetActivities([...activities.filter(x=>x.id!==activity.id),activity]);
          setEditMode(false);
        setSelectedActivity(activity);
        setSubmitting(false);
        })
      }
  }
  const deleteActivity=(id:string)=>{
    setSubmitting(true);
    agent.Activities.delete(id).then(()=>{
      SetActivities([...activities.filter(x=>x.id!==id)]);
      setSubmitting(false);
    })
  }
  useEffect(() => {
    agent.Activities.list().then(response=>{
      let activities:Activity[]=[];
      response.forEach(x=>{
        x.date=x.date.split('T')[0];
        activities.push(x);
      });
      SetActivities(activities);
      setLoading(false);
    })
  }, [])
  if(loading) return <LoadingComponent/>
  return (
    <>
      <NavBar openForm={handleFormOpen}/>
      <Container style={{marginTop:'7em'}}>
          <ActivityDashboard createOrEdit={createorEditActivity} activities={activities} selectedActivity={selectedActivity} selectActivity={selectActivity} cancelSelection={cancelSelection}
          editMode={editMode} openForm={handleFormOpen} closeForm={handleFormClose}
          deleteActivity={deleteActivity} loading={loading} submitting={submitting}/>
      </Container> 
    </>
  );
}

export default App;
