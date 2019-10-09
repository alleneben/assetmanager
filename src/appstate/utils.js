import {useEffect,useState} from 'react';
import api from './api';

export default {
  utilfxns: {
    getmenus: params => getmenus(params),
    getPDF: (params,filename,fmt) => getPDF(params,filename,fmt),
    apipdf: (params,filename,fmt) => apipdf(params,filename,fmt),
    combo:(type,nam) => combo(type,nam),
    getcookie: (cookie) => getcookie(cookie),
    fetchdata: (searchterm,svc,pos,plm) => fetchdata(searchterm,svc,pos,plm),
    fetchfile: (searchterm,svc,fmt) => fetchfile(searchterm,svc,fmt),
    test: (searchterm,svc,pos,plm) => test(searchterm,svc,pos,plm),
    submitdata: (fm) => submitdata(fm),
    download: (param,fp,s,a,dbf,fmt) => download(param,fp,s,a,dbf,fmt),
    getuid: () => getuid(),
    validate: (fm) => validate(fm),
    applicationstart:(dispatch) => applicationstart(dispatch)
  }
}

function getmenus(params) {
  const mn = params.mn;
  const upv = params.pv
  var mmi,mbar=[];
  for(mmi in mn){
    var mmn = mn[mmi].nam;
    var sm = mn[mmi].smn;
          //var bt = this.upv[mmi].btx;
    var smenu = [];
    var oksmn = [];
    for(var smn in sm){
        var smf = sm[smn];
        var mni = {text:smn};
        var c = mkbuts(smf,upv); //added
        //smenu.push({text:smn,cid:smf}); removed
        smenu.push({text:smn,cid:smf,ssm:c}); //added
    }
    oksmn.push(Object.keys(smenu));
    mbar.push({text:mmn,smenus:smenu,objk:oksmn,icon:mmi});
  }
  return mbar;
}

function mkbuts(file,upv){
  var i,j=0,pv=upv,bb=[],obt=[];
  for(i in pv){
    if(pv[i].acf==file){
      var nb = pv[i].btx;
      var mb = pv[i].bfn;
      bb.push({text:nb,fn:mb});
    }
  }
  return bb;
}

const getPDF = (params,filename,fmt) => {
  var data = fmt === 'pdf' ? new Blob([params], {type: 'application/pdf'}) : new Blob([params], {type: 'text/csv'});
  var pdfURL = window.URL.createObjectURL(data);
  var tempLink = document.createElement('a');
  var d = new Date();

  var cdate = d.getDate();
  var cmonth = d.getMonth();
  var cyear = d.getFullYear();
  var chour = d.getHours();
  var cmin = d.getMinutes();
  var csec = d.getSeconds();

  tempLink.href = pdfURL;
  tempLink.setAttribute('download', filename + "_" +cdate + "-" + cmonth + "-" + cyear+"_"+chour+"_"+cmin+"_"+csec+'.'+fmt);
  tempLink.click();
}

const apipdf = (params,filename,fmt) =>{
  let newBlob = new Blob([params], {type: "application/pdf"});
  if (window.navigator && window.navigator.msSaveOrOpenBlob) {
    window.navigator.msSaveOrOpenBlob(newBlob);
    return;
  }

  const data = window.URL.createObjectURL(newBlob);
  let link = document.createElement('a');
  link.href = data;
  let fnm = filename ? filename.split(';')[1].split('=')[1].replace(/"/g,'') : 'file.pdf'
  link.download=fnm;
  window.open(link)
  // link.click();
  //document.body.removeChild(link);

  setTimeout(function(){
    // window.print(link)
    // For Firefox it is necessary to delay revoking the ObjectURL
    window.URL.revokeObjectURL(data);
  }, 2000);
}

const download = (param,fp,s,a,dbf,fmt) => {
  // console.log(param,fp,s,a,dbf,fmt);
  var fm = new FormData();
  if(param){
    for (var key in param) {
      if(key === 'sdt' || key === 'edt'){
        var dt = param[key].toISOString();
        fm.append(key,dt);
      }else {
        fm.append(key,param[key]);
      }
    }
  }
  fm.append('ssi',getcookie('_metalcraft'));fm.append("uid", getuid());
  fm.append("s", 'rp');fm.append("a", dbf);fm.append('df','sp_'+dbf+'_find');fm.append('dd',fp)
  fm.append('m','l');fm.append('fmt',fmt)

  return api.fxns.getfile(fm,api.fxns.endpoint);
}

const combo = (type,nam) => {
  const [val, setvalue] = useState(null)

  // useEffect(() => {
    var fm = new FormData(),cbo=[];
    fm.append('s', 'cb');fm.append('a', 'combo');fm.append('df',type);
    fm.append("ssi", getcookie('_metalcraft'));fm.append("uid", getuid());
    fm.append('m','l');

    // api.fxns.combo(fm,api.fxns.endpoint).then(rd => {
    //   rd.sd.map(opt => {
    //     cbo.push({label:opt.nam,value:opt.rid,nam:nam});
    //   })
    //   setvalue(cbo)
    // });

  // },[])

  // return () => {
  //   console.log('bye');
  // };
  return api.fxns.combo(fm,api.fxns.endpoint);
}

const applicationstart = (dispatch) => {
  let isMounted;
  const [value, setValue] = useState(null)
  const [msg, setMsg] = useState(null)

  useEffect(() => {
    isMounted = true;
    var fm = new FormData();
    fm.append('s', '');fm.append('m', document.cookie.split("=")[1]);
    dispatch({type:'LOADING', initloading: true})

    if (document.cookie.split("=")[1] === undefined) {
      api.fxns.base(fm,api.fxns.endpoint).then(dd => {
        if(isMounted){
          document.cookie = "_metalcraft=" + dd["PHPSESSID"];
          setValue(dd["PHPSESSID"])
          dispatch({type:'LOADING', initloading: false})
        }
      }, err=>{

        setValue(false)
        setMsg(err.toString()+' Application Start')
        dispatch({type:'LOADING', initloading: false})
      });
    }else {
      setValue(true)
      dispatch({type:'LOADING', initloading: false})
    }

      return () => {
        isMounted = false
      };
  },[])

  return {value,msg};
}

const fetchdata = (searchterm,svc,pos,plm) => {
  var fm = new FormData(),props,name;
  if (svc === 'region') {
    props = '{"rid":"n","nam":"t","shc":"t","sts":"n","pos":"n","plm":"n"}'
    fm.append('nam',searchterm);fm.append('a', 'find');

  }  else if(svc === 'location') {
    props = '{"rid":"n","nam":"t","shc":"t","rnm":"t","rsc":"t","rgi":"n","osc":"t","cid":"n","sts":"n","pos":"n","plm":"n"}'
    fm.append('rgi',searchterm);fm.append('a', 'find');
  } else if(svc === 'asset'){

    props = '{"rid":"n","nam":"t","mno":"t","shc":"t","cti":"n","ctn":"t","lci":"n","loc":"t","sti":"n","stn":"t","dcd":"t","ypr":"n","rgi":"n","sts":"n","pos":"n","plm":"n"}'
    var rid = searchterm ? searchterm : ''
    fm.append('lci',rid);fm.append('a', 'find');
  } else if (svc === 'transfer') {
    props = '{"aid":"n","nam":"t","mno":"t","shc":"t","cti":"n","ctn":"t","lci":"n","tlo":"t","tdt":"t","sts":"n","pos":"n","plm":"n"}'
    var rid = searchterm ? searchterm : ''
    fm.append('aid',rid);fm.append('a', 'find');
  } else if (svc === 'straight_new') {

    props = '{"aid":"n"}'
    const { id } = searchterm;
    fm.append('aid',id);fm.append('a','compute');
  }else if (svc === 'reducingbalance_new') {

    props = '{"aid":"n"}'
    const { id } = searchterm;
    fm.append('aid',id);fm.append('a','compute');
  }
  fm.append('s', 'fd');fm.append('df','sp_'+svc+'_find');
  fm.append("ssi", getcookie('_metalcraft'));fm.append("uid", getuid());
  fm.append('m','l');fm.append('dd',props);fm.append('plm',plm);fm.append('pos',pos);

  return api.fxns.datasubmit(fm,api.fxns.endpoint);
}

const fetchfile = (searchterm,svc,fmt) => {
  var fm = new FormData(),props,name;
  if (svc === 'region') {
    props = '{"rid":"n","nam":"t","shc":"t","sts":"n","pos":"n","plm":"n"}'
    fm.append('nam',searchterm)
  }  else if(svc === 'location') {
    props = '{"rid":"n","nam":"t","shc":"t","rnm":"t","rsc":"t","rgi":"n","osc":"t","cid":"n","sts":"n","pos":"n","plm":"n"}'
    fm.append('rgi',searchterm)
  } else if(svc === 'asset'){
    props = '{"rid":"n","nam":"t","mno":"t","shc":"t","cti":"n","ctn":"t","lci":"n","loc":"t","sti":"n","stn":"t","dcd":"t","ypr":"n","rgi":"n","sts":"n","pos":"n","plm":"n"}'
    var rid = searchterm ? searchterm : ''
    fm.append('rid',rid);fm.append('fmt',fmt)
  }
  fm.append('s', 'rp');fm.append('a', 'asset');fm.append('df','sp_'+svc+'_find');
  fm.append("ssi", getcookie('_metalcraft'));fm.append("uid", getuid());
  fm.append('m','l');fm.append('dd',props);fm.append('plm','');fm.append('pos','');

  return api.fxns.getfile(fm,api.fxns.endpoint);
}
const test = async (searchterm,svc,pos,plm) => {
  var fm = new FormData(),props,name;
  if (svc === 'products') {
    props = '{"rid":"n","nam":"t","sno":"t","sdt":"t","edt":"t","sts":"n","pos":"n","plm":"n"}'
    fm.append('nam',searchterm)
  }  else if(svc === 'productcategories') {
    props = '{"rid":"n","nam":"t","shc":"t","sts":"n","pos":"n","plm":"n"}'
    fm.append('nam',searchterm)
  }
  fm.append('s', 'fd');fm.append('a', 'find');fm.append('df','sp_'+svc+'_find');
  fm.append("ssi", getcookie('_metalcraft'));fm.append("uid", getuid());
  fm.append('m','l');fm.append('dd',props);fm.append('plm',plm);fm.append('pos',pos);

  var result = await fetch(api.fxns.endpoint,{method: 'post', body: fm})

  return result;
}

const submitdata = (dd) => {
  const {val,sdt,form,f,s,a} = dd;

  var fm = new FormData(),props={};

  // for (var key in val) {
  //   if(key === 'sdtt'){
  //     var dt = val.sdtt.toISOString();
  //     fm.append(key,dt);
  //   }else {
  //     fm.append(key,val[key]);
  //   }
  //   props[key]= key.substr(key.length-1);
  // }

  for (var i = 0; i < form.length-1; i++) {
    if(form[i]['props']['name'] === 'sdtt'){
      var dt = val.sdtt.toISOString();
      fm.append(form[i]['props']['name'],dt);
    } else {
      fm.append(form[i]['props']['name'],form[i]['props']['value']);
    }
    props[form[i]['props']['name']]= form[i]['props']['name'].substr(form[i]['props']['name'].length-1);
  }


  fm.append('ssi',getcookie('_metalcraft'));fm.append("uid", getuid());
  fm.append("s", s);fm.append("a", a);fm.append('df',f);
  fm.append('m','l');fm.append('dd',JSON.stringify(props))

  return api.fxns.datasubmit(fm,api.fxns.endpoint);
}

const validate = (form) => {

  var msg;
  // for (var key in form) {
  //   if(!form[key]['props']['value']){
  //       msg = form[key]['props']['id'] + ' is Required';
  //       break;
  //   }
  // }
  for (var i = 0; i < form.length-1; i++) {
    if(!form[i]['props']['value']){
        msg = form[i]['props']['id'] + ' is Required';
        break;
    }
  }
  return msg;
}

const getcookie = (name) => {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
const getuid = () => {
  var out = JSON.parse(localStorage.getItem('out'));
  return out.out.us.rid;
}
