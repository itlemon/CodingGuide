# 第7节 深入理解JDK8 HashMap

![首图](https://img-blog.csdnimg.cn/20200614174020645.png)

> 笔者在上一篇文章《[深入理解JDK7 HashMap](06JDK7-HashMap源码解析.md)》中详细解析了HashMap在JDK7中的实现原理，主要是围绕其put、get、resize、transfer等方法，本文将继续解析HashMap在JDK8中的具体实现，首先也将从put、get、resize等方法出发，着重解析HashMap在JDK7和JDK8中的具体区别，最后回答并解析一些常见的HashMap问题。在阅读本篇文章之前，建议阅读上一篇文章作为基础。

#### 一、HashMap在JDK8中的结构

上一篇文章提到，HashMap在JDK7或者JDK8中采用的基本存储结构都是**数组+链表**形式，可能有人会提出疑问，HashMap在JDK8中不是**数组+链表+红黑树**吗？本文的回答**是**。至于为什么JDK8在一定条件下将链表转换为红黑树，我相信很多人都会回答：**为了提高查询效率**。基本答案可以说是这样的，JDK7中的HashMap对着Entry节点增多，哈希碰撞的概率在慢慢变大，这就直接导致哈希表中的单链表越来越长，这就大大降低了HashMap的查询能力，且时间复杂度可能会退化到O(n)。针对这种情况，JDK8做出了优化，就是在一定的条件下，链表会被转换为红黑树，提升查询效率。
HashMap在JDK8中基本结构示意图如下所示：

<div style="text-align:center"><img src="https://img-blog.csdnimg.cn/2020021414050930.png" width = "80%"  alt=""/></div>

在上面的示意图可以看出，与JDK7的最大区别就是哈希表中不仅有链表，还有可能存在红黑树这种结构。那么看着图，可以提出两个问题：

- 何时链表会转换成红黑树？
- 为什么需要转换为红黑树？

那么带着这两个问题，跟随我的脚步，我们一起去研究HashMap在JDK8中的具体实现。

#### 二、HashMap在JDK8中的具体实现

##### 2.1 理解HashMap的成员变量

JDK8中的HashMap也有多个成员属性，如下所示：

```java
// 哈希表默认的初始化容量
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // aka 16
// 哈希表最大的容量
static final int MAXIMUM_CAPACITY = 1 << 30;
// 默认的负载因子
static final float DEFAULT_LOAD_FACTOR = 0.75f;
// 链表可能转换为红黑树的基本阈值（链表长度>=8）
static final int TREEIFY_THRESHOLD = 8;
// 哈希表扩容后，如果发现红黑树节点数小于6，则退化为链表
static final int UNTREEIFY_THRESHOLD = 6;
// 链表转换为红黑树的另一个条件，哈希表长度必须大于等于64才会转换，否则会扩容
static final int MIN_TREEIFY_CAPACITY = 64;
// 哈希表
transient Node<K,V>[] table;
// Node<K, V>的Set集合
transient Set<Map.Entry<K,V>> entrySet;
// Node<K, V>节点个数
transient int size;
// map内元素的个数的修改次数
transient int modCount;
// 扩容阈值，当size >= threshold时候，有可能会被扩容
int threshold;
// 自定义负载因子
final float loadFactor;
```

由于《[深入理解JDK7 HashMap](06JDK7-HashMap源码解析.md)》已经详细介绍了上述部分成员属性，这里仅仅介绍一下JDK8特有的属性：

- TREEIFY_THRESHOLD：链表转换为红黑树的阈值，当链表长度大于等于`8`的时候，链表可能会被转换为红黑树，这里之所以说是可能，是因为还要满足另外一个条件：哈希表长度大于等于`64`，否则哈希表会尝试扩容。
- UNTREEIFY_THRESHOLD：红黑树退化成链表的阈值，当红黑树节点小于等于`6`的时候，红黑树会转换成普通的链表。
- MIN_TREEIFY_CAPACITY：链表转换为红黑树的第二个条件，哈希表长度大于等于`64`的时候，且链表长度达到`8`才会转换为红黑树，否则将会扩容。

在JDK7中，Key和Value的存储是利用的Entry节点，JDK8中使用的是Node节点，前者是JDK7中HashMap的内部类，实现了Map.Entry接口，后者是JDK8中HashMap的内部类，实现的也是Map.Entry接口，两者的成员属性也是一致的的，具体代码比较如下所示：

- JDK7中Entry节点

```java
static class Entry<K,V> implements Map.Entry<K,V> {
    final K key;
    V value;
    Entry<K,V> next;
    int hash;
    // 后续代码省略
}
```

- JDK8中Node节点

```java
static class Node<K,V> implements Map.Entry<K,V> {
    final int hash;
    final K key;
    V value;
    Node<K,V> next;
}
```

两者其实是一致的，这里不做过多解释。

##### 2.2 理解HashMap的构造方法

相比于JDK7，JDK8的HashMap构造方法和JDK7几乎一致，这里需要说一点区别，JDK7中HashMap的构造方法如下所示：

```java
// 该构造方法对初始化容量和负载因子进行了一个校验
// 然后将传入的负载因子复制给了loadFactor成员变量
// 将初始化容量赋值给了扩容阈值（扩容临界数值）
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);

    this.loadFactor = loadFactor;
    threshold = initialCapacity;
    init();
}
```

JDK8中该构造方法如下所示：

```java
public HashMap(int initialCapacity, float loadFactor) {
    if (initialCapacity < 0)
        throw new IllegalArgumentException("Illegal initial capacity: " +
                                           initialCapacity);
    if (initialCapacity > MAXIMUM_CAPACITY)
        initialCapacity = MAXIMUM_CAPACITY;
    if (loadFactor <= 0 || Float.isNaN(loadFactor))
        throw new IllegalArgumentException("Illegal load factor: " +
                                           loadFactor);
    this.loadFactor = loadFactor;
    this.threshold = tableSizeFor(initialCapacity);
}
```

相比较发现，JDK8中使用了tableSizeFor()方法，其实就是计算出了最接近initialCapacity的且大于initialCapacity的2的N次幂的值，比如传入的初始化容量为27，那么最接近27且大于27的2的N次幂是32，此时`N = 5`，而在JDK7中是在第一次put中完成的，当然对于threshold的值，未初始化的时候都是承载的是initialCapacity，后续都会重新计算为`capacity * loadFactor`。

##### 2.3 理解HashMap的put方法

相比于JDK7，JDK8的put方法貌似要复杂很多，咋一眼看上去有点惶恐，不过没关系，我们一起一行一行来分析，基本上也能啃下这块硬骨头。

```java
public V put(K key, V value) {
    return putVal(hash(key), key, value, false, true);
}

// 参数解析：onlyIfAbsent表示，如果为true，那么将不会替换已有的值，否则替换
// evict：该参数用于LinkedHashMap，这里没有其他作用（空实现）
final V putVal(int hash, K key, V value, boolean onlyIfAbsent,
                   boolean evict) {
    // tab是该方法中内部数组引用，p是数组中首节点，n是内部数组长度，i是key对应的索引下标
    Node<K,V>[] tab; Node<K,V> p; int n, i;
    // 第一次put的时候，table未初始化，也就是tab为空，需要扩容
    if ((tab = table) == null || (n = tab.length) == 0)
    	// 这里实现扩容，具体逻辑稍后分析
        n = (tab = resize()).length;
    // 获取指定key的对应下标的首节点并赋值给p，如果首节点为null，那么创建一个新的Node节点作为首节点
    if ((p = tab[i = (n - 1) & hash]) == null)
        tab[i] = newNode(hash, key, value, null);
    else {
        Node<K,V> e; K k;
        if (p.hash == hash &&
            ((k = p.key) == key || (key != null && key.equals(k))))
            // p此时指向的是不为null的首节点，将p赋值给e
            // 如果首节点的key和要存入的key相同，那么直接覆盖value的值（在下一个if中执行的）
            e = p;
        else if (p instanceof TreeNode)
        	// 如果首节点是红黑树的，将键值对插添加到红黑树，该方法后续分析
            e = ((TreeNode<K,V>)p).putTreeVal(this, tab, hash, key, value);
        else {
        	// 能走到这里，说明首节点和新put的的这个节点的key不一样，且该Node节点不是TreeNode类型
        	// 开始需要遍历链表，如果链表中存在该键值对，直接覆盖value。
        	// 如果不存在，则在末端插入键值对。然后判断链表长度是否大于等于8（其实就是遍历次数 + 1），
        	// 尝试转换成红黑树。注意此处使用“尝试”，因为在treeifyBin方法中还会判断
        	// 当前哈希表长度是否到达64，如果达到，转换为红黑树，否则会放弃次此转换，优先扩充数组容量。
            for (int binCount = 0; ; ++binCount) {
            	// 当binCount = 0时，也就是第一次if判断，此时p就是首节点，p.next就是第二个节点
            	// 其他情况及时链表中其他节点，当e == null的时候，也就是到达了链表的结尾
                if ((e = p.next) == null) {
                	// 新建一个Node并作为链表的最后一个节点
                    p.next = newNode(hash, key, value, null);
                    // 判断遍历次数是否>=7（首节点未遍历，直接从第二个节点开始遍历的，当次数为7时，说明链表长度为8）
                    if (binCount >= TREEIFY_THRESHOLD - 1) // -1 for 1st
                    	// “尝试”将链表转换为红黑树，内部还会判断哈希表长度，不一定转换成功，也许是扩容
                        treeifyBin(tab, hash);
                    break;
                }
                // 只要没走到上面那个if里面，说明链表没有遍历结束，如果在链表中间发现有key一样的，那么就直接将旧值替换成新值
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    break;
                // 将正在遍历的节点赋值给p，方便能遍历下一个节点
                p = e;
            }
        }
        // 首节点或者链表中间替换旧值为新值的逻辑
        if (e != null) { // existing mapping for key
            V oldValue = e.value;
            if (!onlyIfAbsent || oldValue == null)
                e.value = value;
            afterNodeAccess(e);
            return oldValue;
        }
    }
    ++modCount;
    if (++size > threshold)
    	// 如果满足扩容条件，就扩容
        resize();
    afterNodeInsertion(evict);
    return null;
}
```

分析上面的代码，put基本流程可以总结如下：

第一步：检查哈希表是否为空，如果为空，就进行扩容。

第二步：通过key的hash值以及哈希表长度来确定当前key在哈希表中的索引下标，并获取到同一下标下的链表首节点或者红黑树的根节点。

第三步：如果获取到首节点（或根节点）为null，说明当前哈希表的位置上没有任何链表或者红黑树，此时将key和value封装成Node节点对象存储到首节点位置。

第四步：如果获取到首节点（或根节点）不为null，说明当前哈希表的位置上有链表或者红黑树，这是进一步判断当前key是否和首节点的Node中key一致，如果一致，则将首节点的值替换成新值，否则进行下一步。

第五步：如果当前需要存储的key和首节点的key不一致，那么进一步判断当前首节点是否为TreeNode类型，也就是红黑树类型，如果是红黑树类型，则做树节点插入，否则进行第六步。

第六步：如果需要存储的key和首节点的key不一致，且首节点不是TreeNode类型，那么就到这第六步，第六步主要就是遍历链表，如果链表中包含相同key的Node对象，那么就做值的替换，否则将新建Node对象并插到链表的结尾处。完成结尾处插入之后，就会依据条件`binCount >= 7`来判断是否**尝试**将链表转换为红黑树，这里之所以是遍历次数大于等于`7`，这是因为从链表的第二个节点开始的。

第七步：最后判断K-V对数是否超过了扩容阈值threshold，超过了则扩容。

特别说明：上述第六步之所以说是**尝试**转换成红黑树，这是因为在转换逻辑里面对哈希表的长度还进行了校验，只有哈希表长度大于等于64才转换，否则进行扩容。这里面的原理将在转换红黑树的代码里面详细分析。

为了方便理解put的整个流程，将上述文字描述转换为流程图：

<div style="text-align:center"><img src="https://img-blog.csdnimg.cn/20200215153538611.png" width = "50%"  alt=""/></div>

从上面的流程图就可以回答文章开始的第一个疑问：何时链表会转换成红黑树？

转换成红黑树条件是发生**哈希冲突**，且新节点下标所在位置有链表，且新节点必须插入到链表尾部且插入后长度正好达到8，并且哈希表长度要大于等于64，这些条件都必须满足才会有链表转换成为红黑树的操作。如果没有发生哈希冲突，就不会转换，也就是新节点直接存入哈希表的桶内。如果新节点替换了首节点或者其他节点，那么也不会发生转换。如果插入到链表尾部，且链表长度达到8，且哈希表长度达到64才会发生转换操作。

在put过程中会有将链表转换为红黑树的过程，具体转换代码如下所示：

```java
final void treeifyBin(Node<K,V>[] tab, int hash) {
    int n, index; Node<K,V> e;
    // 在这里判断是否满足扩容条件，如果满足就扩容
    if (tab == null || (n = tab.length) < MIN_TREEIFY_CAPACITY)
        resize();
    else if ((e = tab[index = (n - 1) & hash]) != null) {
    	// 到这里开始遍历链表
        TreeNode<K,V> hd = null, tl = null;
        do {
        	// 将链表中的节点Node类型转换成为TreeNode
            TreeNode<K,V> p = replacementTreeNode(e, null);
            if (tl == null)
                hd = p;
            else {
                p.prev = tl;
                tl.next = p;
            }
            tl = p;
        } while ((e = e.next) != null);
        // TreeNode链表转换成为红黑树
        if ((tab[index] = hd) != null)
            hd.treeify(tab);
    }
}
```

这里暂不分析链表是如何转换成为红黑树的，红黑树这种数据结构其内容还是比较繁琐的，要求读者具有红黑树数据结构基础，过多的分析将影响本文对HashMap的实现原理分析，后期笔者将专门推出一文来讲解红黑树，届时读者阅读后可以自行查看treeify方法学习内部的实现原理。

那么这里回答一下第二个疑问：**为什么需要转换为红黑树？**

HashMap在JDK8之后引入了红黑树的概念，表示若哈希表的桶中链表元素超过`8`时（默认哈希表长度不小于64），会自动转化成红黑树；若桶中元素小于等于6时，树结构还原成链表形式。红黑树的平均查找长度是log(n)，长度为8，查找长度为log(8)=3，链表的平均查长度为n/2，当长度为8时，平均查找长度为8/2=4，这才有转换成树的必要；链表长度如果是小于等于6，6/2=3，虽然速度也很快的，但是转化为树结构和生成树的时间并不会太短。以6和8来作为平衡点是因为，中间有个差值7可以防止链表和树之间频繁的转换。假设，如果设计成链表个数超过8则链表转换成树结构，链表个数小于8则树结构转换成链表，如果一个HashMap不停的插入、删除元素，链表个数在8左右徘徊，就会频繁的发生树转链表、链表转树，效率会很低。概括起来就是：链表：如果元素小于8个，查询成本高，新增成本低，红黑树：如果元素大于8个，查询成本低，新增成本高。

##### 2.4 理解HashMap的resize方法

前一篇文章分析过HashMap在JDK7中的扩容条件：

- K-V对数大于等于扩容阈值，也就是`size >= threshold`，并且put过程中要发生哈希碰撞，也就是说要存放Entry对象的桶已经存在链表（有可能只有一个节点）了，这个时候才会扩容，否则仅满足`size >= threshold`是不会发生扩容的。
- put键为null的K-V对的时候永远不会发生扩容。

那么在本文中分析了HashMap在JDK8中的put方法，基本可以总结出HashMap在JDK8中的扩容条件：

- 哈希表为null或者长度为0。
- 哈希表中存储的K-V对数超过了threshold。
- 链表中长度超过了8，并且哈希表长度未到达64，此时也会发生扩容。

对比JDK7和JDK8，HashMap的扩容条件也有些差异，这也是这两个JDK版本中HashMap的区别之一了。

再者，HashMap在JDK7和JDK8中的扩容机制其实也是有区别的，在JDK8中，HashMap的扩容机制有了改进，设计的非常巧妙，避免了JDK7中的『 **再哈希** 』，提高了扩容性能。接下来，我将使用示意图的形式将展示HashMap在JDK7和JDK8中的扩容基本算法，方便读者理解两个版本之间的差异。

###### 2.4.1 重新理解JDK7 HashMap的resize方法

首先我们将上一篇文章对resize方法（JDK7）进行分析的源码注释拷贝过来，扩容代码如下：

```java
void resize(int newCapacity) {
    Entry[] oldTable = table;
    int oldCapacity = oldTable.length;
    // 如果老数组的容量达到了最大，那么就将threshold设置为最大值，且不会再发生扩容
    if (oldCapacity == MAXIMUM_CAPACITY) {
        threshold = Integer.MAX_VALUE;
        return;
    }

	// 创建一个新的哈希表，容量是原来哈希表的两倍，也就是newCapacity = 2 * oldCapacity
    Entry[] newTable = new Entry[newCapacity];
    // 将重新计算所有Entry对象的下标，并重新排列各个Entry对象的位置，稍后分析transfer方法实现
    transfer(newTable, initHashSeedAsNeeded(newCapacity));
    table = newTable;
    // 重新计算新的扩容阈值threshold
    threshold = (int)Math.min(newCapacity * loadFactor, MAXIMUM_CAPACITY + 1);
}

void transfer(Entry[] newTable, boolean rehash) {
    int newCapacity = newTable.length;
    // 遍历老的table，遍历到每一个bucket的时候，都会将bucket上链表的节点都遍历一遍
    for (Entry<K,V> e : table) {
        while(null != e) {
            Entry<K,V> next = e.next;
            // 重新计算hash
            if (rehash) {
                e.hash = null == e.key ? 0 : hash(e.key);
            }
            // 重新计算下标
            int i = indexFor(e.hash, newCapacity);
            // 头节点插入链表
            e.next = newTable[i];
            newTable[i] = e;
            // 继续原链表的下一个节点
            e = next;
        }
    }
}
```

上面的代码展示了HashMap在JDK7中的扩容和数据迁移，基本过程是先创建一个容量是原来数组容量2倍的哈希表，然后遍历老哈希表，将每个桶内链表都遍历一遍，然后对每个key重新进行hash计算，然后将其插入到新的哈希表中，直到所有的Entry对象都转移到了新的哈希表中为止。

这里我们一起举个例子来展示一下HashMap在JDK7中的具体扩容过程。这里**假设获取下标的算法就是key的hash值对哈希表长度进行取模运算**（也可以是对`length - 1`进行取模运算，这里为了方便直接对长度取模运算），且所有的key都是有正整数来表示（因为正整数的hash值就是正整数本身），假设哈希表长度为4，有四个Entry对象，他们key分别是5，9，13，17，他们的值可以是任何同一类型的值，这里使用大写字母A，B，C，D来表示。四个Entry插入顺序按照key来排序就是17，13，9，5，按照本例中假设的下标算法，这四个Entry对象都发生了哈希冲突，且都位于下标为1的bucket桶中，如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200216134253474.png)

JDK中向链表中添加节点是采用的**头插入法**，哈希表长度为4，它的`threshold = 3`，当添加第四个节点的时候，发现达到了扩容的条件，那么就需要进行扩容，首先是新建一个容量为8的哈希表，然后将对老哈希表中所有节点再哈希，重新求取所有节点的下标，这里需要注意的是，整个扩容过程是在准备添加`key = 5`的Entry节点的时候触发的，那么首先将老哈希表中所有的Entry节点搬迁到新哈希表中，最后再添加`key = 5`的Entry节点到新哈希表中。在新的哈希表中插入Entry节点的顺序就变成了9，13，17，5，最后的插入结果如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200216141125677.png)

观察上图可以看出，当原链表中的节点key再出现哈希冲突的时候，必然会出现**倒挂**现象，这里的key=17和key=9的节点就出现了倒挂现象，这也就是HashMap内元素是无序的原因了，读者可以细细体会。

###### 2.4.2 对比理解JDK8 HashMap的resize方法

对比JDK7中HashMap，其实JDK8中，HashMap的扩容机制实现的原理也是类似的，也是遍历链表或者红黑树来完成数据的迁移。只不过两者之间的区别是后者不再重新对所有节点进行**再哈希**运算了，而是设计了一个更为巧妙的方式来确定节点的下标，那么到底是如何确定的呢？我们一同通过阅读源码来一探究竟。

```java
final Node<K,V>[] resize() {
    Node<K,V>[] oldTab = table;
    // 计算老哈希表的容量，如果老哈希表为空，那么容量为0，否则就是老哈希表的长度
    int oldCap = (oldTab == null) ? 0 : oldTab.length;
    // threshold的值有点特殊，当初始化扩容的时候，它就是哈希表需要扩容到的长度
    // 否则就是capacity * loadFactor了
    int oldThr = threshold;
    int newCap, newThr = 0;
    if (oldCap > 0) {
    	// 能进入到这里，说明不是初始化扩容，当容量已经到达最大的时候，就不再扩容
        if (oldCap >= MAXIMUM_CAPACITY) {
            threshold = Integer.MAX_VALUE;
            return oldTab;
        }
        else if ((newCap = oldCap << 1) < MAXIMUM_CAPACITY &&
                 oldCap >= DEFAULT_INITIAL_CAPACITY)
            // 新哈希表长度扩容到原来的两倍
            newThr = oldThr << 1; // double threshold
    }
    else if (oldThr > 0) // initial capacity was placed in threshold
    	// 能进入到这里，说明oldCap = 0，也就是初始化扩容，此时扩容的大小就应该是oldThr的值
    	// 且这个值必然是2的N次幂，前面已经通过方法tableSizeFor进行了计算
        newCap = oldThr;
    else {               // zero initial threshold signifies using defaults
    	// 如果上述条件都不满足，那么直接使用默认值16作为容量，12作为扩容阈值
        newCap = DEFAULT_INITIAL_CAPACITY;
        newThr = (int)(DEFAULT_LOAD_FACTOR * DEFAULT_INITIAL_CAPACITY);
    }
    // 下面的if是为了计算扩容阈值，因为上面三个条件中，第一和第二都没有计算threshold值
    if (newThr == 0) {
        float ft = (float)newCap * loadFactor;
        newThr = (newCap < MAXIMUM_CAPACITY && ft < (float)MAXIMUM_CAPACITY ?
                  (int)ft : Integer.MAX_VALUE);
    }
    // 到这里就完成了扩容后的容量和扩容阈值的计算工作
    threshold = newThr;
    // 创建新的哈希表，容量为newCap，扩容阈值为newThr
    @SuppressWarnings({"rawtypes","unchecked"})
    Node<K,V>[] newTab = (Node<K,V>[])new Node[newCap];
    // 将扩容后的哈希表赋值给table
    table = newTab;
    if (oldTab != null) {
    	// 能进入这里，说明不是初始化扩容
        for (int j = 0; j < oldCap; ++j) {
            Node<K,V> e;
            if ((e = oldTab[j]) != null) {
            	// 将桶内节点设置为null
                oldTab[j] = null;
                // 如果链表只有一个节点，那么直接重新计算索引存入新数组
                if (e.next == null)
                    newTab[e.hash & (newCap - 1)] = e;
                // 如果该节点是红黑树，执行split方法来处理红黑树节点，包括升级、降级、回退到链表等操作
                else if (e instanceof TreeNode)
                    ((TreeNode<K,V>)e).split(this, newTab, j, oldCap);
                else { // preserve order
                	// 说明是链表操作，接下来部分是重点
                	// "lo"前缀代表的是存储原bucket的节点，"hi"前缀代表的是存储在新bucket的节点
                	// loHead是头节点，loTail是尾节点
                    Node<K,V> loHead = null, loTail = null;
                    Node<K,V> hiHead = null, hiTail = null;
                    Node<K,V> next;
                    // 遍历链表
                    do {
                        next = e.next;
                        // 从if-else可以看出，对一条链表进行遍历，将链表中的元素通过
                        // 条件(e.hash & oldCap) == 0来进行分类，满足条件的存放在loHead链上
                        // 不满足条件的存放在hiHead链上，且都是尾部插入方式，这和JDK7的头部插入有区别
                        if ((e.hash & oldCap) == 0) {
                            if (loTail == null)
                                loHead = e;
                            else
                                loTail.next = e;
                            loTail = e;
                        }
                        else {
                            if (hiTail == null)
                                hiHead = e;
                            else
                                hiTail.next = e;
                            hiTail = e;
                        }
                    } while ((e = next) != null);
                    // 将loHead链放在数组的原位置
                    if (loTail != null) {
                        loTail.next = null;
                        newTab[j] = loHead;
                    }
                    // 将hiHead链放在数组的（j + oldCap）位置
                    if (hiTail != null) {
                        hiTail.next = null;
                        newTab[j + oldCap] = hiHead;
                    }
                }
            }
        }
    }
    return newTab;
}
```

其实读者对上面的代码读起来并不是很难，逻辑也很清晰，但是对于如何将一个链表拆分为两个链表可能会存在疑问，不知思绪在何方！其实光从链表分割的判断依据`(e.hash & oldCap) == 0`很难直接看清楚是如何判断，那么接下来我们就从判断条件出发，使用图文的形式将问题说清楚。
举个例子来说明一下：

我们假设有一个哈希表，表的容量为默认初始容量16，那么`length - 1 = 15`，15使用二进制表示就是：`0000 0000 0000 0000 0000 0000 0000 1111`，而任何key计算出来的hash值就可以使用二进制来表示，那么`(length - 1) & hash`，其实就是取hash值的最低四位，因为15的二进制前28位都为0，我们假设有四个K-V对，如下表所示：

| 键值对 | 键哈希值（二进制） | &运算后下标二进制 | 下标 |
|:--:|:--:|:--:|:--:|
| {5 : A} | `0000 0000 0000 0000 0000 0000 0000 0101` | `0101` | 5 |
| {21 : B} | `0000 0000 0000 0000 0000 0000 0001 0101` | `0101` | 5 |
| {37 : C} | `0000 0000 0000 0000 0000 0000 0010 0101` | `0101` | 5 |
| {53 : D} | `0000 0000 0000 0000 0000 0000 0011 0101` | `0101` | 5 |

正整数的hash值就是其本身，转换成二进制后对`length - 1`进行`&`运算，其实就是最后的二进制结果都是`0101`，所以下标都是5。也就是说这四个K-V组成的Node节点都在一个bucket内，且组成了单链表。我们假设需要对当前哈希表进行扩容，那么扩容后的容量就是32，那么各个节点的新的索引值就是`(32 - 1) & hash`，而31的二进制表示为`0000 0000 0000 0000 0000 0000 0001 1111`，其实就是去hash值的最低五位，因为31的二进制最低五位为`11111`，那么对hash值取最低五位其实就无非有两种情况：最后四位和hash值一致，第五位要么是1，要么是0，这么一来，上述四个键值对的key计算的下标如下表所示：

| 键值对 | 键哈希值（二进制） | &运算后下标二进制 | 下标 |
|:--:|:--:|:--:|:--:|
| {5 : A} | `0000 0000 0000 0000 0000 0000 0000 0101` | `0 0101` | 5 |
| {21 : B} | `0000 0000 0000 0000 0000 0000 0001 0101` | `1 0101` | 21 |
| {37 : C} | `0000 0000 0000 0000 0000 0000 0010 0101` | `0 0101` | 5 |
| {53 : D} | `0000 0000 0000 0000 0000 0000 0011 0101` | `1 0101` | 21 |

从上表中也可以看出来，`00101`和原来一样，下标依旧是5，而10101其实就是`10101 = 00101 + 10000 = 5 + 16 = j + oldCap`，其中`j`就是就是节点在老哈希表中的下标。故虽然数组大小扩大了一倍，但是同一个key在新旧哈希表中对应的下标却存在一定联系：要么一致，要么相差一个 oldCap。
基于这个结论，那么我们只需要看新增的高位是0或者是1即可，这里假设是从16扩容到32的，那么看第五位即可，其实就是`hash  & 10000`即可，也就是：

```shell
hash & 0000 0000 0000 0000 0000 0000 0001 0000
```

上式等价于：

```shell
hash & oldCap
```

所以这个等式的结果要么是0，要么就是16，也就是新增的高位（第五位）要么是0，要么是1，当为0的时候，那么Node节点下标不变，当为1的时候，Node节点下标为`j + oldCap`，这里也就是`5 + 16 = 21`，扩容结果如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/2020021715295476.png)

到这里，就基本完成了对HashMap在两个版本中扩容机制的补充说明，通过上面图文的详细讲解，读者肯定对整个扩容机制有了一个更加深刻的认识。

##### 2.5 理解HashMap的get方法

JDK7和JDK8中的get方法其实原理上没有多大区别，仅仅是JDK8中多了红黑树的节点获取，其他的基本一致，这里贴出源码，逐行对源码进行注释分析，至于流程，读者可以参考《[深入理解JDK7 HashMap](06JDK7-HashMap源码解析.md)》中对get方法的流程图描述，或者自行画出流程图，这里就不再贴出流程图。

```java
public V get(Object key) {
    Node<K,V> e;
    return (e = getNode(hash(key), key)) == null ? null : e.value;
}

final Node<K,V> getNode(int hash, Object key) {
    // tab：内部数组  first: 索引位首节点 n: 数组长度 k: 索引位首节点的key
    Node<K,V>[] tab; Node<K,V> first, e; int n; K k;
    // 数组不为null 数组长度大于0 索引位首节点不为null
    if ((tab = table) != null && (n = tab.length) > 0 &&
        (first = tab[(n - 1) & hash]) != null) {
        // 如果索引位首节点的hash==key的hash 或者 key和索引位首节点的k相同(逻辑相等)
        if (first.hash == hash && // always check first node
            ((k = first.key) == key || (key != null && key.equals(k))))
            // 返回索引位首节点(值对象)
            return first;
        if ((e = first.next) != null) {
            // 如果是红黑色则到红黑树中查找对应的节点
            if (first instanceof TreeNode)
                return ((TreeNode<K,V>)first).getTreeNode(hash, key);
            do {
                // 遍历链表，查询key相同的节点
                if (e.hash == hash &&
                    ((k = e.key) == key || (key != null && key.equals(k))))
                    return e;
            } while ((e = e.next) != null);
        }
    }
    return null;
}
```

把上述代码总结起来就是以下几个步骤：

1. 检查哈希表数组是否为null和索引位首节点（bucket的第一个节点）是否为null
2. 如果索引节点的hash==key的hash或 key和索引节点的k相同则直接返回（bucket的第一个节点）
3. 如果首节点是红黑色则到红黑树查找key相同的节点
4. 不是首节点，也不是红黑树，那么就开始遍历链表，获取与key相同键的节点
5. 如果都没找到就返回null

#### 三、几个关于HashMap的常见问题

##### 3.1 都说HashMap是线程不安全的，那么到底不安全在哪？

HashMap在多线程环境下，存在数据覆盖的问题。这里以JDK7为代表举一个put的例子，线程1和线程2同时对哈希表中的某个索引位置put一个Entry节点，线程1获取到指定索引位置的头节点，线程2也同时获取到了指定位置的头节点，因此两个线程都同时创建一个新的Entry对象存到指定的索引位置上，并将新的Entry节点的next属性指向老的头节点，这就会产生数据覆盖的问题，假设线程2先完成，那么线程1就会直接覆覆盖掉线程2插入的头节点。

##### 3.2 HashMap的扩容死锁是如何造成的？

HashMap的扩容死锁问题发生在JDK7及以前版本中，这是因为JDK7及以前版本在扩容后的数据迁移采用的头插入法，JDK8以后版本进行了优化，采用的是尾部插入法以及两队链表，避免了该问题。现在就以JDK7的HashMap为例，来分析一下是如何造成扩容死锁的。
在JDK7中，数据的迁移是在如下代码中完成的：

```java
void transfer(Entry[] newTable, boolean rehash) {
    int newCapacity = newTable.length;
    // 遍历老的table，遍历到每一个bucket的时候，都会将bucket上链表的节点都遍历一遍
    for (Entry<K,V> e : table) {
        while(null != e) {
            Entry<K,V> next = e.next;
            // 重新计算hash
            if (rehash) {
                e.hash = null == e.key ? 0 : hash(e.key);
            }
            // 重新计算下标
            int i = indexFor(e.hash, newCapacity);
            // 头节点插入链表
            e.next = newTable[i];
            newTable[i] = e;
            // 继续原链表的下一个节点
            e = next;
        }
    }
}
```

其实就是重新确定链表中的节点的索引下标，然后将其插入到对应的下标的链表内，JDK7采用的是头节点插入，其实这就给了多线程环境下产生扩容死锁机会。接下来我使用图来说明这一现象。
原哈希表如下图所示，为了排版方便，不在统一画出hash、key、value、next等属性，统一使用一个方格表示这四个属性。

**原哈希表：**

<div style="text-align:center"><img src="https://img-blog.csdnimg.cn/20200217183647644.png" width = "60%"  alt=""/></div>

线程1和2各自创建了一个新的哈希表，假设在线程1已做完扩容操作后，线程2才开始扩容。此时对于线程2来说，当前节点e指向A节点，下一个节点e.next仍然指向B节点，而此时在线程1的链表中，已经是C->B->A的顺序。按照头插法，线程2中哈希表的bucket指向A节点，此时A节点成为线程B中链表的头节点，如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200217220707583.png)

A节点成为线程2中链表的头节点后，下一个结点e.next为B节点。很显然，下一个节点满足`e.next != null`，那么当前节点e就变成了B节点，下一个节点e.next变为A结点。继续执行头插法，将B变为链表的头结点，同时next指针指向旧的头节点A，如下图：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200217221355895.png)

此时，下一个节点e.next为A节点，不为null，继续头插法。指针后移，那么当前节点e就成为了A结点，下一个结点为null。将A节点作为线程2链表中的头结点，并将next指针指向原来的旧头节点B，如下图所示：

![在这里插入图片描述](https://img-blog.csdnimg.cn/20200217221314203.png)

此时已经形成了环链表，A和B节点中互有对方引用，这也是HashMap线程不安全的一种表现。

##### 3.3 如何规避HashMap的线程不安全问题？

HashMap是非线程安全的，可以使用`Collections.SynchronizedMap()`来包装HashMap，使其具备线程安全的特性。多线程环境下，可以使用ConcurrentHashMap来代替HashMap，ConcurrentHashMap的用法和HashMap基本一致，读者可以完全实现切换零成本。后续笔者将继续推出ConcurrentHashMap的内部原理分析，敬请期待！
