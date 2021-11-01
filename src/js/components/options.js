import React from "react";

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
        if(typeof this.props.onSelection != "function" || typeof this.props.list != "object"){
            return;
        }

        if(num < 1 || num > this.props.list.length){
            return;
        }
        
        this.props.onSelection(num - 1);
    }

    renderOptions(){
        if(typeof this.props.list != "object"){
            return;
        }

        var lst = this.props.list.slice();
        const mappedList = lst.map((value, key) => {
            let num = key + 1;

            return (
                <div onClick={() => this.handleSelection(num)} key={num}>{num}.) {value}</div>
            );
        });

        return mappedList;
    }

    render(){
        return (
            <div className="options">
                {this.renderOptions()}
            </div>
        );
    }
}