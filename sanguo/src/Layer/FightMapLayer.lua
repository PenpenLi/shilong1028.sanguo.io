
--FightMapLayer用于显示战斗地图及点击处理等
local FightMapLayer = class("FightMapLayer", CCLayerEx) --填入类名

function FightMapLayer:create()   --自定义的create()创建方法
    --G_Log_Info("FightMapLayer:create()")
    local layer = FightMapLayer.new()
    return layer
end

function FightMapLayer:onExit()
    --G_Log_Info("FightMapLayer:onExit()")
end

function FightMapLayer:init()  
    --G_Log_Info("FightMapLayer:init()")
    --ClearMapObj不清除的数据
    self.rootNode = nil    --根节点
    self.mapConfigData = nil  --地图表配置数据 

    -------ClearMapObj清除的数据----------
    self.playerNode = nil  --主角节点
	self.m_touchImg = nil  --点击动画
    self.m_arrowImgVec = {}  --路径箭头
    self.curRolePos = 0   --当前人物所在位置（像素点） 

    self:initTouchEvent()   --注册点击事件
end

function FightMapLayer:ClearMapObj()
	self.rootNode:removeAllChildren()
    self.rootNode:setPosition(cc.p(0,0))
    self.playerNode = nil  --主角节点
	self.m_touchImg = nil  --点击动画
    self.m_arrowImgVec = {}  --路径箭头
    self.curRolePos = 0   --当前人物所在位置（像素点）
end

function FightMapLayer:ShowMapImg(mapId)  
    --G_Log_Info("FightMapLayer:ShowMapImg() mapId = %d", mapId)
    collectgarbage("collect")
    -- avoid memory leak
    collectgarbage("setpause", 100)
    collectgarbage("setstepmul", 5000)
    math.randomseed(os.time())

    g_pGameLayer:showLoadingLayer(true) 

    self.mapConfigData = nil
    self.mapConfigData = g_pMapMgr:LoadMapStreamData(mapId)  --地图表配置数据 
    if self.mapConfigData == nil then
    	G_Log_Error("FightMapLayer--mapConfigData = nil")
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
			G_Log_Error("MapLayer--mapImg = nil, mapName = %s, idx = %d", imgName, i)
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

	--添加城池
	for k, chengId in pairs(self.mapConfigData.cityIdStrVec) do
		local chengData = g_pTBLMgr:getCityConfigTBLDataById(chengId)
		if chengData then
		    local chengchi = NpcNode:create()
		    chengchi:initChengData(chengData)
		    self.rootNode:addChild(chengchi, 10)

		    local pos = cc.p(chengData.map_pt.x, self.mapConfigData.height - chengData.map_pt.y)    --以左上角为00原点转为左下角为原点的像素点
		    chengchi:setPosition(pos)
		end
	end

	g_pGameLayer:showLoadingLayer(false) 
end

--显示人物
function FightMapLayer:ShowPlayerNode(rolePos)
	--添加人物
	if not self.playerNode then
		self.playerNode = PlayerNode:create()
	    self.playerNode:initPlayerData()
	    self.rootNode:addChild(self.playerNode, 20)
	end

	if not rolePos then
	    local defaultCityId = self.mapConfigData.cityIdStrVec[1]
	    local cityData = g_pTBLMgr:getCityConfigTBLDataById(defaultCityId)
	    if cityData then
	    	rolePos = cc.p(cityData.map_pt.x, self.mapConfigData.height - cityData.map_pt.y)  --以左上角为00原点转为左下角为原点的像素点
	    else
	    	rolePos = cc.p(0,0)
	    end
	end

    self:setRoleMapPosition(rolePos)  
end

--主角在屏幕上的坐标
function FightMapLayer:setRoleWinPosition(winPos)
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

--主角在地图上的坐标
function FightMapLayer:setRoleMapPosition(rolePos)
	if self.playerNode then
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

		self.playerNode:setPosition(rolePos)
		self.playerNode:UpdateOpacity(rolePos)
		self.curRolePos = rolePos   --当前人物所在位置（像素点）

		self:resetRootNodePos(rolePos)
	end
end

--以主角为屏幕中心，适配地图
function FightMapLayer:resetRootNodePos(rolePos, moveTime)
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
	--G_Log_Info("FightMapLayer:resetRootNodePos, rootPos.x = %f, rootPos.y = %f", rootPos.x, rootPos.y)

	if moveTime then
		self.rootNode:runAction(cc.MoveTo:create(moveTime, rootPos))
	else
		self.rootNode:setPosition(rootPos)
	end
end

function FightMapLayer:showTouchImg(pos)
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


function FightMapLayer:onTouchBegan(touch, event)
    G_Log_Info("FightMapLayer:onTouchBegan()")
    local beginPos = touch:getLocation()   --直接从touch中获取,在getLocation()源码里会将坐标转成OpenGL坐标系,原点在屏幕左下角，x轴向右，y轴向上
    --local point = touch:getLocationInView() --获得屏幕坐标系,原点在屏幕左上角，x轴向右，y轴向下
    --point = cc.Director:getInstance():convertToGL(point)  --先获得屏幕坐标，在调用convertToGL转成OpenGl坐标系
    self:setRoleWinPosition(beginPos)
    return true   --只有当onTouchBegan的返回值是true时才执行后面的onTouchMoved和onTouchEnded触摸事件
end

--开始astar寻路,endPos为目标位置的像素点，posIsPt=true为目标位置的32*32地图块坐标
function FightMapLayer:starAutoPath(endPos)
	--G_Log_Info("FightMapLayer:starAutoPath()")
    if endPos.x < 0 or endPos.y < 0 or endPos.x > self.mapConfigData.width or endPos.y > self.mapConfigData.height then
    	G_Log_Error("endPos is not in Map, endPos.x = %f, endPos.y = %f", endPos.x, endPos.y)  --如果越界了
		return;
	end

	if self.playerNode then
		self.playerNode:StopLastAutoPath()   --停止上一个自动寻路
		local startPos = cc.p(self.playerNode:getPosition())

		local stepLen = g_pMapMgr:CalcDistance(endPos, startPos)
		if stepLen < 32 then   --移动目的地就在附近
			--G_Log_Info("移动目的地就在附近")
			self:setRoleMapPosition(endPos)
			return 
		end

		local startPt = cc.p(math.floor(startPos.x / 32), math.floor((self.mapConfigData.height - startPos.y) / 32))    --地图块为32*32大小，且从0开始计数
		local endPt = cc.p(math.floor(endPos.x / 32), math.floor((self.mapConfigData.height - endPos.y) / 32))

		--G_Log_Info("startPt.x = %d, startPt.y = %d, endPt.x = %d, endPt.y = %d", startPt.x, startPt.y, endPt.x, endPt.y)
		g_pAutoPathMgr:AStarFindPath(startPt.x, startPt.y, endPt.x, endPt.y)
		local autoPath = g_pAutoPathMgr:AStarGetPath(g_bAStarPathSmooth)
		if autoPath and #autoPath > 0 then
			self:drawAutoPathArrow(autoPath, true)
		else
			g_pGameLayer:ShowScrollTips(lua_str_WarnTips6, g_ColorDef.Red, g_defaultTipsFontSize)   --"点击坐标为地图不可达部分！"
			G_Log_Error("autoPath is nil, bucause endPt not reachable! endPt.x = %d, endPt.y = %d", endPt.x, endPt.y)
		end
	end
end

--设置任务标志路径
function FightMapLayer:drawAutoPathArrow(autoPath, bDrawPath)
	--G_Log_Info("FightMapLayer:drawAutoPathArrow()")
	if autoPath and #autoPath >0 then
		local AutoPathVec = {}   --自动寻路路径
		local pt0 = cc.p(autoPath[1]:getX(), self.mapConfigData.height - autoPath[1]:getY())
	    local pt1 = pt0
	    table.insert(AutoPathVec, pt0)
		for k=2, #autoPath do   --SPoint转ccp, autoPath为32*32的块坐标，AutoPathVec为像素坐标
			pt1 = cc.p(autoPath[k]:getX(), self.mapConfigData.height - autoPath[k]:getY())
            local StepLen = g_pMapMgr:CalcDistance(pt0, pt1)   --箭头长度49
            local count = math.floor(StepLen/50)
            local ptoffset = cc.p((pt1.x - pt0.x)/(count+1), (pt1.y - pt0.y)/(count+1) )
        	for i=1, count do
                local pathPos = cc.p(pt0.x + ptoffset.x*i, pt0.y + ptoffset.y*i )
                table.insert(AutoPathVec, pathPos)
            end
			table.insert(AutoPathVec, pt1)
            pt0 = pt1
		end
		--G_Log_Dump(AutoPathVec, "AutoPathVec = ")
		if bDrawPath == true then   --绘制路径箭头
			for k, arrow in pairs(self.m_arrowImgVec) do 
		        arrow:setVisible(false)
		        arrow:removeFromParent(true)
		    end
		    self.m_arrowImgVec = {}

		    local pt0 = AutoPathVec[1]
	    	local pt1 = pt0
		    for k=2, #AutoPathVec do 
				local arrowImg =  ccui.ImageView:create("public_arrow.png",ccui.TextureResType.plistType)
	            arrowImg:setPosition(pt0)
	            self.rootNode:addChild(arrowImg, 1)
	            table.insert(self.m_arrowImgVec, arrowImg)

	            pt1 = AutoPathVec[k]
				local countX = pt1.x - pt0.x
	            local countY = pt1.y - pt0.y
	            if(countX > 0) then   
	                if(countY > 0)then --右下箭头
	                    arrowImg:setRotation(-45)
	                elseif(countY < 0)then --右上箭头
	                    arrowImg:setRotation(45)
	                else
	                	arrowImg:setRotation(0)  --右箭头
	                end
	            elseif(countX < 0)then  
	                if(countY > 0)then --左下箭头
	                    arrowImg:setRotation(-135)
	                elseif(countY < 0)then --左上箭头
	                    arrowImg:setRotation(135)
	                else
	                	arrowImg:setRotation(180)  --左箭头
	                end
	            else
	                if(countY > 0)then --下箭头
	                    arrowImg:setRotation(-90)
	                elseif(countY < 0)then --上箭头
	                    arrowImg:setRotation(90)
	                end
	            end
                pt0 = pt1
		    end
		end
		self.playerNode:StartAutoPath(AutoPathVec)
	end
end


return FightMapLayer