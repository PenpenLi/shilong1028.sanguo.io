

//游戏结束界面
const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOver extends cc.Component {

    @property(cc.Node)
    bgImg: cc.Node = null;

    @property(cc.Node)
    touchNode: cc.Node = null;

    @property(cc.Label)
    descLabel: cc.Label = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEnd, this);

        this.descLabel.string = "";
    }

    start () {
        this.descLabel.string = "恭喜你，在5.0秒的时间内成功回收/分拣100件垃圾。我代表居委会和广大业主感谢你的贡献。";
    }

    // update (dt) {}

    touchEnd(event: cc.Touch){
        let pos1 = this.bgImg.convertToNodeSpace(event.getLocation());
        let rect1 = cc.rect(0, 0, this.bgImg.width, this.bgImg.height);
        if(!rect1.contains(pos1)){
            this.onCloseBtn();
        }

    }

    onCloseBtn(){
        this.node.removeFromParent(true);
        cc.director.loadScene("searchScene");
    }

    onShareBtn(){
        this.node.removeFromParent(true);
        cc.director.loadScene("searchScene");
    }

}