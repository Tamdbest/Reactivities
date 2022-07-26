import React from "react";
import { Grid, List } from "semantic-ui-react";
import { VoidExpression } from "typescript";
import { Activity } from "../../../app/models/activity";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityList from "./ActivityList";

interface Props{
    submitting:boolean,
    loading:boolean,
    deleteActivity:(id:string)=>void,
    createOrEdit:(activity:Activity)=>void,
    activities:Activity[],
    selectedActivity:Activity|undefined,
    selectActivity:(id:string)=>void,
    cancelSelection:()=>void,
    editMode:boolean,
    openForm:(id:string)=>void,
    closeForm:()=>void;
}
export default function ActivityDashboard({submitting,deleteActivity,createOrEdit,activities,selectedActivity,selectActivity,cancelSelection,editMode,openForm,closeForm}:Props){
    return(
        <>
            <Grid>
                <Grid.Column width='10'>
                <ActivityList submitting={submitting} deleteActivity={deleteActivity} activities={activities} selectActivity={selectActivity}/>
                </Grid.Column>
                <Grid.Column width='6'>
                {selectedActivity&&!editMode&&<ActivityDetails activity={selectedActivity} cancelSelection={cancelSelection} openForm={openForm}/>}
                {editMode&&<ActivityForm submitting={submitting} createOrEdit={createOrEdit} closeForm={closeForm} selectedActivity={selectedActivity}/>}
                </Grid.Column>
            </Grid>
        </>
    )
}