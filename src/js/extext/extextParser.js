import { Action } from "../components";
import Core from "../core";

export class ExtextParser{
    static parse = (text, meta) => {
        let splitRegex = /(\[\[.+?\]\])|(\*\[.+?\]\*)|(\/\?)|(\?\/)|(\/\*)/g;
        let sections = text.split(splitRegex);

        let results = [];
        let conditionalTree = [];
        let metaNum = 0;

        let doProcess = () => {
            let length = conditionalTree.length;
            return (length > 0 ? conditionalTree[length - 1] === true : true);
        }

        let nextMeta = () => {
            if(metaNum > meta.length - 1){
                throw new Error("There cannot be more meta tags than meta objects.");
            }
            return meta[metaNum++];
        }

        let removeTags = (str, length) => {
            return str.substring(length, str.length - length);
        }

        let pushResult = (res) => {
            if(doProcess()){
                results.push(res);
            }
        }

        for(let i = 0; i < sections.length; i++){
            let currentSection = sections[i];
            if(typeof currentSection !== 'string' || currentSection.length < 1){
                continue;
            }

            if(currentSection.startsWith("*[") && currentSection.endsWith("]*")){
                pushResult(
                    <span
                      key={i}
                      style={nextMeta().Style}
                    >
                        {removeTags(currentSection, 2)}
                    </span>
                );
            } else if(currentSection.startsWith("[[") && currentSection.endsWith("]]")) {
                let curMeta = nextMeta();
                pushResult(
                    <Action
                      key={i}
                      obj={curMeta}
                      style={curMeta.Style}
                    >
                        {removeTags(currentSection, 2)}
                    </Action>
                );
            } else if(currentSection === "/?"){
                let condObj = nextMeta();
                if(doProcess()){
                    let res = Core.runBehaviorBase(condObj, null, 'Unknown', 'Condition', false);
                    conditionalTree.push(res === true);
                } else {
                    conditionalTree.push(false);
                }
            } else if(currentSection === "?/"){
                if(conditionalTree.length > 0){
                    conditionalTree.pop();
                } else {
                    pushResult(
                        <span
                          key={i}
                        >
                            {currentSection}
                        </span>
                    );
                }
            } else if(currentSection === "/*"){
                pushResult(
                    <br key={i}></br>
                );
            } else {
                pushResult(
                    <span
                      key={i}
                    >
                        {currentSection}
                    </span>
                )
            }
        }

        return results;
    }
}