
## 快速开始

```sh

# 全局安装
npm install -g authz-config-generate

# 新建文件夹
mkdir auth

cd auth

# 初始化配置文件 权限模板 
authz init

# 生成配置文件
authz generate [配置文件地址]

# authz generate ./template.xlsx

```

## 配置文件

```js
{
    "excelConfig": {
        // 菜单及按钮区域配置信息
        "menuRow": 2, // 起始行
        "menuCol": 0, // 起始列
        "menuRowCount": 16, // 菜单数据的总行数
        "menuColCount": 4,  // 菜单及按钮的总列数
        // 角色区域信息
        "rolesHeader": {
            "row": 1,
            "col": 4,
            "rowCount": 1,
            "colCount": 3
        },
        // 按钮的行和列
        "btnRow": 2,
        "btnCol": 3
    },
    "transformOptions": {
        // keycloak 的 client id
        "clientId": "test"
    }
}
```

