import React, { useState } from 'react';
import {Button, Header, Segment} from "semantic-ui-react";
import axios from 'axios';
import ValidationErrors from './ValidationErrors';

export default function TestErrors() {
    //const baseUrl = 'http://localhost:5000/api/'

    function handleNotFound() {
        axios.get('/buggy/not-found').catch(err => console.log(err.response));
    }

    function handleBadRequest() {
        axios.get('buggy/bad-request').catch(err => console.log(err.response));
    }

    function handleServerError() {
        axios.get('buggy/server-error').catch(err => console.log(err.response));
    }

    function handleUnauthorised() {
        axios.get('buggy/unauthorised').catch(err => console.log(err.response));
    }

    function handleBadGuid() {
        axios.get('activities/notaguid').catch(err => console.log(err));
    }

    function handleValidationError() {
        axios.post('activities', {}).catch(err => setErrors(err));
    }
    const [errors,setErrors]=useState<string[]>([]);
    return (
        <>
            <Header as='h1' content='Test Error component' />
            <Segment>
                <Button.Group widths='7'>
                    <Button onClick={handleNotFound} content='Not Found' basic primary />
                    <Button onClick={handleBadRequest} content='Bad Request' basic primary />
                    <Button onClick={handleValidationError} content='Validation Error' basic primary />
                    <Button onClick={handleServerError} content='Server Error' basic primary />
                    <Button onClick={handleUnauthorised} content='Unauthorised' basic primary />
                    <Button onClick={handleBadGuid} content='Bad Guid' basic primary />
                </Button.Group>
            </Segment>
            {errors&&<ValidationErrors errors={errors}/>}
        </>
    )
}

