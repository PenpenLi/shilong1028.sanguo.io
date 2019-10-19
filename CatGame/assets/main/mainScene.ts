import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, TipsStrDef } from "../manager/Enum";
import { SDKMgr } from "../manager/SDKManager";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { MyUserData } from "../manager/MyUserData";
import { sdkWechat } from "../manager/SDK_Wechat";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;
    @property(cc.PageView)
    midPageView: cc.PageView = null;
    @property(cc.Node)
    bagNode: cc.Node = null;
    @property(cc.Node)
    shopNode: cc.Node = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;  //分享
    @property(cc.Label)
    labGold: cc.Label = null;   //玩家金币数
    @property(cc.Label)
    labDiamond: cc.Label = null;    //玩家钻石数

    @property(cc.Sprite)
    musicSpr: cc.Sprite = null;   //背景音乐控制按钮图标
    @property(cc.SpriteFrame)
    musicCloseFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    musicOpenFrame: cc.SpriteFrame = null;

    @property(cc.Sprite)
    bagBtnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    mapBtnSpr: cc.Sprite = null;
    @property(cc.Sprite)
    shopBtnSpr: cc.Sprite = null;
    @property(cc.SpriteFrame)
    whiteFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    yellowFrame: cc.SpriteFrame = null;

    @property(cc.Prefab)
    pfSign: cc.Prefab = null;  //签到页面

    curPageIdx: number = -1;  
    bLoadRoleDataFinish: boolean = false;   //是否已经加载完毕用户数据
    curMidUIType: number = -1;   //显示中间UI，0地图关卡、1背包炮台、2商店

    onLoad(){
        GameMgr.adaptBgByScene(this.topNode, this.bottomNode);   //场景背景图适配
        
        this.bLoadRoleDataFinish = false;  //是否已经加载完毕用户数据
        
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        NotificationMy.on(NoticeType.UpdateGold, this.UpdateGold, this);  //金币更新
        NotificationMy.on(NoticeType.UpdateDiamond, this.UpdateDiamond, this);   //更新钻石显示

        this.shareBtn.active = false;  //分享
        if(SDKMgr.WeiChat){
            this.shareBtn.active = true;  //分享
        }
    }

    onDestroy(){
        NotificationMy.offAll(this);
        this.node.targetOff(this);
    }

    /**后台切回前台 */
    onShow() {
        cc.log("************* onShow() 后台切回前台 ***********************")
        //NotificationMy.emit(NoticeType.GameResume, null);  //继续游戏
        cc.game.resume();
    }

    /**游戏切入后台 */
    onHide() {
        cc.log("_____________  onHide()游戏切入后台  _____________________")
        //NotificationMy.emit(NoticeType.GAME_ON_HIDE, null);
        //NotificationMy.emit(NoticeType.GamePause, null);   //游戏暂停，停止小球和砖块的动作，但动画特效不受影响
        cc.game.pause();
    }

    start(){  
        this.bLoadRoleDataFinish = true;  //是否已经加载完毕用户数据

        this.showMusicSpr();

        this.UpdateGold();  
        this.UpdateDiamond();  

        this.showMidUI(0, 0.01);   //显示中间信息，0地图关卡、1背包炮台、2商店

        if(GameMgr.isSameDayWithCurTime(MyUserData.lastSignTime) == false){  //同一天
            this.onSignBtn();
        }

        this.node.runAction(cc.sequence(cc.delayTime(5.0), cc.callFunc(function(){
            sdkWechat.preLoadAndPlayVideoAd(true, null, null, null);   //预下载下一条视频广告
        })))
    }

    // update (dt) {
    // }

    /**更新金币数量 */
    UpdateGold(){
        let valStr = GameMgr.num2e(MyUserData.GoldCount);
        this.labGold.string = valStr;  //金币数量

        this.labGold.node.stopAllActions();
        this.labGold.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    }

    //更新钻石显示
    UpdateDiamond(){
        let valStr = GameMgr.num2e(MyUserData.DiamondCount);
        this.labDiamond.string = valStr;  

        this.labDiamond.node.stopAllActions();
        this.labDiamond.node.runAction(cc.sequence(cc.scaleTo(0.1, 1.3), cc.scaleTo(0.1, 1.0)));
    } 

    //显示底部按钮选中状态
    showBtnSprFrame(bSel: boolean){
        let sprFrame = this.whiteFrame;
        if(bSel == true){
            sprFrame = this.yellowFrame;
        }

        if(this.curMidUIType == 0){  //显示中间UI，0地图关卡、1背包炮台、2商店
            this.mapBtnSpr.spriteFrame = sprFrame;
        }else if(this.curMidUIType == 1){
            this.bagBtnSpr.spriteFrame = sprFrame;
        }else if(this.curMidUIType == 2){
            this.shopBtnSpr.spriteFrame = sprFrame;
        }
    }

    /**显示中间信息，0地图关卡、1背包炮台、2商店 */
    showMidUI(uiType: number, moveTime: number=0.05){
        if(this.curMidUIType == uiType){
            return;
        }

        this.showBtnSprFrame(false);
        this.curMidUIType = uiType;   //显示中间UI，0地图关卡、1背包炮台、2商店
        this.showBtnSprFrame(true);
        
        if(this.curMidUIType == 0){   //地图关卡
            this.curPageIdx = 1;
        }else if(this.curMidUIType == 1){  //背包炮台
            this.curPageIdx = 0;
            NotificationMy.emit(NoticeType.UpdateBagGrid, null);    //更新背包显示
        }else{  //商店
            this.curPageIdx = 2;
        }
        if(moveTime > 0){
            this.midPageView.scrollToPage(this.curPageIdx, moveTime);
        }
    }

    // 监听事件
    onMidPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        this.curPageIdx = sender.getCurrentPageIndex();   //当前章节索引
        let uiType = 0;
        if(this.curPageIdx == 1){   //地图关卡
            uiType = 0;
        }else if(this.curPageIdx == 0){  //背包炮台
            uiType = 1;
        }else{  //商店
            uiType = 2;
        }
        this.showMidUI(uiType); 
    } 

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        SDKMgr.shareGame(TipsStrDef.KEY_Share, (succ:boolean)=>{
            console.log("loginScene 分享 succ = "+succ);
            if(succ == true){
            }
        }, this);
    }

    onShopBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.showMidUI(2);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }
    onMapBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.showMidUI(0);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }
    onBagBtn(){
        AudioMgr.playEffect("effect/ui_click");
        this.showMidUI(1);   //显示中间信息，0地图关卡、1背包炮台、2商店
    }

    onAddGoldBtn(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.showGoldAddDialog();  //获取金币提示框
    }

    onSignBtn(){
        AudioMgr.playEffect("effect/ui_click");
        GameMgr.showLayer(this.pfSign);
    }

    /**音乐开关 */
    onMusicBtn(){
        AudioMgr.playEffect("effect/ui_click");

        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        keyVal = 1- keyVal;
        AudioMgr.setMusicOnOffState(keyVal);
        this.showMusicSpr();
    }

    showMusicSpr(){
        let keyVal = AudioMgr.getMusicOnOffState();   //获取音效总开关状态
        if(keyVal == 0){     //现在为开启状态，按钮显示开启图标
            this.musicSpr.spriteFrame = this.musicOpenFrame;
        }else{ 
            this.musicSpr.spriteFrame = this.musicCloseFrame;
        }
    }

}

