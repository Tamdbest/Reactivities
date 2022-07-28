import { observer } from "mobx-react-lite";
import React, { Fragment, SyntheticEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Header, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Store } from "../../../app/store/store";
import ActivityListItem from "./ActivityListItem";
// interface Props{
//     //submitting:boolean,
//     //deleteActivity:(id:string)=>void,
//     //activities:Activity[],
//     //selectActivity:(id:string)=>void;
// }
export default observer(function ActivityList(){
    const {activityStore}=Store();
    const {groupedActivities}=activityStore;
    return(
        <>
            {groupedActivities.map(([group, activities]) => (
                <Fragment key={group}>
                    <Header sub color='teal'>
                        {group}
                    </Header>
                    {activities.map(activity => (
                        <ActivityListItem key={activity.id} activity={activity} />
                    ))}
                </Fragment>
            ))}
        </>
    )
})