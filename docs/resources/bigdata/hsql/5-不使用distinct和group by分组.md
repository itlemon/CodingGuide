55表结构

![image.png](https://cdn.nlark.com/yuque/0/2022/png/26721850/1649472097108-d1f3da7b-1f6d-4037-a0a7-ce937f2c0e6e.png#clientId=u3ba96825-d504-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=56&id=u1952d8d3&margin=%5Bobject%20Object%5D&name=image.png&originHeight=84&originWidth=387&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5220&status=done&style=none&taskId=uc3243118-a696-4f1b-850e-7b8b7c5b5bc&title=&width=258)
## 建表
```sql
create table t9
(
    a string,
    b string,
    c string,
    d string
);
insert into t9
values ('2014', '2016', '2014', 'A'),
       ('2014', '2015', '2015', 'B');
```
## 1）不使用distinct和group by分组
### 输出结果
![image.png](https://cdn.nlark.com/yuque/0/2022/png/26721850/1649472007175-d31c6145-8370-462c-8956-81c79fdca15a.png#clientId=u3ba96825-d504-4&crop=0&crop=0&crop=1&crop=1&from=paste&height=88&id=u4941b21e&margin=%5Bobject%20Object%5D&name=image.png&originHeight=132&originWidth=253&originalType=binary&ratio=1&rotation=0&showTitle=false&size=5535&status=done&style=none&taskId=u43475567-9f31-4dc2-84ff-fb3ae6307c4&title=&width=168.66666666666666)
### 思路
-- 1,先将多个显示年份的列转为1列，用_union all_
-- 2,使用分组排序的开窗函数(_row_number()_)对两个字段分别进行分组，这样排序就会在a分组内，b再分组，取b的排序
-- 3,取排序为1的值即可
### SQL
```sql
select year,
num
from (select year,
      num,
      row_number() over (partition by tmp1.year,num) as rank_1
      from (select a as year, d as num
            from t9
            union all
            select b as year, d as num
            from t9
            union all
            select c as year, d as num
            from t9) tmp1) tmp2
where tmp2.rank_1 = 1;
```

## 

