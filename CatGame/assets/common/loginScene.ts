
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "./rootNode";
import { MyUserDataMgr } from "../manager/MyUserData";

//初始场景，用于初始化加载数据
const {ccclass, property} = cc._decorator;

@ccclass
export default class LoginScene extends cc.Component {
    @property(cc.Node)
    btnNode: cc.Node = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    descStr: string = "游戏定位是一款休闲弹射类小游戏。\n本身其实很容易上手，且能够吸引用户短时间游玩。";
    curDescStrIdx: number = 0;
    bUpdateStr: boolean = false;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.btnNode.active = false;
        this.descLabel.string = "";
    }

    start () {
        MyUserDataMgr.initUserData();    //初始化用户信息
        this.btnNode.active = true;
        this.bUpdateStr = true;
    }

    update (dt) {
        if(this.bUpdateStr == true){
            this.curDescStrIdx ++;
            if(this.curDescStrIdx >= this.descStr.length){
                this.descLabel.string = this.descStr;
                this.bUpdateStr = false;
            }else{
                let str = this.descStr.substr(0, this.curDescStrIdx);  
                //substr(start,length)表示从start位置开始，截取length长度的字符串。
                //substring(start,end)表示从start到end之间的字符串，包括start位置的字符但是不包括end位置的字符。
                this.descLabel.string = str;
            }
        }
    }

    onLoginGame(){
        this.btnNode.active = false;
        GameMgr.gotoMainScene();   //进入主场景
    }

    onResetGame(){
        ROOT_NODE.showTipsDialog("是否清除所有游戏重新开始？", ()=>{
            this.btnNode.active = false;
            MyUserDataMgr.clearUserData();   //清除所有用户数据
            GameMgr.gotoMainScene();   //进入主场景
        });
    }
}
