
import React, {useContext, useState,useEffect, useRef} from 'react';

import api from '../../appstate/api';
import utils from '../../appstate/utils';
import { AppContext } from '../../appstate/appcontext';

import * as s from '../../shardslib';
import * as c from '../../components';




function Region(props) {
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState([])
  const [pos, setpos] = useState(0);
  const [plm, setplm] = useState(10);


  const { state, dispatch } = useContext(AppContext)


  useEffect(() => {
    setloading(true)
    utils.utilfxns.fetchdata('','region',pos,plm).then(rd => {
      var out = rd;
      if(out.success){
        setdata(rd.sd)
        setloading(false)
      } else {
        // setmsg(out.em)
        setloading(false)
      }
    },err => {
      console.log(err);
    })

    return () => {
      console.log('bye');
    };
  },[])

  const route = (searchterm,svc,id) => {
    dispatch({type:'ID',payload:id})
    //props.history.push('/home/Regions/'+svc)
  }

  const makecontent = () => {
    var link = '/regions/';
    if(loading ) return <>fetching data.... <c.Notification theme='danger' msg='Slow Connection' time='7'/></>
    var regions = data.map((region,key) => {

      return <s.Col md='3' className='animated fadeIn regioncard' key={key}><c.RegionCard name={region.nam} rct={region.rct} link={link+region.rid+'/locations'}/></s.Col>
    })
    return <s.Row >{regions}</s.Row>;
  }
  const makesubmenus = () => {
    //console.log(state);
    if (!!!state.auhmn.text) return;
    return ''
  }

  const createfn = () => {
    console.log('create');
  }

  return (
    <s.Container fluid className="main-content-container px-4 pb-4 pt-4">
      <s.Row>
      <div className="menu-container">{ makesubmenus() }</div>
        <s.Col lg="12" md="12">
          { loading ? <><s.Spinner size={50} spinnerColor={"#333"} spinnerWidth={2} visible={loading} /></> : makecontent()  }
        </s.Col>
      </s.Row>
    </s.Container>
  );
}


export default Region;
