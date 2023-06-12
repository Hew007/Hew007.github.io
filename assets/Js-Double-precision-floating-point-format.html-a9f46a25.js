import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as o,o as c,c as i,a as l,b as n,d as s,e,f as p}from"./app-d75e961b.js";const u={},r=n("h2",{id:"背景",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#背景","aria-hidden":"true"},"#"),s(" 背景")],-1),d=n("p",null,"最近项目中，有涉及到金额的计算以及相关的运算判断，由于忽略了浮点数存在的问题，导致一些判断和计算在某些情况下出现问题，导致bug产生。虽说之前已了解浮点型计算相关问题，但没有在实际的开发过程中重视，加之之前很少接触到金额相关数字处理的业务场景，导致，重蹈前人之覆辙。在此，做一个记录和简单刨析，以加深印象。",-1),k=n("h2",{id:"问题",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#问题","aria-hidden":"true"},"#"),s(" 问题")],-1),m=p(`<div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token number">0.1</span> <span class="token operator">+</span> <span class="token number">0.2</span>  <span class="token comment">// 输出：0.30000000000000004</span>
<span class="token number">4.56</span> <span class="token operator">*</span> <span class="token number">100</span>  <span class="token comment">// 输出：455.99999999999994</span>
<span class="token number">4.56</span> <span class="token operator">-</span> <span class="token number">2.56</span>  <span class="token comment">// 输出：1.9999999999999996</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如以上代码所示，某些情况下，运算出的值和预期不符，这就是浮点数的精度问题。所以，在处理数字相关运算的时候，如果忽略了这个问题，必然会导致某些情况下bug的出现。对于涉及到钱的问题上，这个问题还是马虎不得的。为什么会出现这样的问题呢？</p><h2 id="原因" tabindex="-1"><a class="header-anchor" href="#原因" aria-hidden="true">#</a> 原因</h2><h3 id="浮点和浮点数" tabindex="-1"><a class="header-anchor" href="#浮点和浮点数" aria-hidden="true">#</a> 浮点和浮点数</h3><blockquote><p>在计算机科学中，浮点（英语：floating point，缩写为FP）是一种对于实数的近似值数值表现法，由一个有效数字（即尾数）加上幂数来表示，通常是乘以某个基数的整数次指数得到。以这种表示法表示的数值，称为浮点数（floating-point number）。利用浮点进行运算，称为浮点计算，这种运算通常伴随着因为无法精确表示而进行的近似或舍入。</p></blockquote>`,5),v={href:"https://zh.wikipedia.org/wiki/%E6%B5%AE%E7%82%B9%E6%95%B0",target:"_blank",rel:"noopener noreferrer"},b=n("strong",null,"近似",-1),f=p(`<h3 id="二进制和十进制的转换" tabindex="-1"><a class="header-anchor" href="#二进制和十进制的转换" aria-hidden="true">#</a> 二进制和十进制的转换</h3><p>计算机内部是使用二进位制的运算，在计算之前会将我们使用的十进制数值，转换为二进制数值，然后再进行运算。我们可以通过除2取余法，来将十进制数值，转换为二进制数值。然后从后往前依次排列对应的数字即得到二进制对应的数值，我们可以用一个简单的方法描述这个过程：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// 6/2 = 3 余 0</span>
<span class="token comment">// 3/2 = 1 余 1</span>
<span class="token comment">// 1/2 = 0 余 1</span>
<span class="token comment">// 则结果即为 110</span>
<span class="token doc-comment comment">/**
 * 十进制整数转二进制
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> <span class="token parameter">decimal</span>
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> 二进制数据
 */</span>
<span class="token keyword">function</span> <span class="token function">decimalToBinary</span><span class="token punctuation">(</span><span class="token parameter">decimal</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isNaN</span><span class="token punctuation">(</span>decimal<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&#39;input value must be Number&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> decimal<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 是否为整数</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>Number<span class="token punctuation">.</span><span class="token function">isInteger</span><span class="token punctuation">(</span>decimal<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        console<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&#39;input value must be Int&#39;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> decimal<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">let</span> num <span class="token operator">=</span> <span class="token function">Number</span><span class="token punctuation">(</span>decimal<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">let</span> numArr <span class="token operator">=</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">;</span>
    <span class="token comment">// 不断循环取余数推入数组</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>num <span class="token operator">&gt;=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>num <span class="token operator">===</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            numArr<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        numArr<span class="token punctuation">.</span><span class="token function">unshift</span><span class="token punctuation">(</span>num <span class="token operator">%</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        num <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">floor</span><span class="token punctuation">(</span>num <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token function">Number</span><span class="token punctuation">(</span>numArr<span class="token punctuation">.</span><span class="token function">join</span><span class="token punctuation">(</span><span class="token string">&#39;&#39;</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span> 
<span class="token function">decimalToBinary</span><span class="token punctuation">(</span><span class="token number">2</span><span class="token punctuation">)</span> <span class="token comment">// 10  &lt;= 2^2 + 0</span>
<span class="token function">decimalToBinary</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span> <span class="token comment">// 11  &lt;= 2^2 +2^1</span>
<span class="token function">decimalToBinary</span><span class="token punctuation">(</span><span class="token number">4</span><span class="token punctuation">)</span> <span class="token comment">// 100 &lt;= 2^3</span>
<span class="token function">decimalToBinary</span><span class="token punctuation">(</span><span class="token number">5</span><span class="token punctuation">)</span> <span class="token comment">// 101 &lt;= 2^3 + 2^0</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>二进制转换为十进制比较简单，可通过2的次幂累加得到，比如二进制11，转为为十进制为 <code>2^1+2^0 = 3</code>。对于整数，进行二进制和十进制的转换还是比较简单的。但是对于小数就稍微复杂一点。十进制小数转换为二进制小数可通过乘2取整法进行换算，将小数，一直乘以2，将结果个位数取出取出，再拿小数去乘2，依次进行。小数的二进制转十进制方法和整数类似，取2的次幂即可。文字描述不好理解，下面通过示例进行描述：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token comment">// eg: 0.625和0.1为例</span>

<span class="token comment">/*
*** 0.625 ***
* 0.625 * 2 = 1.25  取出 1 继续拿剩下的0.25计算
* 0.25 * 2 = 0.5 取 0 剩余0.5
* 0.5 * 2 = 1  取 1 剩余 0 
* 0 * 2 = 0 …… ……
* 则最后的到结果为 0.10100000... 即为0.101  
转换为十进制相当于 2^-1 + 0^-2 + 2^-3 = 1/2 + 0 + 1/8 = 0.625
*/</span>

<span class="token comment">/*
*** 0.1 ***
* 0.1 * 2 = 0.2 取出 0 剩下的0.2计算
* 0.2 * 2 = 0.4 取 0 剩余0.4
* 0.4 * 2 = 0.8 取 0 剩余 0.8
* 0.8 * 2 = 1.6 取 1 剩余 0.6
* 0.6 * 2 = 1.2 取 1 剩余 0.2 这里将开始和第一行一样，进入循环了
* 0.2 * 2 = 0.4 取 0 剩余 0.4
* 0.4 * 2 = 0.8 取 0 剩余 0.8
* ...此时已经进入了无线循环了 0011
* 则最后的到结果为 0.0 0011 0011 0011 0011 0011……
* 转换为10进制相当于 2^-4 + 2^-5 + 2^-8 +2^-9 …… 1/16 + 1/32 +。。。。。
* 可以看出二进制描述的十进制其实是2的次幂的无限逼近，所以最终就导致了误差存在
*/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从以上的二进制小数转换为十进制小数过程中，0.625刚好可以很好的用二进制0.101表示，但是，0.1却不行。对于像0.1这类数，实际上二进制是通过无限去逼近这个数字，却不能完全等于，所以就出现了误差，当位数取得越小，误差越大。0.1即1/10，小于1/2<sup>3（即八分之），大于1/2</sup>4，所以只能用一个最解决1/10的2的N次幂去累加，这时就产生了误差。</p><h3 id="javascript精度" tabindex="-1"><a class="header-anchor" href="#javascript精度" aria-hidden="true">#</a> javascript精度</h3><blockquote><p>在 JavaScript 中, Number 是一种 定义为 64位双精度浮点型（double-precision 64-bit floating point format） (IEEE 754)的数字数据类型。在其他编程语言中，有不同的数字类型存在，比如：整型（Integers），单精度浮点型（Floats），双精度浮点型（Doubles），大数（Bignums）。</p></blockquote><figure><img src="http://qncdn.yunishare.cn/927px-IEEE_754_Double_Floating_Point_Format.svg.png@water" alt="927px-IEEE_754_Double_Floating_Point_Format.svg" tabindex="0" loading="lazy"><figcaption>927px-IEEE_754_Double_Floating_Point_Format.svg</figcaption></figure><p>上图为64位双精度浮点表示，其中第1位为sign位，用来正负类型。2-12共11位用来表示次方数，剩余的52位表示精确度。IEEE 754 标准的 64 位双精度浮点数的小数部分最多支持53位二进制位，能表示的十进制小数在15~17位之间。2^−53 ≈ 1.11 × 10^−16。正是由于这个精度问题，就导致了根本的问题。</p><p>通过上面转换2进制小数的方法，我们分别可以计算得出二进制的0.1和0.2，分别为</p><p><code>0.0001100110011001...</code></p><p><code>0.0011001100110011...</code></p><p>然后相加计算，因精度问题，要截断52位之后结果为：<code>0.0100110011001100110011001100110011001100110011001100</code> ，然后，转换为10进制即为：0.30000000000000004。</p><h2 id="解决方法" tabindex="-1"><a class="header-anchor" href="#解决方法" aria-hidden="true">#</a> 解决方法</h2><p>由上面的问题可以看出，其实，我们所要解决的就是误差问题。对此我们可以先将小数转换为整数，然后将其四舍五入，再将其除回去即即可满足要求，下面提供一种简单的处理方法，由于是临时写的，可能存在纰漏未考虑到情况，如需使用，请先测试，代码如下：</p><div class="language-javascript line-numbers-mode" data-ext="js"><pre class="language-javascript"><code><span class="token doc-comment comment">/**
 * 获取小数中小数点后的位数
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> <span class="token parameter">num</span> 传入的小数
 * <span class="token keyword">@returns</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> 小数点后的位数
 */</span>
<span class="token keyword">function</span> <span class="token function">getDecimalLen</span><span class="token punctuation">(</span><span class="token parameter">num</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">isNaN</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 判断是否是小数 不是小数返回0</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>Number<span class="token punctuation">.</span><span class="token function">isInteger</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">const</span> len <span class="token operator">=</span> num<span class="token punctuation">.</span><span class="token function">toString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">split</span><span class="token punctuation">(</span><span class="token string">&#39;.&#39;</span><span class="token punctuation">)</span><span class="token punctuation">[</span><span class="token number">1</span><span class="token punctuation">]</span><span class="token punctuation">.</span>length<span class="token punctuation">;</span>
    <span class="token keyword">return</span> len<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 对数字进行四舍五入
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> <span class="token parameter">num</span> 传入的数字 
 */</span>
<span class="token keyword">function</span> <span class="token function">numRound</span><span class="token punctuation">(</span><span class="token parameter">num</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span><span class="token punctuation">(</span>num <span class="token operator">&gt;=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 解决round负数处理的问题</span>
    <span class="token keyword">return</span> <span class="token operator">-</span>Math<span class="token punctuation">.</span><span class="token function">round</span><span class="token punctuation">(</span><span class="token operator">-</span>num<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 对两个数进行运算返回处理后的值，解决精度导致的问题
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> <span class="token parameter">first</span> 需要运算的第一位数值
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>String<span class="token punctuation">}</span></span> <span class="token parameter">type</span> 运算的类型 取值未 + - * /
 * <span class="token keyword">@param</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> <span class="token parameter">second</span> 需要运算的第一位数值
 * <span class="token keyword">@return</span> <span class="token class-name"><span class="token punctuation">{</span>Number<span class="token punctuation">}</span></span> 运算后的结果
 */</span>
<span class="token keyword">function</span> <span class="token function">computedFloatNumber</span><span class="token punctuation">(</span><span class="token parameter">first<span class="token punctuation">,</span> type<span class="token punctuation">,</span> second</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 分别获取参与运算两个数字的小数位数</span>
    <span class="token keyword">const</span> maxLen <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">max</span><span class="token punctuation">(</span><span class="token function">getDecimalLen</span><span class="token punctuation">(</span>first<span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token function">getDecimalLen</span><span class="token punctuation">(</span>second<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 取最大得位数对应的10得次方分别与两个数相乘，将小数转换为整数</span>
    <span class="token keyword">const</span> baseNum <span class="token operator">=</span> Math<span class="token punctuation">.</span><span class="token function">pow</span><span class="token punctuation">(</span><span class="token number">10</span><span class="token punctuation">,</span> maxLen<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 将其进行四舍五入进一步解决精度问题</span>
    <span class="token keyword">const</span> firstVal <span class="token operator">=</span> <span class="token function">numRound</span><span class="token punctuation">(</span>first <span class="token operator">*</span> baseNum<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> secondVal <span class="token operator">=</span> <span class="token function">numRound</span><span class="token punctuation">(</span>second <span class="token operator">*</span> baseNum<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">const</span> comput <span class="token operator">=</span> <span class="token punctuation">{</span>
        <span class="token string-property property">&#39;+&#39;</span><span class="token operator">:</span> <span class="token punctuation">(</span>firstVal <span class="token operator">+</span> secondVal<span class="token punctuation">)</span> <span class="token operator">/</span> baseNum<span class="token punctuation">,</span>
        <span class="token string-property property">&#39;-&#39;</span><span class="token operator">:</span> <span class="token punctuation">(</span>firstVal <span class="token operator">-</span> secondVal<span class="token punctuation">)</span> <span class="token operator">/</span> baseNum<span class="token punctuation">,</span>
        <span class="token string-property property">&#39;*&#39;</span><span class="token operator">:</span> <span class="token punctuation">(</span>firstVal <span class="token operator">*</span> secondVal<span class="token punctuation">)</span> <span class="token operator">/</span> Math<span class="token punctuation">.</span><span class="token function">pow</span><span class="token punctuation">(</span>baseNum<span class="token punctuation">,</span> <span class="token number">2</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
        <span class="token string-property property">&#39;/&#39;</span><span class="token operator">:</span> <span class="token punctuation">(</span>firstVal <span class="token operator">/</span> secondVal<span class="token punctuation">)</span>
    <span class="token punctuation">}</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span>  comput<span class="token punctuation">[</span>type<span class="token punctuation">]</span> <span class="token operator">||</span> <span class="token number">0</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>以上思路即先将小数转换为整数，然后进行四舍五入解决精度问题，再除以对应的乘数还原小数。这里注意，乘法要出乘数的平方。</p><h2 id="参考资料" tabindex="-1"><a class="header-anchor" href="#参考资料" aria-hidden="true">#</a> 参考资料</h2>`,19),h={href:"https://en.wikipedia.org/wiki/Double-precision_floating-point_format",target:"_blank",rel:"noopener noreferrer"},g={href:"https://www.jianshu.com/p/560aba49c9a4",target:"_blank",rel:"noopener noreferrer"},y={href:"https://www.runoob.com/w3cnote/js-precision-problem-and-solution.html",target:"_blank",rel:"noopener noreferrer"};function w(_,N){const a=o("ExternalLinkIcon");return c(),i("div",null,[r,d,k,l(" more "),m,n("p",null,[s("以上的定义，引用自"),n("a",v,[s("维基百科：浮点数"),e(a)]),s("。浮点数即是一种对实数的"),b,s("表示法，“近似”这两个字就是我们计算不准确的根本原因。")]),f,n("ol",null,[n("li",null,[n("a",h,[s("维基百科 - 双精度浮点数"),e(a)])]),n("li",null,[n("a",g,[s("二进制计算方法"),e(a)])]),n("li",null,[n("a",y,[s("菜鸟教程-JavaScript精度问题"),e(a)])])])])}const j=t(u,[["render",w],["__file","Js-Double-precision-floating-point-format.html.vue"]]);export{j as default};