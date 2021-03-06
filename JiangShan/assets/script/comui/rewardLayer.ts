import List from "../control/List";
import { ROOT_NODE } from "../login/rootNode";
import { AudioMgr } from "../manager/AudioMgr";
import { ItemInfo } from "../manager/ConfigManager";
import { GameMgr } from "../manager/GameManager";
import { SDKMgr } from "../manager/SDKManager";
import Item from "./item";


//领取奖励通用提示框
const {ccclass, property, menu, executionOrder, disallowMultiple} = cc._decorator;

@ccclass
@menu("ComUI/rewardLayer")
@executionOrder(0)  
//脚本生命周期回调的执行优先级。小于 0 的脚本将优先执行，大于 0 的脚本将最后执行。该优先级只对 onLoad, onEnable, start, update 和 lateUpdate 有效，对 onDisable 和 onDestroy 无效。
@disallowMultiple 
// 当本组件添加到节点上后，禁止同类型（含子类）的组件再添加到同一个节点

export default class RewardLayer extends cc.Component {

    @property(List)
    list: List = null;

    @property(cc.Label)
    titleLabel: cc.Label = null;
    @property(cc.Node)
    infoNode: cc.Node = null;
    @property(cc.Sprite)
    iconSpr: cc.Sprite = null;
    @property(cc.Label)
    nameLabel: cc.Label = null;
    @property(cc.Label)
    numLabel: cc.Label = null;
    @property(cc.Label)
    descLabel: cc.Label = null;

    @property(cc.Node)
    vedioBtn: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    receiveCallback: any = null;    //领取回调

    rewardArr: ItemInfo[] = [];   //奖励

    onLoad () {
        this.list.numItems = 0;
        this.infoNode.active = false;
        this.descLabel.string = "";

        this.vedioBtn.active = SDKMgr.bOpenAdBtn;
    }

    start () {

    }

    // update (dt) {}

    /**展示奖励列表 */
    showRewardList(rewards: ItemInfo[], title:string = null, callback?: any){  
        //cc.log("showRewardList(), rewards = "+JSON.stringify(rewards));
        this.rewardArr = rewards;
        this.receiveCallback = callback;
        if(title){
            this.titleLabel.string = title;
        }else{
            this.titleLabel.string = "获取奖励";
        }

        this.list.numItems = this.rewardArr.length;
        this.list.selectedId = 0;
        this.infoNode.active = true;
        this.updateSelItemInfoByIdx(0);  //显示底部选中道具信息
    }

    //列表渲染器
    onListRender(item: cc.Node, idx: number) {
        let info = this.rewardArr[idx];
        item.getComponent(Item).initItemData(info);
    }

    //当列表项被选择...
    onListSelected(item: any, selectedId: number, lastSelectedId: number, val: number) {
        if (!item)
            return;
        //cc.log('当前选择的是：' + selectedId + '，上一次选择的是：' + lastSelectedId);
        this.updateSelItemInfoByIdx(selectedId);  //显示底部选中道具信息
    }   

    /**显示底部选中道具信息 */
    updateSelItemInfoByIdx(cellIdx:number){
        let item = this.rewardArr[cellIdx];
        if(item && item.itemCfg){
            //cc.log("item.itemCfg = "+JSON.stringify(item.itemCfg))
            this.numLabel.string = "数量："+item.count;
            this.nameLabel.string = item.itemCfg.name;
            this.iconSpr.spriteFrame = ROOT_NODE.iconAtlas.getSpriteFrame(item.itemId.toString());
            this.descLabel.string = item.itemCfg.desc;
        }else{
            this.iconSpr.spriteFrame = null;
            this.nameLabel.string = "";
            this.numLabel.string = "";
            this.descLabel.string = "";
        }
    }

    onOkBtn(){
        AudioMgr.playBtnClickEffect();
        let str = "";
        for(let i=0; i<this.rewardArr.length; ++i){
            let item = this.rewardArr[i];
            let itemStr = "获得"+item.itemCfg.name + " x " + item.count + "  ";
            str += itemStr;
        }
        ROOT_NODE.showTipsText(str);
        GameMgr.receiveRewards(this.rewardArr, 2);   //领取奖励
        this.closeLayer();
    }


    /**视频免费按钮 */
    onVedioBtn(){
        AudioMgr.playBtnClickEffect();
        SDKMgr.showVedioAd(()=>{  
            //失败
            this.vedioBtn.active = false;
            ROOT_NODE.showTipsText("抱歉，视频获取异常")
        }, ()=>{
            let str = "";
            for(let i=0; i<this.rewardArr.length; ++i){
                let item = this.rewardArr[i];
                let itemStr = "获得"+item.itemCfg.name + " x " + item.count*2 + "  ";
                str += itemStr;
            }
            ROOT_NODE.showTipsText(str);
            GameMgr.receiveRewards(this.rewardArr, 2);   //领取奖励
            this.closeLayer();
        }); 
    }

    closeLayer(){
        if(this.receiveCallback){
            this.receiveCallback();
        }
        this.receiveCallback = null;

        this.node.destroy();
    }
}
