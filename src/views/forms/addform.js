import React, { useState} from 'react'

import * as s from '../../shardslib';
import * as c from '../../components';

import utils from '../../appstate/utils';
import api from  '../../appstate/api';

let form;
function AddForm({submit,fmtype,closeaddform,clearaddform,animated,cboc,cbou}) {

  const [val, setvalue]=useState({});
  const [sdt, setdat] = useState(undefined);
  const [selectedoption,setselectedoption] = useState(null);

  const handlesubmit = (f,s,a) => {
    // val.sdtt = !!val.sdtt ? val['sdtt'].toString() : '';
    submit({val:val,sdt:sdt,form:form.props.children,f:f,s:s,a:a});
  }


  const onChange = (e)=>  setvalue({...val, [e.target.name]: e.target.value})

  const onDateChange = (value) =>{
    var dt = new Date(value);
    setvalue({...val,['sdtt']: value})
  }

  const onSelectChange = (e) => {
    setvalue({...val, [e.nam]: e.value});
  }

  const closeform = () => {
    closeaddform(true)
  }

  const clearform = () => {
    setvalue({})
  }

  const makeform = (fmtype) => {
    var content = fmtype === 'asset' ?
    <>
      <c.InputField id="AssetName" t='t' md="6" label="Asset Name" placeholder="Asset Name" type='text' name="namt" value={val.namt || ''} onChange={onChange} formtype='add'/>
      <c.InputField id="ModelNo" md="3" label="Model No" placeholder="Model No" type='text' name="mnot" value={val.mnot || ''} onChange={onChange} formtype='add'/>
      <c.InputField id="Cost" md="3" label="Cost" placeholder="Cost" type='number' name="prcn" value={val.prcn || ''} onChange={onChange} formtype='add'/>
      <c.DateField  id="DatePurchased" md="3" label="Date Purchased" placeholder="Date Purchased" name="sdtt" value={val.sdtt || ''} onChange={onDateChange}/>
      <c.InputField id="Warranty" md="3" label="Warranty" placeholder="Warranty" type='number' name="warn" value={val.warn || ''} onChange={onChange} formtype='add'/>
      <c.InputField id="UsefulLife" md="3" label="Useful Life" placeholder="Useful Life" type='number' name="usfn" value={val.usfn || ''} onChange={onChange} formtype='add'/>
      <c.SelectField id="Category" md="3" label="Category" name="cidn" value={val.cidn || ''}   onChange={onSelectChange} options={cboc}  />
      <c.InputArea id="Description" md="12" row="3" label="Description" placeholder="Description" type='text' name="dsct" value={val.dsct || ''} onChange={onChange}/>
      <div><s.Button theme="danger" onClick={clearform}>Clear</s.Button> &nbsp;&nbsp;&nbsp;  <s.Button theme="danger" onClick={closeform}>Discard</s.Button> &nbsp;&nbsp;&nbsp;  <s.Button onClick={() => handlesubmit('sp_asset_add','ad','add')}>Save</s.Button></div>
    </>
    :
    <>
      <c.InputField id="feUsername" md="12" label="Name" placeholder="Name" type='text' name="nam" value={val.nam || ''} onChange={onChange} />
    </>

    return content;
  }

  return(
    <React.Fragment>
      <s.ListGroup flush>
        <s.ListGroupItem className={animated}>
          <s.Row>
            <s.Col>
              <s.Form >
              <h5>{fmtype.toUpperCase()}</h5>
                <s.Row form>
                  { form = makeform(fmtype) }
                </s.Row>
                {/*<br/>
                <s.Button theme="danger" onClick={clearform}>Clear</s.Button> &nbsp;&nbsp;&nbsp;  <s.Button theme="danger" onClick={closeform}>Discard</s.Button> &nbsp;&nbsp;&nbsp;  <s.Button onClick={handlesubmit}>Save</s.Button>*/}
              </s.Form>
            </s.Col>
          </s.Row>
        </s.ListGroupItem>
      </s.ListGroup>
    </React.Fragment>
  );
}


export default AddForm;
