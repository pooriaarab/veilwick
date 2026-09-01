"use strict";(()=>{var z,h,fe,$e,A,ae,pe,de,G,L,N,he,X,Q,Y,Fe,O={},$=[],ze=/acit|ex(?:s|g|n|p|$)|rph|grid|ows|mnc|ntw|ine[ch]|zoo|^ord|itera/i,B=Array.isArray;function T(t,e){for(var n in e)t[n]=e[n];return t}function Z(t){t&&t.parentNode&&t.parentNode.removeChild(t)}function Be(t,e,n){var o,_,r,s={};for(r in e)r=="key"?o=e[r]:r=="ref"?_=e[r]:s[r]=e[r];if(arguments.length>2&&(s.children=arguments.length>3?z.call(arguments,2):n),typeof t=="function"&&t.defaultProps!=null)for(r in t.defaultProps)s[r]===void 0&&(s[r]=t.defaultProps[r]);return R(t,s,o,_,null)}function R(t,e,n,o,_){var r={type:t,props:e,key:n,ref:o,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:_??++fe,__i:-1,__u:0};return _==null&&h.vnode!=null&&h.vnode(r),r}function H(t){return t.children}function j(t,e){this.props=t,this.context=e}function M(t,e){if(e==null)return t.__?M(t.__,t.__i+1):null;for(var n;e<t.__k.length;e++)if((n=t.__k[e])!=null&&n.__e!=null)return n.__e;return typeof t.type=="function"?M(t):null}function Ke(t){if(t.__P&&t.__d){var e=t.__v,n=e.__e,o=[],_=[],r=T({},e);r.__v=e.__v+1,h.vnode&&h.vnode(r),ee(t.__P,r,e,t.__n,t.__P.namespaceURI,32&e.__u?[n]:null,o,n??M(e),!!(32&e.__u),_),r.__v=e.__v,r.__.__k[r.__i]=r,be(o,r,_),e.__e=e.__=null,r.__e!=n&&me(r)}}function me(t){if((t=t.__)!=null&&t.__c!=null)return t.__e=t.__c.base=null,t.__k.some(function(e){if(e!=null&&e.__e!=null)return t.__e=t.__c.base=e.__e}),me(t)}function le(t){(!t.__d&&(t.__d=!0)&&A.push(t)&&!F.__r++||ae!=h.debounceRendering)&&((ae=h.debounceRendering)||pe)(F)}function F(){try{for(var t,e=1;A.length;)A.length>e&&A.sort(de),t=A.shift(),e=A.length,Ke(t)}finally{A.length=F.__r=0}}function ve(t,e,n,o,_,r,s,l,u,a,f){var g,i,c,y,m,v,d,p=o&&o.__k||$,w=e.length;for(u=qe(n,e,p,u,w),g=0;g<w;g++)(c=n.__k[g])!=null&&(i=c.__i!=-1&&p[c.__i]||O,c.__i=g,v=ee(t,c,i,_,r,s,l,u,a,f),y=c.__e,c.ref&&i.ref!=c.ref&&(i.ref&&te(i.ref,null,c),f.push(c.ref,c.__c||y,c)),m==null&&y!=null&&(m=y),(d=!!(4&c.__u))||i.__k===c.__k?(u=ge(c,u,t,d),d&&i.__e&&(i.__e=null)):typeof c.type=="function"&&v!==void 0?u=v:y&&(u=y.nextSibling),c.__u&=-7);return n.__e=m,u}function qe(t,e,n,o,_){var r,s,l,u,a,f=n.length,g=f,i=0;for(t.__k=new Array(_),r=0;r<_;r++)(s=e[r])!=null&&typeof s!="boolean"&&typeof s!="function"?(typeof s=="string"||typeof s=="number"||typeof s=="bigint"||s.constructor==String?s=t.__k[r]=R(null,s,null,null,null):B(s)?s=t.__k[r]=R(H,{children:s},null,null,null):s.constructor===void 0&&s.__b>0?s=t.__k[r]=R(s.type,s.props,s.key,s.ref?s.ref:null,s.__v):t.__k[r]=s,u=r+i,s.__=t,s.__b=t.__b+1,l=null,(a=s.__i=Je(s,n,u,g))!=-1&&(g--,(l=n[a])&&(l.__u|=2)),l==null||l.__v==null?(a==-1&&(_>f?i--:_<f&&i++),typeof s.type!="function"&&(s.__u|=4)):a!=u&&(a==u-1?i--:a==u+1?i++:(a>u?i--:i++,s.__u|=4))):t.__k[r]=null;if(g)for(r=0;r<f;r++)(l=n[r])!=null&&(2&l.__u)==0&&(l.__e==o&&(o=M(l)),we(l,l));return o}function ge(t,e,n,o){var _,r;if(typeof t.type=="function"){for(_=t.__k,r=0;_&&r<_.length;r++)_[r]&&(_[r].__=t,e=ge(_[r],e,n,o));return e}t.__e!=e&&(o&&(e&&t.type&&!e.parentNode&&(e=M(t)),n.insertBefore(t.__e,e||null)),e=t.__e);do e=e&&e.nextSibling;while(e!=null&&e.nodeType==8);return e}function Je(t,e,n,o){var _,r,s,l=t.key,u=t.type,a=e[n],f=a!=null&&(2&a.__u)==0;if(a===null&&l==null||f&&l==a.key&&u==a.type)return n;if(o>(f?1:0)){for(_=n-1,r=n+1;_>=0||r<e.length;)if((a=e[s=_>=0?_--:r++])!=null&&(2&a.__u)==0&&l==a.key&&u==a.type)return s}return-1}function ce(t,e,n){e[0]=="-"?t.setProperty(e,n??""):t[e]=n==null?"":typeof n!="number"||ze.test(e)?n:n+"px"}function W(t,e,n,o,_){var r,s;e:if(e=="style")if(typeof n=="string")t.style.cssText=n;else{if(typeof o=="string"&&(t.style.cssText=o=""),o)for(e in o)n&&e in n||ce(t.style,e,"");if(n)for(e in n)o&&n[e]==o[e]||ce(t.style,e,n[e])}else if(e[0]=="o"&&e[1]=="n")r=e!=(e=e.replace(he,"$1")),s=e.toLowerCase(),e=s in t||e=="onFocusOut"||e=="onFocusIn"?s.slice(2):e.slice(2),t.l||(t.l={}),t.l[e+r]=n,n?o?n[N]=o[N]:(n[N]=X,t.addEventListener(e,r?Y:Q,r)):t.removeEventListener(e,r?Y:Q,r);else{if(_=="http://www.w3.org/2000/svg")e=e.replace(/xlink(H|:h)/,"h").replace(/sName$/,"s");else if(e!="width"&&e!="height"&&e!="href"&&e!="list"&&e!="form"&&e!="tabIndex"&&e!="download"&&e!="rowSpan"&&e!="colSpan"&&e!="role"&&e!="popover"&&e in t)try{t[e]=n??"";break e}catch{}typeof n=="function"||(n==null||n===!1&&e[4]!="-"?t.removeAttribute(e):t.setAttribute(e,e=="popover"&&n==1?"":n))}}function ue(t){return function(e){if(this.l){var n=this.l[e.type+t];if(e[L]==null)e[L]=X++;else if(e[L]<n[N])return;return n(h.event?h.event(e):e)}}}function ee(t,e,n,o,_,r,s,l,u,a){var f,g,i,c,y,m,v,d,p,w,S,C,I,se,V,J,E=e.type;if(e.constructor!==void 0)return null;128&n.__u&&(u=!!(32&n.__u),r=[l=e.__e=n.__e]),(f=h.__b)&&f(e);e:if(typeof E=="function"){g=s.length;try{if(p=e.props,w=E.prototype&&E.prototype.render,S=(f=E.contextType)&&o[f.__c],C=f?S?S.props.value:f.__:o,n.__c?d=(i=e.__c=n.__c).__=i.__E:(w?e.__c=i=new E(p,C):(e.__c=i=new j(p,C),i.constructor=E,i.render=Qe),S&&S.sub(i),i.state||(i.state={}),i.__n=o,c=i.__d=!0,i.__h=[],i._sb=[]),w&&i.__s==null&&(i.__s=i.state),w&&E.getDerivedStateFromProps!=null&&(i.__s==i.state&&(i.__s=T({},i.__s)),T(i.__s,E.getDerivedStateFromProps(p,i.__s))),y=i.props,m=i.state,i.__v=e,c)w&&E.getDerivedStateFromProps==null&&i.componentWillMount!=null&&i.componentWillMount(),w&&i.componentDidMount!=null&&i.__h.push(i.componentDidMount);else{if(w&&E.getDerivedStateFromProps==null&&p!==y&&i.componentWillReceiveProps!=null&&i.componentWillReceiveProps(p,C),e.__v==n.__v||!i.__e&&i.shouldComponentUpdate!=null&&i.shouldComponentUpdate(p,i.__s,C)===!1){e.__v!=n.__v&&(i.props=p,i.state=i.__s,i.__d=!1),e.__e=n.__e,e.__k=n.__k,e.__k.some(function(P){P&&(P.__=e)}),$.push.apply(i.__h,i._sb),i._sb=[],i.__h.length&&s.push(i);break e}i.componentWillUpdate!=null&&i.componentWillUpdate(p,i.__s,C),w&&i.componentDidUpdate!=null&&i.__h.push(function(){i.componentDidUpdate(y,m,v)})}if(i.context=C,i.props=p,i.__P=t,i.__e=!1,I=h.__r,se=0,w)i.state=i.__s,i.__d=!1,I&&I(e),f=i.render(i.props,i.state,i.context),$.push.apply(i.__h,i._sb),i._sb=[];else do i.__d=!1,I&&I(e),f=i.render(i.props,i.state,i.context),i.state=i.__s;while(i.__d&&++se<25);i.state=i.__s,i.getChildContext!=null&&(o=T(T({},o),i.getChildContext())),w&&!c&&i.getSnapshotBeforeUpdate!=null&&(v=i.getSnapshotBeforeUpdate(y,m)),V=f!=null&&f.type===H&&f.key==null?xe(f.props.children):f,l=ve(t,B(V)?V:[V],e,n,o,_,r,s,l,u,a),i.base=e.__e,e.__u&=-161,i.__h.length&&s.push(i),d&&(i.__E=i.__=null)}catch(P){if(s.length=g,e.__v=null,u||r!=null){if(P.then){for(e.__u|=u?160:128;l&&l.nodeType==8&&l.nextSibling;)l=l.nextSibling;r!=null&&(r[r.indexOf(l)]=null),e.__e=l}else if(r!=null)for(J=r.length;J--;)Z(r[J])}else e.__e=n.__e;e.__k==null&&(e.__k=n.__k||[]),P.then||ye(e),h.__e(P,e,n)}}else r==null&&e.__v==n.__v?(e.__k=n.__k,e.__e=n.__e):l=e.__e=Ge(n.__e,e,n,o,_,r,s,u,a);return(f=h.diffed)&&f(e),128&e.__u?void 0:l}function ye(t){t&&(t.__c&&(t.__c.__e=!0),t.__k&&t.__k.some(ye))}function be(t,e,n){for(var o=0;o<n.length;o++)te(n[o],n[++o],n[++o]);h.__c&&h.__c(e,t),t.some(function(_){try{t=_.__h,_.__h=[],t.some(function(r){r.call(_)})}catch(r){h.__e(r,_.__v)}})}function xe(t){return typeof t!="object"||t==null||t.__b>0?t:B(t)?t.map(xe):t.constructor!==void 0?null:T({},t)}function Ge(t,e,n,o,_,r,s,l,u){var a,f,g,i,c,y,m,v=n.props||O,d=e.props,p=e.type;if(p=="svg"?_="http://www.w3.org/2000/svg":p=="math"?_="http://www.w3.org/1998/Math/MathML":_||(_="http://www.w3.org/1999/xhtml"),r!=null){for(a=0;a<r.length;a++)if((c=r[a])&&"setAttribute"in c==!!p&&(p?c.localName==p:c.nodeType==3)){t=c,r[a]=null;break}}if(t==null){if(p==null)return document.createTextNode(d);t=document.createElementNS(_,p,d.is&&d),l&&(h.__m&&h.__m(e,r),l=!1),r=null}if(p==null)v===d||l&&t.data==d||(t.data=d);else{if(r=p=="textarea"&&d.defaultValue!=null?null:r&&z.call(t.childNodes),!l&&r!=null)for(v={},a=0;a<t.attributes.length;a++)v[(c=t.attributes[a]).name]=c.value;for(a in v)c=v[a],a=="dangerouslySetInnerHTML"?g=c:a=="children"||a in d||a=="value"&&"defaultValue"in d||a=="checked"&&"defaultChecked"in d||W(t,a,null,c,_);for(a in d)c=d[a],a=="children"?i=c:a=="dangerouslySetInnerHTML"?f=c:a=="value"?y=c:a=="checked"?m=c:l&&typeof c!="function"||v[a]===c||W(t,a,c,v[a],_);if(f)l||g&&(f.__html==g.__html||f.__html==t.innerHTML)||(t.innerHTML=f.__html),e.__k=[];else if(g&&(t.innerHTML=""),ve(e.type=="template"?t.content:t,B(i)?i:[i],e,n,o,p=="foreignObject"?"http://www.w3.org/1999/xhtml":_,r,s,r?r[0]:n.__k&&M(n,0),l,u),r!=null)for(a=r.length;a--;)Z(r[a]);l&&p!="textarea"||(a="value",p=="progress"&&y==null?t.removeAttribute("value"):y!=null&&(y!==t[a]||p=="progress"&&!y||p=="option"&&y!=v[a])&&W(t,a,y,v[a],_),a="checked",m!=null&&m!=t[a]&&W(t,a,m,v[a],_))}return t}function te(t,e,n){try{if(typeof t=="function"){var o=typeof t.__u=="function";o&&t.__u(),o&&e==null||(t.__u=t(e))}else t.current=e}catch(_){h.__e(_,n)}}function we(t,e,n){var o,_;if(h.unmount&&h.unmount(t),(o=t.ref)&&(o.current&&o.current!=t.__e||te(o,null,e)),(o=t.__c)!=null){if(o.componentWillUnmount)try{o.componentWillUnmount()}catch(r){h.__e(r,e)}o.base=o.__P=o.__n=null}if(o=t.__k)for(_=0;_<o.length;_++)o[_]&&we(o[_],e,n||typeof t.type!="function");n||Z(t.__e),t.__c=t.__=t.__e=void 0}function Qe(t,e,n){return this.constructor(t,n)}function ke(t,e,n){var o,_,r,s;e==document&&(e=document.documentElement),h.__&&h.__(t,e),_=(o=typeof n=="function")?null:n&&n.__k||e.__k,r=[],s=[],ee(e,t=(!o&&n||e).__k=Be(H,null,[t]),_||O,O,e.namespaceURI,!o&&n?[n]:_?null:e.firstChild?z.call(e.childNodes):null,r,!o&&n?n:_?_.__e:e.firstChild,o,s),be(r,t,s),t.props.children=null}z=$.slice,h={__e:function(t,e,n,o){for(var _,r,s;e=e.__;)if((_=e.__c)&&!_.__)try{if((r=_.constructor)&&r.getDerivedStateFromError!=null&&(_.setState(r.getDerivedStateFromError(t)),s=_.__d),_.componentDidCatch!=null&&(_.componentDidCatch(t,o||{}),s=_.__d),s)return _.__E=_}catch(l){t=l}throw t}},fe=0,$e=function(t){return t!=null&&t.constructor===void 0},j.prototype.setState=function(t,e){var n;n=this.__s!=null&&this.__s!=this.state?this.__s:this.__s=T({},this.state),typeof t=="function"&&(t=t(T({},n),this.props)),t&&T(n,t),t!=null&&this.__v&&(e&&this._sb.push(e),le(this))},j.prototype.forceUpdate=function(t){this.__v&&(this.__e=!0,t&&this.__h.push(t),le(this))},j.prototype.render=H,A=[],pe=typeof Promise=="function"?Promise.prototype.then.bind(Promise.resolve()):setTimeout,de=function(t,e){return t.__v.__b-e.__v.__b},F.__r=0,G=Math.random().toString(8),L="__d"+G,N="__a"+G,he=/(PointerCapture)$|Capture$/i,X=0,Q=ue(!1),Y=ue(!0),Fe=0;var re,b,ne,Ce,oe=0,He=[],x=h,Se=x.__b,Ee=x.__r,Te=x.diffed,Ie=x.__c,Ae=x.unmount,Pe=x.__;function Ye(t,e){x.__h&&x.__h(b,t,oe||e),oe=0;var n=b.__H||(b.__H={__:[],__h:[]});return t>=n.__.length&&n.__.push({}),n.__[t]}function U(t){return oe=1,Xe(Ue,t)}function Xe(t,e,n){var o=Ye(re++,2);if(o.t=t,!o.__c&&(o.__=[n?n(e):Ue(void 0,e),function(l){var u=o.__N?o.__N[0]:o.__[0],a=o.t(u,l);u!==a&&(o.__N=[a,o.__[1]],o.__c.setState({}))}],o.__c=b,!b.__f)){var _=function(l,u,a){if(!o.__c.__H)return!0;var f=!1,g=o.__c.props!==l;if(o.__c.__H.__.some(function(c){if(c.__N){f=!0;var y=c.__[0];c.__=c.__N,c.__N=void 0,y!==c.__[0]&&(g=!0)}}),r){var i=r.call(this,l,u,a);return f?i||g:i}return!f||g};b.__f=!0;var r=b.shouldComponentUpdate,s=b.componentWillUpdate;b.componentWillUpdate=function(l,u,a){if(this.__e){var f=r;r=void 0,_(l,u,a),r=f}s&&s.call(this,l,u,a)},b.shouldComponentUpdate=_}return o.__N||o.__}function Ze(){for(var t;t=He.shift();){var e=t.__H;if(t.__P&&e)try{e.__h.some(K),e.__h.some(ie),e.__h=[]}catch(n){e.__h=[],x.__e(n,t.__v)}}}x.__b=function(t){b=null,Se&&Se(t)},x.__=function(t,e){t&&e.__k&&e.__k.__m&&(t.__m=e.__k.__m),Pe&&Pe(t,e)},x.__r=function(t){Ee&&Ee(t),re=0;var e=(b=t.__c).__H;e&&(ne===b?(e.__h=[],b.__h=[],e.__.some(function(n){n.__N&&(n.__=n.__N),n.u=n.__N=void 0})):(e.__h.some(K),e.__h.some(ie),e.__h=[],re=0)),ne=b},x.diffed=function(t){Te&&Te(t);var e=t.__c;e&&e.__H&&(e.__H.__h.length&&(He.push(e)!==1&&Ce===x.requestAnimationFrame||((Ce=x.requestAnimationFrame)||et)(Ze)),e.__H.__.some(function(n){n.u&&(n.__H=n.u,n.u=void 0)})),ne=b=null},x.__c=function(t,e){e.some(function(n){try{n.__h.some(K),n.__h=n.__h.filter(function(o){return!o.__||ie(o)})}catch(o){e.some(function(_){_.__h&&(_.__h=[])}),e=[],x.__e(o,n.__v)}}),Ie&&Ie(t,e)},x.unmount=function(t){Ae&&Ae(t);var e,n=t.__c;n&&n.__H&&(n.__H.__.some(function(o){try{K(o)}catch(_){e=_}}),n.__H=void 0,e&&x.__e(e,n.__v))};var Me=typeof requestAnimationFrame=="function";function et(t){var e,n=function(){clearTimeout(o),Me&&cancelAnimationFrame(e),setTimeout(t)},o=setTimeout(n,35);Me&&(e=requestAnimationFrame(n))}function K(t){var e=b,n=t.__c;typeof n=="function"&&(t.__c=void 0,n()),b=e}function ie(t){var e=b;t.__c=t.__(),b=e}function Ue(t,e){return typeof e=="function"?e(t):e}function De(t){if(!t.trim())return null;let e="message",n=[];for(let o of t.split(/\r?\n/)){let _=o.trimEnd();if(!_||_.startsWith(":"))continue;let r=_.indexOf(":");if(r===-1)continue;let s=_.slice(0,r),l=_.slice(r+1).replace(/^ /,"");s==="event"?e=l:s==="data"&&n.push(l)}return n.length===0?null:{event:e,data:n.join(`
`)}}async function*Ne(t){let e=t.getReader(),n=new TextDecoder,o="";try{for(;;){let{done:_,value:r}=await e.read();if(_){if(o.trim()){let s=De(o);s&&(yield s)}return}for(o+=n.decode(r,{stream:!0});;){let s=o.search(/\r?\n\r?\n/);if(s===-1)break;let l=o.slice(0,s),u=o.slice(s).match(/^\r?\n\r?\n/),a=u?u[0].length:2;o=o.slice(s+a);let f=De(l);f&&(yield f)}}}finally{e.releaseLock()}}var D=class extends Error{constructor(e,n){super(n.title),this.status=e,this.envelope=n}};async function _e(t){let e={code:"VISITOR_REQUEST_FAILED",title:"We couldn't reach the chat server",detail:"Your message wasn't sent. The server may be temporarily unavailable.",action:"Try again in a moment."};try{let n=await t.json();n.error&&(e=n.error)}catch{}return new D(t.status,e)}async function Ve(t){let e=await fetch(`${t.apiBase}/api/v1/public/threads`,{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify({agentId:t.agentId,publicKey:t.publicKey})});if(!e.ok)throw await _e(e);return e.json()}async function We(t,e,n,o=null){let _=await fetch(`${t.apiBase}/api/v1/public/threads/${encodeURIComponent(e)}/messages`,{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify({content:n,publicKey:t.publicKey,captchaToken:o})});if(!_.ok)throw await _e(_);return _.json()}async function*Le(t,e){let n=await fetch(`${t.apiBase}/api/v1/public/threads/${encodeURIComponent(e)}/stream`,{method:"POST",credentials:"include",headers:{"content-type":"application/json"},body:JSON.stringify({publicKey:t.publicKey})});if(!n.ok)throw await _e(n);if(!n.body)throw new D(500,{code:"VISITOR_STREAM_EMPTY",title:"We didn't get a reply",detail:"The server didn't return a streamable response.",action:"Try sending another message."});yield*Ne(n.body)}var tt=0;function k(t,e,n,o,_,r){e||(e={});var s,l,u=e;if("ref"in u)for(l in u={},e)l=="ref"?s=e[l]:u[l]=e[l];var a={type:t,props:u,key:n,ref:s,__k:null,__:null,__b:0,__e:null,__c:null,constructor:void 0,__v:--tt,__i:-1,__u:0,__source:_,__self:r};if(typeof t=="function"&&(s=t.defaultProps))for(l in s)u[l]===void 0&&(u[l]=s[l]);return h.vnode&&h.vnode(a),a}var nt=1,q=()=>`local_${nt++}`;function Re({config:t}){let[e,n]=U(!1),[o,_]=U(null),[r,s]=U([]),[l,u]=U(""),[a,f]=U(!1),g=async()=>{if(o)return o;let m=await Ve(t);return _(m.id),m.id},i=m=>s(v=>[...v,m]),c=m=>s(v=>{let d=[...v];for(let p=d.length-1;p>=0;p--)if(d[p].role==="assistant"){d[p]={...d[p],content:m};break}return d}),y=async m=>{m.preventDefault();let v=l.trim();if(!(!v||a)){f(!0),u(""),i({id:q(),role:"user",content:v});try{let d=await g();await We(t,d,v);let p=q();i({id:p,role:"assistant",content:""});let w="";for await(let S of Le(t,d)){if(S.event==="done")break;if(S.event==="error"){let C="We didn't get a reply.";try{let I=JSON.parse(S.data);I.detail&&(C=I.detail)}catch{}i({id:q(),role:"error",content:C});break}try{let C=JSON.parse(S.data);C.type==="content_block_delta"&&C.delta?.type==="text_delta"&&typeof C.delta.text=="string"&&(w+=C.delta.text,c(w))}catch{}}}catch(d){let p=d instanceof D?d.envelope:{code:"VISITOR_REQUEST_FAILED",title:"We couldn't send your message",detail:"The chat server didn't respond.",action:"Try again in a moment."},w=`${p.title}. ${p.detail}${p.action?` ${p.action}`:""}`;i({id:q(),role:"error",content:w})}finally{f(!1)}}};return e?k("div",{class:"mt-vw-panel",role:"dialog","aria-label":"Chat",children:[k("div",{class:"mt-vw-header",children:[k("h3",{children:"Chat"}),k("button",{type:"button",class:"mt-vw-close","aria-label":"Close chat",onClick:()=>n(!1),children:"\xD7"})]}),k("div",{class:"mt-vw-messages",children:r.length===0?k("div",{class:"mt-vw-empty",children:"Send a message to start the conversation."}):r.map(m=>k("div",{class:`mt-vw-msg mt-vw-msg-${m.role}`,"data-testid":`mt-vw-msg-${m.role}`,children:m.content},m.id))}),k("form",{class:"mt-vw-input-row",onSubmit:y,children:[k("input",{class:"mt-vw-input",type:"text",value:l,placeholder:"Type a message...","aria-label":"Message",onInput:m=>u(m.currentTarget.value),disabled:a}),k("button",{type:"submit",class:"mt-vw-send",disabled:a||!l.trim(),children:"Send"})]})]}):k("button",{type:"button",class:"mt-vw-bubble","aria-label":"Open chat",onClick:()=>n(!0),children:k("svg",{viewBox:"0 0 24 24",fill:"none",stroke:"currentColor","stroke-width":"2",children:k("path",{"stroke-linecap":"round","stroke-linejoin":"round",d:"M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"})})})}var je=`
.mt-vw-host {
  position: fixed;
  bottom: 16px;
  right: 16px;
  z-index: 2147483647;
  font-family: system-ui, -apple-system, sans-serif;
  font-size: 14px;
  color: #0f172a;
}
.mt-vw-host * {
  box-sizing: border-box;
}
.mt-vw-bubble {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0f172a;
  color: #fff;
  border: 0;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 24px rgba(0,0,0,0.15);
  transition: transform 0.15s;
}
.mt-vw-bubble:hover {
  transform: scale(1.05);
}
.mt-vw-bubble svg {
  width: 24px;
  height: 24px;
}
.mt-vw-panel {
  width: 360px;
  height: 520px;
  max-height: calc(100vh - 32px);
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.mt-vw-header {
  padding: 12px 16px;
  background: #0f172a;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.mt-vw-header h3 {
  margin: 0;
  font-size: 14px;
  font-weight: 600;
}
.mt-vw-close {
  background: transparent;
  border: 0;
  color: #fff;
  cursor: pointer;
  font-size: 20px;
  line-height: 1;
}
.mt-vw-messages {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  background: #f8fafc;
}
.mt-vw-msg {
  max-width: 80%;
  padding: 8px 12px;
  border-radius: 12px;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: 1.4;
}
.mt-vw-msg-user {
  align-self: flex-end;
  background: #0f172a;
  color: #fff;
  border-bottom-right-radius: 2px;
}
.mt-vw-msg-assistant {
  align-self: flex-start;
  background: #fff;
  color: #0f172a;
  border: 1px solid #e2e8f0;
  border-bottom-left-radius: 2px;
}
.mt-vw-msg-error {
  align-self: stretch;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  font-size: 13px;
}
.mt-vw-input-row {
  display: flex;
  gap: 8px;
  padding: 12px;
  border-top: 1px solid #e2e8f0;
  background: #fff;
}
.mt-vw-input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-family: inherit;
  font-size: 14px;
  outline: none;
}
.mt-vw-input:focus {
  border-color: #0f172a;
}
.mt-vw-send {
  padding: 8px 16px;
  background: #0f172a;
  color: #fff;
  border: 0;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
}
.mt-vw-send:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.mt-vw-empty {
  text-align: center;
  color: #64748b;
  padding: 24px 16px;
  font-size: 13px;
}
`;function rt(t){let e=t.dataset.agentId??"",n=t.dataset.publicKey??"",o=t.dataset.apiBase??new URL(t.src,window.location.href).origin;return!e||!n?(console.warn("[mt-visitor-widget] missing data-agent-id or data-public-key; widget not initialised"),null):{agentId:e,publicKey:n,apiBase:o}}function ot(){if(document.getElementById("mt-vw-styles"))return;let t=document.createElement("style");t.id="mt-vw-styles",t.textContent=je,document.head.appendChild(t)}function Oe(t){if(window.__mtVisitorWidgetInitialized)return;window.__mtVisitorWidgetInitialized=!0,ot();let e=document.createElement("div");e.className="mt-vw-host",e.id="mt-vw-host",document.body.appendChild(e),ke(k(Re,{config:t}),e)}function it(){let t=document.currentScript??document.querySelector("script[data-agent-id][data-public-key]");if(!t)return;let e=rt(t);e&&(document.body?Oe(e):document.addEventListener("DOMContentLoaded",()=>Oe(e),{once:!0}))}it();})();
