
#ifndef _MYXMLMANAGER_H_
#define _MYXMLMANAGER_H_

#include "WWXMLManager.h"

USING_NS_CC;
using namespace std;

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
	WWXMLManager *m_pXMLDocument;
	//�ļ�·����ÿ��loadʱ�ı�
	std::string m_strXMLFilePath;
};

#endif
