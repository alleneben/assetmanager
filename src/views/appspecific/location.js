
import React, {useContext, useState,useEffect, useRef} from 'react';
import { Link } from 'react-router-dom';

import api from '../../appstate/api';
import utils from '../../appstate/utils';
import { AppContext } from '../../appstate/appcontext';

import * as s from '../../shardslib';
import * as c from '../../components';




function Location(props) {
  const [loading, setloading] = useState(false)
  const [data, setdata] = useState([])
  const [pos, setpos] = useState(0);
  const [plm, setplm] = useState(10);


  const { state, dispatch } = useContext(AppContext)

  useEffect(() => {
    setloading(true)
    // datasubmit('','location',props.match.params.id)
    utils.utilfxns.fetchdata(props.match.params.id,'location',null,null).then(rd => {
      var out = rd;
      if(out.success){
        setdata(rd.sd)
        setloading(false)
      } else {

      }

    },err => {
      // console.log(err);
    })

    return () => {
      console.log('bye');
    };
  },[])

  const makesubmenus = () => {
    //console.log(state);
    if (!!!state.auhmn.text) return;
    return ''
  }

  const makecontent = () => {
    var link = '/regions/'+props.match.params.id;
    if(loading ) return <>fetching data....</>
    var locations = data.map((location,key) => {
      return <s.Col md='3'className='animated fadeIn regioncard' key={key}><c.RegionCard name={location.nam} rct={location.lct} link={link+'/locations/'+location.rid+'/assets'}/></s.Col>
    })
    return <s.Row>{ locations } </s.Row>;
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


export default Location;
