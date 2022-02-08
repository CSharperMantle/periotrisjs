"use strict";(self.webpackChunkperiotrisjs=self.webpackChunkperiotrisjs||[]).push([[49],{2690:function(e,t,r){r.r(t),r.d(t,{default:function(){return D}});var i=r(5391),n=r(6687),o=r(7025),a=r(2516),l=r(7624),c=r(8760),s=r(4458),h=r(7128),d=r(6362),u=r(3420),p=r(2010),m=["absolute","children","className","component","flexItem","light","orientation","role","textAlign","variant"],v=(0,h.ZP)("div",{name:"MuiDivider",slot:"Root",overridesResolver:function(e,t){var r=e.ownerState;return[t.root,r.absolute&&t.absolute,t[r.variant],r.light&&t.light,"vertical"===r.orientation&&t.vertical,r.flexItem&&t.flexItem,r.children&&t.withChildren,r.children&&"vertical"===r.orientation&&t.withChildrenVertical,"right"===r.textAlign&&"vertical"!==r.orientation&&t.textAlignRight,"left"===r.textAlign&&"vertical"!==r.orientation&&t.textAlignLeft]}})((function(e){var t=e.theme,r=e.ownerState;return(0,a.Z)({margin:0,flexShrink:0,borderWidth:0,borderStyle:"solid",borderColor:t.palette.divider,borderBottomWidth:"thin"},r.absolute&&{position:"absolute",bottom:0,left:0,width:"100%"},r.light&&{borderColor:(0,s.Fq)(t.palette.divider,.08)},"inset"===r.variant&&{marginLeft:72},"middle"===r.variant&&"horizontal"===r.orientation&&{marginLeft:t.spacing(2),marginRight:t.spacing(2)},"middle"===r.variant&&"vertical"===r.orientation&&{marginTop:t.spacing(1),marginBottom:t.spacing(1)},"vertical"===r.orientation&&{height:"100%",borderBottomWidth:0,borderRightWidth:"thin"},r.flexItem&&{alignSelf:"stretch",height:"auto"})}),(function(e){var t=e.theme,r=e.ownerState;return(0,a.Z)({},r.children&&{display:"flex",whiteSpace:"nowrap",textAlign:"center",border:0,"&::before, &::after":{position:"relative",width:"100%",borderTop:"thin solid ".concat(t.palette.divider),top:"50%",content:'""',transform:"translateY(50%)"}})}),(function(e){var t=e.theme,r=e.ownerState;return(0,a.Z)({},r.children&&"vertical"===r.orientation&&{flexDirection:"column","&::before, &::after":{height:"100%",top:"0%",left:"50%",borderTop:0,borderLeft:"thin solid ".concat(t.palette.divider),transform:"translateX(0%)"}})}),(function(e){var t=e.ownerState;return(0,a.Z)({},"right"===t.textAlign&&"vertical"!==t.orientation&&{"&::before":{width:"90%"},"&::after":{width:"10%"}},"left"===t.textAlign&&"vertical"!==t.orientation&&{"&::before":{width:"10%"},"&::after":{width:"90%"}})})),f=(0,h.ZP)("span",{name:"MuiDivider",slot:"Wrapper",overridesResolver:function(e,t){var r=e.ownerState;return[t.wrapper,"vertical"===r.orientation&&t.wrapperVertical]}})((function(e){var t=e.theme,r=e.ownerState;return(0,a.Z)({display:"inline-block",paddingLeft:"calc(".concat(t.spacing(1)," * 1.2)"),paddingRight:"calc(".concat(t.spacing(1)," * 1.2)")},"vertical"===r.orientation&&{paddingTop:"calc(".concat(t.spacing(1)," * 1.2)"),paddingBottom:"calc(".concat(t.spacing(1)," * 1.2)")})})),g=n.forwardRef((function(e,t){var r=(0,d.Z)({props:e,name:"MuiDivider"}),i=r.absolute,n=void 0!==i&&i,s=r.children,h=r.className,g=r.component,b=void 0===g?s?"div":"hr":g,y=r.flexItem,w=void 0!==y&&y,x=r.light,Z=void 0!==x&&x,S=r.orientation,C=void 0===S?"horizontal":S,E=r.role,A=void 0===E?"hr"!==b?"separator":void 0:E,R=r.textAlign,L=void 0===R?"center":R,T=r.variant,k=void 0===T?"fullWidth":T,N=(0,o.Z)(r,m),P=(0,a.Z)({},r,{absolute:n,component:b,flexItem:w,light:Z,orientation:C,role:A,textAlign:L,variant:k}),I=function(e){var t=e.absolute,r=e.children,i=e.classes,n=e.flexItem,o=e.light,a=e.orientation,l=e.textAlign,s={root:["root",t&&"absolute",e.variant,o&&"light","vertical"===a&&"vertical",n&&"flexItem",r&&"withChildren",r&&"vertical"===a&&"withChildrenVertical","right"===l&&"vertical"!==a&&"textAlignRight","left"===l&&"vertical"!==a&&"textAlignLeft"],wrapper:["wrapper","vertical"===a&&"wrapperVertical"]};return(0,c.Z)(s,u.V,i)}(P);return(0,p.jsx)(v,(0,a.Z)({as:b,className:(0,l.Z)(I.root,h),role:A,ref:t,ownerState:P},N,{children:s?(0,p.jsx)(f,{className:I.wrapper,ownerState:P,children:s}):null}))})),b=r(8679),y=r(1886),w=r(3396),x=r(3001),Z=r(4572),S=r(668),C=r(2497),E=r(4643);function A(e){return(0,E.Z)("MuiLink",e)}var R=(0,r(4584).Z)("MuiLink",["root","underlineNone","underlineHover","underlineAlways","button","focusVisible"]),L=["className","color","component","onBlur","onFocus","TypographyClasses","underline","variant"],T={primary:"primary.main",textPrimary:"text.primary",secondary:"secondary.main",textSecondary:"text.secondary",error:"error.main"},k=(0,h.ZP)(C.Z,{name:"MuiLink",slot:"Root",overridesResolver:function(e,t){var r=e.ownerState;return[t.root,t["underline".concat((0,x.Z)(r.underline))],"button"===r.component&&t.button]}})((function(e){var t=e.theme,r=e.ownerState,i=(0,w.D)(t,"palette.".concat(function(e){return T[e]||e}(r.color)))||r.color;return(0,a.Z)({},"none"===r.underline&&{textDecoration:"none"},"hover"===r.underline&&{textDecoration:"none","&:hover":{textDecoration:"underline"}},"always"===r.underline&&{textDecoration:"underline",textDecorationColor:"inherit"!==i?(0,s.Fq)(i,.4):void 0,"&:hover":{textDecorationColor:"inherit"}},"button"===r.component&&(0,y.Z)({position:"relative",WebkitTapHighlightColor:"transparent",backgroundColor:"transparent",outline:0,border:0,margin:0,borderRadius:0,padding:0,cursor:"pointer",userSelect:"none",verticalAlign:"middle",MozAppearance:"none",WebkitAppearance:"none","&::-moz-focus-inner":{borderStyle:"none"}},"&.".concat(R.focusVisible),{outline:"auto"}))})),N=n.forwardRef((function(e,t){var r=(0,d.Z)({props:e,name:"MuiLink"}),i=r.className,s=r.color,h=void 0===s?"primary":s,u=r.component,m=void 0===u?"a":u,v=r.onBlur,f=r.onFocus,g=r.TypographyClasses,y=r.underline,w=void 0===y?"always":y,C=r.variant,E=void 0===C?"inherit":C,R=(0,o.Z)(r,L),T=(0,Z.Z)(),N=T.isFocusVisibleRef,P=T.onBlur,I=T.onFocus,j=T.ref,B=n.useState(!1),M=(0,b.Z)(B,2),F=M[0],D=M[1],V=(0,S.Z)(t,j),W=(0,a.Z)({},r,{color:h,component:m,focusVisible:F,underline:w,variant:E}),G=function(e){var t=e.classes,r=e.component,i=e.focusVisible,n=e.underline,o={root:["root","underline".concat((0,x.Z)(n)),"button"===r&&"button",i&&"focusVisible"]};return(0,c.Z)(o,A,t)}(W);return(0,p.jsx)(k,(0,a.Z)({className:(0,l.Z)(G.root,i),classes:g,color:h,component:m,onBlur:function(e){P(e),!1===N.current&&D(!1),v&&v(e)},onFocus:function(e){I(e),!0===N.current&&D(!0),f&&f(e)},ref:V,ownerState:W,variant:E},R))})),P=r(3913),I=r(7794),j=r(8328);function B(){return B=Object.assign||function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var i in r)Object.prototype.hasOwnProperty.call(r,i)&&(e[i]=r[i])}return e},B.apply(this,arguments)}const M={fontFamily:'"Fira Code", Consolas, monospace',color:"darkgray"},F=()=>{const e=(0,i.useStaticQuery)("3387501435");return n.createElement(P.Z,{maxWidth:"lg",sx:{flex:"1 1 auto",paddingTop:"3rem",paddingBottom:"16px"}},n.createElement(I.Z,{spacing:1},n.createElement(C.Z,{variant:"h2"},"About Periotris.js"),n.createElement(C.Z,B({variant:"h6"},M),"Version ",e.package.version),n.createElement(C.Z,B({variant:"h6"},M),"Revision ",e.gitCommit.hash.slice(0,8),"@",e.gitBranch.name),n.createElement(C.Z,B({variant:"h6"},M),"License ",e.package.license),n.createElement(g,{variant:"middle"}),n.createElement(C.Z,{variant:"body1",paragraph:!0},"Periotris.js is your best companion for learning and memorizing the Periodic Table of Elements."),n.createElement(C.Z,{variant:"body1",paragraph:!0},"Combining the classic game experience of Tetris with the periodic table, Periotris.js is a successful attempt of breathing vitality into the boredom of chemistry learning."),n.createElement(C.Z,{variant:"body1",paragraph:!0},"The rumor that periodic table is constructed out of a game of Tetris has been brought to reality. By playing Periotris.js you can experience the thrill of fitting elements into right slots like a real chemist. Despite its simplicity, Periotris.js is a challenging game that puts the player's knowledge of descriptive chemistry to the test. Try finish the game in the shortest time possible and experience the excitement of completing another brick in the wall of chemistry."),n.createElement(C.Z,{variant:"body1",paragraph:!0},"Built with ❤ by"," ",n.createElement(N,{href:"https://github.com/CSharperMantle"},"CSharperMantle"),". Special thanks to Mr. Longdi Xu, my high school chemistry teacher, for sparking the idea that finally went so far as this."),n.createElement(g,{variant:"middle"}),n.createElement(C.Z,{variant:"h4"},"License"),n.createElement(C.Z,{variant:"body1",paragraph:!0},'Copyright (C) 2021 Rong "Mantle" Bao'),n.createElement(C.Z,{variant:"body1",paragraph:!0},"This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version."),n.createElement(C.Z,{variant:"body1",paragraph:!0},"This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details."),n.createElement(C.Z,{variant:"body1",paragraph:!0},"You should have received a copy of the GNU General Public License along with this program. If not, see"," ",n.createElement(N,{href:"https://github.com/CSharperMantle/periotrisjs/blob/main/LICENSE"},"LICENSE"),".")))};F.Layout=j.j7;var D=F}}]);
//# sourceMappingURL=component---src-pages-about-tsx-c3c4787b3411885c28dc.js.map