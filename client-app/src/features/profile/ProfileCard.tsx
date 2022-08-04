
import { observer } from 'mobx-react-lite';
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, Icon, Image } from 'semantic-ui-react';
import { Profile } from '../../app/models/profiles';
import { Store } from '../../app/store/store';
import FollowButton from './FollowButton';

interface Props {
    profile: Profile;
}

export default observer(function ProfileCard({profile}: Props) {
    function truncateBio(bio:string|undefined):string{
        if(!bio||bio.length==0)
            return 'Bio not available';
        if(bio.length>100)
            return bio.slice(0, 100) + "...";
        return bio;
    }
    const{profileStore}=Store();
    return (
        <Card as={Link} to={`/profiles/${profile.username}`}>
            <Image src={profile.image || '/assets/user.png'} />
            <Card.Content>
                <Card.Header>{profile.displayName}</Card.Header>
                <Card.Description>{truncateBio(profile.bio)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
                <Icon name='user' />
                {profile.followersCount!=1?profile.followersCount+"  followers":profile.followersCount+"  follower"}
            </Card.Content>
            <FollowButton profile={profile}/>
        </Card>
    )
})