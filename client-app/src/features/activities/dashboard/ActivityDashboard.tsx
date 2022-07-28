import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Grid, List } from "semantic-ui-react";
import { VoidExpression } from "typescript";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { Store } from "../../../app/store/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";

// interface Props{
//     submitting:boolean,
//     loading:boolean,
//     deleteActivity:(id:string)=>void,
//     createOrEdit:(activity:Activity)=>void,
//     activities:Activity[],
//     selectedActivity:Activity|undefined,
//     selectActivity:(id:string)=>void,
//     cancelSelection:()=>void,
//     editMode:boolean,
//     openForm:(id:string)=>void,
//     closeForm:()=>void;
// }

export default observer(function ActivityDashboard(){
    const {activityStore}=Store();
    useEffect(() => {
        if(activityStore.activityRegistry.size<=1)
            activityStore.getActivities();
    }, [activityStore.activityRegistry.size,activityStore.getActivities])

    if(activityStore.loading) return <LoadingComponent/>
    return(
        <>
            <Grid>
                <Grid.Column width='10'>
                <ActivityList/>
                </Grid.Column>
                <Grid.Column width='6'>
                    <ActivityFilters/>
                </Grid.Column>
                {/* {activityStore.selectedActivity&&!activityStore.editMode&&<ActivityDetails/>} */}
                {/* {activityStore.editMode&&<ActivityForm/>} */}
                {/* </Grid.Column> */}
            </Grid>
        </>
    )
})