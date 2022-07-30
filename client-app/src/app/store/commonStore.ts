import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/serverError";

export default class CommonStore{
    error:ServerError|null=null;
    token:string|null=window.localStorage.getItem('jwt');
    apploaded:boolean=false;
    constructor() {
        makeAutoObservable(this);
        reaction(()=>this.token,token=>{})
    }
    setError=(err:ServerError)=>{
        this.error=err;
    }
    setToken=(tok:string|null)=>{
        if(tok)
            window.localStorage.setItem('jwt',tok);
        this.token=tok; 
    }
    setAppLoaded=()=>{
        this.apploaded=true;
    }
}