import React from "react";

export class InventoryItem extends React.Component{
    state = {
        isHovered: false,
        hoverX: 0,
        hoverY: 0,
        menuOpen: false,
        menuX: 0,
        menuY: 0
    };

    wrapperRef = React.createRef();

    handleMouseHover = (hover) => {
        this.setState({
            isHovered: hover
        });
    };

    handleMouseMove = (event) => {
        this.setState({
            hoverX: event.clientX,
            hoverY: event.clientY
        })
    };

    handleClick = (event) => {
        this.setState({
            menuOpen: true,
            menuX: event.clientX,
            menuY: event.clientY
        });
    };

    handleOutsideClick = (event) => {
        if(this.state.menuOpen && !this.wrapperRef.current.contains(event.target)){
            this.setState({
                menuOpen: false
            });
        }
    };

    componentDidMount(){
        document.addEventListener('click', this.handleOutsideClick);
    }

    componentWillUnmount(){
        document.removeEventListener('click', this.handleOutsideClick);
    }

    renderMenuItems(){
        let menuItems = this.props.item.Actions;
        let mappedItems = Object.keys(menuItems).map((value, key) => {
            return(
                <div key={key} onClick={(e) => {
                    menuItems[value](this.props.item);
                    this.setState({
                        menuOpen: false,
                        hoverX: e.clientX,
                        hoverY: e.clientY
                    });
                }}>{value}</div>
            );
        });

        return mappedItems;
    }

    render(){
        return (
            <div ref={this.wrapperRef}>
                <div
                  className="item"
                  onMouseEnter={() => this.handleMouseHover(true)}
                  onMouseLeave={() => this.handleMouseHover(false)}
                  onMouseMove={this.handleMouseMove}
                  onClick={this.handleClick}
                >
                    {this.props.item.Name}
                    <div
                      className="hover-block" 
                      style={{
                          display: (this.state.isHovered && !this.state.menuOpen) ? "block" : "none",
                          top: this.state.hoverY + 5,
                          left: this.state.hoverX + 5
                      }}
                    >
                        <h3>{this.props.item.Name}</h3>
                        <p>{this.props.item.Desc}</p>
                    </div>
                </div>
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
            </div>
        );
    }
}