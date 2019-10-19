import SignCell from "./signCell";
import { MyUserData, MyUserDataMgr } from "../manager/MyUserData";
import { GameMgr } from "../manager/GameManager";
import { AudioMgr } from "../manager/AudioMgr";
import { ROOT_NODE } from "../common/rootNode";
import { CfgMgr } from "../manager/ConfigManager";
import { BallInfo, NoticeType, ItemInfo } from "../manager/Enum";
import { NotificationMy } from "../manager/NoticeManager";


//签到页面
const {ccclass, property} = cc._decorator;

@ccclass
export default class SignLayer extends cc.Component {

    @property(cc.Node)
    singGrid: cc.Node = null;   //1-6天签到cell
    @property(cc.Node)
    lastSighCell: cc.Node = null;   //第七天签到
    @property(cc.Button)
    signBtn: cc.Button = null;
      
    @property(cc.Prefab)
    pfSignCell: cc.Prefab = null;

    curSelCell: SignCell = null;

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {
        this.setBtnGray();

        if(MyUserData.lastSignIdx >= 7){   //1-7
            if(GameMgr.isSameDayWithCurTime(MyUserData.lastSignTime) == false){  //非同一天
                MyUserDataMgr.updateUserSign(0, 0);   //循环签到
            }
        }

        for(let i=1; i<=7; ++i){
            let signCell = cc.instantiate(this.pfSignCell)
            if(i == 7){
                this.lastSighCell.addChild(signCell);
            }else{
                this.singGrid.addChild(signCell);
            }
            signCell.getComponent(SignCell).initSignCell(i, this);
        }
    }

    // update (dt) {}

    setBtnGray(bGray: boolean = true){
        let bInteractable = !bGray;
        this.signBtn.interactable = bInteractable;
    }

    onSelectSignCell(cell: SignCell){
        this.curSelCell = cell;
        this.setBtnGray(false);
    }
    

    onCloseBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.node.removeFromParent(true);
    }

    onSignBtn(){
        AudioMgr.playEffect("effect/ui_click");
        if(this.curSelCell && this.curSelCell.signIdx > 0 && this.curSelCell.signData){
            this.setBtnGray();
            this.curSelCell.onSigned();
       
            if(this.curSelCell.signData.type == 1){   //金币
                let gold = this.curSelCell.signData.num;
                ROOT_NODE.showTipsText("获得金币："+gold);
                MyUserDataMgr.updateUserGold(gold);
            }else if(this.curSelCell.signData.type == 2){   //钻石
                let diamond = this.curSelCell.signData.num;
                ROOT_NODE.showTipsText("获得钻石："+diamond);
                MyUserDataMgr.updateUserDiamond(diamond);
            }else if(this.curSelCell.signData.type == 3){   //饰品道具
                let itemId = this.curSelCell.signData.rewardId;
                let itemCfg = CfgMgr.getItemConf(itemId);
                if(itemCfg){
                    ROOT_NODE.showTipsText("获得："+itemCfg.name);
                    MyUserDataMgr.addItemToItemList(new ItemInfo(itemId), true);  //修改用户背包物品列表
                    NotificationMy.emit(NoticeType.UpdateItemList, null);   //刷新道具
                }
            }else if(this.curSelCell.signData.type == 4){   //武器
                let weaponId = this.curSelCell.signData.rewardId;
                let weaponCfg = CfgMgr.getCannonConf(weaponId);
                if(weaponCfg){
                    ROOT_NODE.showTipsText("获得："+weaponCfg.name);
                    let ballInfo = new BallInfo(weaponId);
                    MyUserDataMgr.addBallToBallList(ballInfo.clone(), true);  //添加小球到未出战列表
                    NotificationMy.emit(NoticeType.BuyAddBall, ballInfo.clone());  //购买小球
                }
            }

            MyUserDataMgr.updateUserSign(this.curSelCell.signIdx, new Date().getTime());   ////更新签到数据
        }
    }

}