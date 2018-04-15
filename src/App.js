import './App.css';
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import {Home} from './home/home';
import {Register} from './user/register';
import {Login} from './user/login';
import {Logout} from './user/logout';
import {TodoAdd} from './todo/TodoAdd';
import {TodoList} from "./todo/TodoList";
import {TodoDetail} from "./todo/TodoDetail";
import {TodoEdit} from "./todo/TodoEdit";
import './index.css';


class App extends React.Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route path={'/todo/list/:filter/:order/:page'} component={TodoList}/>
                    <Route path={'/todo/list/:filter/:order'} component={TodoList}/>
                    <Route path={'/todo/list/:filter'} component={TodoList}/>
                    <Route path={'/todo/list'} component={TodoList}/>
                    <Route path={'/todo/add'} component={TodoAdd}/>
                    <Route path={'/todo/detail/:id'} component={TodoDetail}/>
                    <Route path={'/todo/edit/:id'} component={TodoEdit}/>

                    <Route path={'/user/login'} component={Login}/>
                    <Route path={'/user/register'} component={Register}/>
                    <Route path={'/user/logout'} component={Logout}/>

                    <Route path={'/'} component={Home}/>
                </Switch>
            </BrowserRouter>
        );
    }
}


ReactDOM.render(
    <App/>,
    document.getElementById('root')
);
export default App;
