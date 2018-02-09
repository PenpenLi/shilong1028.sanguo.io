
--BattleMapLayer用于显示战斗（PVP)地图及点击处理等
local BattleMapLayer = class("BattleMapLayer", CCLayerEx) --填入类名

local NpcNode = require "Layer.NpcNode"

function BattleMapLayer:create()   --自定义的create()创建方法
    --G_Log_Info("BattleMapLayer:create()")
    local layer = BattleMapLayer.new()
    return layer
end

function BattleMapLayer:onExit()
    --G_Log_Info("BattleMapLayer:onExit()")
end

function BattleMapLayer:init()  
    --G_Log_Info("BattleMapLayer:init()")
    --ClearMapObj不清除的数据
    self.rootNode = nil    --根节点
    self.mapConfigData = nil  --地图表配置数据 
	self.movePathMapByMap = nil  --跨地图跳转数据

    -------ClearMapObj清除的数据----------


    self:initTouchEvent()   --注册点击事件
end

function BattleMapLayer:ClearMapObj()
	self.rootNode:removeAllChildren()
    self.rootNode:setPosition(cc.p(0,0))

end

function BattleMapLayer:ShowBattleMapImg(battleMapId, zhenXingData)  
    G_Log_Info("BattleMapLayer:ShowBattleMapImg() battleMapId = %d", battleMapId)
    collectgarbage("collect")
    -- avoid memory leak
    collectgarbage("setpause", 100)
    collectgarbage("setstepmul", 5000)
    math.randomseed(os.time())

    g_pGameLayer:showLoadingLayer(true) 

    self.mapConfigData = nil
    self.mapConfigData = g_pMapMgr:LoadMapStreamData(battleMapId)  --地图表配置数据 
    if self.mapConfigData == nil then
    	G_Log_Error("MapLayer--mapConfigData = nil")
    	return
    end
    --G_Log_Dump(self.mapConfigData, "self.mapConfigData = ")
    if not self.rootNode then
    	self.rootNode = cc.Node:create()
    	self:addChild(self.rootNode)
    end

    self:ClearMapObj()

    self.rootNode:setContentSize(cc.size(self.mapConfigData.width, self.mapConfigData.height))
    --self.rootNode:setPosition(cc.p((g_WinSize.width - self.mapConfigData.width)/2, (g_WinSize.height - self.mapConfigData.height)/2))

    local imgCount = self.mapConfigData.img_count
    local imgName = self.mapConfigData.path

    local imgWidth = 512  --self.mapConfigData.width / self.mapConfigData.column
    local imgHeight = 512   --self.mapConfigData.height / self.mapConfigData.row

    local posX = 0
	local posY = self.mapConfigData.height

	for i=1, imgCount do
		local str = string.format("Map/%s/images/%s_%d.jpg", imgName, imgName, i)
		local Spr = cc.Sprite:create(str)
		if Spr == nil then
			G_Log_Error("MapLayer--mapImg = nil, mapName = %s, idx = %d, str = %s", imgName, i, str)
		end
		Spr:setAnchorPoint(cc.p(0, 1))
		Spr:setPosition(cc.p(posX, posY))
		self.rootNode:addChild(Spr, 1)
		--G_Log_Info("idx = %d, posX = %d, posY = %d", i, posX, posY)

		if i%self.mapConfigData.column == 0 then
			posX = 0
			posY = posY - imgHeight
		else
			posX = posX + imgWidth
		end
	end

	--添加城池(0我方营寨,1敌方营寨)
	self.myYingZhaiVec = {}
	self.enemyYingZhaiVec = {}
	for k, yingzhaiId in pairs(self.mapConfigData.cityIdStrVec) do
		local yingzhaiData = g_pTBLMgr:getBattleYingZhaiTBLDataById(yingzhaiId)
		if yingzhaiData then
		    local yingzhai = NpcNode:create()
		    yingzhai:initYingZhaiData(yingzhaiData)
		    self.rootNode:addChild(yingzhai, 10)

		    local pos = cc.p(yingzhaiData.map_posX, self.mapConfigData.height - yingzhaiData.map_posY)    --以左上角为00原点转为左下角为原点的像素点
		    yingzhai:setPosition(pos)
		end
	end

	g_pGameLayer:showLoadingLayer(false) 
end

function BattleMapLayer:onTouchBegan(touch, event)
    G_Log_Info("BattleMapLayer:onTouchBegan()")
    local beginPos = touch:getLocation()   --直接从touch中获取,在getLocation()源码里会将坐标转成OpenGL坐标系,原点在屏幕左下角，x轴向右，y轴向上
    --local point = touch:getLocationInView() --获得屏幕坐标系,原点在屏幕左上角，x轴向右，y轴向下
    --point = cc.Director:getInstance():convertToGL(point)  --先获得屏幕坐标，在调用convertToGL转成OpenGl坐标系
    self:setRoleWinPosition(beginPos)
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end


--中心视角在屏幕上的坐标（点击触发）
function BattleMapLayer:setRoleWinPosition(winPos)
	local rootNodePos = cc.p(self.rootNode:getPosition())
	local rolePos = cc.p(winPos.x - rootNodePos.x, winPos.y - rootNodePos.y)
	if rolePos.x > self.mapConfigData.width then
		rolePos.x = self.mapConfigData.width
	end
	if rolePos.y > self.mapConfigData.height then
		rolePos.y = self.mapConfigData.height
	end

	self:showTouchImg(rolePos)

	self:setRoleMapPosition(rolePos)
end

--中心视角在地图上的坐标
function BattleMapLayer:setRoleMapPosition(rolePos)
	if rolePos.x > self.mapConfigData.width then
		rolePos.x = self.mapConfigData.width
	elseif rolePos.x < 0 then
		rolePos.x = 0
	end
	if rolePos.y > self.mapConfigData.height then
		rolePos.y = self.mapConfigData.height
	elseif rolePos.y < 0 then
		rolePos.y = 0
	end

	self:resetRootNodePos(rolePos)
end

--以主角为屏幕中心，适配地图
function BattleMapLayer:resetRootNodePos(rolePos, moveTime)
	local rootPos = cc.p(0,0)

	if rolePos.x >= self.mapConfigData.width - g_WinSize.width/2 then
		rootPos.x = g_WinSize.width - self.mapConfigData.width
	elseif rolePos.x >= g_WinSize.width/2 then
		rootPos.x = g_WinSize.width/2 - rolePos.x
	end

	if rolePos.y >= self.mapConfigData.height - g_WinSize.height/2 then
		rootPos.y = g_WinSize.height -self.mapConfigData.height
	elseif rolePos.y >= g_WinSize.height/2 then
		rootPos.y = g_WinSize.height/2 - rolePos.y
	end
	--G_Log_Info("BattleMapLayer:resetRootNodePos, rootPos.x = %f, rootPos.y = %f", rootPos.x, rootPos.y)

	if moveTime then
		self.rootNode:runAction(cc.MoveTo:create(moveTime, rootPos))
	else
		self.rootNode:setPosition(rootPos)
	end
end

function BattleMapLayer:showTouchImg(pos)
    if(self.m_touchImg == nil)then   --点击屏幕时的显示图片
        self.m_touchImg = cc.Sprite:create("Image/Image_Click1.png")
        self.m_touchImg:setVisible(false)
        self.rootNode:addChild(self.m_touchImg, 2)
    end

    if(self.m_touchImg:isVisible() == true)then
        self.m_touchImg:stopAllActions()
        self.m_touchImg:setVisible(false)
    end

    self.m_touchImg:setPosition(pos)
    
    local animation = cc.Animation:create()
    animation:addSpriteFrameWithFile("Image/Image_Click1.png")
    animation:addSpriteFrameWithFile("Image/Image_Click2.png")
    animation:addSpriteFrameWithFile("Image/Image_Click3.png")

    -- should last 0.3 seconds. And there are 3 frames.
    animation:setDelayPerUnit(0.3 / 3)
    animation:setRestoreOriginalFrame(true)
    local animate = cc.Animate:create(animation)

    self.m_touchImg:setVisible(true)
    self.m_touchImg:runAction(cc.Sequence:create(cc.Show:create(), animate, cc.Hide:create()))
end


return BattleMapLayer
