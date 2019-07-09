

const { ccclass } = cc._decorator;

/*** 类型定义 */
type double = number;       //64位
type int = number;          //32位
type short = number;        //16位
type char = number;         //8位
type float = number;

//***************************  以下为配置表数据结构定义 ****************************** */

//配置数据
export class st_rubbish_info{
    name;     //名称
    type;    //类型，1有害垃圾，2可回收垃圾， 3湿垃圾，4干垃圾
    typeName;   //类型名称
    desc;   //垃圾描述
    
    transType(){
        this.type = parseInt(this.type);
    }
}



//*********************  以下为接口类定义 *********************************** */

@ccclass
class CfgManager_class {

    index = 0;

    overCallBack: any = null;   //加载完毕后回调
    overTarget: any = null;   //加载完毕回调注册者

    //战斗配置表
    C_rubbish_info : Map<number, st_rubbish_info> = new Map<number, st_rubbish_info>();
    SC_rubbish_info = st_rubbish_info;


    //********************** 以下是一些配置接口 ***************** */
    
    /**获取任务配置数据 */
    getRubbishConf(id: number): st_rubbish_info{
        return this.C_rubbish_info[id];
    }

    //*************************************  以下为读取配置接口 *********************************** */

    /*** 加载指定配置 */
    loadConfig() {
        //  加载关卡配置
        this.getConfigInfo("C_general_info", "config/general_info", this);
    }

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
                cc.error("load config " + name + "error!");
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
                cc.log("load config " + name + "finsih! length:" + str.length);
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


