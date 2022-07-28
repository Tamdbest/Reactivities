import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Form, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { Store } from "../../../app/store/store";
// interface Props{
//     submitting:boolean,
//     createOrEdit:(activity:Activity)=>void,
//     //selectedActivity:Activity|undefined,
//     closeForm:()=>void;
// }
export default observer(function ActivityForm(){
    const history=useHistory();
    const {activityStore}=Store();
    const {id}=useParams<{id:string}>();
    const[activity,SetActivity]=useState({id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''});
    // if(activityStore.selectedActivity!=undefined){
    //     initialState=activityStore.selectedActivity;
    // }
    //const[activity,SetActivity]=useState(initialState);
    useEffect(() => {
        if(id){
            activityStore.loadActivity(id).then((res)=>{
                SetActivity(res!);
            });   
        } 
    }, [id,activityStore.loadActivity])
    
    var handleChange=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {value,name}=event.target;
        SetActivity({...activity,[name]:value});
    }

    var handleSubmit=()=>{
        if(activity.id.length===0){
            let newActivity={...activity,id:uuid()};
            activityStore.createActivity(newActivity).then(()=>{
                history.push(`/activities/${newActivity.id}`);
            });
        }
        else{
            activityStore.editActivity(activity).then(()=>{
                history.push(`/activities/${activity.id}`);
            });
        }
    }
    if(id&&activityStore.loading)
        return <LoadingComponent/>
    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleChange}/>
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleChange}/>
                <Form.Input type="date" placeholder='Date' value={activity.date} name='date' onChange={handleChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleChange}/>
                <Button loading={activityStore.submitting} floated="right" positive type="submit" content="Submit"/>
                <Button as={Link} to='/activities' floated="right" type="button" content="Cancel"/>
            </Form>
        </Segment>
    )
})