import { Agent } from "http";
import { makeAutoObservable, reaction, runInAction } from "mobx";
import agent from "../api/agent";
import { Photo, Profile, UserActivity } from "../models/profiles";
import { store } from "./store";

export default class ProfileStore{
    profile:Profile|null=null;
    loadingProfile=false;
    uploading = false;
    loading = false;
    followings: Profile[] = [];
    loadingFollowings = false;
    activeTab = 0;
    userActivities:UserActivity[]=[];
    loadingActivities=false;
    constructor(){
        makeAutoObservable(this);
        reaction(
            () => this.activeTab,
            activeTab => {
                if (activeTab === 4 || activeTab === 3) {
                    const predicate = activeTab === 3 ? 'followers' : 'following';
                    this.loadFollowing(predicate);
                }
                if(activeTab!==4&&activeTab!==3&&activeTab!==2) {
                    this.followings = [];
                    this.userActivities=[];
                }
            }
        )
    }
    get isCurrentUser(){
        if(this.profile&&store.userStore.user){
            return this.profile.username===store.userStore.user.username;
        }
        return false;
    }
    loadUserActivities=async(username:string,predicate:string|null=null)=>{
        this.loadingActivities=true;
        try{
            const acts=await agent.Profiles.getUserActivities(username,predicate);
            runInAction(()=>{
                this.userActivities=acts;
                this.loadingActivities=false;
            })
        }
        catch(err){
            console.log(err);
            runInAction(()=>{
                this.loadingActivities=false;
            })
        }
    }
    loadProfile=async(username:string)=>{
        this.loadingProfile=true;
        try{
            const profile=await agent.Profiles.get(username);
            runInAction(()=>{
                this.profile=profile;
                this.loadingProfile=false;
            })
        }
        catch(err){
            console.log(err);
            runInAction(()=>{
                this.loadingProfile=false;
            })
        }
    }
    uploadPhoto=async(file:Blob)=>{
        this.uploading=true;
        try{
            const response=await agent.Profiles.uploadPhoto(file);
            var photo=response.data;
            runInAction(()=>{
                if(this.profile){
                    this.profile.photos?.push(photo);
                    if(photo.isMain&&store.userStore.user){
                        store.userStore.setImage(photo.url);
                        this.profile.image=photo.url;
                    }
                }
                this.uploading=false;
            })
        }
        catch (error) {   
            console.log(error);
            runInAction(() => this.uploading = false);
        }
    }
    setMainPhoto=async (photo:Photo)=>{
        this.loading=true;
        try{
            await agent.Profiles.setMainPhoto(photo.id);
            store.userStore.setImage(photo.url);
            runInAction(()=>{
                if(this.profile){
                    this.profile.photos!.find(x=>x.isMain)!.isMain=false;
                    this.profile.photos!.find(x=>x.id==photo.id)!.isMain=true;
                    this.profile.image=photo.url;
                    this.loading=false;
                }
            })
        }
        catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }
    deletePhoto=async(photo:Photo)=>{
        this.loading=true;
        try{
            await agent.Profiles.deletePhoto(photo.id);
            runInAction(()=>{
                if(this.profile){
                    this.profile.photos=this.profile.photos?.filter(x=>x.id!==photo.id);
                    this.loading=false;
                }
            })
        }
        catch (error) {
            runInAction(() => this.loading = false);
            console.log(error);
        }
    }
    updateProfile=async(profile:Partial<Profile>)=>{
        this.loading=true;
        try{
            await agent.Profiles.edit(profile);
            runInAction(()=>{
                if (profile.displayName && profile.displayName !==
                    store.userStore.user?.displayName) {
                    store.userStore.setDisplayName(profile);
                    }
                    this.profile = {...this.profile, ...profile as Profile};
                    store.activityStore.activityRegistry.forEach(x=>{
                        x.attendees.forEach(y=>{
                            if(y.username===profile.username){
                                y.displayName=profile.displayName!
                                if(profile.bio!==undefined||profile.bio!=="")
                                     y.bio=profile.bio;
                            }
                        })
                    })
                    this.loading = false;
                    })
                    } catch (error) {
                    console.log(error);
                    runInAction(() => this.loading = false);
        }
    }
    setActiveTab = (activeTab: any) => {
        this.activeTab = activeTab;
    }
    updateFollowing=async (username:string,follow:boolean)=>{
        this.loading=true;
        try{
            await agent.Profiles.follow(username);
            store.activityStore.followOrUnfollow(username);
            runInAction(()=>{
                if(this.profile&&this.profile!.username!==store.userStore.user?.username&&this.profile.username===username){
                    if(follow){
                        this.profile!.followersCount++;
                        this.profile.following=true;
                    }
                    else{
                        this.profile!.followersCount--;
                        this.profile!.following=false;
                    }
                }
                if(this.profile?.username===store.userStore.user?.username){
                    if(follow){
                        this.profile!.followingCount++;
                    }
                    else{
                        this.profile!.followersCount--;
                    }
                }
                this.followings.forEach(x=>{
                    if(x.username===username){
                        if(follow){
                            x.followersCount++;
                            x.following=true;
                        }
                        else{
                            x.followersCount--;
                            x.following=false;
                        }
                    }
                })
                this.loading=false;
            })
        }
        catch(err){
            console.log(err);
            runInAction(()=>{
                this.loading=false;
            })
        }
    }
    loadFollowing=async(predicate:string)=>{
        this.loadingFollowings=true;
        try{
            const followings=await agent.Profiles.getFollowings(this.profile!.username,predicate);
            runInAction(()=>{
                this.followings=followings;
                this.loadingFollowings=false;
            })
        }
        catch(err){
            console.log(err)
            runInAction(()=>{
                this.loadingFollowings=false;
            })
        }
    }
}