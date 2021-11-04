import React from "react";
import { ExtextParser } from "../extext";

export class GameText extends React.Component{
    bottomRef = React.createRef();

    componentDidUpdate(){
        this.bottomRef.current.scrollIntoView({behavior: "smooth"});
    }

    render(){
        return (
            <div className="game-text">
                {ExtextParser.parse(this.props.text, this.props.meta)}
                <div ref={this.bottomRef}></div>
            </div>
        );
    }
}