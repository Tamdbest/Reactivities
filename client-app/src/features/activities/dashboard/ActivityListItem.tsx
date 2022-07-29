import React, { SyntheticEvent, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { Button, Icon, Item, Label, Segment } from "semantic-ui-react";
import { Activity } from "../../../app/models/activity";
import { Store } from "../../../app/store/store";
import { format } from 'date-fns';
interface Props{
    activity:Activity;
}
export default function ActivityListItem({activity}:Props){
    const {activityStore}=Store();
    const[target,setTarget]=useState('');
    const history=useHistory();

    const handleClick=(e:SyntheticEvent<HTMLButtonElement>)=>{
        setTarget(e.currentTarget.name);
        activityStore.deleteActivity(e.currentTarget.name);
    }
    return(
        <Segment.Group>
            <Segment>
                <Item.Group>
                    <Item>
                        <Item.Image size='tiny' circular src='/assets/user.png' />
                        <Item.Content>
                            <Item.Header as={Link} to={`/activities/${activity.id}`}>
                                {activity.title}
                            </Item.Header>
                            <Item.Description>Hosted by Bob</Item.Description>
                        </Item.Content>
                    </Item>
                </Item.Group>
            </Segment>
            <Segment>
                <span>
                    <Icon name='clock' /> {format(activity.date!,'dd MMM yyyy')}
                    <Icon name='marker' /> {activity.venue}
                </span>
            </Segment>
            <Segment secondary>
                Attendees go here
            </Segment>
            <Segment clearing>
                <span>{activity.description}</span>
                <Button 
                    as={Link}
                    to={`/activities/${activity.id}`}
                    color='teal'
                    floated='right'
                    content='View'
                />
            </Segment>
        </Segment.Group>
    )

}