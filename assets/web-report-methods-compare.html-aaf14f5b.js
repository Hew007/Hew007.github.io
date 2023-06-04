import{_ as o}from"./plugin-vue_export-helper-c27b6911.js";import{r,o as a,c as s,a as d,b as e,d as t,e as l,f as c}from"./app-103a0f43.js";const i={},h=e("h2",{id:"背景",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#背景","aria-hidden":"true"},"#"),t(" 背景")],-1),u=e("p",null,"最近在做前端监控项目时，遇到了关于前端数据上报方式的相关问题。故在此做一个分析和探讨，来比较和分析一下哪种上报方式时最优的，或者说，哪一种上报方式更适合自身，适合当前的业务。我认为，抛开实际使用场景谈孰优孰劣就是耍流氓。凡是都要实事求是，一切从实际出发，才能找出最优解。",-1),_=c('<h2 id="实现方式" tabindex="-1"><a class="header-anchor" href="#实现方式" aria-hidden="true">#</a> 实现方式</h2><p>目前业界前端采集上报数据的实现方式，大致分三种。一种为接口请求方式上报，一种为图片打点方式上报，另一种为使用比较新的<code>navigator.sendBeacon API</code>进行上报。</p><p>接口请求</p><p>接口请求指通过Ajax/Fetch等方式，将收集到的数据通过固定的接口发送给服务端，即我们业务中通常向后端请求接口发送数据的方式。这种方式发送数据相对来说比较简单，使用post接口可以发送比较大量的数据。这种方式是异步，不会阻塞和影响页面正常渲染，但是，还是会占用一定的客户端资源，且需要特殊处理跨域限制。</p><p>图片打点</p><p>图片打点方式即通过请求一个图片，通常为1乘1px大小图片，然后将收集的数据拼接在这个图片的url后面，这样，静态资源服务器（比如nginx服务器）就能记录到请求的信息，将其存入日志。之后，便可以通过分析存入的日志，获取到所收集到的信息。这种方式可以说是一条蹊径，简单，占用资源低且天然可跨域，目前大部分前端监控上报产品都采用了类似的方式，进行数据的收集。但是，由于是get请求，对上报的数据量有一定的限制。</p><p>sendBeacon</p><p>navigator.sendBeacon是一个比较新的API，它能异步的以post方式发送数据到服务端，且不会影响页面渲染和阻塞页面，即使页面关闭，也不会影响其数据的发送，浏览器会对其进行调度，以确保其可靠性和最低影响性。并且不受跨域限制，浏览器兼容性也比较好，可以支持除IE之外的几乎所有浏览器。其采集数据方式，即可以像请求一样直接拿到上报的数据进行存储，也可以像图片打点一样，来存储日志，再做分析。</p><h2 id="对比" tabindex="-1"><a class="header-anchor" href="#对比" aria-hidden="true">#</a> 对比</h2><p>根据以上我们对三种类型数据上报方式的介绍，下面对其从多个角度做一个对比，这样，我们看起来也会更直观。</p>',10),p=e("thead",null,[e("tr",null,[e("th",null,"方式类型/对比参数"),e("th",null,"接口请求"),e("th",null,"图片打点"),e("th",null,"sendBeacon")])],-1),m=e("tr",null,[e("td",null,"资源占用大小"),e("td",null,"一般post传输,相对开销较大"),e("td",null,"很小"),e("td",null,"较小")],-1),f=e("tr",null,[e("td",null,"是否阻塞页面"),e("td",null,"异步不阻塞页面，同步会阻塞页面"),e("td",null,"不阻塞"),e("td",null,"不阻塞")],-1),b=e("td",null,"传输数据大小",-1),x=e("td",null,"使用post传输量很大，无特殊限制",-1),g=e("td",null,"由于使用get，传输量比较小，一般为2~8kb",-1),k={href:"https://stackoverflow.com/questions/28989640/navigator-sendbeacon-data-size-limits",target:"_blank",rel:"noopener noreferrer"},B=e("tr",null,[e("td",null,"跨域"),e("td",null,"默认不支持跨域，需要特殊配置"),e("td",null,"天然支持跨域"),e("td",null,"支持跨域")],-1),v=e("tr",null,[e("td",null,"安全性"),e("td",null,"一般"),e("td",null,"由于请求的是静态资源相对安全"),e("td",null,"一般")],-1),w=e("tr",null,[e("td",null,"兼容性"),e("td",null,"比较好；需要支持js脚本及XHR"),e("td",null,"极好，可以说是任何设备浏览器"),e("td",null,"比较好；除IE之外绝大多数PC和手机浏览器，包括国产的UC、QQ、Baidu等")],-1),I=e("tr",null,[e("td",null,"实施难度"),e("td",null,"相对简单，和开发业务类似"),e("td",null,"相对复杂，需要先记录日志，再分析日志，获取数据"),e("td",null,"可以简单可以复杂，取决于采取的是打点日志方式还是直接解析数据方式")],-1),E=e("h2",{id:"结论",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#结论","aria-hidden":"true"},"#"),t(" 结论")],-1),C=e("p",null,"从上面的对比中我们可以看出，三种数据上报方式没有一种方式在任何方面都是优秀的，都有一定的优缺点。接口请求可以传输较大数据量，但是，其性能开销和跨域存在缺陷。图片打点各方面都很优秀，但是其上报数据量有大小限制。sendBeacon各方面指标也不错，但是不能兼容IE。所以，对于不同的业务目标，我们可能需要采取不同的方式去进行数据的上报。",-1),P=e("p",null,"如果采集指标数据量比较大，甚至我还要通过分析客户端渲染截图等大量数据采集的场景，此时，post接口请求应该更适合这样的场景。而对于数据采集量比较小，比如，只是采集一些客户端的pv、uv 、以及错误，或者说对兼容性要求较高等，此时采用图片打点的方式，应该是最好的选择。而还有一些场景，我们对指标的可靠性要求较高，比如，需要统计页面停留时间，浏览时长、关闭或跳转页面行为等，此时使用sendBeacon就可以保证数据可靠性，保证数据即使是跳转和关闭页面，也能正常发送收集的数据到服务端。",-1),N=e("p",null,"当然，上述三种上报数据的方式并不是孤立的，也可以根据不同场景选择多种上报方式。我们为了保证数据可靠性，可以优先使用sendBeacon方式进行上报，再不支持此API情况或者传输数据失败时，再采取图片打点方式上报，这样，能更好的保证数据可靠性和项目的兼容性。",-1),T=e("h3",{id:"参考资料",tabindex:"-1"},[e("a",{class:"header-anchor",href:"#参考资料","aria-hidden":"true"},"#"),t(" 参考资料")],-1),V={href:"https://mp.weixin.qq.com/s/v6R2w26qZkEilXY0mPUBCw?utm_source=tuicool&utm_medium=referral",target:"_blank",rel:"noopener noreferrer"},q={href:"http://siegelwang.cn/computer_programs/analytics",target:"_blank",rel:"noopener noreferrer"},A={href:"https://www.cnblogs.com/joechinochl/articles/6047145.html",target:"_blank",rel:"noopener noreferrer"};function j(y,R){const n=r("ExternalLinkIcon");return a(),s("div",null,[h,u,d(" more "),_,e("table",null,[p,e("tbody",null,[m,f,e("tr",null,[b,x,g,e("td",null,[t("较小 Chrome最大64kb，长度不超过"),e("a",k,[t("65536"),l(n)]),t("个字符")])]),B,v,w,I])]),E,C,P,N,T,e("ol",null,[e("li",null,[e("a",V,[t("为什么前端监控要用GIF打点"),l(n)])]),e("li",null,[e("a",q,[t("前端监控analytic"),l(n)])]),e("li",null,[e("a",A,[t("关于 HTTP GET/POST 请求参数长度最大值的一个理解误区"),l(n)])])])])}const H=o(i,[["render",j],["__file","web-report-methods-compare.html.vue"]]);export{H as default};
