import { LDMgr, LDKey } from "./StorageManager";
import { NoticeMgr } from "./NoticeManager";
import { NoticeType } from "./Enum";


//用户数据管理
const { ccclass, property } = cc._decorator;

export var MyUserData = {
    /**以下数据需要更新到服务器 */
    GoldCount: 0,   //用户金币
    DiamondCount: 0,   //用户钻石(金锭）数
    FoodCount: 0,  //用户粮食数量

    TaskId: 1,   //当前任务ID
    TaskState: 0,    //当前任务状态 0未完成，1完成未领取，2已领取

    ItemList: [],   //背包物品列表
    
};

@ccclass
class MyUserManager {

    /**清除所有用户数据 */
    clearUserData(){
        MyUserData.GoldCount = 0;   //用户金币
        LDMgr.setItem(LDKey.KEY_GoldCount, 0);
        MyUserData.DiamondCount = 0;   //用户钻石(金锭）数
        LDMgr.setItem(LDKey.KEY_DiamondCount, 0);
        MyUserData.FoodCount = 0;   //用户粮食数量
        LDMgr.setItem(LDKey.KEY_FoodCount, 0);

        MyUserData.TaskId = 1;   //当前任务ID
        MyUserData.TaskState = 0;    //当前任务状态 0未完成，1完成未领取，2已领取
        LDMgr.setItem(LDKey.KEY_StoryData, "1-0");

        MyUserData.ItemList = new Array();   //背包物品列表
        LDMgr.setItem(LDKey.KEY_ItemList, JSON.stringify(MyUserData.ItemList));
    }

    /**初始化用户信息 */
    initUserData(){
        MyUserData.GoldCount = LDMgr.getItemInt(LDKey.KEY_GoldCount);   //用户金币
        MyUserData.DiamondCount = LDMgr.getItemInt(LDKey.KEY_DiamondCount);   //用户钻石(金锭）数
        MyUserData.FoodCount = LDMgr.getItemInt(LDKey.KEY_FoodCount);   //用户粮食数量

        let taskInfo = LDMgr.getItemKeyVal(LDKey.KEY_StoryData);  //当前任务ID
        cc.log("taskInfo = "+JSON.stringify(taskInfo));
        if(taskInfo == null){
            this.updateTaskState(1, 0);   //修改用户任务ID
        }else{
            MyUserData.TaskId = parseInt(taskInfo.key);
            MyUserData.TaskState = taskInfo.val;
        }

        MyUserData.ItemList = LDMgr.getJsonItem(LDKey.KEY_ItemList);  //背包物品列表


        cc.log("initUserData() 初始化用户信息 MyUserData = "+JSON.stringify(MyUserData));
    }

    /**修改用户金币 */
    updateUserGold(val:number, bSave: boolean = true){
        MyUserData.GoldCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_GoldCount, MyUserData.GoldCount);
        }
        NoticeMgr.emit(NoticeType.UpdateGold, null);
    }

    /**修改用户钻石 */
    updateUserDiamond(val:number, bSave: boolean = true){
        MyUserData.DiamondCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_DiamondCount, MyUserData.DiamondCount);
        }
        NoticeMgr.emit(NoticeType.UpdateDiamond, null);
    }

    /**修改用户粮食 */
    updateUserFood(val:number, bSave: boolean = true){
        MyUserData.FoodCount += val;
        if(bSave){
            LDMgr.setItem(LDKey.KEY_FoodCount, MyUserData.FoodCount);
        }
        NoticeMgr.emit(NoticeType.UpdateFood, null);
    }

    /**修改用户任务 0未完成，1完成未领取，2已领取 */
    updateTaskState(taskId: number, state: number, bSave: boolean = true){
        MyUserData.TaskId = taskId;
        MyUserData.TaskState = state;

        if(state == 2){   //2已领取，下一个任务
            MyUserData.TaskId ++;
            MyUserData.TaskState = 0;
            bSave = true;
        }

        if(bSave){
            LDMgr.setItem(LDKey.KEY_StoryData, taskId.toString()+"-"+state);
        }

        NoticeMgr.emit(NoticeType.UpdateTaskState, null);   //任务状态更新
    }


}
export var MyUserMgr = new MyUserManager();

