# Сериализация множества чисел

Проект состоит из модуля содержащего сериализацию множества чисел в диапазоне 1 - 300  в ASCII строку и тестов, верифицирующих корректность алгоритма сериализации и десериализации.

## Алгоритм

Пусть дано входное множество N содержащая n чисел от 1 до 300 включительно. 
Построим 300 мерный вектор x, каждая компонента $` x_{i}, i = 1 ... 300 `$ которого содержит информацио о количестве вхождений числа i в множество N.
Определим функцию $` ASCII(y), y \in [0, 127] `$, котороя ставит в соответствие числу y символ из таблицы ASCII.

Далее отсортируем уникальные значения компонент x по невозрастанию:

$` k = (k_1, k_2, ..., k_m) , \forall i, j : i < j \Rightarrow x_{k_{i}} < x_{k_{j}} `$

Тогда множество чисел N кодируем следующим образом. 
Создаем пустую строку $`res`$
Для каждого $` k_i \in k, i = 1 ... m`$ выполняем:

1. $` res += ASCII([x_{k_{i}}/2^7])ASCII(x_{k_{i}} \bmod 2^7) `$
2. Разделим числа в множестве N на три группы: 

    2.1 $`N^{0} = \{u | u \in N \land u \leq 2^7 \land x_u = k_i\}`$

    2.2 $`N^{1} = \{u - 2^7 | u \in N \land u \leq 2^8 \land x_u = k_i\}`$

    2.3 $`N^{2} = \{u - 2^8 | u \in N \land u \leq 2^9 \land x_u = k_i\}`$

3. Для каждой группы $` N^{j} , j \in [0, 2] `$ выполняем:

    3.1 $` res += ASCII(|N^{j}|) `$

    3.2 $` res += ASCII(u), \forall u \in N^{j} `$

## Запуск тестов

1. Установить jest:

```
npm install
```

2. Запустить тесты с помощью команды:


```
npx jest --coverage
```

