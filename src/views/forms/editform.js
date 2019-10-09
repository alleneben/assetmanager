import React, { useState} from 'react'

import * as s from '../../shardslib';
import * as c from '../../components';

import utils from '../../appstate/utils';
import api from  '../../appstate/api';

let form;
function EditForm({item,submit,fmtype,closeeditform,animated,cboc,cbou,flds}) {

  const [val, setvalue]=useState(flds);
  const [sdt, setdat] = useState(undefined);
  const [selectedoption,setselectedoption] = useState(null);


  const handlesubmit = (f,s,a) => {
    // val.sdtt = !!val.sdtt ? val['sdtt'].toString() : ''
    submit({val:val,sdt:sdt,form:form.props.children,f:f,s:s,a:a})
  }


  const onChange = (e) =>  {
    setvalue({...val,[e.target.name]: e.target.value })
  }
  const onDateChange = (value) =>{
    var dt = new Date(value);
    setvalue({...val,['sdtt']: value})
  }

  const onSelectChange = (e) => {
    setvalue({...val, [e.nam]: e.value});
  }

  const closeform = () => {
    closeeditform(true)
  }


  const makeform = (fmtype) => {
    var content = fmtype === 'edit asset' ?
    <>
      <c.InputField id="rid" hidden={true} md="12" type='text' name="ridn" value={val.ridn} onChange={onChange} formtype='edit'/>
      <c.InputField id="AssetName" t='t' md="6" label="Asset Name" placeholder="Asset Name" type='text' name="namt" value={val.namt} onChange={onChange} formtype='edit'/>
      <c.InputField id="ModelNo" md="3" label="Model No" placeholder="Model No" type='text' name="mnot" value={val.mnot} onChange={onChange} formtype='edit'/>
      <c.InputField id="Cost" md="3" label="Cost" placeholder="Cost" type='number' name="prcn" value={val.prcn} onChange={onChange} formtype='edit'/>
      <c.InputField id="Warranty" md="3" label="Warranty" placeholder="Warranty" type='number' name="warn" value={val.warn} onChange={onChange} formtype='edit'/>
      <c.InputField id="UsefulLife" md="3" label="Useful Life" placeholder="Useful Life" type='number' name="usfn" value={val.usfn} onChange={onChange} formtype='edit'/>
      <c.InputField id="ScrapValue" md="3" label="Scrap Value" placeholder="Scrap Value" type='number' name="scpn" value={val.scpn} onChange={onChange} formtype='edit'/>
      <c.SelectField id="Category" md="3" label="Category" name="cidn" value={val.cidn}   onChange={onSelectChange} options={cboc}  />
      <c.InputArea id="Description" md="12" row="3" label="Description" placeholder="Description" type='text' name="dsct" value={val.dsct || ''} onChange={onChange} />
      <div><s.Button theme="danger" onClick={closeform}>Discard</s.Button> &nbsp;&nbsp;&nbsp;  <s.Button onClick={() => handlesubmit('sp_asset_edit','ed','edit')}>Update Product</s.Button></div>
    </>
    :
    <>
      <c.InputField id="feUsername" md="12" label="Name" placeholder="Name" type='text' name="nam" value={val.nam} onChange={onChange} />
    </>

    return content;
  }

  return(
    <React.Fragment>
      <s.ListGroup flush>
        <s.ListGroupItem className="p-3">
          <s.Row>
            <s.Col>
              { /*progress && <c.ProgressBar theme="success" value={progressvalue}/>*/}
              <s.Form >
              <h5>{fmtype.toUpperCase()}</h5>
                <s.Row form>
                  { form = makeform(fmtype) }
                </s.Row>
                {/*<br/>
                <s.Button theme="danger" onClick={closeform}>Discard</s.Button> &nbsp;&nbsp;&nbsp;  <s.Button onClick={handlesubmit}>Update Product</s.Button>*/}
              </s.Form>
            </s.Col>
          </s.Row>
        </s.ListGroupItem>
      </s.ListGroup>
    </React.Fragment>
  );
}


export default EditForm;
