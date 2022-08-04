import { observer } from "mobx-react-lite";
import React from "react";
import { Grid, Header,Tab,Card } from "semantic-ui-react";
import { Store } from "../../app/store/store";
import ProfileCard from "./ProfileCard";
export default observer(function ProfileFollowings(){
    const{profileStore}=Store();
    return(
        <Tab.Pane loading={profileStore.loadingFollowings}>
            <Grid>
                <Grid.Column width='16'>
                    <Header
                        floated='left'
                        icon='user'
                        content={profileStore.activeTab === 3 ? `People following ${profileStore.profile!.displayName}` : `People ${profileStore.profile?.displayName} is following`}
                    />
                </Grid.Column>
                <Grid.Column width='16'>
                    <Card.Group itemsPerRow={4}>
                        {profileStore.followings.map(profile => (
                            <ProfileCard key={profile.username} profile={profile} />
                        ))}
                    </Card.Group>
                </Grid.Column>
            </Grid>
        </Tab.Pane>
    )
})