import { getDicts } from '@/api/system/dict/data';
import { useDictStore } from '@/store/modules/dict';
/**
 * 获取字典数据
 */
export const useDict = (...args: string[]): { [key: string]: DictDataOption[] } => {
  const res = ref<{
    [key: string]: DictDataOption[];
  }>({});
  return (() => {
    args.forEach(async (dictType) => {
      res.value[dictType] = [];
      const dicts = useDictStore().getDict(dictType);
      if (dicts) {
        res.value[dictType] = dicts;
      } else {
        await getDicts(dictType).then((resp) => {
          res.value[dictType] = resp.data.map(
            (p): DictDataOption => ({ label: p.dictLabel, value: p.dictValue, elTagType: p.listClass, elTagClass: p.cssClass })
          );
          useDictStore().setDict(dictType, res.value[dictType]);
        });
      }
    });
    return res.value;
  })();
};

/**
 * 对数组对象的指定属性进行排序
 * @param {Array} arr 数组对象
 * @param {Array} rules 排序规则，每个元素都是形如 ['key', 'asc'] 或者 ['key', 'desc'] 的数组
 */
export const sortBy = (arr:any, rules:any) => {
  return arr.sort((a:any, b:any) => {
    for (let i = 0; i < rules.length; i++) {
      const [key, direction] = rules[i];
      const order = direction === 'desc' ? -1 : 1;
      if (a[key] < b[key]) {
        return -1 * order;
      }
      if (a[key] > b[key]) {
        return 1 * order;
      }
    }
    return 0;
  });
}
