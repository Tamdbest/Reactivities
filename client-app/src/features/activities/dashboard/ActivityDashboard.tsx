import { observer } from "mobx-react-lite";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { Grid, List, Loader } from "semantic-ui-react";
import { VoidExpression } from "typescript";
import LoadingComponent from "../../../app/layout/LoadingComponent";
import { Activity } from "../../../app/models/activity";
import { PagingParams } from "../../../app/models/pagination";
import { Store } from "../../../app/store/store";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";
import ActivityFilters from "./ActivityFilters";
import ActivityList from "./ActivityList";
import ActivityListItemPlaceholder from "./ActivityListItemPlaceholder";

// interface Props{
//     submitting:boolean,
//     loading:boolean,
//     deleteActivity:(id:string)=>void,
//     createOrEdit:(activity:Activity)=>void,
//     activities:Activity[],
//     selectedActivity:Activity|undefined,
//     selectActivity:(id:string)=>void,
//     cancelSelection:()=>void,
//     editMode:boolean,
//     openForm:(id:string)=>void,
//     closeForm:()=>void;
// }

export default observer(function ActivityDashboard(){
    const {activityStore}=Store();
    const {setPagingParams,pagination,getActivities}=activityStore;
    const [loadingNext,setLoadingNext]=useState(false);
    function handleGetNext(){
        setLoadingNext(true);
        setPagingParams(new PagingParams(pagination!.currentPage+1));
        getActivities().then(()=>setLoadingNext(false));
    }
    useEffect(() => {
        if(activityStore.activityRegistry.size<=1)
            activityStore.getActivities();
    }, [activityStore.activityRegistry.size,activityStore.getActivities])
    return(
        <>
            <Grid>
                <Grid.Column width='10'>
                {(activityStore.loading&&!loadingNext?
                
                    <ActivityListItemPlaceholder></ActivityListItemPlaceholder>:
                    <InfiniteScroll
                            pageStart={0}
                            loadMore={handleGetNext}
                            hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                            initialLoad={false}
                        >
                            <ActivityList />
                        </InfiniteScroll>)}
                </Grid.Column>
                <Grid.Column width='6'>
                    <ActivityFilters/>
                </Grid.Column>
                {/* {activityStore.selectedActivity&&!activityStore.editMode&&<ActivityDetails/>} */}
                {/* {activityStore.editMode&&<ActivityForm/>} */}
                {/* </Grid.Column> */}
                <Grid.Column width={10}>
                <Loader active={loadingNext} />
                </Grid.Column>
            </Grid>
        </>
    )
})