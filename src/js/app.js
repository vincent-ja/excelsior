import React from "react";
import ReactDOM from "react-dom";

import "../scss/app.scss";
import * as Components from "./components";

export default class App extends React.Component{
    render(){
        return (
            <Components.GameContainer/>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));