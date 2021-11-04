import React from "react";

export class Stats extends React.Component{
    render(){
        return (
            <div className="stats">
                <div className="inner">

                    <div className="stat-container">
                        <div className="stat-info">
                            <span>
                                Health
                            </span>
                            <span>
                                100/100
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div className="filled"></div>
                        </div>
                    </div>

                    <div className="stat-container">
                        <div className="stat-info">
                            <span>
                                Shield
                            </span>
                            <span>
                                100/100
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div className="filled" style={{backgroundColor: "rgb(188, 13, 252)"}}></div>
                        </div>
                    </div>

                    <div className="stat-container">
                        <div className="stat-info">
                            <span>
                                Mana
                            </span>
                            <span>
                                100/100
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div className="filled" style={{backgroundColor: "rgb(85, 239, 250)"}}></div>
                        </div>
                    </div>

                    <div className="stat-container">
                        <div className="stat-info">
                            <span>
                                Gold
                            </span>
                            <span>
                                4000
                            </span>
                        </div>
                        <div className="stat-bar">
                            <div className="filled" style={{backgroundColor: "rgb(255, 223, 1)"}}></div>
                        </div>
                    </div>

                </div>
            </div>
        );
    }
}