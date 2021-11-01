import React from "react";

export class GameText extends React.Component{
    renderText(){
        let mappedText = this.props.text.map((value, key) => {
            if(value.type == "line"){
                return (
                    <span key={key}>{value.content}<br></br></span>
                );
            } else {
                return (
                    <span key={key}>{value.content}</span>
                );
            }
        });

        return mappedText;
    }

    render(){
        return (
            <div className="game-text">
                {this.renderText()}
            </div>
        );
    }
}