import React from "react";

export class GameText extends React.Component{
    renderText(){
        let mappedText = this.props.text.map((value, key) => {
            if(value.type == "line"){
                return (
                    <span key={key}>{value.content}<br></br></span>
                );
            } else if(value.type == "action"){
                return (
                    <Action key={key} options={value.options}>{value.content}</Action>
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

export class Action extends React.Component{
    state = {
        menuOpen: false,
        menuX: 0,
        menuY: 0
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
        this.setState({
            menuOpen: true,
            menuX: event.clientX,
            menuY: event.clientY
        });
    };

    renderMenuItems(){
        let menuItems = this.props.options;
        let mappedItems = Object.keys(menuItems).map((value, key) => {
            return(
                <div key={key} onClick={(e) => {
                    menuItems[value]();
                    this.setState({
                        menuOpen: false
                    });
                }}>{value}</div>
            );
        });

        return mappedItems;
    }

    render(){
        return (
            <span
              className="action"
              ref={this.wrapperRef}
            >
                <b onClick={this.handleClick}>{this.props.children}</b>
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