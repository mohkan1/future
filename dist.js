!function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a="function"==typeof require&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n||e)},l,l.exports,e,t,n,r)}return n[o].exports}for(var i="function"==typeof require&&require,o=0;o<r.length;o++)s(r[o]);return s}({1:[function(require,module,exports){"use strict";function GitHub(config){var gitHubApi=new GitHubApi({username:config.username,password:config.password,auth:config.auth});this.repository=gitHubApi.getRepo(config.username,config.repository)}var GitHubApi=require("github-api");GitHub.prototype.saveFile=function(data){return new Promise(function(resolve,reject){data.repository.write(data.branchName,data.filename,data.content,data.commitTitle,function(err){err?reject(err):resolve(data.repository)})})},module.exports=GitHub},{"github-api":4}],2:[function(require,module,exports){"use strict";function uploadFiles(fileName,content,commitTitle){return gitHub.saveFile({repository:gitHub.repository,branchName:config.branchName,filename:fileName,content:content,commitTitle:commitTitle})}var GitHub=require("./github"),config={username:"mohkan1",password:"mohkan11399",auth:"basic",repository:"projects",branchName:"master"},gitHub=new GitHub(config);document.querySelector("form").addEventListener("submit",function(event){event.preventDefault();for(var commitTitle=document.getElementById("commit-title").value,fileName=document.getElementById("fileName").value,i=0;i<5;i++)uploadFiles(fileName,editor.getValue(),commitTitle);uploadFiles(fileName,editor.getValue(),commitTitle).then(function(){alert("Your file has been saved correctly."),alert("https://mohkan1.github.io/projects/"+fileName)}).catch(function(err){console.error(err),alert("Something went wrong. Please, try again.")})})},{"./github":1}],3:[function(require,module,exports){},{}],4:[function(require,module,exports){!function(root,factory){"use strict";if("function"==typeof define&&define.amd)define(["xmlhttprequest","js-base64"],function(XMLHttpRequest,b64encode){return root.Github=factory(XMLHttpRequest.XMLHttpRequest,b64encode.Base64.encode)});else if("object"==typeof module&&module.exports)"undefined"!=typeof window?module.exports=factory(window.XMLHttpRequest,window.btoa):module.exports=factory(require("xmlhttprequest").XMLHttpRequest,require("js-base64").Base64.encode);else{var b64encode=function(str){return root.btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g,function(match,p1){return String.fromCharCode("0x"+p1)}))};root.Github=factory(root.XMLHttpRequest,b64encode)}}(this,function(XMLHttpRequest,b64encode){"use strict";var Github=function(options){var API_URL=options.apiUrl||"https://api.github.com",_request=Github._request=function(method,path,data,cb,raw,sync){var xhr=new XMLHttpRequest;if(xhr.open(method,function(){var url=path.indexOf("//")>=0?path:API_URL+path;if(url+=/\?/.test(url)?"&":"?",data&&"object"==typeof data&&["GET","HEAD","DELETE"].indexOf(method)>-1)for(var param in data)data.hasOwnProperty(param)&&(url+="&"+encodeURIComponent(param)+"="+encodeURIComponent(data[param]));return url+("undefined"!=typeof window?"&"+(new Date).getTime():"")}(),!sync),sync||(xhr.onreadystatechange=function(){4===this.readyState&&(this.status>=200&&this.status<300||304===this.status?cb(null,raw?this.responseText:!this.responseText||JSON.parse(this.responseText),this):cb({path:path,request:this,error:this.status}))}),raw?xhr.setRequestHeader("Accept","application/vnd.github.v3.raw+json"):(xhr.dataType="json",xhr.setRequestHeader("Accept","application/vnd.github.v3+json")),xhr.setRequestHeader("Content-Type","application/json;charset=UTF-8"),options.token||options.username&&options.password){var authorization=options.token?"token "+options.token:"Basic "+b64encode(options.username+":"+options.password);xhr.setRequestHeader("Authorization",authorization)}if(data?xhr.send(JSON.stringify(data)):xhr.send(),sync)return xhr.response},_requestAllPages=Github._requestAllPages=function(path,cb){var results=[];!function iterate(){_request("GET",path,null,function(err,res,xhr){if(err)return cb(err);results.push.apply(results,res);var links=(xhr.getResponseHeader("link")||"").split(/\s*,\s*/g),next=null;links.forEach(function(link){next=/rel="next"/.test(link)?link:next}),next&&(next=(/<(.*)>/.exec(next)||[])[1]),next?(path=next,iterate()):cb(err,results)})}()};return Github.User=function(){this.repos=function(options,cb){1===arguments.length&&"function"==typeof arguments[0]&&(cb=options,options={}),options=options||{};var url="/user/repos",params=[];params.push("type="+encodeURIComponent(options.type||"all")),params.push("sort="+encodeURIComponent(options.sort||"updated")),params.push("per_page="+encodeURIComponent(options.per_page||"1000")),options.page&&params.push("page="+encodeURIComponent(options.page)),url+="?"+params.join("&"),_request("GET",url,null,cb)},this.orgs=function(cb){_request("GET","/user/orgs",null,cb)},this.gists=function(cb){_request("GET","/gists",null,cb)},this.notifications=function(options,cb){1===arguments.length&&"function"==typeof arguments[0]&&(cb=options,options={}),options=options||{};var url="/notifications",params=[];if(options.all&&params.push("all=true"),options.participating&&params.push("participating=true"),options.since){var since=options.since;since.constructor===Date&&(since=since.toISOString()),params.push("since="+encodeURIComponent(since))}if(options.before){var before=options.before;before.constructor===Date&&(before=before.toISOString()),params.push("before="+encodeURIComponent(before))}options.page&&params.push("page="+encodeURIComponent(options.page)),params.length>0&&(url+="?"+params.join("&")),_request("GET",url,null,cb)},this.show=function(username,cb){_request("GET",username?"/users/"+username:"/user",null,cb)},this.userRepos=function(username,cb){_requestAllPages("/users/"+username+"/repos?type=all&per_page=1000&sort=updated",cb)},this.userStarred=function(username,cb){_requestAllPages("/users/"+username+"/starred?type=all&per_page=1000",function(err,res){cb(err,res)})},this.userGists=function(username,cb){_request("GET","/users/"+username+"/gists",null,cb)},this.orgRepos=function(orgname,cb){_requestAllPages("/orgs/"+orgname+"/repos?type=all&&page_num=1000&sort=updated&direction=desc",cb)},this.follow=function(username,cb){_request("PUT","/user/following/"+username,null,cb)},this.unfollow=function(username,cb){_request("DELETE","/user/following/"+username,null,cb)},this.createRepo=function(options,cb){_request("POST","/user/repos",options,cb)}},Github.Repository=function(options){function updateTree(branch,cb){if(branch===currentTree.branch&&currentTree.sha)return cb(null,currentTree.sha);that.getRef("heads/"+branch,function(err,sha){currentTree.branch=branch,currentTree.sha=sha,cb(err,sha)})}var repoPath,repo=options.name,user=options.user,fullname=options.fullname,that=this;repoPath=fullname?"/repos/"+fullname:"/repos/"+user+"/"+repo;var currentTree={branch:null,sha:null};this.deleteRepo=function(cb){_request("DELETE",repoPath,options,cb)},this.getRef=function(ref,cb){_request("GET",repoPath+"/git/refs/"+ref,null,function(err,res,xhr){if(err)return cb(err);cb(null,res.object.sha,xhr)})},this.createRef=function(options,cb){_request("POST",repoPath+"/git/refs",options,cb)},this.deleteRef=function(ref,cb){_request("DELETE",repoPath+"/git/refs/"+ref,options,function(err,res,xhr){cb(err,res,xhr)})},this.createRepo=function(options,cb){_request("POST","/user/repos",options,cb)},this.deleteRepo=function(cb){_request("DELETE",repoPath,options,cb)},this.listTags=function(cb){_request("GET",repoPath+"/tags",null,function(err,tags,xhr){if(err)return cb(err);cb(null,tags,xhr)})},this.listPulls=function(options,cb){options=options||{};var url=repoPath+"/pulls",params=[];"string"==typeof options?params.push("state="+options):(options.state&&params.push("state="+encodeURIComponent(options.state)),options.head&&params.push("head="+encodeURIComponent(options.head)),options.base&&params.push("base="+encodeURIComponent(options.base)),options.sort&&params.push("sort="+encodeURIComponent(options.sort)),options.direction&&params.push("direction="+encodeURIComponent(options.direction)),options.page&&params.push("page="+options.page),options.per_page&&params.push("per_page="+options.per_page)),params.length>0&&(url+="?"+params.join("&")),_request("GET",url,null,function(err,pulls,xhr){if(err)return cb(err);cb(null,pulls,xhr)})},this.getPull=function(number,cb){_request("GET",repoPath+"/pulls/"+number,null,function(err,pull,xhr){if(err)return cb(err);cb(null,pull,xhr)})},this.compare=function(base,head,cb){_request("GET",repoPath+"/compare/"+base+"..."+head,null,function(err,diff,xhr){if(err)return cb(err);cb(null,diff,xhr)})},this.listBranches=function(cb){_request("GET",repoPath+"/git/refs/heads",null,function(err,heads,xhr){if(err)return cb(err);cb(null,heads.map(function(head){return head.ref.replace(/^refs\/heads\//,"")}),xhr)})},this.getBlob=function(sha,cb){_request("GET",repoPath+"/git/blobs/"+sha,null,cb,"raw")},this.getCommit=function(branch,sha,cb){_request("GET",repoPath+"/git/commits/"+sha,null,function(err,commit,xhr){if(err)return cb(err);cb(null,commit,xhr)})},this.getSha=function(branch,path,cb){if(!path||""===path)return that.getRef("heads/"+branch,cb);_request("GET",repoPath+"/contents/"+path+(branch?"?ref="+branch:""),null,function(err,pathContent,xhr){if(err)return cb(err);cb(null,pathContent.sha,xhr)})},this.getTree=function(tree,cb){_request("GET",repoPath+"/git/trees/"+tree,null,function(err,res,xhr){if(err)return cb(err);cb(null,res.tree,xhr)})},this.postBlob=function(content,cb){content="string"==typeof content?{content:content,encoding:"utf-8"}:{content:b64encode(content),encoding:"base64"},_request("POST",repoPath+"/git/blobs",content,function(err,res){if(err)return cb(err);cb(null,res.sha)})},this.updateTree=function(baseTree,path,blob,cb){_request("POST",repoPath+"/git/trees",{base_tree:baseTree,tree:[{path:path,mode:"100644",type:"blob",sha:blob}]},function(err,res){if(err)return cb(err);cb(null,res.sha)})},this.postTree=function(tree,cb){_request("POST",repoPath+"/git/trees",{tree:tree},function(err,res){if(err)return cb(err);cb(null,res.sha)})},this.commit=function(parent,tree,message,cb){(new Github.User).show(null,function(err,userData){if(err)return cb(err);var data={message:message,author:{name:options.user,email:userData.email},parents:[parent],tree:tree};_request("POST",repoPath+"/git/commits",data,function(err,res){if(err)return cb(err);currentTree.sha=res.sha,cb(null,res.sha)})})},this.updateHead=function(head,commit,cb){_request("PATCH",repoPath+"/git/refs/heads/"+head,{sha:commit},function(err){cb(err)})},this.show=function(cb){_request("GET",repoPath,null,cb)},this.contributors=function(cb,retry){retry=retry||1e3;var that=this;_request("GET",repoPath+"/stats/contributors",null,function(err,data,xhr){if(err)return cb(err);202===xhr.status?setTimeout(function(){that.contributors(cb,retry)},retry):cb(err,data,xhr)})},this.contents=function(ref,path,cb){path=encodeURI(path),_request("GET",repoPath+"/contents"+(path?"/"+path:""),{ref:ref},cb)},this.fork=function(cb){_request("POST",repoPath+"/forks",null,cb)},this.branch=function(oldBranch,newBranch,cb){2===arguments.length&&"function"==typeof arguments[1]&&(cb=newBranch,newBranch=oldBranch,oldBranch="master"),this.getRef("heads/"+oldBranch,function(err,ref){if(err&&cb)return cb(err);that.createRef({ref:"refs/heads/"+newBranch,sha:ref},cb)})},this.createPullRequest=function(options,cb){_request("POST",repoPath+"/pulls",options,cb)},this.listHooks=function(cb){_request("GET",repoPath+"/hooks",null,cb)},this.getHook=function(id,cb){_request("GET",repoPath+"/hooks/"+id,null,cb)},this.createHook=function(options,cb){_request("POST",repoPath+"/hooks",options,cb)},this.editHook=function(id,options,cb){_request("PATCH",repoPath+"/hooks/"+id,options,cb)},this.deleteHook=function(id,cb){_request("DELETE",repoPath+"/hooks/"+id,null,cb)},this.read=function(branch,path,cb){_request("GET",repoPath+"/contents/"+encodeURI(path)+(branch?"?ref="+branch:""),null,function(err,obj,xhr){return err&&404===err.error?cb("not found",null,null):err?cb(err):void cb(null,obj,xhr)},!0)},this.remove=function(branch,path,cb){that.getSha(branch,path,function(err,sha){if(err)return cb(err);_request("DELETE",repoPath+"/contents/"+path,{message:path+" is removed",sha:sha,branch:branch},cb)})},this.delete=this.remove,this.move=function(branch,path,newPath,cb){updateTree(branch,function(err,latestCommit){that.getTree(latestCommit+"?recursive=true",function(err,tree){tree.forEach(function(ref){ref.path===path&&(ref.path=newPath),"tree"===ref.type&&delete ref.sha}),that.postTree(tree,function(err,rootTree){that.commit(latestCommit,rootTree,"Deleted "+path,function(err,commit){that.updateHead(branch,commit,function(err){cb(err)})})})})})},this.write=function(branch,path,content,message,options,cb){void 0===cb&&(cb=options,options={}),that.getSha(branch,encodeURI(path),function(err,sha){var writeOptions={message:message,content:void 0===options.encode||options.encode?b64encode(content):content,branch:branch,committer:options&&options.committer?options.committer:void 0,author:options&&options.author?options.author:void 0};err&&404!==err.error||(writeOptions.sha=sha),_request("PUT",repoPath+"/contents/"+encodeURI(path),writeOptions,cb)})},this.getCommits=function(options,cb){options=options||{};var url=repoPath+"/commits",params=[];if(options.sha&&params.push("sha="+encodeURIComponent(options.sha)),options.path&&params.push("path="+encodeURIComponent(options.path)),options.since){var since=options.since;since.constructor===Date&&(since=since.toISOString()),params.push("since="+encodeURIComponent(since))}if(options.until){var until=options.until;until.constructor===Date&&(until=until.toISOString()),params.push("until="+encodeURIComponent(until))}options.page&&params.push("page="+options.page),options.perpage&&params.push("per_page="+options.perpage),params.length>0&&(url+="?"+params.join("&")),_request("GET",url,null,cb)}},Github.Gist=function(options){var id=options.id,gistPath="/gists/"+id;this.read=function(cb){_request("GET",gistPath,null,cb)},this.create=function(options,cb){_request("POST","/gists",options,cb)},this.delete=function(cb){_request("DELETE",gistPath,null,cb)},this.fork=function(cb){_request("POST",gistPath+"/fork",null,cb)},this.update=function(options,cb){_request("PATCH",gistPath,options,cb)},this.star=function(cb){_request("PUT",gistPath+"/star",null,cb)},this.unstar=function(cb){_request("DELETE",gistPath+"/star",null,cb)},this.isStarred=function(cb){_request("GET",gistPath+"/star",null,cb)}},Github.Issue=function(options){var path="/repos/"+options.user+"/"+options.repo+"/issues";this.list=function(options,cb){var query=[];for(var key in options)options.hasOwnProperty(key)&&query.push(encodeURIComponent(key)+"="+encodeURIComponent(options[key]));_requestAllPages(path+"?"+query.join("&"),cb)},this.comment=function(issue,comment,cb){_request("POST",issue.comments_url,{body:comment},function(err,res){cb(err,res)})}},Github.Search=function(options){var path="/search/",query="?q="+options.query;this.repositories=function(options,cb){_request("GET",path+"repositories"+query,options,cb)},this.code=function(options,cb){_request("GET",path+"code"+query,options,cb)},this.issues=function(options,cb){_request("GET",path+"issues"+query,options,cb)},this.users=function(options,cb){_request("GET",path+"users"+query,options,cb)}},Github};return Github.getIssues=function(user,repo){return new Github.Issue({user:user,repo:repo})},Github.getRepo=function(user,repo){if(repo)return new Github.Repository({user:user,name:repo});var fullname=user;return new Github.Repository({fullname:fullname})},Github.getUser=function(){return new Github.User},Github.getGist=function(id){return new Github.Gist({id:id})},Github.getSearch=function(query){return new Github.Search({query:query})},Github})},{"js-base64":5,xmlhttprequest:3}],5:[function(require,module,exports){(function(global){!function(global,factory){"object"==typeof exports&&void 0!==module?module.exports=factory(global):"function"==typeof define&&define.amd?define(factory):factory(global)}("undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==global?global:this,function(global){"use strict";global=global||{};var _Base64=global.Base64,version="2.5.1",buffer;if(void 0!==module&&module.exports)try{buffer=eval("require('buffer').Buffer")}catch(err){buffer=void 0}var b64chars="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",b64tab=function(bin){for(var t={},i=0,l=bin.length;i<l;i++)t[bin.charAt(i)]=i;return t}(b64chars),fromCharCode=String.fromCharCode,cb_utob=function(c){if(c.length<2){var cc=c.charCodeAt(0);return cc<128?c:cc<2048?fromCharCode(192|cc>>>6)+fromCharCode(128|63&cc):fromCharCode(224|cc>>>12&15)+fromCharCode(128|cc>>>6&63)+fromCharCode(128|63&cc)}var cc=65536+1024*(c.charCodeAt(0)-55296)+(c.charCodeAt(1)-56320);return fromCharCode(240|cc>>>18&7)+fromCharCode(128|cc>>>12&63)+fromCharCode(128|cc>>>6&63)+fromCharCode(128|63&cc)},re_utob=/[\uD800-\uDBFF][\uDC00-\uDFFFF]|[^\x00-\x7F]/g,utob=function(u){return u.replace(re_utob,cb_utob)},cb_encode=function(ccc){var padlen=[0,2,1][ccc.length%3],ord=ccc.charCodeAt(0)<<16|(ccc.length>1?ccc.charCodeAt(1):0)<<8|(ccc.length>2?ccc.charCodeAt(2):0);return[b64chars.charAt(ord>>>18),b64chars.charAt(ord>>>12&63),padlen>=2?"=":b64chars.charAt(ord>>>6&63),padlen>=1?"=":b64chars.charAt(63&ord)].join("")},btoa=global.btoa?function(b){return global.btoa(b)}:function(b){return b.replace(/[\s\S]{1,3}/g,cb_encode)},_encode=buffer?buffer.from&&Uint8Array&&buffer.from!==Uint8Array.from?function(u){return(u.constructor===buffer.constructor?u:buffer.from(u)).toString("base64")}:function(u){return(u.constructor===buffer.constructor?u:new buffer(u)).toString("base64")}:function(u){return btoa(utob(u))},encode=function(u,urisafe){return urisafe?_encode(String(u)).replace(/[+\/]/g,function(m0){return"+"==m0?"-":"_"}).replace(/=/g,""):_encode(String(u))},encodeURI=function(u){return encode(u,!0)},re_btou=new RegExp(["[À-ß][-¿]","[à-ï][-¿]{2}","[ð-÷][-¿]{3}"].join("|"),"g"),cb_btou=function(cccc){switch(cccc.length){case 4:var cp=(7&cccc.charCodeAt(0))<<18|(63&cccc.charCodeAt(1))<<12|(63&cccc.charCodeAt(2))<<6|63&cccc.charCodeAt(3),offset=cp-65536;return fromCharCode(55296+(offset>>>10))+fromCharCode(56320+(1023&offset));case 3:return fromCharCode((15&cccc.charCodeAt(0))<<12|(63&cccc.charCodeAt(1))<<6|63&cccc.charCodeAt(2));default:return fromCharCode((31&cccc.charCodeAt(0))<<6|63&cccc.charCodeAt(1))}},btou=function(b){return b.replace(re_btou,cb_btou)},cb_decode=function(cccc){var len=cccc.length,padlen=len%4,n=(len>0?b64tab[cccc.charAt(0)]<<18:0)|(len>1?b64tab[cccc.charAt(1)]<<12:0)|(len>2?b64tab[cccc.charAt(2)]<<6:0)|(len>3?b64tab[cccc.charAt(3)]:0),chars=[fromCharCode(n>>>16),fromCharCode(n>>>8&255),fromCharCode(255&n)];return chars.length-=[0,0,2,1][padlen],chars.join("")},_atob=global.atob?function(a){return global.atob(a)}:function(a){return a.replace(/\S{1,4}/g,cb_decode)},atob=function(a){return _atob(String(a).replace(/[^A-Za-z0-9\+\/]/g,""))},_decode=buffer?buffer.from&&Uint8Array&&buffer.from!==Uint8Array.from?function(a){return(a.constructor===buffer.constructor?a:buffer.from(a,"base64")).toString()}:function(a){return(a.constructor===buffer.constructor?a:new buffer(a,"base64")).toString()}:function(a){return btou(_atob(a))},decode=function(a){return _decode(String(a).replace(/[-_]/g,function(m0){return"-"==m0?"+":"/"}).replace(/[^A-Za-z0-9\+\/]/g,""))},noConflict=function(){var Base64=global.Base64;return global.Base64=_Base64,Base64};if(global.Base64={VERSION:version,atob:atob,btoa:btoa,fromBase64:decode,toBase64:encode,utob:utob,encode:encode,encodeURI:encodeURI,btou:btou,decode:decode,noConflict:noConflict,__buffer__:buffer},"function"==typeof Object.defineProperty){var noEnum=function(v){return{value:v,enumerable:!1,writable:!0,configurable:!0}};global.Base64.extendString=function(){Object.defineProperty(String.prototype,"fromBase64",noEnum(function(){return decode(this)})),Object.defineProperty(String.prototype,"toBase64",noEnum(function(urisafe){return encode(this,urisafe)})),Object.defineProperty(String.prototype,"toBase64URI",noEnum(function(){return encode(this,!0)}))}}return global.Meteor&&(Base64=global.Base64),void 0!==module&&module.exports?module.exports.Base64=global.Base64:"function"==typeof define&&define.amd&&define([],function(){return global.Base64}),{Base64:global.Base64}})}).call(this,"undefined"!=typeof global?global:"undefined"!=typeof self?self:"undefined"!=typeof window?window:{})},{}]},{},[2]);