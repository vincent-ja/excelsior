import _ from "lodash";
import React from "react";
import Core from "../core";

export class Options extends React.Component{    
    handleKeyDown = (e) => {
        if(!isNaN(e.key)){
            this.handleSelection(e.key)
        }
    };

    componentDidMount(){
        document.addEventListener('keydown', this.handleKeyDown);
    }

    componentWillUnmount(){
        document.removeEventListener('keydown', this.handleKeyDown);
    }

    handleSelection(num){
        if(_.has(this.props.list, 'Options')){
            if(num < 1 || num > this.props.list.Options.length){
                return;
            }
    
            let opts = this.props.list.Options;
            Core.runBehaviorBase(opts[num - 1], this.props.list.Cell, 'Cell', 'Click');
        }
    }

    renderOptions(){
        if(typeof this.props.list != "object"){
            return;
        }

        if(_.has(this.props.list, 'Options')){
            const mappedList = this.props.list.Options.map((value, key) => {
                let num = key + 1;
    
                return (
                    <div
                      onClick={() => this.handleSelection(num)}
                      key={num}
                    >
                        {num}.) {value.Name}
                    </div>
                );
            });
    
            return mappedList;
        }
    }

    render(){
        return (
            <div className="options">
                {this.renderOptions()}
            </div>
        );
    }
}