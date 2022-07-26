import React, { SyntheticEvent, useState } from "react";
import { Button, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
interface Props{
    submitting:boolean,
    deleteActivity:(id:string)=>void,
    activities:Activity[],
    selectActivity:(id:string)=>void;
}
export default function ActivityList({submitting,deleteActivity,activities,selectActivity}:Props){
    const[target,setTarget]=useState('');

    const handleClick=(e:SyntheticEvent<HTMLButtonElement>)=>{
        setTarget(e.currentTarget.name);
        deleteActivity(e.currentTarget.name);
    }
    return(
        <Segment>
            <Item.Group divided>
                {activities.map(activity=>(
                    <Item key={activity.id}>
                        <Item.Header as='a'>{activity.title}</Item.Header>
                        <Item.Meta>{activity.date}</Item.Meta>
                        <Item.Description>
                            <div>{activity.description}</div>
                            <div>{activity.city} , {activity.venue}</div>
                        </Item.Description>
                        <Item.Extra>
                            <Button onClick={()=>selectActivity(activity.id)} floated="right" content='View' color="blue"/>
                            <Button name={activity.id} loading={submitting&&target===activity.id} onClick={(e)=>handleClick(e)} floated="right" content='Delete' color="red"/>
                            <Label basic content={activity.category}/>
                        </Item.Extra>
                    </Item>
                ))}
            </Item.Group>
        </Segment>
    )
}