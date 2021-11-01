import React from "react";
import ReactDOM from "react-dom";

import "../scss/app.scss";
import * as Components from "./components";
import Core from "./core";

export default class App extends React.Component{
    containerRef = React.createRef();

    componentDidMount(){
        if(Core.instance !== null){
            console.warn("There is more than one active GameContainer instance. Things may not work as expected.");
        }
        Core.instance = this.containerRef.current;
    }

    componentWillUnmount(){
        Core.instance = null;
    }

    render(){
        return (
            <Components.GameContainer ref={this.containerRef}/>
        );
    }
}

ReactDOM.render(<App/>, document.getElementById('root'));