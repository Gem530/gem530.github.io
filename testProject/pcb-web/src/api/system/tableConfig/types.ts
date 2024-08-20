export interface tableConfig {
    /**
     *  name 表格名称
     *  widthList 表格宽度列表 json
     *  toolList 表格排序，显隐列表 json
     */
    name: string;
    widthList: any[];
    toolList: any[];
}

export interface tableConfigData {
    /**
     * name 表格名称
     */
    tableName: string;
    
    tableConfig: tableConfig;
}

export interface tableConfigList {
    /**
     * id
     */
    id: string;

    /**
     * userId 用户id
     */
    userId: number;

    /**
     * tableName 表格名称
     */
    tableName: string;

    /**
     * ownerId
     */
    ownerId: number;

    tableConfig: tableConfig;
}