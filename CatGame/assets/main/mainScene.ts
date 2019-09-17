import { NotificationMy } from "../manager/NoticeManager";
import { NoticeType, PlayerInfo} from "../manager/Enum";
import { SDKMgr } from "../manager/SDKManager";
import { AudioMgr } from "../manager/AudioMgr";
import { GameMgr } from "../manager/GameManager";
import { ROOT_NODE } from "../common/rootNode";
import { MyUserDataMgr, MyUserData } from "../manager/MyUserData";
import ChapterPage from "./chapterPage";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MainScene extends cc.Component {

    @property(cc.Node)
    bottomNode: cc.Node = null;
    @property(cc.Node)
    topNode: cc.Node = null;

    @property(cc.Node)
    shareBtn: cc.Node = null;  //分享
    @property(cc.Label)
    labGold: cc.Label = null;   //玩家金币数
    @property(cc.Label)
    labLv: cc.Label = null; 
    @property(cc.Label)
    labDiamond: cc.Label = null; 
    @property(cc.Label)
    levelLabel: cc.Label = null;    //第几关

    @property(cc.PageView)
    chapterPageView: cc.PageView = null;
    @property(cc.Node)
    leftArrowNode: cc.Node = null;
    @property(cc.Node)
    rightArrowNode: cc.Node = null;

    @property(cc.Prefab)
    pfShop: cc.Prefab = null;  //小球商店
    @property(cc.Prefab)
    pfPage: cc.Prefab = null;    //章节页签

    bLoadRoleDataFinish: boolean = false;   //是否已经加载完毕用户数据
    curChapterIdx: number = 0;   //当前章节索引

    onLoad(){
        this.bLoadRoleDataFinish = false;  //是否已经加载完毕用户数据
        
        cc.game.on(cc.game.EVENT_SHOW, this.onShow, this);
        cc.game.on(cc.game.EVENT_HIDE, this.onHide, this);

        NotificationMy.on(NoticeType.UpdateGold, this.UpdateGold, this);  //金币更新

        this.shareBtn.active = false;  //分享
        if(SDKMgr.WeiChat){
            this.shareBtn.active = true;  //分享
            //sdkWechat.createBannerWithWidth("adunit-7c748fc257f96483");
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
        this.initCombineData();   //初始化数据
    }

    /**初始化数据 */
    initCombineData () {
        this.bLoadRoleDataFinish = true;  //是否已经加载完毕用户数据
        this.UpdateGold();   //更新金币数量
        this.initPageView();
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

    //购买炮台
    handleBuyPlayer(playerInfo: PlayerInfo){
        if(playerInfo){
            if(MyUserData.GoldCount >= playerInfo.playerCfg.cost){
                MyUserDataMgr.updateUserGold(-playerInfo.playerCfg.cost);
                MyUserDataMgr.addPlayerToPlayerList(playerInfo);   //添加新炮台到拥有的炮列表
                NotificationMy.emit(NoticeType.UpdatePlayer, null);  //更新炮台显示
            }else{
                ROOT_NODE.showGoldAddDialog();  //获取金币提示框
            }
        }
    }

    initPageView(){
        for(let i=0; i<10; ++i){
            let page = cc.instantiate(this.pfPage);
            this.chapterPageView.addPage(page);
            page.getComponent(ChapterPage).initChapterPage(i);
        }

        this.curChapterIdx = 0;   //当前章节索引
        this.leftArrowNode.active = false;
    }

    // 监听事件
    onPageEvent (sender, eventType) {
        // 翻页事件
        if (eventType !== cc.PageView.EventType.PAGE_TURNING) {
            return;
        }
        console.log("当前所在的页面索引:" + sender.getCurrentPageIndex());
        this.curChapterIdx = sender.getCurrentPageIndex();   //当前章节索引
        this.handleMovePage();
    }

    onLeftPageBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.curChapterIdx --;  //当前章节索引
        this.handleMovePage();
        this.chapterPageView.scrollToPage(this.curChapterIdx, 0.1);
    }

    onRightPageBtn(){
        AudioMgr.playEffect("effect/ui_click");

        this.curChapterIdx ++;   //当前章节ID
        this.handleMovePage();
        this.chapterPageView.scrollToPage(this.curChapterIdx, 0.1);
    }

    handleMovePage(){
        if(this.curChapterIdx <= 0){
            this.curChapterIdx = 0;
            this.leftArrowNode.active = false;
        }else if(this.curChapterIdx >= 9){
            this.curChapterIdx = 9;
            this.rightArrowNode.active = false;
        }else{
            this.leftArrowNode.active = true;
            this.rightArrowNode.active = true;
        }
    }

    onShopBtn(){
        AudioMgr.playEffect("effect/ui_click");

    }

    onBagBtn(){
        AudioMgr.playEffect("effect/ui_click");

    }

    /**出战按钮 */
    onFightBtn(){
        AudioMgr.playEffect("effect/ui_click");

    }

    onShareBtn(){
        AudioMgr.playEffect("effect/ui_click");

        SDKMgr.shareGame("分享快乐", (succ:boolean)=>{
            console.log("loginScene 分享 succ = "+succ);
            if(succ == true){
            }
        }, this);
    }

    onSetBtn(){
        AudioMgr.playEffect("effect/ui_click");

    }



}

