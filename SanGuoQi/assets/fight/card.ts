
import { CardInfo } from "../manager/Enum";

//卡牌节点
const {ccclass, property} = cc._decorator;

@ccclass
export default class Card extends cc.Component {

    @property(cc.Sprite)
    cardSpr: cc.Sprite = null;

    @property(cc.Sprite)
    campSpr: cc.Sprite = null;

    @property(cc.SpriteAtlas)
    cardAtlas: cc.SpriteAtlas = null;

    @property([cc.SpriteFrame])
    campFrames: cc.SpriteFrame[] = new Array(3);

    @property(cc.ProgressBar)
    hpProgressBar: cc.ProgressBar =  null;   //血量条（最大值1000）

    @property(cc.ProgressBar)
    mpProgressBar: cc.ProgressBar =  null;   //智力条（最大值100）

    @property(cc.ProgressBar)
    atkProgressBar: cc.ProgressBar =  null;   //攻击条（最大值100）

    @property(cc.ProgressBar)
    defProgressBar: cc.ProgressBar =  null;   //防御条（最大值100）

    @property(cc.Label)
    nameLable: cc.Label = null;

    @property(cc.Sprite)
    bingSpr: cc.Sprite = null;   //兵种 401骑兵402步兵403弓兵

    @property([cc.SpriteFrame])
    bingSprFrames: cc.SpriteFrame[] = new Array(3);

    cardInfo: CardInfo = null;    //卡牌信息

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.cardSpr.node.opacity = 0;
        this.campSpr.node.opacity = 0;
        this.hpProgressBar.progress = 0;
        this.mpProgressBar.progress = 0;
        this.atkProgressBar.progress = 0;
        this.defProgressBar.progress = 0;
        this.nameLable.string = "";
        this.bingSpr.node.opacity = 0;
    }

    onDestroy(){

    }

    start () {

    }

    // update (dt) {}

    /**设置卡牌数据 */
    setCardData(info: CardInfo){
        this.cardInfo = info;

        if(this.cardInfo.campId == 1){  //阵营，0默认，1蓝方，2红方
            this.nameLable.node.color = cc.color(0, 0, 255);
            this.campSpr.spriteFrame = this.campFrames[1];
            this.campSpr.node.opacity = 255;
        }else if(this.cardInfo.campId == 2){
            this.nameLable.node.color = cc.color(255, 0, 0);
            this.campSpr.spriteFrame = this.campFrames[2];
            this.campSpr.node.opacity = 255;
        }else{
            this.nameLable.node.color = cc.color(255, 255, 255);
        }

        let idstr = this.cardInfo.cardCfg.id_str;
        this.cardSpr.spriteFrame = this.cardAtlas.getSpriteFrame(idstr);
        this.cardSpr.node.opacity = 255;

        this.nameLable.string = this.cardInfo.cardCfg.name;
        let nType = this.cardInfo.cardCfg.bingzhong - 400;
        this.bingSpr.spriteFrame = this.bingSprFrames[nType-1];
        this.bingSpr.node.opacity = 255;

        this.hpProgressBar.progress = this.cardInfo.cardCfg.hp/1000;
        this.mpProgressBar.progress = this.cardInfo.cardCfg.mp/100;
        this.atkProgressBar.progress = this.cardInfo.cardCfg.atk/100;
        this.defProgressBar.progress = this.cardInfo.cardCfg.def/100;

    }


}