import userEvent from "@testing-library/user-event";
import { makeAutoObservable, runInAction } from "mobx";
import { history } from "../..";
import agent from "../api/agent";
import { User, UserFormValues } from "../models/user";
import { Store, store } from "./store";

export default class UserStore{
    user:User|null=null;
    constructor() {
        makeAutoObservable(this);  
    }
    get isLoggedIn(){
        return !!this.user;
    }
    login=async (info:UserFormValues)=>{
        try{
            var user=await agent.Account.login(info)
            store.commonStore.setToken(user.token);
            runInAction(()=>{
                this.user=user;
            })
            store.modalStore.closeModal();
            history.push('/activities');
        }
        catch(err){
            //store.modalStore.closeModal();
            throw err;
        }
    }
    logout=()=>{
        store.commonStore.setToken(null);
        window.localStorage.removeItem('jwt');
        this.user=null;
        history.push('/');
    }
    register=async (info:UserFormValues)=>{
        try{
            var user=await agent.Account.register(info)
            store.commonStore.setToken(user.token);
            runInAction(()=>{
                this.user=user;
            })
            store.modalStore.closeModal();
            history.push('/activities');
        }
        catch(err){
            //store.modalStore.closeModal();
            throw err;
        }
    }
    getLoggedInUser=async ()=>{
        try{
            var user=await agent.Account.getcurruser();
            runInAction(()=>{this.user=user})
        }
        catch(err){
            console.log(err);
        }
    }
}