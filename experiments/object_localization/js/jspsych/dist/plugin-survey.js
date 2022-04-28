var jsPsychSurvey = (function (jspsych) {
	'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var survey_ko = {exports: {}};

	var knockoutLatest = {exports: {}};

	/*!
	 * Knockout JavaScript library v3.5.1
	 * (c) The Knockout.js team - http://knockoutjs.com/
	 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
	 */

	(function (module, exports) {
	(function() {(function(n){var A=this||(0, eval)("this"),w=A.document,R=A.navigator,v=A.jQuery,H=A.JSON;v||"undefined"===typeof jQuery||(v=jQuery);(function(n){n(module.exports||exports);})(function(S,T){function K(a,c){return null===a||typeof a in W?a===c:!1}function X(b,c){var d;return function(){d||(d=a.a.setTimeout(function(){d=n;b();},c));}}function Y(b,c){var d;return function(){clearTimeout(d);
	d=a.a.setTimeout(b,c);}}function Z(a,c){c&&"change"!==c?"beforeChange"===c?this.pc(a):this.gb(a,c):this.qc(a);}function aa(a,c){null!==c&&c.s&&c.s();}function ba(a,c){var d=this.qd,e=d[r];e.ra||(this.Qb&&this.mb[c]?(d.uc(c,a,this.mb[c]),this.mb[c]=null,--this.Qb):e.I[c]||d.uc(c,a,e.J?{da:a}:d.$c(a)),a.Ja&&a.gd());}var a="undefined"!==typeof S?S:{};a.b=function(b,c){for(var d=b.split("."),e=a,f=0;f<d.length-1;f++)e=e[d[f]];e[d[d.length-1]]=c;};a.L=function(a,c,d){a[c]=d;};a.version="3.5.1";a.b("version",
	a.version);a.options={deferUpdates:!1,useOnlyNativeEvents:!1,foreachHidesDestroyed:!1};a.a=function(){function b(a,b){for(var c in a)f.call(a,c)&&b(c,a[c]);}function c(a,b){if(b)for(var c in b)f.call(b,c)&&(a[c]=b[c]);return a}function d(a,b){a.__proto__=b;return a}function e(b,c,d,e){var l=b[c].match(q)||[];a.a.D(d.match(q),function(b){a.a.Na(l,b,e);});b[c]=l.join(" ");}var f=Object.prototype.hasOwnProperty,g={__proto__:[]}instanceof Array,h="function"===typeof Symbol,m={},k={};m[R&&/Firefox\/2/i.test(R.userAgent)?
	"KeyboardEvent":"UIEvents"]=["keyup","keydown","keypress"];m.MouseEvents="click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave".split(" ");b(m,function(a,b){if(b.length)for(var c=0,d=b.length;c<d;c++)k[b[c]]=a;});var l={propertychange:!0},p=w&&function(){for(var a=3,b=w.createElement("div"),c=b.getElementsByTagName("i");b.innerHTML="\x3c!--[if gt IE "+ ++a+"]><i></i><![endif]--\x3e",c[0];);return 4<a?a:n}(),q=/\S+/g,t;return {Jc:["authenticity_token",/^__RequestVerificationToken(_.*)?$/],
	D:function(a,b,c){for(var d=0,e=a.length;d<e;d++)b.call(c,a[d],d,a);},A:"function"==typeof Array.prototype.indexOf?function(a,b){return Array.prototype.indexOf.call(a,b)}:function(a,b){for(var c=0,d=a.length;c<d;c++)if(a[c]===b)return c;return -1},Lb:function(a,b,c){for(var d=0,e=a.length;d<e;d++)if(b.call(c,a[d],d,a))return a[d];return n},Pa:function(b,c){var d=a.a.A(b,c);0<d?b.splice(d,1):0===d&&b.shift();},wc:function(b){var c=[];b&&a.a.D(b,function(b){0>a.a.A(c,b)&&c.push(b);});return c},Mb:function(a,
	b,c){var d=[];if(a)for(var e=0,l=a.length;e<l;e++)d.push(b.call(c,a[e],e));return d},jb:function(a,b,c){var d=[];if(a)for(var e=0,l=a.length;e<l;e++)b.call(c,a[e],e)&&d.push(a[e]);return d},Nb:function(a,b){if(b instanceof Array)a.push.apply(a,b);else for(var c=0,d=b.length;c<d;c++)a.push(b[c]);return a},Na:function(b,c,d){var e=a.a.A(a.a.bc(b),c);0>e?d&&b.push(c):d||b.splice(e,1);},Ba:g,extend:c,setPrototypeOf:d,Ab:g?d:c,P:b,Ga:function(a,b,c){if(!a)return a;var d={},e;for(e in a)f.call(a,e)&&(d[e]=
	b.call(c,a[e],e,a));return d},Tb:function(b){for(;b.firstChild;)a.removeNode(b.firstChild);},Yb:function(b){b=a.a.la(b);for(var c=(b[0]&&b[0].ownerDocument||w).createElement("div"),d=0,e=b.length;d<e;d++)c.appendChild(a.oa(b[d]));return c},Ca:function(b,c){for(var d=0,e=b.length,l=[];d<e;d++){var k=b[d].cloneNode(!0);l.push(c?a.oa(k):k);}return l},va:function(b,c){a.a.Tb(b);if(c)for(var d=0,e=c.length;d<e;d++)b.appendChild(c[d]);},Xc:function(b,c){var d=b.nodeType?[b]:b;if(0<d.length){for(var e=d[0],
	l=e.parentNode,k=0,f=c.length;k<f;k++)l.insertBefore(c[k],e);k=0;for(f=d.length;k<f;k++)a.removeNode(d[k]);}},Ua:function(a,b){if(a.length){for(b=8===b.nodeType&&b.parentNode||b;a.length&&a[0].parentNode!==b;)a.splice(0,1);for(;1<a.length&&a[a.length-1].parentNode!==b;)a.length--;if(1<a.length){var c=a[0],d=a[a.length-1];for(a.length=0;c!==d;)a.push(c),c=c.nextSibling;a.push(d);}}return a},Zc:function(a,b){7>p?a.setAttribute("selected",b):a.selected=b;},Db:function(a){return null===a||a===n?"":a.trim?
	a.trim():a.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g,"")},Ud:function(a,b){a=a||"";return b.length>a.length?!1:a.substring(0,b.length)===b},vd:function(a,b){if(a===b)return !0;if(11===a.nodeType)return !1;if(b.contains)return b.contains(1!==a.nodeType?a.parentNode:a);if(b.compareDocumentPosition)return 16==(b.compareDocumentPosition(a)&16);for(;a&&a!=b;)a=a.parentNode;return !!a},Sb:function(b){return a.a.vd(b,b.ownerDocument.documentElement)},kd:function(b){return !!a.a.Lb(b,a.a.Sb)},R:function(a){return a&&
	a.tagName&&a.tagName.toLowerCase()},Ac:function(b){return a.onError?function(){try{return b.apply(this,arguments)}catch(c){throw a.onError&&a.onError(c),c;}}:b},setTimeout:function(b,c){return setTimeout(a.a.Ac(b),c)},Gc:function(b){setTimeout(function(){a.onError&&a.onError(b);throw b;},0);},B:function(b,c,d){var e=a.a.Ac(d);d=l[c];if(a.options.useOnlyNativeEvents||d||!v)if(d||"function"!=typeof b.addEventListener)if("undefined"!=typeof b.attachEvent){var k=function(a){e.call(b,a);},f="on"+c;b.attachEvent(f,
	k);a.a.K.za(b,function(){b.detachEvent(f,k);});}else throw Error("Browser doesn't support addEventListener or attachEvent");else b.addEventListener(c,e,!1);else t||(t="function"==typeof v(b).on?"on":"bind"),v(b)[t](c,e);},Fb:function(b,c){if(!b||!b.nodeType)throw Error("element must be a DOM node when calling triggerEvent");var d;"input"===a.a.R(b)&&b.type&&"click"==c.toLowerCase()?(d=b.type,d="checkbox"==d||"radio"==d):d=!1;if(a.options.useOnlyNativeEvents||!v||d)if("function"==typeof w.createEvent)if("function"==
	typeof b.dispatchEvent)d=w.createEvent(k[c]||"HTMLEvents"),d.initEvent(c,!0,!0,A,0,0,0,0,0,!1,!1,!1,!1,0,b),b.dispatchEvent(d);else throw Error("The supplied element doesn't support dispatchEvent");else if(d&&b.click)b.click();else if("undefined"!=typeof b.fireEvent)b.fireEvent("on"+c);else throw Error("Browser doesn't support triggering events");else v(b).trigger(c);},f:function(b){return a.O(b)?b():b},bc:function(b){return a.O(b)?b.v():b},Eb:function(b,c,d){var l;c&&("object"===typeof b.classList?
	(l=b.classList[d?"add":"remove"],a.a.D(c.match(q),function(a){l.call(b.classList,a);})):"string"===typeof b.className.baseVal?e(b.className,"baseVal",c,d):e(b,"className",c,d));},Bb:function(b,c){var d=a.a.f(c);if(null===d||d===n)d="";var e=a.h.firstChild(b);!e||3!=e.nodeType||a.h.nextSibling(e)?a.h.va(b,[b.ownerDocument.createTextNode(d)]):e.data=d;a.a.Ad(b);},Yc:function(a,b){a.name=b;if(7>=p)try{var c=a.name.replace(/[&<>'"]/g,function(a){return "&#"+a.charCodeAt(0)+";"});a.mergeAttributes(w.createElement("<input name='"+
	c+"'/>"),!1);}catch(d){}},Ad:function(a){9<=p&&(a=1==a.nodeType?a:a.parentNode,a.style&&(a.style.zoom=a.style.zoom));},wd:function(a){if(p){var b=a.style.width;a.style.width=0;a.style.width=b;}},Pd:function(b,c){b=a.a.f(b);c=a.a.f(c);for(var d=[],e=b;e<=c;e++)d.push(e);return d},la:function(a){for(var b=[],c=0,d=a.length;c<d;c++)b.push(a[c]);return b},Da:function(a){return h?Symbol(a):a},Zd:6===p,$d:7===p,W:p,Lc:function(b,c){for(var d=a.a.la(b.getElementsByTagName("input")).concat(a.a.la(b.getElementsByTagName("textarea"))),
	e="string"==typeof c?function(a){return a.name===c}:function(a){return c.test(a.name)},l=[],k=d.length-1;0<=k;k--)e(d[k])&&l.push(d[k]);return l},Nd:function(b){return "string"==typeof b&&(b=a.a.Db(b))?H&&H.parse?H.parse(b):(new Function("return "+b))():null},hc:function(b,c,d){if(!H||!H.stringify)throw Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
	return H.stringify(a.a.f(b),c,d)},Od:function(c,d,e){e=e||{};var l=e.params||{},k=e.includeFields||this.Jc,f=c;if("object"==typeof c&&"form"===a.a.R(c))for(var f=c.action,h=k.length-1;0<=h;h--)for(var g=a.a.Lc(c,k[h]),m=g.length-1;0<=m;m--)l[g[m].name]=g[m].value;d=a.a.f(d);var p=w.createElement("form");p.style.display="none";p.action=f;p.method="post";for(var q in d)c=w.createElement("input"),c.type="hidden",c.name=q,c.value=a.a.hc(a.a.f(d[q])),p.appendChild(c);b(l,function(a,b){var c=w.createElement("input");
	c.type="hidden";c.name=a;c.value=b;p.appendChild(c);});w.body.appendChild(p);e.submitter?e.submitter(p):p.submit();setTimeout(function(){p.parentNode.removeChild(p);},0);}}}();a.b("utils",a.a);a.b("utils.arrayForEach",a.a.D);a.b("utils.arrayFirst",a.a.Lb);a.b("utils.arrayFilter",a.a.jb);a.b("utils.arrayGetDistinctValues",a.a.wc);a.b("utils.arrayIndexOf",a.a.A);a.b("utils.arrayMap",a.a.Mb);a.b("utils.arrayPushAll",a.a.Nb);a.b("utils.arrayRemoveItem",a.a.Pa);a.b("utils.cloneNodes",a.a.Ca);a.b("utils.createSymbolOrString",
	a.a.Da);a.b("utils.extend",a.a.extend);a.b("utils.fieldsIncludedWithJsonPost",a.a.Jc);a.b("utils.getFormFields",a.a.Lc);a.b("utils.objectMap",a.a.Ga);a.b("utils.peekObservable",a.a.bc);a.b("utils.postJson",a.a.Od);a.b("utils.parseJson",a.a.Nd);a.b("utils.registerEventHandler",a.a.B);a.b("utils.stringifyJson",a.a.hc);a.b("utils.range",a.a.Pd);a.b("utils.toggleDomNodeCssClass",a.a.Eb);a.b("utils.triggerEvent",a.a.Fb);a.b("utils.unwrapObservable",a.a.f);a.b("utils.objectForEach",a.a.P);a.b("utils.addOrRemoveItem",
	a.a.Na);a.b("utils.setTextContent",a.a.Bb);a.b("unwrap",a.a.f);Function.prototype.bind||(Function.prototype.bind=function(a){var c=this;if(1===arguments.length)return function(){return c.apply(a,arguments)};var d=Array.prototype.slice.call(arguments,1);return function(){var e=d.slice(0);e.push.apply(e,arguments);return c.apply(a,e)}});a.a.g=new function(){var b=0,c="__ko__"+(new Date).getTime(),d={},e,f;a.a.W?(e=function(a,e){var f=a[c];if(!f||"null"===f||!d[f]){if(!e)return n;f=a[c]="ko"+b++;d[f]=
	{};}return d[f]},f=function(a){var b=a[c];return b?(delete d[b],a[c]=null,!0):!1}):(e=function(a,b){var d=a[c];!d&&b&&(d=a[c]={});return d},f=function(a){return a[c]?(delete a[c],!0):!1});return {get:function(a,b){var c=e(a,!1);return c&&c[b]},set:function(a,b,c){(a=e(a,c!==n))&&(a[b]=c);},Ub:function(a,b,c){a=e(a,!0);return a[b]||(a[b]=c)},clear:f,Z:function(){return b++ +c}}};a.b("utils.domData",a.a.g);a.b("utils.domData.clear",a.a.g.clear);a.a.K=new function(){function b(b,c){var d=a.a.g.get(b,e);
	d===n&&c&&(d=[],a.a.g.set(b,e,d));return d}function c(c){var e=b(c,!1);if(e)for(var e=e.slice(0),k=0;k<e.length;k++)e[k](c);a.a.g.clear(c);a.a.K.cleanExternalData(c);g[c.nodeType]&&d(c.childNodes,!0);}function d(b,d){for(var e=[],l,f=0;f<b.length;f++)if(!d||8===b[f].nodeType)if(c(e[e.length]=l=b[f]),b[f]!==l)for(;f--&&-1==a.a.A(e,b[f]););}var e=a.a.g.Z(),f={1:!0,8:!0,9:!0},g={1:!0,9:!0};return {za:function(a,c){if("function"!=typeof c)throw Error("Callback must be a function");b(a,!0).push(c);},yb:function(c,
	d){var f=b(c,!1);f&&(a.a.Pa(f,d),0==f.length&&a.a.g.set(c,e,n));},oa:function(b){a.u.G(function(){f[b.nodeType]&&(c(b),g[b.nodeType]&&d(b.getElementsByTagName("*")));});return b},removeNode:function(b){a.oa(b);b.parentNode&&b.parentNode.removeChild(b);},cleanExternalData:function(a){v&&"function"==typeof v.cleanData&&v.cleanData([a]);}}};a.oa=a.a.K.oa;a.removeNode=a.a.K.removeNode;a.b("cleanNode",a.oa);a.b("removeNode",a.removeNode);a.b("utils.domNodeDisposal",a.a.K);a.b("utils.domNodeDisposal.addDisposeCallback",
	a.a.K.za);a.b("utils.domNodeDisposal.removeDisposeCallback",a.a.K.yb);(function(){var b=[0,"",""],c=[1,"<table>","</table>"],d=[3,"<table><tbody><tr>","</tr></tbody></table>"],e=[1,"<select multiple='multiple'>","</select>"],f={thead:c,tbody:c,tfoot:c,tr:[2,"<table><tbody>","</tbody></table>"],td:d,th:d,option:e,optgroup:e},g=8>=a.a.W;a.a.ua=function(c,d){var e;if(v)if(v.parseHTML)e=v.parseHTML(c,d)||[];else {if((e=v.clean([c],d))&&e[0]){for(var l=e[0];l.parentNode&&11!==l.parentNode.nodeType;)l=l.parentNode;
	l.parentNode&&l.parentNode.removeChild(l);}}else {(e=d)||(e=w);var l=e.parentWindow||e.defaultView||A,p=a.a.Db(c).toLowerCase(),q=e.createElement("div"),t;t=(p=p.match(/^(?:\x3c!--.*?--\x3e\s*?)*?<([a-z]+)[\s>]/))&&f[p[1]]||b;p=t[0];t="ignored<div>"+t[1]+c+t[2]+"</div>";"function"==typeof l.innerShiv?q.appendChild(l.innerShiv(t)):(g&&e.body.appendChild(q),q.innerHTML=t,g&&q.parentNode.removeChild(q));for(;p--;)q=q.lastChild;e=a.a.la(q.lastChild.childNodes);}return e};a.a.Md=function(b,c){var d=a.a.ua(b,
	c);return d.length&&d[0].parentElement||a.a.Yb(d)};a.a.fc=function(b,c){a.a.Tb(b);c=a.a.f(c);if(null!==c&&c!==n)if("string"!=typeof c&&(c=c.toString()),v)v(b).html(c);else for(var d=a.a.ua(c,b.ownerDocument),e=0;e<d.length;e++)b.appendChild(d[e]);};})();a.b("utils.parseHtmlFragment",a.a.ua);a.b("utils.setHtml",a.a.fc);a.aa=function(){function b(c,e){if(c)if(8==c.nodeType){var f=a.aa.Uc(c.nodeValue);null!=f&&e.push({ud:c,Kd:f});}else if(1==c.nodeType)for(var f=0,g=c.childNodes,h=g.length;f<h;f++)b(g[f],
	e);}var c={};return {Xb:function(a){if("function"!=typeof a)throw Error("You can only pass a function to ko.memoization.memoize()");var b=(4294967296*(1+Math.random())|0).toString(16).substring(1)+(4294967296*(1+Math.random())|0).toString(16).substring(1);c[b]=a;return "\x3c!--[ko_memo:"+b+"]--\x3e"},bd:function(a,b){var f=c[a];if(f===n)throw Error("Couldn't find any memo with ID "+a+". Perhaps it's already been unmemoized.");try{return f.apply(null,b||[]),!0}finally{delete c[a];}},cd:function(c,e){var f=
	[];b(c,f);for(var g=0,h=f.length;g<h;g++){var m=f[g].ud,k=[m];e&&a.a.Nb(k,e);a.aa.bd(f[g].Kd,k);m.nodeValue="";m.parentNode&&m.parentNode.removeChild(m);}},Uc:function(a){return (a=a.match(/^\[ko_memo\:(.*?)\]$/))?a[1]:null}}}();a.b("memoization",a.aa);a.b("memoization.memoize",a.aa.Xb);a.b("memoization.unmemoize",a.aa.bd);a.b("memoization.parseMemoText",a.aa.Uc);a.b("memoization.unmemoizeDomNodeAndDescendants",a.aa.cd);a.na=function(){function b(){if(f)for(var b=f,c=0,d;h<f;)if(d=e[h++]){if(h>b){if(5E3<=
	++c){h=f;a.a.Gc(Error("'Too much recursion' after processing "+c+" task groups."));break}b=f;}try{d();}catch(p){a.a.Gc(p);}}}function c(){b();h=f=e.length=0;}var d,e=[],f=0,g=1,h=0;A.MutationObserver?d=function(a){var b=w.createElement("div");(new MutationObserver(a)).observe(b,{attributes:!0});return function(){b.classList.toggle("foo");}}(c):d=w&&"onreadystatechange"in w.createElement("script")?function(a){var b=w.createElement("script");b.onreadystatechange=function(){b.onreadystatechange=null;w.documentElement.removeChild(b);
	b=null;a();};w.documentElement.appendChild(b);}:function(a){setTimeout(a,0);};return {scheduler:d,zb:function(b){f||a.na.scheduler(c);e[f++]=b;return g++},cancel:function(a){a=a-(g-f);a>=h&&a<f&&(e[a]=null);},resetForTesting:function(){var a=f-h;h=f=e.length=0;return a},Sd:b}}();a.b("tasks",a.na);a.b("tasks.schedule",a.na.zb);a.b("tasks.runEarly",a.na.Sd);a.Ta={throttle:function(b,c){b.throttleEvaluation=c;var d=null;return a.$({read:b,write:function(e){clearTimeout(d);d=a.a.setTimeout(function(){b(e);},
	c);}})},rateLimit:function(a,c){var d,e,f;"number"==typeof c?d=c:(d=c.timeout,e=c.method);a.Hb=!1;f="function"==typeof e?e:"notifyWhenChangesStop"==e?Y:X;a.ub(function(a){return f(a,d,c)});},deferred:function(b,c){if(!0!==c)throw Error("The 'deferred' extender only accepts the value 'true', because it is not supported to turn deferral off once enabled.");b.Hb||(b.Hb=!0,b.ub(function(c){var e,f=!1;return function(){if(!f){a.na.cancel(e);e=a.na.zb(c);try{f=!0,b.notifySubscribers(n,"dirty");}finally{f=
	!1;}}}}));},notify:function(a,c){a.equalityComparer="always"==c?null:K;}};var W={undefined:1,"boolean":1,number:1,string:1};a.b("extenders",a.Ta);a.ic=function(b,c,d){this.da=b;this.lc=c;this.mc=d;this.Ib=!1;this.fb=this.Jb=null;a.L(this,"dispose",this.s);a.L(this,"disposeWhenNodeIsRemoved",this.l);};a.ic.prototype.s=function(){this.Ib||(this.fb&&a.a.K.yb(this.Jb,this.fb),this.Ib=!0,this.mc(),this.da=this.lc=this.mc=this.Jb=this.fb=null);};a.ic.prototype.l=function(b){this.Jb=b;a.a.K.za(b,this.fb=this.s.bind(this));};
	a.T=function(){a.a.Ab(this,D);D.qb(this);};var D={qb:function(a){a.U={change:[]};a.sc=1;},subscribe:function(b,c,d){var e=this;d=d||"change";var f=new a.ic(e,c?b.bind(c):b,function(){a.a.Pa(e.U[d],f);e.hb&&e.hb(d);});e.Qa&&e.Qa(d);e.U[d]||(e.U[d]=[]);e.U[d].push(f);return f},notifySubscribers:function(b,c){c=c||"change";"change"===c&&this.Gb();if(this.Wa(c)){var d="change"===c&&this.ed||this.U[c].slice(0);try{a.u.xc();for(var e=0,f;f=d[e];++e)f.Ib||f.lc(b);}finally{a.u.end();}}},ob:function(){return this.sc},
	Dd:function(a){return this.ob()!==a},Gb:function(){++this.sc;},ub:function(b){var c=this,d=a.O(c),e,f,g,h,m;c.gb||(c.gb=c.notifySubscribers,c.notifySubscribers=Z);var k=b(function(){c.Ja=!1;d&&h===c&&(h=c.nc?c.nc():c());var a=f||m&&c.sb(g,h);m=f=e=!1;a&&c.gb(g=h);});c.qc=function(a,b){b&&c.Ja||(m=!b);c.ed=c.U.change.slice(0);c.Ja=e=!0;h=a;k();};c.pc=function(a){e||(g=a,c.gb(a,"beforeChange"));};c.rc=function(){m=!0;};c.gd=function(){c.sb(g,c.v(!0))&&(f=!0);};},Wa:function(a){return this.U[a]&&this.U[a].length},
	Bd:function(b){if(b)return this.U[b]&&this.U[b].length||0;var c=0;a.a.P(this.U,function(a,b){"dirty"!==a&&(c+=b.length);});return c},sb:function(a,c){return !this.equalityComparer||!this.equalityComparer(a,c)},toString:function(){return "[object Object]"},extend:function(b){var c=this;b&&a.a.P(b,function(b,e){var f=a.Ta[b];"function"==typeof f&&(c=f(c,e)||c);});return c}};a.L(D,"init",D.qb);a.L(D,"subscribe",D.subscribe);a.L(D,"extend",D.extend);a.L(D,"getSubscriptionsCount",D.Bd);a.a.Ba&&a.a.setPrototypeOf(D,
	Function.prototype);a.T.fn=D;a.Qc=function(a){return null!=a&&"function"==typeof a.subscribe&&"function"==typeof a.notifySubscribers};a.b("subscribable",a.T);a.b("isSubscribable",a.Qc);a.S=a.u=function(){function b(a){d.push(e);e=a;}function c(){e=d.pop();}var d=[],e,f=0;return {xc:b,end:c,cc:function(b){if(e){if(!a.Qc(b))throw Error("Only subscribable things can act as dependencies");e.od.call(e.pd,b,b.fd||(b.fd=++f));}},G:function(a,d,e){try{return b(),a.apply(d,e||[])}finally{c();}},qa:function(){if(e)return e.o.qa()},
	Va:function(){if(e)return e.o.Va()},Ya:function(){if(e)return e.Ya},o:function(){if(e)return e.o}}}();a.b("computedContext",a.S);a.b("computedContext.getDependenciesCount",a.S.qa);a.b("computedContext.getDependencies",a.S.Va);a.b("computedContext.isInitial",a.S.Ya);a.b("computedContext.registerDependency",a.S.cc);a.b("ignoreDependencies",a.Yd=a.u.G);var I=a.a.Da("_latestValue");a.ta=function(b){function c(){if(0<arguments.length)return c.sb(c[I],arguments[0])&&(c.ya(),c[I]=arguments[0],c.xa()),this;
	a.u.cc(c);return c[I]}c[I]=b;a.a.Ba||a.a.extend(c,a.T.fn);a.T.fn.qb(c);a.a.Ab(c,F);a.options.deferUpdates&&a.Ta.deferred(c,!0);return c};var F={equalityComparer:K,v:function(){return this[I]},xa:function(){this.notifySubscribers(this[I],"spectate");this.notifySubscribers(this[I]);},ya:function(){this.notifySubscribers(this[I],"beforeChange");}};a.a.Ba&&a.a.setPrototypeOf(F,a.T.fn);var G=a.ta.Ma="__ko_proto__";F[G]=a.ta;a.O=function(b){if((b="function"==typeof b&&b[G])&&b!==F[G]&&b!==a.o.fn[G])throw Error("Invalid object that looks like an observable; possibly from another Knockout instance");
	return !!b};a.Za=function(b){return "function"==typeof b&&(b[G]===F[G]||b[G]===a.o.fn[G]&&b.Nc)};a.b("observable",a.ta);a.b("isObservable",a.O);a.b("isWriteableObservable",a.Za);a.b("isWritableObservable",a.Za);a.b("observable.fn",F);a.L(F,"peek",F.v);a.L(F,"valueHasMutated",F.xa);a.L(F,"valueWillMutate",F.ya);a.Ha=function(b){b=b||[];if("object"!=typeof b||!("length"in b))throw Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");b=a.ta(b);a.a.Ab(b,
	a.Ha.fn);return b.extend({trackArrayChanges:!0})};a.Ha.fn={remove:function(b){for(var c=this.v(),d=[],e="function"!=typeof b||a.O(b)?function(a){return a===b}:b,f=0;f<c.length;f++){var g=c[f];if(e(g)){0===d.length&&this.ya();if(c[f]!==g)throw Error("Array modified during remove; cannot remove item");d.push(g);c.splice(f,1);f--;}}d.length&&this.xa();return d},removeAll:function(b){if(b===n){var c=this.v(),d=c.slice(0);this.ya();c.splice(0,c.length);this.xa();return d}return b?this.remove(function(c){return 0<=
	a.a.A(b,c)}):[]},destroy:function(b){var c=this.v(),d="function"!=typeof b||a.O(b)?function(a){return a===b}:b;this.ya();for(var e=c.length-1;0<=e;e--){var f=c[e];d(f)&&(f._destroy=!0);}this.xa();},destroyAll:function(b){return b===n?this.destroy(function(){return !0}):b?this.destroy(function(c){return 0<=a.a.A(b,c)}):[]},indexOf:function(b){var c=this();return a.a.A(c,b)},replace:function(a,c){var d=this.indexOf(a);0<=d&&(this.ya(),this.v()[d]=c,this.xa());},sorted:function(a){var c=this().slice(0);
	return a?c.sort(a):c.sort()},reversed:function(){return this().slice(0).reverse()}};a.a.Ba&&a.a.setPrototypeOf(a.Ha.fn,a.ta.fn);a.a.D("pop push reverse shift sort splice unshift".split(" "),function(b){a.Ha.fn[b]=function(){var a=this.v();this.ya();this.zc(a,b,arguments);var d=a[b].apply(a,arguments);this.xa();return d===a?this:d};});a.a.D(["slice"],function(b){a.Ha.fn[b]=function(){var a=this();return a[b].apply(a,arguments)};});a.Pc=function(b){return a.O(b)&&"function"==typeof b.remove&&"function"==
	typeof b.push};a.b("observableArray",a.Ha);a.b("isObservableArray",a.Pc);a.Ta.trackArrayChanges=function(b,c){function d(){function c(){if(m){var d=[].concat(b.v()||[]),e;if(b.Wa("arrayChange")){if(!f||1<m)f=a.a.Pb(k,d,b.Ob);e=f;}k=d;f=null;m=0;e&&e.length&&b.notifySubscribers(e,"arrayChange");}}e?c():(e=!0,h=b.subscribe(function(){++m;},null,"spectate"),k=[].concat(b.v()||[]),f=null,g=b.subscribe(c));}b.Ob={};c&&"object"==typeof c&&a.a.extend(b.Ob,c);b.Ob.sparse=!0;if(!b.zc){var e=!1,f=null,g,h,m=0,
	k,l=b.Qa,p=b.hb;b.Qa=function(a){l&&l.call(b,a);"arrayChange"===a&&d();};b.hb=function(a){p&&p.call(b,a);"arrayChange"!==a||b.Wa("arrayChange")||(g&&g.s(),h&&h.s(),h=g=null,e=!1,k=n);};b.zc=function(b,c,d){function l(a,b,c){return k[k.length]={status:a,value:b,index:c}}if(e&&!m){var k=[],p=b.length,g=d.length,h=0;switch(c){case "push":h=p;case "unshift":for(c=0;c<g;c++)l("added",d[c],h+c);break;case "pop":h=p-1;case "shift":p&&l("deleted",b[h],h);break;case "splice":c=Math.min(Math.max(0,0>d[0]?p+d[0]:
	d[0]),p);for(var p=1===g?p:Math.min(c+(d[1]||0),p),g=c+g-2,h=Math.max(p,g),U=[],L=[],n=2;c<h;++c,++n)c<p&&L.push(l("deleted",b[c],c)),c<g&&U.push(l("added",d[n],c));a.a.Kc(L,U);break;default:return}f=k;}};}};var r=a.a.Da("_state");a.o=a.$=function(b,c,d){function e(){if(0<arguments.length){if("function"===typeof f)f.apply(g.nb,arguments);else throw Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");return this}g.ra||
	a.u.cc(e);(g.ka||g.J&&e.Xa())&&e.ha();return g.X}"object"===typeof b?d=b:(d=d||{},b&&(d.read=b));if("function"!=typeof d.read)throw Error("Pass a function that returns the value of the ko.computed");var f=d.write,g={X:n,sa:!0,ka:!0,rb:!1,jc:!1,ra:!1,wb:!1,J:!1,Wc:d.read,nb:c||d.owner,l:d.disposeWhenNodeIsRemoved||d.l||null,Sa:d.disposeWhen||d.Sa,Rb:null,I:{},V:0,Ic:null};e[r]=g;e.Nc="function"===typeof f;a.a.Ba||a.a.extend(e,a.T.fn);a.T.fn.qb(e);a.a.Ab(e,C);d.pure?(g.wb=!0,g.J=!0,a.a.extend(e,da)):
	d.deferEvaluation&&a.a.extend(e,ea);a.options.deferUpdates&&a.Ta.deferred(e,!0);g.l&&(g.jc=!0,g.l.nodeType||(g.l=null));g.J||d.deferEvaluation||e.ha();g.l&&e.ja()&&a.a.K.za(g.l,g.Rb=function(){e.s();});return e};var C={equalityComparer:K,qa:function(){return this[r].V},Va:function(){var b=[];a.a.P(this[r].I,function(a,d){b[d.Ka]=d.da;});return b},Vb:function(b){if(!this[r].V)return !1;var c=this.Va();return -1!==a.a.A(c,b)?!0:!!a.a.Lb(c,function(a){return a.Vb&&a.Vb(b)})},uc:function(a,c,d){if(this[r].wb&&
	c===this)throw Error("A 'pure' computed must not be called recursively");this[r].I[a]=d;d.Ka=this[r].V++;d.La=c.ob();},Xa:function(){var a,c,d=this[r].I;for(a in d)if(Object.prototype.hasOwnProperty.call(d,a)&&(c=d[a],this.Ia&&c.da.Ja||c.da.Dd(c.La)))return !0},Jd:function(){this.Ia&&!this[r].rb&&this.Ia(!1);},ja:function(){var a=this[r];return a.ka||0<a.V},Rd:function(){this.Ja?this[r].ka&&(this[r].sa=!0):this.Hc();},$c:function(a){if(a.Hb){var c=a.subscribe(this.Jd,this,"dirty"),d=a.subscribe(this.Rd,
	this);return {da:a,s:function(){c.s();d.s();}}}return a.subscribe(this.Hc,this)},Hc:function(){var b=this,c=b.throttleEvaluation;c&&0<=c?(clearTimeout(this[r].Ic),this[r].Ic=a.a.setTimeout(function(){b.ha(!0);},c)):b.Ia?b.Ia(!0):b.ha(!0);},ha:function(b){var c=this[r],d=c.Sa,e=!1;if(!c.rb&&!c.ra){if(c.l&&!a.a.Sb(c.l)||d&&d()){if(!c.jc){this.s();return}}else c.jc=!1;c.rb=!0;try{e=this.zd(b);}finally{c.rb=!1;}return e}},zd:function(b){var c=this[r],d=!1,e=c.wb?n:!c.V,d={qd:this,mb:c.I,Qb:c.V};a.u.xc({pd:d,
	od:ba,o:this,Ya:e});c.I={};c.V=0;var f=this.yd(c,d);c.V?d=this.sb(c.X,f):(this.s(),d=!0);d&&(c.J?this.Gb():this.notifySubscribers(c.X,"beforeChange"),c.X=f,this.notifySubscribers(c.X,"spectate"),!c.J&&b&&this.notifySubscribers(c.X),this.rc&&this.rc());e&&this.notifySubscribers(c.X,"awake");return d},yd:function(b,c){try{var d=b.Wc;return b.nb?d.call(b.nb):d()}finally{a.u.end(),c.Qb&&!b.J&&a.a.P(c.mb,aa),b.sa=b.ka=!1;}},v:function(a){var c=this[r];(c.ka&&(a||!c.V)||c.J&&this.Xa())&&this.ha();return c.X},
	ub:function(b){a.T.fn.ub.call(this,b);this.nc=function(){this[r].J||(this[r].sa?this.ha():this[r].ka=!1);return this[r].X};this.Ia=function(a){this.pc(this[r].X);this[r].ka=!0;a&&(this[r].sa=!0);this.qc(this,!a);};},s:function(){var b=this[r];!b.J&&b.I&&a.a.P(b.I,function(a,b){b.s&&b.s();});b.l&&b.Rb&&a.a.K.yb(b.l,b.Rb);b.I=n;b.V=0;b.ra=!0;b.sa=!1;b.ka=!1;b.J=!1;b.l=n;b.Sa=n;b.Wc=n;this.Nc||(b.nb=n);}},da={Qa:function(b){var c=this,d=c[r];if(!d.ra&&d.J&&"change"==b){d.J=!1;if(d.sa||c.Xa())d.I=null,d.V=
	0,c.ha()&&c.Gb();else {var e=[];a.a.P(d.I,function(a,b){e[b.Ka]=a;});a.a.D(e,function(a,b){var e=d.I[a],m=c.$c(e.da);m.Ka=b;m.La=e.La;d.I[a]=m;});c.Xa()&&c.ha()&&c.Gb();}d.ra||c.notifySubscribers(d.X,"awake");}},hb:function(b){var c=this[r];c.ra||"change"!=b||this.Wa("change")||(a.a.P(c.I,function(a,b){b.s&&(c.I[a]={da:b.da,Ka:b.Ka,La:b.La},b.s());}),c.J=!0,this.notifySubscribers(n,"asleep"));},ob:function(){var b=this[r];b.J&&(b.sa||this.Xa())&&this.ha();return a.T.fn.ob.call(this)}},ea={Qa:function(a){"change"!=
	a&&"beforeChange"!=a||this.v();}};a.a.Ba&&a.a.setPrototypeOf(C,a.T.fn);var N=a.ta.Ma;C[N]=a.o;a.Oc=function(a){return "function"==typeof a&&a[N]===C[N]};a.Fd=function(b){return a.Oc(b)&&b[r]&&b[r].wb};a.b("computed",a.o);a.b("dependentObservable",a.o);a.b("isComputed",a.Oc);a.b("isPureComputed",a.Fd);a.b("computed.fn",C);a.L(C,"peek",C.v);a.L(C,"dispose",C.s);a.L(C,"isActive",C.ja);a.L(C,"getDependenciesCount",C.qa);a.L(C,"getDependencies",C.Va);a.xb=function(b,c){if("function"===typeof b)return a.o(b,
	c,{pure:!0});b=a.a.extend({},b);b.pure=!0;return a.o(b,c)};a.b("pureComputed",a.xb);(function(){function b(a,f,g){g=g||new d;a=f(a);if("object"!=typeof a||null===a||a===n||a instanceof RegExp||a instanceof Date||a instanceof String||a instanceof Number||a instanceof Boolean)return a;var h=a instanceof Array?[]:{};g.save(a,h);c(a,function(c){var d=f(a[c]);switch(typeof d){case "boolean":case "number":case "string":case "function":h[c]=d;break;case "object":case "undefined":var l=g.get(d);h[c]=l!==
	n?l:b(d,f,g);}});return h}function c(a,b){if(a instanceof Array){for(var c=0;c<a.length;c++)b(c);"function"==typeof a.toJSON&&b("toJSON");}else for(c in a)b(c);}function d(){this.keys=[];this.values=[];}a.ad=function(c){if(0==arguments.length)throw Error("When calling ko.toJS, pass the object you want to convert.");return b(c,function(b){for(var c=0;a.O(b)&&10>c;c++)b=b();return b})};a.toJSON=function(b,c,d){b=a.ad(b);return a.a.hc(b,c,d)};d.prototype={constructor:d,save:function(b,c){var d=a.a.A(this.keys,
	b);0<=d?this.values[d]=c:(this.keys.push(b),this.values.push(c));},get:function(b){b=a.a.A(this.keys,b);return 0<=b?this.values[b]:n}};})();a.b("toJS",a.ad);a.b("toJSON",a.toJSON);a.Wd=function(b,c,d){function e(c){var e=a.xb(b,d).extend({ma:"always"}),h=e.subscribe(function(a){a&&(h.s(),c(a));});e.notifySubscribers(e.v());return h}return "function"!==typeof Promise||c?e(c.bind(d)):new Promise(e)};a.b("when",a.Wd);(function(){a.w={M:function(b){switch(a.a.R(b)){case "option":return !0===b.__ko__hasDomDataOptionValue__?
	a.a.g.get(b,a.c.options.$b):7>=a.a.W?b.getAttributeNode("value")&&b.getAttributeNode("value").specified?b.value:b.text:b.value;case "select":return 0<=b.selectedIndex?a.w.M(b.options[b.selectedIndex]):n;default:return b.value}},cb:function(b,c,d){switch(a.a.R(b)){case "option":"string"===typeof c?(a.a.g.set(b,a.c.options.$b,n),"__ko__hasDomDataOptionValue__"in b&&delete b.__ko__hasDomDataOptionValue__,b.value=c):(a.a.g.set(b,a.c.options.$b,c),b.__ko__hasDomDataOptionValue__=!0,b.value="number"===
	typeof c?c:"");break;case "select":if(""===c||null===c)c=n;for(var e=-1,f=0,g=b.options.length,h;f<g;++f)if(h=a.w.M(b.options[f]),h==c||""===h&&c===n){e=f;break}if(d||0<=e||c===n&&1<b.size)b.selectedIndex=e,6===a.a.W&&a.a.setTimeout(function(){b.selectedIndex=e;},0);break;default:if(null===c||c===n)c="";b.value=c;}}};})();a.b("selectExtensions",a.w);a.b("selectExtensions.readValue",a.w.M);a.b("selectExtensions.writeValue",a.w.cb);a.m=function(){function b(b){b=a.a.Db(b);123===b.charCodeAt(0)&&(b=b.slice(1,
	-1));b+="\n,";var c=[],d=b.match(e),p,q=[],h=0;if(1<d.length){for(var x=0,B;B=d[x];++x){var u=B.charCodeAt(0);if(44===u){if(0>=h){c.push(p&&q.length?{key:p,value:q.join("")}:{unknown:p||q.join("")});p=h=0;q=[];continue}}else if(58===u){if(!h&&!p&&1===q.length){p=q.pop();continue}}else if(47===u&&1<B.length&&(47===B.charCodeAt(1)||42===B.charCodeAt(1)))continue;else 47===u&&x&&1<B.length?(u=d[x-1].match(f))&&!g[u[0]]&&(b=b.substr(b.indexOf(B)+1),d=b.match(e),x=-1,B="/"):40===u||123===u||91===u?++h:
	41===u||125===u||93===u?--h:p||q.length||34!==u&&39!==u||(B=B.slice(1,-1));q.push(B);}if(0<h)throw Error("Unbalanced parentheses, braces, or brackets");}return c}var c=["true","false","null","undefined"],d=/^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i,e=RegExp("\"(?:\\\\.|[^\"])*\"|'(?:\\\\.|[^'])*'|`(?:\\\\.|[^`])*`|/\\*(?:[^*]|\\*+[^*/])*\\*+/|//.*\n|/(?:\\\\.|[^/])+/w*|[^\\s:,/][^,\"'`{}()/:[\\]]*[^\\s,\"'`{}()/:[\\]]|[^\\s]","g"),f=/[\])"'A-Za-z0-9_$]+$/,g={"in":1,"return":1,"typeof":1},
	h={};return {Ra:[],wa:h,ac:b,vb:function(e,f){function l(b,e){var f;if(!x){var k=a.getBindingHandler(b);if(k&&k.preprocess&&!(e=k.preprocess(e,b,l)))return;if(k=h[b])f=e,0<=a.a.A(c,f)?f=!1:(k=f.match(d),f=null===k?!1:k[1]?"Object("+k[1]+")"+k[2]:f),k=f;k&&q.push("'"+("string"==typeof h[b]?h[b]:b)+"':function(_z){"+f+"=_z}");}g&&(e="function(){return "+e+" }");p.push("'"+b+"':"+e);}f=f||{};var p=[],q=[],g=f.valueAccessors,x=f.bindingParams,B="string"===typeof e?b(e):e;a.a.D(B,function(a){l(a.key||a.unknown,
	a.value);});q.length&&l("_ko_property_writers","{"+q.join(",")+" }");return p.join(",")},Id:function(a,b){for(var c=0;c<a.length;c++)if(a[c].key==b)return !0;return !1},eb:function(b,c,d,e,f){if(b&&a.O(b))!a.Za(b)||f&&b.v()===e||b(e);else if((b=c.get("_ko_property_writers"))&&b[d])b[d](e);}}}();a.b("expressionRewriting",a.m);a.b("expressionRewriting.bindingRewriteValidators",a.m.Ra);a.b("expressionRewriting.parseObjectLiteral",a.m.ac);a.b("expressionRewriting.preProcessBindings",a.m.vb);a.b("expressionRewriting._twoWayBindings",
	a.m.wa);a.b("jsonExpressionRewriting",a.m);a.b("jsonExpressionRewriting.insertPropertyAccessorsIntoJson",a.m.vb);(function(){function b(a){return 8==a.nodeType&&g.test(f?a.text:a.nodeValue)}function c(a){return 8==a.nodeType&&h.test(f?a.text:a.nodeValue)}function d(d,e){for(var f=d,h=1,g=[];f=f.nextSibling;){if(c(f)&&(a.a.g.set(f,k,!0),h--,0===h))return g;g.push(f);b(f)&&h++;}if(!e)throw Error("Cannot find closing comment tag to match: "+d.nodeValue);return null}function e(a,b){var c=d(a,b);return c?
	0<c.length?c[c.length-1].nextSibling:a.nextSibling:null}var f=w&&"\x3c!--test--\x3e"===w.createComment("test").text,g=f?/^\x3c!--\s*ko(?:\s+([\s\S]+))?\s*--\x3e$/:/^\s*ko(?:\s+([\s\S]+))?\s*$/,h=f?/^\x3c!--\s*\/ko\s*--\x3e$/:/^\s*\/ko\s*$/,m={ul:!0,ol:!0},k="__ko_matchedEndComment__";a.h={ea:{},childNodes:function(a){return b(a)?d(a):a.childNodes},Ea:function(c){if(b(c)){c=a.h.childNodes(c);for(var d=0,e=c.length;d<e;d++)a.removeNode(c[d]);}else a.a.Tb(c);},va:function(c,d){if(b(c)){a.h.Ea(c);for(var e=
	c.nextSibling,f=0,k=d.length;f<k;f++)e.parentNode.insertBefore(d[f],e);}else a.a.va(c,d);},Vc:function(a,c){var d;b(a)?(d=a.nextSibling,a=a.parentNode):d=a.firstChild;d?c!==d&&a.insertBefore(c,d):a.appendChild(c);},Wb:function(c,d,e){e?(e=e.nextSibling,b(c)&&(c=c.parentNode),e?d!==e&&c.insertBefore(d,e):c.appendChild(d)):a.h.Vc(c,d);},firstChild:function(a){if(b(a))return !a.nextSibling||c(a.nextSibling)?null:a.nextSibling;if(a.firstChild&&c(a.firstChild))throw Error("Found invalid end comment, as the first child of "+
	a);return a.firstChild},nextSibling:function(d){b(d)&&(d=e(d));if(d.nextSibling&&c(d.nextSibling)){var f=d.nextSibling;if(c(f)&&!a.a.g.get(f,k))throw Error("Found end comment without a matching opening comment, as child of "+d);return null}return d.nextSibling},Cd:b,Vd:function(a){return (a=(f?a.text:a.nodeValue).match(g))?a[1]:null},Sc:function(d){if(m[a.a.R(d)]){var f=d.firstChild;if(f){do if(1===f.nodeType){var k;k=f.firstChild;var h=null;if(k){do if(h)h.push(k);else if(b(k)){var g=e(k,!0);g?k=
	g:h=[k];}else c(k)&&(h=[k]);while(k=k.nextSibling)}if(k=h)for(h=f.nextSibling,g=0;g<k.length;g++)h?d.insertBefore(k[g],h):d.appendChild(k[g]);}while(f=f.nextSibling)}}}};})();a.b("virtualElements",a.h);a.b("virtualElements.allowedBindings",a.h.ea);a.b("virtualElements.emptyNode",a.h.Ea);a.b("virtualElements.insertAfter",a.h.Wb);a.b("virtualElements.prepend",a.h.Vc);a.b("virtualElements.setDomNodeChildren",a.h.va);(function(){a.ga=function(){this.nd={};};a.a.extend(a.ga.prototype,{nodeHasBindings:function(b){switch(b.nodeType){case 1:return null!=
	b.getAttribute("data-bind")||a.j.getComponentNameForNode(b);case 8:return a.h.Cd(b);default:return !1}},getBindings:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b):null;return a.j.tc(d,b,c,!1)},getBindingAccessors:function(b,c){var d=this.getBindingsString(b,c),d=d?this.parseBindingsString(d,c,b,{valueAccessors:!0}):null;return a.j.tc(d,b,c,!0)},getBindingsString:function(b){switch(b.nodeType){case 1:return b.getAttribute("data-bind");case 8:return a.h.Vd(b);default:return null}},
	parseBindingsString:function(b,c,d,e){try{var f=this.nd,g=b+(e&&e.valueAccessors||""),h;if(!(h=f[g])){var m,k="with($context){with($data||{}){return{"+a.m.vb(b,e)+"}}}";m=new Function("$context","$element",k);h=f[g]=m;}return h(c,d)}catch(l){throw l.message="Unable to parse bindings.\nBindings value: "+b+"\nMessage: "+l.message,l;}}});a.ga.instance=new a.ga;})();a.b("bindingProvider",a.ga);(function(){function b(b){var c=(b=a.a.g.get(b,z))&&b.N;c&&(b.N=null,c.Tc());}function c(c,d,e){this.node=c;this.yc=
	d;this.kb=[];this.H=!1;d.N||a.a.K.za(c,b);e&&e.N&&(e.N.kb.push(c),this.Kb=e);}function d(a){return function(){return a}}function e(a){return a()}function f(b){return a.a.Ga(a.u.G(b),function(a,c){return function(){return b()[c]}})}function g(b,c,e){return "function"===typeof b?f(b.bind(null,c,e)):a.a.Ga(b,d)}function h(a,b){return f(this.getBindings.bind(this,a,b))}function m(b,c){var d=a.h.firstChild(c);if(d){var e,f=a.ga.instance,l=f.preprocessNode;if(l){for(;e=d;)d=a.h.nextSibling(e),l.call(f,e);
	d=a.h.firstChild(c);}for(;e=d;)d=a.h.nextSibling(e),k(b,e);}a.i.ma(c,a.i.H);}function k(b,c){var d=b,e=1===c.nodeType;e&&a.h.Sc(c);if(e||a.ga.instance.nodeHasBindings(c))d=p(c,null,b).bindingContextForDescendants;d&&!u[a.a.R(c)]&&m(d,c);}function l(b){var c=[],d={},e=[];a.a.P(b,function ca(f){if(!d[f]){var k=a.getBindingHandler(f);k&&(k.after&&(e.push(f),a.a.D(k.after,function(c){if(b[c]){if(-1!==a.a.A(e,c))throw Error("Cannot combine the following bindings, because they have a cyclic dependency: "+e.join(", "));
	ca(c);}}),e.length--),c.push({key:f,Mc:k}));d[f]=!0;}});return c}function p(b,c,d){var f=a.a.g.Ub(b,z,{}),k=f.hd;if(!c){if(k)throw Error("You cannot apply bindings multiple times to the same element.");f.hd=!0;}k||(f.context=d);f.Zb||(f.Zb={});var g;if(c&&"function"!==typeof c)g=c;else {var p=a.ga.instance,q=p.getBindingAccessors||h,m=a.$(function(){if(g=c?c(d,b):q.call(p,b,d)){if(d[t])d[t]();if(d[B])d[B]();}return g},null,{l:b});g&&m.ja()||(m=null);}var x=d,u;if(g){var J=function(){return a.a.Ga(m?m():
	g,e)},r=m?function(a){return function(){return e(m()[a])}}:function(a){return g[a]};J.get=function(a){return g[a]&&e(r(a))};J.has=function(a){return a in g};a.i.H in g&&a.i.subscribe(b,a.i.H,function(){var c=(0, g[a.i.H])();if(c){var d=a.h.childNodes(b);d.length&&c(d,a.Ec(d[0]));}});a.i.pa in g&&(x=a.i.Cb(b,d),a.i.subscribe(b,a.i.pa,function(){var c=(0, g[a.i.pa])();c&&a.h.firstChild(b)&&c(b);}));f=l(g);a.a.D(f,function(c){var d=c.Mc.init,e=c.Mc.update,f=c.key;if(8===b.nodeType&&!a.h.ea[f])throw Error("The binding '"+
	f+"' cannot be used with virtual elements");try{"function"==typeof d&&a.u.G(function(){var a=d(b,r(f),J,x.$data,x);if(a&&a.controlsDescendantBindings){if(u!==n)throw Error("Multiple bindings ("+u+" and "+f+") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");u=f;}}),"function"==typeof e&&a.$(function(){e(b,r(f),J,x.$data,x);},null,{l:b});}catch(k){throw k.message='Unable to process binding "'+f+": "+g[f]+'"\nMessage: '+k.message,
	k;}});}f=u===n;return {shouldBindDescendants:f,bindingContextForDescendants:f&&x}}function q(b,c){return b&&b instanceof a.fa?b:new a.fa(b,n,n,c)}var t=a.a.Da("_subscribable"),x=a.a.Da("_ancestorBindingInfo"),B=a.a.Da("_dataDependency");a.c={};var u={script:!0,textarea:!0,template:!0};a.getBindingHandler=function(b){return a.c[b]};var J={};a.fa=function(b,c,d,e,f){function k(){var b=p?h():h,f=a.a.f(b);c?(a.a.extend(l,c),x in c&&(l[x]=c[x])):(l.$parents=[],l.$root=f,l.ko=a);l[t]=q;g?f=l.$data:(l.$rawData=
	b,l.$data=f);d&&(l[d]=f);e&&e(l,c,f);if(c&&c[t]&&!a.S.o().Vb(c[t]))c[t]();m&&(l[B]=m);return l.$data}var l=this,g=b===J,h=g?n:b,p="function"==typeof h&&!a.O(h),q,m=f&&f.dataDependency;f&&f.exportDependencies?k():(q=a.xb(k),q.v(),q.ja()?q.equalityComparer=null:l[t]=n);};a.fa.prototype.createChildContext=function(b,c,d,e){!e&&c&&"object"==typeof c&&(e=c,c=e.as,d=e.extend);if(c&&e&&e.noChildContext){var f="function"==typeof b&&!a.O(b);return new a.fa(J,this,null,function(a){d&&d(a);a[c]=f?b():b;},e)}return new a.fa(b,
	this,c,function(a,b){a.$parentContext=b;a.$parent=b.$data;a.$parents=(b.$parents||[]).slice(0);a.$parents.unshift(a.$parent);d&&d(a);},e)};a.fa.prototype.extend=function(b,c){return new a.fa(J,this,null,function(c){a.a.extend(c,"function"==typeof b?b(c):b);},c)};var z=a.a.g.Z();c.prototype.Tc=function(){this.Kb&&this.Kb.N&&this.Kb.N.sd(this.node);};c.prototype.sd=function(b){a.a.Pa(this.kb,b);!this.kb.length&&this.H&&this.Cc();};c.prototype.Cc=function(){this.H=!0;this.yc.N&&!this.kb.length&&(this.yc.N=
	null,a.a.K.yb(this.node,b),a.i.ma(this.node,a.i.pa),this.Tc());};a.i={H:"childrenComplete",pa:"descendantsComplete",subscribe:function(b,c,d,e,f){var k=a.a.g.Ub(b,z,{});k.Fa||(k.Fa=new a.T);f&&f.notifyImmediately&&k.Zb[c]&&a.u.G(d,e,[b]);return k.Fa.subscribe(d,e,c)},ma:function(b,c){var d=a.a.g.get(b,z);if(d&&(d.Zb[c]=!0,d.Fa&&d.Fa.notifySubscribers(b,c),c==a.i.H))if(d.N)d.N.Cc();else if(d.N===n&&d.Fa&&d.Fa.Wa(a.i.pa))throw Error("descendantsComplete event not supported for bindings on this node");
	},Cb:function(b,d){var e=a.a.g.Ub(b,z,{});e.N||(e.N=new c(b,e,d[x]));return d[x]==e?d:d.extend(function(a){a[x]=e;})}};a.Td=function(b){return (b=a.a.g.get(b,z))&&b.context};a.ib=function(b,c,d){1===b.nodeType&&a.h.Sc(b);return p(b,c,q(d))};a.ld=function(b,c,d){d=q(d);return a.ib(b,g(c,d,b),d)};a.Oa=function(a,b){1!==b.nodeType&&8!==b.nodeType||m(q(a),b);};a.vc=function(a,b,c){!v&&A.jQuery&&(v=A.jQuery);if(2>arguments.length){if(b=w.body,!b)throw Error("ko.applyBindings: could not find document.body; has the document been loaded?");
	}else if(!b||1!==b.nodeType&&8!==b.nodeType)throw Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");k(q(a,c),b);};a.Dc=function(b){return !b||1!==b.nodeType&&8!==b.nodeType?n:a.Td(b)};a.Ec=function(b){return (b=a.Dc(b))?b.$data:n};a.b("bindingHandlers",a.c);a.b("bindingEvent",a.i);a.b("bindingEvent.subscribe",a.i.subscribe);a.b("bindingEvent.startPossiblyAsyncContentBinding",a.i.Cb);a.b("applyBindings",a.vc);a.b("applyBindingsToDescendants",a.Oa);
	a.b("applyBindingAccessorsToNode",a.ib);a.b("applyBindingsToNode",a.ld);a.b("contextFor",a.Dc);a.b("dataFor",a.Ec);})();(function(b){function c(c,e){var k=Object.prototype.hasOwnProperty.call(f,c)?f[c]:b,l;k?k.subscribe(e):(k=f[c]=new a.T,k.subscribe(e),d(c,function(b,d){var e=!(!d||!d.synchronous);g[c]={definition:b,Gd:e};delete f[c];l||e?k.notifySubscribers(b):a.na.zb(function(){k.notifySubscribers(b);});}),l=!0);}function d(a,b){e("getConfig",[a],function(c){c?e("loadComponent",[a,c],function(a){b(a,
	c);}):b(null,null);});}function e(c,d,f,l){l||(l=a.j.loaders.slice(0));var g=l.shift();if(g){var q=g[c];if(q){var t=!1;if(q.apply(g,d.concat(function(a){t?f(null):null!==a?f(a):e(c,d,f,l);}))!==b&&(t=!0,!g.suppressLoaderExceptions))throw Error("Component loaders must supply values by invoking the callback, not by returning values synchronously.");}else e(c,d,f,l);}else f(null);}var f={},g={};a.j={get:function(d,e){var f=Object.prototype.hasOwnProperty.call(g,d)?g[d]:b;f?f.Gd?a.u.G(function(){e(f.definition);}):
	a.na.zb(function(){e(f.definition);}):c(d,e);},Bc:function(a){delete g[a];},oc:e};a.j.loaders=[];a.b("components",a.j);a.b("components.get",a.j.get);a.b("components.clearCachedDefinition",a.j.Bc);})();(function(){function b(b,c,d,e){function g(){0===--B&&e(h);}var h={},B=2,u=d.template;d=d.viewModel;u?f(c,u,function(c){a.j.oc("loadTemplate",[b,c],function(a){h.template=a;g();});}):g();d?f(c,d,function(c){a.j.oc("loadViewModel",[b,c],function(a){h[m]=a;g();});}):g();}function c(a,b,d){if("function"===typeof b)d(function(a){return new b(a)});
	else if("function"===typeof b[m])d(b[m]);else if("instance"in b){var e=b.instance;d(function(){return e});}else "viewModel"in b?c(a,b.viewModel,d):a("Unknown viewModel value: "+b);}function d(b){switch(a.a.R(b)){case "script":return a.a.ua(b.text);case "textarea":return a.a.ua(b.value);case "template":if(e(b.content))return a.a.Ca(b.content.childNodes)}return a.a.Ca(b.childNodes)}function e(a){return A.DocumentFragment?a instanceof DocumentFragment:a&&11===a.nodeType}function f(a,b,c){"string"===typeof b.require?
	T||A.require?(T||A.require)([b.require],function(a){a&&"object"===typeof a&&a.Xd&&a["default"]&&(a=a["default"]);c(a);}):a("Uses require, but no AMD loader is present"):c(b);}function g(a){return function(b){throw Error("Component '"+a+"': "+b);}}var h={};a.j.register=function(b,c){if(!c)throw Error("Invalid configuration for "+b);if(a.j.tb(b))throw Error("Component "+b+" is already registered");h[b]=c;};a.j.tb=function(a){return Object.prototype.hasOwnProperty.call(h,a)};a.j.unregister=function(b){delete h[b];
	a.j.Bc(b);};a.j.Fc={getConfig:function(b,c){c(a.j.tb(b)?h[b]:null);},loadComponent:function(a,c,d){var e=g(a);f(e,c,function(c){b(a,e,c,d);});},loadTemplate:function(b,c,f){b=g(b);if("string"===typeof c)f(a.a.ua(c));else if(c instanceof Array)f(c);else if(e(c))f(a.a.la(c.childNodes));else if(c.element)if(c=c.element,A.HTMLElement?c instanceof HTMLElement:c&&c.tagName&&1===c.nodeType)f(d(c));else if("string"===typeof c){var h=w.getElementById(c);h?f(d(h)):b("Cannot find element with ID "+c);}else b("Unknown element type: "+
	c);else b("Unknown template value: "+c);},loadViewModel:function(a,b,d){c(g(a),b,d);}};var m="createViewModel";a.b("components.register",a.j.register);a.b("components.isRegistered",a.j.tb);a.b("components.unregister",a.j.unregister);a.b("components.defaultLoader",a.j.Fc);a.j.loaders.push(a.j.Fc);a.j.dd=h;})();(function(){function b(b,e){var f=b.getAttribute("params");if(f){var f=c.parseBindingsString(f,e,b,{valueAccessors:!0,bindingParams:!0}),f=a.a.Ga(f,function(c){return a.o(c,null,{l:b})}),g=a.a.Ga(f,
	function(c){var e=c.v();return c.ja()?a.o({read:function(){return a.a.f(c())},write:a.Za(e)&&function(a){c()(a);},l:b}):e});Object.prototype.hasOwnProperty.call(g,"$raw")||(g.$raw=f);return g}return {$raw:{}}}a.j.getComponentNameForNode=function(b){var c=a.a.R(b);if(a.j.tb(c)&&(-1!=c.indexOf("-")||"[object HTMLUnknownElement]"==""+b||8>=a.a.W&&b.tagName===c))return c};a.j.tc=function(c,e,f,g){if(1===e.nodeType){var h=a.j.getComponentNameForNode(e);if(h){c=c||{};if(c.component)throw Error('Cannot use the "component" binding on a custom element matching a component');
	var m={name:h,params:b(e,f)};c.component=g?function(){return m}:m;}}return c};var c=new a.ga;9>a.a.W&&(a.j.register=function(a){return function(b){return a.apply(this,arguments)}}(a.j.register),w.createDocumentFragment=function(b){return function(){var c=b();a.j.dd;return c}}(w.createDocumentFragment));})();(function(){function b(b,c,d){c=c.template;if(!c)throw Error("Component '"+b+"' has no template");b=a.a.Ca(c);a.h.va(d,b);}function c(a,b,c){var d=a.createViewModel;return d?d.call(a,
	b,c):b}var d=0;a.c.component={init:function(e,f,g,h,m){function k(){var a=l&&l.dispose;"function"===typeof a&&a.call(l);q&&q.s();p=l=q=null;}var l,p,q,t=a.a.la(a.h.childNodes(e));a.h.Ea(e);a.a.K.za(e,k);a.o(function(){var g=a.a.f(f()),h,u;"string"===typeof g?h=g:(h=a.a.f(g.name),u=a.a.f(g.params));if(!h)throw Error("No component name specified");var n=a.i.Cb(e,m),z=p=++d;a.j.get(h,function(d){if(p===z){k();if(!d)throw Error("Unknown component '"+h+"'");b(h,d,e);var f=c(d,u,{element:e,templateNodes:t});
	d=n.createChildContext(f,{extend:function(a){a.$component=f;a.$componentTemplateNodes=t;}});f&&f.koDescendantsComplete&&(q=a.i.subscribe(e,a.i.pa,f.koDescendantsComplete,f));l=f;a.Oa(d,e);}});},null,{l:e});return {controlsDescendantBindings:!0}}};a.h.ea.component=!0;})();var V={"class":"className","for":"htmlFor"};a.c.attr={update:function(b,c){var d=a.a.f(c())||{};a.a.P(d,function(c,d){d=a.a.f(d);var g=c.indexOf(":"),g="lookupNamespaceURI"in b&&0<g&&b.lookupNamespaceURI(c.substr(0,g)),h=!1===d||null===
	d||d===n;h?g?b.removeAttributeNS(g,c):b.removeAttribute(c):d=d.toString();8>=a.a.W&&c in V?(c=V[c],h?b.removeAttribute(c):b[c]=d):h||(g?b.setAttributeNS(g,c,d):b.setAttribute(c,d));"name"===c&&a.a.Yc(b,h?"":d);});}};(function(){a.c.checked={after:["value","attr"],init:function(b,c,d){function e(){var e=b.checked,f=g();if(!a.S.Ya()&&(e||!m&&!a.S.qa())){var k=a.u.G(c);if(l){var q=p?k.v():k,z=t;t=f;z!==f?e&&(a.a.Na(q,f,!0),a.a.Na(q,z,!1)):a.a.Na(q,f,e);p&&a.Za(k)&&k(q);}else h&&(f===n?f=e:e||(f=n)),a.m.eb(k,
	d,"checked",f,!0);}}function f(){var d=a.a.f(c()),e=g();l?(b.checked=0<=a.a.A(d,e),t=e):b.checked=h&&e===n?!!d:g()===d;}var g=a.xb(function(){if(d.has("checkedValue"))return a.a.f(d.get("checkedValue"));if(q)return d.has("value")?a.a.f(d.get("value")):b.value}),h="checkbox"==b.type,m="radio"==b.type;if(h||m){var k=c(),l=h&&a.a.f(k)instanceof Array,p=!(l&&k.push&&k.splice),q=m||l,t=l?g():n;m&&!b.name&&a.c.uniqueName.init(b,function(){return !0});a.o(e,null,{l:b});a.a.B(b,"click",e);a.o(f,null,{l:b});
	k=n;}}};a.m.wa.checked=!0;a.c.checkedValue={update:function(b,c){b.value=a.a.f(c());}};})();a.c["class"]={update:function(b,c){var d=a.a.Db(a.a.f(c()));a.a.Eb(b,b.__ko__cssValue,!1);b.__ko__cssValue=d;a.a.Eb(b,d,!0);}};a.c.css={update:function(b,c){var d=a.a.f(c());null!==d&&"object"==typeof d?a.a.P(d,function(c,d){d=a.a.f(d);a.a.Eb(b,c,d);}):a.c["class"].update(b,c);}};a.c.enable={update:function(b,c){var d=a.a.f(c());d&&b.disabled?b.removeAttribute("disabled"):d||b.disabled||(b.disabled=!0);}};a.c.disable=
	{update:function(b,c){a.c.enable.update(b,function(){return !a.a.f(c())});}};a.c.event={init:function(b,c,d,e,f){var g=c()||{};a.a.P(g,function(g){"string"==typeof g&&a.a.B(b,g,function(b){var k,l=c()[g];if(l){try{var p=a.a.la(arguments);e=f.$data;p.unshift(e);k=l.apply(e,p);}finally{!0!==k&&(b.preventDefault?b.preventDefault():b.returnValue=!1);}!1===d.get(g+"Bubble")&&(b.cancelBubble=!0,b.stopPropagation&&b.stopPropagation());}});});}};a.c.foreach={Rc:function(b){return function(){var c=b(),d=a.a.bc(c);
	if(!d||"number"==typeof d.length)return {foreach:c,templateEngine:a.ba.Ma};a.a.f(c);return {foreach:d.data,as:d.as,noChildContext:d.noChildContext,includeDestroyed:d.includeDestroyed,afterAdd:d.afterAdd,beforeRemove:d.beforeRemove,afterRender:d.afterRender,beforeMove:d.beforeMove,afterMove:d.afterMove,templateEngine:a.ba.Ma}}},init:function(b,c){return a.c.template.init(b,a.c.foreach.Rc(c))},update:function(b,c,d,e,f){return a.c.template.update(b,a.c.foreach.Rc(c),d,e,f)}};a.m.Ra.foreach=!1;a.h.ea.foreach=
	!0;a.c.hasfocus={init:function(b,c,d){function e(e){b.__ko_hasfocusUpdating=!0;var f=b.ownerDocument;if("activeElement"in f){var g;try{g=f.activeElement;}catch(l){g=f.body;}e=g===b;}f=c();a.m.eb(f,d,"hasfocus",e,!0);b.__ko_hasfocusLastValue=e;b.__ko_hasfocusUpdating=!1;}var f=e.bind(null,!0),g=e.bind(null,!1);a.a.B(b,"focus",f);a.a.B(b,"focusin",f);a.a.B(b,"blur",g);a.a.B(b,"focusout",g);b.__ko_hasfocusLastValue=!1;},update:function(b,c){var d=!!a.a.f(c());b.__ko_hasfocusUpdating||b.__ko_hasfocusLastValue===
	d||(d?b.focus():b.blur(),!d&&b.__ko_hasfocusLastValue&&b.ownerDocument.body.focus(),a.u.G(a.a.Fb,null,[b,d?"focusin":"focusout"]));}};a.m.wa.hasfocus=!0;a.c.hasFocus=a.c.hasfocus;a.m.wa.hasFocus="hasfocus";a.c.html={init:function(){return {controlsDescendantBindings:!0}},update:function(b,c){a.a.fc(b,c());}};(function(){function b(b,d,e){a.c[b]={init:function(b,c,h,m,k){var l,p,q={},t,x,n;if(d){m=h.get("as");var u=h.get("noChildContext");n=!(m&&u);q={as:m,noChildContext:u,exportDependencies:n};}x=(t=
	"render"==h.get("completeOn"))||h.has(a.i.pa);a.o(function(){var h=a.a.f(c()),m=!e!==!h,u=!p,r;if(n||m!==l){x&&(k=a.i.Cb(b,k));if(m){if(!d||n)q.dataDependency=a.S.o();r=d?k.createChildContext("function"==typeof h?h:c,q):a.S.qa()?k.extend(null,q):k;}u&&a.S.qa()&&(p=a.a.Ca(a.h.childNodes(b),!0));m?(u||a.h.va(b,a.a.Ca(p)),a.Oa(r,b)):(a.h.Ea(b),t||a.i.ma(b,a.i.H));l=m;}},null,{l:b});return {controlsDescendantBindings:!0}}};a.m.Ra[b]=!1;a.h.ea[b]=!0;}b("if");b("ifnot",!1,!0);b("with",!0);})();a.c.let={init:function(b,
	c,d,e,f){c=f.extend(c);a.Oa(c,b);return {controlsDescendantBindings:!0}}};a.h.ea.let=!0;var Q={};a.c.options={init:function(b){if("select"!==a.a.R(b))throw Error("options binding applies only to SELECT elements");for(;0<b.length;)b.remove(0);return {controlsDescendantBindings:!0}},update:function(b,c,d){function e(){return a.a.jb(b.options,function(a){return a.selected})}function f(a,b,c){var d=typeof b;return "function"==d?b(a):"string"==d?a[b]:c}function g(c,d){if(x&&l)a.i.ma(b,a.i.H);else if(t.length){var e=
	0<=a.a.A(t,a.w.M(d[0]));a.a.Zc(d[0],e);x&&!e&&a.u.G(a.a.Fb,null,[b,"change"]);}}var h=b.multiple,m=0!=b.length&&h?b.scrollTop:null,k=a.a.f(c()),l=d.get("valueAllowUnset")&&d.has("value"),p=d.get("optionsIncludeDestroyed");c={};var q,t=[];l||(h?t=a.a.Mb(e(),a.w.M):0<=b.selectedIndex&&t.push(a.w.M(b.options[b.selectedIndex])));k&&("undefined"==typeof k.length&&(k=[k]),q=a.a.jb(k,function(b){return p||b===n||null===b||!a.a.f(b._destroy)}),d.has("optionsCaption")&&(k=a.a.f(d.get("optionsCaption")),null!==
	k&&k!==n&&q.unshift(Q)));var x=!1;c.beforeRemove=function(a){b.removeChild(a);};k=g;d.has("optionsAfterRender")&&"function"==typeof d.get("optionsAfterRender")&&(k=function(b,c){g(0,c);a.u.G(d.get("optionsAfterRender"),null,[c[0],b!==Q?b:n]);});a.a.ec(b,q,function(c,e,g){g.length&&(t=!l&&g[0].selected?[a.w.M(g[0])]:[],x=!0);e=b.ownerDocument.createElement("option");c===Q?(a.a.Bb(e,d.get("optionsCaption")),a.w.cb(e,n)):(g=f(c,d.get("optionsValue"),c),a.w.cb(e,a.a.f(g)),c=f(c,d.get("optionsText"),g),
	a.a.Bb(e,c));return [e]},c,k);if(!l){var B;h?B=t.length&&e().length<t.length:B=t.length&&0<=b.selectedIndex?a.w.M(b.options[b.selectedIndex])!==t[0]:t.length||0<=b.selectedIndex;B&&a.u.G(a.a.Fb,null,[b,"change"]);}(l||a.S.Ya())&&a.i.ma(b,a.i.H);a.a.wd(b);m&&20<Math.abs(m-b.scrollTop)&&(b.scrollTop=m);}};a.c.options.$b=a.a.g.Z();a.c.selectedOptions={init:function(b,c,d){function e(){var e=c(),f=[];a.a.D(b.getElementsByTagName("option"),function(b){b.selected&&f.push(a.w.M(b));});a.m.eb(e,d,"selectedOptions",
	f);}function f(){var d=a.a.f(c()),e=b.scrollTop;d&&"number"==typeof d.length&&a.a.D(b.getElementsByTagName("option"),function(b){var c=0<=a.a.A(d,a.w.M(b));b.selected!=c&&a.a.Zc(b,c);});b.scrollTop=e;}if("select"!=a.a.R(b))throw Error("selectedOptions binding applies only to SELECT elements");var g;a.i.subscribe(b,a.i.H,function(){g?e():(a.a.B(b,"change",e),g=a.o(f,null,{l:b}));},null,{notifyImmediately:!0});},update:function(){}};a.m.wa.selectedOptions=!0;a.c.style={update:function(b,c){var d=a.a.f(c()||
	{});a.a.P(d,function(c,d){d=a.a.f(d);if(null===d||d===n||!1===d)d="";if(v)v(b).css(c,d);else if(/^--/.test(c))b.style.setProperty(c,d);else {c=c.replace(/-(\w)/g,function(a,b){return b.toUpperCase()});var g=b.style[c];b.style[c]=d;d===g||b.style[c]!=g||isNaN(d)||(b.style[c]=d+"px");}});}};a.c.submit={init:function(b,c,d,e,f){if("function"!=typeof c())throw Error("The value for a submit binding must be a function");a.a.B(b,"submit",function(a){var d,e=c();try{d=e.call(f.$data,b);}finally{!0!==d&&(a.preventDefault?
	a.preventDefault():a.returnValue=!1);}});}};a.c.text={init:function(){return {controlsDescendantBindings:!0}},update:function(b,c){a.a.Bb(b,c());}};a.h.ea.text=!0;(function(){if(A&&A.navigator){var b=function(a){if(a)return parseFloat(a[1])},c=A.navigator.userAgent,d,e,f,g,h;(d=A.opera&&A.opera.version&&parseInt(A.opera.version()))||(h=b(c.match(/Edge\/([^ ]+)$/)))||b(c.match(/Chrome\/([^ ]+)/))||(e=b(c.match(/Version\/([^ ]+) Safari/)))||(f=b(c.match(/Firefox\/([^ ]+)/)))||(g=a.a.W||b(c.match(/MSIE ([^ ]+)/)))||
	(g=b(c.match(/rv:([^ )]+)/)));}if(8<=g&&10>g)var m=a.a.g.Z(),k=a.a.g.Z(),l=function(b){var c=this.activeElement;(c=c&&a.a.g.get(c,k))&&c(b);},p=function(b,c){var d=b.ownerDocument;a.a.g.get(d,m)||(a.a.g.set(d,m,!0),a.a.B(d,"selectionchange",l));a.a.g.set(b,k,c);};a.c.textInput={init:function(b,c,k){function l(c,d){a.a.B(b,c,d);}function m(){var d=a.a.f(c());if(null===d||d===n)d="";L!==n&&d===L?a.a.setTimeout(m,4):b.value!==d&&(y=!0,b.value=d,y=!1,v=b.value);}function r(){w||(L=b.value,w=a.a.setTimeout(z,
	4));}function z(){clearTimeout(w);L=w=n;var d=b.value;v!==d&&(v=d,a.m.eb(c(),k,"textInput",d));}var v=b.value,w,L,A=9==a.a.W?r:z,y=!1;g&&l("keypress",z);11>g&&l("propertychange",function(a){y||"value"!==a.propertyName||A();});8==g&&(l("keyup",z),l("keydown",z));p&&(p(b,A),l("dragend",r));(!g||9<=g)&&l("input",A);5>e&&"textarea"===a.a.R(b)?(l("keydown",r),l("paste",r),l("cut",r)):11>d?l("keydown",r):4>f?(l("DOMAutoComplete",z),l("dragdrop",z),l("drop",z)):h&&"number"===b.type&&l("keydown",r);l("change",
	z);l("blur",z);a.o(m,null,{l:b});}};a.m.wa.textInput=!0;a.c.textinput={preprocess:function(a,b,c){c("textInput",a);}};})();a.c.uniqueName={init:function(b,c){if(c()){var d="ko_unique_"+ ++a.c.uniqueName.rd;a.a.Yc(b,d);}}};a.c.uniqueName.rd=0;a.c.using={init:function(b,c,d,e,f){var g;d.has("as")&&(g={as:d.get("as"),noChildContext:d.get("noChildContext")});c=f.createChildContext(c,g);a.Oa(c,b);return {controlsDescendantBindings:!0}}};a.h.ea.using=!0;a.c.value={init:function(b,c,d){var e=a.a.R(b),f="input"==
	e;if(!f||"checkbox"!=b.type&&"radio"!=b.type){var g=[],h=d.get("valueUpdate"),m=!1,k=null;h&&("string"==typeof h?g=[h]:g=a.a.wc(h),a.a.Pa(g,"change"));var l=function(){k=null;m=!1;var e=c(),f=a.w.M(b);a.m.eb(e,d,"value",f);};!a.a.W||!f||"text"!=b.type||"off"==b.autocomplete||b.form&&"off"==b.form.autocomplete||-1!=a.a.A(g,"propertychange")||(a.a.B(b,"propertychange",function(){m=!0;}),a.a.B(b,"focus",function(){m=!1;}),a.a.B(b,"blur",function(){m&&l();}));a.a.D(g,function(c){var d=l;a.a.Ud(c,"after")&&
	(d=function(){k=a.w.M(b);a.a.setTimeout(l,0);},c=c.substring(5));a.a.B(b,c,d);});var p;p=f&&"file"==b.type?function(){var d=a.a.f(c());null===d||d===n||""===d?b.value="":a.u.G(l);}:function(){var f=a.a.f(c()),g=a.w.M(b);if(null!==k&&f===k)a.a.setTimeout(p,0);else if(f!==g||g===n)"select"===e?(g=d.get("valueAllowUnset"),a.w.cb(b,f,g),g||f===a.w.M(b)||a.u.G(l)):a.w.cb(b,f);};if("select"===e){var q;a.i.subscribe(b,a.i.H,function(){q?d.get("valueAllowUnset")?p():l():(a.a.B(b,"change",l),q=a.o(p,null,{l:b}));},
	null,{notifyImmediately:!0});}else a.a.B(b,"change",l),a.o(p,null,{l:b});}else a.ib(b,{checkedValue:c});},update:function(){}};a.m.wa.value=!0;a.c.visible={update:function(b,c){var d=a.a.f(c()),e="none"!=b.style.display;d&&!e?b.style.display="":!d&&e&&(b.style.display="none");}};a.c.hidden={update:function(b,c){a.c.visible.update(b,function(){return !a.a.f(c())});}};(function(b){a.c[b]={init:function(c,d,e,f,g){return a.c.event.init.call(this,c,function(){var a={};a[b]=d();return a},e,f,g)}};})("click");
	a.ca=function(){};a.ca.prototype.renderTemplateSource=function(){throw Error("Override renderTemplateSource");};a.ca.prototype.createJavaScriptEvaluatorBlock=function(){throw Error("Override createJavaScriptEvaluatorBlock");};a.ca.prototype.makeTemplateSource=function(b,c){if("string"==typeof b){c=c||w;var d=c.getElementById(b);if(!d)throw Error("Cannot find template with ID "+b);return new a.C.F(d)}if(1==b.nodeType||8==b.nodeType)return new a.C.ia(b);throw Error("Unknown template type: "+b);};a.ca.prototype.renderTemplate=
	function(a,c,d,e){a=this.makeTemplateSource(a,e);return this.renderTemplateSource(a,c,d,e)};a.ca.prototype.isTemplateRewritten=function(a,c){return !1===this.allowTemplateRewriting?!0:this.makeTemplateSource(a,c).data("isRewritten")};a.ca.prototype.rewriteTemplate=function(a,c,d){a=this.makeTemplateSource(a,d);c=c(a.text());a.text(c);a.data("isRewritten",!0);};a.b("templateEngine",a.ca);a.kc=function(){function b(b,c,d,h){b=a.m.ac(b);for(var m=a.m.Ra,k=0;k<b.length;k++){var l=b[k].key;if(Object.prototype.hasOwnProperty.call(m,
	l)){var p=m[l];if("function"===typeof p){if(l=p(b[k].value))throw Error(l);}else if(!p)throw Error("This template engine does not support the '"+l+"' binding within its templates");}}d="ko.__tr_ambtns(function($context,$element){return(function(){return{ "+a.m.vb(b,{valueAccessors:!0})+" } })()},'"+d.toLowerCase()+"')";return h.createJavaScriptEvaluatorBlock(d)+c}var c=/(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'|[^>]*))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi,
	d=/\x3c!--\s*ko\b\s*([\s\S]*?)\s*--\x3e/g;return {xd:function(b,c,d){c.isTemplateRewritten(b,d)||c.rewriteTemplate(b,function(b){return a.kc.Ld(b,c)},d);},Ld:function(a,f){return a.replace(c,function(a,c,d,e,l){return b(l,c,d,f)}).replace(d,function(a,c){return b(c,"\x3c!-- ko --\x3e","#comment",f)})},md:function(b,c){return a.aa.Xb(function(d,h){var m=d.nextSibling;m&&m.nodeName.toLowerCase()===c&&a.ib(m,b,h);})}}}();a.b("__tr_ambtns",a.kc.md);(function(){a.C={};a.C.F=function(b){if(this.F=b){var c=
	a.a.R(b);this.ab="script"===c?1:"textarea"===c?2:"template"==c&&b.content&&11===b.content.nodeType?3:4;}};a.C.F.prototype.text=function(){var b=1===this.ab?"text":2===this.ab?"value":"innerHTML";if(0==arguments.length)return this.F[b];var c=arguments[0];"innerHTML"===b?a.a.fc(this.F,c):this.F[b]=c;};var b=a.a.g.Z()+"_";a.C.F.prototype.data=function(c){if(1===arguments.length)return a.a.g.get(this.F,b+c);a.a.g.set(this.F,b+c,arguments[1]);};var c=a.a.g.Z();a.C.F.prototype.nodes=function(){var b=this.F;
	if(0==arguments.length){var e=a.a.g.get(b,c)||{},f=e.lb||(3===this.ab?b.content:4===this.ab?b:n);if(!f||e.jd){var g=this.text();g&&g!==e.bb&&(f=a.a.Md(g,b.ownerDocument),a.a.g.set(b,c,{lb:f,bb:g,jd:!0}));}return f}e=arguments[0];this.ab!==n&&this.text("");a.a.g.set(b,c,{lb:e});};a.C.ia=function(a){this.F=a;};a.C.ia.prototype=new a.C.F;a.C.ia.prototype.constructor=a.C.ia;a.C.ia.prototype.text=function(){if(0==arguments.length){var b=a.a.g.get(this.F,c)||{};b.bb===n&&b.lb&&(b.bb=b.lb.innerHTML);return b.bb}a.a.g.set(this.F,
	c,{bb:arguments[0]});};a.b("templateSources",a.C);a.b("templateSources.domElement",a.C.F);a.b("templateSources.anonymousTemplate",a.C.ia);})();(function(){function b(b,c,d){var e;for(c=a.h.nextSibling(c);b&&(e=b)!==c;)b=a.h.nextSibling(e),d(e,b);}function c(c,d){if(c.length){var e=c[0],f=c[c.length-1],g=e.parentNode,h=a.ga.instance,m=h.preprocessNode;if(m){b(e,f,function(a,b){var c=a.previousSibling,d=m.call(h,a);d&&(a===e&&(e=d[0]||b),a===f&&(f=d[d.length-1]||c));});c.length=0;if(!e)return;e===f?c.push(e):
	(c.push(e,f),a.a.Ua(c,g));}b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.vc(d,b);});b(e,f,function(b){1!==b.nodeType&&8!==b.nodeType||a.aa.cd(b,[d]);});a.a.Ua(c,g);}}function d(a){return a.nodeType?a:0<a.length?a[0]:null}function e(b,e,f,h,m){m=m||{};var n=(b&&d(b)||f||{}).ownerDocument,B=m.templateEngine||g;a.kc.xd(f,B,n);f=B.renderTemplate(f,h,m,n);if("number"!=typeof f.length||0<f.length&&"number"!=typeof f[0].nodeType)throw Error("Template engine must return an array of DOM nodes");n=!1;switch(e){case "replaceChildren":a.h.va(b,
	f);n=!0;break;case "replaceNode":a.a.Xc(b,f);n=!0;break;case "ignoreTargetNode":break;default:throw Error("Unknown renderMode: "+e);}n&&(c(f,h),m.afterRender&&a.u.G(m.afterRender,null,[f,h[m.as||"$data"]]),"replaceChildren"==e&&a.i.ma(b,a.i.H));return f}function f(b,c,d){return a.O(b)?b():"function"===typeof b?b(c,d):b}var g;a.gc=function(b){if(b!=n&&!(b instanceof a.ca))throw Error("templateEngine must inherit from ko.templateEngine");g=b;};a.dc=function(b,c,h,m,t){h=h||{};if((h.templateEngine||g)==
	n)throw Error("Set a template engine before calling renderTemplate");t=t||"replaceChildren";if(m){var x=d(m);return a.$(function(){var g=c&&c instanceof a.fa?c:new a.fa(c,null,null,null,{exportDependencies:!0}),n=f(b,g.$data,g),g=e(m,t,n,g,h);"replaceNode"==t&&(m=g,x=d(m));},null,{Sa:function(){return !x||!a.a.Sb(x)},l:x&&"replaceNode"==t?x.parentNode:x})}return a.aa.Xb(function(d){a.dc(b,c,h,d,"replaceNode");})};a.Qd=function(b,d,g,h,m){function x(b,c){a.u.G(a.a.ec,null,[h,b,u,g,r,c]);a.i.ma(h,a.i.H);}
	function r(a,b){c(b,v);g.afterRender&&g.afterRender(b,a);v=null;}function u(a,c){v=m.createChildContext(a,{as:z,noChildContext:g.noChildContext,extend:function(a){a.$index=c;z&&(a[z+"Index"]=c);}});var d=f(b,a,v);return e(h,"ignoreTargetNode",d,v,g)}var v,z=g.as,w=!1===g.includeDestroyed||a.options.foreachHidesDestroyed&&!g.includeDestroyed;if(w||g.beforeRemove||!a.Pc(d))return a.$(function(){var b=a.a.f(d)||[];"undefined"==typeof b.length&&(b=[b]);w&&(b=a.a.jb(b,function(b){return b===n||null===b||
	!a.a.f(b._destroy)}));x(b);},null,{l:h});x(d.v());var A=d.subscribe(function(a){x(d(),a);},null,"arrayChange");A.l(h);return A};var h=a.a.g.Z(),m=a.a.g.Z();a.c.template={init:function(b,c){var d=a.a.f(c());if("string"==typeof d||"name"in d)a.h.Ea(b);else if("nodes"in d){d=d.nodes||[];if(a.O(d))throw Error('The "nodes" option must be a plain, non-observable array.');var e=d[0]&&d[0].parentNode;e&&a.a.g.get(e,m)||(e=a.a.Yb(d),a.a.g.set(e,m,!0));(new a.C.ia(b)).nodes(e);}else if(d=a.h.childNodes(b),0<d.length)e=
	a.a.Yb(d),(new a.C.ia(b)).nodes(e);else throw Error("Anonymous template defined, but no template content was provided");return {controlsDescendantBindings:!0}},update:function(b,c,d,e,f){var g=c();c=a.a.f(g);d=!0;e=null;"string"==typeof c?c={}:(g="name"in c?c.name:b,"if"in c&&(d=a.a.f(c["if"])),d&&"ifnot"in c&&(d=!a.a.f(c.ifnot)),d&&!g&&(d=!1));"foreach"in c?e=a.Qd(g,d&&c.foreach||[],c,b,f):d?(d=f,"data"in c&&(d=f.createChildContext(c.data,{as:c.as,noChildContext:c.noChildContext,exportDependencies:!0})),
	e=a.dc(g,d,c,b)):a.h.Ea(b);f=e;(c=a.a.g.get(b,h))&&"function"==typeof c.s&&c.s();a.a.g.set(b,h,!f||f.ja&&!f.ja()?n:f);}};a.m.Ra.template=function(b){b=a.m.ac(b);return 1==b.length&&b[0].unknown||a.m.Id(b,"name")?null:"This template engine does not support anonymous templates nested within its templates"};a.h.ea.template=!0;})();a.b("setTemplateEngine",a.gc);a.b("renderTemplate",a.dc);a.a.Kc=function(a,c,d){if(a.length&&c.length){var e,f,g,h,m;for(e=f=0;(!d||e<d)&&(h=a[f]);++f){for(g=0;m=c[g];++g)if(h.value===
	m.value){h.moved=m.index;m.moved=h.index;c.splice(g,1);e=g=0;break}e+=g;}}};a.a.Pb=function(){function b(b,d,e,f,g){var h=Math.min,m=Math.max,k=[],l,p=b.length,q,n=d.length,r=n-p||1,v=p+n+1,u,w,z;for(l=0;l<=p;l++)for(w=u,k.push(u=[]),z=h(n,l+r),q=m(0,l-1);q<=z;q++)u[q]=q?l?b[l-1]===d[q-1]?w[q-1]:h(w[q]||v,u[q-1]||v)+1:q+1:l+1;h=[];m=[];r=[];l=p;for(q=n;l||q;)n=k[l][q]-1,q&&n===k[l][q-1]?m.push(h[h.length]={status:e,value:d[--q],index:q}):l&&n===k[l-1][q]?r.push(h[h.length]={status:f,value:b[--l],index:l}):
	(--q,--l,g.sparse||h.push({status:"retained",value:d[q]}));a.a.Kc(r,m,!g.dontLimitMoves&&10*p);return h.reverse()}return function(a,d,e){e="boolean"===typeof e?{dontLimitMoves:e}:e||{};a=a||[];d=d||[];return a.length<d.length?b(a,d,"added","deleted",e):b(d,a,"deleted","added",e)}}();a.b("utils.compareArrays",a.a.Pb);(function(){function b(b,c,d,h,m){var k=[],l=a.$(function(){var l=c(d,m,a.a.Ua(k,b))||[];0<k.length&&(a.a.Xc(k,l),h&&a.u.G(h,null,[d,l,m]));k.length=0;a.a.Nb(k,l);},null,{l:b,Sa:function(){return !a.a.kd(k)}});
	return {Y:k,$:l.ja()?l:n}}var c=a.a.g.Z(),d=a.a.g.Z();a.a.ec=function(e,f,g,h,m,k){function l(b){y={Aa:b,pb:a.ta(w++)};v.push(y);r||F.push(y);}function p(b){y=t[b];w!==y.pb.v()&&D.push(y);y.pb(w++);a.a.Ua(y.Y,e);v.push(y);}function q(b,c){if(b)for(var d=0,e=c.length;d<e;d++)a.a.D(c[d].Y,function(a){b(a,d,c[d].Aa);});}f=f||[];"undefined"==typeof f.length&&(f=[f]);h=h||{};var t=a.a.g.get(e,c),r=!t,v=[],u=0,w=0,z=[],A=[],C=[],D=[],F=[],y,I=0;if(r)a.a.D(f,l);else {if(!k||t&&t._countWaitingForRemove){var E=
	a.a.Mb(t,function(a){return a.Aa});k=a.a.Pb(E,f,{dontLimitMoves:h.dontLimitMoves,sparse:!0});}for(var E=0,G,H,K;G=k[E];E++)switch(H=G.moved,K=G.index,G.status){case "deleted":for(;u<K;)p(u++);H===n&&(y=t[u],y.$&&(y.$.s(),y.$=n),a.a.Ua(y.Y,e).length&&(h.beforeRemove&&(v.push(y),I++,y.Aa===d?y=null:C.push(y)),y&&z.push.apply(z,y.Y)));u++;break;case "added":for(;w<K;)p(u++);H!==n?(A.push(v.length),p(H)):l(G.value);}for(;w<f.length;)p(u++);v._countWaitingForRemove=I;}a.a.g.set(e,c,v);q(h.beforeMove,D);a.a.D(z,
	h.beforeRemove?a.oa:a.removeNode);var M,O,P;try{P=e.ownerDocument.activeElement;}catch(N){}if(A.length)for(;(E=A.shift())!=n;){y=v[E];for(M=n;E;)if((O=v[--E].Y)&&O.length){M=O[O.length-1];break}for(f=0;u=y.Y[f];M=u,f++)a.h.Wb(e,u,M);}for(E=0;y=v[E];E++){y.Y||a.a.extend(y,b(e,g,y.Aa,m,y.pb));for(f=0;u=y.Y[f];M=u,f++)a.h.Wb(e,u,M);!y.Ed&&m&&(m(y.Aa,y.Y,y.pb),y.Ed=!0,M=y.Y[y.Y.length-1]);}P&&e.ownerDocument.activeElement!=P&&P.focus();q(h.beforeRemove,C);for(E=0;E<C.length;++E)C[E].Aa=d;q(h.afterMove,D);
	q(h.afterAdd,F);};})();a.b("utils.setDomNodeChildrenFromArrayMapping",a.a.ec);a.ba=function(){this.allowTemplateRewriting=!1;};a.ba.prototype=new a.ca;a.ba.prototype.constructor=a.ba;a.ba.prototype.renderTemplateSource=function(b,c,d,e){if(c=(9>a.a.W?0:b.nodes)?b.nodes():null)return a.a.la(c.cloneNode(!0).childNodes);b=b.text();return a.a.ua(b,e)};a.ba.Ma=new a.ba;a.gc(a.ba.Ma);a.b("nativeTemplateEngine",a.ba);(function(){a.$a=function(){var a=this.Hd=function(){if(!v||!v.tmpl)return 0;try{if(0<=v.tmpl.tag.tmpl.open.toString().indexOf("__"))return 2}catch(a){}return 1}();
	this.renderTemplateSource=function(b,e,f,g){g=g||w;f=f||{};if(2>a)throw Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");var h=b.data("precompiled");h||(h=b.text()||"",h=v.template(null,"{{ko_with $item.koBindingContext}}"+h+"{{/ko_with}}"),b.data("precompiled",h));b=[e.$data];e=v.extend({koBindingContext:e},f.templateOptions);e=v.tmpl(h,b,e);e.appendTo(g.createElement("div"));v.fragments={};return e};this.createJavaScriptEvaluatorBlock=function(a){return "{{ko_code ((function() { return "+
	a+" })()) }}"};this.addTemplate=function(a,b){w.write("<script type='text/html' id='"+a+"'>"+b+"\x3c/script>");};0<a&&(v.tmpl.tag.ko_code={open:"__.push($1 || '');"},v.tmpl.tag.ko_with={open:"with($1) {",close:"} "});};a.$a.prototype=new a.ca;a.$a.prototype.constructor=a.$a;var b=new a.$a;0<b.Hd&&a.gc(b);a.b("jqueryTmplTemplateEngine",a.$a);})();});})();})();
	}(knockoutLatest, knockoutLatest.exports));

	/*!
	 * surveyjs - Survey JavaScript library v1.8.79
	 * Copyright (c) 2015-2021 Devsoft Baltic OÜ  - http://surveyjs.io/
	 * License: MIT (http://www.opensource.org/licenses/mit-license.php)
	 */

	(function (module, exports) {
	(function webpackUniversalModuleDefinition(root, factory) {
		module.exports = factory(knockoutLatest.exports);
	})(commonjsGlobal, function(__WEBPACK_EXTERNAL_MODULE_knockout__) {
	return /******/ (function(modules) { // webpackBootstrap
	/******/ 	// The module cache
	/******/ 	var installedModules = {};
	/******/
	/******/ 	// The require function
	/******/ 	function __webpack_require__(moduleId) {
	/******/
	/******/ 		// Check if module is in cache
	/******/ 		if(installedModules[moduleId]) {
	/******/ 			return installedModules[moduleId].exports;
	/******/ 		}
	/******/ 		// Create a new module (and put it into the cache)
	/******/ 		var module = installedModules[moduleId] = {
	/******/ 			i: moduleId,
	/******/ 			l: false,
	/******/ 			exports: {}
	/******/ 		};
	/******/
	/******/ 		// Execute the module function
	/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
	/******/
	/******/ 		// Flag the module as loaded
	/******/ 		module.l = true;
	/******/
	/******/ 		// Return the exports of the module
	/******/ 		return module.exports;
	/******/ 	}
	/******/
	/******/
	/******/ 	// expose the modules object (__webpack_modules__)
	/******/ 	__webpack_require__.m = modules;
	/******/
	/******/ 	// expose the module cache
	/******/ 	__webpack_require__.c = installedModules;
	/******/
	/******/ 	// define getter function for harmony exports
	/******/ 	__webpack_require__.d = function(exports, name, getter) {
	/******/ 		if(!__webpack_require__.o(exports, name)) {
	/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
	/******/ 		}
	/******/ 	};
	/******/
	/******/ 	// define __esModule on exports
	/******/ 	__webpack_require__.r = function(exports) {
	/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
	/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
	/******/ 		}
	/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
	/******/ 	};
	/******/
	/******/ 	// create a fake namespace object
	/******/ 	// mode & 1: value is a module id, require it
	/******/ 	// mode & 2: merge all properties of value into the ns
	/******/ 	// mode & 4: return value when already ns object
	/******/ 	// mode & 8|1: behave like require
	/******/ 	__webpack_require__.t = function(value, mode) {
	/******/ 		if(mode & 1) value = __webpack_require__(value);
	/******/ 		if(mode & 8) return value;
	/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
	/******/ 		var ns = Object.create(null);
	/******/ 		__webpack_require__.r(ns);
	/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
	/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
	/******/ 		return ns;
	/******/ 	};
	/******/
	/******/ 	// getDefaultExport function for compatibility with non-harmony modules
	/******/ 	__webpack_require__.n = function(module) {
	/******/ 		var getter = module && module.__esModule ?
	/******/ 			function getDefault() { return module['default']; } :
	/******/ 			function getModuleExports() { return module; };
	/******/ 		__webpack_require__.d(getter, 'a', getter);
	/******/ 		return getter;
	/******/ 	};
	/******/
	/******/ 	// Object.prototype.hasOwnProperty.call
	/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
	/******/
	/******/ 	// __webpack_public_path__
	/******/ 	__webpack_require__.p = "";
	/******/
	/******/
	/******/ 	// Load entry module and return exports
	/******/ 	return __webpack_require__(__webpack_require__.s = "./src/entries/knockout.ts");
	/******/ })
	/************************************************************************/
	/******/ ({

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/components/panel/panel.html":
	/*!*******************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/components/panel/panel.html ***!
	  \*******************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<!-- ko template: { name: 'survey-panel', data: question, as: 'question', afterRender: question.koPanelAfterRender } --><!-- /ko -->";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/components/popup/popup.html":
	/*!*******************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/components/popup/popup.html ***!
	  \*******************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<div class=\"sv-popup\" tabindex=\"-1\"\n  data-bind=\"visible: isVisible, click: clickOutside, class: styleClass, event: { keydown: function(data, event) { onKeyDown(event); return true; } }\">\n  <div class=\"sv-popup__container\"\n    data-bind=\"style: { left: left, top: top, height: height },  click: function() { return true; }, clickBubble: false\">\n    <!-- ko if: showPointer  -->\n    <span data-bind=\"style: {left: pointerTarget.left, top: pointerTarget.top }\" class=\"sv-popup__pointer\"></span>\n    <!-- /ko -->\n    <!-- ko if: !!title  -->\n    <div class=\"sv-popup__header\" data-bind=\"text: title\"></div>\n    <!-- /ko -->\n    <div class=\"sv-popup__scrolling-content\">\n      <div class=\"sv-popup__content\"\n        data-bind=\"component: { name: contentComponentName, params: contentComponentData }\"></div>\n    </div>\n    <!-- ko if: showFooter  -->\n    <div class=\"sv-popup__footer\">\n      <button type=\"button\" class=\"sv-popup__footer-item sv-popup__button sv-popup__button--cancel\"\n        data-bind=\"click: cancel, text: cancelButtonText\"> Cancel </button>\n      <!-- ko if: isModal  -->\n      <button type=\"button\" class=\"sv-popup__footer-item sv-popup__button sv-popup__button--apply\"\n        data-bind=\"click: apply, text: applyButtonText\"> Apply </button>\n      <!-- /ko -->\n    </div>\n    <!-- /ko -->\n  </div>\n</div>";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/components/progress/buttons.html":
	/*!************************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/components/progress/buttons.html ***!
	  \************************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<div data-bind=\"css: survey.css.progressButtonsContainerCenter\">\n    <div data-bind=\"css: survey.css.progressButtonsContainer\">\n        <div data-bind=\"css: getScrollButtonCss(true), click: clickScrollButton.bind($data, $element.nextElementSibling, true)\" role=\"button\"></div>\n        <div data-bind=\"css: survey.css.progressButtonsListContainer\">\n            <ul data-bind=\"foreach: survey.visiblePages, css: survey.css.progressButtonsList\">\n                <li data-bind=\"css: $parent.getListElementCss($index), click: $parent.isListElementClickable($index) ? $parent.clickListElement.bind($parent, $index) : null\">\n                    <div data-bind=\"css: css.progressButtonsPageTitle, text: locNavigationTitle.koRenderedHtml() || name, attr: { title: locNavigationTitle.koRenderedHtml() || name }\"></div>\n                    <div data-bind=\"css: css.progressButtonsPageDescription, text: locNavigationDescription.koRenderedHtml(), attr: { title: locNavigationDescription.koRenderedHtml() }\"></div>\n                </li>\n            </ul>\n        </div>\n        <div data-bind=\"css: getScrollButtonCss(false), click: clickScrollButton.bind($data, $element.previousElementSibling, false)\" role=\"button\"></div>\n    </div>\n</div>";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/components/progress/progress.html":
	/*!*************************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/components/progress/progress.html ***!
	  \*************************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<div data-bind=\"css: model.css.progress\">\n    <div data-bind=\"css: model.css.progressBar, style: { width: model.progressValue + '%' }\"\n        role=\"progressbar\" aria-valuemin=\"0\" aria-valuemax=\"100\">\n        <span data-bind=\"text: model.progressText, css: getProgressTextInBarCss(model.css)\"></span>\n    </div>\n    <span data-bind=\"text: model.progressText, css: getProgressTextUnderBarCss(model.css)\"></span>\n</div>";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/components/tooltip-error/tooltip-error.html":
	/*!***********************************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/components/tooltip-error/tooltip-error.html ***!
	  \***********************************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<!-- ko if: question.hasVisibleErrors -->\n  <!-- ko template: { name: 'survey-question-errors', data: question, afterRender: afterRender } -->\n  <!-- /ko -->\n<!-- /ko -->";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/templates/entry.html":
	/*!************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/templates/entry.html ***!
	  \************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports, __webpack_require__) {

	module.exports = "" + __webpack_require__(/*! ./comment.html */ "./src/knockout/templates/comment.html") + "\n" + __webpack_require__(/*! ./flowpanel.html */ "./src/knockout/templates/flowpanel.html") + "\n" + __webpack_require__(/*! ./header.html */ "./src/knockout/templates/header.html") + "\n" + __webpack_require__(/*! ./index.html */ "./src/knockout/templates/index.html") + "\n" + __webpack_require__(/*! ./page.html */ "./src/knockout/templates/page.html") + "\n" + __webpack_require__(/*! ./panel.html */ "./src/knockout/templates/panel.html") + "\n" + __webpack_require__(/*! ./rows.html */ "./src/knockout/templates/rows.html") + "\n" + __webpack_require__(/*! ./row.html */ "./src/knockout/templates/row.html") + "\n" + __webpack_require__(/*! ./string.html */ "./src/knockout/templates/string.html") + "\n" + __webpack_require__(/*! ./timerpanel.html */ "./src/knockout/templates/timerpanel.html") + "\n" + __webpack_require__(/*! ./question.html */ "./src/knockout/templates/question.html") + "\n" + __webpack_require__(/*! ./questiontitle.html */ "./src/knockout/templates/questiontitle.html") + "\n" + __webpack_require__(/*! ./question-boolean.html */ "./src/knockout/templates/question-boolean.html") + "\n" + __webpack_require__(/*! ./question-checkbox.html */ "./src/knockout/templates/question-checkbox.html") + "\n" + __webpack_require__(/*! ./question-ranking.html */ "./src/knockout/templates/question-ranking.html") + "\n" + __webpack_require__(/*! ./question-comment.html */ "./src/knockout/templates/question-comment.html") + "\n" + __webpack_require__(/*! ./question-composite.html */ "./src/knockout/templates/question-composite.html") + "\n" + __webpack_require__(/*! ./question-custom.html */ "./src/knockout/templates/question-custom.html") + "\n" + __webpack_require__(/*! ./question-dropdown.html */ "./src/knockout/templates/question-dropdown.html") + "\n" + __webpack_require__(/*! ./question-empty.html */ "./src/knockout/templates/question-empty.html") + "\n" + __webpack_require__(/*! ./question-errors.html */ "./src/knockout/templates/question-errors.html") + "\n" + __webpack_require__(/*! ./question-expression.html */ "./src/knockout/templates/question-expression.html") + "\n" + __webpack_require__(/*! ./question-file.html */ "./src/knockout/templates/question-file.html") + "\n" + __webpack_require__(/*! ./question-html.html */ "./src/knockout/templates/question-html.html") + "\n" + __webpack_require__(/*! ./question-image.html */ "./src/knockout/templates/question-image.html") + "\n" + __webpack_require__(/*! ./question-imagepicker.html */ "./src/knockout/templates/question-imagepicker.html") + "\n" + __webpack_require__(/*! ./question-matrix.html */ "./src/knockout/templates/question-matrix.html") + "\n" + __webpack_require__(/*! ./question-matrixdynamic.html */ "./src/knockout/templates/question-matrixdynamic.html") + "\n" + __webpack_require__(/*! ./question-multipletext.html */ "./src/knockout/templates/question-multipletext.html") + "\n" + __webpack_require__(/*! ./question-paneldynamic.html */ "./src/knockout/templates/question-paneldynamic.html") + "\n" + __webpack_require__(/*! ./question-paneldynamic-navigator.html */ "./src/knockout/templates/question-paneldynamic-navigator.html") + "\n" + __webpack_require__(/*! ./question-radiogroup.html */ "./src/knockout/templates/question-radiogroup.html") + "\n" + __webpack_require__(/*! ./question-rating.html */ "./src/knockout/templates/question-rating.html") + "\n" + __webpack_require__(/*! ./question-signaturepad.html */ "./src/knockout/templates/question-signaturepad.html") + "\n" + __webpack_require__(/*! ./question-text.html */ "./src/knockout/templates/question-text.html") + "\n" + __webpack_require__(/*! ./question-buttongroup.html */ "./src/knockout/templates/question-buttongroup.html") + "";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/knockout/templates/window/window.html":
	/*!********************************************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/knockout/templates/window/window.html ***!
	  \********************************************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<div style=\"position: fixed; bottom: 3px; right: 10px; max-width: 60%;\" data-bind=\"css: css.window.root\">\n    <div data-bind=\"css: css.window.header.root\">\n        <span data-bind=\"click:doExpand\" style=\"width: 100%; cursor: pointer;\">\n            <span style=\"padding-right:10px\" data-bind=\"css: css.window.header.title, text: locTitle.koRenderedHtml\"></span>\n            <span aria-hidden=\"true\" data-bind=\"css: koExpandedCss\"></span>\n        </span>\n        <span data-bind=\"visible:koExpanded, click:doExpand\" style=\"float: right; cursor: pointer;\">\n            <span style=\"padding-right:10px\" data-bind=\"css: css.window.header.title\">X</span>\n        </span>\n    </div>\n    <div data-bind=\"visible:koExpanded, css: css.window.body\">\n        <div id=\"windowSurveyJS\"></div>\n    </div>\n</div>";

	/***/ }),

	/***/ "./node_modules/html-loader/index.js?interpolate!./node_modules/val-loader/index.js!./src/svgbundle.html":
	/*!*********************************************************************************************!*\
	  !*** ./node_modules/html-loader?interpolate!./node_modules/val-loader!./src/svgbundle.html ***!
	  \*********************************************************************************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	module.exports = "<svg style=\"display:none;\"><symbol viewBox=\"0 0 10 10\" id=\"icon-arrow_downgrey_10x10\"><style><![CDATA[.st0{fill:#6d7072}]]></style><path class=\"st0\" d=\"M2 2L0 4l5 5 5-5-2-2-3 3z\"></path></symbol><symbol viewBox=\"0 0 34 34\" id=\"icon-arrowdown_34x34\"><style><![CDATA[.st0{fill:#fff}]]></style><path class=\"st0\" d=\"M12 16l2-2 3 3 3-3 2 2-5 5z\"></path></symbol><symbol viewBox=\"0 0 24 24\" id=\"icon-delete\"><path d=\"M22 4h-6V2c0-1.1-.9-2-2-2h-4C8.9 0 8 .9 8 2v2H2v2h2v14c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V6h2V4zM10 2h4v2h-4V2zm8 18H6V6h12v14zM14 8h2v10h-2V8zm-3 0h2v10h-2V8zM8 8h2v10H8V8z\"></path></symbol><symbol viewBox=\"0 0 14 14\" id=\"icon-dots\"><circle cx=\"1.5\" cy=\"6.5\" r=\"1.5\"></circle><circle cx=\"6.5\" cy=\"6.5\" r=\"1.5\"></circle><circle cx=\"11.5\" cy=\"6.5\" r=\"1.5\"></circle></symbol><symbol viewBox=\"0 0 34 34\" id=\"icon-down_34x34\"><style><![CDATA[.st0{fill:#1ab394}.st1{fill:#fff}]]></style><path class=\"st0\" d=\"M33 34H0V0h33c.6 0 1 .4 1 1v32c0 .6-.4 1-1 1z\"></path><path class=\"st1\" d=\"M12 16l2-2 3 3 3-3 2 2-5 5z\"></path></symbol><symbol viewBox=\"0 0 16 16\" id=\"icon-left\"><path d=\"M11 12l-2 2-6-6 6-6 2 2-4 4z\"></path></symbol><symbol viewBox=\"-12 -12 24 24\" id=\"icon-modernradio\"><circle r=\"6\"></circle></symbol><symbol viewBox=\"0 0 16 16\" id=\"icon-right\"><path d=\"M5 4l2-2 6 6-6 6-2-2 4-4z\"></path></symbol></svg>";

	/***/ }),

	/***/ "./node_modules/signature_pad/dist/signature_pad.mjs":
	/*!***********************************************************!*\
	  !*** ./node_modules/signature_pad/dist/signature_pad.mjs ***!
	  \***********************************************************/
	/*! exports provided: default */
	/***/ (function(__webpack_module__, __webpack_exports__, __webpack_require__) {
	__webpack_require__.r(__webpack_exports__);
	/*!
	 * Signature Pad v2.3.2
	 * https://github.com/szimek/signature_pad
	 *
	 * Copyright 2017 Szymon Nowak
	 * Released under the MIT license
	 *
	 * The main idea and some parts of the code (e.g. drawing variable width Bézier curve) are taken from:
	 * http://corner.squareup.com/2012/07/smoother-signatures.html
	 *
	 * Implementation of interpolation using cubic Bézier curves is taken from:
	 * http://benknowscode.wordpress.com/2012/09/14/path-interpolation-using-cubic-bezier-and-control-point-estimation-in-javascript
	 *
	 * Algorithm for approximated length of a Bézier curve is taken from:
	 * http://www.lemoda.net/maths/bezier-length/index.html
	 *
	 */

	function Point(x, y, time) {
	  this.x = x;
	  this.y = y;
	  this.time = time || new Date().getTime();
	}

	Point.prototype.velocityFrom = function (start) {
	  return this.time !== start.time ? this.distanceTo(start) / (this.time - start.time) : 1;
	};

	Point.prototype.distanceTo = function (start) {
	  return Math.sqrt(Math.pow(this.x - start.x, 2) + Math.pow(this.y - start.y, 2));
	};

	Point.prototype.equals = function (other) {
	  return this.x === other.x && this.y === other.y && this.time === other.time;
	};

	function Bezier(startPoint, control1, control2, endPoint) {
	  this.startPoint = startPoint;
	  this.control1 = control1;
	  this.control2 = control2;
	  this.endPoint = endPoint;
	}

	// Returns approximated length.
	Bezier.prototype.length = function () {
	  var steps = 10;
	  var length = 0;
	  var px = void 0;
	  var py = void 0;

	  for (var i = 0; i <= steps; i += 1) {
	    var t = i / steps;
	    var cx = this._point(t, this.startPoint.x, this.control1.x, this.control2.x, this.endPoint.x);
	    var cy = this._point(t, this.startPoint.y, this.control1.y, this.control2.y, this.endPoint.y);
	    if (i > 0) {
	      var xdiff = cx - px;
	      var ydiff = cy - py;
	      length += Math.sqrt(xdiff * xdiff + ydiff * ydiff);
	    }
	    px = cx;
	    py = cy;
	  }

	  return length;
	};

	/* eslint-disable no-multi-spaces, space-in-parens */
	Bezier.prototype._point = function (t, start, c1, c2, end) {
	  return start * (1.0 - t) * (1.0 - t) * (1.0 - t) + 3.0 * c1 * (1.0 - t) * (1.0 - t) * t + 3.0 * c2 * (1.0 - t) * t * t + end * t * t * t;
	};

	/* eslint-disable */

	// http://stackoverflow.com/a/27078401/815507
	function throttle(func, wait, options) {
	  var context, args, result;
	  var timeout = null;
	  var previous = 0;
	  if (!options) options = {};
	  var later = function later() {
	    previous = options.leading === false ? 0 : Date.now();
	    timeout = null;
	    result = func.apply(context, args);
	    if (!timeout) context = args = null;
	  };
	  return function () {
	    var now = Date.now();
	    if (!previous && options.leading === false) previous = now;
	    var remaining = wait - (now - previous);
	    context = this;
	    args = arguments;
	    if (remaining <= 0 || remaining > wait) {
	      if (timeout) {
	        clearTimeout(timeout);
	        timeout = null;
	      }
	      previous = now;
	      result = func.apply(context, args);
	      if (!timeout) context = args = null;
	    } else if (!timeout && options.trailing !== false) {
	      timeout = setTimeout(later, remaining);
	    }
	    return result;
	  };
	}

	function SignaturePad(canvas, options) {
	  var self = this;
	  var opts = options || {};

	  this.velocityFilterWeight = opts.velocityFilterWeight || 0.7;
	  this.minWidth = opts.minWidth || 0.5;
	  this.maxWidth = opts.maxWidth || 2.5;
	  this.throttle = 'throttle' in opts ? opts.throttle : 16; // in miliseconds
	  this.minDistance = 'minDistance' in opts ? opts.minDistance : 5;

	  if (this.throttle) {
	    this._strokeMoveUpdate = throttle(SignaturePad.prototype._strokeUpdate, this.throttle);
	  } else {
	    this._strokeMoveUpdate = SignaturePad.prototype._strokeUpdate;
	  }

	  this.dotSize = opts.dotSize || function () {
	    return (this.minWidth + this.maxWidth) / 2;
	  };
	  this.penColor = opts.penColor || 'black';
	  this.backgroundColor = opts.backgroundColor || 'rgba(0,0,0,0)';
	  this.onBegin = opts.onBegin;
	  this.onEnd = opts.onEnd;

	  this._canvas = canvas;
	  this._ctx = canvas.getContext('2d');
	  this.clear();

	  // We need add these inline so they are available to unbind while still having
	  // access to 'self' we could use _.bind but it's not worth adding a dependency.
	  this._handleMouseDown = function (event) {
	    if (event.which === 1) {
	      self._mouseButtonDown = true;
	      self._strokeBegin(event);
	    }
	  };

	  this._handleMouseMove = function (event) {
	    if (self._mouseButtonDown) {
	      self._strokeMoveUpdate(event);
	    }
	  };

	  this._handleMouseUp = function (event) {
	    if (event.which === 1 && self._mouseButtonDown) {
	      self._mouseButtonDown = false;
	      self._strokeEnd(event);
	    }
	  };

	  this._handleTouchStart = function (event) {
	    if (event.targetTouches.length === 1) {
	      var touch = event.changedTouches[0];
	      self._strokeBegin(touch);
	    }
	  };

	  this._handleTouchMove = function (event) {
	    // Prevent scrolling.
	    event.preventDefault();

	    var touch = event.targetTouches[0];
	    self._strokeMoveUpdate(touch);
	  };

	  this._handleTouchEnd = function (event) {
	    var wasCanvasTouched = event.target === self._canvas;
	    if (wasCanvasTouched) {
	      event.preventDefault();
	      self._strokeEnd(event);
	    }
	  };

	  // Enable mouse and touch event handlers
	  this.on();
	}

	// Public methods
	SignaturePad.prototype.clear = function () {
	  var ctx = this._ctx;
	  var canvas = this._canvas;

	  ctx.fillStyle = this.backgroundColor;
	  ctx.clearRect(0, 0, canvas.width, canvas.height);
	  ctx.fillRect(0, 0, canvas.width, canvas.height);

	  this._data = [];
	  this._reset();
	  this._isEmpty = true;
	};

	SignaturePad.prototype.fromDataURL = function (dataUrl) {
	  var _this = this;

	  var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var image = new Image();
	  var ratio = options.ratio || window.devicePixelRatio || 1;
	  var width = options.width || this._canvas.width / ratio;
	  var height = options.height || this._canvas.height / ratio;

	  this._reset();
	  image.src = dataUrl;
	  image.onload = function () {
	    _this._ctx.drawImage(image, 0, 0, width, height);
	  };
	  this._isEmpty = false;
	};

	SignaturePad.prototype.toDataURL = function (type) {
	  var _canvas;

	  switch (type) {
	    case 'image/svg+xml':
	      return this._toSVG();
	    default:
	      for (var _len = arguments.length, options = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        options[_key - 1] = arguments[_key];
	      }

	      return (_canvas = this._canvas).toDataURL.apply(_canvas, [type].concat(options));
	  }
	};

	SignaturePad.prototype.on = function () {
	  this._handleMouseEvents();
	  this._handleTouchEvents();
	};

	SignaturePad.prototype.off = function () {
	  this._canvas.removeEventListener('mousedown', this._handleMouseDown);
	  this._canvas.removeEventListener('mousemove', this._handleMouseMove);
	  document.removeEventListener('mouseup', this._handleMouseUp);

	  this._canvas.removeEventListener('touchstart', this._handleTouchStart);
	  this._canvas.removeEventListener('touchmove', this._handleTouchMove);
	  this._canvas.removeEventListener('touchend', this._handleTouchEnd);
	};

	SignaturePad.prototype.isEmpty = function () {
	  return this._isEmpty;
	};

	// Private methods
	SignaturePad.prototype._strokeBegin = function (event) {
	  this._data.push([]);
	  this._reset();
	  this._strokeUpdate(event);

	  if (typeof this.onBegin === 'function') {
	    this.onBegin(event);
	  }
	};

	SignaturePad.prototype._strokeUpdate = function (event) {
	  var x = event.clientX;
	  var y = event.clientY;

	  var point = this._createPoint(x, y);
	  var lastPointGroup = this._data[this._data.length - 1];
	  var lastPoint = lastPointGroup && lastPointGroup[lastPointGroup.length - 1];
	  var isLastPointTooClose = lastPoint && point.distanceTo(lastPoint) < this.minDistance;

	  // Skip this point if it's too close to the previous one
	  if (!(lastPoint && isLastPointTooClose)) {
	    var _addPoint = this._addPoint(point),
	        curve = _addPoint.curve,
	        widths = _addPoint.widths;

	    if (curve && widths) {
	      this._drawCurve(curve, widths.start, widths.end);
	    }

	    this._data[this._data.length - 1].push({
	      x: point.x,
	      y: point.y,
	      time: point.time,
	      color: this.penColor
	    });
	  }
	};

	SignaturePad.prototype._strokeEnd = function (event) {
	  var canDrawCurve = this.points.length > 2;
	  var point = this.points[0]; // Point instance

	  if (!canDrawCurve && point) {
	    this._drawDot(point);
	  }

	  if (point) {
	    var lastPointGroup = this._data[this._data.length - 1];
	    var lastPoint = lastPointGroup[lastPointGroup.length - 1]; // plain object

	    // When drawing a dot, there's only one point in a group, so without this check
	    // such group would end up with exactly the same 2 points.
	    if (!point.equals(lastPoint)) {
	      lastPointGroup.push({
	        x: point.x,
	        y: point.y,
	        time: point.time,
	        color: this.penColor
	      });
	    }
	  }

	  if (typeof this.onEnd === 'function') {
	    this.onEnd(event);
	  }
	};

	SignaturePad.prototype._handleMouseEvents = function () {
	  this._mouseButtonDown = false;

	  this._canvas.addEventListener('mousedown', this._handleMouseDown);
	  this._canvas.addEventListener('mousemove', this._handleMouseMove);
	  document.addEventListener('mouseup', this._handleMouseUp);
	};

	SignaturePad.prototype._handleTouchEvents = function () {
	  // Pass touch events to canvas element on mobile IE11 and Edge.
	  this._canvas.style.msTouchAction = 'none';
	  this._canvas.style.touchAction = 'none';

	  this._canvas.addEventListener('touchstart', this._handleTouchStart);
	  this._canvas.addEventListener('touchmove', this._handleTouchMove);
	  this._canvas.addEventListener('touchend', this._handleTouchEnd);
	};

	SignaturePad.prototype._reset = function () {
	  this.points = [];
	  this._lastVelocity = 0;
	  this._lastWidth = (this.minWidth + this.maxWidth) / 2;
	  this._ctx.fillStyle = this.penColor;
	};

	SignaturePad.prototype._createPoint = function (x, y, time) {
	  var rect = this._canvas.getBoundingClientRect();

	  return new Point(x - rect.left, y - rect.top, time || new Date().getTime());
	};

	SignaturePad.prototype._addPoint = function (point) {
	  var points = this.points;
	  var tmp = void 0;

	  points.push(point);

	  if (points.length > 2) {
	    // To reduce the initial lag make it work with 3 points
	    // by copying the first point to the beginning.
	    if (points.length === 3) points.unshift(points[0]);

	    tmp = this._calculateCurveControlPoints(points[0], points[1], points[2]);
	    var c2 = tmp.c2;
	    tmp = this._calculateCurveControlPoints(points[1], points[2], points[3]);
	    var c3 = tmp.c1;
	    var curve = new Bezier(points[1], c2, c3, points[2]);
	    var widths = this._calculateCurveWidths(curve);

	    // Remove the first element from the list,
	    // so that we always have no more than 4 points in points array.
	    points.shift();

	    return { curve: curve, widths: widths };
	  }

	  return {};
	};

	SignaturePad.prototype._calculateCurveControlPoints = function (s1, s2, s3) {
	  var dx1 = s1.x - s2.x;
	  var dy1 = s1.y - s2.y;
	  var dx2 = s2.x - s3.x;
	  var dy2 = s2.y - s3.y;

	  var m1 = { x: (s1.x + s2.x) / 2.0, y: (s1.y + s2.y) / 2.0 };
	  var m2 = { x: (s2.x + s3.x) / 2.0, y: (s2.y + s3.y) / 2.0 };

	  var l1 = Math.sqrt(dx1 * dx1 + dy1 * dy1);
	  var l2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

	  var dxm = m1.x - m2.x;
	  var dym = m1.y - m2.y;

	  var k = l2 / (l1 + l2);
	  var cm = { x: m2.x + dxm * k, y: m2.y + dym * k };

	  var tx = s2.x - cm.x;
	  var ty = s2.y - cm.y;

	  return {
	    c1: new Point(m1.x + tx, m1.y + ty),
	    c2: new Point(m2.x + tx, m2.y + ty)
	  };
	};

	SignaturePad.prototype._calculateCurveWidths = function (curve) {
	  var startPoint = curve.startPoint;
	  var endPoint = curve.endPoint;
	  var widths = { start: null, end: null };

	  var velocity = this.velocityFilterWeight * endPoint.velocityFrom(startPoint) + (1 - this.velocityFilterWeight) * this._lastVelocity;

	  var newWidth = this._strokeWidth(velocity);

	  widths.start = this._lastWidth;
	  widths.end = newWidth;

	  this._lastVelocity = velocity;
	  this._lastWidth = newWidth;

	  return widths;
	};

	SignaturePad.prototype._strokeWidth = function (velocity) {
	  return Math.max(this.maxWidth / (velocity + 1), this.minWidth);
	};

	SignaturePad.prototype._drawPoint = function (x, y, size) {
	  var ctx = this._ctx;

	  ctx.moveTo(x, y);
	  ctx.arc(x, y, size, 0, 2 * Math.PI, false);
	  this._isEmpty = false;
	};

	SignaturePad.prototype._drawCurve = function (curve, startWidth, endWidth) {
	  var ctx = this._ctx;
	  var widthDelta = endWidth - startWidth;
	  var drawSteps = Math.floor(curve.length());

	  ctx.beginPath();

	  for (var i = 0; i < drawSteps; i += 1) {
	    // Calculate the Bezier (x, y) coordinate for this step.
	    var t = i / drawSteps;
	    var tt = t * t;
	    var ttt = tt * t;
	    var u = 1 - t;
	    var uu = u * u;
	    var uuu = uu * u;

	    var x = uuu * curve.startPoint.x;
	    x += 3 * uu * t * curve.control1.x;
	    x += 3 * u * tt * curve.control2.x;
	    x += ttt * curve.endPoint.x;

	    var y = uuu * curve.startPoint.y;
	    y += 3 * uu * t * curve.control1.y;
	    y += 3 * u * tt * curve.control2.y;
	    y += ttt * curve.endPoint.y;

	    var width = startWidth + ttt * widthDelta;
	    this._drawPoint(x, y, width);
	  }

	  ctx.closePath();
	  ctx.fill();
	};

	SignaturePad.prototype._drawDot = function (point) {
	  var ctx = this._ctx;
	  var width = typeof this.dotSize === 'function' ? this.dotSize() : this.dotSize;

	  ctx.beginPath();
	  this._drawPoint(point.x, point.y, width);
	  ctx.closePath();
	  ctx.fill();
	};

	SignaturePad.prototype._fromData = function (pointGroups, drawCurve, drawDot) {
	  for (var i = 0; i < pointGroups.length; i += 1) {
	    var group = pointGroups[i];

	    if (group.length > 1) {
	      for (var j = 0; j < group.length; j += 1) {
	        var rawPoint = group[j];
	        var point = new Point(rawPoint.x, rawPoint.y, rawPoint.time);
	        var color = rawPoint.color;

	        if (j === 0) {
	          // First point in a group. Nothing to draw yet.

	          // All points in the group have the same color, so it's enough to set
	          // penColor just at the beginning.
	          this.penColor = color;
	          this._reset();

	          this._addPoint(point);
	        } else if (j !== group.length - 1) {
	          // Middle point in a group.
	          var _addPoint2 = this._addPoint(point),
	              curve = _addPoint2.curve,
	              widths = _addPoint2.widths;

	          if (curve && widths) {
	            drawCurve(curve, widths, color);
	          }
	        } else ;
	      }
	    } else {
	      this._reset();
	      var _rawPoint = group[0];
	      drawDot(_rawPoint);
	    }
	  }
	};

	SignaturePad.prototype._toSVG = function () {
	  var _this2 = this;

	  var pointGroups = this._data;
	  var canvas = this._canvas;
	  var ratio = Math.max(window.devicePixelRatio || 1, 1);
	  var minX = 0;
	  var minY = 0;
	  var maxX = canvas.width / ratio;
	  var maxY = canvas.height / ratio;
	  var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

	  svg.setAttributeNS(null, 'width', canvas.width);
	  svg.setAttributeNS(null, 'height', canvas.height);

	  this._fromData(pointGroups, function (curve, widths, color) {
	    var path = document.createElement('path');

	    // Need to check curve for NaN values, these pop up when drawing
	    // lines on the canvas that are not continuous. E.g. Sharp corners
	    // or stopping mid-stroke and than continuing without lifting mouse.
	    if (!isNaN(curve.control1.x) && !isNaN(curve.control1.y) && !isNaN(curve.control2.x) && !isNaN(curve.control2.y)) {
	      var attr = 'M ' + curve.startPoint.x.toFixed(3) + ',' + curve.startPoint.y.toFixed(3) + ' ' + ('C ' + curve.control1.x.toFixed(3) + ',' + curve.control1.y.toFixed(3) + ' ') + (curve.control2.x.toFixed(3) + ',' + curve.control2.y.toFixed(3) + ' ') + (curve.endPoint.x.toFixed(3) + ',' + curve.endPoint.y.toFixed(3));

	      path.setAttribute('d', attr);
	      path.setAttribute('stroke-width', (widths.end * 2.25).toFixed(3));
	      path.setAttribute('stroke', color);
	      path.setAttribute('fill', 'none');
	      path.setAttribute('stroke-linecap', 'round');

	      svg.appendChild(path);
	    }
	  }, function (rawPoint) {
	    var circle = document.createElement('circle');
	    var dotSize = typeof _this2.dotSize === 'function' ? _this2.dotSize() : _this2.dotSize;
	    circle.setAttribute('r', dotSize);
	    circle.setAttribute('cx', rawPoint.x);
	    circle.setAttribute('cy', rawPoint.y);
	    circle.setAttribute('fill', rawPoint.color);

	    svg.appendChild(circle);
	  });

	  var prefix = 'data:image/svg+xml;base64,';
	  var header = '<svg' + ' xmlns="http://www.w3.org/2000/svg"' + ' xmlns:xlink="http://www.w3.org/1999/xlink"' + (' viewBox="' + minX + ' ' + minY + ' ' + maxX + ' ' + maxY + '"') + (' width="' + maxX + '"') + (' height="' + maxY + '"') + '>';
	  var body = svg.innerHTML;

	  // IE hack for missing innerHTML property on SVGElement
	  if (body === undefined) {
	    var dummy = document.createElement('dummy');
	    var nodes = svg.childNodes;
	    dummy.innerHTML = '';

	    for (var i = 0; i < nodes.length; i += 1) {
	      dummy.appendChild(nodes[i].cloneNode(true));
	    }

	    body = dummy.innerHTML;
	  }

	  var footer = '</svg>';
	  var data = header + body + footer;

	  return prefix + btoa(data);
	};

	SignaturePad.prototype.fromData = function (pointGroups) {
	  var _this3 = this;

	  this.clear();

	  this._fromData(pointGroups, function (curve, widths) {
	    return _this3._drawCurve(curve, widths.start, widths.end);
	  }, function (rawPoint) {
	    return _this3._drawDot(rawPoint);
	  });

	  this._data = pointGroups;
	};

	SignaturePad.prototype.toData = function () {
	  return this._data;
	};

	/* harmony default export */ __webpack_exports__["default"] = (SignaturePad);


	/***/ }),

	/***/ "./node_modules/sortablejs/modular/sortable.esm.js":
	/*!*********************************************************!*\
	  !*** ./node_modules/sortablejs/modular/sortable.esm.js ***!
	  \*********************************************************/
	/*! exports provided: default, MultiDrag, Sortable, Swap */
	/***/ (function(module, __webpack_exports__, __webpack_require__) {
	__webpack_require__.r(__webpack_exports__);
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "MultiDrag", function() { return MultiDragPlugin; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Sortable", function() { return Sortable; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Swap", function() { return SwapPlugin; });
	/**!
	 * Sortable 1.13.0
	 * @author	RubaXa   <trash@rubaxa.org>
	 * @author	owenm    <owen23355@gmail.com>
	 * @license MIT
	 */
	function _typeof(obj) {
	  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
	    _typeof = function (obj) {
	      return typeof obj;
	    };
	  } else {
	    _typeof = function (obj) {
	      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
	    };
	  }

	  return _typeof(obj);
	}

	function _defineProperty(obj, key, value) {
	  if (key in obj) {
	    Object.defineProperty(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	}

	function _extends() {
	  _extends = Object.assign || function (target) {
	    for (var i = 1; i < arguments.length; i++) {
	      var source = arguments[i];

	      for (var key in source) {
	        if (Object.prototype.hasOwnProperty.call(source, key)) {
	          target[key] = source[key];
	        }
	      }
	    }

	    return target;
	  };

	  return _extends.apply(this, arguments);
	}

	function _objectSpread(target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i] != null ? arguments[i] : {};
	    var ownKeys = Object.keys(source);

	    if (typeof Object.getOwnPropertySymbols === 'function') {
	      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
	        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
	      }));
	    }

	    ownKeys.forEach(function (key) {
	      _defineProperty(target, key, source[key]);
	    });
	  }

	  return target;
	}

	function _objectWithoutPropertiesLoose(source, excluded) {
	  if (source == null) return {};
	  var target = {};
	  var sourceKeys = Object.keys(source);
	  var key, i;

	  for (i = 0; i < sourceKeys.length; i++) {
	    key = sourceKeys[i];
	    if (excluded.indexOf(key) >= 0) continue;
	    target[key] = source[key];
	  }

	  return target;
	}

	function _objectWithoutProperties(source, excluded) {
	  if (source == null) return {};

	  var target = _objectWithoutPropertiesLoose(source, excluded);

	  var key, i;

	  if (Object.getOwnPropertySymbols) {
	    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);

	    for (i = 0; i < sourceSymbolKeys.length; i++) {
	      key = sourceSymbolKeys[i];
	      if (excluded.indexOf(key) >= 0) continue;
	      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
	      target[key] = source[key];
	    }
	  }

	  return target;
	}

	function _toConsumableArray(arr) {
	  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
	}

	function _arrayWithoutHoles(arr) {
	  if (Array.isArray(arr)) {
	    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

	    return arr2;
	  }
	}

	function _iterableToArray(iter) {
	  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
	}

	function _nonIterableSpread() {
	  throw new TypeError("Invalid attempt to spread non-iterable instance");
	}

	var version = "1.13.0";

	function userAgent(pattern) {
	  if (typeof window !== 'undefined' && window.navigator) {
	    return !!
	    /*@__PURE__*/
	    navigator.userAgent.match(pattern);
	  }
	}

	var IE11OrLess = userAgent(/(?:Trident.*rv[ :]?11\.|msie|iemobile|Windows Phone)/i);
	var Edge = userAgent(/Edge/i);
	var FireFox = userAgent(/firefox/i);
	var Safari = userAgent(/safari/i) && !userAgent(/chrome/i) && !userAgent(/android/i);
	var IOS = userAgent(/iP(ad|od|hone)/i);
	var ChromeForAndroid = userAgent(/chrome/i) && userAgent(/android/i);

	var captureMode = {
	  capture: false,
	  passive: false
	};

	function on(el, event, fn) {
	  el.addEventListener(event, fn, !IE11OrLess && captureMode);
	}

	function off(el, event, fn) {
	  el.removeEventListener(event, fn, !IE11OrLess && captureMode);
	}

	function matches(
	/**HTMLElement*/
	el,
	/**String*/
	selector) {
	  if (!selector) return;
	  selector[0] === '>' && (selector = selector.substring(1));

	  if (el) {
	    try {
	      if (el.matches) {
	        return el.matches(selector);
	      } else if (el.msMatchesSelector) {
	        return el.msMatchesSelector(selector);
	      } else if (el.webkitMatchesSelector) {
	        return el.webkitMatchesSelector(selector);
	      }
	    } catch (_) {
	      return false;
	    }
	  }

	  return false;
	}

	function getParentOrHost(el) {
	  return el.host && el !== document && el.host.nodeType ? el.host : el.parentNode;
	}

	function closest(
	/**HTMLElement*/
	el,
	/**String*/
	selector,
	/**HTMLElement*/
	ctx, includeCTX) {
	  if (el) {
	    ctx = ctx || document;

	    do {
	      if (selector != null && (selector[0] === '>' ? el.parentNode === ctx && matches(el, selector) : matches(el, selector)) || includeCTX && el === ctx) {
	        return el;
	      }

	      if (el === ctx) break;
	      /* jshint boss:true */
	    } while (el = getParentOrHost(el));
	  }

	  return null;
	}

	var R_SPACE = /\s+/g;

	function toggleClass(el, name, state) {
	  if (el && name) {
	    if (el.classList) {
	      el.classList[state ? 'add' : 'remove'](name);
	    } else {
	      var className = (' ' + el.className + ' ').replace(R_SPACE, ' ').replace(' ' + name + ' ', ' ');
	      el.className = (className + (state ? ' ' + name : '')).replace(R_SPACE, ' ');
	    }
	  }
	}

	function css(el, prop, val) {
	  var style = el && el.style;

	  if (style) {
	    if (val === void 0) {
	      if (document.defaultView && document.defaultView.getComputedStyle) {
	        val = document.defaultView.getComputedStyle(el, '');
	      } else if (el.currentStyle) {
	        val = el.currentStyle;
	      }

	      return prop === void 0 ? val : val[prop];
	    } else {
	      if (!(prop in style) && prop.indexOf('webkit') === -1) {
	        prop = '-webkit-' + prop;
	      }

	      style[prop] = val + (typeof val === 'string' ? '' : 'px');
	    }
	  }
	}

	function matrix(el, selfOnly) {
	  var appliedTransforms = '';

	  if (typeof el === 'string') {
	    appliedTransforms = el;
	  } else {
	    do {
	      var transform = css(el, 'transform');

	      if (transform && transform !== 'none') {
	        appliedTransforms = transform + ' ' + appliedTransforms;
	      }
	      /* jshint boss:true */

	    } while (!selfOnly && (el = el.parentNode));
	  }

	  var matrixFn = window.DOMMatrix || window.WebKitCSSMatrix || window.CSSMatrix || window.MSCSSMatrix;
	  /*jshint -W056 */

	  return matrixFn && new matrixFn(appliedTransforms);
	}

	function find(ctx, tagName, iterator) {
	  if (ctx) {
	    var list = ctx.getElementsByTagName(tagName),
	        i = 0,
	        n = list.length;

	    if (iterator) {
	      for (; i < n; i++) {
	        iterator(list[i], i);
	      }
	    }

	    return list;
	  }

	  return [];
	}

	function getWindowScrollingElement() {
	  var scrollingElement = document.scrollingElement;

	  if (scrollingElement) {
	    return scrollingElement;
	  } else {
	    return document.documentElement;
	  }
	}
	/**
	 * Returns the "bounding client rect" of given element
	 * @param  {HTMLElement} el                       The element whose boundingClientRect is wanted
	 * @param  {[Boolean]} relativeToContainingBlock  Whether the rect should be relative to the containing block of (including) the container
	 * @param  {[Boolean]} relativeToNonStaticParent  Whether the rect should be relative to the relative parent of (including) the contaienr
	 * @param  {[Boolean]} undoScale                  Whether the container's scale() should be undone
	 * @param  {[HTMLElement]} container              The parent the element will be placed in
	 * @return {Object}                               The boundingClientRect of el, with specified adjustments
	 */


	function getRect(el, relativeToContainingBlock, relativeToNonStaticParent, undoScale, container) {
	  if (!el.getBoundingClientRect && el !== window) return;
	  var elRect, top, left, bottom, right, height, width;

	  if (el !== window && el.parentNode && el !== getWindowScrollingElement()) {
	    elRect = el.getBoundingClientRect();
	    top = elRect.top;
	    left = elRect.left;
	    bottom = elRect.bottom;
	    right = elRect.right;
	    height = elRect.height;
	    width = elRect.width;
	  } else {
	    top = 0;
	    left = 0;
	    bottom = window.innerHeight;
	    right = window.innerWidth;
	    height = window.innerHeight;
	    width = window.innerWidth;
	  }

	  if ((relativeToContainingBlock || relativeToNonStaticParent) && el !== window) {
	    // Adjust for translate()
	    container = container || el.parentNode; // solves #1123 (see: https://stackoverflow.com/a/37953806/6088312)
	    // Not needed on <= IE11

	    if (!IE11OrLess) {
	      do {
	        if (container && container.getBoundingClientRect && (css(container, 'transform') !== 'none' || relativeToNonStaticParent && css(container, 'position') !== 'static')) {
	          var containerRect = container.getBoundingClientRect(); // Set relative to edges of padding box of container

	          top -= containerRect.top + parseInt(css(container, 'border-top-width'));
	          left -= containerRect.left + parseInt(css(container, 'border-left-width'));
	          bottom = top + elRect.height;
	          right = left + elRect.width;
	          break;
	        }
	        /* jshint boss:true */

	      } while (container = container.parentNode);
	    }
	  }

	  if (undoScale && el !== window) {
	    // Adjust for scale()
	    var elMatrix = matrix(container || el),
	        scaleX = elMatrix && elMatrix.a,
	        scaleY = elMatrix && elMatrix.d;

	    if (elMatrix) {
	      top /= scaleY;
	      left /= scaleX;
	      width /= scaleX;
	      height /= scaleY;
	      bottom = top + height;
	      right = left + width;
	    }
	  }

	  return {
	    top: top,
	    left: left,
	    bottom: bottom,
	    right: right,
	    width: width,
	    height: height
	  };
	}
	/**
	 * Checks if a side of an element is scrolled past a side of its parents
	 * @param  {HTMLElement}  el           The element who's side being scrolled out of view is in question
	 * @param  {String}       elSide       Side of the element in question ('top', 'left', 'right', 'bottom')
	 * @param  {String}       parentSide   Side of the parent in question ('top', 'left', 'right', 'bottom')
	 * @return {HTMLElement}               The parent scroll element that the el's side is scrolled past, or null if there is no such element
	 */


	function isScrolledPast(el, elSide, parentSide) {
	  var parent = getParentAutoScrollElement(el, true),
	      elSideVal = getRect(el)[elSide];
	  /* jshint boss:true */

	  while (parent) {
	    var parentSideVal = getRect(parent)[parentSide],
	        visible = void 0;

	    if (parentSide === 'top' || parentSide === 'left') {
	      visible = elSideVal >= parentSideVal;
	    } else {
	      visible = elSideVal <= parentSideVal;
	    }

	    if (!visible) return parent;
	    if (parent === getWindowScrollingElement()) break;
	    parent = getParentAutoScrollElement(parent, false);
	  }

	  return false;
	}
	/**
	 * Gets nth child of el, ignoring hidden children, sortable's elements (does not ignore clone if it's visible)
	 * and non-draggable elements
	 * @param  {HTMLElement} el       The parent element
	 * @param  {Number} childNum      The index of the child
	 * @param  {Object} options       Parent Sortable's options
	 * @return {HTMLElement}          The child at index childNum, or null if not found
	 */


	function getChild(el, childNum, options) {
	  var currentChild = 0,
	      i = 0,
	      children = el.children;

	  while (i < children.length) {
	    if (children[i].style.display !== 'none' && children[i] !== Sortable.ghost && children[i] !== Sortable.dragged && closest(children[i], options.draggable, el, false)) {
	      if (currentChild === childNum) {
	        return children[i];
	      }

	      currentChild++;
	    }

	    i++;
	  }

	  return null;
	}
	/**
	 * Gets the last child in the el, ignoring ghostEl or invisible elements (clones)
	 * @param  {HTMLElement} el       Parent element
	 * @param  {selector} selector    Any other elements that should be ignored
	 * @return {HTMLElement}          The last child, ignoring ghostEl
	 */


	function lastChild(el, selector) {
	  var last = el.lastElementChild;

	  while (last && (last === Sortable.ghost || css(last, 'display') === 'none' || selector && !matches(last, selector))) {
	    last = last.previousElementSibling;
	  }

	  return last || null;
	}
	/**
	 * Returns the index of an element within its parent for a selected set of
	 * elements
	 * @param  {HTMLElement} el
	 * @param  {selector} selector
	 * @return {number}
	 */


	function index(el, selector) {
	  var index = 0;

	  if (!el || !el.parentNode) {
	    return -1;
	  }
	  /* jshint boss:true */


	  while (el = el.previousElementSibling) {
	    if (el.nodeName.toUpperCase() !== 'TEMPLATE' && el !== Sortable.clone && (!selector || matches(el, selector))) {
	      index++;
	    }
	  }

	  return index;
	}
	/**
	 * Returns the scroll offset of the given element, added with all the scroll offsets of parent elements.
	 * The value is returned in real pixels.
	 * @param  {HTMLElement} el
	 * @return {Array}             Offsets in the format of [left, top]
	 */


	function getRelativeScrollOffset(el) {
	  var offsetLeft = 0,
	      offsetTop = 0,
	      winScroller = getWindowScrollingElement();

	  if (el) {
	    do {
	      var elMatrix = matrix(el),
	          scaleX = elMatrix.a,
	          scaleY = elMatrix.d;
	      offsetLeft += el.scrollLeft * scaleX;
	      offsetTop += el.scrollTop * scaleY;
	    } while (el !== winScroller && (el = el.parentNode));
	  }

	  return [offsetLeft, offsetTop];
	}
	/**
	 * Returns the index of the object within the given array
	 * @param  {Array} arr   Array that may or may not hold the object
	 * @param  {Object} obj  An object that has a key-value pair unique to and identical to a key-value pair in the object you want to find
	 * @return {Number}      The index of the object in the array, or -1
	 */


	function indexOfObject(arr, obj) {
	  for (var i in arr) {
	    if (!arr.hasOwnProperty(i)) continue;

	    for (var key in obj) {
	      if (obj.hasOwnProperty(key) && obj[key] === arr[i][key]) return Number(i);
	    }
	  }

	  return -1;
	}

	function getParentAutoScrollElement(el, includeSelf) {
	  // skip to window
	  if (!el || !el.getBoundingClientRect) return getWindowScrollingElement();
	  var elem = el;
	  var gotSelf = false;

	  do {
	    // we don't need to get elem css if it isn't even overflowing in the first place (performance)
	    if (elem.clientWidth < elem.scrollWidth || elem.clientHeight < elem.scrollHeight) {
	      var elemCSS = css(elem);

	      if (elem.clientWidth < elem.scrollWidth && (elemCSS.overflowX == 'auto' || elemCSS.overflowX == 'scroll') || elem.clientHeight < elem.scrollHeight && (elemCSS.overflowY == 'auto' || elemCSS.overflowY == 'scroll')) {
	        if (!elem.getBoundingClientRect || elem === document.body) return getWindowScrollingElement();
	        if (gotSelf || includeSelf) return elem;
	        gotSelf = true;
	      }
	    }
	    /* jshint boss:true */

	  } while (elem = elem.parentNode);

	  return getWindowScrollingElement();
	}

	function extend(dst, src) {
	  if (dst && src) {
	    for (var key in src) {
	      if (src.hasOwnProperty(key)) {
	        dst[key] = src[key];
	      }
	    }
	  }

	  return dst;
	}

	function isRectEqual(rect1, rect2) {
	  return Math.round(rect1.top) === Math.round(rect2.top) && Math.round(rect1.left) === Math.round(rect2.left) && Math.round(rect1.height) === Math.round(rect2.height) && Math.round(rect1.width) === Math.round(rect2.width);
	}

	var _throttleTimeout;

	function throttle(callback, ms) {
	  return function () {
	    if (!_throttleTimeout) {
	      var args = arguments,
	          _this = this;

	      if (args.length === 1) {
	        callback.call(_this, args[0]);
	      } else {
	        callback.apply(_this, args);
	      }

	      _throttleTimeout = setTimeout(function () {
	        _throttleTimeout = void 0;
	      }, ms);
	    }
	  };
	}

	function cancelThrottle() {
	  clearTimeout(_throttleTimeout);
	  _throttleTimeout = void 0;
	}

	function scrollBy(el, x, y) {
	  el.scrollLeft += x;
	  el.scrollTop += y;
	}

	function clone(el) {
	  var Polymer = window.Polymer;
	  var $ = window.jQuery || window.Zepto;

	  if (Polymer && Polymer.dom) {
	    return Polymer.dom(el).cloneNode(true);
	  } else if ($) {
	    return $(el).clone(true)[0];
	  } else {
	    return el.cloneNode(true);
	  }
	}

	function setRect(el, rect) {
	  css(el, 'position', 'absolute');
	  css(el, 'top', rect.top);
	  css(el, 'left', rect.left);
	  css(el, 'width', rect.width);
	  css(el, 'height', rect.height);
	}

	function unsetRect(el) {
	  css(el, 'position', '');
	  css(el, 'top', '');
	  css(el, 'left', '');
	  css(el, 'width', '');
	  css(el, 'height', '');
	}

	var expando = 'Sortable' + new Date().getTime();

	function AnimationStateManager() {
	  var animationStates = [],
	      animationCallbackId;
	  return {
	    captureAnimationState: function captureAnimationState() {
	      animationStates = [];
	      if (!this.options.animation) return;
	      var children = [].slice.call(this.el.children);
	      children.forEach(function (child) {
	        if (css(child, 'display') === 'none' || child === Sortable.ghost) return;
	        animationStates.push({
	          target: child,
	          rect: getRect(child)
	        });

	        var fromRect = _objectSpread({}, animationStates[animationStates.length - 1].rect); // If animating: compensate for current animation


	        if (child.thisAnimationDuration) {
	          var childMatrix = matrix(child, true);

	          if (childMatrix) {
	            fromRect.top -= childMatrix.f;
	            fromRect.left -= childMatrix.e;
	          }
	        }

	        child.fromRect = fromRect;
	      });
	    },
	    addAnimationState: function addAnimationState(state) {
	      animationStates.push(state);
	    },
	    removeAnimationState: function removeAnimationState(target) {
	      animationStates.splice(indexOfObject(animationStates, {
	        target: target
	      }), 1);
	    },
	    animateAll: function animateAll(callback) {
	      var _this = this;

	      if (!this.options.animation) {
	        clearTimeout(animationCallbackId);
	        if (typeof callback === 'function') callback();
	        return;
	      }

	      var animating = false,
	          animationTime = 0;
	      animationStates.forEach(function (state) {
	        var time = 0,
	            target = state.target,
	            fromRect = target.fromRect,
	            toRect = getRect(target),
	            prevFromRect = target.prevFromRect,
	            prevToRect = target.prevToRect,
	            animatingRect = state.rect,
	            targetMatrix = matrix(target, true);

	        if (targetMatrix) {
	          // Compensate for current animation
	          toRect.top -= targetMatrix.f;
	          toRect.left -= targetMatrix.e;
	        }

	        target.toRect = toRect;

	        if (target.thisAnimationDuration) {
	          // Could also check if animatingRect is between fromRect and toRect
	          if (isRectEqual(prevFromRect, toRect) && !isRectEqual(fromRect, toRect) && // Make sure animatingRect is on line between toRect & fromRect
	          (animatingRect.top - toRect.top) / (animatingRect.left - toRect.left) === (fromRect.top - toRect.top) / (fromRect.left - toRect.left)) {
	            // If returning to same place as started from animation and on same axis
	            time = calculateRealTime(animatingRect, prevFromRect, prevToRect, _this.options);
	          }
	        } // if fromRect != toRect: animate


	        if (!isRectEqual(toRect, fromRect)) {
	          target.prevFromRect = fromRect;
	          target.prevToRect = toRect;

	          if (!time) {
	            time = _this.options.animation;
	          }

	          _this.animate(target, animatingRect, toRect, time);
	        }

	        if (time) {
	          animating = true;
	          animationTime = Math.max(animationTime, time);
	          clearTimeout(target.animationResetTimer);
	          target.animationResetTimer = setTimeout(function () {
	            target.animationTime = 0;
	            target.prevFromRect = null;
	            target.fromRect = null;
	            target.prevToRect = null;
	            target.thisAnimationDuration = null;
	          }, time);
	          target.thisAnimationDuration = time;
	        }
	      });
	      clearTimeout(animationCallbackId);

	      if (!animating) {
	        if (typeof callback === 'function') callback();
	      } else {
	        animationCallbackId = setTimeout(function () {
	          if (typeof callback === 'function') callback();
	        }, animationTime);
	      }

	      animationStates = [];
	    },
	    animate: function animate(target, currentRect, toRect, duration) {
	      if (duration) {
	        css(target, 'transition', '');
	        css(target, 'transform', '');
	        var elMatrix = matrix(this.el),
	            scaleX = elMatrix && elMatrix.a,
	            scaleY = elMatrix && elMatrix.d,
	            translateX = (currentRect.left - toRect.left) / (scaleX || 1),
	            translateY = (currentRect.top - toRect.top) / (scaleY || 1);
	        target.animatingX = !!translateX;
	        target.animatingY = !!translateY;
	        css(target, 'transform', 'translate3d(' + translateX + 'px,' + translateY + 'px,0)');
	        this.forRepaintDummy = repaint(target); // repaint

	        css(target, 'transition', 'transform ' + duration + 'ms' + (this.options.easing ? ' ' + this.options.easing : ''));
	        css(target, 'transform', 'translate3d(0,0,0)');
	        typeof target.animated === 'number' && clearTimeout(target.animated);
	        target.animated = setTimeout(function () {
	          css(target, 'transition', '');
	          css(target, 'transform', '');
	          target.animated = false;
	          target.animatingX = false;
	          target.animatingY = false;
	        }, duration);
	      }
	    }
	  };
	}

	function repaint(target) {
	  return target.offsetWidth;
	}

	function calculateRealTime(animatingRect, fromRect, toRect, options) {
	  return Math.sqrt(Math.pow(fromRect.top - animatingRect.top, 2) + Math.pow(fromRect.left - animatingRect.left, 2)) / Math.sqrt(Math.pow(fromRect.top - toRect.top, 2) + Math.pow(fromRect.left - toRect.left, 2)) * options.animation;
	}

	var plugins = [];
	var defaults = {
	  initializeByDefault: true
	};
	var PluginManager = {
	  mount: function mount(plugin) {
	    // Set default static properties
	    for (var option in defaults) {
	      if (defaults.hasOwnProperty(option) && !(option in plugin)) {
	        plugin[option] = defaults[option];
	      }
	    }

	    plugins.forEach(function (p) {
	      if (p.pluginName === plugin.pluginName) {
	        throw "Sortable: Cannot mount plugin ".concat(plugin.pluginName, " more than once");
	      }
	    });
	    plugins.push(plugin);
	  },
	  pluginEvent: function pluginEvent(eventName, sortable, evt) {
	    var _this = this;

	    this.eventCanceled = false;

	    evt.cancel = function () {
	      _this.eventCanceled = true;
	    };

	    var eventNameGlobal = eventName + 'Global';
	    plugins.forEach(function (plugin) {
	      if (!sortable[plugin.pluginName]) return; // Fire global events if it exists in this sortable

	      if (sortable[plugin.pluginName][eventNameGlobal]) {
	        sortable[plugin.pluginName][eventNameGlobal](_objectSpread({
	          sortable: sortable
	        }, evt));
	      } // Only fire plugin event if plugin is enabled in this sortable,
	      // and plugin has event defined


	      if (sortable.options[plugin.pluginName] && sortable[plugin.pluginName][eventName]) {
	        sortable[plugin.pluginName][eventName](_objectSpread({
	          sortable: sortable
	        }, evt));
	      }
	    });
	  },
	  initializePlugins: function initializePlugins(sortable, el, defaults, options) {
	    plugins.forEach(function (plugin) {
	      var pluginName = plugin.pluginName;
	      if (!sortable.options[pluginName] && !plugin.initializeByDefault) return;
	      var initialized = new plugin(sortable, el, sortable.options);
	      initialized.sortable = sortable;
	      initialized.options = sortable.options;
	      sortable[pluginName] = initialized; // Add default options from plugin

	      _extends(defaults, initialized.defaults);
	    });

	    for (var option in sortable.options) {
	      if (!sortable.options.hasOwnProperty(option)) continue;
	      var modified = this.modifyOption(sortable, option, sortable.options[option]);

	      if (typeof modified !== 'undefined') {
	        sortable.options[option] = modified;
	      }
	    }
	  },
	  getEventProperties: function getEventProperties(name, sortable) {
	    var eventProperties = {};
	    plugins.forEach(function (plugin) {
	      if (typeof plugin.eventProperties !== 'function') return;

	      _extends(eventProperties, plugin.eventProperties.call(sortable[plugin.pluginName], name));
	    });
	    return eventProperties;
	  },
	  modifyOption: function modifyOption(sortable, name, value) {
	    var modifiedValue;
	    plugins.forEach(function (plugin) {
	      // Plugin must exist on the Sortable
	      if (!sortable[plugin.pluginName]) return; // If static option listener exists for this option, call in the context of the Sortable's instance of this plugin

	      if (plugin.optionListeners && typeof plugin.optionListeners[name] === 'function') {
	        modifiedValue = plugin.optionListeners[name].call(sortable[plugin.pluginName], value);
	      }
	    });
	    return modifiedValue;
	  }
	};

	function dispatchEvent(_ref) {
	  var sortable = _ref.sortable,
	      rootEl = _ref.rootEl,
	      name = _ref.name,
	      targetEl = _ref.targetEl,
	      cloneEl = _ref.cloneEl,
	      toEl = _ref.toEl,
	      fromEl = _ref.fromEl,
	      oldIndex = _ref.oldIndex,
	      newIndex = _ref.newIndex,
	      oldDraggableIndex = _ref.oldDraggableIndex,
	      newDraggableIndex = _ref.newDraggableIndex,
	      originalEvent = _ref.originalEvent,
	      putSortable = _ref.putSortable,
	      extraEventProperties = _ref.extraEventProperties;
	  sortable = sortable || rootEl && rootEl[expando];
	  if (!sortable) return;
	  var evt,
	      options = sortable.options,
	      onName = 'on' + name.charAt(0).toUpperCase() + name.substr(1); // Support for new CustomEvent feature

	  if (window.CustomEvent && !IE11OrLess && !Edge) {
	    evt = new CustomEvent(name, {
	      bubbles: true,
	      cancelable: true
	    });
	  } else {
	    evt = document.createEvent('Event');
	    evt.initEvent(name, true, true);
	  }

	  evt.to = toEl || rootEl;
	  evt.from = fromEl || rootEl;
	  evt.item = targetEl || rootEl;
	  evt.clone = cloneEl;
	  evt.oldIndex = oldIndex;
	  evt.newIndex = newIndex;
	  evt.oldDraggableIndex = oldDraggableIndex;
	  evt.newDraggableIndex = newDraggableIndex;
	  evt.originalEvent = originalEvent;
	  evt.pullMode = putSortable ? putSortable.lastPutMode : undefined;

	  var allEventProperties = _objectSpread({}, extraEventProperties, PluginManager.getEventProperties(name, sortable));

	  for (var option in allEventProperties) {
	    evt[option] = allEventProperties[option];
	  }

	  if (rootEl) {
	    rootEl.dispatchEvent(evt);
	  }

	  if (options[onName]) {
	    options[onName].call(sortable, evt);
	  }
	}

	var pluginEvent = function pluginEvent(eventName, sortable) {
	  var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
	      originalEvent = _ref.evt,
	      data = _objectWithoutProperties(_ref, ["evt"]);

	  PluginManager.pluginEvent.bind(Sortable)(eventName, sortable, _objectSpread({
	    dragEl: dragEl,
	    parentEl: parentEl,
	    ghostEl: ghostEl,
	    rootEl: rootEl,
	    nextEl: nextEl,
	    lastDownEl: lastDownEl,
	    cloneEl: cloneEl,
	    cloneHidden: cloneHidden,
	    dragStarted: moved,
	    putSortable: putSortable,
	    activeSortable: Sortable.active,
	    originalEvent: originalEvent,
	    oldIndex: oldIndex,
	    oldDraggableIndex: oldDraggableIndex,
	    newIndex: newIndex,
	    newDraggableIndex: newDraggableIndex,
	    hideGhostForTarget: _hideGhostForTarget,
	    unhideGhostForTarget: _unhideGhostForTarget,
	    cloneNowHidden: function cloneNowHidden() {
	      cloneHidden = true;
	    },
	    cloneNowShown: function cloneNowShown() {
	      cloneHidden = false;
	    },
	    dispatchSortableEvent: function dispatchSortableEvent(name) {
	      _dispatchEvent({
	        sortable: sortable,
	        name: name,
	        originalEvent: originalEvent
	      });
	    }
	  }, data));
	};

	function _dispatchEvent(info) {
	  dispatchEvent(_objectSpread({
	    putSortable: putSortable,
	    cloneEl: cloneEl,
	    targetEl: dragEl,
	    rootEl: rootEl,
	    oldIndex: oldIndex,
	    oldDraggableIndex: oldDraggableIndex,
	    newIndex: newIndex,
	    newDraggableIndex: newDraggableIndex
	  }, info));
	}

	var dragEl,
	    parentEl,
	    ghostEl,
	    rootEl,
	    nextEl,
	    lastDownEl,
	    cloneEl,
	    cloneHidden,
	    oldIndex,
	    newIndex,
	    oldDraggableIndex,
	    newDraggableIndex,
	    activeGroup,
	    putSortable,
	    awaitingDragStarted = false,
	    ignoreNextClick = false,
	    sortables = [],
	    tapEvt,
	    touchEvt,
	    lastDx,
	    lastDy,
	    tapDistanceLeft,
	    tapDistanceTop,
	    moved,
	    lastTarget,
	    lastDirection,
	    pastFirstInvertThresh = false,
	    isCircumstantialInvert = false,
	    targetMoveDistance,
	    // For positioning ghost absolutely
	ghostRelativeParent,
	    ghostRelativeParentInitialScroll = [],
	    // (left, top)
	_silent = false,
	    savedInputChecked = [];
	/** @const */

	var documentExists = typeof document !== 'undefined',
	    PositionGhostAbsolutely = IOS,
	    CSSFloatProperty = Edge || IE11OrLess ? 'cssFloat' : 'float',
	    // This will not pass for IE9, because IE9 DnD only works on anchors
	supportDraggable = documentExists && !ChromeForAndroid && !IOS && 'draggable' in document.createElement('div'),
	    supportCssPointerEvents = function () {
	  if (!documentExists) return; // false when <= IE11

	  if (IE11OrLess) {
	    return false;
	  }

	  var el = document.createElement('x');
	  el.style.cssText = 'pointer-events:auto';
	  return el.style.pointerEvents === 'auto';
	}(),
	    _detectDirection = function _detectDirection(el, options) {
	  var elCSS = css(el),
	      elWidth = parseInt(elCSS.width) - parseInt(elCSS.paddingLeft) - parseInt(elCSS.paddingRight) - parseInt(elCSS.borderLeftWidth) - parseInt(elCSS.borderRightWidth),
	      child1 = getChild(el, 0, options),
	      child2 = getChild(el, 1, options),
	      firstChildCSS = child1 && css(child1),
	      secondChildCSS = child2 && css(child2),
	      firstChildWidth = firstChildCSS && parseInt(firstChildCSS.marginLeft) + parseInt(firstChildCSS.marginRight) + getRect(child1).width,
	      secondChildWidth = secondChildCSS && parseInt(secondChildCSS.marginLeft) + parseInt(secondChildCSS.marginRight) + getRect(child2).width;

	  if (elCSS.display === 'flex') {
	    return elCSS.flexDirection === 'column' || elCSS.flexDirection === 'column-reverse' ? 'vertical' : 'horizontal';
	  }

	  if (elCSS.display === 'grid') {
	    return elCSS.gridTemplateColumns.split(' ').length <= 1 ? 'vertical' : 'horizontal';
	  }

	  if (child1 && firstChildCSS["float"] && firstChildCSS["float"] !== 'none') {
	    var touchingSideChild2 = firstChildCSS["float"] === 'left' ? 'left' : 'right';
	    return child2 && (secondChildCSS.clear === 'both' || secondChildCSS.clear === touchingSideChild2) ? 'vertical' : 'horizontal';
	  }

	  return child1 && (firstChildCSS.display === 'block' || firstChildCSS.display === 'flex' || firstChildCSS.display === 'table' || firstChildCSS.display === 'grid' || firstChildWidth >= elWidth && elCSS[CSSFloatProperty] === 'none' || child2 && elCSS[CSSFloatProperty] === 'none' && firstChildWidth + secondChildWidth > elWidth) ? 'vertical' : 'horizontal';
	},
	    _dragElInRowColumn = function _dragElInRowColumn(dragRect, targetRect, vertical) {
	  var dragElS1Opp = vertical ? dragRect.left : dragRect.top,
	      dragElS2Opp = vertical ? dragRect.right : dragRect.bottom,
	      dragElOppLength = vertical ? dragRect.width : dragRect.height,
	      targetS1Opp = vertical ? targetRect.left : targetRect.top,
	      targetS2Opp = vertical ? targetRect.right : targetRect.bottom,
	      targetOppLength = vertical ? targetRect.width : targetRect.height;
	  return dragElS1Opp === targetS1Opp || dragElS2Opp === targetS2Opp || dragElS1Opp + dragElOppLength / 2 === targetS1Opp + targetOppLength / 2;
	},

	/**
	 * Detects first nearest empty sortable to X and Y position using emptyInsertThreshold.
	 * @param  {Number} x      X position
	 * @param  {Number} y      Y position
	 * @return {HTMLElement}   Element of the first found nearest Sortable
	 */
	_detectNearestEmptySortable = function _detectNearestEmptySortable(x, y) {
	  var ret;
	  sortables.some(function (sortable) {
	    if (lastChild(sortable)) return;
	    var rect = getRect(sortable),
	        threshold = sortable[expando].options.emptyInsertThreshold,
	        insideHorizontally = x >= rect.left - threshold && x <= rect.right + threshold,
	        insideVertically = y >= rect.top - threshold && y <= rect.bottom + threshold;

	    if (threshold && insideHorizontally && insideVertically) {
	      return ret = sortable;
	    }
	  });
	  return ret;
	},
	    _prepareGroup = function _prepareGroup(options) {
	  function toFn(value, pull) {
	    return function (to, from, dragEl, evt) {
	      var sameGroup = to.options.group.name && from.options.group.name && to.options.group.name === from.options.group.name;

	      if (value == null && (pull || sameGroup)) {
	        // Default pull value
	        // Default pull and put value if same group
	        return true;
	      } else if (value == null || value === false) {
	        return false;
	      } else if (pull && value === 'clone') {
	        return value;
	      } else if (typeof value === 'function') {
	        return toFn(value(to, from, dragEl, evt), pull)(to, from, dragEl, evt);
	      } else {
	        var otherGroup = (pull ? to : from).options.group.name;
	        return value === true || typeof value === 'string' && value === otherGroup || value.join && value.indexOf(otherGroup) > -1;
	      }
	    };
	  }

	  var group = {};
	  var originalGroup = options.group;

	  if (!originalGroup || _typeof(originalGroup) != 'object') {
	    originalGroup = {
	      name: originalGroup
	    };
	  }

	  group.name = originalGroup.name;
	  group.checkPull = toFn(originalGroup.pull, true);
	  group.checkPut = toFn(originalGroup.put);
	  group.revertClone = originalGroup.revertClone;
	  options.group = group;
	},
	    _hideGhostForTarget = function _hideGhostForTarget() {
	  if (!supportCssPointerEvents && ghostEl) {
	    css(ghostEl, 'display', 'none');
	  }
	},
	    _unhideGhostForTarget = function _unhideGhostForTarget() {
	  if (!supportCssPointerEvents && ghostEl) {
	    css(ghostEl, 'display', '');
	  }
	}; // #1184 fix - Prevent click event on fallback if dragged but item not changed position


	if (documentExists) {
	  document.addEventListener('click', function (evt) {
	    if (ignoreNextClick) {
	      evt.preventDefault();
	      evt.stopPropagation && evt.stopPropagation();
	      evt.stopImmediatePropagation && evt.stopImmediatePropagation();
	      ignoreNextClick = false;
	      return false;
	    }
	  }, true);
	}

	var nearestEmptyInsertDetectEvent = function nearestEmptyInsertDetectEvent(evt) {
	  if (dragEl) {
	    evt = evt.touches ? evt.touches[0] : evt;

	    var nearest = _detectNearestEmptySortable(evt.clientX, evt.clientY);

	    if (nearest) {
	      // Create imitation event
	      var event = {};

	      for (var i in evt) {
	        if (evt.hasOwnProperty(i)) {
	          event[i] = evt[i];
	        }
	      }

	      event.target = event.rootEl = nearest;
	      event.preventDefault = void 0;
	      event.stopPropagation = void 0;

	      nearest[expando]._onDragOver(event);
	    }
	  }
	};

	var _checkOutsideTargetEl = function _checkOutsideTargetEl(evt) {
	  if (dragEl) {
	    dragEl.parentNode[expando]._isOutsideThisEl(evt.target);
	  }
	};
	/**
	 * @class  Sortable
	 * @param  {HTMLElement}  el
	 * @param  {Object}       [options]
	 */


	function Sortable(el, options) {
	  if (!(el && el.nodeType && el.nodeType === 1)) {
	    throw "Sortable: `el` must be an HTMLElement, not ".concat({}.toString.call(el));
	  }

	  this.el = el; // root element

	  this.options = options = _extends({}, options); // Export instance

	  el[expando] = this;
	  var defaults = {
	    group: null,
	    sort: true,
	    disabled: false,
	    store: null,
	    handle: null,
	    draggable: /^[uo]l$/i.test(el.nodeName) ? '>li' : '>*',
	    swapThreshold: 1,
	    // percentage; 0 <= x <= 1
	    invertSwap: false,
	    // invert always
	    invertedSwapThreshold: null,
	    // will be set to same as swapThreshold if default
	    removeCloneOnHide: true,
	    direction: function direction() {
	      return _detectDirection(el, this.options);
	    },
	    ghostClass: 'sortable-ghost',
	    chosenClass: 'sortable-chosen',
	    dragClass: 'sortable-drag',
	    ignore: 'a, img',
	    filter: null,
	    preventOnFilter: true,
	    animation: 0,
	    easing: null,
	    setData: function setData(dataTransfer, dragEl) {
	      dataTransfer.setData('Text', dragEl.textContent);
	    },
	    dropBubble: false,
	    dragoverBubble: false,
	    dataIdAttr: 'data-id',
	    delay: 0,
	    delayOnTouchOnly: false,
	    touchStartThreshold: (Number.parseInt ? Number : window).parseInt(window.devicePixelRatio, 10) || 1,
	    forceFallback: false,
	    fallbackClass: 'sortable-fallback',
	    fallbackOnBody: false,
	    fallbackTolerance: 0,
	    fallbackOffset: {
	      x: 0,
	      y: 0
	    },
	    supportPointer: Sortable.supportPointer !== false && 'PointerEvent' in window && !Safari,
	    emptyInsertThreshold: 5
	  };
	  PluginManager.initializePlugins(this, el, defaults); // Set default options

	  for (var name in defaults) {
	    !(name in options) && (options[name] = defaults[name]);
	  }

	  _prepareGroup(options); // Bind all private methods


	  for (var fn in this) {
	    if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
	      this[fn] = this[fn].bind(this);
	    }
	  } // Setup drag mode


	  this.nativeDraggable = options.forceFallback ? false : supportDraggable;

	  if (this.nativeDraggable) {
	    // Touch start threshold cannot be greater than the native dragstart threshold
	    this.options.touchStartThreshold = 1;
	  } // Bind events


	  if (options.supportPointer) {
	    on(el, 'pointerdown', this._onTapStart);
	  } else {
	    on(el, 'mousedown', this._onTapStart);
	    on(el, 'touchstart', this._onTapStart);
	  }

	  if (this.nativeDraggable) {
	    on(el, 'dragover', this);
	    on(el, 'dragenter', this);
	  }

	  sortables.push(this.el); // Restore sorting

	  options.store && options.store.get && this.sort(options.store.get(this) || []); // Add animation state manager

	  _extends(this, AnimationStateManager());
	}

	Sortable.prototype =
	/** @lends Sortable.prototype */
	{
	  constructor: Sortable,
	  _isOutsideThisEl: function _isOutsideThisEl(target) {
	    if (!this.el.contains(target) && target !== this.el) {
	      lastTarget = null;
	    }
	  },
	  _getDirection: function _getDirection(evt, target) {
	    return typeof this.options.direction === 'function' ? this.options.direction.call(this, evt, target, dragEl) : this.options.direction;
	  },
	  _onTapStart: function _onTapStart(
	  /** Event|TouchEvent */
	  evt) {
	    if (!evt.cancelable) return;

	    var _this = this,
	        el = this.el,
	        options = this.options,
	        preventOnFilter = options.preventOnFilter,
	        type = evt.type,
	        touch = evt.touches && evt.touches[0] || evt.pointerType && evt.pointerType === 'touch' && evt,
	        target = (touch || evt).target,
	        originalTarget = evt.target.shadowRoot && (evt.path && evt.path[0] || evt.composedPath && evt.composedPath()[0]) || target,
	        filter = options.filter;

	    _saveInputCheckedState(el); // Don't trigger start event when an element is been dragged, otherwise the evt.oldindex always wrong when set option.group.


	    if (dragEl) {
	      return;
	    }

	    if (/mousedown|pointerdown/.test(type) && evt.button !== 0 || options.disabled) {
	      return; // only left button and enabled
	    } // cancel dnd if original target is content editable


	    if (originalTarget.isContentEditable) {
	      return;
	    } // Safari ignores further event handling after mousedown


	    if (!this.nativeDraggable && Safari && target && target.tagName.toUpperCase() === 'SELECT') {
	      return;
	    }

	    target = closest(target, options.draggable, el, false);

	    if (target && target.animated) {
	      return;
	    }

	    if (lastDownEl === target) {
	      // Ignoring duplicate `down`
	      return;
	    } // Get the index of the dragged element within its parent


	    oldIndex = index(target);
	    oldDraggableIndex = index(target, options.draggable); // Check filter

	    if (typeof filter === 'function') {
	      if (filter.call(this, evt, target, this)) {
	        _dispatchEvent({
	          sortable: _this,
	          rootEl: originalTarget,
	          name: 'filter',
	          targetEl: target,
	          toEl: el,
	          fromEl: el
	        });

	        pluginEvent('filter', _this, {
	          evt: evt
	        });
	        preventOnFilter && evt.cancelable && evt.preventDefault();
	        return; // cancel dnd
	      }
	    } else if (filter) {
	      filter = filter.split(',').some(function (criteria) {
	        criteria = closest(originalTarget, criteria.trim(), el, false);

	        if (criteria) {
	          _dispatchEvent({
	            sortable: _this,
	            rootEl: criteria,
	            name: 'filter',
	            targetEl: target,
	            fromEl: el,
	            toEl: el
	          });

	          pluginEvent('filter', _this, {
	            evt: evt
	          });
	          return true;
	        }
	      });

	      if (filter) {
	        preventOnFilter && evt.cancelable && evt.preventDefault();
	        return; // cancel dnd
	      }
	    }

	    if (options.handle && !closest(originalTarget, options.handle, el, false)) {
	      return;
	    } // Prepare `dragstart`


	    this._prepareDragStart(evt, touch, target);
	  },
	  _prepareDragStart: function _prepareDragStart(
	  /** Event */
	  evt,
	  /** Touch */
	  touch,
	  /** HTMLElement */
	  target) {
	    var _this = this,
	        el = _this.el,
	        options = _this.options,
	        ownerDocument = el.ownerDocument,
	        dragStartFn;

	    if (target && !dragEl && target.parentNode === el) {
	      var dragRect = getRect(target);
	      rootEl = el;
	      dragEl = target;
	      parentEl = dragEl.parentNode;
	      nextEl = dragEl.nextSibling;
	      lastDownEl = target;
	      activeGroup = options.group;
	      Sortable.dragged = dragEl;
	      tapEvt = {
	        target: dragEl,
	        clientX: (touch || evt).clientX,
	        clientY: (touch || evt).clientY
	      };
	      tapDistanceLeft = tapEvt.clientX - dragRect.left;
	      tapDistanceTop = tapEvt.clientY - dragRect.top;
	      this._lastX = (touch || evt).clientX;
	      this._lastY = (touch || evt).clientY;
	      dragEl.style['will-change'] = 'all';

	      dragStartFn = function dragStartFn() {
	        pluginEvent('delayEnded', _this, {
	          evt: evt
	        });

	        if (Sortable.eventCanceled) {
	          _this._onDrop();

	          return;
	        } // Delayed drag has been triggered
	        // we can re-enable the events: touchmove/mousemove


	        _this._disableDelayedDragEvents();

	        if (!FireFox && _this.nativeDraggable) {
	          dragEl.draggable = true;
	        } // Bind the events: dragstart/dragend


	        _this._triggerDragStart(evt, touch); // Drag start event


	        _dispatchEvent({
	          sortable: _this,
	          name: 'choose',
	          originalEvent: evt
	        }); // Chosen item


	        toggleClass(dragEl, options.chosenClass, true);
	      }; // Disable "draggable"


	      options.ignore.split(',').forEach(function (criteria) {
	        find(dragEl, criteria.trim(), _disableDraggable);
	      });
	      on(ownerDocument, 'dragover', nearestEmptyInsertDetectEvent);
	      on(ownerDocument, 'mousemove', nearestEmptyInsertDetectEvent);
	      on(ownerDocument, 'touchmove', nearestEmptyInsertDetectEvent);
	      on(ownerDocument, 'mouseup', _this._onDrop);
	      on(ownerDocument, 'touchend', _this._onDrop);
	      on(ownerDocument, 'touchcancel', _this._onDrop); // Make dragEl draggable (must be before delay for FireFox)

	      if (FireFox && this.nativeDraggable) {
	        this.options.touchStartThreshold = 4;
	        dragEl.draggable = true;
	      }

	      pluginEvent('delayStart', this, {
	        evt: evt
	      }); // Delay is impossible for native DnD in Edge or IE

	      if (options.delay && (!options.delayOnTouchOnly || touch) && (!this.nativeDraggable || !(Edge || IE11OrLess))) {
	        if (Sortable.eventCanceled) {
	          this._onDrop();

	          return;
	        } // If the user moves the pointer or let go the click or touch
	        // before the delay has been reached:
	        // disable the delayed drag


	        on(ownerDocument, 'mouseup', _this._disableDelayedDrag);
	        on(ownerDocument, 'touchend', _this._disableDelayedDrag);
	        on(ownerDocument, 'touchcancel', _this._disableDelayedDrag);
	        on(ownerDocument, 'mousemove', _this._delayedDragTouchMoveHandler);
	        on(ownerDocument, 'touchmove', _this._delayedDragTouchMoveHandler);
	        options.supportPointer && on(ownerDocument, 'pointermove', _this._delayedDragTouchMoveHandler);
	        _this._dragStartTimer = setTimeout(dragStartFn, options.delay);
	      } else {
	        dragStartFn();
	      }
	    }
	  },
	  _delayedDragTouchMoveHandler: function _delayedDragTouchMoveHandler(
	  /** TouchEvent|PointerEvent **/
	  e) {
	    var touch = e.touches ? e.touches[0] : e;

	    if (Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) >= Math.floor(this.options.touchStartThreshold / (this.nativeDraggable && window.devicePixelRatio || 1))) {
	      this._disableDelayedDrag();
	    }
	  },
	  _disableDelayedDrag: function _disableDelayedDrag() {
	    dragEl && _disableDraggable(dragEl);
	    clearTimeout(this._dragStartTimer);

	    this._disableDelayedDragEvents();
	  },
	  _disableDelayedDragEvents: function _disableDelayedDragEvents() {
	    var ownerDocument = this.el.ownerDocument;
	    off(ownerDocument, 'mouseup', this._disableDelayedDrag);
	    off(ownerDocument, 'touchend', this._disableDelayedDrag);
	    off(ownerDocument, 'touchcancel', this._disableDelayedDrag);
	    off(ownerDocument, 'mousemove', this._delayedDragTouchMoveHandler);
	    off(ownerDocument, 'touchmove', this._delayedDragTouchMoveHandler);
	    off(ownerDocument, 'pointermove', this._delayedDragTouchMoveHandler);
	  },
	  _triggerDragStart: function _triggerDragStart(
	  /** Event */
	  evt,
	  /** Touch */
	  touch) {
	    touch = touch || evt.pointerType == 'touch' && evt;

	    if (!this.nativeDraggable || touch) {
	      if (this.options.supportPointer) {
	        on(document, 'pointermove', this._onTouchMove);
	      } else if (touch) {
	        on(document, 'touchmove', this._onTouchMove);
	      } else {
	        on(document, 'mousemove', this._onTouchMove);
	      }
	    } else {
	      on(dragEl, 'dragend', this);
	      on(rootEl, 'dragstart', this._onDragStart);
	    }

	    try {
	      if (document.selection) {
	        // Timeout neccessary for IE9
	        _nextTick(function () {
	          document.selection.empty();
	        });
	      } else {
	        window.getSelection().removeAllRanges();
	      }
	    } catch (err) {}
	  },
	  _dragStarted: function _dragStarted(fallback, evt) {

	    awaitingDragStarted = false;

	    if (rootEl && dragEl) {
	      pluginEvent('dragStarted', this, {
	        evt: evt
	      });

	      if (this.nativeDraggable) {
	        on(document, 'dragover', _checkOutsideTargetEl);
	      }

	      var options = this.options; // Apply effect

	      !fallback && toggleClass(dragEl, options.dragClass, false);
	      toggleClass(dragEl, options.ghostClass, true);
	      Sortable.active = this;
	      fallback && this._appendGhost(); // Drag start event

	      _dispatchEvent({
	        sortable: this,
	        name: 'start',
	        originalEvent: evt
	      });
	    } else {
	      this._nulling();
	    }
	  },
	  _emulateDragOver: function _emulateDragOver() {
	    if (touchEvt) {
	      this._lastX = touchEvt.clientX;
	      this._lastY = touchEvt.clientY;

	      _hideGhostForTarget();

	      var target = document.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
	      var parent = target;

	      while (target && target.shadowRoot) {
	        target = target.shadowRoot.elementFromPoint(touchEvt.clientX, touchEvt.clientY);
	        if (target === parent) break;
	        parent = target;
	      }

	      dragEl.parentNode[expando]._isOutsideThisEl(target);

	      if (parent) {
	        do {
	          if (parent[expando]) {
	            var inserted = void 0;
	            inserted = parent[expando]._onDragOver({
	              clientX: touchEvt.clientX,
	              clientY: touchEvt.clientY,
	              target: target,
	              rootEl: parent
	            });

	            if (inserted && !this.options.dragoverBubble) {
	              break;
	            }
	          }

	          target = parent; // store last element
	        }
	        /* jshint boss:true */
	        while (parent = parent.parentNode);
	      }

	      _unhideGhostForTarget();
	    }
	  },
	  _onTouchMove: function _onTouchMove(
	  /**TouchEvent*/
	  evt) {
	    if (tapEvt) {
	      var options = this.options,
	          fallbackTolerance = options.fallbackTolerance,
	          fallbackOffset = options.fallbackOffset,
	          touch = evt.touches ? evt.touches[0] : evt,
	          ghostMatrix = ghostEl && matrix(ghostEl, true),
	          scaleX = ghostEl && ghostMatrix && ghostMatrix.a,
	          scaleY = ghostEl && ghostMatrix && ghostMatrix.d,
	          relativeScrollOffset = PositionGhostAbsolutely && ghostRelativeParent && getRelativeScrollOffset(ghostRelativeParent),
	          dx = (touch.clientX - tapEvt.clientX + fallbackOffset.x) / (scaleX || 1) + (relativeScrollOffset ? relativeScrollOffset[0] - ghostRelativeParentInitialScroll[0] : 0) / (scaleX || 1),
	          dy = (touch.clientY - tapEvt.clientY + fallbackOffset.y) / (scaleY || 1) + (relativeScrollOffset ? relativeScrollOffset[1] - ghostRelativeParentInitialScroll[1] : 0) / (scaleY || 1); // only set the status to dragging, when we are actually dragging

	      if (!Sortable.active && !awaitingDragStarted) {
	        if (fallbackTolerance && Math.max(Math.abs(touch.clientX - this._lastX), Math.abs(touch.clientY - this._lastY)) < fallbackTolerance) {
	          return;
	        }

	        this._onDragStart(evt, true);
	      }

	      if (ghostEl) {
	        if (ghostMatrix) {
	          ghostMatrix.e += dx - (lastDx || 0);
	          ghostMatrix.f += dy - (lastDy || 0);
	        } else {
	          ghostMatrix = {
	            a: 1,
	            b: 0,
	            c: 0,
	            d: 1,
	            e: dx,
	            f: dy
	          };
	        }

	        var cssMatrix = "matrix(".concat(ghostMatrix.a, ",").concat(ghostMatrix.b, ",").concat(ghostMatrix.c, ",").concat(ghostMatrix.d, ",").concat(ghostMatrix.e, ",").concat(ghostMatrix.f, ")");
	        css(ghostEl, 'webkitTransform', cssMatrix);
	        css(ghostEl, 'mozTransform', cssMatrix);
	        css(ghostEl, 'msTransform', cssMatrix);
	        css(ghostEl, 'transform', cssMatrix);
	        lastDx = dx;
	        lastDy = dy;
	        touchEvt = touch;
	      }

	      evt.cancelable && evt.preventDefault();
	    }
	  },
	  _appendGhost: function _appendGhost() {
	    // Bug if using scale(): https://stackoverflow.com/questions/2637058
	    // Not being adjusted for
	    if (!ghostEl) {
	      var container = this.options.fallbackOnBody ? document.body : rootEl,
	          rect = getRect(dragEl, true, PositionGhostAbsolutely, true, container),
	          options = this.options; // Position absolutely

	      if (PositionGhostAbsolutely) {
	        // Get relatively positioned parent
	        ghostRelativeParent = container;

	        while (css(ghostRelativeParent, 'position') === 'static' && css(ghostRelativeParent, 'transform') === 'none' && ghostRelativeParent !== document) {
	          ghostRelativeParent = ghostRelativeParent.parentNode;
	        }

	        if (ghostRelativeParent !== document.body && ghostRelativeParent !== document.documentElement) {
	          if (ghostRelativeParent === document) ghostRelativeParent = getWindowScrollingElement();
	          rect.top += ghostRelativeParent.scrollTop;
	          rect.left += ghostRelativeParent.scrollLeft;
	        } else {
	          ghostRelativeParent = getWindowScrollingElement();
	        }

	        ghostRelativeParentInitialScroll = getRelativeScrollOffset(ghostRelativeParent);
	      }

	      ghostEl = dragEl.cloneNode(true);
	      toggleClass(ghostEl, options.ghostClass, false);
	      toggleClass(ghostEl, options.fallbackClass, true);
	      toggleClass(ghostEl, options.dragClass, true);
	      css(ghostEl, 'transition', '');
	      css(ghostEl, 'transform', '');
	      css(ghostEl, 'box-sizing', 'border-box');
	      css(ghostEl, 'margin', 0);
	      css(ghostEl, 'top', rect.top);
	      css(ghostEl, 'left', rect.left);
	      css(ghostEl, 'width', rect.width);
	      css(ghostEl, 'height', rect.height);
	      css(ghostEl, 'opacity', '0.8');
	      css(ghostEl, 'position', PositionGhostAbsolutely ? 'absolute' : 'fixed');
	      css(ghostEl, 'zIndex', '100000');
	      css(ghostEl, 'pointerEvents', 'none');
	      Sortable.ghost = ghostEl;
	      container.appendChild(ghostEl); // Set transform-origin

	      css(ghostEl, 'transform-origin', tapDistanceLeft / parseInt(ghostEl.style.width) * 100 + '% ' + tapDistanceTop / parseInt(ghostEl.style.height) * 100 + '%');
	    }
	  },
	  _onDragStart: function _onDragStart(
	  /**Event*/
	  evt,
	  /**boolean*/
	  fallback) {
	    var _this = this;

	    var dataTransfer = evt.dataTransfer;
	    var options = _this.options;
	    pluginEvent('dragStart', this, {
	      evt: evt
	    });

	    if (Sortable.eventCanceled) {
	      this._onDrop();

	      return;
	    }

	    pluginEvent('setupClone', this);

	    if (!Sortable.eventCanceled) {
	      cloneEl = clone(dragEl);
	      cloneEl.draggable = false;
	      cloneEl.style['will-change'] = '';

	      this._hideClone();

	      toggleClass(cloneEl, this.options.chosenClass, false);
	      Sortable.clone = cloneEl;
	    } // #1143: IFrame support workaround


	    _this.cloneId = _nextTick(function () {
	      pluginEvent('clone', _this);
	      if (Sortable.eventCanceled) return;

	      if (!_this.options.removeCloneOnHide) {
	        rootEl.insertBefore(cloneEl, dragEl);
	      }

	      _this._hideClone();

	      _dispatchEvent({
	        sortable: _this,
	        name: 'clone'
	      });
	    });
	    !fallback && toggleClass(dragEl, options.dragClass, true); // Set proper drop events

	    if (fallback) {
	      ignoreNextClick = true;
	      _this._loopId = setInterval(_this._emulateDragOver, 50);
	    } else {
	      // Undo what was set in _prepareDragStart before drag started
	      off(document, 'mouseup', _this._onDrop);
	      off(document, 'touchend', _this._onDrop);
	      off(document, 'touchcancel', _this._onDrop);

	      if (dataTransfer) {
	        dataTransfer.effectAllowed = 'move';
	        options.setData && options.setData.call(_this, dataTransfer, dragEl);
	      }

	      on(document, 'drop', _this); // #1276 fix:

	      css(dragEl, 'transform', 'translateZ(0)');
	    }

	    awaitingDragStarted = true;
	    _this._dragStartId = _nextTick(_this._dragStarted.bind(_this, fallback, evt));
	    on(document, 'selectstart', _this);
	    moved = true;

	    if (Safari) {
	      css(document.body, 'user-select', 'none');
	    }
	  },
	  // Returns true - if no further action is needed (either inserted or another condition)
	  _onDragOver: function _onDragOver(
	  /**Event*/
	  evt) {
	    var el = this.el,
	        target = evt.target,
	        dragRect,
	        targetRect,
	        revert,
	        options = this.options,
	        group = options.group,
	        activeSortable = Sortable.active,
	        isOwner = activeGroup === group,
	        canSort = options.sort,
	        fromSortable = putSortable || activeSortable,
	        vertical,
	        _this = this,
	        completedFired = false;

	    if (_silent) return;

	    function dragOverEvent(name, extra) {
	      pluginEvent(name, _this, _objectSpread({
	        evt: evt,
	        isOwner: isOwner,
	        axis: vertical ? 'vertical' : 'horizontal',
	        revert: revert,
	        dragRect: dragRect,
	        targetRect: targetRect,
	        canSort: canSort,
	        fromSortable: fromSortable,
	        target: target,
	        completed: completed,
	        onMove: function onMove(target, after) {
	          return _onMove(rootEl, el, dragEl, dragRect, target, getRect(target), evt, after);
	        },
	        changed: changed
	      }, extra));
	    } // Capture animation state


	    function capture() {
	      dragOverEvent('dragOverAnimationCapture');

	      _this.captureAnimationState();

	      if (_this !== fromSortable) {
	        fromSortable.captureAnimationState();
	      }
	    } // Return invocation when dragEl is inserted (or completed)


	    function completed(insertion) {
	      dragOverEvent('dragOverCompleted', {
	        insertion: insertion
	      });

	      if (insertion) {
	        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
	        if (isOwner) {
	          activeSortable._hideClone();
	        } else {
	          activeSortable._showClone(_this);
	        }

	        if (_this !== fromSortable) {
	          // Set ghost class to new sortable's ghost class
	          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : activeSortable.options.ghostClass, false);
	          toggleClass(dragEl, options.ghostClass, true);
	        }

	        if (putSortable !== _this && _this !== Sortable.active) {
	          putSortable = _this;
	        } else if (_this === Sortable.active && putSortable) {
	          putSortable = null;
	        } // Animation


	        if (fromSortable === _this) {
	          _this._ignoreWhileAnimating = target;
	        }

	        _this.animateAll(function () {
	          dragOverEvent('dragOverAnimationComplete');
	          _this._ignoreWhileAnimating = null;
	        });

	        if (_this !== fromSortable) {
	          fromSortable.animateAll();
	          fromSortable._ignoreWhileAnimating = null;
	        }
	      } // Null lastTarget if it is not inside a previously swapped element


	      if (target === dragEl && !dragEl.animated || target === el && !target.animated) {
	        lastTarget = null;
	      } // no bubbling and not fallback


	      if (!options.dragoverBubble && !evt.rootEl && target !== document) {
	        dragEl.parentNode[expando]._isOutsideThisEl(evt.target); // Do not detect for empty insert if already inserted


	        !insertion && nearestEmptyInsertDetectEvent(evt);
	      }

	      !options.dragoverBubble && evt.stopPropagation && evt.stopPropagation();
	      return completedFired = true;
	    } // Call when dragEl has been inserted


	    function changed() {
	      newIndex = index(dragEl);
	      newDraggableIndex = index(dragEl, options.draggable);

	      _dispatchEvent({
	        sortable: _this,
	        name: 'change',
	        toEl: el,
	        newIndex: newIndex,
	        newDraggableIndex: newDraggableIndex,
	        originalEvent: evt
	      });
	    }

	    if (evt.preventDefault !== void 0) {
	      evt.cancelable && evt.preventDefault();
	    }

	    target = closest(target, options.draggable, el, true);
	    dragOverEvent('dragOver');
	    if (Sortable.eventCanceled) return completedFired;

	    if (dragEl.contains(evt.target) || target.animated && target.animatingX && target.animatingY || _this._ignoreWhileAnimating === target) {
	      return completed(false);
	    }

	    ignoreNextClick = false;

	    if (activeSortable && !options.disabled && (isOwner ? canSort || (revert = !rootEl.contains(dragEl)) // Reverting item into the original list
	    : putSortable === this || (this.lastPutMode = activeGroup.checkPull(this, activeSortable, dragEl, evt)) && group.checkPut(this, activeSortable, dragEl, evt))) {
	      vertical = this._getDirection(evt, target) === 'vertical';
	      dragRect = getRect(dragEl);
	      dragOverEvent('dragOverValid');
	      if (Sortable.eventCanceled) return completedFired;

	      if (revert) {
	        parentEl = rootEl; // actualization

	        capture();

	        this._hideClone();

	        dragOverEvent('revert');

	        if (!Sortable.eventCanceled) {
	          if (nextEl) {
	            rootEl.insertBefore(dragEl, nextEl);
	          } else {
	            rootEl.appendChild(dragEl);
	          }
	        }

	        return completed(true);
	      }

	      var elLastChild = lastChild(el, options.draggable);

	      if (!elLastChild || _ghostIsLast(evt, vertical, this) && !elLastChild.animated) {
	        // If already at end of list: Do not insert
	        if (elLastChild === dragEl) {
	          return completed(false);
	        } // assign target only if condition is true


	        if (elLastChild && el === evt.target) {
	          target = elLastChild;
	        }

	        if (target) {
	          targetRect = getRect(target);
	        }

	        if (_onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, !!target) !== false) {
	          capture();
	          el.appendChild(dragEl);
	          parentEl = el; // actualization

	          changed();
	          return completed(true);
	        }
	      } else if (target.parentNode === el) {
	        targetRect = getRect(target);
	        var direction = 0,
	            targetBeforeFirstSwap,
	            differentLevel = dragEl.parentNode !== el,
	            differentRowCol = !_dragElInRowColumn(dragEl.animated && dragEl.toRect || dragRect, target.animated && target.toRect || targetRect, vertical),
	            side1 = vertical ? 'top' : 'left',
	            scrolledPastTop = isScrolledPast(target, 'top', 'top') || isScrolledPast(dragEl, 'top', 'top'),
	            scrollBefore = scrolledPastTop ? scrolledPastTop.scrollTop : void 0;

	        if (lastTarget !== target) {
	          targetBeforeFirstSwap = targetRect[side1];
	          pastFirstInvertThresh = false;
	          isCircumstantialInvert = !differentRowCol && options.invertSwap || differentLevel;
	        }

	        direction = _getSwapDirection(evt, target, targetRect, vertical, differentRowCol ? 1 : options.swapThreshold, options.invertedSwapThreshold == null ? options.swapThreshold : options.invertedSwapThreshold, isCircumstantialInvert, lastTarget === target);
	        var sibling;

	        if (direction !== 0) {
	          // Check if target is beside dragEl in respective direction (ignoring hidden elements)
	          var dragIndex = index(dragEl);

	          do {
	            dragIndex -= direction;
	            sibling = parentEl.children[dragIndex];
	          } while (sibling && (css(sibling, 'display') === 'none' || sibling === ghostEl));
	        } // If dragEl is already beside target: Do not insert


	        if (direction === 0 || sibling === target) {
	          return completed(false);
	        }

	        lastTarget = target;
	        lastDirection = direction;
	        var nextSibling = target.nextElementSibling,
	            after = false;
	        after = direction === 1;

	        var moveVector = _onMove(rootEl, el, dragEl, dragRect, target, targetRect, evt, after);

	        if (moveVector !== false) {
	          if (moveVector === 1 || moveVector === -1) {
	            after = moveVector === 1;
	          }

	          _silent = true;
	          setTimeout(_unsilent, 30);
	          capture();

	          if (after && !nextSibling) {
	            el.appendChild(dragEl);
	          } else {
	            target.parentNode.insertBefore(dragEl, after ? nextSibling : target);
	          } // Undo chrome's scroll adjustment (has no effect on other browsers)


	          if (scrolledPastTop) {
	            scrollBy(scrolledPastTop, 0, scrollBefore - scrolledPastTop.scrollTop);
	          }

	          parentEl = dragEl.parentNode; // actualization
	          // must be done before animation

	          if (targetBeforeFirstSwap !== undefined && !isCircumstantialInvert) {
	            targetMoveDistance = Math.abs(targetBeforeFirstSwap - getRect(target)[side1]);
	          }

	          changed();
	          return completed(true);
	        }
	      }

	      if (el.contains(dragEl)) {
	        return completed(false);
	      }
	    }

	    return false;
	  },
	  _ignoreWhileAnimating: null,
	  _offMoveEvents: function _offMoveEvents() {
	    off(document, 'mousemove', this._onTouchMove);
	    off(document, 'touchmove', this._onTouchMove);
	    off(document, 'pointermove', this._onTouchMove);
	    off(document, 'dragover', nearestEmptyInsertDetectEvent);
	    off(document, 'mousemove', nearestEmptyInsertDetectEvent);
	    off(document, 'touchmove', nearestEmptyInsertDetectEvent);
	  },
	  _offUpEvents: function _offUpEvents() {
	    var ownerDocument = this.el.ownerDocument;
	    off(ownerDocument, 'mouseup', this._onDrop);
	    off(ownerDocument, 'touchend', this._onDrop);
	    off(ownerDocument, 'pointerup', this._onDrop);
	    off(ownerDocument, 'touchcancel', this._onDrop);
	    off(document, 'selectstart', this);
	  },
	  _onDrop: function _onDrop(
	  /**Event*/
	  evt) {
	    var el = this.el,
	        options = this.options; // Get the index of the dragged element within its parent

	    newIndex = index(dragEl);
	    newDraggableIndex = index(dragEl, options.draggable);
	    pluginEvent('drop', this, {
	      evt: evt
	    });
	    parentEl = dragEl && dragEl.parentNode; // Get again after plugin event

	    newIndex = index(dragEl);
	    newDraggableIndex = index(dragEl, options.draggable);

	    if (Sortable.eventCanceled) {
	      this._nulling();

	      return;
	    }

	    awaitingDragStarted = false;
	    isCircumstantialInvert = false;
	    pastFirstInvertThresh = false;
	    clearInterval(this._loopId);
	    clearTimeout(this._dragStartTimer);

	    _cancelNextTick(this.cloneId);

	    _cancelNextTick(this._dragStartId); // Unbind events


	    if (this.nativeDraggable) {
	      off(document, 'drop', this);
	      off(el, 'dragstart', this._onDragStart);
	    }

	    this._offMoveEvents();

	    this._offUpEvents();

	    if (Safari) {
	      css(document.body, 'user-select', '');
	    }

	    css(dragEl, 'transform', '');

	    if (evt) {
	      if (moved) {
	        evt.cancelable && evt.preventDefault();
	        !options.dropBubble && evt.stopPropagation();
	      }

	      ghostEl && ghostEl.parentNode && ghostEl.parentNode.removeChild(ghostEl);

	      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
	        // Remove clone(s)
	        cloneEl && cloneEl.parentNode && cloneEl.parentNode.removeChild(cloneEl);
	      }

	      if (dragEl) {
	        if (this.nativeDraggable) {
	          off(dragEl, 'dragend', this);
	        }

	        _disableDraggable(dragEl);

	        dragEl.style['will-change'] = ''; // Remove classes
	        // ghostClass is added in dragStarted

	        if (moved && !awaitingDragStarted) {
	          toggleClass(dragEl, putSortable ? putSortable.options.ghostClass : this.options.ghostClass, false);
	        }

	        toggleClass(dragEl, this.options.chosenClass, false); // Drag stop event

	        _dispatchEvent({
	          sortable: this,
	          name: 'unchoose',
	          toEl: parentEl,
	          newIndex: null,
	          newDraggableIndex: null,
	          originalEvent: evt
	        });

	        if (rootEl !== parentEl) {
	          if (newIndex >= 0) {
	            // Add event
	            _dispatchEvent({
	              rootEl: parentEl,
	              name: 'add',
	              toEl: parentEl,
	              fromEl: rootEl,
	              originalEvent: evt
	            }); // Remove event


	            _dispatchEvent({
	              sortable: this,
	              name: 'remove',
	              toEl: parentEl,
	              originalEvent: evt
	            }); // drag from one list and drop into another


	            _dispatchEvent({
	              rootEl: parentEl,
	              name: 'sort',
	              toEl: parentEl,
	              fromEl: rootEl,
	              originalEvent: evt
	            });

	            _dispatchEvent({
	              sortable: this,
	              name: 'sort',
	              toEl: parentEl,
	              originalEvent: evt
	            });
	          }

	          putSortable && putSortable.save();
	        } else {
	          if (newIndex !== oldIndex) {
	            if (newIndex >= 0) {
	              // drag & drop within the same list
	              _dispatchEvent({
	                sortable: this,
	                name: 'update',
	                toEl: parentEl,
	                originalEvent: evt
	              });

	              _dispatchEvent({
	                sortable: this,
	                name: 'sort',
	                toEl: parentEl,
	                originalEvent: evt
	              });
	            }
	          }
	        }

	        if (Sortable.active) {
	          /* jshint eqnull:true */
	          if (newIndex == null || newIndex === -1) {
	            newIndex = oldIndex;
	            newDraggableIndex = oldDraggableIndex;
	          }

	          _dispatchEvent({
	            sortable: this,
	            name: 'end',
	            toEl: parentEl,
	            originalEvent: evt
	          }); // Save sorting


	          this.save();
	        }
	      }
	    }

	    this._nulling();
	  },
	  _nulling: function _nulling() {
	    pluginEvent('nulling', this);
	    rootEl = dragEl = parentEl = ghostEl = nextEl = cloneEl = lastDownEl = cloneHidden = tapEvt = touchEvt = moved = newIndex = newDraggableIndex = oldIndex = oldDraggableIndex = lastTarget = lastDirection = putSortable = activeGroup = Sortable.dragged = Sortable.ghost = Sortable.clone = Sortable.active = null;
	    savedInputChecked.forEach(function (el) {
	      el.checked = true;
	    });
	    savedInputChecked.length = lastDx = lastDy = 0;
	  },
	  handleEvent: function handleEvent(
	  /**Event*/
	  evt) {
	    switch (evt.type) {
	      case 'drop':
	      case 'dragend':
	        this._onDrop(evt);

	        break;

	      case 'dragenter':
	      case 'dragover':
	        if (dragEl) {
	          this._onDragOver(evt);

	          _globalDragOver(evt);
	        }

	        break;

	      case 'selectstart':
	        evt.preventDefault();
	        break;
	    }
	  },

	  /**
	   * Serializes the item into an array of string.
	   * @returns {String[]}
	   */
	  toArray: function toArray() {
	    var order = [],
	        el,
	        children = this.el.children,
	        i = 0,
	        n = children.length,
	        options = this.options;

	    for (; i < n; i++) {
	      el = children[i];

	      if (closest(el, options.draggable, this.el, false)) {
	        order.push(el.getAttribute(options.dataIdAttr) || _generateId(el));
	      }
	    }

	    return order;
	  },

	  /**
	   * Sorts the elements according to the array.
	   * @param  {String[]}  order  order of the items
	   */
	  sort: function sort(order, useAnimation) {
	    var items = {},
	        rootEl = this.el;
	    this.toArray().forEach(function (id, i) {
	      var el = rootEl.children[i];

	      if (closest(el, this.options.draggable, rootEl, false)) {
	        items[id] = el;
	      }
	    }, this);
	    useAnimation && this.captureAnimationState();
	    order.forEach(function (id) {
	      if (items[id]) {
	        rootEl.removeChild(items[id]);
	        rootEl.appendChild(items[id]);
	      }
	    });
	    useAnimation && this.animateAll();
	  },

	  /**
	   * Save the current sorting
	   */
	  save: function save() {
	    var store = this.options.store;
	    store && store.set && store.set(this);
	  },

	  /**
	   * For each element in the set, get the first element that matches the selector by testing the element itself and traversing up through its ancestors in the DOM tree.
	   * @param   {HTMLElement}  el
	   * @param   {String}       [selector]  default: `options.draggable`
	   * @returns {HTMLElement|null}
	   */
	  closest: function closest$1(el, selector) {
	    return closest(el, selector || this.options.draggable, this.el, false);
	  },

	  /**
	   * Set/get option
	   * @param   {string} name
	   * @param   {*}      [value]
	   * @returns {*}
	   */
	  option: function option(name, value) {
	    var options = this.options;

	    if (value === void 0) {
	      return options[name];
	    } else {
	      var modifiedValue = PluginManager.modifyOption(this, name, value);

	      if (typeof modifiedValue !== 'undefined') {
	        options[name] = modifiedValue;
	      } else {
	        options[name] = value;
	      }

	      if (name === 'group') {
	        _prepareGroup(options);
	      }
	    }
	  },

	  /**
	   * Destroy
	   */
	  destroy: function destroy() {
	    pluginEvent('destroy', this);
	    var el = this.el;
	    el[expando] = null;
	    off(el, 'mousedown', this._onTapStart);
	    off(el, 'touchstart', this._onTapStart);
	    off(el, 'pointerdown', this._onTapStart);

	    if (this.nativeDraggable) {
	      off(el, 'dragover', this);
	      off(el, 'dragenter', this);
	    } // Remove draggable attributes


	    Array.prototype.forEach.call(el.querySelectorAll('[draggable]'), function (el) {
	      el.removeAttribute('draggable');
	    });

	    this._onDrop();

	    this._disableDelayedDragEvents();

	    sortables.splice(sortables.indexOf(this.el), 1);
	    this.el = el = null;
	  },
	  _hideClone: function _hideClone() {
	    if (!cloneHidden) {
	      pluginEvent('hideClone', this);
	      if (Sortable.eventCanceled) return;
	      css(cloneEl, 'display', 'none');

	      if (this.options.removeCloneOnHide && cloneEl.parentNode) {
	        cloneEl.parentNode.removeChild(cloneEl);
	      }

	      cloneHidden = true;
	    }
	  },
	  _showClone: function _showClone(putSortable) {
	    if (putSortable.lastPutMode !== 'clone') {
	      this._hideClone();

	      return;
	    }

	    if (cloneHidden) {
	      pluginEvent('showClone', this);
	      if (Sortable.eventCanceled) return; // show clone at dragEl or original position

	      if (dragEl.parentNode == rootEl && !this.options.group.revertClone) {
	        rootEl.insertBefore(cloneEl, dragEl);
	      } else if (nextEl) {
	        rootEl.insertBefore(cloneEl, nextEl);
	      } else {
	        rootEl.appendChild(cloneEl);
	      }

	      if (this.options.group.revertClone) {
	        this.animate(dragEl, cloneEl);
	      }

	      css(cloneEl, 'display', '');
	      cloneHidden = false;
	    }
	  }
	};

	function _globalDragOver(
	/**Event*/
	evt) {
	  if (evt.dataTransfer) {
	    evt.dataTransfer.dropEffect = 'move';
	  }

	  evt.cancelable && evt.preventDefault();
	}

	function _onMove(fromEl, toEl, dragEl, dragRect, targetEl, targetRect, originalEvent, willInsertAfter) {
	  var evt,
	      sortable = fromEl[expando],
	      onMoveFn = sortable.options.onMove,
	      retVal; // Support for new CustomEvent feature

	  if (window.CustomEvent && !IE11OrLess && !Edge) {
	    evt = new CustomEvent('move', {
	      bubbles: true,
	      cancelable: true
	    });
	  } else {
	    evt = document.createEvent('Event');
	    evt.initEvent('move', true, true);
	  }

	  evt.to = toEl;
	  evt.from = fromEl;
	  evt.dragged = dragEl;
	  evt.draggedRect = dragRect;
	  evt.related = targetEl || toEl;
	  evt.relatedRect = targetRect || getRect(toEl);
	  evt.willInsertAfter = willInsertAfter;
	  evt.originalEvent = originalEvent;
	  fromEl.dispatchEvent(evt);

	  if (onMoveFn) {
	    retVal = onMoveFn.call(sortable, evt, originalEvent);
	  }

	  return retVal;
	}

	function _disableDraggable(el) {
	  el.draggable = false;
	}

	function _unsilent() {
	  _silent = false;
	}

	function _ghostIsLast(evt, vertical, sortable) {
	  var rect = getRect(lastChild(sortable.el, sortable.options.draggable));
	  var spacer = 10;
	  return vertical ? evt.clientX > rect.right + spacer || evt.clientX <= rect.right && evt.clientY > rect.bottom && evt.clientX >= rect.left : evt.clientX > rect.right && evt.clientY > rect.top || evt.clientX <= rect.right && evt.clientY > rect.bottom + spacer;
	}

	function _getSwapDirection(evt, target, targetRect, vertical, swapThreshold, invertedSwapThreshold, invertSwap, isLastTarget) {
	  var mouseOnAxis = vertical ? evt.clientY : evt.clientX,
	      targetLength = vertical ? targetRect.height : targetRect.width,
	      targetS1 = vertical ? targetRect.top : targetRect.left,
	      targetS2 = vertical ? targetRect.bottom : targetRect.right,
	      invert = false;

	  if (!invertSwap) {
	    // Never invert or create dragEl shadow when target movemenet causes mouse to move past the end of regular swapThreshold
	    if (isLastTarget && targetMoveDistance < targetLength * swapThreshold) {
	      // multiplied only by swapThreshold because mouse will already be inside target by (1 - threshold) * targetLength / 2
	      // check if past first invert threshold on side opposite of lastDirection
	      if (!pastFirstInvertThresh && (lastDirection === 1 ? mouseOnAxis > targetS1 + targetLength * invertedSwapThreshold / 2 : mouseOnAxis < targetS2 - targetLength * invertedSwapThreshold / 2)) {
	        // past first invert threshold, do not restrict inverted threshold to dragEl shadow
	        pastFirstInvertThresh = true;
	      }

	      if (!pastFirstInvertThresh) {
	        // dragEl shadow (target move distance shadow)
	        if (lastDirection === 1 ? mouseOnAxis < targetS1 + targetMoveDistance // over dragEl shadow
	        : mouseOnAxis > targetS2 - targetMoveDistance) {
	          return -lastDirection;
	        }
	      } else {
	        invert = true;
	      }
	    } else {
	      // Regular
	      if (mouseOnAxis > targetS1 + targetLength * (1 - swapThreshold) / 2 && mouseOnAxis < targetS2 - targetLength * (1 - swapThreshold) / 2) {
	        return _getInsertDirection(target);
	      }
	    }
	  }

	  invert = invert || invertSwap;

	  if (invert) {
	    // Invert of regular
	    if (mouseOnAxis < targetS1 + targetLength * invertedSwapThreshold / 2 || mouseOnAxis > targetS2 - targetLength * invertedSwapThreshold / 2) {
	      return mouseOnAxis > targetS1 + targetLength / 2 ? 1 : -1;
	    }
	  }

	  return 0;
	}
	/**
	 * Gets the direction dragEl must be swapped relative to target in order to make it
	 * seem that dragEl has been "inserted" into that element's position
	 * @param  {HTMLElement} target       The target whose position dragEl is being inserted at
	 * @return {Number}                   Direction dragEl must be swapped
	 */


	function _getInsertDirection(target) {
	  if (index(dragEl) < index(target)) {
	    return 1;
	  } else {
	    return -1;
	  }
	}
	/**
	 * Generate id
	 * @param   {HTMLElement} el
	 * @returns {String}
	 * @private
	 */


	function _generateId(el) {
	  var str = el.tagName + el.className + el.src + el.href + el.textContent,
	      i = str.length,
	      sum = 0;

	  while (i--) {
	    sum += str.charCodeAt(i);
	  }

	  return sum.toString(36);
	}

	function _saveInputCheckedState(root) {
	  savedInputChecked.length = 0;
	  var inputs = root.getElementsByTagName('input');
	  var idx = inputs.length;

	  while (idx--) {
	    var el = inputs[idx];
	    el.checked && savedInputChecked.push(el);
	  }
	}

	function _nextTick(fn) {
	  return setTimeout(fn, 0);
	}

	function _cancelNextTick(id) {
	  return clearTimeout(id);
	} // Fixed #973:


	if (documentExists) {
	  on(document, 'touchmove', function (evt) {
	    if ((Sortable.active || awaitingDragStarted) && evt.cancelable) {
	      evt.preventDefault();
	    }
	  });
	} // Export utils


	Sortable.utils = {
	  on: on,
	  off: off,
	  css: css,
	  find: find,
	  is: function is(el, selector) {
	    return !!closest(el, selector, el, false);
	  },
	  extend: extend,
	  throttle: throttle,
	  closest: closest,
	  toggleClass: toggleClass,
	  clone: clone,
	  index: index,
	  nextTick: _nextTick,
	  cancelNextTick: _cancelNextTick,
	  detectDirection: _detectDirection,
	  getChild: getChild
	};
	/**
	 * Get the Sortable instance of an element
	 * @param  {HTMLElement} element The element
	 * @return {Sortable|undefined}         The instance of Sortable
	 */

	Sortable.get = function (element) {
	  return element[expando];
	};
	/**
	 * Mount a plugin to Sortable
	 * @param  {...SortablePlugin|SortablePlugin[]} plugins       Plugins being mounted
	 */


	Sortable.mount = function () {
	  for (var _len = arguments.length, plugins = new Array(_len), _key = 0; _key < _len; _key++) {
	    plugins[_key] = arguments[_key];
	  }

	  if (plugins[0].constructor === Array) plugins = plugins[0];
	  plugins.forEach(function (plugin) {
	    if (!plugin.prototype || !plugin.prototype.constructor) {
	      throw "Sortable: Mounted plugin must be a constructor function, not ".concat({}.toString.call(plugin));
	    }

	    if (plugin.utils) Sortable.utils = _objectSpread({}, Sortable.utils, plugin.utils);
	    PluginManager.mount(plugin);
	  });
	};
	/**
	 * Create sortable instance
	 * @param {HTMLElement}  el
	 * @param {Object}      [options]
	 */


	Sortable.create = function (el, options) {
	  return new Sortable(el, options);
	}; // Export


	Sortable.version = version;

	var autoScrolls = [],
	    scrollEl,
	    scrollRootEl,
	    scrolling = false,
	    lastAutoScrollX,
	    lastAutoScrollY,
	    touchEvt$1,
	    pointerElemChangedInterval;

	function AutoScrollPlugin() {
	  function AutoScroll() {
	    this.defaults = {
	      scroll: true,
	      scrollSensitivity: 30,
	      scrollSpeed: 10,
	      bubbleScroll: true
	    }; // Bind all private methods

	    for (var fn in this) {
	      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
	        this[fn] = this[fn].bind(this);
	      }
	    }
	  }

	  AutoScroll.prototype = {
	    dragStarted: function dragStarted(_ref) {
	      var originalEvent = _ref.originalEvent;

	      if (this.sortable.nativeDraggable) {
	        on(document, 'dragover', this._handleAutoScroll);
	      } else {
	        if (this.options.supportPointer) {
	          on(document, 'pointermove', this._handleFallbackAutoScroll);
	        } else if (originalEvent.touches) {
	          on(document, 'touchmove', this._handleFallbackAutoScroll);
	        } else {
	          on(document, 'mousemove', this._handleFallbackAutoScroll);
	        }
	      }
	    },
	    dragOverCompleted: function dragOverCompleted(_ref2) {
	      var originalEvent = _ref2.originalEvent;

	      // For when bubbling is canceled and using fallback (fallback 'touchmove' always reached)
	      if (!this.options.dragOverBubble && !originalEvent.rootEl) {
	        this._handleAutoScroll(originalEvent);
	      }
	    },
	    drop: function drop() {
	      if (this.sortable.nativeDraggable) {
	        off(document, 'dragover', this._handleAutoScroll);
	      } else {
	        off(document, 'pointermove', this._handleFallbackAutoScroll);
	        off(document, 'touchmove', this._handleFallbackAutoScroll);
	        off(document, 'mousemove', this._handleFallbackAutoScroll);
	      }

	      clearPointerElemChangedInterval();
	      clearAutoScrolls();
	      cancelThrottle();
	    },
	    nulling: function nulling() {
	      touchEvt$1 = scrollRootEl = scrollEl = scrolling = pointerElemChangedInterval = lastAutoScrollX = lastAutoScrollY = null;
	      autoScrolls.length = 0;
	    },
	    _handleFallbackAutoScroll: function _handleFallbackAutoScroll(evt) {
	      this._handleAutoScroll(evt, true);
	    },
	    _handleAutoScroll: function _handleAutoScroll(evt, fallback) {
	      var _this = this;

	      var x = (evt.touches ? evt.touches[0] : evt).clientX,
	          y = (evt.touches ? evt.touches[0] : evt).clientY,
	          elem = document.elementFromPoint(x, y);
	      touchEvt$1 = evt; // IE does not seem to have native autoscroll,
	      // Edge's autoscroll seems too conditional,
	      // MACOS Safari does not have autoscroll,
	      // Firefox and Chrome are good

	      if (fallback || Edge || IE11OrLess || Safari) {
	        autoScroll(evt, this.options, elem, fallback); // Listener for pointer element change

	        var ogElemScroller = getParentAutoScrollElement(elem, true);

	        if (scrolling && (!pointerElemChangedInterval || x !== lastAutoScrollX || y !== lastAutoScrollY)) {
	          pointerElemChangedInterval && clearPointerElemChangedInterval(); // Detect for pointer elem change, emulating native DnD behaviour

	          pointerElemChangedInterval = setInterval(function () {
	            var newElem = getParentAutoScrollElement(document.elementFromPoint(x, y), true);

	            if (newElem !== ogElemScroller) {
	              ogElemScroller = newElem;
	              clearAutoScrolls();
	            }

	            autoScroll(evt, _this.options, newElem, fallback);
	          }, 10);
	          lastAutoScrollX = x;
	          lastAutoScrollY = y;
	        }
	      } else {
	        // if DnD is enabled (and browser has good autoscrolling), first autoscroll will already scroll, so get parent autoscroll of first autoscroll
	        if (!this.options.bubbleScroll || getParentAutoScrollElement(elem, true) === getWindowScrollingElement()) {
	          clearAutoScrolls();
	          return;
	        }

	        autoScroll(evt, this.options, getParentAutoScrollElement(elem, false), false);
	      }
	    }
	  };
	  return _extends(AutoScroll, {
	    pluginName: 'scroll',
	    initializeByDefault: true
	  });
	}

	function clearAutoScrolls() {
	  autoScrolls.forEach(function (autoScroll) {
	    clearInterval(autoScroll.pid);
	  });
	  autoScrolls = [];
	}

	function clearPointerElemChangedInterval() {
	  clearInterval(pointerElemChangedInterval);
	}

	var autoScroll = throttle(function (evt, options, rootEl, isFallback) {
	  // Bug: https://bugzilla.mozilla.org/show_bug.cgi?id=505521
	  if (!options.scroll) return;
	  var x = (evt.touches ? evt.touches[0] : evt).clientX,
	      y = (evt.touches ? evt.touches[0] : evt).clientY,
	      sens = options.scrollSensitivity,
	      speed = options.scrollSpeed,
	      winScroller = getWindowScrollingElement();
	  var scrollThisInstance = false,
	      scrollCustomFn; // New scroll root, set scrollEl

	  if (scrollRootEl !== rootEl) {
	    scrollRootEl = rootEl;
	    clearAutoScrolls();
	    scrollEl = options.scroll;
	    scrollCustomFn = options.scrollFn;

	    if (scrollEl === true) {
	      scrollEl = getParentAutoScrollElement(rootEl, true);
	    }
	  }

	  var layersOut = 0;
	  var currentParent = scrollEl;

	  do {
	    var el = currentParent,
	        rect = getRect(el),
	        top = rect.top,
	        bottom = rect.bottom,
	        left = rect.left,
	        right = rect.right,
	        width = rect.width,
	        height = rect.height,
	        canScrollX = void 0,
	        canScrollY = void 0,
	        scrollWidth = el.scrollWidth,
	        scrollHeight = el.scrollHeight,
	        elCSS = css(el),
	        scrollPosX = el.scrollLeft,
	        scrollPosY = el.scrollTop;

	    if (el === winScroller) {
	      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll' || elCSS.overflowX === 'visible');
	      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll' || elCSS.overflowY === 'visible');
	    } else {
	      canScrollX = width < scrollWidth && (elCSS.overflowX === 'auto' || elCSS.overflowX === 'scroll');
	      canScrollY = height < scrollHeight && (elCSS.overflowY === 'auto' || elCSS.overflowY === 'scroll');
	    }

	    var vx = canScrollX && (Math.abs(right - x) <= sens && scrollPosX + width < scrollWidth) - (Math.abs(left - x) <= sens && !!scrollPosX);
	    var vy = canScrollY && (Math.abs(bottom - y) <= sens && scrollPosY + height < scrollHeight) - (Math.abs(top - y) <= sens && !!scrollPosY);

	    if (!autoScrolls[layersOut]) {
	      for (var i = 0; i <= layersOut; i++) {
	        if (!autoScrolls[i]) {
	          autoScrolls[i] = {};
	        }
	      }
	    }

	    if (autoScrolls[layersOut].vx != vx || autoScrolls[layersOut].vy != vy || autoScrolls[layersOut].el !== el) {
	      autoScrolls[layersOut].el = el;
	      autoScrolls[layersOut].vx = vx;
	      autoScrolls[layersOut].vy = vy;
	      clearInterval(autoScrolls[layersOut].pid);

	      if (vx != 0 || vy != 0) {
	        scrollThisInstance = true;
	        /* jshint loopfunc:true */

	        autoScrolls[layersOut].pid = setInterval(function () {
	          // emulate drag over during autoscroll (fallback), emulating native DnD behaviour
	          if (isFallback && this.layer === 0) {
	            Sortable.active._onTouchMove(touchEvt$1); // To move ghost if it is positioned absolutely

	          }

	          var scrollOffsetY = autoScrolls[this.layer].vy ? autoScrolls[this.layer].vy * speed : 0;
	          var scrollOffsetX = autoScrolls[this.layer].vx ? autoScrolls[this.layer].vx * speed : 0;

	          if (typeof scrollCustomFn === 'function') {
	            if (scrollCustomFn.call(Sortable.dragged.parentNode[expando], scrollOffsetX, scrollOffsetY, evt, touchEvt$1, autoScrolls[this.layer].el) !== 'continue') {
	              return;
	            }
	          }

	          scrollBy(autoScrolls[this.layer].el, scrollOffsetX, scrollOffsetY);
	        }.bind({
	          layer: layersOut
	        }), 24);
	      }
	    }

	    layersOut++;
	  } while (options.bubbleScroll && currentParent !== winScroller && (currentParent = getParentAutoScrollElement(currentParent, false)));

	  scrolling = scrollThisInstance; // in case another function catches scrolling as false in between when it is not
	}, 30);

	var drop = function drop(_ref) {
	  var originalEvent = _ref.originalEvent,
	      putSortable = _ref.putSortable,
	      dragEl = _ref.dragEl,
	      activeSortable = _ref.activeSortable,
	      dispatchSortableEvent = _ref.dispatchSortableEvent,
	      hideGhostForTarget = _ref.hideGhostForTarget,
	      unhideGhostForTarget = _ref.unhideGhostForTarget;
	  if (!originalEvent) return;
	  var toSortable = putSortable || activeSortable;
	  hideGhostForTarget();
	  var touch = originalEvent.changedTouches && originalEvent.changedTouches.length ? originalEvent.changedTouches[0] : originalEvent;
	  var target = document.elementFromPoint(touch.clientX, touch.clientY);
	  unhideGhostForTarget();

	  if (toSortable && !toSortable.el.contains(target)) {
	    dispatchSortableEvent('spill');
	    this.onSpill({
	      dragEl: dragEl,
	      putSortable: putSortable
	    });
	  }
	};

	function Revert() {}

	Revert.prototype = {
	  startIndex: null,
	  dragStart: function dragStart(_ref2) {
	    var oldDraggableIndex = _ref2.oldDraggableIndex;
	    this.startIndex = oldDraggableIndex;
	  },
	  onSpill: function onSpill(_ref3) {
	    var dragEl = _ref3.dragEl,
	        putSortable = _ref3.putSortable;
	    this.sortable.captureAnimationState();

	    if (putSortable) {
	      putSortable.captureAnimationState();
	    }

	    var nextSibling = getChild(this.sortable.el, this.startIndex, this.options);

	    if (nextSibling) {
	      this.sortable.el.insertBefore(dragEl, nextSibling);
	    } else {
	      this.sortable.el.appendChild(dragEl);
	    }

	    this.sortable.animateAll();

	    if (putSortable) {
	      putSortable.animateAll();
	    }
	  },
	  drop: drop
	};

	_extends(Revert, {
	  pluginName: 'revertOnSpill'
	});

	function Remove() {}

	Remove.prototype = {
	  onSpill: function onSpill(_ref4) {
	    var dragEl = _ref4.dragEl,
	        putSortable = _ref4.putSortable;
	    var parentSortable = putSortable || this.sortable;
	    parentSortable.captureAnimationState();
	    dragEl.parentNode && dragEl.parentNode.removeChild(dragEl);
	    parentSortable.animateAll();
	  },
	  drop: drop
	};

	_extends(Remove, {
	  pluginName: 'removeOnSpill'
	});

	var lastSwapEl;

	function SwapPlugin() {
	  function Swap() {
	    this.defaults = {
	      swapClass: 'sortable-swap-highlight'
	    };
	  }

	  Swap.prototype = {
	    dragStart: function dragStart(_ref) {
	      var dragEl = _ref.dragEl;
	      lastSwapEl = dragEl;
	    },
	    dragOverValid: function dragOverValid(_ref2) {
	      var completed = _ref2.completed,
	          target = _ref2.target,
	          onMove = _ref2.onMove,
	          activeSortable = _ref2.activeSortable,
	          changed = _ref2.changed,
	          cancel = _ref2.cancel;
	      if (!activeSortable.options.swap) return;
	      var el = this.sortable.el,
	          options = this.options;

	      if (target && target !== el) {
	        var prevSwapEl = lastSwapEl;

	        if (onMove(target) !== false) {
	          toggleClass(target, options.swapClass, true);
	          lastSwapEl = target;
	        } else {
	          lastSwapEl = null;
	        }

	        if (prevSwapEl && prevSwapEl !== lastSwapEl) {
	          toggleClass(prevSwapEl, options.swapClass, false);
	        }
	      }

	      changed();
	      completed(true);
	      cancel();
	    },
	    drop: function drop(_ref3) {
	      var activeSortable = _ref3.activeSortable,
	          putSortable = _ref3.putSortable,
	          dragEl = _ref3.dragEl;
	      var toSortable = putSortable || this.sortable;
	      var options = this.options;
	      lastSwapEl && toggleClass(lastSwapEl, options.swapClass, false);

	      if (lastSwapEl && (options.swap || putSortable && putSortable.options.swap)) {
	        if (dragEl !== lastSwapEl) {
	          toSortable.captureAnimationState();
	          if (toSortable !== activeSortable) activeSortable.captureAnimationState();
	          swapNodes(dragEl, lastSwapEl);
	          toSortable.animateAll();
	          if (toSortable !== activeSortable) activeSortable.animateAll();
	        }
	      }
	    },
	    nulling: function nulling() {
	      lastSwapEl = null;
	    }
	  };
	  return _extends(Swap, {
	    pluginName: 'swap',
	    eventProperties: function eventProperties() {
	      return {
	        swapItem: lastSwapEl
	      };
	    }
	  });
	}

	function swapNodes(n1, n2) {
	  var p1 = n1.parentNode,
	      p2 = n2.parentNode,
	      i1,
	      i2;
	  if (!p1 || !p2 || p1.isEqualNode(n2) || p2.isEqualNode(n1)) return;
	  i1 = index(n1);
	  i2 = index(n2);

	  if (p1.isEqualNode(p2) && i1 < i2) {
	    i2++;
	  }

	  p1.insertBefore(n2, p1.children[i1]);
	  p2.insertBefore(n1, p2.children[i2]);
	}

	var multiDragElements = [],
	    multiDragClones = [],
	    lastMultiDragSelect,
	    // for selection with modifier key down (SHIFT)
	multiDragSortable,
	    initialFolding = false,
	    // Initial multi-drag fold when drag started
	folding = false,
	    // Folding any other time
	dragStarted = false,
	    dragEl$1,
	    clonesFromRect,
	    clonesHidden;

	function MultiDragPlugin() {
	  function MultiDrag(sortable) {
	    // Bind all private methods
	    for (var fn in this) {
	      if (fn.charAt(0) === '_' && typeof this[fn] === 'function') {
	        this[fn] = this[fn].bind(this);
	      }
	    }

	    if (sortable.options.supportPointer) {
	      on(document, 'pointerup', this._deselectMultiDrag);
	    } else {
	      on(document, 'mouseup', this._deselectMultiDrag);
	      on(document, 'touchend', this._deselectMultiDrag);
	    }

	    on(document, 'keydown', this._checkKeyDown);
	    on(document, 'keyup', this._checkKeyUp);
	    this.defaults = {
	      selectedClass: 'sortable-selected',
	      multiDragKey: null,
	      setData: function setData(dataTransfer, dragEl) {
	        var data = '';

	        if (multiDragElements.length && multiDragSortable === sortable) {
	          multiDragElements.forEach(function (multiDragElement, i) {
	            data += (!i ? '' : ', ') + multiDragElement.textContent;
	          });
	        } else {
	          data = dragEl.textContent;
	        }

	        dataTransfer.setData('Text', data);
	      }
	    };
	  }

	  MultiDrag.prototype = {
	    multiDragKeyDown: false,
	    isMultiDrag: false,
	    delayStartGlobal: function delayStartGlobal(_ref) {
	      var dragged = _ref.dragEl;
	      dragEl$1 = dragged;
	    },
	    delayEnded: function delayEnded() {
	      this.isMultiDrag = ~multiDragElements.indexOf(dragEl$1);
	    },
	    setupClone: function setupClone(_ref2) {
	      var sortable = _ref2.sortable,
	          cancel = _ref2.cancel;
	      if (!this.isMultiDrag) return;

	      for (var i = 0; i < multiDragElements.length; i++) {
	        multiDragClones.push(clone(multiDragElements[i]));
	        multiDragClones[i].sortableIndex = multiDragElements[i].sortableIndex;
	        multiDragClones[i].draggable = false;
	        multiDragClones[i].style['will-change'] = '';
	        toggleClass(multiDragClones[i], this.options.selectedClass, false);
	        multiDragElements[i] === dragEl$1 && toggleClass(multiDragClones[i], this.options.chosenClass, false);
	      }

	      sortable._hideClone();

	      cancel();
	    },
	    clone: function clone(_ref3) {
	      var sortable = _ref3.sortable,
	          rootEl = _ref3.rootEl,
	          dispatchSortableEvent = _ref3.dispatchSortableEvent,
	          cancel = _ref3.cancel;
	      if (!this.isMultiDrag) return;

	      if (!this.options.removeCloneOnHide) {
	        if (multiDragElements.length && multiDragSortable === sortable) {
	          insertMultiDragClones(true, rootEl);
	          dispatchSortableEvent('clone');
	          cancel();
	        }
	      }
	    },
	    showClone: function showClone(_ref4) {
	      var cloneNowShown = _ref4.cloneNowShown,
	          rootEl = _ref4.rootEl,
	          cancel = _ref4.cancel;
	      if (!this.isMultiDrag) return;
	      insertMultiDragClones(false, rootEl);
	      multiDragClones.forEach(function (clone) {
	        css(clone, 'display', '');
	      });
	      cloneNowShown();
	      clonesHidden = false;
	      cancel();
	    },
	    hideClone: function hideClone(_ref5) {
	      var _this = this;

	      _ref5.sortable;
	          var cloneNowHidden = _ref5.cloneNowHidden,
	          cancel = _ref5.cancel;
	      if (!this.isMultiDrag) return;
	      multiDragClones.forEach(function (clone) {
	        css(clone, 'display', 'none');

	        if (_this.options.removeCloneOnHide && clone.parentNode) {
	          clone.parentNode.removeChild(clone);
	        }
	      });
	      cloneNowHidden();
	      clonesHidden = true;
	      cancel();
	    },
	    dragStartGlobal: function dragStartGlobal(_ref6) {
	      _ref6.sortable;

	      if (!this.isMultiDrag && multiDragSortable) {
	        multiDragSortable.multiDrag._deselectMultiDrag();
	      }

	      multiDragElements.forEach(function (multiDragElement) {
	        multiDragElement.sortableIndex = index(multiDragElement);
	      }); // Sort multi-drag elements

	      multiDragElements = multiDragElements.sort(function (a, b) {
	        return a.sortableIndex - b.sortableIndex;
	      });
	      dragStarted = true;
	    },
	    dragStarted: function dragStarted(_ref7) {
	      var _this2 = this;

	      var sortable = _ref7.sortable;
	      if (!this.isMultiDrag) return;

	      if (this.options.sort) {
	        // Capture rects,
	        // hide multi drag elements (by positioning them absolute),
	        // set multi drag elements rects to dragRect,
	        // show multi drag elements,
	        // animate to rects,
	        // unset rects & remove from DOM
	        sortable.captureAnimationState();

	        if (this.options.animation) {
	          multiDragElements.forEach(function (multiDragElement) {
	            if (multiDragElement === dragEl$1) return;
	            css(multiDragElement, 'position', 'absolute');
	          });
	          var dragRect = getRect(dragEl$1, false, true, true);
	          multiDragElements.forEach(function (multiDragElement) {
	            if (multiDragElement === dragEl$1) return;
	            setRect(multiDragElement, dragRect);
	          });
	          folding = true;
	          initialFolding = true;
	        }
	      }

	      sortable.animateAll(function () {
	        folding = false;
	        initialFolding = false;

	        if (_this2.options.animation) {
	          multiDragElements.forEach(function (multiDragElement) {
	            unsetRect(multiDragElement);
	          });
	        } // Remove all auxiliary multidrag items from el, if sorting enabled


	        if (_this2.options.sort) {
	          removeMultiDragElements();
	        }
	      });
	    },
	    dragOver: function dragOver(_ref8) {
	      var target = _ref8.target,
	          completed = _ref8.completed,
	          cancel = _ref8.cancel;

	      if (folding && ~multiDragElements.indexOf(target)) {
	        completed(false);
	        cancel();
	      }
	    },
	    revert: function revert(_ref9) {
	      var fromSortable = _ref9.fromSortable,
	          rootEl = _ref9.rootEl,
	          sortable = _ref9.sortable,
	          dragRect = _ref9.dragRect;

	      if (multiDragElements.length > 1) {
	        // Setup unfold animation
	        multiDragElements.forEach(function (multiDragElement) {
	          sortable.addAnimationState({
	            target: multiDragElement,
	            rect: folding ? getRect(multiDragElement) : dragRect
	          });
	          unsetRect(multiDragElement);
	          multiDragElement.fromRect = dragRect;
	          fromSortable.removeAnimationState(multiDragElement);
	        });
	        folding = false;
	        insertMultiDragElements(!this.options.removeCloneOnHide, rootEl);
	      }
	    },
	    dragOverCompleted: function dragOverCompleted(_ref10) {
	      var sortable = _ref10.sortable,
	          isOwner = _ref10.isOwner,
	          insertion = _ref10.insertion,
	          activeSortable = _ref10.activeSortable,
	          parentEl = _ref10.parentEl,
	          putSortable = _ref10.putSortable;
	      var options = this.options;

	      if (insertion) {
	        // Clones must be hidden before folding animation to capture dragRectAbsolute properly
	        if (isOwner) {
	          activeSortable._hideClone();
	        }

	        initialFolding = false; // If leaving sort:false root, or already folding - Fold to new location

	        if (options.animation && multiDragElements.length > 1 && (folding || !isOwner && !activeSortable.options.sort && !putSortable)) {
	          // Fold: Set all multi drag elements's rects to dragEl's rect when multi-drag elements are invisible
	          var dragRectAbsolute = getRect(dragEl$1, false, true, true);
	          multiDragElements.forEach(function (multiDragElement) {
	            if (multiDragElement === dragEl$1) return;
	            setRect(multiDragElement, dragRectAbsolute); // Move element(s) to end of parentEl so that it does not interfere with multi-drag clones insertion if they are inserted
	            // while folding, and so that we can capture them again because old sortable will no longer be fromSortable

	            parentEl.appendChild(multiDragElement);
	          });
	          folding = true;
	        } // Clones must be shown (and check to remove multi drags) after folding when interfering multiDragElements are moved out


	        if (!isOwner) {
	          // Only remove if not folding (folding will remove them anyways)
	          if (!folding) {
	            removeMultiDragElements();
	          }

	          if (multiDragElements.length > 1) {
	            var clonesHiddenBefore = clonesHidden;

	            activeSortable._showClone(sortable); // Unfold animation for clones if showing from hidden


	            if (activeSortable.options.animation && !clonesHidden && clonesHiddenBefore) {
	              multiDragClones.forEach(function (clone) {
	                activeSortable.addAnimationState({
	                  target: clone,
	                  rect: clonesFromRect
	                });
	                clone.fromRect = clonesFromRect;
	                clone.thisAnimationDuration = null;
	              });
	            }
	          } else {
	            activeSortable._showClone(sortable);
	          }
	        }
	      }
	    },
	    dragOverAnimationCapture: function dragOverAnimationCapture(_ref11) {
	      var dragRect = _ref11.dragRect,
	          isOwner = _ref11.isOwner,
	          activeSortable = _ref11.activeSortable;
	      multiDragElements.forEach(function (multiDragElement) {
	        multiDragElement.thisAnimationDuration = null;
	      });

	      if (activeSortable.options.animation && !isOwner && activeSortable.multiDrag.isMultiDrag) {
	        clonesFromRect = _extends({}, dragRect);
	        var dragMatrix = matrix(dragEl$1, true);
	        clonesFromRect.top -= dragMatrix.f;
	        clonesFromRect.left -= dragMatrix.e;
	      }
	    },
	    dragOverAnimationComplete: function dragOverAnimationComplete() {
	      if (folding) {
	        folding = false;
	        removeMultiDragElements();
	      }
	    },
	    drop: function drop(_ref12) {
	      var evt = _ref12.originalEvent,
	          rootEl = _ref12.rootEl,
	          parentEl = _ref12.parentEl,
	          sortable = _ref12.sortable,
	          dispatchSortableEvent = _ref12.dispatchSortableEvent,
	          oldIndex = _ref12.oldIndex,
	          putSortable = _ref12.putSortable;
	      var toSortable = putSortable || this.sortable;
	      if (!evt) return;
	      var options = this.options,
	          children = parentEl.children; // Multi-drag selection

	      if (!dragStarted) {
	        if (options.multiDragKey && !this.multiDragKeyDown) {
	          this._deselectMultiDrag();
	        }

	        toggleClass(dragEl$1, options.selectedClass, !~multiDragElements.indexOf(dragEl$1));

	        if (!~multiDragElements.indexOf(dragEl$1)) {
	          multiDragElements.push(dragEl$1);
	          dispatchEvent({
	            sortable: sortable,
	            rootEl: rootEl,
	            name: 'select',
	            targetEl: dragEl$1,
	            originalEvt: evt
	          }); // Modifier activated, select from last to dragEl

	          if (evt.shiftKey && lastMultiDragSelect && sortable.el.contains(lastMultiDragSelect)) {
	            var lastIndex = index(lastMultiDragSelect),
	                currentIndex = index(dragEl$1);

	            if (~lastIndex && ~currentIndex && lastIndex !== currentIndex) {
	              // Must include lastMultiDragSelect (select it), in case modified selection from no selection
	              // (but previous selection existed)
	              var n, i;

	              if (currentIndex > lastIndex) {
	                i = lastIndex;
	                n = currentIndex;
	              } else {
	                i = currentIndex;
	                n = lastIndex + 1;
	              }

	              for (; i < n; i++) {
	                if (~multiDragElements.indexOf(children[i])) continue;
	                toggleClass(children[i], options.selectedClass, true);
	                multiDragElements.push(children[i]);
	                dispatchEvent({
	                  sortable: sortable,
	                  rootEl: rootEl,
	                  name: 'select',
	                  targetEl: children[i],
	                  originalEvt: evt
	                });
	              }
	            }
	          } else {
	            lastMultiDragSelect = dragEl$1;
	          }

	          multiDragSortable = toSortable;
	        } else {
	          multiDragElements.splice(multiDragElements.indexOf(dragEl$1), 1);
	          lastMultiDragSelect = null;
	          dispatchEvent({
	            sortable: sortable,
	            rootEl: rootEl,
	            name: 'deselect',
	            targetEl: dragEl$1,
	            originalEvt: evt
	          });
	        }
	      } // Multi-drag drop


	      if (dragStarted && this.isMultiDrag) {
	        // Do not "unfold" after around dragEl if reverted
	        if ((parentEl[expando].options.sort || parentEl !== rootEl) && multiDragElements.length > 1) {
	          var dragRect = getRect(dragEl$1),
	              multiDragIndex = index(dragEl$1, ':not(.' + this.options.selectedClass + ')');
	          if (!initialFolding && options.animation) dragEl$1.thisAnimationDuration = null;
	          toSortable.captureAnimationState();

	          if (!initialFolding) {
	            if (options.animation) {
	              dragEl$1.fromRect = dragRect;
	              multiDragElements.forEach(function (multiDragElement) {
	                multiDragElement.thisAnimationDuration = null;

	                if (multiDragElement !== dragEl$1) {
	                  var rect = folding ? getRect(multiDragElement) : dragRect;
	                  multiDragElement.fromRect = rect; // Prepare unfold animation

	                  toSortable.addAnimationState({
	                    target: multiDragElement,
	                    rect: rect
	                  });
	                }
	              });
	            } // Multi drag elements are not necessarily removed from the DOM on drop, so to reinsert
	            // properly they must all be removed


	            removeMultiDragElements();
	            multiDragElements.forEach(function (multiDragElement) {
	              if (children[multiDragIndex]) {
	                parentEl.insertBefore(multiDragElement, children[multiDragIndex]);
	              } else {
	                parentEl.appendChild(multiDragElement);
	              }

	              multiDragIndex++;
	            }); // If initial folding is done, the elements may have changed position because they are now
	            // unfolding around dragEl, even though dragEl may not have his index changed, so update event
	            // must be fired here as Sortable will not.

	            if (oldIndex === index(dragEl$1)) {
	              var update = false;
	              multiDragElements.forEach(function (multiDragElement) {
	                if (multiDragElement.sortableIndex !== index(multiDragElement)) {
	                  update = true;
	                  return;
	                }
	              });

	              if (update) {
	                dispatchSortableEvent('update');
	              }
	            }
	          } // Must be done after capturing individual rects (scroll bar)


	          multiDragElements.forEach(function (multiDragElement) {
	            unsetRect(multiDragElement);
	          });
	          toSortable.animateAll();
	        }

	        multiDragSortable = toSortable;
	      } // Remove clones if necessary


	      if (rootEl === parentEl || putSortable && putSortable.lastPutMode !== 'clone') {
	        multiDragClones.forEach(function (clone) {
	          clone.parentNode && clone.parentNode.removeChild(clone);
	        });
	      }
	    },
	    nullingGlobal: function nullingGlobal() {
	      this.isMultiDrag = dragStarted = false;
	      multiDragClones.length = 0;
	    },
	    destroyGlobal: function destroyGlobal() {
	      this._deselectMultiDrag();

	      off(document, 'pointerup', this._deselectMultiDrag);
	      off(document, 'mouseup', this._deselectMultiDrag);
	      off(document, 'touchend', this._deselectMultiDrag);
	      off(document, 'keydown', this._checkKeyDown);
	      off(document, 'keyup', this._checkKeyUp);
	    },
	    _deselectMultiDrag: function _deselectMultiDrag(evt) {
	      if (typeof dragStarted !== "undefined" && dragStarted) return; // Only deselect if selection is in this sortable

	      if (multiDragSortable !== this.sortable) return; // Only deselect if target is not item in this sortable

	      if (evt && closest(evt.target, this.options.draggable, this.sortable.el, false)) return; // Only deselect if left click

	      if (evt && evt.button !== 0) return;

	      while (multiDragElements.length) {
	        var el = multiDragElements[0];
	        toggleClass(el, this.options.selectedClass, false);
	        multiDragElements.shift();
	        dispatchEvent({
	          sortable: this.sortable,
	          rootEl: this.sortable.el,
	          name: 'deselect',
	          targetEl: el,
	          originalEvt: evt
	        });
	      }
	    },
	    _checkKeyDown: function _checkKeyDown(evt) {
	      if (evt.key === this.options.multiDragKey) {
	        this.multiDragKeyDown = true;
	      }
	    },
	    _checkKeyUp: function _checkKeyUp(evt) {
	      if (evt.key === this.options.multiDragKey) {
	        this.multiDragKeyDown = false;
	      }
	    }
	  };
	  return _extends(MultiDrag, {
	    // Static methods & properties
	    pluginName: 'multiDrag',
	    utils: {
	      /**
	       * Selects the provided multi-drag item
	       * @param  {HTMLElement} el    The element to be selected
	       */
	      select: function select(el) {
	        var sortable = el.parentNode[expando];
	        if (!sortable || !sortable.options.multiDrag || ~multiDragElements.indexOf(el)) return;

	        if (multiDragSortable && multiDragSortable !== sortable) {
	          multiDragSortable.multiDrag._deselectMultiDrag();

	          multiDragSortable = sortable;
	        }

	        toggleClass(el, sortable.options.selectedClass, true);
	        multiDragElements.push(el);
	      },

	      /**
	       * Deselects the provided multi-drag item
	       * @param  {HTMLElement} el    The element to be deselected
	       */
	      deselect: function deselect(el) {
	        var sortable = el.parentNode[expando],
	            index = multiDragElements.indexOf(el);
	        if (!sortable || !sortable.options.multiDrag || !~index) return;
	        toggleClass(el, sortable.options.selectedClass, false);
	        multiDragElements.splice(index, 1);
	      }
	    },
	    eventProperties: function eventProperties() {
	      var _this3 = this;

	      var oldIndicies = [],
	          newIndicies = [];
	      multiDragElements.forEach(function (multiDragElement) {
	        oldIndicies.push({
	          multiDragElement: multiDragElement,
	          index: multiDragElement.sortableIndex
	        }); // multiDragElements will already be sorted if folding

	        var newIndex;

	        if (folding && multiDragElement !== dragEl$1) {
	          newIndex = -1;
	        } else if (folding) {
	          newIndex = index(multiDragElement, ':not(.' + _this3.options.selectedClass + ')');
	        } else {
	          newIndex = index(multiDragElement);
	        }

	        newIndicies.push({
	          multiDragElement: multiDragElement,
	          index: newIndex
	        });
	      });
	      return {
	        items: _toConsumableArray(multiDragElements),
	        clones: [].concat(multiDragClones),
	        oldIndicies: oldIndicies,
	        newIndicies: newIndicies
	      };
	    },
	    optionListeners: {
	      multiDragKey: function multiDragKey(key) {
	        key = key.toLowerCase();

	        if (key === 'ctrl') {
	          key = 'Control';
	        } else if (key.length > 1) {
	          key = key.charAt(0).toUpperCase() + key.substr(1);
	        }

	        return key;
	      }
	    }
	  });
	}

	function insertMultiDragElements(clonesInserted, rootEl) {
	  multiDragElements.forEach(function (multiDragElement, i) {
	    var target = rootEl.children[multiDragElement.sortableIndex + (clonesInserted ? Number(i) : 0)];

	    if (target) {
	      rootEl.insertBefore(multiDragElement, target);
	    } else {
	      rootEl.appendChild(multiDragElement);
	    }
	  });
	}
	/**
	 * Insert multi-drag clones
	 * @param  {[Boolean]} elementsInserted  Whether the multi-drag elements are inserted
	 * @param  {HTMLElement} rootEl
	 */


	function insertMultiDragClones(elementsInserted, rootEl) {
	  multiDragClones.forEach(function (clone, i) {
	    var target = rootEl.children[clone.sortableIndex + (elementsInserted ? Number(i) : 0)];

	    if (target) {
	      rootEl.insertBefore(clone, target);
	    } else {
	      rootEl.appendChild(clone);
	    }
	  });
	}

	function removeMultiDragElements() {
	  multiDragElements.forEach(function (multiDragElement) {
	    if (multiDragElement === dragEl$1) return;
	    multiDragElement.parentNode && multiDragElement.parentNode.removeChild(multiDragElement);
	  });
	}

	Sortable.mount(new AutoScrollPlugin());
	Sortable.mount(Remove, Revert);

	/* harmony default export */ __webpack_exports__["default"] = (Sortable);



	/***/ }),

	/***/ "./node_modules/webpack/buildin/global.js":
	/*!***********************************!*\
	  !*** (webpack)/buildin/global.js ***!
	  \***********************************/
	/*! no static exports found */
	/***/ (function(module, exports) {

	var g;

	// This works in non-strict mode
	g = (function() {
		return this;
	})();

	try {
		// This works if eval is allowed (see CSP)
		g = g || new Function("return this")();
	} catch (e) {
		// This works if the window reference is available
		if (typeof window === "object") g = window;
	}

	// g can still be undefined, but nothing to do about it...
	// We return undefined, instead of nothing here, so it's
	// easier to handle this case. if(!global) { ...}

	module.exports = g;


	/***/ }),

	/***/ "./src/actions/action.ts":
	/*!*******************************!*\
	  !*** ./src/actions/action.ts ***!
	  \*******************************/
	/*! exports provided: Action */
	/***/ (function(module, __webpack_exports__, __webpack_require__) {
	__webpack_require__.r(__webpack_exports__);
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Action", function() { return Action; });
	/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../base */ "./src/base.ts");
	/* harmony import */ var _jsonobject__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../jsonobject */ "./src/jsonobject.ts");
	/* harmony import */ var _utils_cssClassBuilder__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../utils/cssClassBuilder */ "./src/utils/cssClassBuilder.ts");
	var __extends = (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};



	var Action = /** @class */ (function (_super) {
	    __extends(Action, _super);
	    function Action(innerItem) {
	        var _this = _super.call(this) || this;
	        _this.innerItem = innerItem;
	        _this.iconSize = 24;
	        //Object.assign(this, item) to support IE11
	        if (!!innerItem) {
	            for (var key in innerItem) {
	                _this[key] = innerItem[key];
	            }
	        }
	        return _this;
	    }
	    Action.prototype.raiseUpdate = function () {
	        this.updateCallback && this.updateCallback();
	    };
	    Object.defineProperty(Action.prototype, "disabled", {
	        get: function () {
	            return this.enabled !== undefined && !this.enabled;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Action.prototype, "hasTitle", {
	        get: function () {
	            return (((this.mode != "small" &&
	                (this.showTitle || this.showTitle === undefined)) ||
	                !this.iconName) &&
	                !!this.title);
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Action.prototype, "isVisible", {
	        get: function () {
	            return this.visible && this.mode !== "popup";
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Action.prototype, "canShrink", {
	        get: function () {
	            return !!this.iconName;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Action.prototype.getActionRootCss = function () {
	        return new _utils_cssClassBuilder__WEBPACK_IMPORTED_MODULE_2__["CssClassBuilder"]()
	            .append("sv-action")
	            .append(this.css)
	            .append("sv-action--hidden", !this.isVisible)
	            .toString();
	    };
	    Action.prototype.getActionBarItemCss = function () {
	        return new _utils_cssClassBuilder__WEBPACK_IMPORTED_MODULE_2__["CssClassBuilder"]()
	            .append("sv-action-bar-item__title")
	            .append("sv-action-bar-item__title--with-icon", !!this.iconName)
	            .toString();
	    };
	    Action.prototype.getActionBarItemActiveCss = function () {
	        return new _utils_cssClassBuilder__WEBPACK_IMPORTED_MODULE_2__["CssClassBuilder"]()
	            .append("sv-action-bar-item")
	            .append("sv-action-bar-item--active", !!this.active)
	            .append(this.innerCss)
	            .toString();
	    };
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "id", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "iconName", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "iconSize", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])({
	            defaultValue: true, onSet: function (_, target) {
	                target.raiseUpdate();
	            }
	        })
	    ], Action.prototype, "visible", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "title", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "tooltip", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "enabled", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "showTitle", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "action", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "css", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "innerCss", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "data", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "popupModel", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "needSeparator", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "active", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "template", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "component", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "items", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "visibleIndex", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])({ defaultValue: "large" })
	    ], Action.prototype, "mode", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "disableTabStop", void 0);
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_1__["property"])()
	    ], Action.prototype, "disableShrink", void 0);
	    return Action;
	}(_base__WEBPACK_IMPORTED_MODULE_0__["Base"]));



	/***/ }),

	/***/ "./src/actions/adaptive-container.ts":
	/*!*******************************************!*\
	  !*** ./src/actions/adaptive-container.ts ***!
	  \*******************************************/
	/*! exports provided: AdaptiveActionContainer */
	/***/ (function(module, __webpack_exports__, __webpack_require__) {
	__webpack_require__.r(__webpack_exports__);
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "AdaptiveActionContainer", function() { return AdaptiveActionContainer; });
	/* harmony import */ var _utils_responsivity_manager__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../utils/responsivity-manager */ "./src/utils/responsivity-manager.ts");
	/* harmony import */ var _list__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../list */ "./src/list.ts");
	/* harmony import */ var _popup__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../popup */ "./src/popup.ts");
	/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./action */ "./src/actions/action.ts");
	/* harmony import */ var _container__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./container */ "./src/actions/container.ts");
	var __extends = (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();





	var AdaptiveActionContainer = /** @class */ (function (_super) {
	    __extends(AdaptiveActionContainer, _super);
	    function AdaptiveActionContainer() {
	        var _this = _super.call(this) || this;
	        _this.minVisibleItemsCount = 0;
	        _this.invisibleItemsListModel = new _list__WEBPACK_IMPORTED_MODULE_1__["ListModel"]([], function (item) {
	            _this.invisibleItemSelected(item);
	            _this.dotsItemPopupModel.toggleVisibility();
	        }, false);
	        _this.dotsItemPopupModel = new _popup__WEBPACK_IMPORTED_MODULE_2__["PopupModel"]("sv-list", {
	            model: _this.invisibleItemsListModel
	        });
	        _this.dotsItem = new _action__WEBPACK_IMPORTED_MODULE_3__["Action"]({
	            id: "dotsItem-id",
	            component: "sv-action-bar-item-dropdown",
	            css: "sv-dots",
	            innerCss: "sv-dots__item",
	            iconName: "icon-dots",
	            visible: false,
	            action: function (item) {
	                _this.dotsItemPopupModel.toggleVisibility();
	            },
	            popupModel: _this.dotsItemPopupModel
	        });
	        return _this;
	    }
	    AdaptiveActionContainer.prototype.invisibleItemSelected = function (item) {
	        if (!!item && typeof item.action === "function") {
	            item.action();
	        }
	    };
	    AdaptiveActionContainer.prototype.hideItemsGreaterN = function (visibleItemsCount) {
	        visibleItemsCount = Math.max(visibleItemsCount, this.minVisibleItemsCount);
	        var invisibleItems = [];
	        this.visibleActions.forEach(function (item) {
	            if (visibleItemsCount <= 0) {
	                item.mode = "popup";
	                invisibleItems.push(item.innerItem);
	            }
	            visibleItemsCount--;
	        });
	        this.invisibleItemsListModel.setItems(invisibleItems);
	    };
	    AdaptiveActionContainer.prototype.getVisibleItemsCount = function (availableSize) {
	        var itemsSizes = this.visibleActions.map(function (item) { return item.minDimension; });
	        var currSize = 0;
	        for (var i = 0; i < itemsSizes.length; i++) {
	            currSize += itemsSizes[i];
	            if (currSize > availableSize)
	                return i;
	        }
	        return i;
	    };
	    AdaptiveActionContainer.prototype.updateItemMode = function (availableSize, itemsSize) {
	        var items = this.visibleActions;
	        for (var index = items.length - 1; index >= 0; index--) {
	            if (itemsSize > availableSize && !items[index].disableShrink) {
	                itemsSize -= items[index].maxDimension - items[index].minDimension;
	                items[index].mode = "small";
	            }
	            else {
	                items[index].mode = "large";
	            }
	        }
	    };
	    AdaptiveActionContainer.prototype.onSet = function () {
	        var _this = this;
	        this.actions.forEach(function (action) { return action.updateCallback = function () { return _this.raiseUpdate(false); }; });
	        _super.prototype.onSet.call(this);
	    };
	    AdaptiveActionContainer.prototype.onPush = function (item) {
	        var _this = this;
	        item.updateCallback = function () { return _this.raiseUpdate(false); };
	        _super.prototype.onPush.call(this, item);
	    };
	    AdaptiveActionContainer.prototype.getRenderedActions = function () {
	        return this.actions.concat([this.dotsItem]);
	    };
	    AdaptiveActionContainer.prototype.fit = function (dimension, dotsItemSize) {
	        if (dimension <= 0)
	            return;
	        this.dotsItem.visible = false;
	        var minSize = 0;
	        var maxSize = 0;
	        var items = this.visibleActions;
	        items.forEach(function (item) {
	            minSize += item.minDimension;
	            maxSize += item.maxDimension;
	        });
	        if (dimension >= maxSize) {
	            items.forEach(function (item) { return (item.mode = "large"); });
	        }
	        else if (dimension < minSize) {
	            items.forEach(function (item) { return (item.mode = "small"); });
	            this.hideItemsGreaterN(this.getVisibleItemsCount(dimension - dotsItemSize));
	            this.dotsItem.visible = true;
	        }
	        else {
	            this.updateItemMode(dimension, maxSize);
	        }
	    };
	    AdaptiveActionContainer.prototype.initResponsivityManager = function (container) {
	        this.responsivityManager = new _utils_responsivity_manager__WEBPACK_IMPORTED_MODULE_0__["ResponsivityManager"](container, this, ".sv-action:not(.sv-dots)>.sv-action__content");
	    };
	    AdaptiveActionContainer.prototype.resetResponsivityManager = function () {
	        if (!!this.responsivityManager) {
	            this.responsivityManager.dispose();
	            this.responsivityManager = undefined;
	        }
	    };
	    AdaptiveActionContainer.prototype.dispose = function () {
	        _super.prototype.dispose.call(this);
	        this.resetResponsivityManager();
	    };
	    return AdaptiveActionContainer;
	}(_container__WEBPACK_IMPORTED_MODULE_4__["ActionContainer"]));



	/***/ }),

	/***/ "./src/actions/container.ts":
	/*!**********************************!*\
	  !*** ./src/actions/container.ts ***!
	  \**********************************/
	/*! exports provided: ActionContainer */
	/***/ (function(module, __webpack_exports__, __webpack_require__) {
	__webpack_require__.r(__webpack_exports__);
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ActionContainer", function() { return ActionContainer; });
	/* harmony import */ var _jsonobject__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../jsonobject */ "./src/jsonobject.ts");
	/* harmony import */ var _base__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../base */ "./src/base.ts");
	/* harmony import */ var _action__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./action */ "./src/actions/action.ts");
	var __extends = (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __decorate = function (decorators, target, key, desc) {
	    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
	    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
	    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
	    return c > 3 && r && Object.defineProperty(target, key, r), r;
	};



	var ActionContainer = /** @class */ (function (_super) {
	    __extends(ActionContainer, _super);
	    function ActionContainer() {
	        return _super !== null && _super.apply(this, arguments) || this;
	    }
	    ActionContainer.prototype.getRenderedActions = function () {
	        return this.actions;
	    };
	    ActionContainer.prototype.raiseUpdate = function (isResetInitialized) {
	        this.updateCallback && this.updateCallback(isResetInitialized);
	    };
	    ActionContainer.prototype.onSet = function () {
	        this.raiseUpdate(true);
	    };
	    ActionContainer.prototype.onPush = function (item) {
	        this.raiseUpdate(true);
	    };
	    ActionContainer.prototype.onRemove = function (item) {
	        this.raiseUpdate(true);
	    };
	    Object.defineProperty(ActionContainer.prototype, "hasActions", {
	        get: function () {
	            return (this.actions || []).length > 0;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(ActionContainer.prototype, "renderedActions", {
	        get: function () {
	            return this.getRenderedActions();
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(ActionContainer.prototype, "visibleActions", {
	        get: function () {
	            return this.actions.filter(function (action) { return action.visible !== false; });
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(ActionContainer.prototype, "css", {
	        get: function () {
	            return "sv-action-bar" + (!!this.containerCss ? " " + this.containerCss : "");
	        },
	        enumerable: false,
	        configurable: true
	    });
	    ActionContainer.prototype.sortItems = function (items) {
	        return []
	            .concat(items.filter(function (item) { return item.visibleIndex >= 0 || item.visibleIndex === undefined; }))
	            .sort(function (firstItem, secondItem) {
	            return firstItem.visibleIndex - secondItem.visibleIndex;
	        });
	    };
	    ActionContainer.prototype.setItems = function (items, sortByVisibleIndex) {
	        if (sortByVisibleIndex === void 0) { sortByVisibleIndex = true; }
	        var actions = items.map(function (item) { return (item instanceof _action__WEBPACK_IMPORTED_MODULE_2__["Action"] ? item : new _action__WEBPACK_IMPORTED_MODULE_2__["Action"](item)); });
	        if (sortByVisibleIndex) {
	            this.actions = this.sortItems(actions);
	        }
	        else {
	            this.actions = actions;
	        }
	    };
	    ActionContainer.prototype.initResponsivityManager = function (container) {
	        return;
	    };
	    ActionContainer.prototype.resetResponsivityManager = function () { };
	    __decorate([
	        Object(_jsonobject__WEBPACK_IMPORTED_MODULE_0__["propertyArray"])({
	            onSet: function (_, target) {
	                target.onSet();
	            },
	            onPush: function (item, i, target) {
	                target.onPush(item);
	            },
	            onRemove: function (item, i, target) {
	                target.onRemove(item);
	            }
	        })
	    ], ActionContainer.prototype, "actions", void 0);
	    return ActionContainer;
	}(_base__WEBPACK_IMPORTED_MODULE_1__["Base"]));



	/***/ }),

	/***/ "./src/base.ts":
	/*!*********************!*\
	  !*** ./src/base.ts ***!
	  \*********************/
	/*! exports provided: Bindings, Dependencies, ComputedUpdater, Base, ArrayChanges, Event, EventBase */
	/***/ (function(module, __webpack_exports__, __webpack_require__) {
	__webpack_require__.r(__webpack_exports__);
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Bindings", function() { return Bindings; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Dependencies", function() { return Dependencies; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ComputedUpdater", function() { return ComputedUpdater; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Base", function() { return Base; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ArrayChanges", function() { return ArrayChanges; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Event", function() { return Event; });
	/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "EventBase", function() { return EventBase; });
	/* harmony import */ var _localizablestring__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./localizablestring */ "./src/localizablestring.ts");
	/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./helpers */ "./src/helpers.ts");
	/* harmony import */ var _jsonobject__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./jsonobject */ "./src/jsonobject.ts");
	/* harmony import */ var _settings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./settings */ "./src/settings.ts");
	var __extends = (function () {
	    var extendStatics = function (d, b) {
	        extendStatics = Object.setPrototypeOf ||
	            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
	            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
	        return extendStatics(d, b);
	    };
	    return function (d, b) {
	        if (typeof b !== "function" && b !== null)
	            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
	        extendStatics(d, b);
	        function __() { this.constructor = d; }
	        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
	    };
	})();
	var __spreadArray = function (to, from, pack) {
	    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
	        if (ar || !(i in from)) {
	            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
	            ar[i] = from[i];
	        }
	    }
	    return to.concat(ar || Array.prototype.slice.call(from));
	};




	var Bindings = /** @class */ (function () {
	    function Bindings(obj) {
	        this.obj = obj;
	        this.properties = null;
	        this.values = null;
	    }
	    Bindings.prototype.getType = function () {
	        return "bindings";
	    };
	    Bindings.prototype.getNames = function () {
	        var res = [];
	        this.fillProperties();
	        for (var i = 0; i < this.properties.length; i++) {
	            if (this.properties[i].isVisible("", this.obj)) {
	                res.push(this.properties[i].name);
	            }
	        }
	        return res;
	    };
	    Bindings.prototype.getProperties = function () {
	        var res = [];
	        this.fillProperties();
	        for (var i = 0; i < this.properties.length; i++) {
	            res.push(this.properties[i]);
	        }
	        return res;
	    };
	    Bindings.prototype.setBinding = function (propertyName, valueName) {
	        if (!this.values)
	            this.values = {};
	        if (!!valueName) {
	            this.values[propertyName] = valueName;
	        }
	        else {
	            delete this.values[propertyName];
	            if (Object.keys(this.values).length == 0) {
	                this.values = null;
	            }
	        }
	    };
	    Bindings.prototype.clearBinding = function (propertyName) {
	        this.setBinding(propertyName, "");
	    };
	    Bindings.prototype.isEmpty = function () {
	        return !this.values;
	    };
	    Bindings.prototype.getValueNameByPropertyName = function (propertyName) {
	        if (!this.values)
	            return undefined;
	        return this.values[propertyName];
	    };
	    Bindings.prototype.getPropertiesByValueName = function (valueName) {
	        if (!this.values)
	            return [];
	        var res = [];
	        for (var key in this.values) {
	            if (this.values[key] == valueName) {
	                res.push(key);
	            }
	        }
	        return res;
	    };
	    Bindings.prototype.getJson = function () {
	        if (this.isEmpty())
	            return null;
	        var res = {};
	        for (var key in this.values) {
	            res[key] = this.values[key];
	        }
	        return res;
	    };
	    Bindings.prototype.setJson = function (value) {
	        this.values = null;
	        if (!value)
	            return;
	        this.values = {};
	        for (var key in value) {
	            this.values[key] = value[key];
	        }
	    };
	    Bindings.prototype.fillProperties = function () {
	        if (this.properties !== null)
	            return;
	        this.properties = [];
	        var objProperties = _jsonobject__WEBPACK_IMPORTED_MODULE_2__["Serializer"].getPropertiesByObj(this.obj);
	        for (var i = 0; i < objProperties.length; i++) {
	            if (objProperties[i].isBindable) {
	                this.properties.push(objProperties[i]);
	            }
	        }
	    };
	    return Bindings;
	}());

	var Dependencies = /** @class */ (function () {
	    function Dependencies(currentDependency, target, property) {
	        this.currentDependency = currentDependency;
	        this.target = target;
	        this.property = property;
	        this.dependencies = [];
	        this.id = "" + (++Dependencies.DependenciesCount);
	    }
	    Dependencies.prototype.addDependency = function (target, property) {
	        if (this.target === target && this.property === property)
	            return;
	        if (this.dependencies.some(function (dependency) { return dependency.obj === target && dependency.prop === property; }))
	            return;
	        this.dependencies.push({
	            obj: target,
	            prop: property,
	            id: this.id
	        });
	        target.registerFunctionOnPropertiesValueChanged([property], this.currentDependency, this.id);
	    };
	    Dependencies.prototype.dispose = function () {
	        this.dependencies.forEach(function (dependency) {
	            dependency.obj.unRegisterFunctionOnPropertiesValueChanged([dependency.prop], dependency.id);
	        });
	    };
	    Dependencies.DependenciesCount = 0;
	    return Dependencies;
	}());

	var ComputedUpdater = /** @class */ (function () {
	    function ComputedUpdater(_updater) {
	        this._updater = _updater;
	        this.dependencies = undefined;
	        this.type = ComputedUpdater.ComputedUpdaterType;
	    }
	    Object.defineProperty(ComputedUpdater.prototype, "updater", {
	        get: function () {
	            return this._updater;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    ComputedUpdater.prototype.setDependencies = function (dependencies) {
	        this.clearDependencies();
	        this.dependencies = dependencies;
	    };
	    ComputedUpdater.prototype.getDependencies = function () {
	        return this.dependencies;
	    };
	    ComputedUpdater.prototype.clearDependencies = function () {
	        if (this.dependencies) {
	            this.dependencies.dispose();
	            this.dependencies = undefined;
	        }
	    };
	    ComputedUpdater.prototype.dispose = function () {
	        this.clearDependencies();
	    };
	    ComputedUpdater.ComputedUpdaterType = "__dependency_computed";
	    return ComputedUpdater;
	}());

	/**
	 * The base class for SurveyJS objects.
	 */
	var Base = /** @class */ (function () {
	    function Base() {
	        this.propertyHash = {};
	        this.eventList = [];
	        this.isLoadingFromJsonValue = false;
	        this.loadingOwner = null;
	        /**
	         * Event that raise on property change of the sender object
	         * sender - the object that owns the property
	         * options.name - the property name that has been changed
	         * options.oldValue - old value. Please note, it equals to options.newValue if property is an array
	         * options.newValue - new value.
	         */
	        this.onPropertyChanged = this.addEvent();
	        /**
	         * Event that raised on changing property of the ItemValue object.
	         * sender - the object that owns the property
	         * options.propertyName - the property name to which ItemValue array is belong. It can be "choices" for dropdown question
	         * options.obj - the instance of ItemValue object which property has been changed
	         * options.name - the property of ItemObject that has been changed
	         * options.oldValue - old value
	         * options.newValue - new value
	         */
	        this.onItemValuePropertyChanged = this.addEvent();
	        this.isCreating = true;
	        this.bindingsValue = new Bindings(this);
	        _jsonobject__WEBPACK_IMPORTED_MODULE_2__["CustomPropertiesCollection"].createProperties(this);
	        this.onBaseCreating();
	        this.isCreating = false;
	    }
	    Base.finishCollectDependencies = function () {
	        var deps = Base.currentDependencis;
	        Base.currentDependencis = undefined;
	        return deps;
	    };
	    Base.startCollectDependencies = function (updater, target, property) {
	        if (Base.currentDependencis !== undefined) {
	            throw new Error("Attempt to collect nested dependencies. Nested dependencies are not supported.");
	        }
	        Base.currentDependencis = new Dependencies(updater, target, property);
	    };
	    Base.collectDependency = function (target, property) {
	        if (Base.currentDependencis === undefined)
	            return;
	        Base.currentDependencis.addDependency(target, property);
	    };
	    Object.defineProperty(Base, "commentPrefix", {
	        get: function () {
	            return _settings__WEBPACK_IMPORTED_MODULE_3__["settings"].commentPrefix;
	        },
	        set: function (val) {
	            _settings__WEBPACK_IMPORTED_MODULE_3__["settings"].commentPrefix = val;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    /**
	     * Returns true if a value undefined, null, empty string or empty array.
	     *
	     * @param value
	     * @param trimString a boolean parameter, default value true. If true then it trims the string and functions returns true for a string that contains white spaces only.
	     */
	    Base.prototype.isValueEmpty = function (value, trimString) {
	        if (trimString === void 0) { trimString = true; }
	        if (trimString) {
	            value = this.trimValue(value);
	        }
	        return _helpers__WEBPACK_IMPORTED_MODULE_1__["Helpers"].isValueEmpty(value);
	    };
	    Base.prototype.trimValue = function (value) {
	        if (!!value && (typeof value === "string" || value instanceof String))
	            return value.trim();
	        return value;
	    };
	    Base.prototype.IsPropertyEmpty = function (value) {
	        return value !== "" && this.isValueEmpty(value);
	    };
	    Base.prototype.dispose = function () {
	        for (var i = 0; i < this.eventList.length; i++) {
	            this.eventList[i].clear();
	        }
	        this.onPropertyValueChangedCallback = undefined;
	        this.isDisposedValue = true;
	    };
	    Object.defineProperty(Base.prototype, "isDisposed", {
	        get: function () {
	            return this.isDisposedValue === true;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Base.prototype.addEvent = function () {
	        var res = new EventBase();
	        this.eventList.push(res);
	        return res;
	    };
	    Base.prototype.onBaseCreating = function () { };
	    /**
	     * Returns the type of the object as a string as it represents in the json. It should be in lowcase.
	     */
	    Base.prototype.getType = function () {
	        return "base";
	    };
	    Base.prototype.getSurvey = function (isLive) {
	        return null;
	    };
	    Object.defineProperty(Base.prototype, "inSurvey", {
	        /**
	         * Returns true if the object is inluded into survey, otherwise returns false.
	         */
	        get: function () {
	            return !!this.getSurvey(true);
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Object.defineProperty(Base.prototype, "bindings", {
	        get: function () {
	            return this.bindingsValue;
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Base.prototype.checkBindings = function (valueName, value) { };
	    Base.prototype.updateBindings = function (propertyName, value) {
	        var valueName = this.bindings.getValueNameByPropertyName(propertyName);
	        if (!!valueName) {
	            this.updateBindingValue(valueName, value);
	        }
	    };
	    Base.prototype.updateBindingValue = function (valueName, value) { };
	    /**
	     * Returns the element template name without prefix. Typically it equals to getType().
	     * @see getType
	     */
	    Base.prototype.getTemplate = function () {
	        return this.getType();
	    };
	    Object.defineProperty(Base.prototype, "isLoadingFromJson", {
	        /**
	         * Returns true if the object is loading from Json at the current moment.
	         */
	        get: function () {
	            return this.isLoadingFromJsonValue || this.getIsLoadingFromJson();
	        },
	        enumerable: false,
	        configurable: true
	    });
	    Base.prototype.getIsLoadingFromJson = function () {
	        if (!!this.loadingOwner && this.loadingOwner.isLoadingFromJson)
	            return true;
	        return this.isLoadingFromJsonValue;
	    };
	    Base.prototype.startLoadingFromJson = function () {
	        this.isLoadingFromJsonValue = true;
	    };
	    Base.prototype.endLoadingFromJson = function () {
	        this.isLoadingFromJsonValue = false;
	    };
	    /**
	     * Deserialized the current object into JSON
	     * @see fromJSON
	     */
	    Base.prototype.toJSON = function () {
	        return new _jsonobject__WEBPACK_IMPORTED_MODULE_2__["JsonObject"]().toJsonObject(this);
	    };
	    /**
	     * Load object properties and elements. It doesn't reset properties that was changed before and they are not defined in the json parameter.
	     * @param json the object JSON definition
	     * @see toJSON
	     */
	    Base.prototype.fromJSON = function (json) {
	        new _jsonobject__WEBPACK_IMPORTED_MODULE_2__["JsonObject"]().toObject(json, this);
	        this.onSurveyLoad();
	    };
	    Base.prototype.onSurveyLoad = function () { };
	    /**
	     * Make a clone of the existing object. Create a new object of the same type and load all properties into it.
	     */
	    Base.prototype.clone = function () {
	        var clonedObj = _jsonobject__WEBPACK_IMPORTED_MODULE_2__["Serializer"].createClass(this.getType());
	        clonedObj.fromJSON(this.toJSON());
	        return clonedObj;
	    };
	    /**
	     * Returns the serializable property that belongs to this instance by property name. It returns null if the property is not exists.
	     * @param propName property name
	     * @returns
	     */
	    Base.prototype.getPropertyByName = function (propName) {
	        return _jsonobject__WEBPACK_IMPORTED_MODULE_2__["Serializer"].findProperty(this.getType(), propName);
	    };
	    Base.prototype.isPropertyVisible = function (propName) {
	        var prop = this.getPropertyByName(propN