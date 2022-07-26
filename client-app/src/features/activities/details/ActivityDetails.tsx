import React from "react";
import { Button, Card, Icon, Image } from "semantic-ui-react";
import { VoidExpression } from "typescript";
import { Activity } from "../../../app/models/activity";
interface Props{
    activity:Activity,
    cancelSelection:()=>void,
    openForm:(id:string)=>void;
}
export default function ActivityDetails({activity,cancelSelection,openForm}:Props){
    return(
        <Card fluid>
    <Image src={`/assets/categoryImages/${activity.category}.jpg`}/>
    <Card.Content>
      <Card.Header>{activity.title}</Card.Header>
      <Card.Meta>
        <span>{activity.date}</span>
      </Card.Meta>
      <Card.Description>
        {activity.description}
      </Card.Description>
    </Card.Content>
    <Card.Content extra>
      <Button.Group widths='2'>
        <Button basic onClick={()=>openForm(activity.id)} color="blue" content='Edit'></Button>
        <Button basic onClick={cancelSelection} color="grey" content='Cancel'></Button>
      </Button.Group>
    </Card.Content>
  </Card>
    )
}