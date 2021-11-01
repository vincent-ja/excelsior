export default class Core{
    static instance = null;

    static addItem = (id) => {
        this.instance.addItem(id);
    }

    static print = (spans) => {
        let arr = [];
        for(let i = 0; i < spans.length; i++){
            let type = "none";
            let item = spans[i];

            if(spans[i].endsWith("/")){
                type = "line";
                item = item.substring(0, item.length - 1);
            }

            arr.push({
                content: item,
                type: type
            });
        }

        this.instance.appendText(arr, "none");
    }
}