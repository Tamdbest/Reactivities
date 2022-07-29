import { Field, useField } from "formik";
import { METHODS } from "http";
import React from "react";
import { Form, Label } from "semantic-ui-react";
import DatePicker,{ReactDatePickerProps} from 'react-datepicker';
interface Props{
    placeholder:string,
    name:string,
    label?:string
}
export default function MyDateInput(props:Partial<ReactDatePickerProps>){
    const [field,meta,helpers]=useField(props.name!);
    return (
    <Form.Field error={meta.touched&&!!meta.error}>
        <DatePicker
        {...field}
        {...props}
        selected={(field.value&&new Date(field.value))||null}
        onChange={val=>helpers.setValue(val)}
        />
        {meta.touched && meta.error ? (
         <Label basic color="red">{meta.error}</Label>
       ) : null}
    </Form.Field>
    )
}