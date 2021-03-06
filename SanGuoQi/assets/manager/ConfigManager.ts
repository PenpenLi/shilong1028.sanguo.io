

const { ccclass } = cc._decorator;

/*** 类型定义 */
type double = number;       //64位
type int = number;          //32位
type short = number;        //16位
type char = number;         //8位
type float = number;

//***************************  以下为配置表数据结构定义 ****************************** */

//战斗配置数据
export class st_battle_info{
    name;     //战斗名称
    tower;    //营寨数量，补充血量
    town;     //箭楼数量，提高攻击力
    generals;   //敌方部曲（武将ID-等级） 1004-1;6001-3
    
    transType(){
        this.tower = parseInt(this.tower);
        this.town = parseInt(this.town);
        this.generals = CfgMgr.getKeyValAry(this.generals, ";");   //ret.push({"key":ss[0], "val":parseInt(ss[1])});
    }

    constructor(){
    }
    clone(){
        let temp = new st_battle_info();
        temp.name = this.name;
        temp.tower = this.tower;
        temp.town = this.town;
        temp.generals = this.generals;
        return temp;
    }
}

//城池配置数据
export class st_city_info {
    name;   //名称
    type;  //类型 1大城市>15，2郡城，3小郡城<5，4关隘渡口，5部落，6县城
    pos_x;   //坐标
    pos_y;
    population;  //人口（户）
    campId;   //割据后城池所属势力
    generals;   //驻守武将
    near_citys;  //相邻城池ID 102;5003;9001
    counties;   //所属县名称 昌黎;阳乐;令支
    desc;   //城池介绍
    
    transType(){
        this.type = parseInt(this.type);
        this.pos_x = parseInt(this.pos_x);
        this.pos_y = parseInt(this.pos_y);
        this.population = parseInt(this.population);
        this.campId = parseInt(this.campId);
        this.generals = CfgMgr.getIntAry(this.generals, ";");
        this.near_citys = CfgMgr.getIntAry(this.near_citys, ";");
        this.counties = CfgMgr.getStringAry(this.counties, ";");
    }

    constructor(){
    }
    clone(){
        let temp = new st_city_info();
        temp.name = this.name;
        temp.type = this.type;
        temp.pos_x = this.pos_x;
        temp.pos_y = this.pos_y;
        temp.population = this.population;
        temp.campId = this.campId;
        temp.generals = this.generals
        temp.near_citys = this.near_citys;
        temp.counties = this.counties;
        temp.desc = this.desc;
        return temp;
    }
}

//割据势力配置数据
export class st_camp_info {
    name;   //势力名称
    mainCity;  //核心城池ID
    citys;  //所属城池ID集合
    
    transType(){
        this.mainCity = parseInt(this.mainCity);
        this.citys = CfgMgr.getIntAry(this.citys, ";");
    }

    constructor(){
    }
    clone(){
        let temp = new st_camp_info();
        temp.name = this.name;
        temp.mainCity = this.mainCity;
        temp.citys = this.citys;
        return temp;
    }
}

//武将配置数据
export class st_general_info {
    name;   //武将名称
    bingzhong;   //兵种 401骑兵402刀兵403枪兵404弓兵
    hp;   //血量，最大为1000
    mp;    //智力，最大100
    atk;  //攻击，最大100
    def;   //防御，最大100
    skillNum;   //技能总数
    desc;
    
    transType(){
        this.bingzhong = parseInt(this.bingzhong);
        this.hp = parseInt(this.hp);
        this.mp = parseInt(this.mp);
        this.atk = parseInt(this.atk);
        this.def = parseInt(this.def);
        this.skillNum = parseInt(this.skillNum);
    }

    constructor(){
    }
    clone(){
        let temp = new st_general_info();
        temp.name = this.name;
        temp.bingzhong = this.bingzhong;
        temp.hp = this.hp;
        temp.mp = this.mp;
        temp.atk = this.atk;
        temp.def = this.def;
        temp.skillNum = this.skillNum;
        temp.desc = this.desc;
        return temp;
    }
}

//道具配置数据
export class st_item_info{
    name;     //战斗名称
    type;     //道具类型
    cost;     //售卖价格
    desc;     //介绍
    
    transType(){
        this.type = parseInt(this.type);
        this.cost = parseInt(this.cost);
    }

    constructor(){
    }
    clone(){
        let temp = new st_item_info();
        temp.name = this.name;
        temp.type = this.type;
        temp.cost = this.cost;
        temp.desc = this.desc;
        return temp;
    }
}

//剧情配置数据
export class st_story_info{
    type;   //剧情类型 任务类型 1 视频剧情 2主城建设 3招募士兵 4组建部曲 5参加战斗  6学习技能
    targetCity;   //目标城池
    name;   //名称
    vedio;   //视频名称 
    battleId;   //战斗ID 
    rewards;   //奖励 id-val;id-val
    generals;   //武将来投，此时不会有reward奖励
    talks;   //对话 104;105
    desc;   //剧情简介
    
    transType(){
        this.type = parseInt(this.type);
        this.targetCity = parseInt(this.targetCity);
        this.battleId = parseInt(this.battleId);
        this.rewards = CfgMgr.getKeyValAry(this.rewards, ";");   //[{"key":ss[0], "val":parseInt(ss[1])}]
        this.generals = CfgMgr.getIntAry(this.generals, ";");
        this.talks = CfgMgr.getIntAry(this.talks, ";");
    }

    constructor(){
    }
    clone(){
        let temp = new st_story_info();
        temp.type = this.type;
        temp.targetCity = this.targetCity;
        temp.name = this.name;
        temp.vedio = this.vedio;
        temp.battleId = this.battleId;
        temp.rewards = this.rewards;
        temp.generals = this.generals;
        temp.talks = this.talks;
        temp.desc = this.desc;
        return temp;
    }
}

//对话配置数据
export class st_talk_info{
    desc;   //对话内容
    city;   //目标城池
    type;   //对话类型 type 故事类型，0默认（摇旗）1起义暴乱（火） 2 战斗（双刀）
    
    transType(){
        this.city = parseInt(this.city);
        this.type = parseInt(this.type);
    }

    constructor(){
    }
    clone(){
        let temp = new st_talk_info();
        temp.type = this.type;
        temp.city = this.city;
        temp.desc = this.desc;
        return temp;
    }
}

//对话配置数据
export class st_skill_info{
    name;  //技能名称
    cost;  //技能消耗的钻石（金锭）
    mp;  //技能消耗的智力值
    hp;  //技能增加的生命值 0无作用 正值对己方作用 负值对敌方作用
    atk;  //技能增加的攻击力 0无作用 正值对己方作用 负值对敌方作用
    def;  //技能增加的防御力 0无作用 正值对己方作用 负值对敌方作用
    shiqi;  //技能增加的士气值 0无作用 正值对己方作用 负值对敌方作用
    desc;
    
    transType(){
        this.cost = parseInt(this.cost);
        this.mp = parseInt(this.mp);
        this.hp = parseInt(this.hp);
        this.atk = parseInt(this.atk);
        this.def = parseInt(this.def);
        this.shiqi = parseInt(this.shiqi);
    }

    constructor(){
    }
    clone(){
        let temp = new st_skill_info();
        temp.name = this.name;
        temp.cost = this.cost;
        temp.mp = this.mp;
        temp.hp = this.hp;
        temp.atk = this.atk;
        temp.def = this.def;
        temp.shiqi = this.shiqi;
        temp.desc = this.desc;
        return temp;
    }
}

//后宫配置数据
export class st_beautiful_info{
    name;
    desc;
    
    transType(){
    }

    constructor(){
    }
    clone(){
        let temp = new st_beautiful_info();
        temp.name = this.name;
        temp.desc = this.desc;
        return temp;
    }
}

//建筑配置数据
export class st_build_info{
    name;
    cost;
    desc;
    
    transType(){
        this.cost = parseInt(this.cost);
    }

    constructor(){
    }
    clone(){
        let temp = new st_build_info();
        temp.name = this.name;
        temp.cost = this.cost;
        temp.desc = this.desc;
        return temp;
    }
}


//*********************  以下为接口类定义 *********************************** */

@ccclass
class CfgManager_class {

    index = 0;

    overCallBack: any = null;   //加载完毕后回调
    overTarget: any = null;   //加载完毕回调注册者

    //战斗配置表
    C_battle_info : Map<number, st_battle_info> = new Map<number, st_battle_info>();
    SC_battle_info = st_battle_info;

    //城池配置表
    C_city_info : Map<number, st_city_info> = new Map<number, st_city_info>();
    SC_city_info = st_city_info;

    //势力配置表
    C_camp_info : Map<number, st_camp_info> = new Map<number, st_camp_info>();
    SC_camp_info = st_camp_info;

    //武将配置表
    C_general_info : Map<number, st_general_info> = new Map<number, st_general_info>();
    SC_general_info = st_general_info;

    //战斗配置表
    C_item_info : Map<number, st_item_info> = new Map<number, st_item_info>();
    SC_item_info = st_item_info;

    //剧情配置表
    C_story_info : Map<number, st_story_info> = new Map<number, st_story_info>();
    SC_story_info = st_story_info;

    //对话配置表
    C_talk_info : Map<number, st_talk_info> = new Map<number, st_talk_info>();
    SC_talk_info = st_talk_info;

    //技能配置表
    C_skill_info : Map<number, st_skill_info> = new Map<number, st_skill_info>();
    SC_skill_info = st_skill_info;

    //后宫配置表
    C_beautiful_info : Map<number, st_beautiful_info> = new Map<number, st_beautiful_info>();
    SC_beautiful_info = st_beautiful_info;

    //建筑配置表
    C_build_info : Map<number, st_build_info> = new Map<number, st_build_info>();
    SC_build_info  = st_build_info;

    //********************** 以下是一些配置接口 ***************** */
    
    /**获取任务配置数据 */
    getTaskConf(taskId: number): st_story_info{
        let obj = this.C_story_info[taskId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取话本配置数据 */
    getTalkConf(talkId: number): st_talk_info{
        let obj = this.C_talk_info[talkId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取城池配置数据 */
    getCityConf(cityId: number): st_city_info{
        let obj = this.C_city_info[cityId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取势力阵营配置数据 */
    getCampConf(campId: number): st_camp_info{
        let obj = this.C_camp_info[campId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取道具配置数据 */
    getItemConf(itemId: number): st_item_info{
        let obj = this.C_item_info[itemId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取武将配置数据 */
    getGeneralConf(generalId: number): st_general_info{
        let obj = this.C_general_info[generalId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取战场数据 */
    getBattleConf(battleId: number): st_battle_info{
        let obj = this.C_battle_info[battleId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取技能数据 */
    getSkillConf(skillId: number): st_skill_info{
        let obj = this.C_skill_info[skillId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取后宫数据 */
    getBeautifulConf(nvId: number): st_beautiful_info{
        let obj = this.C_beautiful_info[nvId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    /**获取建筑数据 */
    getBuildConf(buildId: number): st_build_info{
        let obj = this.C_build_info[buildId];
        if(obj){
            return obj.clone();
        }else{
            return null;
        }
    }

    //*************************************  以下为读取配置接口 *********************************** */

    /*** 加载所有配置 */
    loadAllConfig(){
        this.loadConfigList(this);
    }

    /**加载本地配置列表 */
    loadConfigList(data){
        let keys = Object.getOwnPropertyNames(data);
        data.index = 0;
        for (let k of keys) {
            if (k[0] == "C") {
                data.index++;
                let path = "config/" + k.substr(2);
                this.getConfigInfo(k, path, data);
            }
        }
    }

    //获取Config配置
    getConfigInfo(name: string, path: string, data:any) {
        cc.loader.loadRes(path, (err, resource) => {
            if (err) {
                cc.log(`配置文件${path}不存在, ${err.message}`);
                // return null;
            }
            let str: string = resource.text;   //cc.loader.getRes(resource.nativeUrl);
            this.setConfigInfoByResource(str, name, data);  //通过远程加载或本地加载获取数据后，设置配置表数据
        })
    }

    //通过远程加载或本地加载获取数据后，设置配置表数据
    setConfigInfoByResource(str:string, name: string, data:any){
        let self = data;
        if (str) {
            let sc = data["S" + name];
            
            if (typeof str != "string") {
                cc.error("load config " + name + " error!");
            } else {

                let sList;
                if (str.indexOf("\r\n") < 0) {
                    sList = str.split("\n");
                } else {
                    sList = str.split("\r\n");
                }
                let retObj = {};

                let subObj = retObj;

                for (let line of sList) {
                    if (line != null && line.length > 0) {
                        if (line[0] == "#") {
                            continue;
                        }

                        if (line[0] == "[") {
                            if(sc != null){
                                subObj = new sc;
                            }else{
                                subObj = {};
                            }

                            let objName = line.substr(1, line.length - 2);
                            retObj[objName] = subObj;
                            continue;
                        }

                        let sk = line.split("=");
                        if (sk.length > 1) {
                            let k = sk[0].trim();
                            let v = sk[1].trim();
                            subObj[k] = v;
                        }
                    }
                }

                if(subObj["transType"] != null){
                    // subObj["transType"]();
                    for(let o in retObj){
                        retObj[o]["transType"]();
                    }

                }

                self[name] = retObj;
                cc.log("load config " + name + " finsih! length:" + str.length);
            }
        }

        self.index--;
        if (self.index <= 0) {
            cc.log("load all config finsih!");

            if(this.overCallBack && this.overTarget){
                this.overCallBack.call(this.overTarget, null);
            }
            this.overCallBack = null;
            this.overTarget = null;
        }
    }

    //设置加载配置完毕回调
    setOverCallback(callback: any, target: any){
        this.overCallBack = callback;
        this.overTarget = target;
    }


    //************  以下是一些常用解析方法 ************ */

    /**解析字符串，获取整形数组 */
	getIntAry(str: string, sp: string = "|"): Array<number> {
		let ret: Array<number> = [];
		let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
				ret.push(parseInt(p));
			}
		}
		return ret;
    }

    /**解析复杂的字符串，获取整形数组 */
	getKeyValAry(str: string, sp: string = "|", sp2: string = "-"): Array<any> {
		let ret: Array<any> = [];
        let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
                let ss = p.toString().split(sp2);
                if(ss[0] && ss[1]){
                    ret.push({"key":ss[0], "val":parseInt(ss[1])});
                }
			}
        }
		return ret;
    }
    
	/**解析字符串，获取字符串数组 */
	getStringAry(str: string, sp: string = "|"): Array<string> {
		let ret: Array<string> = [];
		let sL = str.toString().split(sp);
		for (let p of sL) {
			if (p.length > 0) {
				ret.push(p);
			}
		}
		return ret;
    }
}

export var CfgMgr = new CfgManager_class();



