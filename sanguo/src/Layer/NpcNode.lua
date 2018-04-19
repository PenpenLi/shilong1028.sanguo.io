
--NpcNode用于构造静态展示模型，比如城池展示模型、跳转点、战场营寨等
local NpcNode = class("NpcNode", CCLayerEx) --填入类名

function NpcNode:create()   --自定义的create()创建方法
    --G_Log_Info("NpcNode:create()")
    local layer = NpcNode.new()
    return layer
end

function NpcNode:onExit()
    --G_Log_Info("NpcNode:onExit()")
    self:DelAtkLimitUpdateEntry()   --战场营寨自动探测敌军计时器
end

function NpcNode:init()  
    --G_Log_Info("NpcNode:init()")
end

--城池NPC
function NpcNode:initChengData(data)  
    --G_Log_Info("NpcNode:initChengData()")
    local imgStr = "public2_chengchi.png"
    if data.type == 1 then
    	imgStr = "public2_dushi.png"
    elseif data.type == 2 then
    	imgStr = "public2_chengchi.png"
    elseif data.type == 3 then
    	imgStr = "public2_guanai.png"
    end
	self.chengImage = cc.Sprite:createWithSpriteFrameName(imgStr) 
	self.chengImage:setScale(0.8)
	self:addChild(self.chengImage)  
	local imgSize = self.chengImage:getContentSize()
	self:setContentSize(imgSize)

	local textSize = cc.size(imgSize.width*2, g_defaultChengFontSize + 6)
    self.chengName = cc.Label:createWithTTF(data.name, g_sDefaultTTFpath, g_defaultChengFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.chengName:setColor(g_ColorDef.Yellow)
    self.chengName:enableBold()   --加粗
    --self.chengName:enableShadow()   --阴影
    self.chengName:enableOutline(g_ColorDef.DarkRed, 1)   --描边
    self:addChild(self.chengName, 5)  
end

--跳转点NPC
function NpcNode:initMapJumpPtData(data)  
	--G_Log_Info("NpcNode:initMapJumpPtData()")
	self.Imod = ImodAnim:create()
	self.Imod:initAnimWithName("Ani/chuansong.png", "Ani/chuansong.ani")
	self.Imod:setScale(0.8)
	self.Imod:PlayActionRepeat(0)
	self:addChild(self.Imod)

	local modSize = self.Imod:getContentSize()
	self:setContentSize(modSize)

	local textSize = cc.size(modSize.width*2, g_defaultJumpPtFontSize + 6)
    self.jumpPtName = cc.Label:createWithTTF(data.desc, g_sDefaultTTFpath, g_defaultJumpPtFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    self.jumpPtName:setColor(g_ColorDef.Yellow)
    self:addChild(self.jumpPtName, 5)  
end

------------------------------战场营寨----------------------------------------------------
function NpcNode:initYingZhaiData(data, parent)  
    --G_Log_Info("NpcNode:initYingZhaiData()")
    if data == nil then
        return 
    end

    self.yingzhaiData = data
    self.parentMapPage = parent   --节点所在的战场地图层

    local quanStr = "public2_quanPurple.png"   --敌方紫色圈
    local qizhiStr = "public2_QiZhi2.png"
    if data.bEnemy == 0 then  --我方篮圈
        quanStr = "public2_quanBlue.png"
        qizhiStr = "public2_QiZhi1.png"
    end

    self.quanImage = cc.Sprite:createWithSpriteFrameName(quanStr)   
    self.maxScale = g_AtkLimitLen.yingzhaiLen/self.quanImage:getContentSize().width   --500像素内可见
    self.minScale = self.maxScale*0.7
    self.quanImage:setScale(self.maxScale) 
    self:addChild(self.quanImage) 

    --闪动放缩
    local SequenceAction = cc.Sequence:create(cc.ScaleTo:create(0.5, self.minScale), cc.ScaleTo:create(0.5, self.maxScale))    --scaleAction:reverse()
    self.quanImage:runAction(cc.RepeatForever:create(SequenceAction))

    local imgStr = "public2_yingzhai2.png"  
    if data.type >= 1 and data.type <= 3 then  --1前锋2左军3右军4后卫5中军
        imgStr = "public2_yingzhai2.png"
    elseif data.type == 4 then
        imgStr = "public2_yingzhai3.png"
    elseif data.type == 5 then 
        imgStr = "public2_yingzhai1.png"  --中军
    end

    self.yingzhaiImage = cc.Sprite:createWithSpriteFrameName(imgStr) 
    --self.yingzhaiImage:setScale(0.8)
    self:addChild(self.yingzhaiImage)  
    local imgSize = self.yingzhaiImage:getContentSize()
    self:setContentSize(imgSize)

    local textSize = cc.size(imgSize.width*2, g_defaultChengFontSize + 6)
    self.yingzhaiName = cc.Label:createWithTTF(data.name, g_sDefaultTTFpath, g_defaultChengFontSize, textSize, cc.TEXT_ALIGNMENT_CENTER, cc.VERTICAL_TEXT_ALIGNMENT_CENTER)
    if data.bEnemy == 0 then  --我方
        self.yingzhaiName:setColor(g_ColorDef.Blue)
    else
        self.yingzhaiName:setColor(g_ColorDef.Red)
    end
    self.yingzhaiName:setPosition(cc.p(imgSize.width/2, -10))
    self.yingzhaiName:enableBold()   --加粗
    self.yingzhaiName:enableShadow()   --阴影
    --self.yingzhaiName:enableOutline(g_ColorDef.White, 1)   --描边
    self.yingzhaiImage:addChild(self.yingzhaiName, 5)  

    self.qizhiImage = cc.Sprite:createWithSpriteFrameName(qizhiStr) 
    self.qizhiImage:setPosition(cc.p(imgSize.width/2 + self.qizhiImage:getContentSize().width/2, imgSize.height + 10))
    self.yingzhaiImage:addChild(self.qizhiImage) 

    ----------------------
    self.enemyNode = nil   --攻击中的敌方部曲

    self:DelAtkLimitUpdateEntry()

    local function atkLimitUpdate(dt)
        self:atkLimitUpdate(dt)
    end
    self.atkLimitEntry = g_Scheduler:scheduleScriptFunc(atkLimitUpdate, 0.01, false) 
end

function NpcNode:getNodePos()
    return cc.p(self:getPosition())
end

--战场营寨自动探测敌军计时器
function NpcNode:DelAtkLimitUpdateEntry()
    if self.atkLimitEntry then
        g_Scheduler:unscheduleScriptEntry(self.atkLimitEntry)
        self.atkLimitEntry = nil
    end
end

function NpcNode:atkLimitUpdate(dt)
    if self.parentMapPage then   --节点所在的战场地图层
        local bCatchEnemy = false
        if self.enemyNode then    --攻击对象节点 
            local curPos = self:getNodePos()
            local enemyPos = self.enemyNode:getNodePos()
            local len = g_pMapMgr:CalcDistance(curPos, enemyPos)  
            if len < g_AtkLimitLen.unitLen then
                bCatchEnemy = true
            end
        end
        if bCatchEnemy == false then
            self.enemyNode = self.parentMapPage:checkEnemyUnit(self)
        end
    end
end

------------------------------战场营寨----------------------------------------------------


return NpcNode
