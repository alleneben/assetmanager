import React, { useState, useEffect, useReducer } from 'react';
import { Link } from 'react-router-dom';
import LoadingOverlay from 'react-loading-overlay';



import * as s from "../../shardslib";
import * as c from "../";
import RangeDatePicker from "./rangedatepicker";
import styles from '../../pagination.css';
import api from '../../appstate/api';
import utils from '../../appstate/utils'



let newdata=[]
function MagsterDataTable ({transferfn,editform,load,reload,ttl,isShow,height,phld,btns,data,svc,a,tbcfg,p,dbf,prm,plm,printfn,addfn}) {
  const [cs, setState] = useReducer(
    (cs, newState) => ({...cs, ...newState}),
      { search: {},loading:false,msg:null,ntf:false,plc:null,tdata:[], filtereditems:[],
        datalen:0,cnts:0,cnt:0,pglm:0,disable:true
      }
    )

  useEffect(() => {
    if(load) request(svc,a,'','',1,true,false,prm);

    return () => {
      console.log('cleaning up ...');
    };
  },[reload])

  newdata = data.length < 1 ? cs.tdata : data;

  const request = async (s,a,o,l,sign,chg,dsbl,param) => {
    setState({loading:true,ntf:false,msg:null,plc:null})
    var fm = new FormData(),pps={};
    if(param){
      for (var key in param) {
        if(key === 'sdt' || key === 'edt'){
          var dt = param[key].toISOString();
          fm.append(key,dt);
        }else {
          fm.append(key,param[key]);
        }
        pps[key]= key.substr(key.length-1);
      }
    }
    fm.append('s', svc);fm.append('a', a);fm.append('df','sp_'+dbf+'_find');
    fm.append("ssi", utils.utilfxns.getcookie('_metalcraft'));fm.append("uid", utils.utilfxns.getuid());
    fm.append('m','l');fm.append('dd',p);fm.append('plm',l);fm.append('pos',o);

    var response = await fetch(api.fxns.endpoint,{method: 'post', body: fm})
    let data = await response.json();

    setState({loading:false})
    if(data.success){
      let tot = data.sd.length < 1 ? 0 : data.rc.rid;
      let dcnt =  chg ? sign * data.sd.length : cs.cnt +  sign * data.sd.length;
      setState({cnts:tot,cnt:dcnt,datalen:data.sd.length,tdata:data.sd,filtereditems:data.sd,disable:dsbl})
    } else {
      err('data[0].em','tr',true)
    }
  }
  const err = (msg,plc,ntf) => {
    setState({ntf:ntf,msg:msg,plc:plc})
  }
  const onChange = (e) => {
    setState({search: {...cs.search, [e.target.name]:e.target.value}})
    setState({tdata: cs.filtereditems.filter(item => new RegExp(e.target.value, "i").exec(item.nam || item.shc))})

  }

  const onStartChange = (value) =>{
    setState({search: {...cs.search, ['sdt']: value}})
  }
  const onEndChange = (value) =>{
    setState({search: {...cs.search, ['edt']: value}})
  }
  const clearfilters = () => {
    setState({search: {}})
  }
  const rightpagination = () => {
    return cs.cnt === parseInt(cs.cnts) ? false : request(svc,a,cs.cnt,cs.pglm,1,false,true,5)
  }
  const leftpagination = () => {
    let len = cs.cnt === parseInt(cs.cnts) ? parseInt(cs.cnts) - cs.datalen : cs.cnt-2*parseInt(cs.pglm);
    return cs.cnt <= parseInt(cs.pglm) ? false : request(svc,a,len,cs.pglm,-1,false,true,5)
  }
  const onchangepager = (e) => {
    setState({pglm: e.target.value})
    request(svc,a,0,e.target.value,1,true,true,5)
  }

  const download = (item,p,svc,a,dbf,fmt) => {
    setState({loading:true,ntf: null})
    let sp = typeof item === 'object' ? {rid:item.rid} : prm;
    utils.utilfxns.download(sp,p,svc,a,dbf,fmt)
    .then(rd => {
      rd[0].then(file => {
        if(file.type === 'text/html'){
          setState({loading:false,ntf: true, msg:'update asset with year,price and scrapvalue before printing this report ', plc:'tr'})
        }else {
          setState({loading: false})
          utils.utilfxns.apipdf(file,rd[1],'pdf');
        }
      })
    })
  }

  const triggerFn = (fn,item) => {
    switch (fn) {
      case 'addfn':
        addfn(item);
        break;
      case 'transferfn':
        transferfn(item)
        break;
      case 'editfn':
        editform(item,'editfn','animated slideInDown')
        break;
      case 'download':
        download(item,p,'rp','assetstatement','assetstatement','pdf')
        break;
      default:
        console.log('fxn not found');
    }
	}
  return (
    <>
    <LoadingOverlay
      active={cs.loading}
      spinner
      text='Loading'
      >
    <c.CustomCard  animated='animated fadeIn' title={ttl} children={
      <s.Row noGutters className="border-bottom py-2 bg-light">
      {isShow &&<> <s.InputGroup seamless className="mb-3">
        <s.FormInput placeholder={'Search '+phld} name="nam" value={cs.search.nam || ''} onChange={onChange}/>
        {/*<s.FormInput placeholder={'Search by Code'} name="shc" value={cs.search.shc || ''} onChange={onChange}/>*/}
        <s.InputGroupAddon type="append">
        <s.InputGroupText>
          <i className="material-icons">search</i>
        </s.InputGroupText>
        <s.Button
          disabled={!cs.search}
          theme="primary"
          type="button"
          onClick={() => request(svc,a,'','',1,true,false,cs.search)}
        >
          Search
        </s.Button>
        </s.InputGroupAddon>
      </s.InputGroup>
      <s.InputGroup seamless className="mb-3">
        <RangeDatePicker onStartChange={onStartChange} onEndChange={onEndChange} clearfilters={clearfilters}/>
        <s.InputGroupAddon type="append">
          <s.InputGroupText onClick={() => download('',p,svc,a,dbf,'fmt')} className="clearfilters">
            <i className="material-icons">print</i>
            <img src={require("../../assets/img/icons8-export-pdf-16.png")} style={{height:'20px',width:'20px'}} className="mr-2" alt="Shards - Agency Landing Page" />
          </s.InputGroupText>
          <s.InputGroupText onClick={() => download('',p,svc,a,dbf,'xls')} className="clearfilters">
            <i className="material-icons">print</i>
            <img src={require("../../assets/img/icons8-xls-48.png")} style={{height:'20px',width:'20px'}} className="mr-2" alt="Shards - Agency Landing Page" />
          </s.InputGroupText>
        </s.InputGroupAddon>
      </s.InputGroup></>}

        <div className="table-responsive" >
          <div  style={{ height: height}}>
            <table className="table mb-0 tbody table-striped table-hover table-sm">
              <thead className="thead-light">
                <tr>
                  {
                    tbcfg.header.map((d,k) => {
                      return (
                        <th key={k}>
                        { d }
                        </th>
                      )
                    })
                  }
                </tr>
              </thead>
              <tbody>
                <tr></tr>
                { cs.loading ? <tr><td>loading</td></tr> :
                  newdata.map((item,key) => {
                    return (
                      <tr key={key} >
                          <td>{key+1}</td>
                          {
                              tbcfg.flds.map((dd,kk) => {
                                  var val = dd.f === 'd' ? parseFloat(item[dd.n]).toFixed(2) : item[dd.n];
                                  return (
                                      <td key={kk}>{val}</td>
                                  )
                              })
                          }
                          <td className="td-actions">
                            <div className="blog-comments__actions">
                              <s.ButtonGroup size="sm">
                              {
                                btns.map((b,k) => {
                                  if (b.type == 'lnk') {
                                    return <Link key={k} to={{pathname:`${b.lnk+item.rid}`,data:item, id:item.rid}}>{ b.btn }</Link>
                                  } else {
                                    return ( <div key={k} onClick={() => triggerFn(b.fn,item)}> { b.btn } </div> );
                                  }
                                })
                              }
                              </s.ButtonGroup>
                            </div>
                        </td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>

          </div>
          { cs.ntf && cs.msg && cs.plc && <c.Notification place={cs.plc} type='danger' msg={cs.msg} time='3'/>}
        </div>

      </s.Row>}

      footer= {isShow && <div className="pagination">
        {cs.disable && <span onClick={() => leftpagination()}>&laquo;</span>}
        {cs.disable && <span onClick={() => rightpagination()}>&raquo;</span> }
        <span>{ cs.cnt + '/' + cs.cnts}</span>
        <s.FormSelect
          size="sm"
          value={cs.pglm}
          style={{ maxWidth: "100px" }}
          onChange={onchangepager}
        >
          <option value="0">No Data</option>
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="30">30</option>
          <option value="40">40</option>
          <option value="50">50</option>
        </s.FormSelect>
      </div> }
    />
    </LoadingOverlay>
    </>
  )
}

export default MagsterDataTable;
