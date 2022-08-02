import { v4 as uuid } from "uuid";
import { observer } from "mobx-react-lite";
import React, { ChangeEvent, useEffect, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { Button, Header, Segment } from "semantic-ui-react";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity, ActivityFormValues } from "../../../app/models/activity";
import { Store } from "../../../app/store/store";
import { Formik ,Form} from "formik";
import * as Yup from 'yup'
import MyTextInput from "../../../app/common/form/MyTextInput";
import MyTextArea from "../../../app/common/form/MyTextArea";
import MySelectInput from "../../../app/common/form/MySelectInput";
import { categoryOptions } from "../../../app/common/options/categoryOptions";
import MyDateInput from "../../../app/common/form/MyDateInput";
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
    const[activity,SetActivity]=useState<ActivityFormValues>(new ActivityFormValues());

    const validationSchema=Yup.object({
        title:Yup.string().required('The activity title is requird'),
        description:Yup.string().required('The description title is requird'),
        category:Yup.string().required('The category title is requird'),
        date:Yup.string().required('The date title is requird').nullable(),
        city:Yup.string().required('The city title is requird'),
        venue:Yup.string().required('The venue title is requird'),
    });
    // if(activityStore.selectedActivity!=undefined){
    //     initialState=activityStore.selectedActivity;
    // }
    //const[activity,SetActivity]=useState(initialState);
    useEffect(() => {
        if(id){
            activityStore.loadActivity(id).then((activity)=>{
                SetActivity(new ActivityFormValues(activity));
            });   
        } 
    }, [id,activityStore.loadActivity])
    
    // var handleChange=(event:ChangeEvent<HTMLInputElement|HTMLTextAreaElement>)=>{
    //     const {value,name}=event.target;
    //     SetActivity({...activity,[name]:value});
    // }

    var handleFormSubmit=(activity:ActivityFormValues)=>{
        if(!activity.id){
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
            <Header content='Activity Details' sub color="teal"/>
            <Formik validationSchema={validationSchema} enableReinitialize initialValues={activity} onSubmit={(activity)=>handleFormSubmit(activity)}>
            {({handleSubmit,isSubmitting,dirty,isValid})=>(
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                <MyTextInput placeholder='Title'  name='title' />
                <MyTextArea rows={3} placeholder='Description'  name='description' />
                <MySelectInput options={categoryOptions} placeholder='Category'  name='category' />
                <MyDateInput 
                            placeholderText='Date'  
                            name='date' 
                            showTimeSelect
                            timeCaption='time'
                            dateFormat='MMMM d, yyyy h:mm aa'
                        />
                <Header content='Location Details' sub color="teal"/>
                <MyTextInput placeholder='City'  name='city' />
                <MyTextInput placeholder='Venue'  name='venue' />
                <Button 
                disabled={isSubmitting||!dirty||!isValid}
                loading={activityStore.submitting} floated="right" positive type="submit" content="Submit"/>
                <Button as={Link} to='/activities' floated="right" type="button" content="Cancel"/>
            </Form>
            )}
            </Formik>
        </Segment>
    )
})