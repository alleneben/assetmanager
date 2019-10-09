import React, { useReducer, useContext, useEffect } from "react";
import LoadingOverlay from 'react-loading-overlay';

import * as s from "../../shardslib";
import * as c from '../../components'

import { AppContext } from '../../appstate/appcontext'
import utils from '../../appstate/utils';
import * as cf from '../forms'

let cboc;
let cbou;
let cnts;

const Asset = (props) => {
  const [cs, setState] = useReducer(
    (cs, newState) => ({...cs, ...newState}),{
      loading: false, place:null, msg:null, notify:null,theme:null,
      extdata:[],tbdata:[],contentmenu:'',formtype:'',clearaddform:false,
      view:false,edit:false, open:false,contentmenu:'assets'
    })
  const { state, dispatch } = useContext(AppContext)


  const submenus = (menus) => {
    if (menus.text === 'Create') {
      switch (menus.cid) {
        case 'asset':
          setState({contentmenu:menus.cid})
          break;
        default:
          console.log('pass');
          break;
      }

    } else {
      switch (menus.cid) {
        case 'assets':
          setState({contentmenu:menus.cid})
          break;
        default:
          console.log('broken ...');
          break;
      }
    }
  }
  const makesubmenus = () => {
    if (!!!state.auhmn.text) return;
    return <> {state.auhmn.smenus.map((mn,key) => <a key={key} className="menu-btn animated slideInLeft"  target="_blank" rel="noopener noreferrer" onClick={() => submenus(mn)}>{mn.text}</a>)} </>
  }

  const makecontent = (menu) => {
    if(menu === '') return;
    var content = menu === 'assets' ?
                    mktbl(menu)   :
                  menu === 'product'  ?
                    'makeaddform() ':
                    'mkslstbl(menu)'
    return content
  }


  // data fetching
  utils.utilfxns.combo('sp_category_combo','cidn').then(rd => {
    cboc=[]
    rd.sd.map(opt => {
      cboc.push({label:opt.nam,value:opt.rid,nam:'cidn'});
    })
  })

  // useEffect(() => {
  //   setState({loading: true})
  //   utils.utilfxns.fetchdata(props.match.params.id,'asset',0,200).then(rd => {
  //     var out = rd;
  //     if (out.success) {
  //       setState({loading: false, tbdata: rd.sd, table:true, clearaddform: true, contentmenu: 'asset'})
  //     } else {
  //       setState({loading: false, notify: true, msg:out[0].em,place:'tr'})
  //     }
  //   },err => {
  //     setState({loading: false, notify: true, msg:'Failed to Fetch Data',place:'tr'})
  //   })
  //   return () => {
  //     console.log('bye');
  //   };
  // },[])
  const mktbl = () =>{
    const btns = [
      {btn:<s.Button theme="white"><span className="text-primary"><i className="material-icons">search</i></span>{" "} View </s.Button>,fn:'viewfn',type:'lnk',lnk:'/assets/'},
      {btn:<s.Button theme="white"><span className="text-success"><i className="material-icons">edit</i></span>{" "} Edit </s.Button>,fn:'editfn',type:'btn'},
      {btn:<s.Button theme="white"><span className="text-danger"><i className="material-icons">print</i></span>{" "} Print </s.Button>,fn:'download',type:'btn'},
      {btn:<s.Button theme="white"><span className="text-muted"><i className="material-icons">eject</i></span>{" "} Transfer </s.Button>,fn:'transferfn',type:'btn'},
    ]
    const tbcfg = {header:['S/No','Asset','Code','Category','Status','Year', 'Actions'],flds:[{n:'nam',f:'t'},{n:'shc',f:'t'},{n:'ctn',f:'t'},{n:'stn',f:'t'},{n:'ypr',f:'n'}]}

    const p = '{"rid":"n","nam":"t","mno":"t","shc":"t","cti":"n","ctn":"t","lci":"n","loc":"t","sti":"n","stn":"t","dcd":"t","ypr":"n","rgi":"n","sts":"n","pos":"n","plm":"n"}'
    const params = {lci:props.match.params.id}
    return <c.MagsterDataTable transferfn={transferfn} editform={editform} load={true} isShow={true} height='300px' phld='Items' btns={btns} data={[]} tbcfg={tbcfg} prm={params} svc='fd' a='find' p={p} dbf='asset' printfn={printfn}/>
  }

  const makeaddform = (param) => {
    return <cf.AddForm submit={addfn} fmtype={param} closeaddform={closeaddform} clearaddform={clearform} animated='animated fadeIn p-3' cboc={cboc} cbou={cbou}/>;
  }

  const makeext = (item,type,animate) => {
    var flds={ridn:item.rid,namt:item.nam,mnot:item.mno,prcn:item.avl,warn:item.war,usfn:item.usf,scpn:item.scp,cidn:item.cti,dsct:item.com}
    var t = type === 'editfn' ?
    <cf.EditForm item={item} submit={editfn} fmtype='edit asset' closeeditform={closeeditform} cboc={cboc} cbou={cbou} flds={flds}/> :
    <cf.ViewForm item={item} closeviewform={closeviewform} cboc={cboc} flds={flds}/>;
    // if(state.data === undefined) return <>fetching incidents.... <c.Notification theme='danger' msg='Slow Connection' time='7'/></>
    return <c.PlainCard animated={animate} children={t} />
  }
  const makemodal = (item) => {
    var flds={ridn:item.rid,namt:item.nam,cidn:item.cti}

    return <cf.ModalForm item={item} submit={submit} fmtype={'Transfer:: '+item.nam} open={cs.open} closemodal={closemodal} cboc={cboc} flds={flds}/>
  }



  //forms
  const addfn = (dd) => {
    const {form} = dd;

    setState({notify: null, msg:null})
    if(utils.utilfxns.validate(form)){
      setState({notify: true, msg:utils.utilfxns.validate(form),place:'tr'})
    } else {
      setState({loading: true})
      utils.utilfxns.submitdata(dd).then(rd => {
        var out = rd;
        if(out.success){
          setState({loading: false, tbdata: rd.sd, table: true,notify: true, msg:out.sm, showaddform: (prev) => !prev})
        } else {
          setState({loading: false, notify: true, msg:out[0].em,place:'tr'})
        }
      },err => {
        setState({loading: false, notify: true, msg:'Failed to Fetch Data',place:'tr'})
      })
    }
  }

  const editfn = (dd) => {
    const {form} = dd;

    setState({notify: null, msg:null})
    if(utils.utilfxns.validate(form)){
      setState({notify: true, msg:utils.utilfxns.validate(form),place:'tr'})
    } else {
      setState({loading: true})
      utils.utilfxns.submitdata(dd).then(rd => {
        var out = rd;
        if(out.success){
          setState({loading: false, place:'tr', table: true,notify: true, msg:out.sd[0]['nam']+' was update successfully', edit: false})
        } else {
          setState({loading: false, notify: true, msg:out[0].em,place:'tr'})
        }
      },err => {
        setState({loading: false, notify: true, msg:'Failed to Fetch Data',place:'tr'})
      })
    }
  }
  const submit = (dd) => {
    const {form} = dd;

    setState({notify: null, msg:null})
    if(utils.utilfxns.validate(form)){
      setState({notify: true, msg:utils.utilfxns.validate(form),place:'tr'})
    } else {
      setState({loading: true})
      utils.utilfxns.submitdata(dd).then(rd => {
        var out = rd;
        if(out.success){
          setState({loading: false, place:'tr', open: false,notify: true, msg:out.sm, edit: false})
        } else {
          setState({loading: false, notify: true, msg:out[0].em,place:'br'})
        }
      },err => {
      setState({loading: false, notify: true, msg:'Failed to Fetch Data',place:'br'})
    })
    }
  }
  const printfn = (item, fmt) => {
    utils.utilfxns.fetchfile(item.rid,'asset','','').then(rd=>{
      var out = rd;
      if(out.size > 100 && fmt === 'pdf'){
        utils.utilfxns.apipdf(out,'projectreport','pdf');
      } else if (fmt === 'csv') {
        utils.utilfxns.getPDF(out,'projectreport','csv');
      }
      else {
      }
    },err=>{

    })
  }
  const transferfn = (item) => {
    setState({open: true, extdata: item})
  }
  const closemodal = () => {
    setState({open: false})
  }
  const viewform = (item,type) => {
    setState({view: true, extdata: item, formtype: type, table: false})
  }
  const closeviewform = () => {
    setState({view: false, table: true})
  }
  const editform = (item,type) => {
    setState({edit: true, extdata: item, formtype: type, table: false})
  }
  const closeeditform = () => {
    setState({edit: false, table: true})
  }
  const addform = (type) => {
    setState({formtype: type, table: false, showaddform: true})
  }
  const closeaddform = () => {
    setState({showaddform: (prev) => !prev, table: true})
  }
  const clearform = () => {
    setState({clearaddform: true})
  }
  return (
    <>
    {/*<s.Container fluid className="main-content-container px-4 pb-4 pt-4">
      <s.Row>
      <div className="menu-container">{ makesubmenus() }</div>
        <s.Col lg="12" md="12">
          { cs.notify && cs.msg && cs.place && <c.Notification place={cs.place} type='danger' msg={cs.msg} time='3'/>}
          { cs.view ? makeext(cs.extdata,cs.formtype,'animated fadeIn') : cs.edit ? makeext(cs.extdata,cs.formtype,'animated fadeIn') : '' }
          { cs.formtype && cs.showaddform && makeaddform(cs.formtype) } <br/>
          { cs.loading ? <><s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={cs.loading} /></> : makecontent(cs.contentmenu)  }
          { cs.open && makemodal(cs.extdata) }
        </s.Col>
      </s.Row>
    </s.Container>*/}

    <s.Container fluid className="main-content-container px-4 pb-4 pt-4">
      <s.Row>
      <div className="menu-container">{ makesubmenus() }</div>
        <s.Col lg="12" md="12">
        <LoadingOverlay
          active={cs.loading}
          spinner
          text='Loading'
          >
          { cs.notify && cs.msg && cs.place && <c.Notification place={cs.place} type='danger' msg={cs.msg} time='3'/>}
          { cs.view ? makeext(cs.extdata,cs.formtype,'animated fadeIn') : cs.edit ? makeext(cs.extdata,cs.formtype,'animated fadeIn') : '' }
          <br/>
          { cs.loading ? <><s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={cs.loading} /> {makecontent(cs.contentmenu)}</> : makecontent(cs.contentmenu)  }
          </LoadingOverlay>
        </s.Col>

      </s.Row>
      { cs.open && makemodal(cs.extdata)}
    </s.Container>
    </>
  );
}
export default Asset;
