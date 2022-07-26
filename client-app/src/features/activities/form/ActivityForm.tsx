import React, { ChangeEvent, useState } from "react";
import { Button, Form, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
interface Props{
    submitting:boolean,
    createOrEdit:(activity:Activity)=>void,
    selectedActivity:Activity|undefined,
    closeForm:()=>void;
}
export default function ActivityForm({submitting,createOrEdit,selectedActivity,closeForm}:Props){

    let initialState={id: '',
        title: '',
        date: '',
        description: '',
        category: '',
        city: '',
        venue: ''} 
    if(selectedActivity!=undefined){
        initialState=selectedActivity;
    }
    const[activity,SetActivity]=useState(initialState);

    var handleChange=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
        const {value,name}=event.target;
        SetActivity({...activity,[name]:value});
    }

    var handleSubmit=()=>{
        createOrEdit(activity);
    }

    return(
        <Segment clearing>
            <Form onSubmit={handleSubmit} autoComplete='off'>
                <Form.Input placeholder='Title' value={activity.title} name='title' onChange={handleChange}/>
                <Form.TextArea placeholder='Description' value={activity.description} name='description' onChange={handleChange}/>
                <Form.Input placeholder='Category' value={activity.category} name='category' onChange={handleChange}/>
                <Form.Input type="date" placeholder='Date' value={activity.date} name='date' onChange={handleChange}/>
                <Form.Input placeholder='City' value={activity.city} name='city' onChange={handleChange}/>
                <Form.Input placeholder='Venue' value={activity.venue} name='venue' onChange={handleChange}/>
                <Button loading={submitting} floated="right" positive type="submit" content="Submit"/>
                <Button onClick={closeForm} floated="right" type="button" content="Cancel"/>
            </Form>
        </Segment>
    )
}