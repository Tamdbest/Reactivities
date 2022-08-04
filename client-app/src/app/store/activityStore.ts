import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity, ActivityFormValues } from "../models/activity";
import {v4 as uuid} from 'uuid';
import {format} from 'date-fns';
import { store } from "./store";
import { Profile } from "../models/profiles";
export default class ActivityStore{
    activityRegistry=new Map<string,Activity>();
    //activityDateWiseRegistry=new Map<string,Activity[]>();
    selectedActivity:Activity|undefined=undefined;
    //editMode=false;
    loading=false;
    submitting=false;
    constructor() {
        makeAutoObservable(this);
    }

    setLoading=(state:boolean)=>{
        this.loading=state
    }

    // openForm=(id?:string)=>{
    //     id?this.selectActivity(id):this.cancelSelection();
    //     this.editMode=true;
    // }

    // closeForm=()=>{
    //     this.editMode=false;
    // }

    // selectActivity=(id:string)=>{
    //     this.selectedActivity=this.activityRegistry.get(id);
    // }

    cancelSelection=()=>{
        this.selectedActivity=undefined;
    }

    setSubmitting=(value:boolean)=>{
        this.submitting=value;
    }
    get ActivitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        a.date!.getTime() - b.date!.getTime());
    }
    get groupedActivities() {
        return Object.entries(
            this.ActivitiesByDate.reduce((activities, activity) => {
                const date = format(activity.date!,'dd MMM yyyy');
                activities[date] = activities[date] ? [...activities[date], activity] : [activity];
                return activities;
            }, {} as {[key: string]: Activity[]})
        )
    }
    loadActivity=async(id:string)=>{
        let activity=this.getActivity(id);
        if(activity){
            this.selectedActivity=activity;
            return activity;
        }
        else{
            this.loading=true;
            try{
                activity=await agent.Activities.getone(id);
                this.setActivity(activity);
                runInAction(() => {
                    this.selectedActivity = activity;
                    this.loading=false;
                })
                return activity;
            }
            catch(err){
                console.log(err);
                runInAction(() => {
                    this.selectedActivity = activity;
                    this.loading=false;
                })
            }
        }
    }
    getActivities=async ()=>{
        this.setLoading(true);
        try{
            const response= await agent.Activities.list();
            response.forEach(x=>{
                this.setActivity(x);
              });
              this.setLoading(false);
        }
        catch(err){
            console.log(err);
            this.setLoading(false);
        }
    }
    private setActivity = (activity: Activity) => {
        var user=store.userStore.user;
        if(user){
            activity.isGoing=activity.attendees.some(x=>x.username==user?.username);
            activity.isHost=activity.hostUsername==user.username;
            activity.host=activity.attendees.find(x=>x.username==activity.hostUsername);
        }
        activity.date = new Date(activity.date!);
        this.activityRegistry.set(activity.id, activity);
    }
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
    updateAttendance=async ()=>{
        const user=store.userStore.user;
        this.submitting=true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                if(this.selectedActivity?.isGoing){
                    this.selectedActivity.attendees=this.selectedActivity.attendees.filter(x=>x.username!==user!.username);
                    this.selectedActivity.isGoing=false;
                }
                else{
                    const newProfile=new Profile(user!);
                    this.selectedActivity?.attendees.push(newProfile);
                    this.selectedActivity!.isGoing=true; 
                }
                this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
            })
        }
        catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.submitting = false);
        }
    }
    cancelActivityToggle=async ()=>{
        this.submitting=true;
        try{
            await agent.Activities.attend(this.selectedActivity!.id);
            runInAction(()=>{
                this.selectedActivity!.isCancelled=!this.selectedActivity?.isCancelled;
                this.activityRegistry.set(this.selectedActivity!.id,this.selectedActivity!);
            })
        }
        catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.submitting = false);
        }
    }
    createActivity=async(activity:ActivityFormValues)=>{
        this.setSubmitting(true);
        //activity.id=uuid();
        const user=store.userStore.user;
        const attendee=new Profile(user!);
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                var newActivity=new Activity(activity);
                newActivity.hostUsername=user!.username;
                newActivity.attendees=[attendee];
                this.activityRegistry.set(newActivity!.id, newActivity);
                this.selectedActivity = newActivity;
                //this.editMode = false;
                this.submitting = false;
            })
        }
        catch(err){
            console.log(err);
            runInAction(() => {
                this.submitting = false;
            })
        }
    }
    editActivity=async(activity:ActivityFormValues)=>{
        this.submitting=true;
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                if(activity.id){
                let updatedActivity={...this.getActivity(activity.id),...activity};
                this.activityRegistry.set(activity.id, updatedActivity as Activity);
                this.selectedActivity = this.activityRegistry.get(activity.id);
                //this.editMode = false;
                this.submitting = false;
                }
            })
        }
        catch(err){
            console.log(err);
            runInAction(() => {
                this.submitting = false;
            })
        }
    }
    deleteActivity=async(id:string)=>{
        this.submitting=true;
        try{
            await agent.Activities.delete(id);
            runInAction(() => {
                this.activityRegistry.delete(id);
                if(this.selectedActivity&&this.selectedActivity.id===id){
                    this.selectedActivity=undefined;
                }
                this.submitting = false;
            })
        }
        catch(err){
            console.log(err);
            runInAction(() => {
                this.submitting = false;
            })
        }
    }
    followOrUnfollow=(username:string)=>{
        this.activityRegistry.forEach(x=>{
            x.attendees.forEach(y=>{
                if(y.username===username){
                    if(y.following){
                        y.following=false;
                        y.followersCount--;
                    }
                    else{
                        y.following=true;
                        y.followersCount++;
                    }
                }
            })
        })
    }
}