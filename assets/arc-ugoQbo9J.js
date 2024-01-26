import{w as ln,c as U}from"./path-aUcfwwLI.js";import{aT as an,aU as Y,aV as b,aW as rn,aX as y,Q as on,aY as j,aZ as _,a_ as un,a$ as t,b0 as sn,b1 as tn,b2 as fn}from"./index-dm_XeVK3.js";function cn(l){return l.innerRadius}function yn(l){return l.outerRadius}function gn(l){return l.startAngle}function mn(l){return l.endAngle}function pn(l){return l&&l.padAngle}function dn(l,h,E,q,v,A,V,a){var I=E-l,i=q-h,n=V-v,m=a-A,r=m*I-n*i;if(!(r*r<y))return r=(n*(h-A)-m*(l-v))/r,[l+r*I,h+r*i]}function H(l,h,E,q,v,A,V){var a=l-E,I=h-q,i=(V?A:-A)/j(a*a+I*I),n=i*I,m=-i*a,r=l+n,s=h+m,f=E+n,c=q+m,W=(r+f)/2,o=(s+c)/2,p=f-r,g=c-s,R=p*p+g*g,T=v-A,P=r*c-f*s,O=(g<0?-1:1)*j(fn(0,T*T*R-P*P)),Q=(P*g-p*O)/R,S=(-P*p-g*O)/R,w=(P*g+p*O)/R,d=(-P*p+g*O)/R,x=Q-W,e=S-o,u=w-W,X=d-o;return x*x+e*e>u*u+X*X&&(Q=w,S=d),{cx:Q,cy:S,x01:-n,y01:-m,x11:Q*(v/T-1),y11:S*(v/T-1)}}function vn(){var l=cn,h=yn,E=U(0),q=null,v=gn,A=mn,V=pn,a=null,I=ln(i);function i(){var n,m,r=+l.apply(this,arguments),s=+h.apply(this,arguments),f=v.apply(this,arguments)-rn,c=A.apply(this,arguments)-rn,W=un(c-f),o=c>f;if(a||(a=n=I()),s<r&&(m=s,s=r,r=m),!(s>y))a.moveTo(0,0);else if(W>on-y)a.moveTo(s*Y(f),s*b(f)),a.arc(0,0,s,f,c,!o),r>y&&(a.moveTo(r*Y(c),r*b(c)),a.arc(0,0,r,c,f,o));else{var p=f,g=c,R=f,T=c,P=W,O=W,Q=V.apply(this,arguments)/2,S=Q>y&&(q?+q.apply(this,arguments):j(r*r+s*s)),w=_(un(s-r)/2,+E.apply(this,arguments)),d=w,x=w,e,u;if(S>y){var X=sn(S/r*b(Q)),z=sn(S/s*b(Q));(P-=X*2)>y?(X*=o?1:-1,R+=X,T-=X):(P=0,R=T=(f+c)/2),(O-=z*2)>y?(z*=o?1:-1,p+=z,g-=z):(O=0,p=g=(f+c)/2)}var Z=s*Y(p),$=s*b(p),B=r*Y(T),C=r*b(T);if(w>y){var F=s*Y(g),G=s*b(g),J=r*Y(R),K=r*b(R),D;if(W<an)if(D=dn(Z,$,J,K,F,G,B,C)){var L=Z-D[0],M=$-D[1],N=F-D[0],k=G-D[1],nn=1/b(tn((L*N+M*k)/(j(L*L+M*M)*j(N*N+k*k)))/2),en=j(D[0]*D[0]+D[1]*D[1]);d=_(w,(r-en)/(nn-1)),x=_(w,(s-en)/(nn+1))}else d=x=0}O>y?x>y?(e=H(J,K,Z,$,s,x,o),u=H(F,G,B,C,s,x,o),a.moveTo(e.cx+e.x01,e.cy+e.y01),x<w?a.arc(e.cx,e.cy,x,t(e.y01,e.x01),t(u.y01,u.x01),!o):(a.arc(e.cx,e.cy,x,t(e.y01,e.x01),t(e.y11,e.x11),!o),a.arc(0,0,s,t(e.cy+e.y11,e.cx+e.x11),t(u.cy+u.y11,u.cx+u.x11),!o),a.arc(u.cx,u.cy,x,t(u.y11,u.x11),t(u.y01,u.x01),!o))):(a.moveTo(Z,$),a.arc(0,0,s,p,g,!o)):a.moveTo(Z,$),!(r>y)||!(P>y)?a.lineTo(B,C):d>y?(e=H(B,C,F,G,r,-d,o),u=H(Z,$,J,K,r,-d,o),a.lineTo(e.cx+e.x01,e.cy+e.y01),d<w?a.arc(e.cx,e.cy,d,t(e.y01,e.x01),t(u.y01,u.x01),!o):(a.arc(e.cx,e.cy,d,t(e.y01,e.x01),t(e.y11,e.x11),!o),a.arc(0,0,r,t(e.cy+e.y11,e.cx+e.x11),t(u.cy+u.y11,u.cx+u.x11),o),a.arc(u.cx,u.cy,d,t(u.y11,u.x11),t(u.y01,u.x01),!o))):a.arc(0,0,r,T,R,o)}if(a.closePath(),n)return a=null,n+""||null}return i.centroid=function(){var n=(+l.apply(this,arguments)+ +h.apply(this,arguments))/2,m=(+v.apply(this,arguments)+ +A.apply(this,arguments))/2-an/2;return[Y(m)*n,b(m)*n]},i.innerRadius=function(n){return arguments.length?(l=typeof n=="function"?n:U(+n),i):l},i.outerRadius=function(n){return arguments.length?(h=typeof n=="function"?n:U(+n),i):h},i.cornerRadius=function(n){return arguments.length?(E=typeof n=="function"?n:U(+n),i):E},i.padRadius=function(n){return arguments.length?(q=n==null?null:typeof n=="function"?n:U(+n),i):q},i.startAngle=function(n){return arguments.length?(v=typeof n=="function"?n:U(+n),i):v},i.endAngle=function(n){return arguments.length?(A=typeof n=="function"?n:U(+n),i):A},i.padAngle=function(n){return arguments.length?(V=typeof n=="function"?n:U(+n),i):V},i.context=function(n){return arguments.length?(a=n??null,i):a},i}export{vn as a};
