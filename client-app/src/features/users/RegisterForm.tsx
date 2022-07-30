import { ErrorMessage, Form, Formik } from "formik";
import { observer } from "mobx-react-lite";
import React from "react";
import { Button, Header, Label } from "semantic-ui-react";
import MyTextInput from "../../app/common/form/MyTextInput";
import { Store } from "../../app/store/store";
import * as Yup from 'yup'
import ValidationErrors from "../errors/ValidationErrors";
export default observer(function RegisterForm(){
    const {userStore}=Store();
    return (
        <Formik initialValues={{email:'',displayName:'',username:'',password:'',error:null}}
        validationSchema={Yup.object({
            email:Yup.string().required().email(),
            displayName:Yup.string().required(),
            username:Yup.string().required(),
            password:Yup.string().required(),
        })}
        onSubmit={(values,{setErrors})=>{userStore.register(values).catch(error=>{setErrors({error});
        console.log(error)})}}>
            {({handleSubmit,isSubmitting,dirty,isValid,errors})=>(
                <Form className='ui form error' onSubmit={handleSubmit} autoComplete='off'>
                <Header as='h2' content='Register to Reactivites' color='teal' textAlign='center' />
                <MyTextInput name='displayName' placeholder='DisplayName' />
                <MyTextInput name='username' placeholder='Username' />
                <MyTextInput name='email' placeholder='Email' />
                <MyTextInput name='password' placeholder='Password' type='password' />
                <ErrorMessage 
                        name='error' render={() => 
                        <ValidationErrors errors={errors.error}/>}
                    />
                <Button disabled={!dirty||!isValid} positive content='Register' type='submit' fluid />
                </Form>
            )}
        </Formik>
    )
})