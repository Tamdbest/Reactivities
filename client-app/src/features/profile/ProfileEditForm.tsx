import { Formik } from "formik";
import { observer } from "mobx-react-lite";
import React, { useState } from "react";
import { Button, Form, Header, Segment } from "semantic-ui-react";
import MyTextArea from "../../app/common/form/MyTextArea";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Store } from "../../app/store/store";
import * as Yup from 'yup';
import { isYieldExpression } from "typescript";
import LoadingComponent from "../../app/layout/LoadingComponent";
interface Props{
    editMode:(flag:boolean)=>void;
}
export default observer(function ProfileEditForm({editMode}:Props){
    const {profileStore}=Store();
    return(
        <Segment clearing>
            <Header content='Change Displayname' sub color="teal"/>
            <Formik initialValues={{username:profileStore.profile?.username,displayName:profileStore.profile?.displayName,bio:profileStore.profile?.bio}} validationSchema={Yup.object({
                displayName:Yup.string().required(),
                bio:Yup.string()
            })} onSubmit={(obj)=>{profileStore.updateProfile(obj).then(()=>editMode(false))}}>
            {({handleSubmit,isSubmitting,dirty,isValid})=>(
                <Form className='ui form' onSubmit={handleSubmit} autoComplete='off'>
                <MyTextInput placeholder='DisplayName'  name='displayName' />
                <Header content='Change Bio' sub color="teal"/>
                <MyTextArea rows={10} placeholder='Bio' name='bio' />
                <Button 
                disabled={isSubmitting||!dirty||!isValid}
                loading={isSubmitting} floated="right" positive type="submit" content="Update"/>
                {/* <Button as={Link} to='/activities' floated="right" type="button" content="Cancel"/> */}
            </Form>
            )}
            </Formik>
        </Segment>
    )
})