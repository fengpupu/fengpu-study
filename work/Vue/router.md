# beforeEach 钩子中动态添加路由，出现警告，并且出现匹配问题
> 警告是因为，第一次匹配没有找到，匹配会在beforeEach之前进行，如果没有匹配到，就会发生警告

> 匹配问题是，没有重新路由
> * 可以是return ，相当于新一次的push，可以是next，但next容易引起问题。因为next在参数中标明之后，必须使用，所以next已经不推荐使用。

# Vue3 name + params 的方式失败，找不到params