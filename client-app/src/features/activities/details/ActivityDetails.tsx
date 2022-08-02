import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { Button, Card, Grid, Icon, Image } from "semantic-ui-react";
import { VoidExpression } from "typescript";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { Store } from "../../../app/store/store";
import ActivityDetailedChat from "./ActivityDetailedChat";
import ActivityDetailedHeader from "./ActivityDetailedHeader";
import ActivityDetailedInfo from "./ActivityDetailedInfo";
import ActivityDetailedSidebar from "./ActivityDetailedSidebar";
// interface Props{
//     //activity:Activity,
//     //cancelSelection:()=>void,
//     //openForm:(id:string)=>void;
// }
export default observer(function ActivityDetails(){
  const {activityStore}=Store();
  const {selectedActivity,loadActivity,loading}=activityStore;
  const {id}=useParams<{id:string}>();
  useEffect(() => {
    if(id)
      loadActivity(id);
  }, [id,loadActivity])
  
  if(!selectedActivity||loading) return <LoadingComponent/>
    return(
      <Grid>
      <Grid.Column width={10}>
          <ActivityDetailedHeader activity={selectedActivity} />
          <ActivityDetailedInfo activity={selectedActivity} />
          <ActivityDetailedChat />
      </Grid.Column>
      <Grid.Column width={6}>
          <ActivityDetailedSidebar activity={selectedActivity}/>
      </Grid.Column>
  </Grid>
    )
})