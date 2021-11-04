import _ from "lodash";
import React from "react";
import Core from "../core";

export class GameText extends React.Component{
    bottomRef = React.createRef();

    renderText(){
        let actionRE = /^\[\[.+?\]\]$/;
        let newLineRE = /^\/\*$/;

        let sections = this.props.text.split(/(\[\[.+?\]\])|(\/\*)/g);
        let metaNum = 0;

        const mappedSections = sections.map((value, key) => {
            if(typeof value !== 'string' || value.length < 1){
                return;
            } else if(actionRE.test(value)){
                let num = metaNum++;
                let content = value.substring(2, value.length - 2);
                return (
                    <Action
                      key={key}
                      obj={this.props.meta[num]}
                    >
                        {content}
                    </Action>
                );
            } else if(newLineRE.test(value)){
                return (
                    <br key={key}></br>
                );
            } else {
                return (
                    <span key={key}>{value}</span>
                );
            }
        });

        return mappedSections;
    }

    componentDidUpdate(){
        this.bottomRef.current.scrollIntoView({behavior: "smooth"});
    }

    render(){
        return (
            <div className="game-text">
                {this.renderText()}
                <div ref={this.bottomRef}></div>
            </div>
        );
    }
}

export class Action extends React.Component{
    state = {
        menuOpen: false,
        menuX: 0,
        menuY: 0,
        active: true
    }

    wrapperRef = React.createRef();

    componentDidMount(){
        document.addEventListener('click', this.handleOutsideClick);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleOutsideClick);
    }

    handleOutsideClick = (event) => {
        if(this.state.menuOpen && !this.wrapperRef.current.contains(event.target)){
            this.setState({
                menuOpen: false
            });
        }
    };

    handleClick = (event) => {
        if(!this.state.active){
            return;
        }

        let options = this.props.obj.Options;
        let activeOption = false;

        for(let i = 0; i < options.length; i++){
            if(Core.runBehaviorBase(options[i], this.props.obj, 'Unknown', 'Condition', true) === true){
                activeOption = true;
                break;
            }
        }

        if(!activeOption){
            return;
        }

        this.setState({
            menuOpen: true,
            menuX: event.clientX,
            menuY: event.clientY
        });
    };

    renderMenuItems(){
        let menuItems = this.props.obj.Options;
        let mappedItems = menuItems.map((value, key) => {
            if(Core.runBehaviorBase(value, this.props.obj, 'Unknown', 'Condition', true) === true){
                return(
                    <div key={key} onClick={() => {
                        Core.runBehaviorBase(value, this.props.obj, 'Unknown', 'Click');
                        this.setState({
                            menuOpen: false
                        });
                    }}>{value.Name}</div>
                );
            } else {
                return("");
            }
        });

        return mappedItems;
    }

    render(){
        let isActive = true;
        if(_.has(this.props.obj, 'Active')){
            let activeVal = this.props.obj.Active;
            if(typeof activeVal === 'boolean'){
                isActive = activeVal;
            }
        }

        return (
            <span ref={this.wrapperRef}>
                <span
                  className={isActive ? "action" : ""}
                  onClick={this.handleClick}
                >
                      {this.props.children}
                </span>
                <div
                  className="menu"
                  style={{
                      display: this.state.menuOpen ? "block" : "none",
                      top: this.state.menuY,
                      left: this.state.menuX
                  }}
                >
                    {this.renderMenuItems()}
                </div>
            </span>
        );
    }
}