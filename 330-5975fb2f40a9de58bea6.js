(self.webpackChunkperiotrisjs=self.webpackChunkperiotrisjs||[]).push([[330],{2330:function(n,r,e){"use strict";e.a(n,(async function(n){e.r(r),e.d(r,{__wbg_buffer_397eaa4d72ee94dd:function(){return t.jp},__wbg_call_888d259a5fefc347:function(){return t.BT},__wbg_crypto_98fc271021c7d2ad:function(){return t.Oi},__wbg_error_4bb6c2a97407129a:function(){return t.kF},__wbg_getRandomValues_98117e9a7e993920:function(){return t.C2},__wbg_globalThis_3f735a5746d41fbd:function(){return t.ud},__wbg_global_1bc0b39582740e95:function(){return t.PT},__wbg_length_1eb8fc608a0d4cdb:function(){return t.A7},__wbg_modulerequire_3440a4bcf44437db:function(){return t.dS},__wbg_msCrypto_a2cdb043d2bfe57f:function(){return t.gl},__wbg_new_59cb74e423758ede:function(){return t.h9},__wbg_new_a7ce447f15ff496f:function(){return t.y4},__wbg_newnoargs_be86524d73f67598:function(){return t.wg},__wbg_newwithlength_929232475839a482:function(){return t.b0},__wbg_node_4b517d861cbcb3bc:function(){return t.Im},__wbg_process_2f24d6544ea7b200:function(){return t.rY},__wbg_randomFillSync_64cc7d048f228ca8:function(){return t.cx},__wbg_self_c6fbdfc2918d5e58:function(){return t.JX},__wbg_set_969ad0a60e51d320:function(){return t.YQ},__wbg_stack_558ba5917b466edd:function(){return t.Dz},__wbg_subarray_8b658422a224f479:function(){return t.uf},__wbg_versions_6164651e75405d4a:function(){return t.UE},__wbg_window_baec038b5ab35c54:function(){return t.xd},__wbindgen_is_object:function(){return t.Wl},__wbindgen_is_string:function(){return t.eY},__wbindgen_is_undefined:function(){return t.XP},__wbindgen_json_parse:function(){return t.t$},__wbindgen_json_serialize:function(){return t.r1},__wbindgen_memory:function(){return t.oH},__wbindgen_object_clone_ref:function(){return t.m_},__wbindgen_object_drop_ref:function(){return t.ug},__wbindgen_throw:function(){return t.Or},extern_init:function(){return t.pZ},extern_tile:function(){return t.Ad},extern_topo_sort:function(){return t.Cq}});var t=e(5857),u=n([t]);t=(u.then?await u:u)[0]}))},5857:function(n,r,e){"use strict";e.a(n,(async function(t){e.d(r,{pZ:function(){return v},Cq:function(){return T},Ad:function(){return k},t$:function(){return A},r1:function(){return E},cx:function(){return Y},ug:function(){return D},C2:function(){return F},rY:function(){return S},Wl:function(){return U},UE:function(){return q},Im:function(){return I},eY:function(){return P},Oi:function(){return X},gl:function(){return z},dS:function(){return J},wg:function(){return B},BT:function(){return N},m_:function(){return H},JX:function(){return Q},xd:function(){return R},ud:function(){return V},PT:function(){return W},XP:function(){return $},jp:function(){return M},y4:function(){return Z},YQ:function(){return L},A7:function(){return G},b0:function(){return K},uf:function(){return nn},h9:function(){return rn},Dz:function(){return en},kF:function(){return tn},Or:function(){return un},oH:function(){return _n}});var u=e(3530);n=e.hmd(n);var _=t([u]);u=(_.then?await _:_)[0];var o=new("undefined"==typeof TextDecoder?(0,n.require)("util").TextDecoder:TextDecoder)("utf-8",{ignoreBOM:!0,fatal:!0});o.decode();var i=null;function c(){return null!==i&&i.buffer===u.memory.buffer||(i=new Uint8Array(u.memory.buffer)),i}function f(n,r){return o.decode(c().subarray(n,n+r))}var b=new Array(32).fill(void 0);b.push(void 0,null,!0,!1);var a=b.length;function d(n){a===b.length&&b.push(b.length+1);var r=a;return a=b[r],b[r]=n,r}function w(n){return b[n]}var g=0,l=new("undefined"==typeof TextEncoder?(0,n.require)("util").TextEncoder:TextEncoder)("utf-8"),s="function"==typeof l.encodeInto?function(n,r){return l.encodeInto(n,r)}:function(n,r){var e=l.encode(n);return r.set(e),{read:n.length,written:e.length}};function y(n,r,e){if(void 0===e){var t=l.encode(n),u=r(t.length);return c().subarray(u,u+t.length).set(t),g=t.length,u}for(var _=n.length,o=r(_),i=c(),f=0;f<_;f++){var b=n.charCodeAt(f);if(b>127)break;i[o+f]=b}if(f!==_){0!==f&&(n=n.slice(f)),o=e(o,_,_=f+3*n.length);var a=c().subarray(o+f,o+_);f+=s(n,a).written}return g=f,o}var h=null;function p(){return null!==h&&h.buffer===u.memory.buffer||(h=new Int32Array(u.memory.buffer)),h}function m(n){var r=w(n);return function(n){n<36||(b[n]=a,a=n)}(n),r}function v(){u.extern_init()}var x=32;function j(n){if(1==x)throw new Error("out of js stack");return b[--x]=n,x}function T(n){try{return m(u.extern_topo_sort(j(n)))}finally{b[x++]=void 0}}function k(n){try{return m(u.extern_tile(j(n)))}finally{b[x++]=void 0}}function C(n,r){try{return n.apply(this,r)}catch(e){u.__wbindgen_exn_store(d(e))}}function O(n,r){return c().subarray(n/1,n/1+r)}function A(n,r){return d(JSON.parse(f(n,r)))}function E(n,r){var e=w(r),t=y(JSON.stringify(void 0===e?null:e),u.__wbindgen_malloc,u.__wbindgen_realloc),_=g;p()[n/4+1]=_,p()[n/4+0]=t}function Y(){return C((function(n,r,e){w(n).randomFillSync(O(r,e))}),arguments)}function D(n){m(n)}function F(){return C((function(n,r){w(n).getRandomValues(w(r))}),arguments)}function S(n){return d(w(n).process)}function U(n){var r=w(n);return"object"==typeof r&&null!==r}function q(n){return d(w(n).versions)}function I(n){return d(w(n).node)}function P(n){return"string"==typeof w(n)}function X(n){return d(w(n).crypto)}function z(n){return d(w(n).msCrypto)}function J(){return C((function(n,r){return d(e(4805)(f(n,r)))}),arguments)}function B(n,r){return d(new Function(f(n,r)))}function N(){return C((function(n,r){return d(w(n).call(w(r)))}),arguments)}function H(n){return d(w(n))}function Q(){return C((function(){return d(self.self)}),arguments)}function R(){return C((function(){return d(window.window)}),arguments)}function V(){return C((function(){return d(globalThis.globalThis)}),arguments)}function W(){return C((function(){return d(e.g.global)}),arguments)}function $(n){return void 0===w(n)}function M(n){return d(w(n).buffer)}function Z(n){return d(new Uint8Array(w(n)))}function L(n,r,e){w(n).set(w(r),e>>>0)}function G(n){return w(n).length}function K(n){return d(new Uint8Array(n>>>0))}function nn(n,r,e){return d(w(n).subarray(r>>>0,e>>>0))}function rn(){return d(new Error)}function en(n,r){var e=y(w(r).stack,u.__wbindgen_malloc,u.__wbindgen_realloc),t=g;p()[n/4+1]=t,p()[n/4+0]=e}function tn(n,r){try{console.error(f(n,r))}finally{u.__wbindgen_free(n,r)}}function un(n,r){throw new Error(f(n,r))}function _n(){return d(u.memory)}}))},4805:function(n){function r(n){var r=new Error("Cannot find module '"+n+"'");throw r.code="MODULE_NOT_FOUND",r}r.keys=function(){return[]},r.resolve=r,r.id=4805,n.exports=r},3530:function(n,r,e){"use strict";var t=function([t]){return e.v(r,n.id,"cfc8dce2aa062883a563",{"./index_bg.js":{__wbindgen_json_parse:t.t$,__wbindgen_json_serialize:t.r1,__wbg_randomFillSync_64cc7d048f228ca8:t.cx,__wbindgen_object_drop_ref:t.ug,__wbg_getRandomValues_98117e9a7e993920:t.C2,__wbg_process_2f24d6544ea7b200:t.rY,__wbindgen_is_object:t.Wl,__wbg_versions_6164651e75405d4a:t.UE,__wbg_node_4b517d861cbcb3bc:t.Im,__wbindgen_is_string:t.eY,__wbg_crypto_98fc271021c7d2ad:t.Oi,__wbg_msCrypto_a2cdb043d2bfe57f:t.gl,__wbg_modulerequire_3440a4bcf44437db:t.dS,__wbg_newnoargs_be86524d73f67598:t.wg,__wbg_call_888d259a5fefc347:t.BT,__wbindgen_object_clone_ref:t.m_,__wbg_self_c6fbdfc2918d5e58:t.JX,__wbg_window_baec038b5ab35c54:t.xd,__wbg_globalThis_3f735a5746d41fbd:t.ud,__wbg_global_1bc0b39582740e95:t.PT,__wbindgen_is_undefined:t.XP,__wbg_buffer_397eaa4d72ee94dd:t.jp,__wbg_new_a7ce447f15ff496f:t.y4,__wbg_set_969ad0a60e51d320:t.YQ,__wbg_length_1eb8fc608a0d4cdb:t.A7,__wbg_newwithlength_929232475839a482:t.b0,__wbg_subarray_8b658422a224f479:t.uf,__wbg_new_59cb74e423758ede:t.h9,__wbg_stack_558ba5917b466edd:t.Dz,__wbg_error_4bb6c2a97407129a:t.kF,__wbindgen_throw:t.Or,__wbindgen_memory:t.oH}})};e.a(n,(function(n){var r=n([e(5857)]);return r.then?r.then(t):t(r)}),1)}}]);
//# sourceMappingURL=330-5975fb2f40a9de58bea6.js.map