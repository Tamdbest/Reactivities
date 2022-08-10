import { Redirect, Route, RouteComponentProps, RouteProps } from "react-router-dom";
import { Store } from "../store/store";

interface Props extends RouteProps {
    component: React.ComponentType<RouteComponentProps<any>> | React.ComponentType<any>;
}

export default function PrivateRoute({component: Component, ...rest}: Props) {
    const {userStore: {isLoggedIn}} = Store();
    return (
        <Route 
            {...rest}
            render={(props) => isLoggedIn ? <Component {...props} /> : <Redirect to='/' />}
        />
    )
}