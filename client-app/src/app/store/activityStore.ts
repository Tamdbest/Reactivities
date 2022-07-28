import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import { Activity } from "../models/activity";
import {v4 as uuid} from 'uuid';
export default class ActivityStore{
    activityRegistry=new Map<string,Activity>();
    //activityDateWiseRegistry=new Map<string,Activity[]>();
    selectedActivity:Activity|undefined=undefined;
    //editMode=false;
    loading=true;
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

    // cancelSelection=()=>{
    //     this.selectedActivity=undefined;
    // }

    setSubmitting=(value:boolean)=>{
        this.submitting=value;
    }
    get ActivitiesByDate(){
        return Array.from(this.activityRegistry.values()).sort((a, b) => 
        Date.parse(a.date) - Date.parse(b.date));
    }
    get groupedActivities() {
        return Object.entries(
            this.ActivitiesByDate.reduce((activities, activity) => {
                const date = activity.date;
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
        try{
            var response= await agent.Activities.list();
            response.forEach(x=>{
                x.date=x.date.split('T')[0];
                this.activityRegistry.set(x.id,x);
              });
              this.setLoading(false);
        }
        catch(err){
            console.log(err);
            this.setLoading(false);
        }
    }
    private setActivity = (activity: Activity) => {
        activity.date = activity.date.split('T')[0];
        this.activityRegistry.set(activity.id, activity);
    }
    private getActivity = (id: string) => {
        return this.activityRegistry.get(id);
    }
    createActivity=async(activity:Activity)=>{
        this.setSubmitting(true);
        activity.id=uuid();
        try{
            await agent.Activities.create(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
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
    editActivity=async(activity:Activity)=>{
        this.submitting=true;
        try{
            await agent.Activities.update(activity);
            runInAction(() => {
                this.activityRegistry.set(activity.id, activity);
                this.selectedActivity = activity;
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
}