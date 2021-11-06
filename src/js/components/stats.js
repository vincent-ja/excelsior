import _ from "lodash";
import React from "react";

export class Stats extends React.Component{
    renderContainers(){
        if(typeof this.props.list !== 'object'){
            return;
        }

        const mappedStats = this.props.list.map((value, key) => {
            let percentage = 100;
            let amount = `${value.Value}`;

            if(_.has(value, 'HasMax') && value.HasMax === true){
                amount = `${value.Value}/${value.Max}`;
                percentage = Math.round((value.Value / value.Max) * 100);
            }

            return (
                <div className="stat-container" key={key}>
                    <div className="stat-info">
                        <span>
                            {value.Name}
                        </span>
                        <span>
                            {amount}
                        </span>
                    </div>
                    <div className="stat-bar">
                        <div
                          className="filled"
                          style={{left: `-${100 - percentage}%`, backgroundColor: `rgb(${value.Color[0]}, ${value.Color[1]}, ${value.Color[2]})`}}
                        >
                        </div>
                    </div>
                </div>
            );
        });

        return mappedStats;
    }

    render(){
        return (
            <div className="stats">
                <div className="inner">
                    {this.renderContainers()}
                </div>
            </div>
        );
    }
}