/*
* WWXMLManager.h
*
*  Created on: 2014��5��20��
*      Author: wly
*/

#ifndef _WWXMLMANAGER_H_
#define _WWXMLMANAGER_H_

#include "cocos2d.h"
#include "../../external/tinyxml2/tinyxml2.h"

/*
*   �����࣬����������ֻ���ģ��޸���ʹ��WWXMLNode��
*   <express name="test" value="nothing">This is a test!</express>
*   name �� value ���ǽ�������
*/
class WWXMLAttribute
{
public:

	WWXMLAttribute(const tinyxml2::XMLAttribute *pXMLAttribute);

	~WWXMLAttribute();

	//��һ������ֵ
	WWXMLAttribute next();

	//��ȡ��������
	const char* getName();

	//��ȡstring��������ֵ
	const char* value();

	//��ȡint��������ֵ
	int intValue();

	//��ȡbool��������ֵ
	bool boolValue();

	//��ȡfloat��������ֵ
	float floatValue();

	//��ȡdouble��������ֵ
	double doubleValue();

	//�����Ƿ��ǿ�
	bool isNULL();

private:
	//�ĵ����Զ���
	const tinyxml2::XMLAttribute *m_pXMLAttribute;
};


/*
*  �ڵ��࣬��װ�Խڵ�ĸ��ֲ���.
*  �������ͽڵ�
*	<example name="ok", flag="1">text</example>
*
*  example�� nodeName
*  name��flag��attribute
*  text�� nodeValue
*/
class WWXMLNode
{
public:

	WWXMLNode(tinyxml2::XMLElement *pXMLElem);

	WWXMLNode(tinyxml2::XMLElement *pXMLElem, tinyxml2::XMLDocument *pXMLDocument);

	~WWXMLNode();

	//�����ӽڵ�
	WWXMLNode addChildNode(const char* name);

	//�����ӽڵ㣬Ĭ�Ϸ��ص�һ���ӽڵ�
	WWXMLNode findChildNode(const char* name = NULL);

	//������һ���ֵܽڵ㣬Ĭ�Ϸ��������һ���ֵܽڵ�
	WWXMLNode findSlibingNode(const char* name = NULL);

	//������һ���ֵܽڵ�,Ĭ�Ϸ��������һ���ֵܽڵ�
	WWXMLNode preSlibingNode(const char* name = NULL);

	//���ýڵ�����ֵ
	void setAttributeValue(const char* name, const char* value);

	//��ȡָ��������ֵ
	const char* getAttributeValue(const char* name);

	//ɾ��һ��ָ�����Ƶ�����ֵ
	void deleteAttribute(const char* name);

	//���ýڵ�����
	void setNodeName(const char* name);

	//��ȡ�ڵ�����
	const char* getNodeName();

	//���ýڵ�ֵ
	void setNodeValue(const char* value);

	//��ȡ�ڵ�ֵ
	const char* getNodeValue();

	//��ȡ���ԣ�Ĭ�Ϸ��ص�һ������
	WWXMLAttribute firstAttribute(const char* name = NULL);

	//ɾ�����ڵ�
	void removeSelf();

	//ɾ�������ӽڵ�
	void removeAllChildNode();

	//�Ƿ��ǿսڵ�
	bool isNULL();

private:
	tinyxml2::XMLDocument *m_pXMLDocument;
	tinyxml2::XMLElement *m_pXMLElem;
};

/*
* XML�����࣬ʹ��tinyxml2��װ�˲���xml��ϸ�ڣ���Ҫ���WWXMLNode��ʹ�á�
* ��װ��CCUserDefault�ṩ�Ĺ���
*
* example:
* WWXMLManager myXML;
* myXML.createXMLFile("myXML.xml", "TestXMLManager");
* WWXMLNode itemNode = myXML.getXMLRootNode().addChildNode("item");
* itemNode.setAttributeValue("flag", "true");
* myXML.saveXMLFile();
*/
class WWXMLManager
{
public:
	WWXMLManager();

	WWXMLManager(const char* strXMLPath);

	~WWXMLManager(void);

	//����xml�ļ���utf-8��ʽ�ļ�
	bool loadXMLFile(const char* strXmlPath);

	//��ȡxml�ļ���Ŀ¼ֵ
	const char* getXMLRootKeyValue();

	//��ȡ�����
	WWXMLNode getXMLRootNode();

	//����xml�ļ�,Ĭ��Ϊutf-8����
	bool createXMLFile(const char* strFileName, const char* rootNode = "root");

	//�����ļ����޸ĺ���Ҫ���ô˷���
	bool saveXMLFile();

	/*
	*  ���·��������������ṩ��Ĭ��XML�ļ�����ʹ��getXMLFilePath��ȡ�ļ�·��
	*  ��Ӧ��CCUserDefault��
	*/
public:

	//����key��ȡbool��ֵ����keyֵ������ʱ������defaultValue
	static bool getDefaultXMLBoolForKey(const char* pKey);
	static bool getDefaultXMLBoolForKey(const char* pKey, bool defaultValue);

	static int getDefaultXMLIntegerForKey(const char* pKey);
	static int getDefaultXMLIntegerForKey(const char* pKey, int defaultValue);

	static float getDefaultXMLFloatForKey(const char* pKey);
	static float getDefaultXMLFloatForKey(const char* pKey, float defaultValue);

	static double getDefaultXMLDoubleForKey(const char* pKey);
	static double getDefaultXMLDoubleForKey(const char* pKey, double defaultValue);

	static std::string getDefaultXMLStringForKey(const char* pKey);
	static std::string getDefaultXMLStringForKey(const char* pKey, const std::string & defaultValue);

	//����keyֵ��bool����ֵ
	static void setDefaultXMLBoolForKey(const char* pKey, bool value);

	static void setDefaultXMLIntegerForKey(const char* pKey, int value);

	static void setDefaultXMLFloatForKey(const char* pKey, float value);

	static void setDefaultXMLDoubleForKey(const char* pKey, double value);

	static void setDefaultXMLStringForKey(const char* pKey, const std::string & value);

	static void purgeSharedUserDefault();

	//��ȡĬ�ϵ�XML�ļ�·��
	const static std::string& getDefaultXMLFilePath();
	//xml�ļ��Ƿ����
	static bool isXmlFileExist(const char* strFilePath);

	/*
	*   ˵������ȡ��Ŀ���ַ�����Դ���������µ��ļ���ʽ
	*   ��������ֵ������ֵ��
	*   ���ӣ�
	*   <?xml version="1.0" encoding="utf-8"?>
	*   <resources>
	*       <HallScene>
	*           <string name="Str_app_name">��Ŀ����</string>
	*           <string name="Str_chujiRoom">������</string>
	*       </HallScene>
	*       <GameScene>
	*           <string name="Str_app_name">��Ŀ����</string>
	*       </GameScene>
	*    </resources>
	*
	*/
	static std::string getWWStringFromXML(const char* strXmlPath, const std::string &strKey, const std::string &strSection);

private:
	tinyxml2::XMLDocument *m_pXMLDocument;

	//�ļ�·����ÿ��loadʱ�ı�
	std::string m_strXMLFilePath;
};


#endif

