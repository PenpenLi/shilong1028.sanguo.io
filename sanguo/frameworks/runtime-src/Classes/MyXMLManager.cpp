
#include "MyXMLManager.h"

MyXMLManager::MyXMLManager() :
m_pXMLDocument(NULL),
m_strXMLFilePath("")
{

}

MyXMLManager::MyXMLManager(const char* strXMLPath) :
m_pXMLDocument(NULL),
m_strXMLFilePath(strXMLPath)
{
	loadXMLFile(strXMLPath);
}

MyXMLManager::~MyXMLManager(void)
{
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
	}
}


bool MyXMLManager::loadXMLFile(const char* strXmlPath1)
{
	string path = ""; // FileUtils::getInstance()->getWritablePath();
	const char* strXmlPath = (path + strXmlPath1).c_str();

	//����ͬһ�ļ�ʱ��ֱ�ӷ���
	if (strcmp(m_strXMLFilePath.c_str(), strXmlPath) == 0)
	{
		return true;
	}

	m_strXMLFilePath = strXmlPath;
	//�����ÿգ���ֹ�ظ�����
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
		m_pXMLDocument = NULL;
	}

	m_pXMLDocument = new WWXMLManager();
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	return m_pXMLDocument->loadXMLFile(strXmlPath);
}

//����xml�ļ�,Ĭ��Ϊutf-8����
bool MyXMLManager::createXMLFile(const char* strFileName1, const char* rootNode /*= "root"*/)
{
	//�����ÿգ���ֹ�ظ�����
	if (m_pXMLDocument)
	{
		delete m_pXMLDocument;
		m_pXMLDocument = NULL;
	}

	m_pXMLDocument = new WWXMLManager();
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	string path = ""; //FileUtils::getInstance()->getWritablePath();
	string strFileName = path + strFileName1;

	return m_pXMLDocument->createXMLFile(strFileName.c_str(), rootNode);
}

//�����ļ����޸ĺ���Ҫ���ô˷���
bool MyXMLManager::saveXMLFile()
{
	if (NULL == m_pXMLDocument)
	{
		return false;
	}

	return m_pXMLDocument->saveXMLFile();
}

WWXMLNode MyXMLManager::getTarChildNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return NULL;
	}

	WWXMLNode itemNode = m_pXMLDocument->getXMLRootNode();

	string nodeStr = node;
	int beginPos = 0;
	int endPos = 0;
	int strLen = nodeStr.length();

	while (endPos != string::npos){
		endPos = nodeStr.find('-', beginPos);
		int subLen = endPos - beginPos;
		string subNode = nodeStr.substr(beginPos, subLen);
		itemNode = itemNode.findChildNode(subNode.c_str());
		if (itemNode.isNULL() == true){
			return NULL;
		}
		beginPos = endPos + 1;
	}

	return itemNode;
}

//�ڸ��ڵ�������ӽڵ�
void MyXMLManager::addChildNode(const char* node /*= "item"*/)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode parNode = m_pXMLDocument->getXMLRootNode();

	string nodeStr = node;
	int beginPos = 0;
	int endPos = 0;
	int strLen = nodeStr.length();

	while (endPos != string::npos){
		endPos = nodeStr.find('-', beginPos);
		int subLen = endPos - beginPos;
		string subNode = nodeStr.substr(beginPos, subLen);

		WWXMLNode itemNode = parNode.findChildNode(subNode.c_str());
		if (itemNode.isNULL() == true){
			parNode.addChildNode(subNode.c_str());
		}
		parNode = itemNode;
		beginPos = endPos + 1;
	}
}

//���ýڵ����Լ�ֵ
void MyXMLManager::setNodeAttrValue(const char* node, const char* name, const char* value)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL()){
		itemNode.setAttributeValue(name, value);
	}
}

string MyXMLManager::getNodeAttrValue(const char* node, const char* name)
{
	if (NULL == m_pXMLDocument)
	{
		return "";
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		return itemNode.getAttributeValue(name);
	else
		return "";
}

//ɾ��һ��ָ�����Ƶ�����ֵ
void MyXMLManager::deleteAttribute(const char* node, const char* name)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		itemNode.deleteAttribute(name);
}

//ɾ�����ӽڵ�
void MyXMLManager::removeNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		itemNode.removeSelf();
}

//ɾ�����и��ӽڵ�
void MyXMLManager::removeAllChildNode(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		itemNode.removeAllChildNode();
}

//�Ƿ���ӽڵ��ǿսڵ�
bool MyXMLManager::isNULL(const char* node)
{
	if (NULL == m_pXMLDocument)
	{
		return true;
	}

	WWXMLNode itemNode = getTarChildNode(node);
	if (false == itemNode.isNULL())
		return itemNode.isNULL();
	else
		return true;
}

