
import React, {useContext, useState,useEffect, useRef} from 'react';

import api from '../../appstate/api';
import utils from '../../appstate/utils';

import { AppContext } from '../../appstate/appcontext';
import { MenuNav } from '../../components'


import * as s from '../../shardslib';
import * as c from '../../components';
import * as cf from '../forms';


let cboc;
let cbou;
let cnts;
const Asset = (props) => {
  //forms
  const [view,setview] = useState(false);
  const [edit,setedit] = useState(false);
  const [showaddform, setshowaddform] = useState(false);
  const [clearaddform, setclearaddform] = useState(false);
  const [fmtype, setfmtype] = useState('');


  // menu
  const [contentmenu,setcontentmenu] = useState('')

  //data
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState([])
  const [table, settable] = useState(false)
  const [pos, setpos] = useState(0);
  const [plm, setplm] = useState(10);
  const [cnt, setcnt] = useState(10);

  const [notify, setnotify] = useState(false)
  const [msg, setmsg] = useState('')

  const { state, dispatch } = useContext(AppContext)

  // utils.utilfxns.combo('sp_productcategories_combo','cidn').then(rd => {
  //   cboc=[]
  //   rd.sd.map(opt => {
  //     cboc.push({label:opt.nam,value:opt.rid,nam:'cidn'});
  //   })
  // })
  // utils.utilfxns.combo('sp_unit_combo','unin').then(rd => {
  //   cbou=[]
  //   rd.sd.map(opt => {
  //     cbou.push({label:opt.nam,value:opt.rid,nam:'unin'});
  //   })
  // })
// console.log(props);
  useEffect(() => {
    setloading(true)
    utils.utilfxns.fetchdata(props.match.params.id,'asset',pos,plm).then(rd => {
      var out = rd;
      if(out.success){
        setdata(rd.sd)
        cnts = rd.rc.rid;
        settable(true)
        setcontentmenu('asset')
        setloading(false)
      } else {
        setmsg(out.em)
        setnotify(true)
      }
    },err => {
      // console.log(err);
    })
    return () => {
      console.log('bye');
    };
  },[])



  const pager = (pos,plm,cnt) => {
    if(pos < 0) return ;
    setloading(true)
    utils.utilfxns.fetchdata('','asset',pos,plm).then(rd => {
      var out = rd;
      setloading(false)
      if(out.success){
        setpos(pos)
        setplm(plm)
        setdata(rd)
        setcontentmenu('asset')
      } else {
        setmsg(out.em)
      }
    },err => {
      setloading(false)
      console.log(err);
    })
  }
  const maketable = () => {
    const btns = [
      {btn:<s.Button theme="white"><span className="text-success"><i className="material-icons">more_vert</i></span>{" "} View </s.Button>,fn:'viewfn'},
      {btn:<s.Button theme="white"><span className="text-success"><i className="material-icons">check</i></span>{" "} Edit </s.Button>,fn:'editfn'},
    ]
    const tbcfg = {
      header:["S/No","Asset","Codloadinge","Category","Status","Year"],
      flds:[{n:'nam',f:'t'},{n:'shc',f:'t'},{n:'ctn',f:'t'},{n:'stn',f:'t'},{n:'ypr',f:'n'}]}
    if(loading ) return <s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={loading} />
    return  <c.DataTable cfg={tbcfg} data={data} viewform='' editform='' searchdb='' tbname='asset' placeholder='Search Asset' btns={btns} pager={pager} pos={pos} plm={plm} cnt={10} cnts={cnts} top='10%' left='40%' display=''/>
  }

  const submenus = (menus) => {
    if (menus.text === 'Create') {
      switch (menus.cid) {
        case 'asset':
          addform('asset')
          break;
        case 'productcategories':
          addform('product categories')
          break;
        default:
          console.log('pass');
      }
    } else {
      console.log('');
    }
  }
  const makesubmenus = () => {
    if (!!!state.auhmn.text) return;
    return <> {state.auhmn.smenus.map((mn,key) => <a key={key} className="menu-btn animated slideInLeft"  target="_blank" rel="noopener noreferrer" onClick={() => submenus(mn)}>{mn.text}</a>)} </>
  }
  const makecontent = (menu) => {
    if(menu === undefined) return;
    var content =  <c.PlainCard animated='animated slideInUp' children={<s.Row noGutters className="border-bottom py-2 bg-light">{ maketable() }</s.Row>}/>
    return content
  }

  //forms
  const addform = (param) => {
    setfmtype(param)
    setshowaddform(true)
    settable(false)
  }
  const closeaddform = () => {
    setshowaddform((prev) => !prev)
    settable(true)
  }
  const viewform = (item,type) => {
    // setview(true)
    // setextdata(item)
    // setformtype(type)
  }
  const closeviewform = () => {
    setview(false)
  }
  const editform = (item,type) => {
    setedit(true)
    // setextdata(item)
    setfmtype(type)
  }
  const closeeditform = () => {
    setedit(false)
  }
  const clearform = () => {
    setclearaddform(true)
  }
  const makeform = (fmtype) => {
    return <cf.AddForm submit={submit} fmtype={fmtype} closeaddform={closeaddform} clearaddform={clearform} animated='animated fadeIn' cboc='' cbou=''/>;
  }

  return (
    <s.Container fluid className="main-content-container px-4 pb-4 pt-4">
      <s.Row>
      {console.log(contentmenu)}
      <div className="menu-container">{ makesubmenus() }</div>
        <s.Col lg="12" md="12">
          { fmtype && showaddform && makeform(fmtype) }
          {/* table && maketable() */}
          { notify && msg && <c.Notification place='tr' type='danger' msg={msg} time='7'/>}
          { loading ? <><s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={loading} /></> : makecontent(contentmenu)}
        </s.Col>
      </s.Row>
    </s.Container>
  );
}


export default Asset;
