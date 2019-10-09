import React, { useState, useContext, useEffect } from "react";

import * as s from "../../shardslib";
import * as c from '../../components'

import { AppContext } from '../../appstate/appcontext'
import utils from '../../appstate/utils';
import * as a from '../../components/appspecific'

const Detail = (props) => {
  const { state, dispatch } = useContext(AppContext)
  const { data,id } = props.location

  //data
  const [tdata,settdata] = useState([])
  const [cdata,setcdata] = useState(null)
  const [name, setname] = useState('')
  // utilities
  const [notify, setnotify] = useState(null)
  const [msg, setmsg] = useState(null)
  const [place, setplace] = useState(null)
  const [theme, settheme] = useState('')
  const [loading, setloading] = useState(false);

  useEffect(() => {
    setloading(true)
    utils.utilfxns.fetchdata(id,'transfer','','').then(rd => {
      var out = rd;
      if (out.success) {
        settdata(rd.sd)
        setloading(false)
      } else {
        setnotify(true)
        settheme('danger')
        setmsg(out.em)
        setloading(false)
      }
    },err => {
      setnotify(true)
      settheme('danger')
      setmsg('Failed to Fetch Asset Data')
      setloading(false)
    })
    return () => {
      console.log('bye');
    };
  },[])

  const submit = (name,searchterm,svc,pos,plm) => {
    setloading(true)
    var searchterm = {id:id}
    utils.utilfxns.fetchdata(searchterm,svc,pos,plm).then(rd => {
      var out = rd;
      if(out.success){
        setcdata(rd.sd)
        setloading(false)
        setname(name)

      } else {
        setnotify(true)
        settheme('danger')
        setmsg(out.em)
        setloading(false)
      }
    })
  }

  const makechildren = () => {
    return  <s.ListGroup flush>
          <s.ListGroupItem className="p-3">
            <c.CustomSpan title='Name' value={data.nam} />
            <c.CustomSpan title='Code' value={data.shc} />
            <c.CustomSpan title='Category' value={data.ctn} />
            <c.CustomSpan title='Department' value={data.dpn} />
            <c.CustomSpan title='Location' value={data.loc} />
            <c.CustomSpan title='Region' value={data.rnm} />
            <c.CustomSpan title='Status' value={data.stn} />
            <c.CustomSpan title='Value' value={'GHC '+(data.avl * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} />
            <c.CustomSpan title='Useful-life' value={data.usf + ' Year(s)'} />
            <c.CustomSpan title='Scrap Value' value={'GHC '+(data.scp * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}/>
            <c.CustomSpan title='Waranty' value={data.war + ' Month(s)'} />
            <c.CustomSpan title='Date Purchased' value={data.dcd} />
            <c.CustomSpan title='Year' value={data.ypr} />
          </s.ListGroupItem>
      </s.ListGroup>
  }
const makecompute = () => {
  if(loading) return <s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={loading} />;
  // const compute = cdata.length > 0 ? <c.CustomCard clsnm='animated fadeIn' title={'Dep Values ' + data.usf +' years'} children={  cdata.map((dd,key) => {
  //   return <div key={key}>{key+1} &nbsp;&nbsp;&nbsp; GHC {(dd.crdb * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</div>;
  // }) }/> : ''
  var d = new Date(), cyear = d.getFullYear(), ypr= data ? cyear - parseInt(data.ypr) : '';
  const compute = cdata  ? <c.CustomCard clsnm='animated fadeIn' title={'Net Value after ' + ypr +' year(s)'} footer={name} children={ 'GHC '+ (cdata.sp_straight_new_find ? cdata.sp_straight_new_find * 1 : cdata.sp_reducingbalance_new_find * 1).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} /> : '';
  return compute;
}

  const maketransfer = () => {
    // if(loading) return <s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={loading} />;
     const transfer = tdata.length > 0 ? tdata.map((transfer, idx) => {
        return <div key={idx} className="blog-comments__item d-flex p-3">
          <div className="blog-comments__content">
            <div className="blog-comments__meta text-mutes">
              <a className="text-secondary">
                Transfered from {transfer.tlo}
              </a>{" "}
              to {" "}
              <a className="text-secondary" >
                {transfer.tlc}
              </a>
            </div>
            <p className="m-0 my-1 mb-2 text-muted">{transfer.tdt}</p>
          </div>
        </div>
      }) : 'There are no transfers at the moment';

      return transfer;
  }
  return (
    <s.Container fluid className="main-content-container px-4 pb-4">
    {/* Page Header */}

    <s.Row noGutters className="page-header py-4">
    </s.Row>

    <s.Row>
      {/* Editor */}
      <s.Col lg="5" md="12">
        {data && <c.CustomCard clsnm='animated fadeIn' title={ data.nam} children={ makechildren() }/>}
      </s.Col>

      <s.Col lg="4" md="12">
        {data && <c.CustomCard clsnm='animated fadeIn' title='Transfers' children={  maketransfer() }/>}
      </s.Col>

      {/* Sidebar Widgets */}
      <s.Col lg="3" md="12">
        <a.AssetActions clsnm='mb-3 animated lightSpeedIn' placeholder="Savage Value" submit={submit} data={data}/>
        { makecompute() }
      </s.Col>
    </s.Row>
  </s.Container>
  );
}
export default Detail;
