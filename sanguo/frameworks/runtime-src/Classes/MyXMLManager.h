
#ifndef _MYXMLMANAGER_H_
#define _MYXMLMANAGER_H_

#include "cocos2d.h"
#include "../../external/tinyxml2/tinyxml2.h"

USING_NS_CC;
using namespace std;

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
* MyXMLManager myXML;
* myXML.createXMLFile("myXML.xml", "TestXMLManager");
* myXML.addRootChildNode("item");
* myXML.setNodeAttrValue("item", "flag", "true");
* myXML.saveXMLFile();
*/
class MyXMLManager
{
public:
	MyXMLManager();

	MyXMLManager(const char* strXMLPath);

	~MyXMLManager(void);

	//����xml�ļ���utf-8��ʽ�ļ�
	bool loadXMLFile(const char* strXmlPath);

	//����xml�ļ�,Ĭ��Ϊutf-8����
	bool createXMLFile(const char* strFileName, const char* rootNode = "root");

	//�����ļ����޸ĺ���Ҫ���ô˷���
	bool saveXMLFile();

	//�ڸ��ڵ�������ӽڵ�,nodeΪ�Ӹ���ʼ����-Ϊ�ָ�ĵݹ��ӽڵ㣬����"test-node-thirdnode"��Ϊroot��tes�ӽڵ��µ�node�ӽڵ��third�ӽڵ�
	void addChildNode(const char* node);

	//���ýڵ����Լ�ֵ
	void setNodeAttrValue(const char* node, const char* name, const char* value);
	string getNodeAttrValue(const char* node, const char* name);

	//ɾ��һ��ָ�����Ƶ�����ֵ
	void deleteAttribute(const char* node, const char* name);

	//ɾ�����ӽڵ�
	void removeNode(const char* node);

	//ɾ�������ӽڵ�
	void removeAllChildNode(const char* node);

	//�Ƿ���ӽڵ��ǿսڵ�
	bool isNULL(const char* node);

private:
	//��ȡĿ���ӽڵ�,nodeΪ�Ӹ���ʼ����-Ϊ�ָ�ĵݹ��ӽڵ㣬����"test-node-thirdnode"��Ϊroot��tes�ӽڵ��µ�node�ӽڵ��third�ӽڵ�
	WWXMLNode getTarChildNode(const char* node);

private:
	tinyxml2::XMLDocument *m_pXMLDocument;
	//�ļ�·����ÿ��loadʱ�ı�
	std::string m_strXMLFilePath;
};

#endif
