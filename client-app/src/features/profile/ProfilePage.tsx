
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import LoadingComponent from '../../app/layout/LoadingComponent';
import { Store } from '../../app/store/store';
import ProfileContent from './ProfileContent';
import ProfileHeader from './ProfileHeader';

export default observer(function ProfilePage() {
    const { username } = useParams<{ username: string }>();
    const { profileStore } = Store();
    const { loadingProfile, loadProfile, profile } = profileStore;

    useEffect(() => {
        loadProfile(username);
        return()=>{profileStore.setActiveTab(0);profileStore.profile=null}
    }, [loadProfile, username])

    if (loadingProfile) return <LoadingComponent content='Loading profile...' />

    return (
        <Grid>
            <Grid.Column width={16}>
                {profile &&
                    <>
                        <ProfileHeader profile={profile} />
                        <ProfileContent profile={profile} />
                    </>}
            </Grid.Column>
        </Grid>
    )
})