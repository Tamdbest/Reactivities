import React from "react";
import { NavLink } from "react-router-dom";
import { Button, Container, Menu, MenuItem } from "semantic-ui-react";
import { Store } from "../store/store";
// interface Props{
//     openForm:()=>void;
// }
export default function NavBar(){
    const{activityStore}=Store();
    return(
        <Menu inverted fixed="top">
            <Container>
                <Menu.Item exact as={NavLink} to='/' header>
                    <img src="/assets/logo.png" alt="logo" style={{marginRight:'10px'}}/>
                    Reactivities
                </Menu.Item>
                <Menu.Item as={NavLink} to='/activities' name="Activities"/>
                <Menu.Item as={NavLink} to='/errors' name='Errors' />
                <Menu.Item>
                    <Button as={NavLink} to='/create' positive content='Create Activity'/>
                </Menu.Item>
            </Container>
        </Menu>
    )
}